import {BaseResponse} from "./BaseResponse";
import {Game} from "./Game";

export class CreateGameRequest {
    user_id?: string
    move_timeout?: number
}

export class CreateGameResponse extends BaseResponse {
    game?: Game
}