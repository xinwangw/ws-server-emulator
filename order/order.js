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
        order.updatedTime = Date.now();
        order.expireTime = Date.now() + 60 * 1000;

        var found = _.findIndex(this.orders, { id: order.id } );
        console.log(found, order.id);
        if (found>-1) {
            if (order.status !== 'PENDING') {
                order.updatedTime = this.orders[found].updatedTime;
                order.expireTime = Date.now();
            }
            this.orders.splice(found, 1, order);
            return order;
        } else {
            return this.addOrder(order);
        }
    }

    updateStatus(id, status) {
        var found = _.findIndex(this.orders, { id: id } );
        if (found) {
            const foundOrder = this.orders[found];
            foundOrder.expireTime = Date.now();
            foundOrder.status = status;
            return foundOrder;
        } else {
            return null;
        }
    }

    addOrder(order){
        order.id = utils.getRandomInt(1, 10000);
        this.orders.push(order);
        return order;
    }

    genOrder() {
        return {
            author: 'test '+ utils.getRandomInt(1,3),
            message: {
                product: 't',
                price: utils.getRandomArbitrary(2,5)
            },
            updatedTime: Date.now(),
            expireTime: Date.now() + 60 * 1000,
            status: 'PENDING'
        };
    }
}
module.exports = new Order();