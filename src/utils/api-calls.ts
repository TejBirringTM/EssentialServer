import axios from 'axios';
import { requestLogger, responseLogger, errorLogger } from 'axios-logger';
import rateLimit from 'axios-rate-limit';

interface CreateClientOptions extends axios.CreateAxiosDefaults {
    rateLimit?: {
        maxRequests: number;
        perMilliseconds: number;
    };
}

export const createApiClient = (config?: CreateClientOptions) => {
    let client = axios.create(config);

    if (config?.rateLimit) {
        client = rateLimit(client, {
            maxRequests: config.rateLimit.maxRequests,
            perMilliseconds: config.rateLimit.perMilliseconds,
        });
    }

    client.interceptors.request.use(requestLogger, errorLogger);
    client.interceptors.response.use(responseLogger, errorLogger);

    return client;
};
