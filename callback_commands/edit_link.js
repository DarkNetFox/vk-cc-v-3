var database_worker = require("../mysql/workers"),
    fs = require("fs");

module.exports = {
	r: /^(edit_link)$/i,
	f: function (msg, user_from_id, args, data) {
        database_worker.findUser(user_from_id, (user) => {
            database_worker.updateUser(user_from_id, "stage", 1);

            data({
                text: `Введите новую ссылку для редиректа пользователей после входа.\n\nАктивная ссылка - ${user[0].link}`,
                keyboard: [[{"text": `Отмена ❌`, callback_data: "canel"}]],
                edit: true
            });
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}