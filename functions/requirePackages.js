module.exports = {
  // no other solution came to mind to be able to use functions in every
  // file without re-declaring them in each file
  
  Discord: require("discord.js"),
  get bot() {
    return new this.Discord.Client();
  },
  brawlStarsJS: require('brawlstars.js'),
  get brawlStars() {
    return new this.brawlStarsJS.Client(process.env.BRAWL_TOKEN)
  },
  rethink: require("rethinkdb")
}
