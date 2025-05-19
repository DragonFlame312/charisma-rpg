export type PlayerStats = {
  endurance: number;
  intellect: number;
  charisma: number;
  level: number;
  xp: number;
};

export type PlayerDerived = {
  hp: number;
  defense: number;
};

export class Player {
  stats: PlayerStats;
  constructor(stats?: Partial<PlayerStats>) {
    this.stats = {
      endurance: stats?.endurance ?? 10,
      intellect: stats?.intellect ?? 10,
      charisma: stats?.charisma ?? 10,
      level: stats?.level ?? 1,
      xp: stats?.xp ?? 0,
    };
  }
  get hp(): number {
    return 100 + this.stats.endurance * 0.5;
  }
  get defense(): number {
    return this.stats.endurance * 0.4;
  }
  get charismaBonus(): number {
    return this.stats.charisma * 0.001;
  }
  // Прочие вычисления ауры, доверия, и т.д. — позже
}
