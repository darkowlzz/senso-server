import mongoose from 'mongoose';

let uristring = process.env.MONGODB_URI || 'mongodb://localhost/senso';

mongoose.connect(uristring, (err, res) => {
  if (err) {
    console.log('Error connecting to db', err);
  } else {
    console.log('Succeeded in connection to db');
  }
});

let statisticsSchema = new mongoose.Schema({
  statisticName: { type: String },
  clans: { type: Number, 'default': 0 },
  users: { type: Number, 'default': 0 }
});
let Statistics = mongoose.model('statistics', statisticsSchema);

/*
let aStats = new Statistics({
  statisticName: 'general'
});
aStats.save((err, obj) => {
  if (err) {
    console.log('error:', err);
  } else {
    console.log('stats created');
  }
});
*/

Statistics.update({statisticName: 'general'}, {$inc: {clans: -1}}, () => {
  console.log('done done done!');
});
