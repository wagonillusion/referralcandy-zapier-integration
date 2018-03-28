const generateParams = require("../shared/generate_params");
const PURCHASE = require("../shared/param_sets").purchase;
const moment = require("moment");

const createPurchase = (z, bundle) => {
  const epochNow = moment().unix();

  let data = {
    // Required fields by both ReferralCandy API and Zapier
    first_name: bundle.inputData.first_name,
    email: bundle.inputData.email,
    invoice_amount: bundle.inputData.invoice_amount,
    // Required fields by ReferralCandy API, but we have sensible defaults
    order_timestamp:
      moment(bundle.inputData.order_timestamp).unix() || epochNow,
    currency_code: bundle.inputData.currency_code || "USD",
    browser_ip: bundle.inputData.browser_ip || "",
    user_agent: bundle.inputData.user_agent || "",
  };

  // Optional fields
  if (bundle.inputData.last_name) { data.last_name = bundle.inputData.last_name }
  if (bundle.inputData.locale) { data.locale = bundle.inputData.locale }
  if (bundle.inputData.discount_code) { data.discount_code = bundle.inputData.discount_code }
  if (bundle.inputData.accepts_marketing) { data.accepts_marketing = bundle.inputData.accepts_marketing }
  if (bundle.inputData.external_reference_id) { data.external_reference_id = bundle.inputData.external_reference_id }

  const params = generateParams(z, bundle, data);

  return z
    .request({
      url: `https://my.referralcandy.com/api/v1/purchase.json?${params}`,
      method: "POST"
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
      {
        key: "email",
        helpText: "Customer's email",
        required: true,
        type: "string"
      },
      {
        key: "first_name",
        helpText: "Customer's first name",
        required: true,
        type: "string"
      },
      {
        key: "last_name",
        helpText: "Customer's last name",
        required: false,
        type: "string"
      },
      {
        key: "invoice_amount",
        helpText: "Total invoice amount",
        required: true,
        type: "number"
      },
      {
        key: "currency_code",
        helpText:
          "ISO 4217 currency code used in order invoice (e.g. USD, GBP, INR)",
        required: true,
        type: "string"
      },
      {
        key: "order_timestamp",
        helpText: "UNIX timestamp of API call",
        required: false,
        type: "datetime"
      },
      {
        key: "locale",
        helpText:
          "Customer's preferred language. Defaults to campaign's default language if it is not set or not available to the campaign. This is a complete list of valid values (ISO 639-1 language code): en, fr, de, es, it, ja, nl, ru, zh-CN, zh-HK, zh-TW, da, no, sv, pt-BR",
        required: false,
        type: "string"
      },
      {
        key: "browser_ip",
        helpText: "IP address of customer when making the purchase",
        required: false,
        type: "string"
      },
      {
        key: "user_agent",
        helpText: "User agent string of the customer's web browser",
        required: false,
        type: "string"
      },
      {
        key: "discount_code",
        helpText:
          "Discount code used in the order. Blank if no discount code was used.",
        required: false,
        type: "string"
      },
      {
        key: "accepts_marketing",
        helpText:
          "Whether the customer opted in to marketing (true/false). Defaults to true",
        required: false,
        type: "boolean"
      },
      {
        key: "external_reference_id",
        helpText: "An ID that can be used to track this purchase externally.",
        required: false,
        type: "string"
      }
    ],
    perform: createPurchase,
    sample: {
      message: "Success",
      status: "true",
      referralcorner_url: "http://sample.referralcandy.com/SAMPLE_ID_CODE"
    }
  }
};
