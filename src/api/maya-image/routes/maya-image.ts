'use strict';

/**
 * maya-image router
 */

import { factories } from '@strapi/strapi'; 

module.exports = factories.createCoreRouter('api::maya-image.maya-image', {
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
