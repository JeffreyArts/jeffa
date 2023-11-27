module.exports = async (ctx) => {
    if (!ctx.params) {
        return
    }

    const { key } = ctx.params;
    
    try {
        
        const result = await strapi.db.query('api::ian-lisa-gasten.ian-lisa-gasten').findOne({
            where: {
                url: {
                    $endsWith: `/${key}`,
                }
            }
        })
    
        // Return the newly created maya-image
        return { data: result };
    } catch (error) {
        console.error("error",error, error.response)
        // const result = await strapi.entityService.create('api::marvin-chat.marvin-chat', { data: ctx.request.body.data });
        return { error: error };
    }
    
  } 