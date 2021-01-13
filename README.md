# Customer delete plugin
Plugin allows to delete a customer account from Magento.

## Entry point
Entry point for plugin is a /src/index.js file. It contains a template function
for api plugin.

## Usage
* request account delete 
```shell script
curl -X POST "http://localhost:8080/api/vendor/customer-delete/{{customerId}}?token={{token}}&storeCode={{storeCode}}"
``` 

* confirm delete
```shell script
curl -X POST "http://localhost:8080/api/vendor/customer-delete/{{customerId}}?token={{token}}&storeCode={{storeCode}}"
``` 

`token` is a delete token fetched from email message
