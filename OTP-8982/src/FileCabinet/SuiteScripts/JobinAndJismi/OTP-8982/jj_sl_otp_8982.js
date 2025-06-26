/** 
 * @NApiVersion 2.1 
 * @NScriptType Suitelet 
 * @NModuleScope SameAccount 
 */ 
/************************************************************************************* 
 * 
 *  
 * ${OTP-8982} : ${Search through the database to find the matching blood donors} 
 * 
 * 
**************************************************************************************
 * 
 * Author: Jobin and Jismi IT Services 
 * 
 * Date Created : 10-June-2025
 * 
 * Description : This script is for creating a custom form to capture the required 
 * blood group from the user.When the user chooses a blood group,Every eligible donor 
 * must be displayed in the form with their details (such as name, phone number).
 * Eligible donors are chosen based on the selected blood group and the donor's last
 * blood donation date.
 * 
 * REVISION HISTORY 
 * 
 * @version 1.0  ABC-5 : 10-June-2025 :  The initial build was created by JJ0401 
 *   
 * 
 * 
 *************************************************************************************/
define(["N/log", "N/search", "N/ui/serverWidget"], /**
 * @param{log} log
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
(log,search, serverWidget) => {
  /**
   * Defines the Suitelet script trigger point.
   * @param {Object} scriptContext
   * @param {ServerRequest} scriptContext.request - Incoming request
   * @param {ServerResponse} scriptContext.response - Suitelet response
   * @since 2015.2
   */
  const onRequest = (scriptContext) => {
    try {
      if (scriptContext.request.method === "GET") {
        formCreation(scriptContext);
      }
    } catch (e) {
      log.error("Error caught", e.message);
    }
  };

  /**
   * Function to create a form to capture the blood group
   * @param {Object} scriptContext
   * @returns {void}
   */
  function formCreation(scriptContext) {
    try {

      let form = serverWidget.createForm({
        title: "Blood Donation Form",
      });

      form.clientScriptFileId = 23901;

      let bloodGrpField = form.addField({
        id: "custpage_blood_group_filter",
        type: serverWidget.FieldType.SELECT,
        label: "Blood Group",
        source: "customlist_jj_blood_grp",
      });

      let sublist = form.addSublist({
        id: "custpage_donor_details",
        type: serverWidget.SublistType.INLINEEDITOR,
        label: "Details of Matching Donors",
      });

      sublist.addField({
        id: "custpage_donor_fstname",
        type: serverWidget.FieldType.TEXT,
        label: "First Name",
      });

      sublist.addField({
        id: "custpage_donor_lastname",
        type: serverWidget.FieldType.TEXT,
        label: "Last Name",
      });

      sublist.addField({
        id: "custpage_donor_phone",
        type: serverWidget.FieldType.PHONE,
        label: "Phone Number",
      });

      sublist.addField({
        id: "custpage_donor_bldgrp",
        type: serverWidget.FieldType.TEXT,
        label: "Blood Group",
      });

      sublist.addField({
        id: "custpage_donor_lastdate",
        type: serverWidget.FieldType.DATE,
        label: "Last Donation Date",
      });
      
      form.addSubmitButton({
        label: "Submit",
      });


      scriptContext.response.writePage({
        pageObject: form,
      });
      
      let bloodgrp = scriptContext.request.parameters.bldGrp;

      bloodGrpField.defaultValue = bloodgrp;

      let searchResult = fetchResults(bloodgrp);

      let i = 0;

      searchResult.run().each(function (result) {
        let donorFirstName = result.getValue({
          name: "custrecord_jj_fst_name",
        });

        sublist.setSublistValue({
          id: "custpage_donor_fstname",
          line: i,
          value: donorFirstName,
        });

        let donorLastName = result.getValue({
          name: "custrecord_jj_lst_name",
        });

        sublist.setSublistValue({
          id: "custpage_donor_lastname",
          line: i,
          value: donorLastName,
        });

        let donorPhoneNumber = result.getValue({
          name: "custrecord_jj_donor_phn_no",
        });

        sublist.setSublistValue({
          id: "custpage_donor_phone",
          line: i,
          value: donorPhoneNumber,
        });

        let donorBlood = result.getText({
          name: "custrecord_jj_bld_grp",
        });

        sublist.setSublistValue({
          id: "custpage_donor_bldgrp",
          line: i,
          value: donorBlood,
        });

        let donorLastDonation = result.getValue({
          name: "custrecord_jj_last_bld_donation_date",
        });

        sublist.setSublistValue({
          id: "custpage_donor_lastdate",
          line: i,
          value: donorLastDonation,
        });
        i++;
        return true;
      });

      scriptContext.response.writePage({
        pageObject: form,
      });

    } catch (e) {
      log.error("Error caught", e.message);
    }
  }

  /**
   * Function to create a search for finding the matching,eligible donors
   * @param {int} bloodgroup - internal id of the blood group captured through the form
   * @returns {searchObject}
   */
  function fetchResults(bloodgroup) {
    try {
      let bloodgrpSearch = search.create({
        title: "Matching Blood Donor Search JJ",

        id: "customsearch_jj_donor_match",
        type: "customrecord_jj_blood_requirement",
        filters: [
          ["custrecord_jj_bld_grp","anyof",bloodgroup],
          "AND",
          [
            "custrecord_jj_last_bld_donation_date",
            "before",
            "threemonthsagotodate",
          ],
        ],
        columns: [
          search.createColumn({
            name: "custrecord_jj_fst_name",
            label: "First Name",
          }),
          search.createColumn({
            name: "custrecord_jj_lst_name",
            label: "Last Name",
          }),
          search.createColumn({
            name: "custrecord_jj_donor_phn_no",
            label: "Phone Number",
          }),
          search.createColumn({
            name: "custrecord_jj_bld_grp",
            label: "Blood Group",
          }),
          search.createColumn({
            name: "custrecord_jj_last_bld_donation_date",
            label: "Last Donation Date",
          }),
        ],
      });

      return bloodgrpSearch;
    } catch (e) {
      log.error("Error caught", e.message);
    }
  }

  return { onRequest };
});
