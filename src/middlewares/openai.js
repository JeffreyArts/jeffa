'use strict';
/*
If this middleware is not working, please make sure that you have added the following line to your .env file
OPENAI_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 

(replace the value with you own OpenAI key)
https://platform.openai.com/account/api-keys

And that you have installed the openai package 
yarn add openai
*/

const { Configuration, OpenAIApi } = require('openai');

class CustomFormData extends FormData {
  getHeaders() {
    return {};
  }
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
  formDataCtor: CustomFormData,
});

const openAI = new OpenAIApi(configuration);

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    ctx.openAI =  openAI;
    return next()
  };
};