const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('API Routes', () => {
  before((done) => {
    knex.migrate.latest()
      .then(() => done());
  });
  
  beforeEach((done) => {
    knex.seed.run()
      .then(() => done());
  });
  
  describe('GET /api/v1/item', () => {
    it('should return all items', (done) => {
      chai.request(server)
        .get('/api/v1/item')
        .end((err, res) => {
          res.status.should.equal(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(3);
          res.body.forEach(item => {
            item.should.have.property('id');
            item.should.have.property('name');
            item.should.have.property('reason');
            item.should.have.property('cleanliness');
          });
          done();
        });
    });
  });
  
  describe('POST /api/v1/item', () => {
    it('should create a new item', (done) => {
      chai.request(server)
        .post('/api/v1/item')
        .send({
          id: 4,
          name: 'Lawn mower',
          reason: 'Lawn fighting',
          cleanliness: 'Sparkling',
        })
        .end((err, res) => {
          res.status.should.equal(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('reason');
          res.body.should.have.property('cleanliness');
          res.body.should.have.property('created_at');
          res.body.should.have.property('updated_at');
          res.body.id.should.equal(4);
          res.body.name.should.equal('Lawn mower');
          res.body.reason.should.equal('Lawn fighting');
          res.body.cleanliness.should.equal('Sparkling');
          done();
        });
    });
    
    it('should not create a new item with missing parameters', (done) => {
      chai.request(server)
        .post('/api/v1/item')
        .send({
          id: 4,
          reason: 'Lawn fighting',
          cleanliness: 'Sparkling',
        })
        .end((err, res) => {
          res.status.should.equal(422);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('Missing required name parameter');
          done();
        });
    });
    
    it('should not create a new item if the item already exists in the table', (done) => {
      chai.request(server)
      .post('/api/v1/item')
      .send({
        id: 1,
        name: 'Lawn mower',
        reason: 'Lawn fighting',
        cleanliness: 'Sparkling',
      })
      .end((err, res) => {
        res.status.should.equal(500);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.code.should.equal('23505');
        res.body.error.detail.should.equal('Key (id)=(1) already exists.');
        done();
        });
    });
  });
  
  describe('PUT /api/v1/item', () => {
    it('should update an item', (done) => {
      chai.request(server)
      .put('/api/v1/item/1')
      .send({
        cleanliness: 'Sparkling',
      })
      .end((err, res) => {
        res.status.should.equal(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('result');
        res.body.result.should.equal(1);
        done();
        });
    });
    
    it('should not update an item if the item does not exist', (done) => {
      chai.request(server)
      .put('/api/v1/item/11')
      .send({
        cleanliness: 'Sparkling',
      })
      .end((err, res) => {
        res.status.should.equal(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('result');
        res.body.result.should.equal(0);
        done();
        });
    });
  });
});
