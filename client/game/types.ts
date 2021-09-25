export interface CardInstance {
  key: CardKey
  // other relevant modifiers to show user
}

export type AsyncHandle<T> =
  | { status: 'not-connected' }
  | { status: 'connecting' }
  | { status: 'connected'; handle: T}

export type CardKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface Card {
	type: CardKey | -1
	basePower: number
	power: number
	id: string
	counters: number
	owner: number
	position: number
	effects: {id: number}[]
	sick: boolean
	spell: boolean
}

export type FighterSlot = Card | undefined
export type FighterArea = [FighterSlot, FighterSlot, FighterSlot, FighterSlot]
export interface Board {
  sentinal: FighterArea
  scourge: FighterArea
}
export interface Player {
	name: string
	id: number
	hand: Card[]
	life: number
	ready: boolean
}
export type Team = 1 | 2

interface TeamEnumMap {
  1: 'sentinal'
  2: 'scourge'
}

interface GameStatusMap {
  0: 'lobby'
  1: 'ready'
  2: 'playing'
  3: 'stop'
  4: 'sentinal-win'
  5: 'scourage-win'
  6: 'draw'
}

export interface GameState {
	board: Board
	player: Player
	deck: {
    cards: Card[]
  }
  team: Team
	enemyLife: number
	enemyDeckSize: number
	enemyHandSize: number
	currentTurn: number
	canDraw: boolean
	hasDrawn: boolean
	gameStatus: keyof GameStatusMap
  drawChoices: Card[]
}

export type GameAction =
  | { type: 'set-player-team'; team: Team}
  | { type: 'receive-cards'; cards: Card[]}
  | { type: 'update-state'; state: Omit<GameState, 'team' | 'drawChoices'> }
  | { type: 'play-card', handIndex: number }

export interface GameCommandAPI {
  readyPlayer: () => void
  startTurn: () => void
  endTurn: () => void
  getView: () => void
  startDraw: () => void
  commitDraw: (cardIndex: number) => void
  playCard: (handIndex: number, positionIndex: number) => void
  moveCard: (positionFrom: number, positionTo: number) => void
  attackCard: (positionFrom: number, positionTo: number) => void
}

export type GameHandle = GameState & GameCommandAPI

// TODO
export type GameCommandEnum = 'a' | 's'

export interface CommandVariantMap {
  // "state" commands
  s: 'b' | 's' | 'e' | 'g'
  // "action" commands
  a: 's' | 'd' | 'p' | 'm' | 'a'
}

export interface CommandVariantParamMap {
  s: Record<string, never>
  a: {
    s: never
    d: number
    p: [number, number]
    m: [number, number]
    a: [number, number]
  }
}

export interface GameCommand {
  player_id: Team
  type: GameCommandEnum
  cmd: string // "<Variant> <VariantParam1> <VariantParam2> ..."
}

type SelectionTarget = 'ally' | 'opponent'
type SelectionType = 'hand' | 'board' | 'draws'

export interface Selection {
  target: SelectionTarget
  type: SelectionType
  index: number
}
