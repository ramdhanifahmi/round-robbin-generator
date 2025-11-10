export type Player = { id: string; name: string }
export type Match = {
  id: string
  round: number
  court?: number | string
  teamA: [string, string]
  teamB: [string, string]
  sets: { a: number; b: number }[]
}
export type ConfigWeights = {
  WIN_BONUS: number
  SET_WON_WEIGHT: number
  POINT_DIFF_WEIGHT: number
  RUBBER_WIN_BONUS: number
  STRAIGHT_WIN_BONUS: number
  LOSS_PARTICIPATION: number
}
export type StatRow = {
  playerId: string
  name: string
  MP: number
  W: number
  L: number
  SW: number
  SL: number
  PW: number
  PL: number
  PD: number
  RW: number
  STW: number
  score: number
}
