module.exports = {
	r: /^(menu)$/i,
	f: function (msg, user_from_id, args, data) {
        data({
            text: `🗂 <b>Главное меню</b>`,
            keyboard: [
                [{"text": `Мои ссылки 🌐`, callback_data: "link"}],
                [{"text": `Приобрести ячейки 📂`, callback_data: "cells"}],
                [{"text": "Другое 🦋", callback_data: "other"}],
                [{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}]
            ],
            edit: true
        })
	},
	desc: "",
	rights: 0,
	type: "all"
}