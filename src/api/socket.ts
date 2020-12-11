import {Config} from "../config/config";
import {Event, EventType, GameStart, RawEvent, SocketConnect} from "../model/Event";

export class Socket {

    private static _webSocket: WebSocket;
    private static subscribersToAllEvents: ((event: Event) => void) [] = []
    private static subscribersMap: Map<EventType, ((event: Event) => void) []> = new Map<EventType, ((event: Event) => void)[]>();

    static get webSocket(): WebSocket {
        return this._webSocket;
    }

    public static connect(gameId: string, userId: string): WebSocket {
        if (!Socket._webSocket || Socket._webSocket.readyState != WebSocket.OPEN) {
            Socket._webSocket = new WebSocket(Config.socketUrl + "?game_id=" + gameId + "&user_id=" + userId);
            Socket._webSocket.onopen = ev => {
                console.log("open socket");
                let raw = new RawEvent()
                raw.event_type = EventType.SOCKET_CONNECT
                raw.payload = ""
                Socket.publish(JSON.stringify(raw))
            };

            Socket._webSocket.onmessage = ev => {
                console.log("message:" + ev.data);
                Socket.publish(ev.data);
            };

            Socket._webSocket.onclose = ev => {
                console.log('Socket is closed. Reconnect will be attempted in 1 second.', ev.reason);
                let raw = new RawEvent()
                raw.event_type = EventType.SOCKET_DISCONNECT
                raw.payload = ""
                Socket.publish(JSON.stringify(raw))
                setTimeout(() => this.connect(gameId, userId), 1000);
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

    private static publish(message: string) {
        let rawEvent: RawEvent = JSON.parse(message)
        let event: Event
        switch (rawEvent.event_type) {
            case EventType.OTHER_SIDE_CONNECT:
                let socketConnect: SocketConnect = JSON.parse(rawEvent.payload);
                event = new Event(EventType.OTHER_SIDE_CONNECT, socketConnect);
                break;
            case EventType.GAME_START:
                let gameStart: GameStart = JSON.parse(rawEvent.payload);
                event = new Event(EventType.GAME_START, gameStart);
                break;
            case EventType.SOCKET_CONNECT:
                event = new Event(EventType.SOCKET_CONNECT, null)
                break;
            case EventType.SOCKET_DISCONNECT:
                event = new Event(EventType.SOCKET_DISCONNECT, null)
                break;

        }
        this.subscribersToAllEvents.forEach(sub => sub.call(this, event));
        this.subscribersMap.get(event?.eventType)?.forEach(sub => sub.call(this, event));

    }
}

