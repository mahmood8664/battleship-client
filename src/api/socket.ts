import {Config} from "../config/config";
import {
    ChangeTurnEvent,
    EndGameEvent,
    Event,
    EventType,
    ExplosionEvent,
    GameStartEvent,
    RawEvent,
    RevealEvent,
    ShipMovedEvent,
    SocketConnectEvent
} from "../model/SocketEvent";
import {Util} from "../util/Util";

export class Socket {

    private static _webSocket: WebSocket;
    private static subscribersToAllEvents: ((event: Event) => void) [] = []
    private static subscribersMap: Map<EventType, ((event: Event) => void) []> = new Map<EventType, ((event: Event) => void)[]>();

    static get webSocket(): WebSocket {
        return this._webSocket;
    }

    public static connect(gameId: string, userId: string): WebSocket {
        let close = false;
        if (!Socket._webSocket || Socket._webSocket.readyState != WebSocket.OPEN) {
            Socket._webSocket = new WebSocket(Config.socketUrl + "?game_id=" + gameId + "&user_id=" + userId);
            Socket._webSocket.onopen = () => {
                if (close) {
                    let raw: RawEvent = {
                        event_type: EventType.INTERNAL_SOCKET_RECONNECT,
                        payload: "",
                    };
                    Socket.publish(JSON.stringify(raw));
                }
                let raw: RawEvent = {
                    event_type: EventType.INTERNAL_SOCKET_CONNECT,
                    payload: "",
                };
                Socket.publish(JSON.stringify(raw));
                close = false;
            };

            Socket._webSocket.onmessage = ev => {
                Socket.publish(ev.data);
            };

            Socket._webSocket.onclose = () => {
                let raw: RawEvent = {
                    event_type: EventType.INTERNAL_SOCKET_DISCONNECT,
                    payload: "",
                };
                Socket.publish(JSON.stringify(raw));
                close = true;
                window.setTimeout(() => this.connect(gameId, userId), 1000);
            };

            Socket._webSocket.onerror = err => {
                console.error('Socket encountered error: ', err, 'Closing socket');
                Socket._webSocket.close();
            };
        }
        return Socket._webSocket;
    }

    public static subscribe(eventType: EventType | null, func: { (event: Event): void }) {
        if (eventType != null) {
            if (this.subscribersMap.get(eventType)) {
                this.subscribersMap.get(eventType)?.push(func);
            } else {
                this.subscribersMap.set(eventType, [func]);
            }
        } else {
            this.subscribersToAllEvents.push(func);
        }
    }

    public static unsubscribe(eventType: EventType, func: { (event: Event): void }) {
        if (this.subscribersMap.get(eventType) !== undefined) {
            let number = this.subscribersMap.get(eventType)!.indexOf(func);
            if (number >= 0) {
                delete this.subscribersMap.get(eventType)![number];
            }
        }
    }


    private static publish(message: string) {
        let rawEvent: RawEvent = JSON.parse(message);
        let event: Event;
        switch (rawEvent.event_type) {
            case EventType.OTHER_SIDE_CONNECT:
                let socketConnect: SocketConnectEvent = JSON.parse(rawEvent.payload);
                event = {eventType: rawEvent.event_type, object: socketConnect};
                break;
            case EventType.GAME_START:
                let gameStart: GameStartEvent = JSON.parse(rawEvent.payload);
                gameStart.game.state = Util.fillMaps(gameStart.game.state);
                event = {eventType: rawEvent.event_type, object: gameStart};
                break;
            case EventType.CHANGE_TURN:
                let changeTurn: ChangeTurnEvent = JSON.parse(rawEvent.payload);
                event = {eventType: rawEvent.event_type, object: changeTurn};
                break;
            case EventType.SHIP_MOVED:
                let shipMoved: ShipMovedEvent = JSON.parse(rawEvent.payload);
                event = {eventType: rawEvent.event_type, object: shipMoved};
                break;
            case EventType.REVEAL:
                let revealEvent: RevealEvent = JSON.parse(rawEvent.payload);
                event = {eventType: rawEvent.event_type, object: revealEvent};
                break;
            case EventType.EXPLOSION:
                let explosionEvent: ExplosionEvent = JSON.parse(rawEvent.payload);
                event = {eventType: rawEvent.event_type, object: explosionEvent};
                break;
            case EventType.END_GAME:
                let endGameEvent: EndGameEvent = JSON.parse(rawEvent.payload);
                event = {eventType: rawEvent.event_type, object: endGameEvent};
                break;
            case EventType.INTERNAL_SOCKET_CONNECT:
                event = {eventType: rawEvent.event_type, object: undefined};
                break;
            case EventType.INTERNAL_SOCKET_RECONNECT:
                event = {eventType: rawEvent.event_type, object: undefined};
                break;
            case EventType.INTERNAL_SOCKET_DISCONNECT:
                event = {eventType: rawEvent.event_type, object: undefined};
                break;

        }
        this.subscribersToAllEvents.forEach(sub => sub.call(this, event));
        this.subscribersMap.get(event?.eventType)?.forEach(sub => sub.call(this, event));

    }
}

