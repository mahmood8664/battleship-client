import {BaseResponse} from "./BaseResponse";

export class CreateGameRequest {
    user_id?: string
}

export class CreateGameResponse extends BaseResponse{
    game_id?: string
}