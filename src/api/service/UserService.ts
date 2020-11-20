import {CreateUserRequest, CreateUserResponse} from "../../model/CreateUser";
import {Config} from "../../config/config";

export class UserService {

    public static createUser(request:CreateUserRequest): Promise<CreateUserResponse> {
        return fetch(Config.restUrl + "/user", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response => {
            if (response.ok) {
                return response.json().then(res => {
                    res.ok = true
                    return res
                });
            } else {
                return {
                    ok: false,
                    error: {
                        error_code: response.status,
                        error_message: response.statusText
                    }
                } as CreateUserResponse
            }
        }).catch(reason => ({
            ok: false,
            error: {
                error_code: -1,
                error_message: reason.message,
            }
        } as CreateUserResponse));

    }
}