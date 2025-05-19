export class Character {
  lvl: number = 1;
  xp: number = 0;
  endurance: number = 10;
  int: number = 10;
  cha: number = 10;

  constructor() {
    this.lvl = 1;
    this.xp = 0;
    this.endurance = 10;
    this.int = 10;
    this.cha = 10;
  }
  // Максимальное здоровье вычисляется как 100 + выносливость * 0.5
  get maxHp() { return 100 + Math.floor(this.endurance * 0.5); }
  // Максимальная защита
  get maxDef() { return Math.floor(this.endurance * 0.4); }
  // Текущее условное здоровье и защита (демо)
  hp: number = this.maxHp;
  def: number = this.maxDef;

  // Добавить XP, автоуровень
  addXp(amount: number) {
    this.xp += amount;
    if (this.xp >= this.xpToNext()) {
      this.levelUp();
    }
  }

  // Сколько нужно XP до следующего уровня
  xpToNext() { return Math.floor(20 + this.lvl * 30); }
  // Повышение уровня
  levelUp() {
    this.lvl += 1;
    this.xp = 0;
    this.endurance += 2;
    this.int += 2;
    this.cha += 5;
    this.hp = this.maxHp;
    this.def = this.maxDef;
  }

  // Харизма — основной фокус, формулы для шансов и уникальных эффектов
  get charismaEffect() {
    return {
      successChance: this.cha * 0.001,
      trustModifier: this.cha * 0.05,
      aura: this.getCharismaAura(),
      milestones: Array.from({length: Math.floor(this.cha/100)}, (_,i)=>100*(i+1))
    }
  }
  private getCharismaAura() {
    if(this.cha >= 1000) return 'Все просьбы NPC выполняют без проверок';
    if(this.cha >= 500) return 'NPC предлагают бонусы';
    if(this.cha >= 100) return 'NPC сами инициируют диалоги';
    return null;
  }

  // Сохранить и загрузить из localStorage (базово)
  save() {
    localStorage.setItem('char-rpg-character', JSON.stringify(this));
  }
  static load(): Character {
    const data = localStorage.getItem('char-rpg-character');
    if (!data) return new Character();
    const parsed = JSON.parse(data);
    const ch = new Character();
    Object.assign(ch, parsed);
    return ch;
  }
}
