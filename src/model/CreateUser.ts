import {BaseResponse} from "./BaseResponse";

export class CreateUserRequest {
    name?: string;
    mobile?: string;
}

export class CreateUserResponse extends BaseResponse {
    id?: string
}