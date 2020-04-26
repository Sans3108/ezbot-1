const { Discord, brawlStars, rethink } = require("../functions/requirePackages.js");

let connection = null;

rethink.connect( {host: process.env.RETHINK_HOST_IP }, function(err, conn) {
    if (err) throw err;
    connection = conn;
})

module.exports = {
    name: 'addclub',
    description: 'Adds a Club to the database.',
    aliases: ['ac', 'newclub', 'pushclub', 'clubadd'],
    usage: '[Club name] [Club tag] [Role ID]',
    cooldown: 3,
    guildOnly: true, 
    args: true,
    bannedGuilds: [],
    allowedGuilds: [],
    execute(message, args, bot, color) {
        const perms = ["MANAGE_GUILD"];
        
        const roleID = args.pop();
        const clubTag = args.pop();
        let clubName = args.join(" ");
        args = [clubName, clubTag, roleID].filter((arg) => arg);
        
        const embed1 = new Discord.RichEmbed()
            .setColor(color.red)
            .addField("ERROR: Insufficient permissions", "You don't have permission to run this command!");
        if (!message.member.hasPermission(perms)) return message.channel.send(embed1);

        const embed2 = new Discord.RichEmbed()
            .setColor(color.red)
            .addField("ERROR: Invalid arguments provided", "You provided incorrect arguments!")
            .addField("Proper usage:", `\`/addclub [Club name] [Club tag] [Role ID]\``)

        if (!args[2] || 
            args[2].startsWith("#") || 
            args[0].startsWith("#") || 
            !isNaN(args[0][0] || 
            isNaN(args[2]))) return message.channel.send(embed2);
        const embed3 = new Discord.RichEmbed()
            .setColor(color.green)
            .setAuthor(message.member.displayName, message.author.displayAvatarURL)
            .addField("**Success! Club added!**", `Added Club EZ ${args[0]} to role ID ${args[2]}!`);

        async function getClubInfo() {
            let club = await brawlStars.getClub(args[1])
            .catch(e => {
                throw new Error(e);
            });
            return club;
        };
        const titleCase = (name) => {
            let lowerName = name.toLowerCase().split(" ");
            for (let i = 0; i < lowerName.length; i++){
                lowerName[i] = lowerName[i][0].toUpperCase() + lowerName[i].slice(1);
            }
            return lowerName.join(" ");
        };
        
        clubName = titleCase(args[0]);
        
        rethink.db("clubs").table("list").insert({
            name: clubName,
            tag: args[1],
            id: args[2]
        }).run(connection, (err, result) => {
            if (err) throw err;
            return message.channel.send(embed3);
        });
    }
};
