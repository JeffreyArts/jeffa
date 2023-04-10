module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/marvin-chat/:id/add-message',
        handler: 'marvin-chat.addMessage',
        config: {
          auth: false,
          middlewares: ['global::openai'],
        },
      },
    ],
};