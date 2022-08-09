module.exports = {
	r: /^(other)$/i,
	f: function (msg, user_from_id, args, data) {
        data({
            text: `<b>🦋 Другое 🦋</b>`,
            keyboard: [
                [{"text": `Статистика 📊`, callback_data: "stats"},
                {"text": "Профиль 🥷🏽", callback_data: "profile"}],
                [{"text": `◀️ Назад`, callback_data: "menu"}]
              ],
              edit: true
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}