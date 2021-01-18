import {BaseResponse} from "./BaseResponse";

export interface CreateUserRequest {
    name: string;
    mobile?: string;
}

export interface CreateUserResponse extends BaseResponse {
    id?: string
}