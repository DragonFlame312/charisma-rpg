import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // Здесь могут быть ассеты, сейчас — абстракция
  }

  create() {
    // Базовый задник — градиент (методом graphics)
    const g = this.add.graphics();
    g.fillGradientStyle(0x181d38, 0x292350, 0x1b1833, 0x201a32, 1);
    g.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // Силуэт — круглый NPC, слегка прозрачный, для абстракции
    const cx = this.cameras.main.width / 2;
    const cy = this.cameras.main.height / 2 + 40;
    const radius = Math.min(cx, cy, 90);
    this.add.circle(cx, cy, radius, 0x444486, 0.60)
      .setStrokeStyle(6, 0xc151a0, 0.35);
    // "Голова"
    this.add.circle(cx, cy - radius - 36, radius * 0.48, 0x6666aa, 0.68);
  }

  update() {
    // Место для анимаций, диалоговых окон поверх и проч.
  }
}
