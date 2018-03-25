```
db.getCollection('dealers').find({"metas.category.global.name":"reseller",
    "metas.country": "FR"
    }).limit(100).sort({"searchcount": -1}).forEach(function(dealer){print('{"domain" : "' + dealer.domain + '", "url":"' + dealer.targetUrl + '", "eshop": true},')})
```
