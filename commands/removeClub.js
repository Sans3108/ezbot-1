const { brawlStars, db, Discord } = require("../functions/requirePackages.js");

module.exports = {
	name: 'removeclub',
	description: 'Removes a Club from the database.',
  aliases: ['rc', 'deleteclub', 'delclub', 'dc'],
	usage: '[Club name]',
	cooldown: 3,
	guildOnly: true, 
	args: true,
  bannedGuilds: [],
  allowedGuilds: [],
	execute(message, args, bot, color) {
		const perms = ["MANAGE_GUILD"];
		const embed1 = new Discord.RichEmbed()
			.setColor(color.red)
      .addField("ERROR: Insufficient permissions", "You don't have permission to run this command!");
		if (!message.member.hasPermission(perms)) return message.channel.send(embed1);
    
    const embed2 = new Discord.RichEmbed()
      .setColor(color.red)
      .addField("ERROR: Club not found", "Sorry, I couldn't find that Club in my database! Are you sure you spelled it correctly?")
    
    let clubList = db.fetch("clubList");
    let newClublist = clubList.filter(club => club[0].toUpperCase() !== args[0].toUpperCase());
    if (newClublist.length === clubList.length) return message.channel.send(embed2);

		const embed3 = new Discord.RichEmbed()
			.setColor(color.green)
      .setAuthor(message.member.displayName, message.author.displayAvatarURL)
      .addField("Success! Club removed!", `Removed Club \`${args[0]}\` from the database!`);
    
    db.set("clubList", newClublist);
		message.channel.send(embed3);
	}
};
