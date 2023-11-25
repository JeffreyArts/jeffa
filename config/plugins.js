module.exports = ({ env }) => ({
  "io": {
    "enabled": true,
    "config": {
      "IOServerOptions" :{
        "cors": { "origin": env('APP_ORIGIN', 'http://localhost:3000'), "methods": ["GET", "POST", "DELETE", "PUT"] },
      },
      "contentTypes": {
        // "message": "*",
        "marvin-chat":["update", "create"]
      },
      "events":[
        {
          "name": "connection",
          "handler": ({ strapi }, socket) => {
            strapi.log.info(`[io] new connection with id ${socket.id}`);
          },
        },
      ]
    },
  },
  email: {
    config: {
      provider: 'mailgun', // For community providers pass the full package name (e.g. provider: 'strapi-provider-email-mandrill')
      providerOptions: {
        key: env('MAILGUN_API_KEY'),
        domain: env('MAILGUN_DOMAIN'),
        url: env('MAILGUN_URL', 'https://api.mailgun.net'),
      },
      settings: {
        defaultFrom: env('MAILGUN_FROM'),
        defaultReplyTo: env('MAILGUN_REPLYTO')
      },
    },
  },
});