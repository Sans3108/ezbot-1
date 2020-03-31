const { brawlStars, Discord } = require('./requirePackages.js');
const { color } = require("../config.json");

module.exports = {
  getPlayer: async function(tag) {
    if (!tag.startsWith("#")) {
      tag = "#" + tag;
    };
    tag = tag.toUpperCase();
    let userInfo = await brawlStars.getPlayer(tag)
    .then(async () => {
      function isEmpty(obj) {
        for(let key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        };
        return true;
      };
      if (isEmpty(userInfo.club)) {
        userInfo.club = null;
      } else {
        let userClub = await brawlStars.getClub(userInfo.club.tag)
        .catch(e => {
          throw new Error(e);
        })
        let userObj = userClub.members.filter(obj => obj.tag === tag);
        userInfo.club.role = userObj.role;
        if (userInfo.club.role === "vicePresident") {
          userInfo.club.role = "Vice President";
        } else {
          userInfo.club.role = userInfo.club.role.charAt(0).toUpperCase() + userInfo.club.role.slice(1);
        };
      };
    }, reason => {
      throw new Error(reason);
    });
    return userInfo;
  }
};