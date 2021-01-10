export interface BaseResponse {
    ok: boolean;
    error: Error
}

export interface Error {
    error_code: number;
    error_message: string;
}