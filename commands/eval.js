function clean(text) {
	if (typeof (text) === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
};

const { brawlStars, db, Discord, rethink } = require("../functions/requirePackages.js");
let connection;
rethink.connect( {host: process.env.RETHINK_HOST_IP }, function(err, conn) {
    if (err) throw err;
    connection = conn;
})

module.exports = {
	name: 'eval',
	description: 'Evaluates the given expression',	
	usage: '[text]',
	ownerOnly: true,
	cooldown: 2,
  bannedGuilds: [],
  allowedGuilds: [],
	execute(message, args, bot, color) {

		try {
			let code = args.join(" ");
			if (code.startsWith('```js') && code.endsWith('```')) {
				code = code.slice(5, -3);
			}

			let evaled = eval(code);

			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);

			message.channel.send(clean(evaled), { code: "xl" });

		} catch (err) {
			console.log(err);
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);

		}
	},
};
