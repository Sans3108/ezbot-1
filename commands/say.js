const { brawlStars, Discord } = require("../functions/requirePackages.js");

module.exports = {
	name: 'say',
	description: 'Make me say whatever you want.',
	usage: '<embed | tts> [text]',
	cooldown: 1,
	args: true,
	guildOnly: true,
	execute(message, args, bot, color) {
		const perms = ["MANAGE_MESSAGES"]
		const perms2 = ["SEND_TTS_MESSAGES"]

		const embed1 = new Discord.RichEmbed()
			.setColor(color.red)
			.setDescription(`You shall get permissions first! (\`${perms}\`)`);

		const embed2 = new Discord.RichEmbed()
			.setColor(color.blue)
			.setDescription(`In order to send TTS (text-to-speech) messages you will need these additional permission(s): (\`${perms2}\`)`);


		if (!message.member.hasPermission(perms)) return message.channel.send(embed1);

		message.delete();

		if (args[0] === 'embed' || args[0] === 'emb') {
			let a = new Discord.RichEmbed()
				.setDescription(args.slice(1).join(' '));

			message.channel.send(a)
		} else if (args[0] === 'tts') {
			if (!message.member.hasPermission(perms2)) return message.channel.send(embed2);

			message.channel.send(args.slice(1).join(' '), { tts: true });
		} else {
			message.channel.send(args.join(' '));
		}
	},
};
