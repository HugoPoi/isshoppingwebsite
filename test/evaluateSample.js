const Promise = require('bluebird');
const chai = require('chai');
const expect = chai.expect;
const Request = require('request-promise');
const fs = require('fs');
Promise.promisifyAll(fs);
const sampleList = require('./sample_websites.json');
const ShoppingTester = require('../lib/shopping-tester.js');

describe('Sample shopping test', function() {
  describe('prepare', function() {
    sampleList.forEach( website => {
      it(website.domain, () => {
        if(!fs.existsSync('./cache/' + website.domain + '.html')){
          return Request({
            headers: {
              'Accept-Language': 'fr-FR,fr;q=0.5',
              'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
            },
            gzip: true,
            followRedirect: true,
            simple: true,
            //resolveWithFullResponse: true,
            url: website.url
          }).then(body => fs.writeFileAsync('./cache/' + website.domain + '.html', body));
        }
      });
    });
  });
  describe('evaluate eshop', function(){
    sampleList.filter(website => website.eshop).forEach(website => {
      it(website.domain, () => {
        return fs.readFileAsync('./cache/' + website.domain + '.html')
          .then( body => ShoppingTester.isEShop(body) )
          .then(result => {
            expect(result.lexicoCount).to.be.above(6);
            expect(result.lexicoMatch).to.be.above(3);
          });
      });
    });
  });
  describe('evaluate other', function(){
    sampleList.filter(website => !website.eshop).forEach(website => {
      it(website.domain, () => {
        return fs.readFileAsync('./cache/' + website.domain + '.html')
          .then( body => ShoppingTester.isEShop(body) )
          .then(result => {
            expect(result.lexicoCount).to.be.below(4);
            expect(result.lexicoMatch).to.be.below(3);
          });
      });
    });
  });
});
