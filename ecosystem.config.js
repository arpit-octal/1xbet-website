module.exports = {
  apps: [{
    name: "possia-mobile",
    script: "./server.js",
    watch: true,
    ignore_watch: [".git", "node_modules", "public"],
    env: {
      PORT: 7002,
      NODE_ENV: "development",
      REACT_APP_API_BASE_URL: "http://192.168.1.62:7001/",
      REACT_APP_URL: "http://192.168.1.62:7002/"
    },
    env_staging: {
      PORT: 7002,
      NODE_ENV: "staging",
      REACT_APP_API_BASE_URL: "http://3.110.45.86:7001/",
      REACT_APP_URL: "http://3.110.45.86:7002/"
    }
  }]
}
