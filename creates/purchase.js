const generateParams = require("../shared/generate_params");
const PURCHASE = require("../shared/param_sets").purchase;

const createPurchase = (z, bundle) => {
  const now = Math.floor((new Date).getTime()/1000)

  let data = {
    first_name: bundle.inputData.first_name || bundle.inputData.email || 'Firstname',
    email: bundle.inputData.email,
    order_timestamp: bundle.inputData.order_timestamp || now,
    browser_ip: bundle.inputData.browser_ip || '',
    user_agent: bundle.inputData.user_agent || '',
    invoice_amount: bundle.inputData.invoice_amount || 0,
    currency_code: bundle.inputData.currency_code || 'USD'
  }

  const params = generateParams(z, bundle, data);

  return z
    .request({
      url: `https://my.referralcandy.com/api/v1/purchase.json?${params}`,
      method: "POST",
      headers: { "content-type": "application/json" }
    })
    .then(response => {
      return response.json;
    });
};

module.exports = {
  key: "purchase",
  noun: "Purchase",
  display: {
    label: "Create Purchase",
    description: "Creates a new purchase on ReferralCandy"
  },
  operation: {
    inputFields: [
      { key: "email", required: true, type: "string" },
      { key: "first_name", required: false, type: "string" },
      { key: "order_timestamp", required: false, type: "integer" },
      { key: "browser_ip", required: false, type: "string" },
      { key: "user_agent", required: false, type: "string" },
      { key: "invoice_amount", required: false, type: "integer" },
      { key: "currency_code", required: false, type: "string" },
    ],
    perform: createPurchase,
    sample: {
      message: "Success",
      status: "true",
      referralcorner_url: "http://sample.referralcandy.com/SAMPLE_ID_CODE"
    }
  }
};
