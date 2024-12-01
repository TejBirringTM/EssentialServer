export class ConfigError extends Error {
    constructor(
        message: string,
        public errors?: unknown,
    ) {
        super(message);
        this.name = 'ConfigError';
    }
}

export class ExternalServiceError extends Error {
    constructor(
        public serviceName: string,
        message: string,
        public status:
            | 502 // Bad Gateway i.e. invalid response from upstream server while acting as gateway or proxy (includes *this* server as gateway or proxy sending an invalid request)
            | 504 // Gateway Timeout i.e. timed out waiting for request from upstream server,
            | 422, // Unprocessable Entity i.e. the client (i.e. user of *this* server as gateway or proxy) sent an invalid request
        public errors?: unknown,
    ) {
        super(message);
        this.name = 'ExternalServiceError';
        this.message = `${serviceName}: ${message}`;
    }
}
