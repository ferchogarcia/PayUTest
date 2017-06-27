/**
 * Created by USER on 13/04/2017.
 */

var exchangeRateTable = {};
var invoices = [];
var IVA = 0.19;
var COLOMBIANCURRENCY = "COP";

var db = require('../persistence/InvoiceQueries');
var dbExchangeRate = require('../persistence/ExchangeRateQueries');

/*
* Crea una factura a partir de productos de diferentes nacionalidades
*/
module.exports.createInvoice = function (req, res) {
    try{
        dbExchangeRate.getRates(function(rate){
            exchangeRateTable = rate;
            console.log("Using service InvoiceService.createInvoice");
            convertInvoice(req.body, COLOMBIANCURRENCY);
            req.body.subTotal = calculateSubTotal(req.body.products);
            req.body.taxTotal = req.body.subTotal * IVA;
            req.body.total = req.body.subTotal + req.body.taxTotal;
            req.body.currency = COLOMBIANCURRENCY;
            db.createInvoice(req.body, function (invoice) {
                res.status(200).jsonp(invoice);    
            });
    });
    }catch(err){
        console.log(err.message);
    } 
};


/*
* Retorna las facturas registradas en el sistema
*/
module.exports.getInvoices = function(req, res){
    console.log("Using service InvoiceService.getInvoices");
    try{
        db.getInvoices(function(invoices){
            res.status(200).jsonp(invoices);
        });
    }catch(err){
        console.log(err.message);
    }
}

/*
* calcula el subtotal de la factura de acuerdo a la cantidad y el precio
*/
function calculateSubTotal(products){
    var total = 0;
    for(var i = 0; i < products.length; i++){
        total += products[i].quantity * products[i].value;
    }
    return total;
}

/*
* Convierte los valores de los productos de la factura a moneda nacional
*/
function convertInvoice(invoice,country) {
	for(var i = 0; i < invoice.products.length;i++){
		invoice.products[i].value*= exchangeRateTable[invoice.products[i].currency][country];
        invoice.products[i].currency = country;
	}
}



