import {BaseResponse} from "./BaseResponse";

export interface ExplodeRequest {
    user_id?: string;
    game_id?: string;
    index?: number;
}

export interface ExplodeResponse extends BaseResponse {
    has_ship?: boolean;
}