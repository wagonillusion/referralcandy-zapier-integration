const should = require('should');

const zapier = require('zapier-platform-core');

zapier.tools.env.inject()

// Use this to make test calls into your app:
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('Purchase Create', () => {

  it('should create purchase', (done) => {
    const bundle = {
      inputData: {
        email: `${Math.floor((new Date).getTime()/1000)}@doesnotexist.com`
      }
    };

    appTester(App.creates.purchase.operation.perform, bundle)
      .then(result => {
        result.message.should.eql('Success')
        done();
      })
      .catch(done);
  });

});
