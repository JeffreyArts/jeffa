require("dotenv").config();

module.exports = {
  apps: [{
    name: "jeffa-api",
    script: "yarn",
    args: "start",
    cwd: process.env.DEPLOYMENT_PATH,
    env: {
      NODE_ENV: "production"
    }
  }],

  deploy: {
    production: {
      user: process.env.DEPLOYMENT_USER,
      host: process.env.DEPLOYMENT_HOST,
      ref: "origin/main",
      repo: process.env.DEPLOYMENT_REPO,
      path: process.env.DEPLOYMENT_PATH,
      "post-deploy": "yarn install && yarn build && pm2 reload ecosystem.config.js --env production"
    }
  } 
};
