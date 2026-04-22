sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "zbidmatrixapp/Helpers/previewHelper",
    "zbidmatrixapp/Helpers/contentFetchHelper",
    "zbidmatrixapp/Helpers/tabContentHelper",
    "zbidmatrixapp/Helpers/contentRenderHelper"
], (Controller,previewHelper,contentFetchHelper,tabContentHelper,contentRenderHelper) => {
    "use strict";
    return Controller.extend("zbidmatrixapp.controller.z_main_view",{ workbook: null, zoomLevel: 1,
        onInit()
        {
            previewHelper.previewTemplate(this); //Added
        },
        onPreview()
        {
            previewHelper.previewTemplate(this);
        },

        fetchBase64Data()
        {
            return contentFetchHelper.fetchBase64();
        },

        buildSingleTabView(sheetName)
        {
            tabContentHelper.buildSingleTab(this, sheetName);
        },

        renderSheetContent(sheetName)
        {
            contentRenderHelper.renderSheet(this, sheetName);
        }
    });
});