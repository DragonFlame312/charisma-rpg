export type GameAction = {
  label: string;
  onClick: () => void;
};

export type SceneDef = {
  key: string;
  name: string;
  background: string; // путь к фону
  npcSprite: string; // базовый спрайт NPC-девушки
  npcEmotion?: string; // ключ эмоции (happy, sad, embarrassed, shocked и др.)
  npcBodyParts?: { [part: string]: string }; // подмена частей тела по слоям (будущее)
  npcBubble?: string; // bubble-реплика
  actions: GameAction[];
};

export const scenes: Record<string, SceneDef> = {
  bedroom: {
    key: 'bedroom',
    name: 'Спальня',
    background: '/public/backgrounds/bedroom1.jpg',
    npcSprite: '/public/npc/girl/base.png',
    npcEmotion: 'happy', // по умолчанию
    npcBubble: 'Привет, солнышко. Тяжёлый был день?',
    actions: []
  },
  kitchen: {
    key: 'kitchen',
    name: 'Кухня',
    background: '/public/backgrounds/kitchen1.jpg',
    npcSprite: '/public/npc/girl/base.png',
    npcEmotion: 'sad', // пример другой эмоции
    npcBubble: 'Доброе утро! Завтракать будем вместе?',
    actions: []
  }
};
