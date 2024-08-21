module.exports = {
    apps: [{
      name: 'tftourneys',
      script: 'npm',
      args: 'start',
      autorestart: true, // Automatically restart the application if it crashes
      max_restarts: 10, // Number of restarts within a minute before considering the app as unstable
      restart_delay: 4000,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }]
  };