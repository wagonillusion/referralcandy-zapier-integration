// We can roll up all our behaviors in an App.

const purchase =  require('./creates/purchase')
const generateParams = require('./shared/generate_params')

const testAuthentication = (z, bundle) => {
  const params = generateParams(z, bundle)

  return z.request({
    url: `https://my.referralcandy.com/api/v1/verify.json?${params}`
  }).then(response => {
    if (response.status === 200) {
      return response
    }

    throw new Error('The access ID or secret key are incorrect')
  })
}

const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: {
    type: 'custom',
    connectionLabel: (_, bundle) => bundle.authData.access_id,
    test: testAuthentication,
    fields: [
      { key: 'access_id', type: 'string', required: true },
      { key: 'secret_key', type: 'string', required: true }
    ]
  },

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
  ],

  afterResponse: [
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
  },

  // If you want your searches to show up, you better include it here!
  searches: {
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [purchase.key]: purchase
  }
};

// Finally, export the app.
module.exports = App;
