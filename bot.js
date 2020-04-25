const { Discord, bot } = require("./functions/requirePackages.js");

// Calling modules & importing variables
require("dotenv").config()
const { prefix, ownerlist, color } = require("./config.json");
const presences = require("./presences");
const fs = require("fs");

// Defining Discord bot
bot.commands = new Discord.Collection();

// Fetching command files
const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

// Defining cooldowns for commands
const cooldowns = new Discord.Collection();

//Ready event
bot.on("ready", () => {
    console.log("EZ IS READY TO ROLL!");

    // Bot status
    bot.user.setStatus("online");

    // Choose and set a random presence

    const randomPresence = function (obj) {
        const keys = Object.keys(obj);
        return obj[keys[(keys.length * Math.random()) << 0]];
    };

    setInterval(() => {
        let chosen;
        chosen = randomPresence(presences);

        bot.user.setPresence({
            game: {
                name: chosen[1],
                type: chosen[0]
            }
        });
    }, 15000);
});

// Message event

bot.on("message", message => {

    // Delete messages from the bot after using "/eval" such as "Promise pending" (requires configuration for each type of message)

    if (
        message.author.id === bot.user.id &&
        message.content === "```xl\nPromise { <pending> }\n```"
    )
        return message.delete();

    if (!message.content.startsWith(prefix)) return;

    // Defining args and commandName

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Finding command & checking existence

    const command =
        bot.commands.get(commandName) ||
        bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    // Check if command is in a guild

    if (command.guildOnly && message.channel.type !== "text") {
        return message.channel.send("You can't use this command in DMs");
    }

    // Check if the command requires arguments

    if (command.args && !args.length) {
        let replyEmb = new Discord.RichEmbed()
            .setColor(color.red)
            .setAuthor(message.member.displayName, message.author.avatarURL)
            .addField(
                "ERROR: Invalid arguments provided",
                "You didn't provide any arguments!"
            );

        // Specify proper usage if it exists

        if (command.usage) {
            replyEmb.addField(
                "Proper usage:",
                `\`${prefix}${command.name} ${command.usage}\``
            );
        }

        return message.channel.send(replyEmb);
    }

    // Check if banned guild

    if (command.bannedGuilds) {
        if (command.bannedGuilds.find(id => id === message.guild.id)) {
            let emb = new Discord.RichEmbed()
                .setColor(color.red)
                .addField(
                    "ERROR: Banned guild",
                    "Sorry, this command can't be used in this server!"
                );
            return message.channel.send(emb);
        }
    }
        
    // Check if not allowed guild    
        
    if (command.allowedGuilds[0]) {
        if (!command.allowedGuilds.find(id => id === message.guild.id)) {
            let emb = new Discord.RichEmbed()
                .setColor(color.red)
                .addField(
                    "ERROR: Banned guild",
                    "Sorry, this command can't be used in this server!"
                );
            return message.channel.send(emb);
        }
    }
        
    // Checks if command is dev-only

    if (command.ownerOnly) {
        if (!ownerlist.includes(message.author.id)) {
            let emb = new Discord.RichEmbed()
                .setColor(color.red)
                .setDescription("Sorry, this command is only for the developers!");

            return message.channel.send(emb);
        }
    }

    // Manages command cooldown

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;

            let cooldownembed = new Discord.RichEmbed()
                .setColor(color.red)
                .setDescription(
                    `(Cooldown) Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
                );

            return message.channel.send(cooldownembed);
        };
    };

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Executes command

    try {
        command.execute(message, args, bot, color, command, fs);
    } catch (error) {
        console.error(error);

        const erremb = new Discord.RichEmbed()
            .setColor(color.red)
            .setDescription(
                `Sorry, there was a error...\nThe error looks like this:\n\`\`\`${error}\`\`\``
            );

        message.channel.send(erremb);
    }
});

// Bot login
bot.login(process.env.TOKEN);

bot.on("error", console.error);
