var database_worker = require("../mysql/workers"),
    options = require("../json/options.json");

module.exports = {
	r: /^(cells)$/i,
	f: function (msg, user_from_id, args, data) {
        database_worker.findUser(user_from_id, (user) => {
            data({
                text: `<b>📂 Информация о покупке ячеек</b>\n<b>🪙 Цена:</b> ${options.price}₽\n<b>🗄 Количество ячеек:</b> ${options.amount}\n\n<b>✅ Доступно ячеек:</b> ${numberWithCommas(user[0].cells)}`,
                keyboard: [
                    [{"text": `Условия 📃 `, callback_data: "cells_info"}],
                    [{"text": `Приобрести ✅`, callback_data: "get_buy_cells_link"}],
                    [{"text": `◀️ Назад`, callback_data: "menu"}],
                  ],
                  edit: true
            })
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}