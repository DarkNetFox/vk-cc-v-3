const request = require('request')
const fs = require('fs');

function start_jquery(app) {
  app.get(`/jquery.js`, (req, res) => {
    res.sendFile(process.cwd() + "/views/jquery.min.js")
  });
}

module.exports = {
    start_jquery
}
