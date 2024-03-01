/*****************************
Sample input:
{
  "data": {
      "new_message": ""                               // Required: The new message to be added to the chat
  }
}
*****************************/

import _ from "lodash"

const addMessage = async (ctx) => {
    const openAI = ctx.openAI;

    if (!ctx.request.body.data) {
        return ctx.badRequest(null, [
            {
                messages: [
                    {
                        id: 'ValidationError',
                        message: `Missing required data object`,
                    },
                ],
            },
        ]);
    }

    const requiredFields = ['new_message'];
    const { new_message } = ctx.request.body.data;
    const { id } = ctx.params;

    // Check if all required fields are present
    const missingFields = requiredFields.filter(field => !ctx.request.body.data[field]);
    if (missingFields.length > 0) {
        return ctx.badRequest(null, [
            {
                messages: [
                    {
                        id: 'ValidationError',
                        message: `Missing required fields: ${missingFields.join(', ')}`,
                    },
                ],
            },
        ]);
    }

    const chat = await strapi.entityService.findOne('api::marvin-chat.marvin-chat', id, {
        fields: ['identity', 'model', 'chatlog'],
    })

    if (!_.isArray(chat.chatlog)) {
        return ctx.badRequest(chat.chatlog, [
            {
                messages: [
                    {
                        id: 'serverError',
                        message: `Incorrect datatype chatlog (${typeof chat.chatlog})`,
                    },
                ],
            },
        ]);
    }
    chat.chatlog.unshift({
        role: "system",
        content: chat.identity,
    })
    chat.chatlog.push({
        role: "user",
        content: new_message,
    })

    console.log("new_message", new_message, id, chat)
    try {
        
        // Make bot open the conversation
        
        const o = await openAI.createChatCompletion({
            model: chat.model,
            messages: chat.chatlog,
        })
        
        const newAssistantMessage = o.data.choices[0].message.content
        
        
        chat.chatlog.push({
            role: "assistant",
            content: newAssistantMessage,
        })
        chat.chatlog.shift()
        console.log("newAssistantMessage", newAssistantMessage, id, chat)
        // const subject = `${o2.data.choices[0].message.content}`

        
        // ctx.request.body.data.subject = subject
        // ctx.request.body.data.model = model
        // ctx.request.body.data.chatlog = chatlog
        
        const result = await strapi.entityService.update('api::marvin-chat.marvin-chat', id, { 
            data: {
                chatlog: chat.chatlog,
            }
        });

        // Return the newly created maya-image
        return { data: chat, meta: ctx.request.body.meta };
    } catch (error) {
        console.error("error",error, error.response)
        // const result = await strapi.entityService.create('api::marvin-chat.marvin-chat', { data: ctx.request.body.data });
        return { error: error, meta: ctx.request.body.meta };
    }
} 

export default {
    addMessage
}