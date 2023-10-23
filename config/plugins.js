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
});