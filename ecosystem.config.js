/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

module.exports = {
  apps : [
      {
          name: 'DDCS_Webapp',
          script: 'server.js',
          // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
          instances: 1,
          autorestart: true,
          watch: false,
          max_memory_restart: '1G',
          env: {
              NODE_ENV: 'development'
          },
          env_production: {
              NODE_ENV: 'production'
          }
      },
      {
          name: 'DDCS_Standard_Front',
          script: 'servers/DDCSStandard/DDCSStandard-Front.js',
          // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
          instances: 1,
          autorestart: true,
          watch: false,
          max_memory_restart: '1G',
          env: {
              NODE_ENV: 'development'
          },
          env_production: {
              NODE_ENV: 'production'
          }
      },
      {
          name: 'DDCS_Standard_Back',
          script: 'servers/DDCSStandard/DDCSStandard-Back.js',
          // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
          instances: 1,
          autorestart: true,
          watch: false,
          max_memory_restart: '1G',
          env: {
              NODE_ENV: 'development'
          },
          env_production: {
              NODE_ENV: 'production'
          }
      },
      {
          name: 'DDCS_Hardcore_Front',
          script: 'servers/DDCSHardcore/DDCSHardcore-Front.js',
          // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
          instances: 1,
          autorestart: true,
          watch: false,
          max_memory_restart: '1G',
          env: {
              NODE_ENV: 'development'
          },
          env_production: {
              NODE_ENV: 'production'
          }
      },
      {
          name: 'DDCS_Hardcore_Back',
          script: 'servers/DDCSHardcore/DDCSHardcore-Back.js',
          // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
          instances: 1,
          autorestart: true,
          watch: false,
          max_memory_restart: '1G',
          env: {
              NODE_ENV: 'development'
          },
          env_production: {
              NODE_ENV: 'production'
          }
      }
  ],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
