import {Config} from "../../config/config";
import {CreateGameRequest, CreateGameResponse} from "../../model/CreateGame";
import {JoinGameRequest, JoinGameResponse} from "../../model/JoinGame";
import {SubmitShipsLocationsRequest, SubmitShipsLocationsResponse} from "../../model/SubmitShipsLocaitons";
import {GetGameResponse} from "../../model/GetGame";

export class GameService {

    public static createGame(request: CreateGameRequest): Promise<CreateGameResponse> {
        return fetch(Config.restUrl + "/game", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            },
        }).then<CreateGameResponse>(response => {
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
        }).then<JoinGameResponse>(response => {
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

    public static getGame(): Promise<GetGameResponse> {
        let gameId = localStorage.getItem("game_id");
        let userId = localStorage.getItem("user_id");
        return fetch(Config.restUrl + "/game/" + gameId + "?user_id=" + userId, {
            method: "get",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
        }).then<GetGameResponse>(response => {
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
        } as GetGameResponse));
    }


    public static submitShipsLocations(request: SubmitShipsLocationsRequest): Promise<SubmitShipsLocationsResponse> {
        return fetch(Config.restUrl + "/game/submit-ships", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            },
        }).then<SubmitShipsLocationsResponse>(response => {
            if (response.ok) {
                return response.json();
            } else {
                return {
                    ok: false,
                    error: {
                        error_code: response.status,
                        error_message: response.statusText
                    }
                } as SubmitShipsLocationsResponse
            }
        }).catch(reason => ({
            ok: false,
            error: {
                error_code: -1,
                error_message: reason.message,
            }
        } as SubmitShipsLocationsResponse));
    }

}