const cds = require('@sap/cds');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
const { getDestination } = require('@sap-cloud-sdk/connectivity');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
 
 
//Service Definition - Defined the Service
module.exports = cds.service.impl(function () {
  this.on('getTemplateFile', async (req) => {
    try {
      const { eventId } = req.data;
 
      // Step 1: Fetch Ariba API data
      const response = await executeHttpRequest(
        {
          destinationName: 'ARIBA_API_Consumption',
          forwardAuthToken: false
        },
        {
          method: 'GET',
          url: `/events/${eventId}/supplierInvitations`,
        }
      );
 
      const apiData = response.data.payload || [];
      // Step 2: Load Excel template
      const workbook = new ExcelJS.Workbook();
      const filePath = path.join(__dirname, '../template/BID_motherson_V1_template.xlsx');
 
      if (!fs.existsSync(filePath)) {
        req.error(404, 'Template not found');
        return;
      }
 
      await workbook.xlsx.readFile(filePath);
 
      const worksheet = workbook.getWorksheet('1. MPBC');
      if (!worksheet) {
        throw new Error("Worksheet not found");
      }
 
      // Step 3: Fill data into Excel
      const supplierCols = ['G', 'K', 'O']; // Supplier 1, 2, 3 columns
 
      apiData.forEach((item, index) => {
        if (index > 2) return;
 
        const col = supplierCols[index];
        const mainContact = item.mainContact || {};
        const organization = item.organization || {};
        const address = organization.address || {};
 
        worksheet.getCell(`${col}11`).value = organization.name || '';
        worksheet.getCell(`${col}13`).value = mainContact.name || '';
        worksheet.getCell(`${col}14`).value = address.phone || '';
        worksheet.getCell(`${col}15`).value = mainContact.emailAddress || '';
        worksheet.getCell(`${col}16`).value = item.invitationId || '';
        worksheet.getCell(`${col}19`).value = address.country || '';
        worksheet.getCell(`${col}22`).value = item.registrationStatus || '';
      });
      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer).toString('base64');
    }
    catch (error)
    {
      console.error("Error:", error.message);
      req.error(500, error.message);
    }
  });
});