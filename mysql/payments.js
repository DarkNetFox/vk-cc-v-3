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
    var sql = `INSERT INTO payments (id_user, amount, code) VALUES (
${data.id_user},
${data.amount},
"${data.code}"
);`

    find(data.code, (user) => {
        if(user.length == 0) {
            conn.query(sql, function (err, result) {
                if(err) {
                    return console.log(err);
                };
                callback("true");
            });
        }
    });
}

function findAll(callback) {
    conn.query(`SELECT code FROM payments`, function (err, result) {
        if(err) {
            return console.log(err);
        } else {
            return callback(result.length);
        }
    });
}

function find(id, callback) {
    conn.query(`SELECT * FROM payments WHERE code = "${id}"`, function (err, result) {
        if(err) {
            return console.error(err.code);
        } else {
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
            conn.query(`UPDATE payments SET ${name_value} = ${new_value} WHERE code = ${user[0].id_tg};`, function (err, result) {
                if(err) {
                    return console.log(err);
                }
            });
        }
    })
}

function delete_data(id, callback) {
    conn.query(`DELETE FROM payments WHERE code = '${id}'`, function (err, result) {
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
    delete_data
}