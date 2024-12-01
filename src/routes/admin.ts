import { Router } from 'express';
import { cacheService } from '../services/cache.service';
import { addValidatedRoute } from './utils/routes';

const router = Router();

addValidatedRoute(router, 'get', '/cache/status', 'Get cache status', {}, (req, res) => {
    const stats = cacheService.getStats();
    const keys = cacheService.getKeys();
    const memoryUsage = (() => {
        const m = process.memoryUsage();
        return {
            residentSetSize: (m.rss / 1000_000).toLocaleString() + ' Megabytes',
            heapTotal: (m.heapTotal / 1000_000).toLocaleString() + ' Megabytes',
            heapUsed: (m.heapUsed / 1000_000).toLocaleString() + ' Megabytes',
            external: (m.external / 1000_000).toLocaleString() + ' Megabytes',
            arrayBuffers: (m.arrayBuffers / 1000_000).toLocaleString() + ' Megabytes',
        };
    })();

    res.json({
        stats,
        totalNumKeys: keys.length,
        keys: keys.map(key => ({
            key,
            ttl: cacheService.getTtl(key),
        })),
        memoryUsage,
    });
});

addValidatedRoute(
    router,
    'delete',
    '/cache/keys/:key',
    'Delete a value from cache',
    {},
    (req, res) => {
        const numDeleted = cacheService.del(req.params.key);
        res.json({
            message:
                numDeleted > 0
                    ? `${numDeleted} ${numDeleted === 1 ? 'value' : 'values'} deleted`
                    : `Nothing to delete`,
        });
    },
);

addValidatedRoute(router, 'post', '/cache/flush', 'Clear cache', {}, (req, res) => {
    cacheService.flush();
    res.json({ message: 'Cache cleared' });
});

export default router;
