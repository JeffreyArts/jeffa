'use strict';
/*
If this middleware is not working, please make sure that you have added the following line to your .env file
OPENAI_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 

(replace the value with you own OpenAI key)
https://platform.openai.com/account/api-keys

And that you have installed the openai package 
yarn add openai
*/

import FormData from 'form-data'
import OpenAI from 'openai'



const openAI = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    ctx.openAI =  openAI;
    return next()
  };
};