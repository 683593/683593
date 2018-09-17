const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deepPopulate = require('mongoose-deep-populate')(mongoose);

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
},
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }

  }
);

ProductSchema
  .virtual('averageRatings')
  .get(function () {
    var rating = 0;
    if (this.reviews.length == 0) rating = 0;
    else
      this.reviews.map((review) => {
        rating += review.rating;
      });

    return rating = rating / this.reviews.length;
  })

ProductSchema.plugin(deepPopulate);

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
