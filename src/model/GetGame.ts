import {BaseResponse} from "./BaseResponse";
import {Game} from "./Game";

export interface GetGameResponse extends BaseResponse{
    game: Game
}