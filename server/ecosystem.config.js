module.exports = {
  apps : [
    {
      name : "timer",
      script : "./bin/www.js",
      watch : false,
      env : {
        "NODE_ENV": "production",
      },
      log_date_format : "YYYY-MM-DD HH:mm Z",
    },
  ]
}
