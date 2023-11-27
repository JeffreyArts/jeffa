module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/ian-lisa-gasten/uitnodiging/:key',
        handler: 'ian-lisa-gasten.getByKey',
        config: {
          auth: false,
        },
      },
    ],
};