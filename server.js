const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// DATABASE CONFIGURATION
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ENDPOINTS
// Get all items
app.get('/api/v1/item', (request, response) => {
  database('item').select()
    .then((items) => {
      response.status(200).json(items);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// And an item
app.post('/api/v1/item', (request, response) => {
  const item = request.body;
  
  for (const requiredParameter of ['name', 'reason', 'cleanliness']) {
    if (!item[requiredParameter]) {
      return response.status(422).json({
        error: `Missing required ${requiredParameter} parameter`,
      });
    }
  }
  
  database('item').insert(item, '*')
    .then(item => {
      response.status(201).json(item[0]);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// Change an item
app.put('/api/v1/item/:id', (request, response) => {
  const { id } = request.params;
  const updates = request.body;
  
  database('item').where('id', id).update(updates)
    .then((result) => {
      response.status(200).json({ result });
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`GarbageBin is running on http://localhost:${app.get('port')}.`);
});
