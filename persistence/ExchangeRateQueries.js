
var db = require('./config/db');

function getRates(fn){
	console.log('Using ExchangeRateQueries.getRates');
	db.any('SELECT "From", "To", "Rate" FROM "ExchangeRate"', [])
        .then(function(data) {
            var exchangeRateTable = {};
            for(var i = 0;i< data.length;i++){
                exchangeRateTable[data[i].From] = {};
                exchangeRateTable[data[i].From][data[i].To]=data[i].Rate;
            }
            fn(exchangeRateTable);
        })
        .catch(function(error) {
            console.log(error.message);
            fn([]);
      });
}

module.exports = {
	getRates : getRates
};