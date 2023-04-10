'use strict';

/**
 * marvin-chat router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::marvin-bot.marvin-bot', {
  config: {
    find: {},
    findOne: {},
    create: {
        middlewares: ['global::openai'],
    },
    update: {},
    delete: {},
  }
});
