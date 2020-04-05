const { brawlStars, db, Discord } = require("../functions/requirePackages.js");

module.exports = {
	name: 'kick',
	description: 'Kick a member from the server with a optional reason.',
	usage: '[@member] <reason>',
	cooldown: 5,
	guildOnly: true, 
	args: true,
  bannedGuilds: [],
  allowedGuilds: [],
	execute(message, args, bot, color) {
		const perms = ["KICK_MEMBERS"];

		const embed1 = new Discord.RichEmbed()
			.setColor(color.red)
      .addField("ERROR: Insufficient permissions", "You don't have permission to kick members!");
    
		if (!message.member.hasPermission(perms)) return message.channel.send(embed1);

		const embed2 = new Discord.RichEmbed()
		.setColor(color.red)
		.addField("ERROR: Too many mentions!", "Sorry, you can't mention a user in your kick reason!");
    
		if(message.mentions.users.size >= 2) return message.channel.send(embed2);

		let member = message.mentions.members.first();
		let reason = args.slice(1).join(' ');
		if (!reason) {
			reason = 'No reason given.';
		};

		const embed3 = new Discord.RichEmbed()
			.setColor(color.red)
			.addField("ERROR: Invalid mention", "Please mention a valid member in order to kick them.");

		if (!member) return message.channel.send(embed3);
    
		const embed4 = new Discord.RichEmbed()
			.setColor(color.red)
			.addField("ERROR: Member not kickable", `I can't kick ${member}... Do they have a higher role than me? Do I have kick permissions?`);
    
		if (!member.kickable) return message.channel.send(embed4);

		const embed5 = new Discord.RichEmbed()
		.setColor(color.red)
		.addField(`ERROR: You can't kick this member`, `${member} is above you in the hierarcy. You can't kick them!`);

		if(message.member.highestRole.calculatedPosition <= member.highestRole.calculatedPosition) return message.channel.send(embed5);

		const embed6 = new Discord.RichEmbed()
			.setColor(color.green)
      .setAuthor(message.member.displayName, message.author.displayAvatarURL)
      .addField("Success! Member kicked!", `${member} has been kicked for \`${reason}\``);

		member.kick(`${message.author.tag}: ${reason}`);
		message.channel.send(embed6);
		message.delete();
	},
};
