import {BaseResponse} from "./BaseResponse";

export interface MoveShipRequest {
    user_id: string
    game_id: string
    old_ship_index: number
    new_ship_index: number
}

export interface MoveShipResponse extends BaseResponse {
}