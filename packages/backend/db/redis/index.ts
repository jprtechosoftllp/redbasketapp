import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_DATABASE_AUTH_URL!);

if(process.env.NODE_ENV !== "production"){
    // In development, we can log Redis commands for debugging purposes
    redis.on('connect', ()=> {
        console.log('Connected to Redis');
        
    });
    redis.on('error', (err: any)=> {
        console.error('Redis error:', err);
        
    })
}

export default redis;