import axios from "axios";
import hubspotService from "./hubspot.service.js";

const createCheckoutSession = async (data) => {

  const dealId = data.dealId;

 //Fetch deal
  const deal = await hubspotService.getDeal(dealId);

  //Fetch associated contact
  const contact = await hubspotService.getAssociatedContact(dealId);

  //  Build payload
  console.log("Webhook URL:", `${process.env.BASE_URL}/api/ottu-webhook`);

  const payload = {
    amount: deal.properties.amount,
    currency_code: deal.properties.currency_code,
    type: "payment_request",
    payment_type: "one_off",
    order_no: dealId.toString(),
    pg_codes: [deal.properties.pg_codes],
    expiration_time:"00 05:00:00",

    customer_first_name: contact.properties.firstname,
    customer_last_name: contact.properties.lastname,
    customer_email: contact.properties.email,
    customer_phone: contact.properties.phone,

    billing_address: {
      line1: "Default Address",
      line2: "Default address",
      city: contact.properties.city,
      state: contact.properties.state,
      country: contact.properties.country,
      postal_code: "00000"
    },

    redirect_url: `${process.env.BASE_URL}/payment-success`,
    webhook_url: `${process.env.BASE_URL}/api/ottu-webhook`,
    language: deal.properties.language
  };

  //  Call Ottu Sandbox API
  const response = await axios.post(
    "https://sandbox.ottu.net/b/checkout/v1/pymt-txn/",
    payload,
    {
      headers: {
        Authorization: `Api-Key ${process.env.OTTU_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

export default {
  createCheckoutSession
};
