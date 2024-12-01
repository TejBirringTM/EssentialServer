import { Router } from 'express';
import { addValidatedRoute } from './utils/routes';
// import { cacheHandler } from '../middlewares/cache.middleware';

const router = Router();

addValidatedRoute(router, 'get', '/health', 'Get server health status', {}, (req, res) => {
    res.json({ status: 'ok' });
});

addValidatedRoute(router, 'get', '/my-ip', 'Get own (client) IP address', {}, (req, res) => {
    res.json({
        ip: req.ip,
    });
});

export default router;
