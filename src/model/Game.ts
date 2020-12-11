export interface Game {
    id: string;
    state: GameState;
    status: GameStatus;
    side_1_user: string;
    side_2_user: string;
    turn: number;
    move_timeout_sec: number;
    create_date: Date;
    winner_user: string;
}

export interface GameState {
    side_1_ground: Map<number, boolean>;
    side_1_ships: Map<number, boolean>;
    side_2_ground: Map<number, boolean>;
    side_2_ships: Map<number, boolean>;
}

export enum GameStatus {
    Init = "init",
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