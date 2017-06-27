/**
 * Created by USER
 */


(function(){

    var myApp =  angular.module("GeekStore", []);

    //controllers

    myApp.controller("ProductsController" , ProductsController);

    ProductsController.$inject = ['$scope' , '$http'];
    function ProductsController($scope, $http) {
        $scope.inventory = [];
        $scope.products = [];

        $scope.code = ""
        $scope.product = "";
        $scope.quantity = 1;
        $scope.value = 0;
        $scope.currency = "";

        $scope.invoices = [];
        $scope.lastInvoice = null;

        

        $scope.getProducts = function(){
            $http.get('/api/product').
            success(function(data, status, headers, config) {
                console.log('recibiendo productos');
                $scope.inventory = data;
            }).
            error(function(data, status, headers, config) {
                console.log("Error " + data + " " + status);
            });
        };
        

        $scope.getInvoices = function(){
            $http.get('/api/invoice').
            success(function(data, status, headers, config) {
                console.log('recibiendo invoices');
                $scope.invoices = data;
            }).
            error(function(data, status, headers, config) {
                console.log("Error " + data + " " + status);
            });   

        };

        $scope.loadData = function(){
            $scope.getProducts();
            $scope.getInvoices();
        };
        $scope.loadData();

        
        
        $scope.getProductSelected = function(){
            var product = $scope.inventory.find(function(productInventory){
                return productInventory.Code === $scope.code;
            });
            $scope.value = product.Price;
            $scope.currency = product.Currency;
            $scope.product = product.Name;
        };

        $scope.addProduct =  function(){
            $scope.products.push({code:$scope.code, name: $scope.product, quantity: $scope.quantity , value: $scope.value , currency: $scope.currency});
            $scope.code = "";
            $scope.product = "";
            $scope.quantity = 1;
            $scope.value = 0;
            $scope.currency = "";
        };

        $scope.removeProduct =  function(productCode){
            console.log(productCode);
            for(var i = 0 ;  i < $scope.products.length; i++){
                if(  $scope.products[i].code == productCode){
                    $scope.products.splice(i, 1);
                }
            }
        };

        $scope.buyProducts =  function(){
            var URL = "/api/invoice";
            var jsondata =  {products: $scope.products};
            console.log(JSON.stringify(jsondata));
            $http.post(URL, jsondata).
            success(function(data, status, headers, config) {
                console.log(data);
                $scope.lastInvoice = data;
                $scope.getInvoices();
                
            }).
            error(function(data, status, headers, config) {
                console.log("Error " + data + " " + status);
                $scope.message = "There was an error creating the matrix";
            });

        };

        $scope.generatePDF = function(){
            var invoice = $scope.lastInvoice;
            var bodyRows = [];
            bodyRows.push([ 'Name', 'Quantity', 'Price']);
            for(var i = 0;i < invoice.products.length;i++){
                var product = invoice.products[i];
                var row = [product.name, product.quantity, product.value];
                bodyRows.push(row);
            }
            bodyRows.push([ 'Subtotal','',invoice.subTotal]);
            bodyRows.push([ 'Tax', '',invoice.taxTotal]);
            bodyRows.push([ 'Total','',invoice.total]);
            var docDefinition = {
              content: [
                { 
                    text: 'Resumen de pago\n\n\n', 
                    style: 'header',
                    bold: true,
                    fontSize: 20
                },
                {
                  table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 1,
                    widths: [300, 100, 100],
                    body: bodyRows
                  }
                }
              ]
            };
            // download the PDF
            pdfMake.createPdf(docDefinition).download('invoice.pdf');

        };
    }


})();