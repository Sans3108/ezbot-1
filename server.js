const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db");
const BrawlStars = require("brawlstars");
const bsClient = new BrawlStars.Client({
 token:
   process.env.BSCLIENT_TOKEN
});
const vision = require("@google-cloud/vision");
const visionClient = new vision.ImageAnnotatorClient();
const cloudinary = require("cloudinary");
cloudinary.config({
 cloud_name: "stardustbs",
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET
});
const matchAll = require("match-all");
require("events").EventEmitter.prototype._MaxListeners = 105;
const http = require("http");
const rp = require("request-promise");
const express = require("express");


client.on("ready", () => {
 console.log("ELEMENTZ IS READY TO ROLL");
 let ezguild = client.guilds.get("518276112040853515");
 let ezrole = ezguild.roles.get("536995863050846238");
 let mmrole = ezguild.roles.get("532723522045345812");
 let prevez = "blue";
 let prevmm = "red";
 async function changeColors() {
   if (prevez === "red") {
     await ezrole.setColor("#2688D8");
     prevez = "blue";
   } else {
     await ezrole.setColor("#E14B4B");
     prevez = "red";
   };
   if (prevmm === "red") {
     await mmrole.setColor("#2688D8");
     prevmm = "blue";
   } else {
     await mmrole.setColor("#E14B4B");
     prevmm = "red";
   };
 };
 setInterval(changeColors, 5000);

});

client.on("guildMemberAdd", member => {
 let maMember = client.guilds.get("518276112040853515").members.get(member.id);
 let userInfo = db.fetch(`${maMember.id}.info`);


 async function fixRoles() {
 if (!userInfo) {
   let welcEmb = new Discord.RichEmbed()
     .setColor(0xeba911)
     .setImage("https://media.giphy.com/media/cKsc4H4bg1msdgkBuE/giphy.gif")
     .addField(
       "Welcome to the Elementz family, " + member.user.tag + "!",
       "Before we let you in, we'll just need some verification so we know who you are.\n\nJust send me a picture of your Trophy Road profile as shown in the video below. If you have any questions or concerns, please Direct Message <@532261291600117780>. Thank you for your cooperation."
     );
   member.send(welcEmb);
 } else {
   async function getUserInfo() {
     console.log(userInfo[0]);
     let infotag;
     if (typeof userInfo[0] === "string") infotag = userInfo[0];
     if (typeof userInfo[0] !== "string") infotag = userInfo[0][0];
     db.set(`${maMember.id}.info`, [
       infotag,
       await bsClient.getPlayer(infotag)
     ]);
     userInfo = db.fetch(`${maMember.id}.info`);
   }
   getUserInfo();
   console.log("fetched info");
   async function giveRoles() {
     let tagarg = db.fetch(`${maMember.id}.info`)[0];
     let userProfile = await bsClient.getPlayer(tagarg.toUpperCase());
     if (!db.fetch(`${maMember}.info`))
       await db.push(`${maMember.id}.info`, [tagarg, userProfile]);
     let authorMember = maMember;
     let clubList = db.fetch("clubList");
     let clArray = clubList;
     let guildRole;
     let posRoles = [
       ["Member", "550518379149131776"],
       ["Senior", "550518022939344896"],
       ["Vice President", "550517562623000589"],
       ["President", "550516837234901039"]
     ];
     let grName;
     let isGuest = false;
     let usersclub;
     console.log("defined stuff");
     if (userProfile.club.name.startsWith("EZ")) {
       if (maMember.roles.has("550521408799768587"))
         await maMember.removeRole("550521408799768587");
       let userClub = userProfile.club.name.slice(3);
       async function removeRoles() {
         for (let k = 0; k < clArray.length; k++) {
           for (let j = 0; j < posRoles.length; j++) {
             if (maMember.roles.has(posRoles[j][1])) {
               guildRole = posRoles[j][1];
               grName = posRoles[j][0];
             } else {
               continue;
             }
           }
           if (maMember.roles.has(clArray[k][2])) {
             let removeGR = clArray[k][2];
             let removeGPos = client.guilds
               .get("518276112040853515")
               .roles.find(val => val.name === grName);
             if (!removeGR || !removeGPos) {
               return;
             } else {
               await maMember.removeRoles([removeGR, removeGPos]);
             }
           }
         }
       }
       async function addRoles() {
         for (let i = 0; i < clArray.length; i++) {
           if (
             clArray[i][0] === userClub &&
             userProfile.club.tag === clArray[i][1]
           ) {
             if (authorMember.roles.has("608708416478642227"))
               authorMember.removeRole("608708416478642227");
             await authorMember.addRole(clArray[i][2]);
             usersclub = clArray[i][2];
             for (let j = 0; j < posRoles.length; j++) {
               if (userProfile.club.role === posRoles[j][0]) {
                 guildRole = posRoles[j][1];
                 grName = posRoles[j][0];
               } else {
                 continue;
               }
             }
             await authorMember.addRole(guildRole);
             break;
           }
         }
       }
       await removeRoles().then(() => {
         addRoles();
       });
     } else {
       if (authorMember.roles.has("608708416478642227"))
         authorMember.removeRole("608708416478642227");
       async function removeRoles() {
         console.log("got to removing");
         for (let k = 0; k < clArray.length; k++) {
           for (let j = 0; j < posRoles.length; j++) {
             if (maMember.roles.has(posRoles[j][1])) {
               guildRole = posRoles[j][1];
               grName = posRoles[j][0];
             } else {
               continue;
             }
           }
           if (maMember.roles.has(clArray[k][2])) {
             let removeGR = clArray[k][2];
             let removeGPos = client.guilds
               .get("518276112040853515")
               .roles.find(val => val.name === grName);
             if (!removeGR || !removeGPos) {
               return;
             } else {
               await maMember.removeRoles([removeGR, removeGPos]);
             }
           }
         }
         await authorMember.addRole("550521408799768587");
       }
       removeRoles();
       isGuest = true;
       console.log("done removing");
     }
   }
   giveRoles().then(() => {
     setTimeout(function() {
       maMember.removeRole("550550415767502851");
       console.log("removed role");
     }, 5000);
   });
   member.send(
     "Welcome back to the server! I've given you your roles back, but it might take up to a minute. I might have made a mistake. If so, please let a Moderator know!"
   );
 }
 };
 setTimeout(fixRoles, 15000)
});

client.on("message", message => {
 let userInfo = db.fetch(`${message.author.id}.info`);
 let eazies = db.fetch(`${message.author.id}.eazies`);
 let shop = db.fetch(`shop`);

 let testitem1 = {
   name: "Test Item 1",
   desc: "69420",
   cost: 1,
   code: function testfunc(user) {
     message.channel.send(`${user}, test successful`)
   }

 }

 let testitem2 = {
   name: "Test Item 2",
   desc: "42069",
   cost: 2,
   code: function testfunc2(user) {
     message.channel.send(`${user}, test successful`)
   }
 }
 let testitems = [testitem1, testitem2]

 let testcategory = {
   name: "Test Category",
   items: testitems,
   desc: "ooh la la"
 }

 if (eazies === null) eazies = 0;
 if (shop === null) db.push('shop', testcategory)

 if (message.channel.type === "dm") {
   async function roleVerif() {
     if (message.attachments.size <= 0) {
       return;
     } else {
       if (userInfo)
         return message.channel.send(
           "Hey, you're already verified!\n\nOnly DM this bot for verification upon joining. For any questions or inquiries, please message <@532261291600117780>.\n\nIf there's been a mistake and you haven't received your roles on the main server, message <@532261291600117780> immediately."
         );
       let founderr = false;
       async function errCase(theerr) {
         founderr = true;
         console.log(theerr);
         let sdguild = client.guilds.get("518276112040853515");
         sdguild.members
           .get("288853176210161666")
           .user.send(
             "there was error: \n\n" +
               theerr +
               "\n\n it occured to " +
               message.author.id
           );
         sdguild.members
           .get(message.author.id)
           .removeRole("550550415767502851");
         sdguild.members.get(message.author.id).addRole("608708416478642227");
         let erremb = new Discord.RichEmbed()
           .setAuthor(message.author.username, message.author.avatarURL)
           .setColor(0xff0000)
           .addField(
             "Sorry, something went wrong!",
             "You can blame <@288853176210161666> for that.\n\nFor now, I've given you access to [#manual verification](https://discordapp.com/channels/518276112040853515/608707624531263505/). Please send your screenshot there for a Moderator to manually give you your roles."
           );
         message.channel.send(erremb);
       }
       for (let tvalue of message.attachments.values()) {
         cloudinary.v2.uploader.upload(tvalue.url, function(error, cresult) {
           if (error == null) {
             async function cloudOCR() {
               const [result] = await visionClient.textDetection(
                 cresult.secure_url
               );
               const detections = result.textAnnotations;
               let ocrresult = detections[0].description;
               let hashIndex = ocrresult.lastIndexOf("#");
               let tagString = [];
               for (let i = hashIndex; i < ocrresult.length; i++) {
                 if (!ocrresult[i]) {
                   let regresult = ocrresult.matchAll(/\n/g);
                   let [
                     match1,
                     match2,
                     match3,
                     match4,
                     match5,
                     match6,
                     match7
                   ] = regresult;
                   tagString.push("#");
                   for (let j = match6.index + 1; j < match7.index; j++) {
                     if (ocrresult[j] === "O") {
                       tagString.push("0");
                     } else if (ocrresult[j] === "Z") {
                       tagString.push("2");
                     } else {
                       tagString.push(ocrresult[j]);
                     }
                   }
                   break;
                 }
                 if (ocrresult[i].match(/\n/gm)) {
                   break;
                 } else {
                   if (ocrresult[i] === "O") {
                     tagString.push("0");
                   } else if (ocrresult[i] === "Z") {
                     tagString.push("2");
                   } else {
                     tagString.push(ocrresult[i]);
                   }
                 }
               }
               let sentTag = tagString.join("");
               let userTag = sentTag.slice(1);
               let userProfile = await bsClient.getPlayer(userTag).catch(e => {
                 errCase(e);
                 return;
               });
               if (!userProfile && !founderr) return errCase("no profile");
               db.push(`${message.author.id}.info`, [
                 userTag.toUpperCase(),
                 userProfile
               ]);
               let stardust = client.guilds.get("518276112040853515");
               let authorMember = stardust.members.get(message.author.id);
               let succEmb = new Discord.RichEmbed()
                 .setColor(0x00ff00)
                 .addField(
                   "Found you!",
                   `You're ${userProfile.name} with the tag ${userProfile.tag}, right? I've given you your roles on the [server](https://discordapp.com/channels/518276112040853515/).\n\nIf you need to refresh your roles in the future, just run the command \`/refresh\``
                 )
                 .setThumbnail(userProfile.avatarUrl)
                 .setAuthor(message.author.username, message.author.avatarURL)
                 .setFooter(
                   "If I messed anything up, please let a Moderator know immediately!",
                   "https://images-ext-2.discordapp.net/external/Cs_NAISor0PFLsU9v_TrKkBklarqRBGT576KZIgpCSw/%3Fsize%3D128/https/cdn.discordapp.com/icons/518276112040853515/34a790f3593d4ce624c2f75370d99223.png"
                 );
               if (userProfile.club.name.startsWith("EZ")) {
                 let userClub = userProfile.club.name.slice(3);
                 let clubList = db.fetch("clubList");
                 let clArray = clubList;
                 for (let i = 0; i < clArray.length; i++) {
                   if (
                     clArray[i][0] === userClub &&
                     userProfile.club.tag === clArray[i][1]
                   ) {
                     if (authorMember.roles.has("608708416478642227"))
                       authorMember.removeRole("608708416478642227");
                     if (authorMember.roles.has("550550415767502851"))
                       authorMember.removeRole("550550415767502851");
                     authorMember.addRole(clArray[i][2]);
                     let posRoles = [
                       ["Member", "550518379149131776"],
                       ["Senior", "550518022939344896"],
                       ["Vice President", "550517562623000589"],
                       ["President", "550516837234901039"]
                     ];
                     let guildRole;
                     for (let j = 0; (i = j < posRoles.length); j++) {
                       if (userProfile.club.role === posRoles[j][0]) {
                         guildRole = posRoles[j][1];
                       } else {
                         continue;
                       }
                     }
                     authorMember.addRole(guildRole);
                     message.channel.send(succEmb);
                     break;
                   }
                 }
               } else {
                 if (authorMember.roles.has("608708416478642227"))
                   authorMember.removeRole("608708416478642227");
                 if (authorMember.roles.has("550550415767502851"))
                   authorMember.removeRole("550550415767502851");
                 authorMember.addRole("550521408799768587");
                 message.channel.send(succEmb);
               }
             }
             cloudOCR();
           } else if (cresult == null) {
             console.log(error);
           }
         });
       }
     }
   }
   try {
     roleVerif();
   } catch (error) {
     console.log(error);
     let sdguild = client.guilds.get("518276112040853515");
     sdguild.members
       .get("288853176210161666")
       .user.send(
         "there was error: \n\n" +
           error +
           "\n\n it occured to " +
           message.author.id
       );
     sdguild.members.get(message.author.id).removeRole("550550415767502851");
     sdguild.members.get(message.author.id).addRole("608708416478642227");
     let erremb = new Discord.RichEmbed()
       .setAuthor(message.author.username, message.author.avatarURL)
       .setColor(0xff0000)
       .addField(
         "Sorry, something went wrong!",
         "You can blame <@288853176210161666> for that.\n\nFor now, I've given you access to [#manual verification](https://discordapp.com/channels/518276112040853515/608707624531263505/). Please send your screenshot there for a Moderator to manually give you your roles."
       );
     message.channel.send(erremb);
   }
 }
 if (!message.guild) return;
 if (message.channel.type === "dm") return;
 if (!message.channel.type === "text") return;
 if (message.author.bot) return;
 // Variables
 let gMembs;
 let botOwner = false;
 let modRoles = [
   "Moderator",
   "Admin",
   "Head Admin",
   "Department Head",
   "Chairman"
 ];
 let userModRole = null;
 let mesMemb = message.member;
 if (!mesMemb || !mesMemb.roles)
   client.guilds
     .get("518276112040853515")
     .channels.get("560201821021536276")
     .send(`<@${message.author.id}>'s message did not compute.`);
 if (mesMemb.roles.some(r => modRoles.includes(r.name))) {
   if (mesMemb.roles.find(val => val.name === modRoles[0])) {
     userModRole = "Moderator";
   } else if (mesMemb.roles.find(val => val.name === modRoles[1])) {
     userModRole = "Admin";
   } else if (mesMemb.roles.find(val => val.name === modRoles[2])) {
     userModRole = "Head Admin";
   } else if (mesMemb.roles.find(val => val.name === modRoles[3])) {
     userModRole = "Department Head";
   } else if (mesMemb.roles.find(val => val.name === modRoles[4])) {
     userModRole = "Chairman";
   }
 } else if (
   mesMemb.hasPermission("ADMINISTRATOR") ||
   message.author.id === "288853176210161666"
 ) {
   userModRole = "Administrator";
 }
 if (message.author.id === "288853176210161666") botOwner = true;
 let gm2;
 let clubList = db.fetch(`clubList`);
 let firstMentioned;
 let prefix = "/";
 let msg = message.content.toUpperCase();
 let cont = message.content.slice(prefix.length).split(" ");
 let args = cont.slice(1);
 let argsString = args.join(" ");
 const logchannel = message.guild.channels.get("518578956069240854");
 // Private server: const logchannel = message.guild.channels.get('480860173141803009');
 const mainchat = client.channels.find(val => val.channel === "global chat");
 const autoroleChan = client.channels.find(val => val.channel === "auto role");
 let authorTag;
 let mmmfTag;
 let warnings;
 let warncount;
 let dateobj = new Date();
 let date = dateobj.getUTCDate();
 let monthnum = dateobj.getUTCMonth();
 let year = dateobj.getUTCFullYear();
 let hours = dateobj.getUTCHours();
 let minutes = dateobj.getUTCMinutes();
 let seconds = dateobj.getUTCSeconds();
 let months = [
   "Jan",
   "Feb",
   "Mar",
   "Apr",
   "May",
   "June",
   "July",
   "Aug",
   "Sept",
   "Oct",
   "Nov",
   "Dec"
 ];
 let maBal = db.fetch(`${message.author.id}.money`);
 if (maBal === null) maBal = 0;
 let selfWarnings = db.fetch(`${message.author.id}.warns`);
 if (selfWarnings === null) selfWarnings = 0;
 let selfWarncount = db.fetch(`${message.author.id}.warncount`);
 if (selfWarncount === null) selfWarncount = 0;
 if (message.mentions.members.first()) {
   let firstMentioned = message.mentions.members.first();
   let theBank = db.fetch(`${firstMentioned.id}.money`);
   if (theBank === null) theBank = 0;
   warnings = db.fetch(`${firstMentioned.id}.warns`);
   if (!warnings) warncount = 0;
   if (warnings) warncount = warnings.length;
   mmmfTag = message.mentions.members
     .first()
     .user.tag.slice(message.mentions.members.first().user.username.length);
 }

 let maMember = message.guild.members.get(message.author.id);
 let caembed;
 let sentMessageID;
 let tdl = [];

 if (msg.startsWith(`${prefix}ADDCLUB`)) {
   if (
     !userModRole === "Administrator" &&
     !userModRole === "Chairman" &&
     !botOwner
   )
     return;
   if (!args[2] || args[1].startsWith("#"))
     return message.channel.send(
       "You need 3 arguments: club, club tag, & role ID. e.g. `/addclub Gaming PGPV2R2Q 567658582078914571`"
     );
   db.push("clubList", [args[0], args[1], args[2]]);
   return message.channel.send(
     "Success! Added Club " + args[0] + " to the role with ID " + args[2]
   );
 }

 if (message.content.includes('<@&649015258148503552>') || message.content.includes('<@&560576366232469514>') || message.content.includes('<@&560576306996051969>')) {
   if (userModRole) return;
   if (message.author.bot) return;

   //Deletes the message containing the pings.
   message.delete();

   //Issues a warn for "Pinging unpingable roles"
   authorTag = message.author.tag.slice(message.author.username.length);
   mmmfTag = message.author.tag.slice(message.author.username.length);
   dateobj = new Date();
   date = dateobj.getUTCDate();
   monthnum = dateobj.getUTCMonth();
   year = dateobj.getUTCFullYear();
   hours = dateobj.getUTCHours();
   minutes = dateobj.getUTCMinutes();
   seconds = dateobj.getUTCSeconds();
   months = [
       "Jan",
       "Feb",
       "Mar",
       "Apr",
       "May",
       "June",
       "July",
       "Aug",
       "Sept",
       "Oct",
       "Nov",
       "Dec"
   ];

   let warnReason = "Pinging unpingable roles";

   db.push(`${message.author.id}.warns`, [
       `${months[monthnum]} ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`,
       warnReason,
       `AUTOMOD`
   ]);

   db.add(`${message.author.id}.warncount`, 1);

   let fmwarns = db.fetch(`${message.author.id}.warns`);
   let newWarncount = fmwarns.length;

   let warnedEmbed = new Discord.RichEmbed()
       .setAuthor(
           "Warned " + message.member.displayName + mmmfTag,
           message.author.displayAvatarURL
       )
       .addField("Warned For:", warnReason)
       .addField(
           "Warned By:",
           `AUTOMOD`
       )
       .setFooter(
           `ID: ${
           message.author.id
           } • User now has ${newWarncount} warnings`
       )
       .setColor(0xff0000);

   let warnedLogEmbed = new Discord.RichEmbed()
       .setAuthor(
           `Warned ${
           message.author.displayName
           }${mmmfTag} at ${
           months[monthnum]
           } ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`,
           message.author.displayAvatarURL
       )
       .addField("Warned For:", warnReason)
       .addField("Warned By:", `AUTOMOD`)
       .setFooter(
           `ID: ${
           message.author.id
           } • User now has ${newWarncount} warnings`
       )
       .setColor(0xff0000);

   message.channel.send(warnedEmbed);
   logchannel.send(warnedLogEmbed);


   //Mutes the user for 15 minutes
   message.member.addRole("518892881382080512");
   setTimeout(() => {
       message.member.removeRole("518892881382080512");
   }, 15 * 60000);
   let succEmbed = new Discord.RichEmbed()
       .setTitle("Member muted")
       .setDescription('The member has been muted for 15 minute(s).')
       .setColor([0, 255, 0]);
   message.channel.send(succEmbed);
 }

 if (msg.startsWith(`${prefix}REFRESHALL`) && botOwner) {
    let membArr = message.guild.members.keyArray();
   let ctr = 0;
   let ruif;
   let argtwo;
   let userProfile;
   console.log("Alright, so we're doing this.");
   async function refresh() {
   for (let i = 0; i < membArr.length; i++) {
       let loopMemb = message.guild.members.get(membArr[i]);
       if (!db.fetch(`${loopMemb.id}.info`)) continue;
       if (db.fetch(`${loopMemb.id}.hasrefreshed`)) continue;
       ctr += 1;
       async function doitall() {
       let uif = db.fetch(`${loopMemb.id}.info`);
         async function resetInfo() {
           if (typeof(uif[0]) !== "string") {
         argtwo = await bsClient.getPlayer(uif[0][0]);
         ruif = uif[0][0];
       } else {
         argtwo = await bsClient.getPlayer(uif[0]);
         ruif = uif[0];
       }
           await db.set(`${loopMemb.id}.info`, [ruif, argtwo]);
         };
         resetInfo();
         maMember = loopMemb;
         let authorMember = maMember;
         let clubList = db.fetch("clubList");
         let clArray = clubList;
         let guildRole;
         userProfile = db.fetch(`${membArr[i]}.info`)[1]
         let posRoles = [
           ["Member", "550518379149131776"],
           ["Senior", "550518022939344896"],
           ["Vice President", "550517562623000589"],
           ["President", "550516837234901039"]
         ];
         let grName;
         let isGuest = false;
         let usersclub;
         if (!userProfile || !userProfile.club || !userProfile.club.name.startsWith("EZ")) {
           if (maMember.roles.has("550521408799768587")) await maMember.removeRole("550521408799768587");
           if (maMember.roles.has("582029503241388061")) await maMember.removeRole("582029503241388061");
           if (authorMember.roles.has("608708416478642227")) await authorMember.removeRole("608708416478642227");
           if (authorMember.roles.has("550550415767502851")) await authorMember.removeRole("550550415767502851");
           async function removeRoles() {
             for (let k = 0; k < clArray.length; k++) {
               for (let j = 0; j < posRoles.length; j++) {
                 if (maMember.roles.has(posRoles[j][1])) {
                   guildRole = posRoles[j][1];
                   grName = posRoles[j][0];
                 } else {
                   continue;
                 }
               }
               if (maMember.roles.has(clArray[k][2])) {
                 let removeGR = clArray[k][2];
                 let removeGPos = message.guild.roles.find(
                   val => val.name === grName
                 );
                 if (!removeGR || !removeGPos) {
                   return;
                 } else {
                   await maMember.removeRoles([removeGR, removeGPos]);
                 }
               }
             }
             await authorMember.addRole("550521408799768587");
           }
           removeRoles();
           isGuest = true;
         } else {
           if (maMember.roles.has("550521408799768587")) await maMember.removeRole("550521408799768587");
           if (maMember.roles.has("582029503241388061")) await maMember.removeRole("582029503241388061");
           let userClub = userProfile.club.name.slice(3);
           async function removeRoles() {
             for (let k = 0; k < clArray.length; k++) {
               for (let j = 0; j < posRoles.length; j++) {
                 if (maMember.roles.has(posRoles[j][1])) {
                   guildRole = posRoles[j][1];
                   grName = posRoles[j][0];
                 } else {
                   continue;
                 }
               }
               if (maMember.roles.has(clArray[k][2])) {
                 let removeGR = clArray[k][2];
                 let removeGPos = message.guild.roles.find(
                   val => val.name === grName
                 );
                 if (!removeGR || !removeGPos) {
                   console.log(
                     "error with" + loopMemb
                   );
                   return;
                 } else {
                   await maMember.removeRoles([removeGR, removeGPos]);
                 }
               }
             }
           }
           async function addRoles() {
             for (let l = 0; l < clArray.length; l++) {
               if (
                 clArray[l][0] === userClub &&
                 userProfile.club.tag === clArray[l][1]
               ) {
                 if (authorMember.roles.has("608708416478642227"))
                   authorMember.removeRole("608708416478642227");
                 if (authorMember.roles.has("550550415767502851"))
                   authorMember.removeRole("550550415767502851");
                 await authorMember.addRole(clArray[l][2]);
                 usersclub = clArray[l][2];
                 for (let j = 0; j < posRoles.length; j++) {
                   if (userProfile.club.role === posRoles[j][0]) {
                     guildRole = posRoles[j][1];
                     grName = posRoles[j][0];
                   } else {
                     continue;
                   }
                 }
                 await authorMember.addRole(guildRole);
                 break;
               }
             }
           }
           await removeRoles().then(() => {
             addRoles();
           });
     };
     await db.set(`${loopMemb.id}.hasrefreshed`, true);
   };
     if (ctr > 1) {
     ctr = 0;
     await setTimeout(doitall, 1200)
     } else {
       await doitall()
       .catch(e => {
         console.log(e);
         return;
       });
     };
     };
   };
   refresh();

 }

 if (msg.startsWith(`${prefix}REMOVECLUB`) || msg.startsWith(`${prefix}RC`)) {
   let newlist = [];
   let foundclub = false;
   for (let i = 0; i < clubList.length; i++) {
     if (clubList[i][0].toUpperCase() === args[0].toUpperCase()) {
       foundclub = true;
       for (let j = 0; j < clubList.length; j++) {
         if (j === i) {
           continue;
         } else {
           newlist.push(clubList[j]);
         }
       }
       break;
     } else {
       continue;
     }
   }
   if (!foundclub) {
     return message.channel.send(
       `Error. Couldn't find Club with name \`${args[0]}\`.`
     );
   } else {
     db.set(`clubList`, newlist);
   }
 }

 if (msg.startsWith(`${prefix}REFRESH`)) {
   console.log("can compute");
   if (userModRole && args[0])
     maMember = message.mentions.members.first();
   userInfo = db.fetch(`${maMember.id}.info`);
   let argtwo;
   async function getUserInfo() {

     if (typeof userInfo[0] !== "string") {
       argtwo = await bsClient.getPlayer(userInfo[0][0]);
     } else {
       argtwo = await bsClient.getPlayer(userInfo[0]);
     }
     let argone = userInfo[0];
     if (!typeof argone === "string") argone = userInfo[0][0];
     db.set(`${maMember.id}.info`, [argone, argtwo]);
     userInfo = db.fetch(`${maMember.id}.info`);
   }
   getUserInfo();
   async function giveRoles() {
     let tagarg = db.fetch(`${maMember.id}.info`)[0];
     if (typeof tagarg !== "string") {
       tagarg = db.fetch(`${maMember.id}.info`)[0][0];
     }
     let userProfile = await bsClient.getPlayer(tagarg.toUpperCase());
     // bsClient.getPlayer(db.fetch(`${maMember.id}.info`)[0][0].toUpperCase()).club.name;
     if (!db.fetch(`${maMember}.info`))
       await db.set(`${maMember.id}.info`, [tagarg, userProfile]);
     let authorMember = maMember;
     let clubList = db.fetch("clubList");
     let clArray = clubList;
     let guildRole;
     let posRoles = [
       ["Member", "550518379149131776"],
       ["Senior", "550518022939344896"],
       ["Vice President", "550517562623000589"],
       ["President", "550516837234901039"]
     ];
     let grName;
     let isGuest = false;
     let usersclub;
     if (!userProfile) return message.channel.send("Error. Couldn't get tag.");
     if (userProfile.club.name.startsWith("EZ")) {
       if (maMember.roles.has("550521408799768587"))
         await maMember.removeRole("550521408799768587");
       let userClub = userProfile.club.name.slice(3);
       async function removeRoles() {
         for (let k = 0; k < clArray.length; k++) {
           for (let j = 0; j < posRoles.length; j++) {
             if (maMember.roles.has(posRoles[j][1])) {
               guildRole = posRoles[j][1];
               grName = posRoles[j][0];
             } else {
               continue;
             }
           }
           if (maMember.roles.has(clArray[k][2])) {
             let removeGR = clArray[k][2];
             let removeGPos = message.guild.roles.find(
               val => val.name === grName
             );
             if (!removeGR || !removeGPos) {
               message.channel.send(
                 "Sorry, there's been an error! Please contact a Moderator to have your roles corrected."
               );
               return;
             } else {
               await maMember.removeRoles([removeGR, removeGPos]);
             }
           }
         }
       }
       async function addRoles() {
         for (let i = 0; i < clArray.length; i++) {
           if (
             clArray[i][0] === userClub &&
             userProfile.club.tag === clArray[i][1]
           ) {
             if (authorMember.roles.has("608708416478642227"))
               authorMember.removeRole("608708416478642227");
             if (authorMember.roles.has("550550415767502851"))
               authorMember.removeRole("550550415767502851");
             await authorMember.addRole(clArray[i][2]);
             usersclub = clArray[i][2];
             for (let j = 0; j < posRoles.length; j++) {
               if (userProfile.club.role === posRoles[j][0]) {
                 guildRole = posRoles[j][1];
                 grName = posRoles[j][0];
               } else {
                 continue;
               }
             }
             await authorMember.addRole(guildRole);
             break;
           }
         }
       }
       await removeRoles().then(() => {
         addRoles();
       });
     } else {
       if (authorMember.roles.has("608708416478642227"))
         authorMember.removeRole("608708416478642227");
       if (authorMember.roles.has("550550415767502851"))
         authorMember.removeRole("550550415767502851");
       async function removeRoles() {
         for (let k = 0; k < clArray.length; k++) {
           for (let j = 0; j < posRoles.length; j++) {
             if (maMember.roles.has(posRoles[j][1])) {
               guildRole = posRoles[j][1];
               grName = posRoles[j][0];
             } else {
               continue;
             }
           }
           if (maMember.roles.has(clArray[k][2])) {
             let removeGR = clArray[k][2];
             let removeGPos = message.guild.roles.find(
               val => val.name === grName
             );
             if (!removeGR || !removeGPos) {
               return;
             } else {
               await maMember.removeRoles([removeGR, removeGPos]);
             }
           }
         }
         await authorMember.addRole("550521408799768587");
       }
       removeRoles();
       isGuest = true;
     }
   }
   giveRoles();
 }

 if (msg.startsWith(`${prefix}WHITELIST`) || msg.startsWith(`${prefix}WL`)) {
   let wlemb = new Discord.RichEmbed()
     .setColor(0xffffff)
     .addField(
       "**Whitelist**",
       "The whitelist is a group of Stardust members who help stabilize Clubs that are running low on members. This is one of the few ways to engage with Stardust Leadership, and help the family out. If you would like to sign up for the whitelist, the link is listed below.\n\nFor any questions, please contact <@421819915742347276>.\n\n\n[**Sign up today!**](https://forms.gle/wo3pRzeko8vgMtad8)"
     );
   message.channel.send(wlemb);
 }
 if (msg.startsWith(`${prefix}PROTEAM`) || msg.startsWith(`${prefix}PT`)) {
   let ptemb = new Discord.RichEmbed()
     .setColor(0x00ffff)
     .addField(
       "**Pro Team**",
       "We, like other families, have our own Pro Team. Our team competes outside our family alongside other organizations. If you are already familiar with the game, the Pro Team is the next big step. If you would like to sign up for the Stardust Pro Team, the link is listed below.\n\nFor any questions please contact <@251061721488293890>.\n\n\n[**Sign up today!**](https://forms.gle/2ZL3s1JbZdb53vxW6)"
     );
   message.channel.send(ptemb);
 }

 if (
   msg.startsWith(`${prefix}MANUALVERIFY`) ||
   msg.startsWith(`${prefix}MV`)
 ) {
   if (userModRole) {
     async function manualvf() {
       if (!args[1] || !message.mentions.members.first()) {
         return message.channel.send(
           "Syntax Error. Correct syntax: `/mv @user [tag]`"
         );
       }
       let tagarg = args[1];
       if (args[1].startsWith("#")) tagarg = args[1].slice(1);
       let userProfile = await bsClient.getPlayer(tagarg.toUpperCase());
       if (!db.fetch(`${message.mentions.members.first().id}.info`))
         await db.set(`${message.mentions.members.first().id}.info`, [
           tagarg,
           userProfile
         ]);
       let authorMember = message.mentions.members.first();
       let clubList = db.fetch("clubList");
       let clArray = clubList;
       let guildRole;
       let grName;
       let isGuest = false;
       let usersclub;
       if (!userProfile) return message.channel.send("Error. Invalid tag.");
       if (!userProfile.club) {
         if (authorMember.roles.has("608708416478642227"))
           authorMember.removeRole("608708416478642227");
         if (authorMember.roles.has("550550415767502851"))
           authorMember.removeRole("550550415767502851");
         authorMember.addRole("550521408799768587");
         isGuest = true;
       }
       if (userProfile.club && userProfile.club.name.startsWith("EZ")) {
         let userClub = userProfile.club.name.slice(3);
         for (let i = 0; i < clArray.length; i++) {
           if (
             clArray[i][0] === userClub &&
             userProfile.club.tag === clArray[i][1]
           ) {
             if (authorMember.roles.has("608708416478642227"))
               authorMember.removeRole("608708416478642227");
             if (authorMember.roles.has("550550415767502851"))
               authorMember.removeRole("550550415767502851");
             authorMember.addRole(clArray[i][2]);
             usersclub = clArray[i][2];
             let posRoles = [
               ["Member", "550518379149131776"],
               ["Senior", "550518022939344896"],
               ["Vice President", "550517562623000589"],
               ["President", "550516837234901039"]
             ];
             for (let j = 0; j < posRoles.length; j++) {
               if (userProfile.club.role === posRoles[j][0]) {
                 guildRole = posRoles[j][1];
                 grName = posRoles[j][0];
               } else {
                 continue;
               }
             }
             authorMember.addRole(guildRole);
             break;
           }
         }
         if (!guildRole && !grName) {
           if (authorMember.roles.has("608708416478642227"))
             authorMember.removeRole("608708416478642227");
           if (authorMember.roles.has("550550415767502851"))
             authorMember.removeRole("550550415767502851");
           authorMember.addRole("550521408799768587");
           isGuest = true;
         }
       } else {
         if (authorMember.roles.has("608708416478642227"))
           authorMember.removeRole("608708416478642227");
         if (authorMember.roles.has("550550415767502851"))
           authorMember.removeRole("550550415767502851");
         authorMember.addRole("550521408799768587");
         isGuest = true;
       }
       let rolestr = "and the following role(s):\n\n";
       if (isGuest) {
         rolestr = rolestr + "Guest";
       } else {
         let twostr = message.guild.roles.get(usersclub).name + "\n" + grName;
         rolestr = rolestr + twostr;
       }
       message.channel.send(
         `Done! Assigned user <@${
           message.mentions.members.first().id
         }> the tag ${tagarg.toUpperCase()} ${rolestr}`
       );
     }
     manualvf();
   }
 }

 if (
   msg.startsWith(`${prefix}CLUBS`) ||
   msg.startsWith(`${prefix}CLUBLIST`) ||
   msg.startsWith(`${prefix}FAMILYCLUBS`) ||
   msg.startsWith(`${prefix}FAMILY`) ||
   (msg.startsWith(`${prefix}CL`) && !msg.startsWith(`${prefix}CLE`)) ||
   msg.startsWith(`${prefix}FC`)
 ) {
   let fcemb = new Discord.RichEmbed()
     .setColor(0x00ffff)
     .addField(
       "**Club List**",
       "You may be wondering where to find a list of our official Stardust Family clubs. We have partnered up with Brawland to broadcast our family clubs with real time statistics on their amazing website. Below is a link to our section to find all of our club information.\n\n\n[**Club List**](https://brawland.com/p/stardust)"
     );
   message.channel.send(fcemb);
 }

 if (msg.startsWith(`${prefix}CHEMCALC`)) {
   let redc = args[0];
   let greenc = args[1];
   let bluec = args[2];
   let yellowc = args[3];
   let pinkc = args[4];

   let yFuel = Math.floor(Number(yellowc) / 20);
   let bFuel = Math.floor(Number(bluec) / 12);
   let gFuel = Math.floor(Number(greenc) / 10);
   let pFuel = Math.floor(Number(pinkc) / 5);

   let fuelCombs = [yFuel, bFuel, gFuel, pFuel];
   let numCombs = Math.min.apply(null, fuelCombs);

   let madePacks = numCombs * 5;

   let yRem = Number(yellowc) - numCombs * 20;
   let bRem = Number(bluec) - numCombs * 12;
   let gRem = Number(greenc) - numCombs * 10;
   let pRem = Number(pinkc) - numCombs * 5;

   let packResult = madePacks / 20;
   let redResult = Math.floor((redc / 1500) * 100) / 100;
   let greenResult = Math.floor((gRem / 1500) * 100) / 100;
   let blueResult = Math.floor((bRem / 225) * 100) / 100;
   let yellowResult = Math.floor((yRem / 100) * 100) / 100;
   let pinkResult = Math.floor((pRem / 200) * 100) / 100;
   let totalProfit =
     packResult +
     redResult +
     greenResult +
     blueResult +
     yellowResult +
     pinkResult;

   message.channel.send(
     `**__RESULTS__**\n\n**Input**\nRed: ${redc}\nGreen: ${greenc}\nBlue: ${bluec}\nYellow: ${yellowc}\nPink: ${pinkc}\n\n**Profit**\n\n**Fuel Packs** - ${madePacks} packs - ${packResult} WLs\nRed: ${redResult}\nGreen: ${greenResult}\nBlue: ${blueResult}\nYellow: ${yellowResult}\nPink: ${pinkResult}\n\n**TOTAL EARNINGS: ${totalProfit} WLs**`
   );
 }
 const commands = {
   shop: {
     usage: "`/shop` or `/store`",
     info:
       "Shows a list of items available in the store, as well as the user's current balance.",
     rolereqs: "None"
   },
   ban: {
     usage:
       "`/ba @member [number of days of messages to delete] [reason]`\n**NOTE:** Command parameters in `[]` are optional.",
     info: "Bans the mentioned member",
     rolereqs: "Must be Moderator or above"
   },
   kick: {
     usage:
       "`/kick @member [reason]`\n**NOTE:** Command parameters in `[]` are optional.",
     info: "Kicks the mentioned member",
     rolereqs: "Must be Moderator or above"
   },
   warn: {
     usage:
       "`/warn @member [reason]`\n**NOTE:** Command parameters in `[]` are optional.",
     info: "Warns the mentioned member",
     rolereqs: "Must be Moderator or above"
   },
   warnings: {
     usage: "`/warnings @member`",
     info: "Shows a list of warnings for the mentioned member.",
     rolereqs: "Must be Moderator or above"
   },
   clearwarn: {
     usage: "`/clearwarn @member`",
     info:
       "Clears either a specified warning or all warnings for the mentioned member.",
     rolereqs: "Must be Moderator or above"
   },
   mute: {
     usage: "`/mute @member (# of mins)`",
     info: "Mutes the mentioned member for the specified amount of minutes.",
     rolereqs: "Must be Moderator or above"
   }
 };
 let cmdArray = [
   commands.shop,
   commands.ban,
   commands.kick,
   commands.warn,
   commands.warnings,
   commands.clearwarn,
   commands.mute
 ];

 if (
   msg.startsWith(`${prefix}TDL`) &&
   message.author.id === "288853176210161666"
 ) {
   if (args[0]) {
     let tdlemb = new Discord.RichEmbed()
       .addField(
         "Added to to-do list",
         `Added \`${args.join(" ")}\` to your to-do list!`
       )
       .setColor(0x00ff00);
     tdl.push(args.join(" "));
     message.channel.send(tdlemb);
   } else {
     let tdlemb = new Discord.RichEmbed();
     for (let i = 0; i < tdl.length; i++) {
       tdlemb.addField(tdl[i], "/u200b");
     }
     tdlemb.setColor(0x00ff00);
     message.channel.send(tdlemb);
   }
 }

 if (msg.startsWith(`${prefix}ROLE`)) {
   if (userModRole === null) return;
   if (!args[0] || !message.mentions.members.first()) {
     let warnEmbed = new Discord.RichEmbed()
       .setTitle(`:warning: ERROR :warning:`)
       .addField(
         `User not specfied`,
         "Please specify a valid Discord member to edit roles.\n**Command Format:** `/role @member [roles]`\n**RUN `/help role` FOR MORE INFORMATION**"
       )
       .setColor(0xff0000);
     message.channel.send(warnEmbed);
   } else {
     firstMentioned = message.mentions.members.first();
     let rolecont = message.content.slice(prefix.length).split(", ");
     let newargs = rolecont.slice(1);
     let roles = newargs.slice(1);
     let arrayRL = Number(roles.length) - 1;
     let roleToEdit;
     let roleID;
     let removedRoles = "";
     let addedRoles = "";
     for (let i = 0; i <= arrayRL; i++) {
       if (!message.guild.roles.find(
           val => val.name.toUpperCase() === roles[i].toUpperCase().slice(1)
         )
       )
         return message.channel.send(
           `Error. Couldn't find role named ${roles[i].slice(1)}`
         );
       if (roles[i].startsWith("-")) {
         roleToEdit = message.guild.roles.find(
           val => val.name === roles[i].toUpperCase().slice(1)
         );
         roleID = roleToEdit.id;
         firstMentioned
           .removeRole(roleID)
           .then((removedRoles += `${roleToEdit.name}, `))
           .catch(e => console.log(e));
       } else if (roles[i].startsWith("+")) {
         roleToEdit = message.guild.roles.find(
           val => val.name === roles[i].toUpperCase().slice(1)
         );
         roleID = roleToEdit.id;
         firstMentioned
           .addRole(roleID)
           .then((addedRoles += `${roleToEdit.name}, `))
           .catch(e => console.log(e));
       } else {
         roleToEdit = message.guild.roles.find(
           val => val.name === roles[i].toUpperCase().slice(1)
         );
         roleID = roleToEdit.id;
         if (
           firstMentioned.roles.find(
             val => val.name === roles[i].toUpperCase()
           )
         ) {
           firstMentioned
             .removeRole(roleID)
             .then((removedRoles += `${roleToEdit.name}, `))
             .catch(e => console.log(e));
         } else if (
           !firstMentioned.roles.find(
             val => val.name === roles[i].toUpperCase()
           )
         ) {
           firstMentioned
             .addRole(roleID)
             .then((addedRoles += `${roleToEdit.name}, `))
             .catch(e => console.log(e));
         } else {
           message.channel.send(
             "okay, this error should never even occur, but because it did, dm futuristick/mooose immediately, please"
           );
         }
       }
     }
     authorTag = message.author.tag.slice(message.author.username.length);
     let rolesEmbed = new Discord.RichEmbed()
       .setColor(0x00ff00)
       .setAuthor(
         `Edited roles for ${firstMentioned.displayName}${mmmfTag}`,
         firstMentioned.user.avatarURL
       );
     if (addedRoles === "") {
       rolesEmbed.addField("Added Roles:", "None");
     } else {
       rolesEmbed.addField("Added Roles:", addedRoles);
     }
     if (removedRoles === "") {
       rolesEmbed.addField("Removed Roles:", "None");
     } else {
       rolesEmbed.addField("Removed Roles:", removedRoles);
     }
     rolesEmbed.setFooter(
       `Edited by ${maMember.displayName}${authorTag}`,
       message.author.avatarURL
     );
     logchannel.send(rolesEmbed);
     message.channel.send(rolesEmbed);
   }
 }

 if (msg.startsWith(`${prefix}BAL`) || msg.startsWith(`${prefix}BALANCE`)) {
   let embed = new Discord.RichEmbed()
   .setAuthor(`${message.author.username}`, message.author.avatarURL)
   .setTitle('**Account Balance**')
   .setDescription(eazies + " Eazies")
   message.channel.send(embed)
 }

 if (msg.startsWith(`${prefix}STORE`) || msg.startsWith(`${prefix}SHOP`)) {
   if (!args) {

     let testStr = ""
     for (i = 0; 1 < db.fetch("shop")[0].items.length; i++) {
        testStr += i + "\n";
     }

     let embed = new Discord.RichEmbed()
     .setAuthor(`You have ${eazies} Eazies!`, message.author.avatarURL)
     .setTitle('**Elementz Shop**')
     .setDescription("Run the command `/shop [category]` to learn more about the items in each category! e.g. `/shop roles`")
     .addField("TestCategory", testStr, true)
     .setColor(0x00FF00)
     message.channel.send(embed)
   }

    if (args[0].toUpperCase() === "TEST") {
      let embed = new Discord.RichEmbed()
      .setAuthor(`You have ${eazies} Eazies!`, message.author.avatarURL)
      .setTitle('**Elementz Shop - test**')
      .setDescription('welcoem to shpo')
      .setColor(0x00FF00)
      for (i = 0; 1 < db.fetch("shop")[0].items.length; i++) {
        embed.addField(i.name, i.desc, true);
      }
      message.channel.send(embed)
    }
 }

 if (msg.startsWith(`${prefix}BAN`)) {
   authorTag = message.author.tag.slice(message.author.username.length);
   dateobj = new Date();
   date = dateobj.getUTCDate();
   monthnum = dateobj.getUTCMonth();
   year = dateobj.getUTCFullYear();
   hours = dateobj.getUTCHours();
   minutes = dateobj.getUTCMinutes();
   seconds = dateobj.getUTCSeconds();
   if (userModRole === null) return;
   if (
     !args[0] ||
     !message.mentions.members.first() ||
     !message.mentions.members.first().bannable
   ) {
     let warnEmbed = new Discord.RichEmbed()
       .setTitle(`:warning: ERROR :warning:`)
       .addField(
         `User not specfied`,
         "Please specify a valid Discord member to ban.\n**Command Format:** `/ban @member [number of days of messages to delete] [reason]`\n**NOTE:** Command parameters in `[]` are optional."
       )
       .setColor(0xff0000);
     message.channel.send(warnEmbed);
   } else if (!args[1]) {
     message.mentions.members.first().ban();
     let banEmbed = new Discord.RichEmbed()
       .setAuthor(
         "Banned " + message.mentions.members.first().displayName + mmmfTag,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Banned For:", "No reason specified")
       .addField(
         "Banned By:",
         `${message.member.displayName}${authorTag} - ${userModRole}`
       )
       .setFooter(
         `ID: ${message.mentions.members.first().id} • No messages deleted`
       )
       .setColor(0xff0000);
     let banLogEmbed = new Discord.RichEmbed()
       .setAuthor(
         `Banned ${
           message.mentions.members.first().displayName
         }${mmmfTag} at ${
           months[monthnum]
         } ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Banned For:", "No reason specified")
       .addField("Banned By:", `${message.member.displayName}${authorTag}`)
       .setFooter(
         `ID: ${message.mentions.members.first().id} • No messages deleted`
       )
       .setColor(0xff0000);
     message.channel.send(banEmbed);
     logchannel.send(banLogEmbed);
   } else if (isNaN(args[1])) {
     let banReasonSliced = args.slice(1);
     let banReason = banReasonSliced.join(" ");
     message.mentions.members.first().ban(banReason);
     let banEmbed = new Discord.RichEmbed()
       .setAuthor(
         "Banned " + message.mentions.members.first().displayName + mmmfTag,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Banned For:", banReason)
       .addField(
         "Banned By:",
         `${message.member.displayName}${authorTag} - ${userModRole}`
       )
       .setFooter(
         `ID: ${message.mentions.members.first().id} • No messages deleted`
       )
       .setColor(0xff0000);
     let banLogEmbed = new Discord.RichEmbed()
       .setAuthor(
         `Banned ${
           message.mentions.members.first().displayName
         }${mmmfTag} at ${
           months[monthnum]
         } ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Banned For:", banReason)
       .addField("Banned By:", `${message.member.displayName}${authorTag}`)
       .setFooter(
         `ID: ${message.mentions.members.first().id} • No messages deleted`
       )
       .setColor(0xff0000);
     message.channel.send(banEmbed);
     logchannel.send(banLogEmbed);
   } else if (!isNaN(args[1]) && args[2]) {
     let banReasonSliced = args.slice(2);
     let banReason = banReasonSliced.join(" ");
     message.mentions.members
       .first()
       .ban({ days: Number(args[1]), reason: banReason });
     let banEmbed = new Discord.RichEmbed()
       .setAuthor(
         "Banned " + message.mentions.members.first().displayName + mmmfTag,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Banned For:", banReason)
       .addField(
         "Banned By:",
         `${message.member.displayName}${authorTag} - ${userModRole}`
       )
       .setFooter(
         `ID: ${message.mentions.members.first().id} • ${
           args[1]
         } days of messages deleted`
       )
       .setColor(0xff0000);
     let banLogEmbed = new Discord.RichEmbed()
       .setAuthor(
         `Banned ${
           message.mentions.members.first().displayName
         }${mmmfTag} at ${
           months[monthnum]
         } ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Banned For:", banReason)
       .addField("Banned By:", `${message.member.displayName}${authorTag}`)
       .setFooter(
         `ID: ${message.mentions.members.first().id} • ${
           args[1]
         } days of messages deleted`
       )
       .setColor(0xff0000);
     message.channel.send(banEmbed);
     logchannel.send(banLogEmbed);
   } else if (!isNaN(args[1]) && !args[2]) {
     let banReasonSliced = args.slice(2);
     let banReason = banReasonSliced.join(" ");
     message.mentions.members.first().ban(Number(args[1]));
     let banEmbed = new Discord.RichEmbed()
       .setAuthor(
         "Banned " + message.mentions.members.first().displayName + mmmfTag,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Banned For:", "No reason specified")
       .addField(
         "Banned By:",
         `${message.member.displayName}${authorTag} - ${userModRole}`
       )
       .setFooter(
         `ID: ${message.mentions.members.first().id} • ${
           args[1]
         } days of messages deleted`
       )
       .setColor(0xff0000);
     let banLogEmbed = new Discord.RichEmbed()
       .setAuthor(
         `Banned ${
           message.mentions.members.first().displayName
         }${mmmfTag} at ${
           months[monthnum]
         } ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Banned For:", "No reason specified")
       .addField("Banned By:", `${message.member.displayName}${authorTag}`)
       .setFooter(
         `ID: ${message.mentions.members.first().id} • ${
           args[1]
         } days of messages deleted`
       )
       .setColor(0xff0000);
     message.channel.send(banEmbed);
     logchannel.send(banLogEmbed);
   } else {
     return message.channel.send(
       "error\n\nif you're seeing this, congratulations; you've managed to find a set of circumstances that shouldn't physically be possible. please dm Futuristick#7633 immediately"
     );
   }
 }

 if (msg.startsWith(`${prefix}KICK`)) {
   authorTag = message.author.tag.slice(message.author.username.length);
   dateobj = new Date();
   date = dateobj.getUTCDate();
   monthnum = dateobj.getUTCMonth();
   year = dateobj.getUTCFullYear();
   hours = dateobj.getUTCHours();
   minutes = dateobj.getUTCMinutes();
   seconds = dateobj.getUTCSeconds();
   if (userModRole === null) return;
   if (
     !args[0] ||
     !message.mentions.members.first() ||
     !message.mentions.members.first().kickable
   ) {
     let warnEmbed = new Discord.RichEmbed()
       .setTitle(`:warning: ERROR :warning:`)
       .addField(
         `User not specfied`,
         "Please specify a valid Discord member to kick.\n**Command Format:** `/kick @member [reason]`\n**NOTE:** Command parameters in `[]` are optional."
       )
       .setColor(0xff0000);
     message.channel.send(warnEmbed);
   } else if (!args[1]) {
     message.mentions.members.first().kick();
     let banEmbed = new Discord.RichEmbed()
       .setAuthor(
         "Kicked " + message.mentions.members.first().displayName + mmmfTag,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Kicked For:", "No reason specified")
       .addField(
         "Kicked By:",
         `${message.member.displayName}${authorTag} - ${userModRole}`
       )
       .setFooter(
         `ID: ${message.mentions.members.first().id} • No messages deleted`
       )
       .setColor(0xff0000);
     let banLogEmbed = new Discord.RichEmbed()
       .setAuthor(
         `Kicked ${
           message.mentions.members.first().displayName
         }${mmmfTag} at ${
           months[monthnum]
         } ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Kicked For:", "No reason specified")
       .addField("Kicked By:", `${message.member.displayName}${authorTag}`)
       .setFooter(
         `ID: ${message.mentions.members.first().id} • No messages deleted`
       )
       .setColor(0xff0000);
     message.channel.send(banEmbed);
     logchannel.send(banLogEmbed);
   } else if (args[1]) {
     let kickReasonSliced = args.slice(1);
     let kickReason = kickReasonSliced.join(" ");
     message.mentions.members.first().kick(kickReason);
     let banEmbed = new Discord.RichEmbed()
       .setAuthor(
         "Kicked " + message.mentions.members.first().displayName + mmmfTag,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Kicked For:", kickReason)
       .addField(
         "Kicked By:",
         `${message.member.displayName}${authorTag} - ${userModRole}`
       )
       .setFooter(`ID: ${message.mentions.members.first().id}`)
       .setColor(0xff0000);
     let banLogEmbed = new Discord.RichEmbed()
       .setAuthor(
         `Kicked ${
           message.mentions.members.first().displayName
         }${mmmfTag} at ${
           months[monthnum]
         } ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Kicked For:", kickReason)
       .addField("Kicked By:", `${message.member.displayName}${authorTag}`)
       .setFooter(`ID: ${message.mentions.members.first().id}`)
       .setColor(0xff0000);
     message.channel.send(banEmbed);
     logchannel.send(banLogEmbed);
   } else {
     return message.channel.send(
       "error\n\nif you're seeing this, congratulations; you've managed to find a set of circumstances that shouldn't physically be possible. please dm Futuristick#7633 immediately"
     );
   }
 }

 if (msg.startsWith(`${prefix}EVAL`) && !msg.startsWith(`${prefix}EVALDEL`)) {
   if (message.author.id === "288853176210161666") {
     eval(args.join(" "));
   } else {
     return message.channel.send(
       "hey, how do you even know this command.. <@288853176210161666>!"
     );
   }
 }

 if (msg.startsWith(`${prefix}EVALDEL`)) {
   if (message.author.id === "288853176210161666") {
     eval(args.join(" "));
     message.delete;
   } else {
     return message.channel.send(
       "hey, how do you even know this command.. <@288853176210161666>!"
     );
   }
 }

 if (msg.startsWith(`${prefix}AUTOROLE`)) {
   if (message.channel.name === "✏auto role") {
     let assignedRole;
     message.delete();
     switch (argsString.toUpperCase()) {
       case "RED":
         maMember.addRole("531357176082595850");
         assignedRole = "Red";
         break;
       case "ORANGE":
         maMember.addRole("531357242159661077");
         assignedRole = "Orange";
         break;
       case "YELLOW":
         maMember.addRole("531357291350589452");
         assignedRole = "Yellow";
         break;
       case "GREEN":
         maMember.addRole("531357331414581259");
         assignedRole = "Green";
         break;
       case "BLUE":
         maMember.addRole("531357372619423746");
         assignedRole = "Blue";
         break;
       case "INDIGO":
         maMember.addRole("531357427556286464");
         assignedRole = "Indigo";
         break;
       case "VIOLET":
         maMember.addRole("531357471130779650");
         assignedRole = "Violet";
         break;
       case "STUDENT":

       default:
         message.channel
           .send("Error. You have not specified a role to receive.")
           .then(msg => {
             msg.delete(5000);
           });
         break;
     }
   }
 }

 if (msg.startsWith(`${prefix}WARN`) && !msg.startsWith(`${prefix}WARNI`)) {
   if (userModRole === null) return;
   if (!args[0] || !message.mentions.members.first()) {
     let warnEmbed = new Discord.RichEmbed()
       .setTitle(`:warning: ERROR :warning:`)
       .addField(
         `User not specfied`,
         "Please specify a Discord user to warn.\n**Command Format:** `/warn @user [reason]`\n**NOTE:** Command parameters in `[]` are optional."
       );
     message.channel.send(warnEmbed);
   } else {
     authorTag = message.author.tag.slice(message.author.username.length);
     mmmfTag = message.mentions.members
       .first()
       .user.tag.slice(message.mentions.members.first().user.username.length);
     dateobj = new Date();
     date = dateobj.getUTCDate();
     monthnum = dateobj.getUTCMonth();
     year = dateobj.getUTCFullYear();
     hours = dateobj.getUTCHours();
     minutes = dateobj.getUTCMinutes();
     seconds = dateobj.getUTCSeconds();
     months = [
       "Jan",
       "Feb",
       "Mar",
       "Apr",
       "May",
       "June",
       "July",
       "Aug",
       "Sept",
       "Oct",
       "Nov",
       "Dec"
     ];
     let userwarns = db.fetch(`${message.mentions.members.first().id}.warns`);
     let warnReason;
     if (args[1]) {
       let warnReasonArray = args.slice(1);
       warnReason = warnReasonArray.join(" ");
     } else {
       warnReason = "No reason specified";
     }
     db.push(`${message.mentions.members.first().id}.warns`, [
       `${months[monthnum]} ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`,
       warnReason,
       `${message.member.displayName}${authorTag} - ${userModRole}`
     ]);
     db.add(`${message.mentions.members.first().id}.warncount`, 1);
     let fmwarns = db.fetch(`${message.mentions.members.first().id}.warns`);
     let newWarncount = fmwarns.length;
     let warnedEmbed = new Discord.RichEmbed()
       .setAuthor(
         "Warned " + message.mentions.members.first().displayName + mmmfTag,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Warned For:", warnReason)
       .addField(
         "Warned By:",
         `${message.member.displayName}${authorTag} - ${userModRole}`
       )
       .setFooter(
         `ID: ${
           message.mentions.members.first().id
         } • User now has ${newWarncount} warnings`
       )
       .setColor(0xff0000);
     let warnedLogEmbed = new Discord.RichEmbed()
       .setAuthor(
         `Warned ${
           message.mentions.members.first().displayName
         }${mmmfTag} at ${
           months[monthnum]
         } ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`,
         message.mentions.members.first().user.avatarURL
       )
       .addField("Warned For:", warnReason)
       .addField("Warned By:", `${message.member.displayName}${authorTag}`)
       .setFooter(
         `ID: ${
           message.mentions.members.first().id
         } • User now has ${newWarncount} warnings`
       )
       .setColor(0xff0000);
     message.channel.send(warnedEmbed);
     logchannel.send(warnedLogEmbed);
   }
 }

 if (msg.startsWith(`${prefix}WARNINGS`)) {
   if (userModRole === null) return;
   warnings = db.fetch(`${message.mentions.members.first().id}.warns`);
   if (!warnings) {
     authorTag = message.author.tag.slice(message.author.username.length);
     let warningsEmbed = new Discord.RichEmbed()
       .setColor(0xffff00)
       .setAuthor(
         `${
           message.mentions.members.first().displayName
         }${mmmfTag} has no current warnings.`,
         message.mentions.members.first().user.avatarURL
       )
       .setFooter(
         `Requested by ${message.member.displayName}${authorTag}`,
         message.author.avatarURL
       );
     return message.channel.send(warningsEmbed);
   }
   authorTag = message.author.tag.slice(message.author.username.length);
   if (!args[0] || !message.mentions.members.first()) {
     let warnEmbed = new Discord.RichEmbed()
       .setTitle(`:warning: ERROR :warning:`)
       .addField(
         `User not specfied`,
         "Please specify a valid Discord member to check warnings for.\n**Command Format:** `/warnings @member`"
       )
       .setColor(0xff0000);
     message.channel.send(warnEmbed);
   } else {
     warnings = db.fetch(`${message.mentions.members.first().id}.warns`);
     let warningsEmbed = new Discord.RichEmbed()
       .setColor(0xffff00)
       .setAuthor(
         `Warnings for ${
           message.mentions.members.first().displayName
         }${mmmfTag}`,
         message.mentions.members.first().user.avatarURL
       );
     for (let i = 0; i < warnings.length; i++) {
       if (i === 24) {
         message.channel.send(warningsEmbed);
         warningsEmbed = new Discord.RichEmbed().setColor(0xffff00);
       }
       warningsEmbed.addField(
         `${warnings[i][0]} - by ${warnings[i][2]}`,
         `**Reason:** ${warnings[i][1]}`,
         true
       );
     }
     authorTag = message.author.tag.slice(message.author.username.length);
     warningsEmbed.setFooter(
       `Requested by ${message.member.displayName}${authorTag}`,
       message.author.avatarURL
     );
     message.channel.send(warningsEmbed);
   }
 }

 if (msg.startsWith(`${prefix}CLEARWARN`)) {
   if (userModRole === null) return;
   if (!args[0] || !message.mentions.members.first()) {
     let warnEmbed = new Discord.RichEmbed()
       .setTitle(`:warning: ERROR :warning:`)
       .addField(
         `User not specfied`,
         "Please specify a valid Discord member to clear warnings for.\n**Command Format:** `/clearwarn @member`"
       )
       .setColor(0xff0000);
     message.channel.send(warnEmbed);
     return;
   } else {
     authorTag = message.author.tag.slice(message.author.username.length);
     let commColEmb = new Discord.RichEmbed()
       .setColor(0x0000ff)
       .setAuthor(
         `Clearing warning(s) for ${
           message.mentions.members.first().displayName
         }${mmmfTag}`,
         message.mentions.members.first().user.avatarURL
       )
       .setFooter(
         `This command has been initiated by ${message.member.displayName}${authorTag}`,
         message.author.avatarURL
       )
       .addField(
         `Please enter the number beside the warning you would like to remove.`,
         `If you would like to clear all warnings for the mentioned user, please enter "all".\nEnter "cancel" to cancel the command. \nThe command will end either after 20 seconds or if you enter an incorrect value.`
       );
     let warnsEmbed = new Discord.RichEmbed().setColor(0x0000ff);
     async function sendEmbeds() {
       for (let i = 0; i < warncount; i++) {
         if (i === 24) {
           message.channel.send(warnsEmbed);
           warnsEmbed = new Discord.RichEmbed().setColor(0x0000ff);
         }
         warnsEmbed.addField(
           `[${i}] ${warnings[i][0]} - by ${warnings[i][2]}`,
           `**Reason:** ${warnings[i][1]}`,
           true
         );
       }
       await message.channel.send(warnsEmbed);
       await message.channel.send(commColEmb);
     }
     sendEmbeds();
     authorTag = message.author.tag.slice(message.author.username.length);
     mmmfTag = message.mentions.members
       .first()
       .user.tag.slice(message.mentions.members.first().user.username.length);
     dateobj = new Date();
     date = dateobj.getUTCDate();
     monthnum = dateobj.getUTCMonth();
     year = dateobj.getUTCFullYear();
     hours = dateobj.getUTCHours();
     minutes = dateobj.getUTCMinutes();
     seconds = dateobj.getUTCSeconds();
     months = [
       "Jan",
       "Feb",
       "Mar",
       "Apr",
       "May",
       "June",
       "July",
       "Aug",
       "Sept",
       "Oct",
       "Nov",
       "Dec"
     ];
     let commandAuthor = message.author;
     let toClear = message.mentions.members.first();
     let warnDB = db.fetch(`${toClear.id}.warns`);
     let filter = response => response.author.id === message.author.id;
     message.channel
       .awaitMessages(filter, { max: 1, time: 20000 })
       .then(collected => {
         if (collected.first().content.toUpperCase() === "CANCEL") {
           return collected.first().channel.send("Cancelled the command!");
         }
         if (collected.first().content.toUpperCase() === "ALL") {
           let warnlength = warnings.length;
           warnDB = db.fetch(`${toClear.id}.warns`);
           for (let i = warnlength; i >= 0; i--) {
             warnDB.splice(i, 1);
             db.set(`${toClear.id}.warns`, warnDB);
             warnDB = db.fetch(`${toClear.id}.warns`);
           }
           let clearedEmbed = new Discord.RichEmbed()
             .setAuthor(
               `Cleared all warnings for ${toClear.displayName}${mmmfTag} at ${months[monthnum]} ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`,
               toClear.user.avatarURL
             )
             .addField(
               `Cleared By:`,
               `${
                 collected
                   .first()
                   .guild.members.get(collected.first().author.id).displayName
               }${authorTag}`
             )
             .setColor(0x0000ff);
           logchannel.send(clearedEmbed);
           collected.first().channel.send(clearedEmbed);
           return;
         }
         if (!isNaN(collected.first().content)) {
           if (warnDB[Number(collected.first().content)] === undefined) return;
           warnDB = db.fetch(`${toClear.id}.warns`);
           let clearedEmbed = new Discord.RichEmbed()
             .setAuthor(
               `Cleared warning number ${collected.first().content} for ${
                 toClear.displayName
               }${mmmfTag} at ${
                 months[monthnum]
               } ${date}, ${year} ${hours}:${minutes}:${seconds} UTC`,
               toClear.user.avatarURL
             )
             .addField(
               "Warning Info:",
               `Warned at ${warnDB[Number(collected.first().content)][0]} by ${
                 warnDB[Number(collected.first().content)][2]
               }\n\n**Reason**: ${
                 warnDB[Number(collected.first().content)][1]
               }`
             )
             .addField(
               "Cleared By:",
               `${
                 collected
                   .first()
                   .guild.members.get(collected.first().author.id).displayName
               }${authorTag}`
             )
             .setColor(0x00ff00);
           warnDB.splice(Number(collected.first().content), 1);
           db.set(`${toClear.id}.warns`, warnDB);
           warnDB = db.fetch(`${toClear.id}.warns`);
           logchannel.send(clearedEmbed);
           return collected.first().channel.send(clearedEmbed);
         } else if (
           !collected.first().content.toUpperCase() === "ALL" &&
           !collected.first().content.toUpperCase() === "CANCEL"
         ) {
           return collected
             .first()
             .channel.send(
               "Error. Invalid input. Please run the command again."
             );
         }
       })
       .catch(e => console.log(e));
   }
 }

 if (msg.startsWith(`${prefix}MUTE`)) {
   if (!userModRole === null) {
     if (!args[0]) {
       let errEmbed = new Discord.RichEmbed()
         .setTitle(":warning: ERROR :warning:")
         .addField(
           "Member not specified",
           "You must specify a member to mute. \n**Command Format:** `/mute @user [# of mins]`"
         )
         .setColor([255, 0, 0]);
       return message.channel.send(errEmbed);
     } else if (!message.mentions.members.first()) {
       let errEmbed = new Discord.RichEmbed()
         .setTitle(":warning: ERROR :warning:")
         .addField(
           "Member not specified",
           "You must specify a member to mute. \n**Command Format:** `/mute @user [# of mins]`"
         )
         .setColor([255, 0, 0]);
       return message.channel.send(errEmbed);
     } else if (!args[1]) {
       let errEmbed = new Discord.RichEmbed()
         .setTitle(":warning: ERROR :warning:")
         .addField(
           "Time limit not specified",
           "You must specify a length of time to mute the member for. \n**Command Format:** `/mute @user [# of mins]`"
         )
         .setColor([255, 0, 0]);
       return message.channel.send(errEmbed);
     } else {
       firstMentioned.addRole("518892881382080512");
       if (!isNaN(args[1])) {
         setTimeout(() => {
           firstMentioned.removeRole("518892881382080512");
         }, args[1] * 60000);
         let succEmbed = new Discord.RichEmbed()
           .setTitle("Success!")
           .addField(
             "Member muted",
             `The member has been muted for ` + args[1] + ` minute(s).`
           )
           .setColor([0, 255, 0]);
         return message.channel.send(succEmbed);
       } else {
         let errEmbed = new Discord.RichEmbed()
           .setTitle(":warning: ERROR :warning:")
           .addField(
             "Time limit not specified",
             "You must specify a length of time to mute the member for. \n**Command Format:** `/mute @user [# of mins]`"
           )
           .setColor([255, 0, 0]);
         return message.channel.send(errEmbed);
       }
     }
   }
 }

 if (msg.startsWith(`${prefix}HELP`)) {
   let cmdusage;
   if (!args[0]) {
     const helpEmbed = new Discord.RichEmbed()
       .setFooter(
         `Requested by ${message.author.username}`,
         message.author.avatarURL
       )
       .setColor(0x00ffff)
       .addField(
         "Command List",
         "Enter `/help [command]` for more info on a command."
       );
     for (let key in commands) {
       if (!commands.hasOwnProperty(key)) continue;
       let obj = commands[key];
       for (let prop in obj) {
         if (!obj.hasOwnProperty(prop)) continue;
         if (prop === "usage") {
           cmdusage = obj[prop];
           helpEmbed.addField("/" + key, cmdusage);
         }
       }
     }
     return message.channel.send(helpEmbed);
   } else if (args[0] === "link") {
     const viceEmbed = new Discord.RichEmbed()
       .setTitle("/link Command")
       .setAuthor(
         `Requested by ${message.author.username}`,
         message.author.avatarURL
       )
       .setDescription("Information on the `/link` command")
       .addField("Syntax", "`/link` @user")
       .addField(
         "Function",
         "Links a Discord user to their Brawl Stars tag, assigning any roles needed"
       )
       .addField("Requirements", "You must be Royal Servant or above")
       .setFooter(
         "This help message is brought to you by the Royalty family",
         "https://i.imgur.com/7Ut6i8F.jpg"
       );
     return message.channel.send(viceEmbed);
   } else if (args[0] === "help") {
     return message.channel.send(
       "Oh, come on. Did you really think that would work?"
     );
   } else if (args[0] === "mute") {
     const muteEmbed = new Discord.RichEmbed()
       .setTitle("/mute Command")
       .setAuthor(
         `Requested by ${message.author.username}`,
         message.author.avatarURL
       )
       .setDescription("Information on the `/mute` command")
       .addField("Syntax", "`/mute` @user [# of mins]")
       .addField(
         "Function",
         "Mutes the mentioned user for specified number of minutes"
       )
       .addField("Requirements", "You must be a Moderator or above")
       .setFooter(
         "This help message is brought to you by the Royalty family",
         "https://i.imgur.com/7Ut6i8F.jpg"
       );
     return message.channel.send(muteEmbed);
   } else if (args[0] === "purge") {
     const purgeEmbed = new Discord.RichEmbed()
       .setTitle("/purge Command")
       .setAuthor(
         `Requested by ${message.author.username}`,
         message.author.avatarURL
       )
       .setDescription("Information on the `/purge` command")
       .addField("Syntax", "`/purge` [# of messages]")
       .addField(
         "Function",
         "Purges the specified number of messages from the chat"
       )
       .addField("Requirements", "You must be a Moderator or above")
       .setFooter(
         "This help message is brought to you by the Royalty family",
         "https://i.imgur.com/7Ut6i8F.jpg"
       );
     return message.channel.send(purgeEmbed);
   }
 }
});

client.login(process.env.DISCORD_TOKEN);
