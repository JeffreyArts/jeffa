'use strict';

/**
 * marvin-bot service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::marvin-bot.marvin-bot');
