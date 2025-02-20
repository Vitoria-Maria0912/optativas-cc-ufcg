export class UserAlreadyExistsError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'UserAlreadyExists';
        this.statusCode = 409;
    }
};

export class DisciplineAlreadyRegisteredError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'DisciplineAlreadyRegistered';
        this.statusCode = 409;
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

export class UserNotAuthorizedError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'UserNotAuthorizedError';
        this.statusCode = 403;
    }
};

export class ServerError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'ServerError';
        this.statusCode = 500;
    }
};

export class InvalidCredentialsError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'InvalidCredentialsError';
        this.statusCode = 400;
    }
};

export class AuthenticationError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 400;
    }
}
