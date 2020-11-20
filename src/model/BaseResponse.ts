export class BaseResponse {
    ok: boolean = true;
    error?: Error
}

export class Error {
    error_code?: number;
    error_message?: string;
}