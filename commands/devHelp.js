const { brawlStars, db, Discord } = require("../functions/requirePackages.js");
const { prefix } = require('../config.json');

module.exports = {
	name: 'dev-help',
	description: 'List all of my dev commands or info about a specific command.',
	aliases: ['dev-commands', 'dev-cmds'],
	usage: '[command name]',
	cooldown: 5,
  bannedGuilds: [],
  allowedGuilds: [],
	execute(message, args, bot, color) {
		const data = [];
		const { commands } = message.client;
    
		// Embeds
		const embed1 = new Discord.RichEmbed()
		.setColor(color.green)
		.setDescription('I\'ve sent you a DM with all my dev commands!');

		const embed2 = new Discord.RichEmbed()
		.setColor(color.red)
		.setDescription('It seems like I can\'t DM you!');

		const embed3 = new Discord.RichEmbed()
		.setColor(color.red)
		.setDescription('That command does not exist... try again?');

		if (!args.length) {
			data.push('**Here\'s a list of all my dev commands:**\n_');
			data.push(commands.filter(c => c.ownerOnly).map(command => command.name).join('_ | _'));
			data.push(`_\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

			const embed4 = new Discord.RichEmbed()
			.setColor(color.blue)
			.setDescription(data, { split: true })

			return message.author.send(embed4)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply(embed1);
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply(embed2);
				});
		}
    
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply(embed3);
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		const embed5 = new Discord.RichEmbed()
		.setColor(color.blue)
		.setDescription(data, { split: true });

		message.channel.send(embed5);
	},
};