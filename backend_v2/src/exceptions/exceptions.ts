export class NotFoundError extends Error {
    readonly status: number = 404;
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}