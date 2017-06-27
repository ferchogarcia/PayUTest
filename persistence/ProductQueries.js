
var db = require('./config/db');

/*
* Obtiene una lista de productos disponibles
*/
function getProducts(fn){
	console.log('Using ProductQueries.getProducts');
	db.any('SELECT "Code", "Name", "Price", "Currency" FROM "Product"', [])
        .then(function(data) {
            fn(data);
        })
        .catch(function(error) {
            console.log(error.message);
            fn([]);
      });
}

module.exports = {
	getProducts : getProducts
};