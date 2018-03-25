const Cheerio = require('cheerio');
const debug = require('debug')('shopping-tester');
const _ = require('lodash');

exports.isEShop = function(body){
  let $ = Cheerio.load(body);
  $('script').remove();
  let rawText = $('body').text();
  debug(rawText.split('\n').map(line => line.trim()).filter(line => line).join('\n'));
  let priceMatches = rawText.match(/[0-9, \xa0]+€/g);
  let lexicoMatches = rawText.match(/(livraison|paiement|panier|boutique|exp.dition|exp.di.|CGV|suivi de commande|Paiement sécurisé|mode de livraison|offres spéciales|meilleurs ventes|promotion|remboursement|mon panier|promos|MA WISHLIST|Conditions de l'offre|codes promo|service client|satisfait ou rembours|retrait gratuit|Nos conditions de vente|Suivre une commande|Retourner un produit|Frais de port offerts|Conditions G.n.rales de Vente|nos marques|avis clients|mes commandes|acheter|pr.commander)/ig);
  debug('prices', priceMatches);
  debug('lexique', lexicoMatches);
  return Promise.resolve({
    lexicoMatch: lexicoMatches? _.uniq(lexicoMatches.map(m => m.toLowerCase())).length : 0,
    priceCount: priceMatches? priceMatches.length : 0,
    lexicoCount: lexicoMatches? lexicoMatches.length : 0
  });
};
