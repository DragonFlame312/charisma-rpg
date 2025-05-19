import { Character } from '../game/models/Character';

export class StatsPanel {
  private container: HTMLElement;
  private char: Character;
  private onSave: () => void;
  private onLoad: () => void;
  private onReset: () => void;

  constructor(
    container: HTMLElement,
    char: Character,
    onSave: () => void,
    onLoad: () => void,
    onReset: () => void
  ) {
    this.container = container;
    this.char = char;
    this.onSave = onSave;
    this.onLoad = onLoad;
    this.onReset = onReset;
    this.render();
  }

  update() {
    this.render();
  }

  private render() {
    this.container.innerHTML = `
      <h2 style="margin-bottom:24px;">Персонаж</h2>
      <div class="stats-list">
        ${this.statRow('HP',        this.char.hp,    this.char.maxHp,    'stat-hp')}
        ${this.statRow('Защита',    this.char.def,   this.char.maxDef,   'stat-def')}
        ${this.statRow('Интеллект', this.char.int,   150,                'stat-int')}
        ${this.statRow('Харизма',   this.char.cha,   null,               'stat-cha')}
        ${this.statRow('Уровень',   this.char.lvl,   null,               'stat-lvl')}
      </div>
      <div class="stats-util-block">
        <button class="stats-util-btn" id="btn-stats-save">💾 Сохранить</button>
        <button class="stats-util-btn" id="btn-stats-load">📂 Загрузить</button>
        <button class="stats-util-btn" id="btn-stats-reset">🗑️ Сбросить</button>
      </div>
    `;
    this.attachUtilListeners();
  }

  private attachUtilListeners() {
    (document.getElementById('btn-stats-save'))?.addEventListener('click', this.onSave);
    (document.getElementById('btn-stats-load'))?.addEventListener('click', this.onLoad);
    (document.getElementById('btn-stats-reset'))?.addEventListener('click', this.onReset);
  }

  private statRow(name: string, value: number, max: number|null, barClass: string): string {
    let percent = max ? Math.min(value / max, 1) * 100 : 90;
    return `
    <div class="stat-row">
      <span class="stat-label">${name}</span>
      <span class="animated-value">${value}${max ? `<span style='opacity:.6;'>/${max}</span>` : ''}</span>
      <div class="stat-bar-bg"><div class="stat-bar-fill ${barClass}" style="width: ${percent}%;"></div></div>
    </div>
    `;
  }
}
