import type { RequestHandler } from 'express';
import type core from 'express-serve-static-core';
import config from '../../config';
import { UnauthorisedError } from '../../errors';

interface BearerTokenAuthenticationOptions {
    key: keyof (typeof config)['bearerTokens'];
}

function bearerTokenValid(authHeader: string, token: string) {
    const bearerPrefix = 'bearer ';
    const headerStart = authHeader.trim().toLowerCase().slice(0, bearerPrefix.length);

    if (headerStart !== bearerPrefix) {
        return false;
    }

    const actualToken = authHeader.trim().slice(bearerPrefix.length);
    return actualToken === token;
}

export const bearerTokenAuthenticationHandler = <
    P extends core.ParamsDictionary = core.ParamsDictionary,
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery extends core.Query = core.Query,
>(
    options: BearerTokenAuthenticationOptions,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');
        if (authHeader && bearerTokenValid(authHeader, config.bearerTokens[options.key])) {
            next();
        } else {
            next(new UnauthorisedError('Admins only!'));
        }
    };
};
