
const slug = require('mongoose-slug-generator');
const mongoose = require('mongoose');
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  name : String,
  description : String,
  active : String,
  price : String,
  price_sale : String,
  quantity : Number,
  thumb : String,
  slug: { type: String, slug: "name" },
  content: String,
  comments : [{ type: Schema.Types.ObjectId, ref: 'Comment', default: undefined }],
  category_id :  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
},
{ timestamps : true}
);
module.exports =  mongoose.model("Product", ProductSchema);



