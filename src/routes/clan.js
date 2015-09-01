import mongoose from 'mongoose';
import _ from 'lodash';

const CONFLICT = 'senso-update-conflict';

function arraysEqual (a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (! _.isEqual(a[i], b[i])) return false;
  }
  return true;
}

let uristring = process.env.MONGODB_URI || 'mongodb://localhost/senso';

mongoose.connect(uristring, (err, res) => {
  if (err) {
    console.log('Error connecting to db', err);
  } else {
    console.log('Succeeded in connection to db');
  }
});


// Database schema
let clanSchema = new mongoose.Schema({
  name: { type: String },
  clanID: { type: String },
  clanType: { type: String },
  warFrequency: { type: String },
  location: { type: String },
  members: { type: Array, 'default': [] },
  warMembers: { type: Array, 'default': [] },
  inWar: { type: Boolean, 'default': false },
  warMap: { type: Array, 'default': [] },
  description: { type: String, 'default': 'No description.' },
  level: { type: Number, 'default': 1 },
  joinRequests: { type: Array, 'default': [] }
});
let Clan = mongoose.model('clan', clanSchema);


let clan = {
  // Create a new clan - POST
  createClan: (req, res) => {
    let data = req.body;

    Clan.count({ clanID: data.clanID }, (err, count) => {
      // Error if the clan exists.
      if (count > 0) {
        res.json({ error: 'Clan already exists' });
      } else {
        // Else, create a clan object and save.
        let aClan = new Clan({
          name: data.name,
          clanID: data.clanID,
          clanType: data.clanType,
          warFrequency: data.warFrequency,
          location: data.location,
          members: [],
          warMembers: [],
          inWar: false,
          warMap: [],
          description: data.description,
          level: data.level
        });
        aClan.save((err, obj) => {
          if (err) {
            res.json({ error: err });
          } else {
            res.json({ success: true });
          }
        });
      }
    })
  },

  // Return basic clan data - GET
  // Data: clan name,
  //       clan id,
  //       total number of members.
  clanDetails: (req, res) => {
    Clan.findOne({ clanID: req.params.clanID }).exec((err, result) => {
      res.json({
        name: result.name,
        clanID: result.clanID,
        totalMembers: result.members.length,
        description: result.description,
        level: result.level
      });
    })
  },

  // Returns clan members list - GET
  clanMembers: (req, res) => {
    Clan.findOne({ clanID: req.params.clanID }).exec((err, result) => {
      res.json({ members: result.members });
    });
  },

  // Returns clan war ready members list - GET
  warReadyMembers: (req, res) => {
    Clan.findOne({ clanID: req.params.clanID }).exec((err, result) => {
      let readyMembers = _.filter(result.members, (members) => {
        return members.war === true;
      });
      res.json(readyMembers);
    });
  },

  // Returns members in war list - GET
  warMembers: (req, res) => {
    Clan.findOne({ clanID: req.params.clanID }).exec((err, result) => {
      res.json(result.warMembers);
    });
  },

  // Update clan details - PUT
  // Update description and level only (for now).
  clanDetailsUpdate: (req, res) => {
    let data = req.body;
    Clan.findOne({ clanID: req.params.clanID }, (err, rObj) => {
      _.assign(rObj, req.data);
      rObj.save((err, result) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json({ success: true });
        }
      });
    });
  },

  // Update clan members - PUT
  clanMembersUpdate: (req, res) => {
    let data = req.body;
    Clan.findOne({ clanID: req.params.clanID }, (err, rObj) => {
      rObj.members = data.members;
      rObj.save((err, result) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json({ success: true });
        }
      });
    });
  },

  // Update war members - PUT
  warMembersUpdate: (req, res) => {
    let data = req.body;
    Clan.findOne({ clanID: req.params.clanID }, (err, rObj) => {
      if (! arraysEqual(data.initWarMembers, rObj.warMembers)) {
        console.log('data not the same');
        // get war ready members
        let readyMembers = _.filter(rObj.members, (member) => {
          return member.war === true;
        });
        // return both war members and war ready members
        res.json({
          success: false, reason: CONFLICT,
          newData: {
            warMembers: rObj.warMembers,
            warReadyMembers: readyMembers
          }
        });
      } else {
        rObj.warMembers = data.warMembers;
        rObj.save((err, result) => {
          if (err) {
            res.json({ error: err });
          } else {
            res.json({ success: true });
          }
        });
      }
    });
  },

  // Update war map - PUT
  warMapUpdate: (req, res) => {
    let data = req.body;
    Clan.findOne({ clanID: req.params.clanID }, (err, rObj) => {
      if (! arraysEqual(data.initWarMap, rObj.warMap)) {
        console.log('data not the same');
        res.json({
          success: false, reason: CONFLICT,
          newData: rObj.warMap });
      } else {
        rObj.warMap = data.warMap;
        rObj.save((err, result) => {
          if (err) {
            res.json({ error: err });
          } else {
            res.json({ success: true });
          }
        });
      }
    });
  },

  // Reset war members list - GET
  warMembersReset: (req, res) => {
    Clan.findOne({ clanID: req.params.clanID }, (err, rObj) => {
      rObj.warMembers = [];
      rObj.save((err, result) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json({ success: true });
        }
      });
    });
  },

  // Toggle war status - PUT
  warStatusToggle: (req, res) => {
    Clan.findOne({ clanID: req.params.clanID }, (err, rObj) => {
      rObj.inWar = ! rObj.inWar;
      rObj.save((err, result) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.json({ success: true });
        }
      });
    });
  }
}


let statsSchema = new mongoose.Schema({
  statisticName: { type: String },
  clans: { type: Number, 'default': 0 },
  users: { type: Number, 'default': 0 }
});

let Stats = mongoose.model('statistics', statsSchema);

let stats = {

  initStat: () => {
    let aStats = new Stats({
      statisticName: 'general'
    });
    aStats.save((err, obj) => {
      if (err) {
        console.log('error:', err);
      } else {
        console.log('stats created');
      }
    });
  },

  incClan: (callback) => {
    Stats.update({ statisticName: 'general' }, { $inc: { clans: 1 } }, () => {
      console.log('clans increased');
      callback();
    });
  },

  incUsers: (callback) => {
    console.log('increasing user');
    Stats.update({ statisticName: 'general' }, { $inc: { users: 1 } }, () => {
      console.log('users increased');
      callback();
    });
  },

  getStats: (callback) => {
    console.log('getting stats');
    Stats.findOne({ statisticName: 'general' }).exec((err, result) => {
      callback(result);
    });
  }
}

export { clan, stats, mongoose, Clan };
