import { Character } from './game/models/Character';
import { StatsPanel } from './ui/StatsPanel';
import { ActionsPanel } from './ui/ActionsPanel';
import './styles/theme.css';
import './styles/ui.css';

// Импортируем MainScene из вашего игрового движка
import { MainScene } from './game/scenes/MainScene';

// Импортируем определения сцен и типов действий
import { scenes, SceneDef } from './game/sceneDefs';
import { GameAction } from './ui/ActionsPanel';

let char = Character.load();
let statsPanel: StatsPanel | null = null;
let actionsPanel: ActionsPanel | null = null;

// Управление сценой
let currentSceneKey: keyof typeof scenes = 'bedroom';

function switchScene(key: keyof typeof scenes) {
  currentSceneKey = key;
  renderActions();
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

// Инициализация Phaser
const canvasDiv = document.getElementById('game-canvas')!;
canvasDiv.innerHTML = '';
const width = canvasDiv.clientWidth || 600;
const height = 430;

const phaserGame = new Phaser.Game({
  type: Phaser.AUTO,
  width,
  height,
  backgroundColor: '#181d38',
  parent: 'game-canvas',
  scene: [MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width,
    height
  },
  physics: { default: 'arcade', arcade: { debug: false } },
  transparent: false
});
