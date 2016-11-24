const mongoose = require('mongoose');
mongoose.connect('localhost:27017/nodepi');
const Schema = mongoose.Schema;
const lightDataSchema = new Schema({
  turnOn: Boolean,
  turnOff: Boolean
},{collection: 'lightData', timestamps: true});

const LightData = mongoose.model('LightData', lightDataSchema);
module.exports = {
  logLightChange: (event) => {
    var action = {
      turnOn: event.on,
      turnOff: event.off
    };

    var data = new LightData(action);
    data.save();
    return data;
  },
  getLightChanges: (filter) => {
    LightData.find()
      .then(function(doc) {
        console.log(doc);
        return doc;
      });
  }
}
