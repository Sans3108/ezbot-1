const r = require("rethinkdb");

module.exports = {
  // no other solution came to mind to be able to use functions in every
  // file without re-declaring them in each file
  
  db: require("quick.db"),
  Discord: require("discord.js"),
  get bot() {
    return new this.Discord.Client();
  },
  brawlStarsJS: require('brawlstars.js'),
  get brawlStars() {
    return new this.brawlStarsJS.Client(process.env.BRAWL_TOKEN)
  },
  rethink: r
}

let connection = null;

r.connect( {host: '138.91.122.59', port: 28015}, function(err, conn) {
    if (err) throw err;
    module.exports.connection = conn;
})
