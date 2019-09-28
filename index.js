const express = require('express');
const Gun = require("gun");
const path = require('path');
const bodyParser = require('body-parser');
const ntClient = require('wpilib-nt-client');

const app = express();

const networkTablesClient = new ntClient.Client();

const config = require("./config.json");

function pwtime(string) {
  console.log("[" + Math.floor(Date.now() / 1000) + "] " + string);
}

const listener = app.listen(config.port || (process.env.PORT || 5810), function () {
  pwtime('[Server] ElementDashboard Is Listening on port ' + listener.address().port);
  //console.log('[Server] ElementDashboard Is Listening on port ' + listener.address().port);
});

var gun = new Gun({
  localStorage: false,
  radix: false,
  radisk: false,
  web: listener
});

var onNTConnection = function (isConnected, err) {
  //console.log("[Server] ERROR: " + JSON.stringify({
  pwtime("[Server] ERROR: " + JSON.stringify({
    isConnected,
    err
  }));

  if(!isConnected) {
    pwtime("[Server] There was an error connecting to the network table. We will try reconnecting 7 seconds");
    //console.log("[Server] There was an error connecting to the network table. We will try reconnecting 7 seconds");

    setTimeout(() => {
      networkTablesClient.start(onNTConnection, config.networkDashboard);
    }, 7000);

  } else {
    pwtime("[Server] Connected to the network tables");
    //console.log("[Server] Connected to the network tables");
  }
}

networkTablesClient.start(onNTConnection, config.networkDashboard);

networkTablesClient.addListener((key, val, type, id) => {
  if (key.startsWith("/ElementDashboard/") || key.startsWith("/SmartDashboard/")) {
    //Lets handle this value
    //console.log({
    pwtime({
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
