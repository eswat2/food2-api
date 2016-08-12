let express  = require('express');
let http     = require('http');
let fs       = require('fs');
let request  = require('request');

let bodyParser = require('body-parser');
let cors = require('cors');

let app  = express();
let port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let getOptions = (key, q) => {
  let opts = {
    method: 'GET',
    url: 'http://food2fork.com/api/search',
    qs: {
      key,
      q
    },
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    json: true
  }
  return opts;
};

app.post('/search', function (req, res, next) {
  let key = req.body.key;
  let q   = req.body.q;
  let opt = getOptions(key, q);

  request(opt, function (error, response, body) {
    if (error) {
      res.status(500).send('Something broke!');
    }
    else {
      res.json(body);
    }
  });
});

app.use((req, res) => {
  res.status(404).send('Invalid request!');
});

let server = http.createServer(app);
let serverOnPort = server.listen(port);

console.log("-- Foodie Server listening on port " + port);
