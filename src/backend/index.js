const express = require('express');
const cors = require('cors');
const Twitter = require('twitter');
const mcache = require('memory-cache');
const orderBy = require('lodash.orderby');

// Keys should came from the env variables - simplified for the craft
const twitterClient = new Twitter({
  consumer_key: 'q3idV4FKupLvQaV7YJCYwTZhn',
  consumer_secret: 'M5edeYTECBdKOVxVKSlrhquNpdIWT6ENvkC0EJiXu5CnZ2N0Ly',
  access_token_key: '1141077649374294018-Vw9zdS2Xr3Qy5FkEtxwSgLp7ZyTw3j',
  access_token_secret: 'qYF8s0XK8Y6PRMbkdh3NWFaze4vMgxkRcCKyB4YRfLQyJ'
});

const app = express();
const port = 8080;
app.use(cors());

app.use(express.static(__dirname + '/../_dist'));
app.use(express.json());

const cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url;
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      };
      next()
    }
  }
};

app.get('/twitter/name/:q', cache(30), async(req, res) => {
  try {
    twitterClient.get('users/search', {q: req.params.q}, function(error, tweets, response) {
      if (error) res.send(error);
      if (!error) {
        res.send(tweets);
      }
    });
  } catch (error) {
    res.status(500);
    res.send('error', { error });
  }
});

app.get('/twitter/followers/:id/:cursor', cache(30), async(req, res) => {
  try {
    twitterClient.get('users/show', {user_id: req.params.id}, function(error, user) {
      if (error) res.send(error);
      if (!error) {
        try {
          twitterClient.get('followers/list', {user_id: req.params.id, count: 30, cursor: req.params.cursor}, function(error, followers) {
            if (error) res.send(error);
            if (!error) {
              let resFollowers = followers;

              if (req.query.orderBy) {
                resFollowers = {
                  ...followers,
                  users: orderBy(followers.users, [req.query.orderBy], [req.query.order])
                };
              }

              res.send({
                user,
                followers: resFollowers,
              });
            }
          });
        } catch (error) {
          res.status(500);
          res.send('error', { error });
        }
      }
    });
  } catch (error) {
    res.status(500);
    res.send('error', { error });
  }
});

app.listen(port, () => console.log(`Server running on port:  ${ port }`));
