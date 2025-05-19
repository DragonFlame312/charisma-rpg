import { Character } from '../game/models/Character';

export class ActionsPanel {
  private container: HTMLElement;
  private char: Character;
  private updateStats: () => void;
  private debugOpened: boolean = false;

  constructor(container: HTMLElement, char: Character, updateStats: () => void) {
    this.container = container;
    this.char = char;
    this.updateStats = updateStats;
    this.render();
  }

  render(gameActions: { label: string; onClick: () => void }[] = []) {
    this.container.innerHTML = `
      <h3 style="margin-bottom:24px;">Действия</h3>
      <div class="actions-list" id="game-actions-list">
        ${
          gameActions.length > 0
            ? gameActions
                .map(
                  action =>
                    `<button class="action-btn" data-id="action-main">${action.label}</button>`
                )
                .join('')
            : '<span style="opacity:.65;font-size:.98em;">Нет доступных действий...</span>'
        }
      </div>
      <div class="debug-menu-wrap">
        <button class="debug-btn" id="debug-toggle">Debug ▾</button>
        <div class="debug-actions-list" id="debug-actions-list" style="display:none;">
          <button class="debug-action-btn" id="btn-add-cha">+10 Харизмы</button>
          <button class="debug-action-btn" id="btn-add-xp">+20 XP</button>
          <button class="debug-action-btn" id="btn-levelup">Апнуть уровень</button>
        </div>
      </div>
    `;
    this.attachListeners(gameActions);
  }

  private attachListeners(gameActions: { label: string; onClick: () => void }[]) {
    // игровые действия
    const gameActionBtns = this.container.querySelectorAll('button[data-id="action-main"]');
    gameActionBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        gameActions[idx].onClick();
      });
    });
    // debug toggle
    const debugToggle = document.getElementById('debug-toggle');
    const debugList = document.getElementById('debug-actions-list');
    debugToggle?.addEventListener('click', () => {
      this.debugOpened = !this.debugOpened;
      if (debugList) debugList.style.display = this.debugOpened ? 'flex' : 'none';
    });
    // debug actions
    (document.getElementById('btn-add-cha'))?.addEventListener('click', () => {
      this.char.cha += 10;
      this.updateStats();
    });
    (document.getElementById('btn-add-xp'))?.addEventListener('click', () => {
      this.char.addXp(20);
      this.updateStats();
    });
    (document.getElementById('btn-levelup'))?.addEventListener('click', () => {
      this.char.levelUp();
      this.updateStats();
    });
  }
}
