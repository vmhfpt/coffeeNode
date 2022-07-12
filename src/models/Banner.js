
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BannerSchema = new Schema({
  name : String,
  description : String,
  thumb : String,
  url : String,
},
{ timestamps : true}
);
module.exports =  mongoose.model("Banner", BannerSchema);



