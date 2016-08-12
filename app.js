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

let getOptions = (key, rId) => {
  let opts = {
    method: 'POST',
    url: 'http://food2fork.com/api/get',
    formData: {
      key,
      rId
    },
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    json: true
  }

  return opts;
};

let searchOptions = (key, q, sort, page) => {
  let opts = {
    method: 'POST',
    url: 'http://food2fork.com/api/search',
    formData: {
      key
    },
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
    },
    json: true
  }

  if (q) {
    opts.formData.q = q;
  }

  if (sort) {
    opts.formData.sort = sort;
  }

  if (page) {
    opts.formData.page = page;
  }

  return opts;
};

//
// NOTE:  get API
//
//  key: API Key
//  rId: the recipe ID returned from the search api...
//
//
app.post('/get', function (req, res, next) {
  let key  = req.body.key;
  let rId  = req.body.rId;
  let opt  = getOptions(key, rId);

  request(opt, function (error, response, body) {
    if (error) {
      res.status(500).send('Something broke!');
    }
    else {
      res.json(body);
    }
  });
});
//
// NOTE:  search API
//
//  key: API Key
//    q: (optional) Search Query (Ingredients should be separated by commas).
//                  If this is omitted top rated recipes will be returned.
// sort: (optional) How the results should be sorted. See Below for details.
// page: (optional) Used to get additional results
//
// -----------------------------------------------------------------------
// Search Sorting
//
// The Food2Fork API offers two kinds of sorting for queries. The first is
// by rating. This rating is based off of social media scores to determine
// the best recipes.
//
// sort=r
//
// The second is by trendingness. The most recent recipes from our
// publishers have a trend score based on how quickly they are gaining
// popularity.
//
// sort=t
//
// -----------------------------------------------------------------------
// Pages (Search Only)
//
// Any request will return a maximum of 30 results. To get the next set
// of results send the same request again but with page = 2
// The default if omitted is page = 1
//
//
app.post('/search', function (req, res, next) {
  let key  = req.body.key;
  let q    = req.body.q;
  let sort = req.body.sort;
  let page = req.body.page;
  let opt  = searchOptions(key, q, sort, page);

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
  res.json({ "what": "a proxy for the search API on food2fork, with CORS support" });
});

let server = http.createServer(app);
let serverOnPort = server.listen(port);

console.log("-- Foodie Server listening on port " + port);
