'use strict';

/**
 * marvin-chat controller
 */

import axios from 'axios'
import { createWriteStream } from 'fs'
import { unlink } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
// import {snakeCase} from "change-case"
import { factories } from '@strapi/strapi'

/*****************************
Sample input:
{
  "data": {
      "name": "Jeffrey"                               // Required: The name for the character
      "role": "Arts"                                  // Required: The role for the character
      "accent_color": "#ff0099"                       // Optional: Color matching the character
  }
}
*****************************/
module.exports = factories.createCoreController('api::marvin-bot.marvin-bot', ({
  strapi
}) => ({
  async create(ctx) {
    const openAI = ctx.openAI;

    const requiredFields = ['name', 'role'];
    const {
      accent_color,
      name,
      role
    } = ctx.request.body.data;


    // Check if all required fields are present
    const missingFields = requiredFields.filter(field => !ctx.request.body.data[field])
    if (missingFields.length > 0) {
      return ctx.badRequest(null, [{
        messages: [{
          id: 'ValidationError',
          message: `Missing required fields: ${missingFields.join(', ')}`,
        }, ],
      }, ]);
    }



    // Generate promt from query with openAI
    const o = await openAI.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Je taak is om een fictief karakter te bedenken. Het karakter is een ${role} en heet ${name}. Bedenk ten minste 5 eigenschappen van het karakter. 
                In je antwoord wil ik dat je refereert naar "ik" ipv "${name}" en het moet geschreven zijn als een omschrijving van de identiteit van het karakter. 
                Verzin naast karakter eigenschappen ook externe eigenschappen zoals familie, vrienden, hobby's, werk, leeftijd, etc.`,
      }, ],
    })
    // const o = await openAI.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //         {
    //             role: "user",
    //             content: `Je taak is om een korte introductie te schrijven voor een chat avatar. Hierin ben je een ${role} en je naam is ${name}. Je moet hierin je naam en rol benoemen. Leef je in je rol als ${role}!`,
    //         },
    //     ],
    // })
    const identity = `${o.data.choices[0].message.content}`

    
    ctx.request.body.data.identity = identity
    // 
    // Generate promt from query with openAI
    let color = "grey"
    if (accent_color) {

        const c = await openAI.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `Your job is to name the following hex color: ${accent_color}. Only output the name, nothing more, nothing less.`,
            }, ],
        })
        color = `${c.data.choices[0].message.content}`
    }

    let response = undefined
    try {
      // Create image with OpenAI
      response = await openAI.createImage({
        prompt: `avatar of a ${role}, face only, background color: ${color}, 3D render`,
        n: 1,
        size: '512x512',
      });
    } catch (error) {
      response = await openAI.createImage({
        prompt: `avatar for an unknown profile, face only, background color: ${color}, 3D render`,
        n: 1,
        size: '512x512',
      });
    }
    console.log(response)

    // Download the image and save it to a temporary file
    const imageUrl = response.data.data[0].url;
    const imagePath = join(tmpdir(), 'tempImageFile');
    const writer = createWriteStream(imagePath);
    const {
      data: imageStream
    } = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream'
    });
    imageStream.pipe(writer);

    // Wait for the download to finish
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Upload the image to Strapi
    const fileData = {
      path: imagePath,
      name: `${`${role} ${name}`}.jpg`, // choose a suitable name for the image
      type: 'image/jpeg', // the appropriate MIME type for the image
    };
    const uploadedFile = await strapi.plugins.upload.services.upload.upload({
      data: {},
      files: fileData,
    });

    // Remove the temporary file
    await unlink(imagePath);

    // Add the uploaded image to the request body
    ctx.request.body.data.avatar = uploadedFile[0].id;
    ctx.request.body.data.published_at = new Date();

    // Add the data to the database
    const result = await strapi.entityService.create('api::marvin-bot.marvin-bot', {
      data: ctx.request.body.data,
      populate: ['avatar']
    });

    // Return the newly created maya-image
    return {
      data: result,
      meta: ctx.request.body.meta
    };
  },
}));
