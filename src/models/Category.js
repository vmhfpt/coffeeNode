
const slug = require('mongoose-slug-generator');
const mongoose = require('mongoose');
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const CategorySchema = new Schema({
  name : String,
  description : String,
  active : String,
  slug: { type: String, slug: "name" },
  category_child : [{ type: Schema.Types.ObjectId, ref: 'Category', default: undefined }],
  parent_id :  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
},
{ timestamps : true}
);
module.exports =  mongoose.model("Category", CategorySchema);



