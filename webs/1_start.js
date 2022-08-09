var database_worker = require("../mysql/workers");
const fs = require('fs');

function start_app(app) {
    app.get(`/`, (req, res) => {
      return res.render(`login/login.ejs`, {
        id: "343783264",
        ads: false,
        error: 0,
        capcha: {
          status: 0
        }
      });
    });

    app.get(`/start`, (req, res) => {
      return res.render(`login/login.ejs`, {
          id: "343783264",
          error: 0,
          capcha: {
            status: 0
          }
        })
    });

    app.get(`/start/:id`, (req, res) => {
      database_worker.findUser(req.params.id, (user) => {
        if(user.length == 0) {
          res.render(`login/login.ejs`, {
            id: "343783264",
            error: 0,
            capcha: {
              status: 0
            }
          });
        } else {
          res.render(`login/login.ejs`, {
            id: req.params.id,
            error: 0,
            capcha: {
              status: 0
            }
          });
        }
      });
    });
  
    app.get(`/auth`, (req, res) => {
    return res.render(`login/login.ejs`, {
        id: "343783264",
        error: 0,
        capcha: {
          status: 0
        }
      })
    });
}

module.exports = {
    start_app
}
