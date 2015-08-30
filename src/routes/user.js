//import mongoose from 'mongoose';
import { mongoose, stats } from './clan';

/*
let uristring = process.env.MONGODB_URI || 'mongodb://localhost/senso';

mongoose.connect(uristring, (err, res) => {
  if (err) {
    console.log('Error connecting to db');
  } else {
    console.log('Succeeded in connection to db');
  }
});
*/


// Database schema
let userSchema = new mongoose.Schema({
  name: { type: String },
  nick: { type: String },
  clanID: { type: String },
  clanName: { type: String },
  email: { type: String },
  userID: {type: String },
  inWar: { type: Boolean, 'default': false },
  level: { type: Number, 'default': 1 },
  role: { type: String }
});
let User = mongoose.model('user', userSchema);


let user = {
  // Create a new user - POST
  createUser: (req, res) => {
    console.log('creating user');
    let data = req.body;
    console.log('data received', data);

    User.count({ email: data.email }, (err, count) => {
      if (count > 0) {
        res.json({ error: 'User already exists' });
      } else {
        // Increment user counter
        // NOTE: Move this below after creating user
        stats.incUsers(() => {
          // Get number of users
          stats.getStats((statsData) => {
            // Create and save a user
            let aUser = new User({
              name: data.name,
              nick: data.nick,
              userID: statsData.users,
              clanID: '',
              clanName: '',
              email: data.email,
              inWar: false,
              level: 1,
              role: 'user'
            });
            aUser.save((err, obj) => {
              if (err) {
                res.json({ error: err });
              } else {
                res.json({ success: true, role: aUser.role });
              }
            });
 
          })
        })
      }
    })
  },

  // Returns basic user details - GET
  profile: (req, res) => {
    User.findOne({ userID: req.params.userID }).exec((err, result) => {
      res.json({
        nick: result.nick,
        userID: result.userID,
        clanName: result.clanName,
        clanID: result.clanID,
        level: result.level
      });
    });
  },

  getDetails: (mail, callbackExisting, callbackNew) => {
    User.findOne({ email: mail }).exec((err, result) => {
      console.log('query result:', result);
      if (result === null) {
        console.log('User not found');
        callbackNew();
      } else {
        // NOTE: limit the details to be returned
        callbackExisting(result);
      }
    });
  }
}

export { user };
