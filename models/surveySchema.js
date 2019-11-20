const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const surveySchema = new Schema({
    phoneNo : {
      type : String
    },
    symptom: {
      type: Object
    },
    responseMap: {
        type: Map,
        of: String,
        default: {}
    },
    currentResponse: {
      type: String
    },
    count: {
      type: String
    }
});

surveySchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Twilio', surveySchema);
