var productService = require("../services/ProductService");


exports.getProducts = function (req, res) {

    productService.getProducts(req, res);
};