var links = require(`../json/links.json`),
    database_worker = require("../mysql/workers");

module.exports = {
	r: /^(mask_link)$/i,
	f: function (msg, user_from_id, args, data) {
        data({
            text: `<b>🎭 Сайты для маскировок ссылок:</b>`,
            keyboard: [
                [{"text": `✅ ooooooooooooooooooooooo 🔥`, url: "https://ooooooooooooooooooooooo.ooo/"}],
                [{"text": `✅ "Кликер" от Яндекс`, url: "https://clck.ru"}],
                [{"text": `✅ TinyURL `, url: "https://tinyurl.com/"}],
                [{"text": `✅ U.to`, url: "https://u.to/"}],
                [{"text": `◀️ Назад`, callback_data: "link"}]
              ],
              edit: true
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}