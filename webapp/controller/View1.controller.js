sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Component",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/UploadCollectionParameter",
	"sap/m/MessageToast"
], function(jquery, Component, Controller, JSONModel, UploadCollectionParameter,MessageToast) {
	"use strict";
	return Controller.extend("com.sapZSQRMBWA.controller.View1", {
		onInit: function() {

			this.getView().byId("inspectionTable").getTable().setSelectionMode(sap.ui.table.SelectionMode.None);

		},
		getMyComponent: function() {
			var sComponentId = Component.getOwnerIdFor(this.getView());
			return sap.ui.component(sComponentId);
		},
		onBeforeRendering: function() {
			// var oStartupParameters = this.getMyComponent().getComponentData().startupParameters;
			var oVal = {};
			oVal.StatusId = "01";
			this.getView().byId("smartFilterBar").setFilterData(oVal);
		},
		onSmartTableEdit: function(oEvent) {
			if (!this._oDialogEdit) {
				this._oDialogEdit = sap.ui.xmlfragment(this.getView().getId(), "com.sapZSQRMBWA.fragments.EditFinding", this);
				this._oDialogEdit.setModel(this.getView().getModel());
				this._oDialogEdit.setContentHeight("60%");
				this._oDialogEdit.setContentWidth("90%");
				this.getView().addDependent(this._oDialogEdit);
			}
			this._oDialogEdit.setModel(this.getView().getModel("ZSQRMBWA"), "ZSQRMBWA");
			var InspectionId = oEvent.getSource().getParent().getBindingContext().getObject().inspection_id;
			var Findingid = oEvent.getSource().getParent().getBindingContext().getObject().id;
			var oParams = {
				"expand": "Attachments"
			};
			 var oPath;
			var Spath = "Findings(InspectionId='"+ InspectionId +"',Id='"+ Findingid+"')";

			oPath = {
				path: "ZSQRMBWA>/" + Spath,
				parameters: oParams
			};

			var SelectedValueHelp = new JSONModel();
			var oFilters = [
				new sap.ui.model.Filter("InspectionId", sap.ui.model.FilterOperator.EQ, InspectionId),
				new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, Findingid)
			];

			var readRequestURL = "/Findings(InspectionId='" + InspectionId + "',Id='" + Findingid + "')";
			this.getOwnerComponent().getModel("ZSQRMBWA").read(readRequestURL, {
				urlParameters: {
					$expand: "Attachments"
				},
				async: false,
				success: function(oData) {
					var Data = {
						//	"supplier":supplier,
						"Findingid": oData.Id,
						"Subject": oData.Subject,
						"Category": oData.Category,
						"Question": oData.Question,
						"Score": oData.Score,
						"Status": oData.Status,
						"Finding": oData.Findings,
						"InspectionLocation": oData.InspectionLocation,
						"ShortTermContainment": oData.ShortTermContainment,
						"SupplerRiskCategory": oData.SupplerRiskCategory,
						"SupplierCasualFactor": oData.SupplierCasualFactor,
						"uploadUrl": window.location.origin + (this._oDialogEdit.getModel("ZSQRMBWA").sServiceUrl + readRequestURL) + "/Attachments"
					};
					SelectedValueHelp.setData(Data);

				}.bind(this),
				error: function(Error) {
					MessageToast.show("Error in Backend service");
				}
			});

			this._oDialogEdit.getContent()[0].getItems()[0].getAggregation("_header").getItems()[1].getContent()[0].bindObject(oPath);
			this._oDialogEdit.setModel(SelectedValueHelp, "SelectedValueHelp");

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialogEdit.open();

		},
		onNewInspectionPress: function(oEvent) {
			var InspectionId = oEvent.getSource().getText();
			var sPath = "Inspections('')";
			this.getOwnerComponent().getRouter().navTo("InspectionView", {
				context: sPath
			}, false);
		},
		onDialogCancelButton: function(oEvent) {
			this._oDialogEdit.destroy();
			this._oDialogEdit = undefined;
		},
		onDialogSubmitButton: function(oEvent) {
			this._oDialogEdit.destroy();
			this._oDialogEdit = undefined;
		},
		onInspectionPress: function(oEvent) {
			var InspectionId = oEvent.getSource().getText();
			var sPath = "Inspections('" + InspectionId + "')";
			this.getOwnerComponent().getRouter().navTo("InspectionView", {
				context: sPath
			}, false);
		},
		onSmartTableSelectionChange: function(oEvent) {
			var context = oEvent.getParameters().rowContext.getObject();
			oEvent.getSource().getParent().getParent().getParent().getModel("FindingModel").setData(context);
		},

		/////// Upload Collection Code ///////

		onChange: function(oEvent) {
			var oModel = this.getView().getModel("ZSQRMBWA");
			oModel.refreshSecurityToken();
			var oHeaders = oModel.oHeaders;
			var sToken = oHeaders['x-csrf-token'];
			var oUploadCollection = oEvent.getSource();
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});

			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onUploadComplete: function(oEvent) {
			this.getView().getModel("ZSQRMBWA").refresh();
			var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			var oUploadCollection = oEvent.getSource();
			for (var i = 0; i < oUploadCollection.getItems().length; i++) {
				if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
					oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
					break;
				}
			}
		},

		onBeforeUploadStarts: function(oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},
		onIconTabBarChange: function(oEvent) {
			var SelectedKey = oEvent.getParameters().selectedKey;
			if (SelectedKey === "2") {
				oEvent.getSource().getParent().getParent().getBeginButton().setVisible(false);
			} else {
				oEvent.getSource().getParent().getParent().getBeginButton().setVisible(true);
			}
		}
	});
});