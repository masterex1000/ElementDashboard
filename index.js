const express = require('express');
const Gun = require("gun");
const path = require('path');
const bodyParser = require('body-parser');
const ntClient = require('wpilib-nt-client');

const app = express();

const networkTablesClient = new ntClient.Client();

const config = require("./config.json");


const listener = app.listen(config.port || (process.env.PORT || 5810), function () {
  console.log('[Server] ElementDashboard Is Listening on port ' + listener.address().port);
});

var gun = new Gun({
  localStorage: false,
  radix: false,
  radisk: false,
  web: listener
});

networkTablesClient.start((isConnected, err) => {
  // Displays the error and the state of connection


  console.log(networkTablesClient.getKeys());

  console.log({
    isConnected,
    err
  });

}, config.networkDashboard);

networkTablesClient.addListener((key, val, type, id) => {
  if (key.startsWith("/ElementDashboard/") || key.startsWith("/SmartDashboard/")) {
    //Lets handle this value
    console.log({
      key,
      val,
      type,
      id
    });
    gun.get("ElementDashboard").get(key.replace("/ElementDashboard/", "").replace("/SmartDashboard/", "")).put(val);
  } else {
    // console.log({
    //   key,
    //   val,
    //   type,
    //   id
    // });
  }
});

app.use(Gun.serve); // host a gun instance

app.set('views', path.join(__dirname, 'views'));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


function getValueFromKey(networkTables, key) {
  return networkTables.getEntry(networkTables.getKeyID(key));
}