const Redis = require('ioredis');
const logger = require('./logger');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redis = null;
let isRedisAvailable = false;

try {
    redis = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times > 3) {
                logger.warn('Redis connection retries exhausted. Caching disabled.');
                return null;
            }
            return Math.min(times * 50, 2000);
        }
    });

    redis.on('connect', () => {
        logger.info('Redis connection established');
        isRedisAvailable = true;
    });

    redis.on('error', (err) => {
        logger.error(`Redis connection error: ${err.message}`);
        isRedisAvailable = false;
    });

} catch (error) {
    logger.error('Failed to initialize Redis client:', error);
}

/**
 * Get value from cache
 * @param {string} key 
 * @returns {Promise<any>}
 */
const get = async (key) => {
    if (!isRedisAvailable || !redis) return null;
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        logger.error(`Cache GET error for key ${key}:`, error);
        return null;
    }
};

/**
 * Set value in cache
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttlSeconds 
 */
const set = async (key, value, ttlSeconds = 3600) => {
    if (!isRedisAvailable || !redis) return;
    try {
        await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
        logger.error(`Cache SET error for key ${key}:`, error);
    }
};

/**
 * Delete value from cache
 * @param {string} key 
 */
const del = async (key) => {
    if (!isRedisAvailable || !redis) return;
    try {
        await redis.del(key);
    } catch (error) {
        logger.error(`Cache DEL error for key ${key}:`, error);
    }
};

module.exports = {
    get,
    set,
    del,
    client: redis
};
