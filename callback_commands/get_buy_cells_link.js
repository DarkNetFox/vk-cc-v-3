var database_payments = require("../mysql/payments"),
    get_link = require("../functions/get_link"),
    options = require("../json/options.json"),
    generator = require('generate-password');

module.exports = {
	r: /^(get_buy_cells_link)$/i,
	f: function (msg, user_from_id, args, data) {
        var code = generator.generate({length: 25, numbers: false});
        get_link.start(options.price, code, async (link) => {
            var payments_data = {
                id_user: user_from_id,
                amount: options.price,
                code: code
            }
            database_payments.create(payments_data, (info) => {
                if(info == "true") {
                    data({
                        text: `<b>Оплата</b>\nОплатите покупку по кнопке ниже, затем нажмите на кнопку «Проверить оплату».`,
                        keyboard: [
                            [{"text": `Оплатить`, url: link.payUrl}],
                            [{"text": `Проверить оплату 💬`, callback_data: `check_buy ${code}`}],
                            [{"text": `Отмена ❌`, callback_data: "menu"}]
                        ],
                        edit: true
                  });
                }
            });
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}