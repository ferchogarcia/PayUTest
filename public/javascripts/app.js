/**
 * Created by USER
 */


(function(){

    var myApp =  angular.module("GeekStore", []);

    //controllers

    myApp.controller("ProductsController" , ProductsController);

    ProductsController.$inject = ['$scope' , '$http'];
    function ProductsController($scope, $http) {
        $scope.inventory = [{name:"Maestro Yoda",price:75000,currency:"COP$"},
                            {name:"Sable laser de plástico",price:35,currency:"USD$"},
                            {name:"Nave espacial Halcón Milenario",price:125000,currency:"COP$"},
                            {name:"Estrella de la muerte",price:200,currency:"USD$"},
                            {name:"R2D2 en fichas de Lego",price:450,currency:"MXN$"},
                            {name:"Jar Jar Binks Gobernador",price:800,currency:"MXN$"}
                            ];
        $scope.products = [];
        $scope.product = "";
        $scope.quantity = 1;
        $scope.value = 0;
        $scope.currency = "";

        $scope.invoices = [];
        $scope.lastInvoice = null;
        
        $scope.getPriceProductSelected = function(){
            var product = $scope.inventory.find(function(productInventory){
                return productInventory.name === $scope.product;
            });
            $scope.value = product.price;
            $scope.currency = product.currency;
        };

        

        $scope.message = "Usted no ha realizado ninguna compra aún";
        $scope.addProduct =  function(){
            $scope.products.push(  {name: $scope.product, quantity: $scope.quantity , value: $scope.value , currency: $scope.currency});
            $scope.product = "";
            $scope.quantity = 1;
            $scope.value = 0;
            $scope.currency = "";
        };

        
        $scope.removeProduct =  function(productName){
            for(var i = 0 ;  i < $scope.products.length; i++){
                if(  $scope.products[i].name == productName){
                    $scope.products.splice(i, 1);
                }
            }
        };

        $scope.buyProducts =  function(){
            var URL = "/api/invoice";
            var jsondata =  {products: $scope.products};

            $http.post(URL, jsondata).
            success(function(data, status, headers, config) {
                $scope.lastInvoice = data;
                $scope.invoices.push(data);
            }).
            error(function(data, status, headers, config) {
                console.log("Error " + data + " " + status);
                $scope.message = "There was an error creating the matrix";
            });


        };

        $scope.generatePDF = function(index){
            var invoice = $scope.invoices[index];
            var bodyRows = [];
            bodyRows.push([ 'Name', 'Quantity', 'Price']);
            for(var i = 0;i < invoice.products.length;i++){
                var product = invoice.products[i];
                var row = [product.name, product.quantity, product.value];
                bodyRows.push(row);
            }
            bodyRows.push([ 'Subtotal','',invoice.subTotal]);
            bodyRows.push([ 'Tax', '',invoice.totalTax]);
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