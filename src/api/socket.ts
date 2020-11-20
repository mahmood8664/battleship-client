import {Config} from "../config/config";
import {Event, EventType, RawEvent, SocketConnect} from "../model/Event";

export class Socket {

    private static webSocket: WebSocket;
    private static subscribersToAllEvents: ((event: Event) => void) [] = []
    private static subscribersMap: Map<EventType, ((event: Event) => void) []> = new Map<EventType, ((event: Event) => void)[]>();

    public connect(gameId: string, userId: string) {
        if (!Socket.webSocket || Socket.webSocket.readyState != WebSocket.OPEN) {
            Socket.webSocket = new WebSocket(Config.socketUrl + "?game_id=" + gameId + "&user_id=" + userId);
            Socket.webSocket.onopen = ev => {
                console.log("open socket");
            };

            Socket.webSocket.onmessage = ev => {
                console.log("message:" + ev.data);
                Socket.publish(ev.data);
            };

            Socket.webSocket.onclose = ev => {
                console.log('Socket is closed. Reconnect will be attempted in 1 second.', ev.reason);
                setTimeout(() => this.connect(gameId, userId), 1000);
            };

            Socket.webSocket.onerror = err => {
                console.error('Socket encountered error: ', err, 'Closing socket');
                Socket.webSocket.close();
            };

        }
    }

    public static subscribe(eventType: EventType, func: { (event: Event): void }) {
        if (eventType) {
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

