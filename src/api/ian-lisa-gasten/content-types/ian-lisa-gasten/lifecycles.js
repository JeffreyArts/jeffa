module.exports = {
    beforeCreate(event) {
        const { result, params  } = event;

        // If no custom url is set, generate one
        if (event.params.data.url == "https://www.05-07-2024.nl/uitnodiging/") {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const length = 8;
            let randomString = '';
            for (let i = 0; i < length; i++) {
                randomString += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            event.params.data.url = `https://www.05-07-2024.nl/uitnodiging/${randomString}` 
        }
    },
};