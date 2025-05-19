import { Character } from './game/models/Character';
import { StatsPanel } from './ui/StatsPanel';
import { ActionsPanel } from './ui/ActionsPanel';
import './styles/theme.css';
import './styles/ui.css';

// Импортируем MainScene из вашего игрового движка
import { MainScene } from './game/scenes/MainScene';

// Импортируем определения сцен и типов действий
import { scenes, SceneDef } from './game/models/sceneDefs';
import { GameAction } from './ui/ActionsPanel';

let char = Character.load();
let statsPanel: StatsPanel | null = null;
let actionsPanel: ActionsPanel | null = null;

// --- VARS for test UI ---
let currentSceneKey: keyof typeof scenes = (localStorage.getItem('testSceneKey') as keyof typeof scenes) || 'bedroom';
let currentEmotion: string = localStorage.getItem('testEmotion') || scenes[currentSceneKey]?.npcEmotion || 'happy';
let phaserGame: Phaser.Game | null = null;

function switchScene(key: keyof typeof scenes) {
  currentSceneKey = key;
  localStorage.setItem('testSceneKey', currentSceneKey);
  // при смене сцены берём дефолтную эмоцию из сцены
  currentEmotion = scenes[currentSceneKey]?.npcEmotion || 'happy';
  localStorage.setItem('testEmotion', currentEmotion);
  renderActions();
  startGameScene();
  // Здесь можно добавить отрисовку фона, NPC, bubble и т.д.
}

function updateStats() {
  statsPanel?.update();
}

function saveChar() {
  char.save();
  alert('Сохранено!');
}

function loadChar() {
  char = Character.load();
  reinitPanels();
  alert('Загружено!');
}

function resetChar() {
  localStorage.removeItem('char-rpg-character');
  char = new Character();
  reinitPanels();
  alert('Сброшено!');
}

function renderActions() {
  const scene: SceneDef = scenes[currentSceneKey];
  // Динамически формируем действия под сцену
  const actions: GameAction[] = [];

  // Переходы между комнатами (на основе sceneDefs)
  if (scene.exits) {
    for (const exit of scene.exits) {
      actions.push({
        label: exit.label,
        onClick: () => switchScene(exit.target as keyof typeof scenes)
      });
    }
  }

  // Контекстные действия сцены
  if (scene.actions) {
    for (const act of scene.actions) {
      actions.push({
        label: act.label,
        onClick: () => {
          if (typeof act.onClick === 'function') {
            act.onClick({ char, switchScene, updateStats });
          } else if (typeof act.onClick === 'string') {
            switchScene(act.onClick as keyof typeof scenes);
          }
        }
      });
    }
  }

  // Пример для совместимости с старым кодом (если sceneDefs не заполнены)
  if (actions.length === 0) {
    if (scene.key === 'bedroom') {
      actions.push({
        label: 'Идти на кухню',
        onClick: () => switchScene('kitchen')
      });
      actions.push({
        label: 'Спать',
        onClick: () => alert('Вы лёгли спать...')
      });
    } else if (scene.key === 'kitchen') {
      actions.push({
        label: 'Идти в спальню',
        onClick: () => switchScene('bedroom')
      });
      actions.push({
        label: 'Готовить еду',
        onClick: () => alert('Вы занимаетесь готовкой!')
      });
    }
  }

  actionsPanel?.render(actions);
}

function reinitPanels() {
  // statsPanel
  const statsElem = document.getElementById('stats-panel')!;
  statsElem.innerHTML = '';
  statsPanel = new StatsPanel(
    statsElem,
    char,
    saveChar,
    loadChar,
    resetChar
  );

  // actionsPanel
  const actionsElem = document.getElementById('actions-panel')!;
  actionsElem.innerHTML = '';
  actionsPanel = new ActionsPanel(
    actionsElem,
    char,
    updateStats
  );
  renderActions();
}

reinitPanels();

// --- PHASER GAME INIT/RESTART LOGIC ---

function startGameScene() {
  const container = document.getElementById('game-canvas');
  if (!container) return;
  container.innerHTML = '';
  if (phaserGame) {
    phaserGame.destroy(true);
    phaserGame = null;
  }
  // Патчим сцену с текущими настройками эмоции
  const sceneObj = { ...scenes[currentSceneKey], npcEmotion: currentEmotion };
  class PatchedScene extends MainScene {
    currentSceneKey = currentSceneKey;
    preload() {
      const s = sceneObj;
      this.load.image('bg', s.background);
      this.load.image('npc_base', s.npcSprite);
      if (s.npcEmotion) {
        this.load.image('npc_emotion', `/public/npc/girl/emotions/${s.npcEmotion}.png`);
      }
    }
    create() {
      const s = sceneObj;
      const w = this.cameras.main.width;
      const h = this.cameras.main.height;
      this.add.image(w / 2, h / 2, 'bg').setOrigin(0.5).setDisplaySize(w, h);
      this.add.image(w / 2, h * 0.7, 'npc_base').setOrigin(0.5).setScale(0.7);
      if (s.npcEmotion) {
        this.add.image(w / 2, h * 0.7, 'npc_emotion').setOrigin(0.5).setScale(0.7);
      }
    }
  }
  phaserGame = new (window as any).Phaser.Game({
    width: 700,
    height: 560,
    type: Phaser.AUTO,
    parent: 'game-canvas',
    scene: PatchedScene
  });
}
startGameScene();

// Методы для тестовых кнопок
(window as any).setTestScene = function(key: string) {
  if (scenes[key]) {
    currentSceneKey = key as keyof typeof scenes;
    localStorage.setItem('testSceneKey', currentSceneKey);
    currentEmotion = scenes[currentSceneKey]?.npcEmotion || 'happy';
    localStorage.setItem('testEmotion', currentEmotion);
    renderActions();
    startGameScene();
  }
};
(window as any).setTestEmotion = function(emotion: string) {
  currentEmotion = emotion;
  localStorage.setItem('testEmotion', currentEmotion);
  startGameScene();
};
