import GameBoard from "./board";
import type { CardData } from "./types";
import type { SkillData } from "./types";
import type { GameState } from "./types";


export function initializeGame(
  playerDeck: CardData[],
  opponentDeck: CardData[],
  playerSkills: SkillData[],
  opponentSkills: SkillData[]
): GameState {
  function drawBench(deck: CardData[]): CardData[] {
    return deck.slice(0, 4);
  }

  const playerBench = drawBench(playerDeck);
  const opponentBench = drawBench(opponentDeck);

  return {
    player: {
      deck: playerDeck.slice(4),
      bench: playerBench,
      active: null,
      hand: playerSkills,
      health: 30,
    },
    opponent: {
      deck: opponentDeck.slice(4),
      bench: opponentBench,
      active: null,
      hand: opponentSkills,
      health: 30,
    },
    turn: Math.random() < 0.5 ? "player" : "opponent",
    phase: "choose",
  };
}

/**
 * Player selects a bench card to become active;
 * then draws a new bench card from deck to maintain 4.
 */
export function chooseActive(
  state: GameState,
  playerKey: "player" | "opponent",
  benchIndex: number
): GameState {
  const playerState = state[playerKey];
  const chosen = playerState.bench[benchIndex];
  if (!chosen) return state;

  // Remove chosen from bench
  const newBench = [...playerState.bench];
  newBench.splice(benchIndex, 1);

  // Draw new bench card if available
  let newDeck = [...playerState.deck];
  if (newDeck.length > 0) {
    const next = newDeck.shift()!;
    newBench.push(next);
  }

  return {
    ...state,
    [playerKey]: {
      ...playerState,
      bench: newBench,
      active: { ...chosen },
      deck: newDeck,
    },
    phase: "main",
  };
}

/**
 * Perform a skill/spell from player's hand.
 * Skills are predetermined and apply an effect to the GameState.
 */
export function playSkill(
  state: GameState,
  playerKey: "player" | "opponent",
  skillId: string
): GameState {
  const playerState = state[playerKey];
  const skill = playerState.hand.find(s => s.id === skillId);
  if (!skill) return state;

  // Apply skill effect
  const newState = skill.effect(state);

  // Remove used skill from hand
  const newHand = playerState.hand.filter(s => s.id !== skillId);

  return {
    ...newState,
    [playerKey]: {
      ...state[playerKey],
      hand: newHand,
    },
  };
}

/**
 * Battle phase: active attacker attacks active defender.
 */
export function battlePhase(
  state: GameState
): GameState {
  const attackerKey = state.turn;
  const defenderKey = attackerKey === "player" ? "opponent" : "player";
  const attacker = state[attackerKey].active;
  const defender = state[defenderKey].active;

  if (!attacker || !defender) return state;

  // Calculate damage
  const newDefenderHealth = Math.max(0, defender.health - attacker.atk);
  const updatedDefender: CardData = { ...defender, health: newDefenderHealth };

  // Update defender active
  const newState = {
    ...state,
    [defenderKey]: {
      ...state[defenderKey],
      active: updatedDefender,
    },
  };

  return {
    ...newState,
    phase: "end",
  };
}

/**
 * End phase: pass turn and reset to choose or main depending on active
 */
export function endPhase(state: GameState): GameState {
  const nextTurn = state.turn === "player" ? "opponent" : "player";
  // If next player has no active, go to choose phase, else main
  const nextPhase = state[nextTurn].active ? "main" : "choose";

  return {
    ...state,
    turn: nextTurn,
    phase: nextPhase,
  };
}
