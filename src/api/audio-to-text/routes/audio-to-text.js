'use strict';

/**
 * audio-to-text router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::audio-to-text.audio-to-text', {
    config: {
      find: {},
      findOne: {},
      create: {},
      update: {},
      delete: {},
    },
});
