module.exports = {
	name: 'messageCreate',
	execute: async (message, client) => {
        if (message.content.startsWith('[[') && message.content.endsWith(']]')) {
            require('../utils/tweaksearch').search(message, message.content.slice(2,message.content.length - 2))
        }
	}
}