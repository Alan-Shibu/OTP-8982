/** 
 * @NApiVersion 2.1 
 * @NScriptType ClientScript 
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
 * Description : This script is for capturing the blood group selected in the form and
 * passing it to the suitelet script.
 * 
 * REVISION HISTORY 
 * 
 * @version 1.0   10-June-2025 :  The initial build was created by JJ0401 
 *   
 * 
 * 
 *************************************************************************************/
define(["N/log", "N/record", "N/url"], /**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
function (log, record, url) {
  /**
   * Function to be executed when field is changed.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.sublistId - Sublist name
   * @param {string} scriptContext.fieldId - Field name
   * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
   * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
   *
   * @since 2015.2
   */
  function fieldChanged(scriptContext) {
    try {
      
      let currRec = scriptContext.currentRecord;
      let bloodGroup = currRec.getValue({
        fieldId: "custpage_blood_group_filter",
      });


      let suiteletUrl = url.resolveScript({
        scriptId: "customscript_jj_sl_otp_8982",
        deploymentId: "customdeploy_jj_sl_otp_8982",
        params: {
          'bldGrp': bloodGroup,
        },
      });

      window.onbeforeunload = null;
      window.location.href = suiteletUrl;      
    } catch (e) {
      console.log("Error caught", e.message);
    }
  }

  return {
    fieldChanged: fieldChanged,
  };
});