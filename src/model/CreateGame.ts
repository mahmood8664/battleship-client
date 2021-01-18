import {BaseResponse} from "./BaseResponse";
import {Game} from "./Game";

export interface CreateGameRequest {
    user_id: string
    move_timeout: number
}

export interface CreateGameResponse extends BaseResponse {
    game?: Game
}