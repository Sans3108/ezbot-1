const { brawlStars, db, Discord } = require("../functions/requirePackages.js");

module.exports = {
	name: 'ban',
	description: 'Ban a member from the server with a optional reason.',
	usage: '[@member] <reason>',
	cooldown: 5,
	guildOnly: true, 
	args: true,
  bannedGuilds: [],
  allowedGuilds: [],
	execute(message, args, bot, color) {
		const perms = ["BAN_MEMBERS"];

		const embed1 = new Discord.RichEmbed()
			.setColor(color.red)
      .addField("ERROR: Insufficient permissions", "You don't have permission to ban members!");
		if (!message.member.hasPermission(perms)) return message.channel.send(embed1);

		const embed2 = new Discord.RichEmbed()
		.setColor(color.red)
		.addField("ERROR: Too many mentions!", "Sorry, you can't mention a user in your ban reason!");
    
		if(message.mentions.users.size >= 2) return message.channel.send(embed2);

		let member = message.mentions.members.first();
		let reason = args.slice(1).join(' ');
		if (!reason) {
			reason = 'No reason given.';
		};

		const embed3 = new Discord.RichEmbed()
			.setColor(color.red)
			.addField("ERROR: Invalid mention", "Please mention a valid member in order to ban them.");

		if (!member) return message.channel.send(embed3);
		const embed4 = new Discord.RichEmbed()
			.setColor(color.red)
			.addField("ERROR: Member not bannable", `I cannot ban ${member}... Do they have a higher role than me? Do I even have ban permissions?`);
    
		if (!member.bannable) return message.channel.send(embed4);

		const embed5 = new Discord.RichEmbed()
		.setColor(color.red)
		.addField("ERROR: Member is part of staff", `I can't ban ${member} because they are either Moderator, Community Manager or Owner.`);

		if(member.roles.find(r => r.id === "580605538778480649") || member.roles.find(r => r.id === "550541139451707412") ||member.roles.find(r => r.id === "583442496227377156")) return message.channel.send(embed5);

		const embed6 = new Discord.RichEmbed()
			.setColor(color.green)
      .setAuthor(message.member.displayName, message.author.displayAvatarURL)
      .addField("Success! Member banned!", `${member} has been banned for \`${reason}\``);

		member.ban(`${message.author.tag}: ${reason}`);
		message.channel.send(embed6);
		message.delete();
	},
};
