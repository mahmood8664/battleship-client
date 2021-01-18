import {BaseResponse} from "./BaseResponse";

export interface RevealEnemyFieldsRequest {
    user_id: string;
    game_id: string;
    index: number;
}

export interface RevealEnemyFieldsResponse extends BaseResponse {
    revealed_ship_indexes?: number[];
}