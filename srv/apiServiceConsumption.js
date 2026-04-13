const cds = require('@sap/cds');
require('@sap/xsenv').loadEnv();
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
module.exports = cds.service.impl(function ()
{
  this.on('getAribaData', async (req) => {
    try
    {
      const response = await executeHttpRequest(
        { 
          destinationName: 'ARIBA_API_Consumption' 
        },
        {
          method: 'GET',
          url:'/manage/apps',
          headers:
          {
            'Content-Type': 'application/json'
          }
        }
      );
      var res=response.data;
      console.log(response.data);
      return response.data; 
    }
    catch (error)
    {
      console.error(error);
      req.error(500, 'Error calling Ariba API');
    }
  });
});