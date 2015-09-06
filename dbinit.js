import mongoose from 'mongoose';

const STATS_COLLECTION = 'stats-alpha-2';

let uristring = process.env.MONGODB_URI || 'mongodb://localhost/senso';
console.log('uri', uristring);

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
let Statistics = mongoose.model(STATS_COLLECTION, statisticsSchema);

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

/*
Statistics.update({statisticName: 'general'}, {$inc: {clans: -1}}, () => {
  console.log('done done done!');
});
*/
