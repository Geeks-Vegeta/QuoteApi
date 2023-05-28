const redis = require('redis');

// create redis client
const client = redis.createClient({
    url: process.env.REDIS_URI
  });
  
client.connect(()=>{
  console.log("connected to redis");
})

module.exports={client}