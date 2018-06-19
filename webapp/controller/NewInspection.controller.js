sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	'sap/m/MessageBox'
], function(Controller, JSONModel, Filter, MessageBox) {
	"use strict";

	return Controller.extend("com.sapZSQRMBWA.controller.NewInspection", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.sapZSQRMBWA.view.NewInspection
		 */
		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("InspectionView").attachPatternMatched(this.onHandleRouteMatched, this);

		},
		onHandleRouteMatched: function(oEvent) {
			this.getView().getModel("ZSQRMBWA").setProperty("/busy", true);
			var oParams = {
				"expand" : "Findings,Findings/Attachments"
			};
			if(this.getView().getModel("ZSQRMBWA").getData()){
					this.getView().getModel("ZSQRMBWA").setData(null);
			}
			
			if (oEvent.getParameter("arguments").context) {
				this.sContext = oEvent.getParameter("arguments").context;
				var oPath;
				if (this.sContext) {
					oPath = {
						path: "ZSQRMBWA>/" + encodeURI(this.sContext),
						parameters: oParams
					};
				
					this.getView().bindObject(oPath);
					this.getView().getModel("ZSQRMBWA").updateBindings();
					this.getView().getModel().updateBindings();
					this.getView().getModel("ZSQRMBWA").refresh();
				}
			}
			this.getView().getModel("ZSQRMBWA").setProperty("/busy", false);	
		
		
		},
		onDialogPress: function(oEvent) {
		//	var supplier = this.getView().getModel("headerModel").getData().Supplier;
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.sapZSQRMBWA.fragments.AddFinding", this);
				this._oDialog.setModel(this.getView().getModel());
				// this._oDialog.getContent()[0].getItems()[0].getItems()[0].getContent()[0].getFormContainers()[0].getFormElements()[0].getFields()[
				// 	0].setValue(supplier);
				this._oDialog.setContentHeight("60%");
				this._oDialog.setContentWidth("90%");
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();

		},
		onDialogCancelButton: function(oEvent) {

			this._oDialog.destroy();
			this._oDialog = undefined;
		},
		onDialogSubmitButton: function(oEvent) {
			var oModel = new JSONModel();
			var arr = [];
			var count = 0;
			// var subject_id = this.getView().byId("SubjectSelect").getSelectedItem();
			// var category_id = this.getView().byId("SubjectSelect").getSelectedItem();
			// var question_id = this.getView().byId("questionSelect").getSelectedItem();
			// var Score = this.getView().byId("ScoreSelect").getSelectedItem();
			// var findings =  this.getView().byId("findingText").getValue();
			// var location = this.getView().byId("Location").getValue();
			// if(subject_id !== null && category_id !== null)
			var array = {
				"finding_id": "10053",
				"subject_id": (this.getView().byId("SubjectSelect").getSelectedItem() === null ? "" : this.getView().byId("SubjectSelect").getSelectedItem()
					.getText()),
				"category_id": (this.getView().byId("CategorySelect").getSelectedItem() === null ? "" : this.getView().byId("CategorySelect").getSelectedItem()
					.getText()),
				"question_id": (this.getView().byId("questionSelect").getSelectedItem() === null ? "" : this.getView().byId("questionSelect").getSelectedItem()
					.getText()),
				"Score": (this.getView().byId("ScoreSelect").getSelectedItem() === null ? "" : this.getView().byId("ScoreSelect").getSelectedItem()
					.getText()),
				"Status": (this.getView().byId("StatusSelect").getSelectedItem() === null ? "" : this.getView().byId("StatusSelect").getSelectedItem()
					.getText()),
				"findings": this.getView().byId("findingText").getValue(),
				"location": this.getView().byId("Location").getValue(),
				"RiskCategorySelect": (this.getView().byId("RiskCategorySelect").getSelectedItem() === null ? "" : this.getView().byId(
						"RiskCategorySelect").getSelectedItem()
					.getText()),
			};

			jQuery.each(array, function(index, value) {
				if (value !== null && value !== "") {
						switch (index) {
						case 'subject_id':
							this.getView().byId("SubjectSelect").setValueState(sap.ui.core.ValueState.None);
							break;
						case 'category_id':
							this.getView().byId("CategorySelect").setValueState(sap.ui.core.ValueState.None);
							break;
						case 'question_id':
							this.getView().byId("questionSelect").setValueState(sap.ui.core.ValueState.None);
							break;
						case 'Score':
							this.getView().byId("ScoreSelect").setValueState(sap.ui.core.ValueState.None);
							break;
						case 'Status':
							this.getView().byId("StatusSelect").setValueState(sap.ui.core.ValueState.None);
							break;
						case 'findings':
							this.getView().byId("findingText").setValueState(sap.ui.core.ValueState.None);
							break;
						case 'location':
							this.getView().byId("findingText").setValueState(sap.ui.core.ValueState.None);
							break;
						case 'RiskCategorySelect':
							this.getView().byId("RiskCategorySelect").setValueState(sap.ui.core.ValueState.None);
							break;
					}

					count++;
				} else {
					switch (index) {
						case 'subject_id':
							this.getView().byId("SubjectSelect").setValueState(sap.ui.core.ValueState.Error);
							break;
						case 'category_id':
							this.getView().byId("CategorySelect").setValueState(sap.ui.core.ValueState.Error);
							break;
						case 'question_id':
							this.getView().byId("questionSelect").setValueState(sap.ui.core.ValueState.Error);
							break;
						case 'Score':
							this.getView().byId("ScoreSelect").setValueState(sap.ui.core.ValueState.Error);
							break;
						case 'Status':
							this.getView().byId("StatusSelect").setValueState(sap.ui.core.ValueState.Error);
							break;
						case 'findings':
							this.getView().byId("findingText").setValueState(sap.ui.core.ValueState.Error);
							break;
						case 'location':
							this.getView().byId("findingText").setValueState(sap.ui.core.ValueState.Error);
							break;
						case 'RiskCategorySelect':
							this.getView().byId("RiskCategorySelect").setValueState(sap.ui.core.ValueState.Error);
							break;
					}
				}
			}.bind(this));

			if (count === 8) {
				arr.push(array);
				oModel.setData(arr);
				this.getView().byId("addInspectionTable").setModel(oModel);
				this._oDialog.destroy();
				this._oDialog = undefined;
			}

		},
		dialogAfterclose: function(oEvent) {
			this._oDialog.destroy();
			this._oDialog = undefined;
		},
		onNavBack: function(oEvent) {
			this.getOwnerComponent().getRouter().navTo("View1", {

			});
		},
		onAllInspectionPress: function() {
			this.getOwnerComponent().getRouter().navTo("View1", {

			});
		},
		onSaveInspectionPress: function() {

			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.information(
				"New Inspection Created, Number :123456", {
					actions: ["Ok"],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function(sAction) {
						this.getOwnerComponent().getRouter().navTo("View1", {

						});
					}.bind(this)
				}
			);

		},
		onDeletePress: function(oEvent) {
			var deleteRecord = oEvent.getSource().getBindingContext().getObject();
			var oData = this.getView().getModel().getData();
			for (var i = 0; i < oData.length; i++) {
				if (oData[i] === deleteRecord) {
					//	pop this._data.Products[i] 
					oData.splice(i, 1); //removing 1 record from i th index.
					this.getView().getModel().refresh();
					break; //quit the loop
				}
			}
		},
		onTableEditPress: function(oEvent) {
		//	var supplier = this.getView().getModel("headerModel").getData().Supplier;
		var Findingid = oEvent.getSource().getParent().getCells()[0].getText();
		var Subject = oEvent.getSource().getParent().getCells()[1].getText();
		var Category = oEvent.getSource().getParent().getCells()[2].getText();
		var Question =  oEvent.getSource().getParent().getCells()[3].getText();
		var Score = oEvent.getSource().getParent().getCells()[4].getText();
		var Status = oEvent.getSource().getParent().getCells()[5].getText();
		var Finding = oEvent.getSource().getParent().getCells()[6].getText();
		var InspectionLocation = oEvent.getSource().getParent().getCells()[7].getText();
		var Data = {
			"Findingid":Findingid,
			"Subject":Subject,
			"Category":Category,
			"Question":Question,
			"Score":Score,
			"Status":Status,
			"Finding":Finding,
			"InspectionLocation":InspectionLocation
		};
		var SelectedValueHelp = new JSONModel();
		SelectedValueHelp.setData(Data);
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.sapZSQRMBWA.fragments.EditFinding", this);
				this._oDialog.setModel(this.getView().getModel());
				this._oDialog.setModel(SelectedValueHelp,"SelectedValueHelp");
				this._oDialog.setContentHeight("60%");
				this._oDialog.setContentWidth("90%");
				this.getView().addDependent(this._oDialog);
			}
					var oPath;
					var Spath = oEvent.getSource().getParent().getBindingContext("ZSQRMBWA").sPath;
			
					oPath = {
						path: "ZSQRMBWA>" + Spath,
						parameters: {}
					};
					this._oDialog.getContent()[0].getItems()[0].getAggregation("_header").getItems()[1].getContent()[0].bindObject(oPath);

			
				// this._oDialog.getContent()[0].getItems()[0].getItems()[0].getContent()[0].getFormContainers()[0].getFormElements()[0].getFields()[
				// 	0].setValue(supplier);
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		onSubjectChange: function(oEvent) {
			var SelectedKey = oEvent.getParameters().selectedItem.getKey();
			var oFilter = new Filter("subject_id", sap.ui.model.FilterOperator.EQ, SelectedKey);
			if (SelectedKey !== "" || SelectedKey !== null) {
				this.getView().byId("CategorySelect").getBinding("items").filter([oFilter]);
				this.getView().byId("CategorySelect").setSelectedKey("");
				this.getView().byId("questionSelect").setSelectedKey("");
				this.getView().byId("QualityCategorySelect").setSelectedKey("");
				this.getView().byId("RiskCategorySelect").setSelectedKey("");

			} else {
				this.getView().byId("CategorySelect").getBinding("items").filter([]);
			}

		},
		onCategoryChange: function(oEvent) {
			var SelectedKey = oEvent.getParameters().selectedItem.getKey();
			var oFilter = new Filter("CATEGORY_ID", sap.ui.model.FilterOperator.EQ, SelectedKey);
			if (SelectedKey !== "" || SelectedKey !== null) {
				this.getView().byId("questionSelect").getBinding("items").filter([oFilter]);
				this.getView().byId("questionSelect").setSelectedKey("");
				this.getView().byId("QualityCategorySelect").setSelectedKey("");
				this.getView().byId("RiskCategorySelect").setSelectedKey("");
			} else {
				this.getView().byId("questionSelect").getBinding("items").filter([]);
			}
		},
		onQuestionChange: function(oEvent) {
			var QualityCategory = oEvent.getParameters().selectedItem.getBindingContext().getObject().QUALITY_CATEGORY;
			var RiskCategory = oEvent.getParameters().selectedItem.getBindingContext().getObject().DEFAULT_RISK_CATEGORY;
			this.getView().byId("QualityCategorySelect").setSelectedKey(QualityCategory);
			this.getView().byId("RiskCategorySelect").setSelectedKey(RiskCategory);
		}

	});

});