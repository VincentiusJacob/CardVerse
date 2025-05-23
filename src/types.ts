// types.ts
export type CardData = {
  id: string;
  imageUrl: string;
  name: string;
  atk: number;
  health: number;
};

export type Position = {
  left: number;
  top: number;
};

export type SkillData = {
  id: string;
  name: string;
  description: string;
  effect: (state: GameState) => GameState;
};

export type Phase = "choose" | "main" | "battle" | "end";

export type PlayerState = {
  deck: CardData[];
  bench: CardData[];       // always up to 4
  active: CardData | null;
  hand: SkillData[];       // predetermined spells
  health: number;
};

export type GameState = {
  player: PlayerState;
  opponent: PlayerState;
  turn: "player" | "opponent";
  phase: Phase;
};

