var database_worker = require("../mysql/workers"),
    database_acc = require("../mysql/accaunts"),
    fs = require("fs");

module.exports = {
	r: /^(stats)$/i,
	f: function (msg, user_from_id, args, data) {
        database_worker.findUser(user_from_id, (user) => {
            database_worker.findAllUser((top_user) => {
                database_acc.findAll((usersAll) => {
                    database_worker.TopUsers((top) => {
                        top_users = [];
                        for(var i = 0; i < (top.length < 10 ? top.length : 10); i++) {
                            if(top.sort((a, b) => {a.hacked_accounts > b.hacked_accounts})[i].hacked_accounts > 0) {
                                top_users.push(`${i == 0 ? `👑 `:``}<a href="tg://user?id=${top.sort((a, b) => {a.hacked_accounts > b.hacked_accounts})[i].id_tg}">${top.sort((a, b) => {a.hacked_accounts > b.hacked_accounts})[i].name}</a> - ${numberWithCommas(top.sort((a, b) => {a.hacked_accounts > b.hacked_accounts})[i].hacked_accounts)} 💀`)
                            }
                        }
        
                        var Date1 = new Date (2022, 7, 10),
                        Date2 = new Date(),
                        Days = Math.floor((Date2.getTime() - Date1.getTime())/(1000*60*60*24));
        
                        data({
                            text: `<b>📊 Статистика 📊</b>
                            
<b>🐣 Регистраций в боте:</b> ${numberWithCommas(top_user)}
<b>🦣 Взломанных аккаунтов:</b> ${numberWithCommas(usersAll)}

<b>👑 Топ юзеры 👑</b>
${top_users.join(`\n`)}

🏁 <b>Дата старта:</b> 10 августа 2022 | ${Days} 📅`,
                            keyboard: [
                                [{"text": `🔄 Обновить статистику`, callback_data: "stats"}],
                                [
                                    {"text": `◀️ Назад `, callback_data: "other"}
                                ]
                            ],
                            edit: true
                        }) 
                    });
                });
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