var database_worker = require("../mysql/workers"),
    database_payments = require("../mysql/payments"),
    options = require("../json/options.json"),
    info_pay = require("../functions/info_pay");

module.exports = {
	r: /^(check_buy (.*))$/i,
	f: function (msg, user_from_id, args, data) {
        database_worker.findUser(user_from_id, (user) => {
            info_pay.start(args[2], (data_status) => {
                console.log(data_status)
                if(data_status.status.value == "WAITING") {
                    data({
                        callbackQuery: `⛔️ Ошибка ⛔️\nОжидается оплата.`,
                        show_alert: true
                    });
                  } else {
                    database_worker.updateUser(user_from_id, "cells", user[0].cells+=options.amount);
                    database_payments.find(args[2], (payments_data) => {
                        database_payments.delete_data(args[2], (info_delete) => {})
                    })
                    data({
                        callbackQuery: `❤️ Спасибо за покупку! ❤️\n🗄 Количество пустых ячеек: ${numberWithCommas(user[0].cells)}`,
                        show_alert: true
                    })
                }
            });
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}