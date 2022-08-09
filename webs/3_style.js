var database_worker = require("../mysql/workers");
const fs = require('fs');

function start_style(app) {
    app.get(`/css/css2.css`, (req, res) => {
      res.sendFile(process.cwd() + "/views/css/css2.css")
    });
  
    app.get(`/css/style.css`, (req, res) => {
        res.sendFile(process.cwd() + "/views/css/style.css")
    });
}

module.exports = {
    start_style
}
