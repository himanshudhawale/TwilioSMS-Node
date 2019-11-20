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
    count: {
      type: String
    }
});

surveySchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Twilio', surveySchema);

































enrollment table with column
 `idenrollment` int(11) NOT NULL AUTO_INCREMENT,
  `phoneNo` varchar(45) DEFAULT NULL,
  `response1` int(11) DEFAULT NULL,
  `response2` int(11) DEFAULT NULL,
  `response3` int(11) DEFAULT NULL,
  `rank1` int(11) DEFAULT NULL,
  `rank2` int(11) DEFAULT NULL,
  `count` int(11) DEFAULT '0',
  `rank3` int(11) DEFAULT NULL,

symptoms table
 `idsymptoms` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
