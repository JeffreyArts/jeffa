'use strict';

/**
 * maya-image router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::maya-image.maya-image', {
  config: {
    find: {},
    findOne: {},
    create: {
        middlewares: ['global::openai'],
    },
    update: {},
    delete: {},
  },
});
