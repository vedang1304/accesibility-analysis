const { createClient } = require('redis')

const redisclient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-14384.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14384
    }
});

module.exports=redisclient