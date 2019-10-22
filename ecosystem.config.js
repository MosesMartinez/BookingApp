module.exports = {
    apps: [{
      name: 'gateway',
      script: 'gateway.js',
      cwd: './server',
    },
    {
      name: 'schedule',
      script: 'schedule.js',
      cwd: './server',
    },
    {
      name: 'appointments',
      script: 'appointments.js',
      cwd: './server',
    },
    {
      name: 'sms',
      script: 'sms.js',
      cwd: './server',
    },
    {
      name: 'email',
      script: 'email.js',
      cwd: './server',
    }],
  };
  