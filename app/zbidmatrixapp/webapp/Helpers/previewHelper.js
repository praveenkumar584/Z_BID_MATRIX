sap.ui.define([
    "sap/m/MessageToast"
], (MessageToast) => {
    "use strict";
    return {
        async previewTemplate(oController)
        {
            const oBtn   = oController.byId("previewBtn");
            const oBusy  = oController.byId("busyIndicator");
            const oStrip = oController.byId("msgStrip");
            oBtn.setEnabled(false);
            oBusy.setVisible(true);
            oStrip.setVisible(false);
            try
            {
                const sBase64 = await oController.fetchBase64Data();
                oController.workbook = XLSX.read(sBase64, {
                    type: 'base64',
                    cellStyles: true,
                    cellFormula: true,
                    cellDates: true,
                    sheetStubs: true
                });
                const sheetName = "1. MPBC";
                if (!oController.workbook.Sheets[sheetName])
                {
                    throw new Error("Sheet not found");
                }
                oController.buildSingleTabView(sheetName);
                oController.renderSheetContent(sheetName);
                document.getElementById("excelPreviewWrapper").style.display = "block";
                MessageToast.show("Template loaded successfully!");
            }
            catch (err)
            {
                console.error(err);
                oStrip.setText("Failed: " + err.message);
                oStrip.setType("Error");
                oStrip.setVisible(true);
            }
            finally
            {
                oBtn.setEnabled(true);
                oBusy.setVisible(false);
            }
        }
    };
});