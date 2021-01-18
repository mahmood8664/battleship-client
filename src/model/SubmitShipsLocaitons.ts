import {BaseResponse} from "./BaseResponse";
import {GameStatus} from "./Game";

export interface SubmitShipsLocationsRequest {
    game_id: string
    user_id: string
    ships_indexes: number[]

}

export interface SubmitShipsLocationsResponse extends BaseResponse {
    game_status?: GameStatus
}