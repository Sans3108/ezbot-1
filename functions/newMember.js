const { refreshRoles } = require('./refreshRoles.js');
const { getPlayer } = require('./brawlStars.js');
const { db, Discord, brawlStars, bot } = require("./requirePackages.js");
const { color } = require("../config.json");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "stardustbs",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const vision = require("@google-cloud/vision");
const visionClient = new vision.ImageAnnotatorClient();

module.exports = {
  
  verifyMember: async function(member, message) {
    
    let userInfo = db.fetch(`${member.user.id}.info`);
    
    if (message.attachments.size < 1) {
      let errEmb = new Discord.RichEmbed()
      .setColor(color.red)
      .addField("Error: No image found", "Sorry, I didn't find an image in that message! Make sure to only send an image of your profile as shown in the video above.\n\nIf you have any questions, send a message to <@532261291600117780>.");
      let errmsg = message.channel.send(errEmb);
      message.delete();
      setTimeout(() => { errmsg.delete() }, 10000);
    } else {
      for (let imgvalue of message.attachments.values()) {
        
        try {
        cloudinary.v2.uploader.upload(imgvalue.url, async function(error, cresult) {
          
          if (!error) {
            const [result] = await visionClient.textDetection(cresult.secure_url);
            const detections = result.textAnnotations;
            let ocrresult = detections[0].description;
            let hashIndex = ocrresult.lastIndexOf("#");
            let tagArr = [];
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
                tagArr.push("#");
                for (let j = match6.index + 1; j < match7.index; j++) {
                  if (ocrresult[j] === "O") {
                    tagArr.push("0");
                  } else if (ocrresult[j] === "Z") {
                    tagArr.push("2");
                  } else {
                    tagArr.push(ocrresult[j]);
                  }
                }
                break;
              }
              if (ocrresult[i].match(/\n/gm)) {
                break;
              } else {
                if (ocrresult[i] === "O") {
                  tagArr.push("0");
                } else if (ocrresult[i] === "Z") {
                  tagArr.push("2");
                } else {
                  tagArr.push(ocrresult[i]);
                }
              }
            }
            let userTag = tagArr.join("");
            let userProfile = await getPlayer(userTag)
            .catch(e => {
              throw new Error(e);
            });
            if (!userProfile) {
              throw new Error("No profile found");
            };
            db.set(`${member.user.id}.info`, [
              userTag.toUpperCase(),
              userProfile
            ]);
            let foundEmb = new Discord.RichEmbed()
            .setColor(color.blue)
            .addField("Is this you?", "I found a user with the name " + userProfile.name + " and " + userProfile.trophies + " trophies. React with '👍' if it is, and '👎' if it isn't.");
            let foundmsg = message.channel.send(foundEmb);
            await foundmsg.react('👍')
            .then(async () => {
              await foundmsg.react('👎');
            });
            const filter = (reaction, user) => reaction.emoji.name === ':thumbs_up:' || reaction.emoji.name === ':thumbs_down:';
            foundmsg.awaitReactions(filter, { max: 1, time: 30000, errors: [ 'time' ] })
            .then(collected => {
              const reaction = collected.first();
              
              if (reaction.emoji.name === '👍') {
                message.delete();
                foundmsg.delete();
                refreshRoles(member, userTag)
                .catch(e => {
                  throw new Error(e);
                });
              } else {
                message.delete();
                foundmsg.delete();
                throw new Error("Incorrect tag");
              };
            });
          };   
        });
        } catch (error) {
          let errEmb = new Discord.RichEmbed()
          .setColor(color.red)
          .setTitle("Sorry, I couldn't get your roles!")
          .setDescription("Error:\n\n" + error)
          .addField("I gave you access to <#608707624531263505>. Just send a screenshot of your profile there and a moderator will verify you shortly.");
          let verifEmb = new Discord.RichEmbed()
          .setColor(color.red)
          .setTitle("**Verification needed!**")
          .setDescription("Error:\n```" + error + "```")
          .setAuthor(member.user.tag, member.user.displayAvatarURL)
          member.user.send(errEmb);
          member.guild.channels.get("608707624531263505").send(verifEmb);
          if (!message.deleted) message.delete();
        };
      };
    };
  },
  
  newMember: async function(member) {
    
    let userInfo = db.fetch(`${member.user.id}.info`);
    if (!userInfo) {  
      
      let verifyEmb = new Discord.RichEmbed()
      .setAuthor(`<@${member.user.id}>`, member.user.displayAvatarURL)
      .addField("Welcome to Elementz Brawl Stars!", "Just send a screenshot of your profile as shown in the video below to get access to the rest of the server! If you have any questions, send a message to <@532261291600117780>.")
      .setImage("https://media.discordapp.net/attachments/518578295638458378/694625843909230602/image0.gif");
      member.guild.channels.find(c => c.name === "verification").send(verifyEmb);
      
    } else {
      
      let fixingEmb = new Discord.RichEmbed()
      .setColor(color.blue)
      .setTitle("**Welcome back!**")
      .addField("Giving roles..", "Welcome back to Elementz! I'll grab your roles, but it may take up to a minute.");
      
      if (member.roles.find(r => r.name === "SS")) {
        await member.removeRole(member.guild.roles.find(r => r.name === "SS"));
      };
      member.user.send(fixingEmb);
      let err = false;
      try { 
        refreshRoles(member, userInfo[0]);
      } catch (error) {
        err = true;
        let errEmb = new Discord.RichEmbed()
        .setColor(color.red)
        .addField("Uh oh, there was an error!", "Sorry, something went wrong!\nI gave you access to <#608707624531263505>. Just send a screenshot of your Brawl Stars profile there and a Moderator will verify you shortly.");
        
        let verifEmb = new Discord.RichEmbed()
        .setColor(color.red)
        .setTitle("**Verification needed!**")
        .setDescription("Error:\n```" + error + "```")
        .setAuthor(member.user.tag, member.user.displayAvatarURL)
        
        member.user.send(errEmb);
        member.guild.channels.get("608707624531263505").send(verifEmb);
      };
      if (!err) {
        let successEmb = new Discord.RichEmbed()
        .setColor(color.green)
        .addField("Success!", "I gave you your roles back! If I made a mistake, please let a Moderator know!1                                                 ")
      }
    }
  }
  
}
