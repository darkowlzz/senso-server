import mongoose from 'mongoose';

let uristring = process.env.MONGODB_URI || 'mongodb://localhost:/senso';

mongoose.connect(uristring, (err, res) => {
  if (err) {
    console.log('Error connecting to db');
  } else {
    console.log('Succeeded in connection to db');
  }
});


// Database schema
let userSchema = new mongoose.Schema({
  name: { type: String },
  nick: { type: String },
  clanID: { type: String },
  clanName: { type: String },
  email: { type: String },
  userID: {type: String },
  inWar: { type: Boolean, 'default': false },
  level: { type: Number, 'default': 1 }
});
let User = mongoose.model('user', userSchema);


let users = {
  // Create a new user - POST
  createUser: (req, res) => {
    let data = req.body;

    User.count({ email: data.email }, (err, count) => {
      if (count > 0) {
        res.json({ error: 'User already exists' });
      } else {
        let aUser = new User({
          name: data.name,
          nick: data.nick,
          userID: 0, // NOTE: This should be incremented automatically
          clanID: '',
          clanName: '',
          email: data.email,
          inWar: false,
          level: 1
        });
        aUser.save((err, obj) => {
          if (err) {
            res.json({ error: err });
          } else {
            res.json({ success: true });
          }
        });
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
  }
}

export { users };
