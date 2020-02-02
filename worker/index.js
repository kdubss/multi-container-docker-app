const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

// NOT an ideal solution, but places emphasis on the importance of 
// having a secondary worker process running
const fib = index => {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// sub ==> subscription
sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');