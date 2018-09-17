const router = require("express").Router();
const async = require('async');
const Category = require("../models/category");
const Product = require("../models/product");


router.get('/test', (req, resp, next) => {
  function function1(callback) {
    var firstName = 'Mohammad ';
    console.log("firstName: " + firstName);
    callback(null, firstName);
  }

  function function2(f1, callback) {
    var lastName = 'Rizwaan';
    console.log("lastName: " + lastName);
    callback(null, lastName);
  }
  async.waterfall([function1, function2]);
});


router.route("/categories")
  .get((req, resp, next) => {
    Category.find({}, (err, categories) => {
      if (err) return next(err);
      resp.json({
        success: true,
        categories: categories,
        message: "success"
      });
    }).sort({
      name: 1
    });
  })
  .post((req, resp, next) => {
    let category = new Category();
    category.name = req.body.name;
    category.save((err, category) => {
      err
        ?
        resp.json({
          success: false,
          message: "Category Could not Saved."
        }) :
        resp.json({
          success: true,
          message: "Category [ " + category.name + " ] Saved Succcessfully!"
        });
    });
  });
/**
 * Get all product of a category using Async operation.
 */
router.get('/products', (req, resp, next) => {
  const perPage = 8;
  const page = req.query.page;
  product = null;
  //Paraller method to load produts of category with pagintaion.
  async.parallel([
    //function 1
    function (callback) {
      Product.countDocuments({}, (err, count) => {
        var totalProducts = count;
        console.log('totalProducts-> ' + totalProducts);
        callback(err, totalProducts);
      });
    },
    //function 2
    function (callback) {
      Product.find({})
        .skip(page * perPage)
        .limit(perPage)
        .populate('category')
        .populate('owner')
        .exec((err, products) => {
          if (err) return next(err);
          callback(err, products);
        });
    },

  ], function (err, results) {
    var totalProducts = results[0];
    var products = results[1];

    resp.json({
      success: true,
      message: 'category',
      products: products,
      totalProducts: totalProducts,
      pages: Math.ceil(totalProducts / perPage)
    })
  });
});
/**
 * Get product detail by Product id.
 */
router.get('/product/:id', (req, resp, next) => {
  Product.findById({ _id: req.params.id })
    .populate('category')
    .populate('owner')
    .exec((err, product) => {
      if (err) {
        resp.json({
          success: false,
          message: 'Product not found!'
        });
      } else {
        resp.json({
          success: true,
          message: 'product',
          product: product,
        })
      }
    })
});

/**
 * Get all product of a category using Async operation.
 */
router.get('/categories/:id', (req, resp, next) => {
  const perPage = 10;
  const page = req.query.page;
  totalProducts = 0;
  //Paraller method to load produts of category with pagintaion.
  async.parallel([
    //function 1
    function (callback) {
      Product.countDocuments({
        category: req.params.id
      }, (err, count) => {
        totalProducts = count;
        console.log('totalProducts-> ' + totalProducts);
        callback(err, totalProducts);
      });
    },
    //function 2
    function (callback) {
      Product.find({
        category: req.params.id
      })
        .skip(page * perPage)
        .limit(perPage)
        .populate('category')
        .populate('owner')
        .exec((err, products) => {
          if (err) return next(err);
          callback(err, products);
        });
    },
    //function 3
    function (callback) {
      Category.findOne({
        _id: req.params.id
      }, (err, category) => {
        callback(err, category)
      });
    }
  ], function (err, results) {
    var totalProducts = results[0];
    var products = results[1];
    var category = results[2];

    resp.json({
      success: true,
      message: 'category',
      products: products,
      categoryName: category.name,
      totalProducts: totalProducts,
      pages: Math.ceil(totalProducts / perPage)
    })
  });



  //Waterfall example for products of category

  // async.waterfall([
  //   //function 1
  //   function (callback) {
  //     Product.countDocuments({
  //       category: req.params.id
  //     }, (err, count) => {
  //       var totalProducts = count;
  //       console.log('totalProducts-> ' + totalProducts);
  //       callback(err, totalProducts);
  //     });
  //   },
  //   //function 2
  //   function (totalProducts, callback) {
  //     Product.find({
  //         category: req.params.id
  //       })
  //       .skip(page * perPage)
  //       .limit(perPage)
  //       .populate('category')
  //       .populate('owner')
  //       .exec((err, products) => {
  //         if (err) return next(err);
  //         callback(err, products, totalProducts);
  //       });
  //   },
  //   //function 3
  //   function (products, totalProducts, callback) {
  //     Category.findOne({
  //       _id: req.params.id
  //     }, (err, category) => {
  //       resp.json({
  //         success: true,
  //         message: 'category',
  //         products: products,
  //         categoryName: category.name,
  //         totalProducts: totalProducts,
  //         pages: Math.ceil(totalProducts / perPage)
  //       });
  //     });
  //   }
  // ]);



  /**
   * OLD Code without pagination
   */

  // let category = new Category();
  // Product.find({
  //     category: req.params.id
  //   })
  //   .populate('category')
  //   .exec((err, products) => {
  //     Product.count({
  //       category: req.params.id
  //     }, (err, totalProducts) => {
  //       resp.json({
  //         success: true,
  //         message: 'category',
  //         products: products,
  //         categoryName: products[0].category.name,
  //         totalProducts: totalProducts,
  //         pages: Math.ceil(totalProducts / perPage)
  //       });
  //     });
  //   });
});

module.exports = router;