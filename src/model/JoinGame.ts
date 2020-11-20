import {BaseResponse} from "./BaseResponse";
import {Game} from "./Game";

export class JoinGameRequest {
    user_id?: string
    game_id?: string
}

export class JoinGameResponse extends BaseResponse{
    game?: Game
}