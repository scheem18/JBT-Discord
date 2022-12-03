module.exports = {
	name: 'messageCreate',
	execute: async (message, client) => {
        if (message.content.startsWith('[[') && message.content.endsWith(']]')) {
            const pkgname = message.content.slice(2,message.content.length - 2);
            if (!pkgname) return;
            require('../utils/tweaksearch').search(message, pkgname);
        }
	}
}