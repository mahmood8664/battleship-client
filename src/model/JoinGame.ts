import {BaseResponse} from "./BaseResponse";
import {Game} from "./Game";

export interface JoinGameRequest {
    user_id: string
    game_id: string
}

export interface JoinGameResponse extends BaseResponse {
    game: Game
}