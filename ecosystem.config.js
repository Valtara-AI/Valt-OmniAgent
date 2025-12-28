module.exports = {
  apps: [{
    name: 'valt-omniagent',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/valt-omniagent',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    error_file: '/var/www/valt-omniagent/logs/err.log',
    out_file: '/var/www/valt-omniagent/logs/out.log',
    log_file: '/var/www/valt-omniagent/logs/combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Reliability settings
    autorestart: true,
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 10000,
    kill_timeout: 5000,
    // Health check
    exp_backoff_restart_delay: 100
  }]
};
