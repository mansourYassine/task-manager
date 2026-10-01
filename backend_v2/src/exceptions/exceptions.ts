export abstract class BaseError extends Error {
    readonly status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = new.target.name;
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class ValidationError extends BaseError {
    readonly errors: {field: string, message: string}[];
    constructor(message: string, errors: {field: string, message: string}[]) {
        super(message, 400);
        this.errors = errors;
    }
}