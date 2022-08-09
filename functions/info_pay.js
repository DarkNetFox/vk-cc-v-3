const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const SECRET_KEY = process.env.token_qiwi;
const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);

function start(code, callback) {
    qiwiApi.getBillInfo(code).then(data => {
        callback(data);
    });
}

module.exports = {
    start
}