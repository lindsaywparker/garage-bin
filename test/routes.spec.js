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
          res.status.should.equal(100);
          done();
        });
    });
  
  // describe('POST /api/v1/item', () => {
  //   it('should create a new item', (done) => {
  //     chai.request(server)
  //       .end((err, res) => {
  //         
  //         done();
  //       });
  //   });
  //   
  //   it('should not create a new item with missing parameters', (done) => {
  //     chai.request(server)
  //       .end((err, res) => {
  //         
  //         done();
  //       });
  //   });
  //   
  //   it('should not create a new item if the item already exists in the table', (done) => {
  //     chai.request(server)
  //       .end((err, res) => {
  //         
  //         done();
  //       });
  //   });
  // });
  // 
  // describe('PUT /api/v1/item', () => {
  //   it('should update an item', (done) => {
  //     chai.request(server)
  //       .end((err, res) => {
  //         
  //         done();
  //       });
  //   });
  //   
  //   it('should not update an item if the item does not exist', (done) => {
  //     chai.request(server)
  //     .end((err, res) => {
  //         
  //         done();
  //       });
  //   });
  });
});
