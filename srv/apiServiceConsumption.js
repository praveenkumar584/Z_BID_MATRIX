const cds = require('@sap/cds');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
const { getDestination } = require('@sap-cloud-sdk/connectivity');
module.exports = cds.service.impl(function ()
{
  this.on('getAribaData', async (req) => {
    try
    {
      const { eventId } = req.data;
      const dest = await getDestination({ destinationName: 'ARIBA_API_Consumption' });

      //console.log("DESTINATION:", JSON.stringify(dest, null, 2));

      const destConfig = dest?.originalProperties ?? {};
      const apiKey = destConfig.destinationConfiguration['URL.queries.apiKey'];
      const baseURL = destConfig.destinationConfiguration['URL'] || dest?.url;
      const token = dest?.authTokens?.[0]?.value;

      //console.log("Base URL:", baseURL);
      // console.log("apiKey:", apiKey);
      // console.log("token present:", !!token);

      const response = await executeHttpRequest(
        {
          destinationName: 'ARIBA_API_Consumption',
          forwardAuthToken: false
        },
        {
          method: 'GET',
          url: `/events/${eventId}/supplierInvitations`,
          params: {
            realm: 'motherson-sas-T',
            user: 'SAIAKHIL',
            passwordAdapter: 'PasswordAdapter1'
          },
          headers: {
            Accept: 'application/json',
            apiKey: apiKey
          }
        }
      );
      const res=response.data;
      console.log(res);

      //console.log("Actual request URL:", response.request?.res?.responseUrl || response.config?.url);
      //console.log("Actual params sent:", JSON.stringify(response.config?.params));

      return response.data;
    }
    catch (error)
    {
      console.error("Message:", error.message);
      console.error("Outgoing URL:", error?.config?.url);
      console.error("Outgoing baseURL:", error?.config?.baseURL);
      console.error("Outgoing headers:", JSON.stringify(error?.config?.headers));
      console.error("Response data:", JSON.stringify(error?.response?.data));
      req.error(500, error?.response?.data?.message || error.message);
    }
  });
});