
var db = require('./config/db');

/*
* Inserta una nueva factura en la base de datos
*/
function createInvoice(invoice, fn){
	console.log('Using InvoiceQueries.createInvoice');
    db.tx(function (t){
        console.log('Inside transaction');
        console.log('Inserting Invoice');
        var insertQuery  = t.one('INSERT INTO "Invoice"("Date", "SubTotal", "TaxTotal", "Total", "Currency") VALUES (current_timestamp, $1, $2, $3, $4) returning "Code"',
            [invoice.subTotal, invoice.taxTotal, invoice.total, invoice.currency]).then(function (data) {
                console.log('Inserting InvoiceLine');
                invoice.code = data.Code;
                const queries = invoice.products.map(p => {
                    return t.none(
                        'INSERT INTO public."InvoiceLine"("InvoiceCode", "ProductCode", "Quantity", "Price", "Currency") VALUES ($1, $2, $3, $4, $5)', 
                        [data.Code,p.code,p.quantity,p.value,p.currency]);
                });
                return t.batch(queries);
            });
        return t.batch([insertQuery]);
    }).then(data => {
        fn(invoice);
    })
    .catch(error => {
        console.log(error.message);
    });;
}

/*
* Obtiene la lista de facturas registradas
*/
function getInvoices(fn){
    console.log('Using InvoiceQueries.getInvoices');
    db.any('SELECT "Code", "Date", "Total" FROM "Invoice"', [])
        .then(function(data) {
            fn(data);
        })
        .catch(function(error) {
            console.log(error.message);
            fn([]);
      });
}

module.exports = {
	createInvoice : createInvoice,
    getInvoices: getInvoices
};