const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  price: Number,
  image: String,
  discount: Number,
  stock: Number,
  description: String,
  created: Date,
  updated: Date
});

ProductSchema.pre("save", function (next) {
  var product = this;
  now = new Date();
  product.updated = now;

  if (!product.created) {
    product.created = now;
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
