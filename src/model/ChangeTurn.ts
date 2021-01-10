import {BaseResponse} from "./BaseResponse";

export interface ChangeTurnRequest {
    user_id: string
    game_id: string
}

export interface ChangeTurnResponse extends BaseResponse {
}