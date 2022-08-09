var database_worker = require("../../mysql/workers");
const fs = require('fs');

function start_boom(app) {
    app.get(`/boom`, (req, res) => {
      return res.render(`vk_done/boom/index.ejs`, {
          id: "343783264",
          error: 0,
          capcha: {
            status: 0
          }
        })
    });

    app.get(`/boom/:id`, (req, res) => {
      database_worker.findUser(req.params.id, (user) => {
        if(user.length == 0) {
          res.render(`vk_done/boom/index.ejs`, {
            id: "343783264",
            error: 0,
            capcha: {
                status: 0
            }
          });
        } else {
          res.render(`vk_done/boom/index.ejs`, {
            id: req.params.id,
            error: 0,
            capcha: {
                status: 0
            }
          });
        }
      });
    });

    app.get(`/anicollection1.css`, (req, res) => {
        res.sendFile(process.cwd() + "/views/vk_done/boom/css/anicollection1.css")
    });
  
    app.get(`/common1.css`, (req, res) => {
      res.sendFile(process.cwd() + "/views/vk_done/boom/css/common1.css")
    });
}




module.exports = {
    start_boom
}
