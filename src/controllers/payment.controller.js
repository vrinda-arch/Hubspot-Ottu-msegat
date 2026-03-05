import ottuService from "../services/ottu.service.js";
import hubspotService from"../services/hubspot.service.js";
import msegatService from "../services/msegat.service.js";
// const generatePayment = async (req, res) => {
//   try {
//     console.log("Incoming body:", req.body);

//     const dealId = req.body.hs_object_id;

//     const ottuResponse = await ottuService.createCheckoutSession({ dealId });

//     await hubspotService.updateDeal(dealId, {
//       payment_status: ottuResponse.state,
//       ottu_session_id: ottuResponse.session_id,
//       payment_link: ottuResponse.checkout_page_url
//     });
    

//     res.status(200).json({ success: true });

//   } catch (error) {
//     console.error(error.response?.data || error.message);
//     res.status(500).json({ error: "Payment generation failed" });
//   }
// };



const generatePayment = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const dealId = req.body.hs_object_id;

    // create Ottu session
    const ottuResponse = await ottuService.createCheckoutSession({ dealId });

    // fetch associated contact
    const contact = await hubspotService.getAssociatedContact(dealId);

    // update HubSpot deal
    await hubspotService.updateDeal(dealId, {
      payment_status: ottuResponse.state,
      ottu_session_id: ottuResponse.session_id,
      payment_link: ottuResponse.checkout_page_url
    });
    
    // SMS message
    const message = `Hi ${contact.properties.firstname},

Please complete your payment using the link below:

  ${ottuResponse.checkout_page_url}`;
  //normalize phone number
    let phone = contact.properties.phone;

    if (phone.startsWith("+966")) {
      phone = phone.replace("+", "");
    }
    if (phone.startsWith("05")) {
      phone = phone.replace("05", "9665");
    }

    // send SMS
    if (ottuResponse.state === "created" && phone) {
    await msegatService.sendSMS({
      phone: contact.properties.phone,
      message
    });
  }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Payment generation failed" });
  }
};

const handleOttuWebhook = async (req, res) => {
  try {
    const { order_no, state, session_id } = req.body;

    await hubspotService.updateDeal(order_no, {
      payment_status: state, // "paid"
      payment_completed_at:
        state === "paid" ? new Date().toISOString() : null
    });

    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Webhook error");
  }
};



export default {generatePayment,handleOttuWebhook};