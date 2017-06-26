/**
 * Created by USER on 13/04/2017.
 */

var exchangeRateTable = {"COP$":{"COP$":1},"USD$":{"COP$":1.5},"MXN$":{"COP$":2}}
var invoices = [];
var IVA = 0.19;
var COLOMBIANCURRENCY = "COP$";

module.exports.createInvoice = function (req, res) {
    console.log("Using service InvoiceService.createInvoice");
    try{
        var data =  req.body.products;
        var invoice = {code:invoices.length+1,date: Date.now(),products: data};
        convertInvoice(invoice, COLOMBIANCURRENCY);
        for(var i = 0;i<invoice.products.length;i++){
            invoice.subTotal = calculateSubTotal(invoice.products);
            invoice.totalTax = invoice.subTotal * IVA;
            invoice.total = invoice.subTotal + invoice.totalTax;
            invoice.currency = COLOMBIANCURRENCY;
        }
        invoices.push(invoice);
        res.status(200).jsonp(invoice);
    }catch(err){
        console.log(err.message);
    }
};



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



