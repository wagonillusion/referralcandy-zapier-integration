const should = require('should');

const zapier = require('zapier-platform-core');

const moment = require("moment");

zapier.tools.env.inject()

// Use this to make test calls into your app:
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('Purchase Create', () => {

  it('should create purchase with defaults', (done) => {
    const epochNow = moment().unix();

    const bundle = {
      inputData: {
        first_name: `Mister${epochNow}`,
        email: `Mister${epochNow}@doesnotexist.com`,
        invoice_amount: 9,
        currency_code: 'USD'
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
