import {Config} from "../../config/config";
import {CreateGameRequest, CreateGameResponse} from "../../model/CreateGame";
import {JoinGameRequest, JoinGameResponse} from "../../model/JoinGame";
import {SubmitShipsLocationsRequest, SubmitShipsLocationsResponse} from "../../model/SubmitShipsLocaitons";
import {GetGameResponse} from "../../model/GetGame";
import {ChangeTurnRequest, ChangeTurnResponse} from "../../model/ChangeTurn";
import {MoveShipRequest, MoveShipResponse} from "../../model/MoveShip";
import {RevealEnemyFieldsRequest, RevealEnemyFieldsResponse} from "../../model/RevealEnemyFields";
import {ExplodeRequest, ExplodeResponse} from "../../model/Explode";
import {Util} from "../../util/Util";

export enum ServerErrorCodes {
    SHIP_INVALID_MOVE,
    INVALID_GAME_STATUS,
    INVALID_SHIP_INDEX_VALUE,
    GAME_IS_FINISHED,
}

export class GameService {

    public static createGame(request: CreateGameRequest): Promise<CreateGameResponse> {
        return fetch(Config.restUrl + "/game", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache"
            },
        }).then(response => {
            return response.json();
        }).then(res => {
            if (res.ok && res.game) {
                res.game.state = Util.fillMaps(res.game.state);
            }
            return Promise.resolve(res);
        }).catch(reason => ({
            ok: false,
            error: {
                error_code: -1,
                error_message: reason.message,
            }
        }));

    }

    public static joinGame(request: JoinGameRequest): Promise<JoinGameResponse> {
        return fetch(Config.restUrl + "/game/join", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache"
            },
        }).then(response => {
            return response.json();
        }).then(res => {
            if (res.ok && res.game) {
                res.game.state = Util.fillMaps(res.game.state);
            }
            return Promise.resolve(res);
        }).catch(reason => ({
            ok: false,
            error: {
                error_code: -1,
                error_message: reason.message,
            }
        }));

    }

    public static getGame(): Promise<GetGameResponse> {
        let gameId = localStorage.getItem("game_id");
        let userId = localStorage.getItem("user_id");
        return fetch(Config.restUrl + "/game/" + gameId + "?user_id=" + userId + "&request_id=" + Math.floor(Math.random() * 999999999999), {
            method: "get",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache"
            },
        }).then(response => {
            return response.json();
        }).then(res => {
            if (res.ok && res.game) {
                res.game.state = Util.fillMaps(res.game.state);
            }
            return Promise.resolve(res);
        }).catch(reason => ({
            ok: false,
            error: {
                error_code: -1,
                error_message: reason.message,
            }
        }));
    }


    public static submitShipsLocations(request: SubmitShipsLocationsRequest): Promise<SubmitShipsLocationsResponse> {
        return fetch(Config.restUrl + "/game/submit-ships", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache"
            },
        }).then(response => {
            return response.json();
        }).catch(reason => ({
            ok: false,
            error: {
                error_code: -1,
                error_message: reason.message,
            }
        }));
    }

    public static changeTurn(request: ChangeTurnRequest): Promise<ChangeTurnResponse> {
        return fetch(Config.restUrl + "/game/change-turn", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache"
            },
        }).then<ChangeTurnResponse>(response => {
            return response.json();
        }).catch(reason => ({
            ok: false,
            error: {
                error_code: -1,
                error_message: reason.message,
            }
        }));
    }

    public static moveShip(request: MoveShipRequest): Promise<MoveShipResponse> {
        return fetch(Config.restUrl + "/game/move-ship", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache"
            },
        }).then(response => {
            return response.json();
        }).catch(reason => ({
            ok: false,
            error: {
                error_code: -1,
                error_message: reason.message,
            }
        }));
    }

    public static reveal(request: RevealEnemyFieldsRequest): Promise<RevealEnemyFieldsResponse> {
        return fetch(Config.restUrl + "/game/reveal", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache"
            },
        }).then(response => {
            return response.json();
        }).catch(reason => ({
            ok: false,
            error: {
                error_code: -1,
                error_message: reason.message,
            }
        }));
    }


    public static explode(request: ExplodeRequest): Promise<ExplodeResponse> {
        return fetch(Config.restUrl + "/game/explode", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache"
            },
        }).then(response => {
            return response.json();
        }).catch(reason => ({
            ok: false,
            error: {
                error_code: -1,
                error_message: reason.message,
            }
        }));
    }
}