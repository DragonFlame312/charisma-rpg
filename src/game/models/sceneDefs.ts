export type GameAction = {
  label: string;
  onClick: () => void;
};

export type SceneDef = {
  key: string;
  name: string;
  background: string; // ссылка на изображение
  npcSprite: string; // ссылка на изображение перcонажа
  npcBubble?: string; // фраза NPC (bubble)
  actions: GameAction[];
};

export const scenes: Record<string, SceneDef> = {
  bedroom: {
    key: 'bedroom',
    name: 'Спальня',
    background: '/public/bg-bedroom.jpg', // заменить на путь после скачивания
    npcSprite: '/public/girl-npc.png', // заменить на путь после скачивания
    npcBubble: 'Привет, солнышко. Тяжёлый был день?',
    actions: [] // заполним позже контекстно
  },
  kitchen: {
    key: 'kitchen',
    name: 'Кухня',
    background: '/public/bg-kitchen.jpg',
    npcSprite: '/public/girl-npc.png',
    npcBubble: 'Доброе утро! Завтракать будем вместе?',
    actions: []
  }
};
