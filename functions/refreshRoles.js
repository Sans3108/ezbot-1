const { getPlayer } = require("./brawlStars.js");
const { brawlStars, Discord, rethink, connection } = require("./requirePackages.js");

module.exports = {
  refreshRoles: async function(member, tag) {
    
    // Defining variables for later global use
    const player = getPlayer(tag);
    let clubName;
    let clubRole;
    let clubList;
    // Fetching Club list, converting to array
    rethink.db('clubs').table('list').run(connection, (err, cursor) => {
        if (err) throw err;
        cursor.toArray((arrerr, clubsArray) => {
            if (arrerr) throw arrerr;
            clubList = clubsArray;
        });
    });
    
    /**
     * Check if user is in EZ
     * @param {String} name - the name of the user's Club
     */
    function isInEZ(name) {
      
      let clubArr = clubList.filter(clubObj => clubObj.name.toUpperCase() === name.toUpperCase());
      if (!clubArr.length) return false;
      return true;
      
    };
    
    // Getting player's Club info
    if (!player.club) {
      
      clubName = null;
      clubRole = null;
      
    } else {
      
      clubName = player.club.name;
      clubRole = player.club.role;
      
    };
    
    // Gets Club name without "EZ"
    if (clubName.startsWith("EZ")) clubName = clubName.slice(3);
      
    /** 
     * Removes incorrect roles from param member
     * @param {GuildMember} member - the member to remove roles from
     * @param {String} name - the member's Club's name
     * @param {String} role - the member's Club position
     */
    
    async function removeRoles(member, name, role) {
      
      /* 
      Three possible outcomes:
      1. they have the guest role which needs removing
      2. they have an incorrect position role
      3. they have an incorrect Club role
      Outcomes two and three are not mutually exclusive
      But one and two as well as one and three are
      */
      
      // Outcome 1
      if (member.roles.find(r => r.name === "Guest")) {
        if (isInEZ(name)) {
          await member.removeRole(member.guild.roles.find(r => r.name === "Guest"));
        };
      } else {
        
        // Outcome 2
        const possiblePositions = ["Member", "Senior", "Vice President", "President"];
        if (!member.roles.find(r => r.name.toUpperCase() === role.toUpperCase())) {
          
          // Loop through possible position roles
          // until you find the one they *do* have at the moment
          for (let i in possiblePositions) {
            // then remove it.
            if (member.roles.find(r => r.name.toUpperCase() === possiblePositions[i].toUpperCase())) {
              await member.removeRole(member.roles.find(r => r.name.toUpperCase() === possiblePositions[i].toUpperCase()));
            };
          };
        };
        
        // Outcome 3
        if (!member.roles.find(r => r.name.toUpperCase() === name.toUpperCase())) {
          
          // Loop through possible Club roles
          // until you find the one they *do* have at the moment
          for (let i in clubList) {
            // then remove it.
            if (member.roles.find(r => r.name.toUpperCase() === clubList[i].name.toUpperCase())) {
              await member.removeRole(member.roles.find(r => r.name.toUpperCase() === clubList[i].name.toUpperCase()));
            };
          };
        };
      };
    };
    
    /** 
     * Adds correct roles from param member
     * @param {GuildMember} member - the member to remove roles from
     * @param {String} name - the member's Club's name
     * @param {String} role - the member's Club position
     */
    
    async function addRoles(member, name, role) {
      
      /* 
      Three possible outcomes:
      1. they need the guest role
      2. they need a position role
      3. they need a Club role
      Outcomes two and three are not mutually exclusive
      But one and two as well as one and three are
      */
      
      // Outcome 1
      if (!isInEZ(clubName)) {
        await member.addRole(member.guild.roles.find(r => r.name === "Guest"));
      } else {
        
        // Outcome 2
        if (!member.roles.find(r => r.name.toUpperCase() === role.toUpperCase())) {
          await member.addRole(member.roles.find(r => r.name.toUpperCase() === role.toUpperCase()));
        };
        
        // Outcome 3
        if (!member.roles.find(r => r.name.toUpperCase() === name.toUpperCase())) {
          await member.addRole(member.roles.find(r => r.name.toUpperCase() === name.toUpperCase()));
        };
      };
    };
    
    if (!isInEZ(clubName) && member.roles.find(r => r.name === "Guest")) {
      return;
    } else if (member.roles.find(r => r.name.toUpperCase() === clubName.toUpperCase()) && member.roles.find(r => r.name.toUpperCase() === clubRole.toUpperCase())) {
      return;
    } else {
      try {
        removeRoles(member, clubName, clubRole);
        addRoles(member, clubName, clubRole);
      } catch (error) {
        throw new Error(error);
      };
    };
  }
};
