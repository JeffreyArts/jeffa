'use strict';

/**
 * ian-lisa-gasten controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const getByKey = require('./get-by-key.js');

module.exports = createCoreController('api::ian-lisa-gasten.ian-lisa-gasten', ({ strapi }) => ({
    getByKey
}));