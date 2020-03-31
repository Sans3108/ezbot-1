const { brawlStars, db, Discord } = require("../functions/requirePackages.js");

module.exports = {
  name: "restart",
  description: "Restarts the bot.",
  aliases: ["reset"],
  cooldown: 3,
  ownerOnly: true,
  bannedGuilds: [],
  allowedGuilds: [],
	execute(message, args, bot, color) {
    function resetBot(channel) {
      let embed1 = new Discord.RichEmbed()
        .setColor(color.red)
        .setDescription('Restarting the bot, please wait a few seconds...');
      
      let embed2 = new Discord.RichEmbed()
        .setColor(color.green)
        .setDescription('Done restarting the bot!');
      
      message.channel.send(embed1)
        .then(msg => bot.destroy())
        .then(() => bot.login(process.env.TOKEN))
        .then(() => message.channel.send(embed2));
    }
    resetBot();
  }
};