const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const SECRET_KEY = process.env.token_qiwi;
const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);

function start(price, code, callback) {
    var fields = {
        amount: price,
        currency: 'RUB',
        expirationDateTime: '2023-01-01T00:00:00+06:00'
    };
    qiwiApi.createBill(code, fields).then(data => {
        return callback(data);
    });
}

module.exports = {
    start
}