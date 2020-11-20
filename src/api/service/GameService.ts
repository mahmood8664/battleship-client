import {Config} from "../../config/config";
import {CreateGameRequest, CreateGameResponse} from "../../model/CreateGame";
import {JoinGameRequest, JoinGameResponse} from "../../model/JoinGame";

export class GameService {

    public static createGame(request: CreateGameRequest): Promise<CreateGameResponse> {
        return fetch(Config.restUrl + "/game", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return {
                    ok: false,
                    error: {
                        error_code: response.status,
                        error_message: response.statusText
                    }
                } as CreateGameResponse
            }
        }).catch(reason => ({
            ok: false,
            error: {
                error_code: -1,
                error_message: reason.message,
            }
        } as CreateGameResponse));

    }

    public static joinGame(request: JoinGameRequest): Promise<JoinGameResponse> {
        return fetch(Config.restUrl + "/game/join", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return {
                    ok: false,
                    error: {
                        error_code: response.status,
                        error_message: response.statusText
                    }
                } as JoinGameResponse
            }
        }).catch(reason => ({
            ok: false,
            error: {
                error_code: -1,
                error_message: reason.message,
            }
        } as JoinGameResponse));

    }
}