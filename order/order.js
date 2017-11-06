var utils = require('./utils');
var _ = require('lodash');

class Order {
    constructor() {
        this.orders = [];
        for (var i=0;i<10;i++) {
            this.addOrder(this.genOrder());
        }
    }

    addOrUpdateOrder(order) {

        var found = _.findIndex(this.orders, { id: order.id } );
        console.log(found, order.id);
        if (found) {
            this.orders.splice(found, 1, order);
        } else {
            this.addOrder(order);
        }
    }

    addOrder(order){
        order.id = utils.getRandomInt(1, 10000);
        this.orders.push(order);
        return order;
    }

    genOrder() {
        return {
            author: 'test',
            message: {
                product: 't',
                price: utils.getRandomArbitrary(2,5)
            }
        };
    }
}
module.exports = new Order();