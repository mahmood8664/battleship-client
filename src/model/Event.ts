export class RawEvent {
    event_type!: EventType;
    payload!: string;
}

export enum EventType {
    ///External Events
    OTHER_SIDE_CONNECT = 1,
    GAME_START = 2,
    ///Internal Events
    SOCKET_CONNECT = 1000,
    SOCKET_DISCONNECT = 1001
}

export class Event {
    constructor(eventType: EventType, object: any) {
        this.eventType = eventType;
        this.object = object;
    }

    eventType!: EventType;
    object!: any;
}

export class SocketConnect {
    game_id!: string
    user_id!: string
}

export class GameStart {
    game_id!: string
}