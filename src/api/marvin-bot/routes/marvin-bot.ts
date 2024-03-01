'use strict';

/**
 * marvin-chat router
 */

import { factories } from '@strapi/strapi'; 

module.exports = factories.createCoreRouter('api::marvin-bot.marvin-bot', {
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
