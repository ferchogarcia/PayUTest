/**
 * Created by USER on 13/04/2017.
 */
/**
 * This Controller handles all the requests made to the app and routes them to their specific service
 */


"use strict";

var InvoicesController = require('./InvoicesController');
var ProductController = require('./ProductController');

/**
 *Handle all the API requests 
 * @param app
 */
function Controllers(app){


    //TODO
    app.post('/api/invoice', InvoicesController.createInvoice);

    app.get('/api/invoice', InvoicesController.getInvoices);

    app.get('/api/product', ProductController.getProducts);

  }

module.exports   =  Controllers;