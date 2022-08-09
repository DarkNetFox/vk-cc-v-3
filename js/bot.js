process.env["NTBA_FIX_350"] = 1;
process.env["NTBA_FIX_319"] = 1;

const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.token_tg;
const bot = new TelegramBot(token, {polling: true});
var config = require("../config.json");

bot.getMe(process.argv[2]).then((data) => {
  config.bot_name = data.username;
  fs.writeFileSync(`./config.json`, JSON.stringify(config), (err) => {
      if (err) return console.log(err);
  });

  console.log(`Бот ${data.first_name} запущен. (t.me/${data.username})`)
});

/*==============================================================================*/
/*==============================================================================*/
/*==============================================================================*/

var commands = ["./commands/"];
let cmds = []

for(let i = 0; i < fs.readdirSync("./commands/").length; i++) {
    if(!fs.readdirSync("./commands/")[i].endsWith(".js")) {
        commands.push(`./commands/${fs.readdirSync("./commands/")[i]}/`);
    }
}

for(var i_ = 0; i_ < commands.length; i_++) {
  var commands_list = fs.readdirSync(String(commands[i_])).filter(x => x.endsWith(".js")).map(x => require(`../${String(commands[i_]) + x}`));
  commands_list.forEach(function(entry) {
    cmds.push(entry);
  });
}

/*=============*/

var callback_commands = ["./callback_commands/"];
let callback_cmds = []

for(let i = 0; i < fs.readdirSync("./callback_commands/").length; i++) {
    if(!fs.readdirSync("./callback_commands/")[i].endsWith(".js")) {
        callback_commands.push(`./callback_commands/${fs.readdirSync("./callback_commands/")[i]}/`);
    }
}
for(var i_ = 0; i_ < callback_commands.length; i_++) {
    var callback_commands_list = fs.readdirSync(String(callback_commands[i_])).filter(x => x.endsWith(".js")).map(x => require(`../${String(callback_commands[i_]) + x}`));
    callback_commands_list.forEach(function(entry) {
        callback_cmds.push(entry);
    });
}
/*==============================================================================*/
/*==============================================================================*/
/*==============================================================================*/

bot.on("channel_post", (data) => {
  console.log(data)
});

bot.on("new_chat_members", (data) => {
  bot.deleteMessage(data.chat.id, data.message_id)
});
bot.on("left_chat_member", (data) => {
  bot.deleteMessage(data.chat.id, data.message_id)
});

/*==============================================================================*/
/*==============================================================================*/
/*==============================================================================*/

bot.on("message", (msg) => {
  user_from_id = msg.from.id;
  chat_id = msg.chat.id;
  message_send(msg, user_from_id, msg.chat.id);
});

bot.on('callback_query', async (query) => {
  user_from_id = query.from.id;
  chat_id = query.message.chat.id;
  callback_query_message_send(query, user_from_id, chat_id);
});


function message_send(msg, user_from_id, chat_id) {
  cmds.map(async (cmd) => {
    if(msg.caption) {
        var body = await msg.caption.match(/^(.*)/i)[1];
    } else if(msg.text) {
        var body = await msg.text.match(/^(.*)/i)[1];
    }
    
    if (!cmd.r.test(body) || cmd.r == "none" || cmd.d && cmd.d.test(body)) return;
    if(body) {
        var args = await body.match(cmd.r) || [];
        args[0] = msg.text;
    }

    cmd.f(msg, user_from_id, args, (data) => {
      if(chat_id < 0) {
        data.keyboard = [
          [{"text": `🥚`, callback_data: "click"}],
          [{"text": `Весь функционал 📖`, url: "t.me/chicken_mania_bot"}]
        ]
      }
      
      if(data.keyboard_type && data.keyboard_type == 2) {
        keyboard = {"keyboard": data.keyboard ? data.keyboard : [], resize_keyboard: true}
      } else {
        keyboard = {"inline_keyboard": data.keyboard ? data.keyboard : []}
      }

      if(data.photo) {
        return bot.sendPhoto(data.user_from_id ? data.user_from_id : chat_id, data.photo, {
            caption: data.text,
            parse_mode: "HTML",
            reply_markup: keyboard
        }).catch(function(error) {
          error_send_message(error, data, user_from_id, msg)
        });
    }

    if(data.text) {
      bot.sendMessage(data.id ? data.id : chat_id, data.text, {
        parse_mode: "HTML",
        reply_markup: keyboard
      }).catch(function(error) {
        error_send_message(error, data, user_from_id, msg)
      });
    }
    });
});
}

function callback_query_message_send(query, user_from_id, chat_id) {
  callback_cmds.map((cmd) => {
    var body = query.data.match(/^(.*)/i)[1];
    if (!cmd.r.test(body) || cmd.r == "none") return;
    if(body) {
        var args = body.match(cmd.r) || [];
        args[0] = query.data;
    }

    if(query.message.chat.type != "private" && cmd.type == "user") {
      return bot.answerCallbackQuery(query.id, {
        text: `🚫 Данная кнопка не работает в группах и супергруппах.`,
        show_alert: true
      });
    }

    cmd.f(query, user_from_id, args, (data) => {
      if(data.keyboard_type && data.keyboard_type == 2) {
        keyboard = {"keyboard": data.keyboard ? data.keyboard : [], resize_keyboard: true}
      } else {
        keyboard = {"inline_keyboard": data.keyboard ? data.keyboard : []}
      }

      if(data.callback == true) {
        return bot.answerCallbackQuery(query.id, {
          text: data.text,
          show_alert: data.show_alert ? data.show_alert : false
        }).catch(function(error) {
          error_send_message(error, data, user_from_id, query)
        });
      }

      if(data.delete == true) {
        bot.deleteMessage(chat_id, data.delete_id ? data.delete_id : query.message.message_id).catch(function(error) {
          error_send_message(error, data, user_from_id, query)
        });
      }

      if(data.delete_key == true) {
        bot.editMessageReplyMarkup({"inline_keyboard": []}, {
          chat_id: chat_id,
          message_id: query.message.message_id
        }).catch(function(error) {
          error_send_message(error, data, user_from_id, query)
        });
      } else if(data.delete_key == false) {
        bot.deleteMessage(chat_id, data.delete_id ? data.delete_id : query.message.message_id).catch(function(error) {
          error_send_message(error, data, user_from_id, query)
        });
      }

      if(data.edit == true) {
        // bot.answerCallbackQuery(query.id, {
        //   text: `Успех! `,
        //   show_alert: data.show_alert ? data.show_alert : false
        // }).catch(function(error) {
        //   error_send_message(error, data, user_from_id, query)
        // });

        return bot.editMessageText(data.text ? data.text : ``, {
          chat_id: chat_id,
          message_id: query.message.message_id,
          parse_mode: "HTML",
          reply_markup: keyboard
        }).catch(function(error) {
          error_send_message(error, data, user_from_id, query)
        });
      }

      if(data.edit_key == true) {
        bot.editMessageReplyMarkup({"inline_keyboard": data.keyboard_edit},  {
          chat_id: chat_id,
          message_id: query.message.message_id
        }).catch(function(error) {
          error_send_message(error, data, user_from_id, query)
        });
      }

      if(data.callbackQuery) {
          bot.answerCallbackQuery(query.id, {
            text: data.callbackQuery,
            show_alert: data.show_alert ? data.show_alert : false
          }).catch(function(error) {
            error_send_message(error, data, user_from_id, query)
          });

        if(data.text) {
          return bot.sendPhoto(data.user_from_id ? data.user_from_id : chat_id, data.photo, {
            caption: data.text,
            parse_mode: "HTML",
            reply_markup: keyboard
        }).catch(function(error) {
          error_send_message(error, data, user_from_id, query)
        });
      } else {
        return
      }
      }

      if(data.photo) {
        return bot.sendPhoto(data.id ? data.id : chat_id, data.photo, {
          caption: data.text,
          parse_mode: "HTML",
          reply_markup: keyboard
        }).catch(function(error) {
          error_send_message(error, data, user_from_id, query)
        });
      }

      if(data.text) {
        bot.sendMessage(data.id ? data.id : chat_id, data.text, {
          parse_mode: "HTML",
          reply_markup: keyboard
        }).catch(function(error) {
          error_send_message(error, data, user_from_id, query)
        });
      }
    });
  });
}

function message_send_other(id, text, buttons = []) {
  bot.sendMessage(id, text, {
    parse_mode: "HTML",
    reply_markup: {"inline_keyboard": buttons}
  })
}

/*==============================================================================*/
/*==============================================================================*/
/*==============================================================================*/

function error_send_message(error, data, user_from_id, query) {
  if(error.response.body.error_code == 400) {
    if(error.response.body.description == `Bad Request: chat not found`) {
      return database.deleteUser(data.id ? data.id : user_from_id, () => {
        console.log(`Пользователь удалён с базы данных [${data.id ? data.id : user_from_id}]`)
      })
    }
    bot.deleteMessage(user_from_id, data.delete_id ? data.delete_id : query.message.message_id).catch((err) => {
      return
    });
    if(data.img) {
      return bot.sendPhoto(data.id ? data.id : user_from_id, data.img, {
        caption: data.text,
        parse_mode: "HTML",
        reply_markup: keyboard
      })
    }
    if(data.text) {
      bot.sendMessage(data.id ? data.id : user_from_id, data.text, {
        parse_mode: "HTML",
        reply_markup: keyboard
      })
    }
  }
  if(error.response.body.error_code == 403 && error.response.body.description == "Forbidden: bot was blocked by the user") {
    fs.unlink(`./users/${data.id}.json`, function(err) {
        if (err) {
          return console.log(colors.red(`Ошибка при удалении аккаунта. [${data.id}]`, error.response.body));
        } else {
          return console.log(colors.dim(`Аккаунт удалён - [${data.id}]`));
        }
    });
  }

  if(error.response) {
    return console.log(`
-------------------------------------------------
Ошибка Телеграм. ${data.id ? data.id : user_from_id}
code: ${error.response.body.error_code}
msg_error: ${error.response.body.description}
-------------------------------------------------`);
  }
}

module.exports = {
  message_send_other
}