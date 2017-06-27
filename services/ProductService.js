
var db = require('../persistence/ProductQueries');

module.exports.getProducts = function (req, res) {
	console.log('Using service ProdductService.getProducts');
	try{
		db.getProducts(function (products) {
			res.status(200).jsonp(products);		
		});
	}catch(err){
		console.log(err.message);
	}
}