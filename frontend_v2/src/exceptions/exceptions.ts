export abstract class BaseError extends Error {
    readonly status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = new.target.name;
    }
}

export class ApiError extends BaseError {
    readonly errors: { field: string, message: string}[] | undefined;
    constructor(status: number, message: string, errors?: { field: string, message: string}[]) {
        super(message, status);
        this.errors = errors;
    }
}