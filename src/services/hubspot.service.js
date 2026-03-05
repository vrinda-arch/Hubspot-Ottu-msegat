import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const getHubspotClient = () => {
  return axios.create({
    baseURL: "https://api.hubapi.com",
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
      "Content-Type": "application/json"
    }
  });
};
console.log("HUBSPOT TOKEN:",process.env.HUBSPOT_PRIVATE_APP_TOKEN)

const getDeal = async (dealId) => {
  const hubspotClient = getHubspotClient();

  const response = await hubspotClient.get(
    `/crm/v3/objects/deals/${dealId}`,
    {
      params: {
        properties: "amount,currency_code,type,order_no,pg_codes,language"
      }
    }
  );

  return response.data;
};

const getAssociatedContact = async (dealId) => {
  const hubspotClient = getHubspotClient();

  const assoc = await hubspotClient.get(
    `/crm/v4/objects/deals/${dealId}/associations/contacts`
  );

  const contactId = assoc.data.results[0]?.toObjectId;

  if (!contactId) {
    throw new Error("No contact associated with deal");
  }

  const contact = await hubspotClient.get(
    `/crm/v3/objects/contacts/${contactId}`,
    {
      params: {
        properties: "firstname,lastname,email,phone,city,state,country"
      }
    }
  );

  return contact.data;
};

const updateDeal = async (dealId, properties) => {
  const hubspotClient = getHubspotClient();

  const response = await hubspotClient.patch(
    `/crm/v3/objects/deals/${dealId}`,
    {
      properties
    }
  );

  return response.data;
};

export default {
  getDeal,
  getAssociatedContact,
  updateDeal
};
