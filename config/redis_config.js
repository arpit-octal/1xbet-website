const redis = require("redis");
const { promisify } = require("util");
const keys = require("../config/keys");

const client = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
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

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const del = promisify(client.del).bind(client);

module.exports = {
  get,
  set,
  del,
  deleteRedisCache,
  deleteAllRedisCache,
  updateCache,
  deleteListingCache,
};