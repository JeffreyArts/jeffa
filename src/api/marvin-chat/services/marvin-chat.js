'use strict';

/**
 * marvin-chat service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::marvin-chat.marvin-chat');
