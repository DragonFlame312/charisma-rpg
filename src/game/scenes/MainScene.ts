import Phaser from 'phaser';
import { scenes } from '../models/sceneDefs';

export class MainScene extends Phaser.Scene {
  currentSceneKey: string = 'bedroom'; // по-умолчанию

  constructor() {
    super('MainScene');
  }

  preload() {
    // Получаем нужную сцену
    const s = scenes[this.currentSceneKey];
    this.load.image('bg', s.background);
    this.load.image('npc_base', s.npcSprite);
    if (s.npcEmotion) {
      this.load.image('npc_emotion', `/public/npc/girl/emotions/${s.npcEmotion}.png`);
    }
  }

  create() {
    const s = scenes[this.currentSceneKey];
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // Фон
    this.add.image(w / 2, h / 2, 'bg').setOrigin(0.5).setDisplaySize(w, h);

    // NPC (базовое тело)
    this.add.image(w / 2, h * 0.7, 'npc_base').setOrigin(0.5).setScale(0.7);

    // Слой эмоции (если есть)
    if (s.npcEmotion) {
      this.add.image(w / 2, h * 0.7, 'npc_emotion').setOrigin(0.5).setScale(0.7);
    }
    // В будущем: для npcBodyParts повторить add.image по ключам
  }

  update() {
    // Место для анимаций, диалоговых окон поверх и проч.
  }
}
