const { brawlStars, Discord, rethink } = require("../functions/requirePackages.js");

let connection;
rethink.connect( {host: process.env.RETHINK_HOST_IP }, function(err, conn) {
    if (err) throw err;
    connection = conn;
})

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
        
        const titleCase = (name) => {
            let lowerName = name.toLowerCase().split(" ");
            for (let i = 0; i < lowerName.length; i++){
                lowerName[i] = lowerName[i][0].toUpperCase() + lowerName[i].slice(1);
            };
            return lowerName.join(" ");
        };
        
        args[0] = titleCase(args[0]);
    
        rethink.db('clubs').table('list').run(connection, (err, cursor) => {
            if (err) throw err;
            cursor.toArray((arrerr, clubList) => {
                if (arrerr) throw arrerr;
                let newClublist = clubList.filter(club => club.name.toUpperCase() !== args[0].toUpperCase());
                if (newClublist.length === clubList.length) return message.channel.send(embed2);
            });
        });

        const embed3 = new Discord.RichEmbed()
            .setColor(color.green)
            .setAuthor(message.member.displayName, message.author.displayAvatarURL)
            .addField("Success! Club removed!", `Removed Club \`${args[0]}\` from the database!`);
        
        rethink.db('clubs').table('list').filter(r.row("name").eq(args[0])).delete().run(connection, (err, result) => {
            if (err) throw err;
            return message.channel.send(embed3);
        });
    }
};
