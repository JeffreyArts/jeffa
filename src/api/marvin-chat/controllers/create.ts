/*****************************
Sample input:
{
  "data": {
      "marvin_bot": 1                               // Required: The ID of the character
  }
}
*****************************/


const create = async (ctx) => {
    const openAI = ctx.openAI;

    const requiredFields = ['marvin_bot'];
    const { marvin_bot } = ctx.request.body.data;

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
    
    // Add the data to the database
    const newChat = await strapi.entityService.create('api::marvin-chat.marvin-chat', { data: ctx.request.body.data, populate: ['marvin_bot'] });
    ctx.request.body.data.identity = `In dit gesprek speel je een karakter, dit is je identiteit:\r\n\r\n${newChat.marvin_bot.identity}.\r\n\r\nLeef je in je rol!`
    try {
        
        // Make bot open the conversation
        const model = "gpt-3.5-turbo"
        const data = await openAI.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "system",
                    content: ctx.request.body.data.identity
                },
                {
                    role: "user",
                    content: `Stel jezelf zeer kort aan mij voor, benoem je naam en rol, open daarna het gesprek met een anekdote.`,
                },
            ],
        })
        
        const firstMessage = data.choices[0].message.content
        
        const data2 = await openAI.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "user",
                    content: `Schrijf een korte titel om het volgende gesprek samen te vatten, benoem hierin uitsluitend de naam van de persoon, diens rol, en heel beknopt het onderwerp van het gesprek: ${firstMessage}. Geen titel prefix, haakjes, quotes of whatever`,
                },
            ],
        })
        
        const chatlog = [
            {
                role: "assistant",
                content: firstMessage,
            }
        ]
        const subject = `${data2.choices[0].message.content}`

        
        ctx.request.body.data.subject = subject
        ctx.request.body.data.model = model
        ctx.request.body.data.chatlog = chatlog
        
        const result = await strapi.entityService.update('api::marvin-chat.marvin-chat', newChat.id, { 
            data:{
                identity: ctx.request.body.data.identity,
                model: model,
                subject: subject,
                chatlog: chatlog,
            }
        });

        return { data: result, meta: ctx.request.body.meta };
    } catch (error) {
        console.error("error",error, error.response)
        // const result = await strapi.entityService.create('api::marvin-chat.marvin-chat', { data: ctx.request.body.data });
        return { error: error, meta: ctx.request.body.meta };
    }
  }

  export default {
    create
  }