export class DisciplineAlreadyRegisteredError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'DisciplineAlreadyRegistered';
        this.statusCode = 400;
    }
};

export class InvalidFieldError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'InvalidFieldError';
        this.statusCode = 400;
    }
};

export class NotFoundError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
};
