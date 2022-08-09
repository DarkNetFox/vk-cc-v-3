var database_worker = require("../mysql/workers");

module.exports = {
	r: /^(profile)$/i,
	f: function (msg, user_from_id, args, data) {
        database_worker.findUser(user_from_id, (user) => {
            data({
                text: `<b>🥷🏽 Профиль </b>
<b>🏷 Имя:</b> ${user[0].name}
<b>🗄 Пустых ячеек:</b> ${numberWithCommas(user[0].cells)}
<b>💀 Взломанных аккаунтов:</b> ${numberWithCommas(user[0].hacked_accounts)}`,
                keyboard: [
                    [
                        {"text": `◀️ Назад`, callback_data: "other"}
                    ]
                ],
                edit: true
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