const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const surveySchema = new Schema({
    phoneNo : {
      type : String
    },
    symptom: {
      type: String
    },
    response1:{
      type: String
    },
    response2:{
      type: String
    },
    response3: {
      type: String
    },
    rank1: {
      type: String
    },
    rank2: {
      type: String
    },
    rank3: {
      type: String
    },
    status: {
      type: String
    }
});

surveySchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Twilio', surveySchema);
