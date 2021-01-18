import {Game} from "./Game";

export interface RawEvent {
    event_type: EventType;
    payload: string;
}

export enum EventType {
    ///External Events
    OTHER_SIDE_CONNECT = "connect",
    GAME_START = "game_start",
    CHANGE_TURN = "change_turn",
    SHIP_MOVED = "ship_moved",
    REVEAL = "reveal",
    EXPLOSION = "explosion",
    END_GAME = "end_game",
    ///Internal Events
    INTERNAL_SOCKET_CONNECT = "internal_socket_connect",
    INTERNAL_SOCKET_RECONNECT = "internal_socket_reconnect",
    INTERNAL_SOCKET_DISCONNECT = "internal_socket_disconnect"
}

export interface Event {
    eventType: EventType;
    object: any;
}

export interface SocketConnectEvent {
    game_id: string;
    user_id: string;
}

export interface GameStartEvent {
    game: Game;
}

export interface ChangeTurnEvent {
    game_id: string;
}

export interface ShipMovedEvent {
    game_id: string;
    user_id: string;
    old_ship_index: number;
}

export interface RevealEvent {
    game_id: string;
    user_id: string;
    slots: number[];
    revealed_ships: number[];
}

export interface ExplosionEvent {
    game_id: string;
    user_id: string;
    index: number;
}

export interface EndGameEvent {
    game_id: string;
    winner_user_id: string;
}