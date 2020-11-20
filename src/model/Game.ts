export interface Game {
    id: string
    state: GameState
    status: GameStatus
    side_1_user_id: string
    side_2_user_id: string
    turn: number
    last_move_time: Date
    move_timeout_sec: number
    create_date: Date
    winner: string
}

export interface GameState {
    side_1: Map<number, boolean>
    side_1_ships: Map<number, boolean>
    side_2: Map<number, boolean>
    side_2_ships: Map<number, boolean>
}

export enum GameStatus{
    Init = "init",
    Choose = "choose",
    Start = "start",
    Finished = "finished",
}
