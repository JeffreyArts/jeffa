'use strict';

import axios from 'axios'
import { createWriteStream } from 'fs'
import { unlink } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { factories } from '@strapi/strapi'

/*****************************
Sample input:
{
  "data": {
    "query": "jaguar",                                      // Required: The subject for generating a Maya symbol
    "prompt": "Create an ancient Maya symbol of a jaguar"   // Optional: A custom prompt for Dall-E to generate an image
  }
}
*****************************/
module.exports = factories.createCoreController('api::maya-image.maya-image', ({ strapi }) => ({
  async create(ctx) {
    const openAI = ctx.openAI;

    const { query } = ctx.request.body.data;
    let  { prompt } = ctx.request.body.data;
    try {
      if (!prompt) {
        // Generate promt from query with openAI
        const data = await openAI.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "assistant",
              content: "you are a prompt master, your job is to come up with a single prompt that can be used to generate a Maya symbol with Dalle-2.",
            },
            {
              role: "user",
              content: `Toon mij een prompt voor een symbol van een ${query}`,
            },
          ],
        })
        prompt = `${data.choices[0].message.content}, style of ancient maya symbol, positive`
        ctx.request.body.data.prompt = prompt
      }

      // Create image with OpenAI
      const response = await openAI.images.generate({
        prompt: prompt,
        n: 1,
        size: '1024x1024',
      });
      console.log("response", response)
      // Download the image and save it to a temporary file
      const imageUrl = response.data[0].url;
      const imagePath = join(tmpdir(), 'tempImageFile');
      const writer = createWriteStream(imagePath);
      const { data: imageStream } = await axios({ url: imageUrl, method: 'GET', responseType: 'stream' });
      imageStream.pipe(writer);

      // Wait for the download to finish
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Upload the image to Strapi
      const fileData = {
        path: imagePath,
        name: 'image_name.jpg', // choose a suitable name for the image
        type: 'image/jpeg', // the appropriate MIME type for the image
      };
      const uploadedFile = await strapi.plugins.upload.services.upload.upload({
        data: {},
        files: fileData,
      });

      // Remove the temporary file
      unlink(imagePath);

      // Add the uploaded image to the request body
      ctx.request.body.data.image = uploadedFile[0].id;

      // Add the data to the database
      const result = await strapi.entityService.create('api::maya-image.maya-image', { data: ctx.request.body.data, populate: ['image'] });

      // Return the newly created maya-image
      return { data: result, meta: ctx.request.body.meta };
    } catch (error) {
        console.error("error",error, error.response)
        const result = await strapi.entityService.create('api::maya-image.maya-image', { data: ctx.request.body.data });
        return { data: result, meta: ctx.request.body.meta };
    }
  },
}));
