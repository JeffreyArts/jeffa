'use strict';

/**
 * audio-to-text router
 */

import { factories } from '@strapi/strapi'; 

module.exports = factories.createCoreRouter('api::audio-to-text.audio-to-text', {
    config: {
      find: {},
      findOne: {},
      create: {},
      update: {},
      delete: {},
    },
});
