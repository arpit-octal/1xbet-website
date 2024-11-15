const redis = require("redis");
const { promisify } = require("util");
const keys = require("../config/keys");

const client = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

(async () => {
  // Connect to redis server
  await client.connect();
})();


client.on("connect", () => {
  console.log("Redis client connected");
});

client.on("error", (error) => {
  console.error(error);
});

const deleteRedisCache = async (key) => {
  client.keys("*", async (err, keys) => {
    if (err) return console.log(err);

    for await (const [i, itr] of Object.entries(keys)) {
      let lastIndex = itr.lastIndexOf("_");
      let tempKey = itr.slice(0, lastIndex);
      let compKey = `all_${key}_records`;
      let compKeys = `get_${key}_count`;
      if (tempKey == compKey) {
        del(itr);
      }
      if (tempKey == compKeys) {
        del(itr);
      }
    }
  });
};

const deleteAllRedisCache = () => {
  client.keys("*", function (err, keys) {
    if (err) return console.log(err);

    for (var i = 0, len = keys.length; i < len; i++) {
      del(keys[i]);
    }
  });
};

const deleteListingCache = async (key) => {
  client.keys("*", async (err, keys) => {
    if (err) return console.log(err);

    for await (const [i, itr] of Object.entries(keys)) {
      let compKey = `${key}Details`;

      if (itr == compKey) {
        del(itr);
      }
    }
  });
};

const updateCache = async (key) => {
  client.keys("*", async (err, keys) => {
    if (err) return console.log(err);

    for await (const [i, itr] of Object.entries(keys)) {
      let lastIndex = itr.lastIndexOf("_");
      let tempKey = itr.slice(0, lastIndex);
      let compKey = `all_${key}_records`;
    }
  });
};

const getData = async (key) => {
    const cacheKey = `TODOS_${key}`;

    // First attempt to retrieve data from the cache
    try {
      const cachedResult = await client.get(cacheKey);
      if (cachedResult) {
        console.log('Data from cache.');
        return cachedResult;
      }
    } catch (error) {
        console.error('Something happened to Redis', error);
    }
};

const setData = async (key, apiResponse) => {
  const cacheKey = `TODOS_${key}`;
  // First attempt to retrieve data from the cache
  if (apiResponse) {
    try {
      await client.set(cacheKey, JSON.stringify(apiResponse));
    } catch (error) {
      console.error('Something happened to Redis', error);
    }
  }
};

const deleteData = async (key) => {
  const cacheKey = `TODOS_${key}`;
  try {
    await client.del(cacheKey);
  } catch (error) {
    console.error('Something happened to Redis', error);
  }
};

module.exports = {
  getData,
  setData,
  deleteData,
  deleteRedisCache,
  deleteAllRedisCache,
  updateCache,
  deleteListingCache,
};
