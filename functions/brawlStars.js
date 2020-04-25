const { brawlStars } = require('./requirePackages.js')
const { color } = require("../config.json")

module.exports.getPlayer = async function (tag) {
  const userInfo = await brawlStars.getPlayer(tag);
    
  // Fetch User role from the club object
  if (userInfo.club) {
    const userClub = await brawlStars.getClub(userInfo.club.tag)
    const member = userClub.members.filter(memb => memb.tag === tag)[0];
    if (member.role === 'vicePresident') {
      userInfo.club.role = 'Vice President';
    } else {
      userInfo.club.role = member.role[0].toUpperCase() + member.role.slice(1);
    };
  };
  
  return userInfo;
}
