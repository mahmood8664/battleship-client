import {BaseResponse} from "./BaseResponse";
import {GameStatus} from "./Game";

export class SubmitShipsLocationsRequest {
    public readonly game_id: string
    public readonly user_id: string
    public readonly ships_indexes: number[]

    constructor(game_id: string, user_id: string, ships_indexes: number[]) {
        this.game_id = game_id;
        this.user_id = user_id;
        this.ships_indexes = ships_indexes;
    }
}

export class SubmitShipsLocationsResponse extends BaseResponse {
    public game_status!: GameStatus
}