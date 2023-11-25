'use strict';

/**
 * audio-to-text controller
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs/promises');
const stream = require('stream');
// const Blob = require('blob-polyfill').Blob;
const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::audio-to-text.audio-to-text', ({ strapi }) => ({
  async create(ctx) {
    const { audio } = ctx.request.files;
    const options = {}
    if (!audio) {
        return { data: { error: "Missing audio file" }, meta: ctx.request.body.meta };
    }

    if (ctx.request.body.language) {
        options.language = ctx.request.body.language
    }

    
    // Download the image and save it to a temporary file
    const fileData = {
        path: audio.path, // Use the path from the audio file in the request
        name: audio.name, // Use the name from the audio file in the request
        type: audio.type, // Use the MIME type from the audio file in the request
    };
    const uploadedFile = await strapi.plugins.upload.services.upload.upload({
        data: {},
        files: audio,
    });
    
    try {
        
        const formData = new FormData()
        const fileBuffer = await fs.readFile(audio.path);
        const blob = new Blob([fileBuffer] );
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        formData.append("file", bufferStream, audio.name)
        formData.append("model", "whisper-1")
        for (let key in options) {
            formData.append(key, options[key])
        }

        const completion = await axios.post( `https://api.openai.com/v1/audio/transcriptions`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
            },
        })

        // Store audio file + completion in database
        const result = await strapi.entityService.create('api::audio-to-text.audio-to-text', { data: {
            audio: uploadedFile[0].id,
            text: completion.data.text,
        } });

        // Return the newly created audio-to-text
        return { data: result, meta: ctx.request.body.meta };
    } catch (error) {
        console.error("error",error, error.response)
        const result = await strapi.entityService.create('api::audio-to-text.audio-to-text', { data: ctx.request.body.data });
        return { data: result, meta: ctx.request.body.meta };
    }
  },
}));
