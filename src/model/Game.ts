export interface Game {
    id: string
    state: GameState
    status: GameStatus
    user_id: string
    your_turn: boolean
    other_side_joined: boolean
    move_timeout_sec: number
    create_date: Date
    winner_user: string
}

export interface GameState {
    own_ground: Map<number, boolean>;
    own_ships: Map<number, boolean>;
    enemy_ground: Map<number, boolean>;
    enemy_revealed_ships: Map<number, boolean>;
}

export enum GameStatus {
    Init = "init",
    Joined = "joined",
    Start = "start",
    Finished = "finished",
}

export enum GameEventType {
    JoinGame = "join_game",
    InitialShipsLocations = "initial_ship_location",
    MoveShip = "move_ship",
    DiscoverEnemyField = "discover_enemy_field",
    Explosion = "explosion",
    EmptyExplosion = "empty_explosion",
}


export interface GameEvent {
    type: GameEventType;
    initial_ships_locations: number[];
    move_ship_from: number;
    move_ship_to: number;
    discover_enemy: number[];
    explosion: number;
    empty_explosion: number;
    time: Date;
}