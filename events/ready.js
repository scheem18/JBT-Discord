module.exports = {
	name: 'ready',
	once: true,
	execute: async (client) => {
        console.log(`Ready! Logged in ${client.user.tag}`);
    }
}