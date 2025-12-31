module.exports = {
  apps: [
    {
      name: 'wenyushijie',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      log_file: 'logs/app.log',
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      time: true
    }
  ]
};
