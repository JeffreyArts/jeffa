'use strict';

/**
 * audio-to-text service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::audio-to-text.audio-to-text');
