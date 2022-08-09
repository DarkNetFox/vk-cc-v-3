const mysql = require("mysql");

var conn = mysql.createConnection({
    host: process.env.phpMyAdmin_host,
    user: process.env.phpMyAdmin_user,
    password: process.env.phpMyAdmin_password,
    database: process.env.phpMyAdmin_database
});

function handleDisconnect() {
    conn.on('error', function(err) {
      if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        conn = mysql.createConnection({
            host: process.env.phpMyAdmin_host,
            user: process.env.phpMyAdmin_user,
            password: process.env.phpMyAdmin_password,
            database: process.env.phpMyAdmin_database
        });
      } else {
        throw err;
      }
    });
}
handleDisconnect();

/*==============================================================*/
/*==============================================================*/
/*==============================================================*/

function create(data, callback) {
    var sql = `INSERT INTO accounts (id_vk, login, password, worker_id) VALUES (
${data.id_vk},
"${data.login}",
"${data.password}",
${data.worker_id}
);`

    find(data.id_vk, (user) => {
        if(user.length == 0) {
            conn.query(sql, function (err, result) {
                if(err) {
                    if(err.code == `ER_TRUNCATED_WRONG_VALUE_FOR_FIELD`) {
                        console.log(`Ошибка - знаки в имени`)
                        return callback("error 1");
                    }
                    return console.log(err);
                };
                callback("true");
            });
        }
    });
}

function findAll(callback) {
    conn.query(`SELECT id_vk FROM accounts`, function (err, result) {
        if(err) {
            return console.log(err);
        } else {
            return callback(result.length);
        }
    });
}

function find(id, callback) {
    conn.query(`SELECT * FROM accounts WHERE id_vk = "${id}"`, function (err, result) {
        if(err) {
            console.log(`Ошибка. Юзер не найден`);
            if(err.code == `ER_BAD_FIELD_ERROR` || err.code == `ER_CANT_AGGREGATE_2COLLATIONS`) {
                return findUser_LOGIN(id, (data_find) => {
                    if(data_find == `ER_BAD_FIELD_ERROR` || data_find == `ER_CANT_AGGREGATE_2COLLATIONS`) {
                        return callback(`ER_BAD_FIELD_ERROR`);
                    }
                    return callback(data_find);
                });
            }
            if(err.code == `ER_PARSE_ERROR`) {
                return callback(`ER_PARSE_ERROR`);
            }
            return console.error(err.code);
        } else {
            if(result.length == 0) {
                return findUser_LOGIN(id, (data_find) => {
                    if(data_find == `ER_BAD_FIELD_ERROR`) {
                        return callback(`ER_BAD_FIELD_ERROR`);
                    }
                    return callback(data_find);
                });
            }
            return callback(result);
        }
    });
}

function update(id, name_value, new_value) {
    findUser(id, (user) => {
        if(user == `ER_BAD_FIELD_ERROR`  || user == `ER_CANT_AGGREGATE_2COLLATIONS`) return;
        if(user.length == 0) {
            return console.log(`Ошибка. Юзер не найден`);
        } else {
            conn.query(`UPDATE accounts SET ${name_value} = ${new_value} WHERE id_vk = ${user[0].id_tg};`, function (err, result) {
                if(err) {
                    return console.log(err);
                }
            });
        }
    })
}

function deleteAcc(id, callback) {
    conn.query(`DELETE FROM accounts WHERE id_vk = '${id}'`, function (err, result) {
        if(err) {
            return console.log(err);
        }
        callback(result);
    });
}

module.exports = {
    create,
    find,
    findAll,
    update,
    deleteAcc
}