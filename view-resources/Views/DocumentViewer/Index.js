var DocumentViewerIndex = (function () {
  let config = {
    data: [],
    id: "",
    isBlockchain: "",
    hasIssuance: "",
  };

  const dangerAlertTemplate = `<div class="alert-danger rounded p-3" role="alert">
                                             <i class="far fa-times-circle fa-lg" aria-hidden="true"></i>
                                             {0}
                                         </div>`;

  const warningAlertTemplate = `<div class="alert-warning rounded p-3" role="alert">
                                             <i class="far fa-exclamation-circle fa-lg" aria-hidden="true"></i>
                                             {0}
                                         </div>`;

  const successAlertTemplate = `<div class="alert-success rounded p-3" role="alert">
                                             <i class="far fa-check-circle fa-lg" aria-hidden="true"></i>
                                             {0}
                                         </div>`;

  const strFormat = function (template, ...args) {
    return template.replace(/{(\d+)}/g, (match, index) =>
      args[index] !== undefined ? args[index] : match
    );
  };

  const renderPage = function ($li) {
    let documentType = $li.data("documenttype");
    let referenceNumber = $li.data("reference");
    let state = $li.data("state");
    let expiryTime = $li.data("expirytime");
    let cancelledDate = $li.data("cancelleddate");
    let awardDate = $li.data("awarddate");
    let issuingBody = $li.data("issuingbody");
    let studentFullName = $li.data("studentfullname");
    let hasAccess = $li.data("hasaccess");

    config.id = $li.data("id");
    config.isBlockchain =
      $li.data("isblockchain") === true ||
      $li.data("isblockchain").toLowerCase() === "true";
    config.hasIssuance =
      $li.data("hasissuance") === true ||
      $li.data("hasissuance").toLowerCase() === "true";

    $("#pageContent").find(".breadcrumbs span:last").text(documentType);

    let documentState = "";

    switch (state) {
      case "NotFound":
        documentState += strFormat(
          dangerAlertTemplate,
          L("DocumentViewer:DocumentNotFound")
        );
        break;
      case "Expired":
        documentState += strFormat(
          dangerAlertTemplate,
          L("DocumentViewer:DocumentExpired", moment(expiryTime).format("L"))
        );
        break;
      case "Valid":
        if (awardDate != null && awardDate != "") {
          documentState += strFormat(
            successAlertTemplate,
            L(
              "DocumentViewer:DocumentIssuedOn",
              issuingBody,
              studentFullName,
              moment(awardDate).format("L")
            )
          );
        } else {
          documentState += strFormat(
            successAlertTemplate,
            L(
              "DocumentViewer:DocumentIssuedOnWithoutAwardDate",
              issuingBody,
              studentFullName
            )
          );
        }
        break;
      case "Cancelled":
        documentState += strFormat(
          dangerAlertTemplate,
          L(
            "DocumentViewer:DocumentCancelledOn",
            moment(cancelledDate).format("L")
          )
        );
        break;
      case "OutOfDate":
        documentState += strFormat(
          warningAlertTemplate,
          L("DocumentViewer:DocumentOutOfDate")
        );
        break;
    }

    $("#documentState").html(documentState);

    if (state !== "Expired" && state !== "NotFound") {
      const documentAndVerification = $("#documentAndVerification");

      let html = `<div id="documentViewerContainer" class="report-viewer-container mb-4">
                             <img src="/images/loading.gif" alt="${L(
                               "Loading"
                             )}" class="loader"/>
                         </div>`;

      html += `<div class="text-center mb-4">
                         <span>${L("ReferenceNumber")}:</span>
                         <span>${referenceNumber}</span>
                     </div>`;

      html += `<div class="button-section">
                         <button id="verifyDocument" type="button" class="btn btn-info" aria-label="${L(
                           "DocumentViewer:VerifyButton",
                           documentType
                         )}" ${hasAccess ? "" : "disabled"}>
                             <i class="far fa-check-circle" aria-hidden="true"></i>
                             ${L("DocumentViewer:VerifyButton", documentType)}
                         </button>
                     </div>`;

      DocumentViewer.showRecord(config.id);

      documentAndVerification.html(html);
    }
  };

  const handleDocumentsList = function () {
    $("#sidebar").on("click", ".list-group-item", function () {
      $("#hideDetails").trigger("click");

      $("#sidebar .list-group-item").removeClass("active");
      $(this).addClass("active");

      renderPage($(this));
    });

    $("#sidebar .list-group-item:not(.disabled)").first().trigger("click");
  };

  const renderVerifyTable = function ($verifyButton) {
    let document = config.data.find((m) => m.id === config.id);
    if (!document) {
      return;
    }

    $verifyButton.addClass("d-none");
    $("#detailsSection").removeClass("d-none");

    let recordData = document.fields || {};

    let tableBody = "";

    for (let key in recordData) {
      if (!recordData.hasOwnProperty(key)) continue;

      let value = recordData[key];

      if (value != null && value != "") {
        if (moment(value, ["YYYY-MM-DD", "MM/DD/YYYY"], true).isValid()) {
          value = moment(value).format("L");
        }

        tableBody += `<tr>
                            <td>${key}</td>
                            <td class="hidden ${
                              config.isBlockchain && !config.hasIssuance
                                ? "table-warning-text"
                                : "table-success-text"
                            }">${value}</td>
                            <td class="hidden text-center">${
                              config.isBlockchain && !config.hasIssuance
                                ? `<i class="far fa-hourglass-half table-warning-text fs-6" data-toggle="tooltip" data-placement="top" title="${L(
                                    "DocumentViewer:VerificationTable:PendingTooltip"
                                  )}"></i>`
                                : `<i class="far fa-check-circle table-success-text fs-6" data-toggle="tooltip" data-placement="top" title="${L(
                                    "DocumentViewer:VerificationTable:VerifiedTooltip"
                                  )}"></i>`
                            }</td>
                        </tr>`;
      }
    }

    $("#detailsSection table tbody").html(tableBody);
    $("#detailsSection #detailTableStatus").html(getTableStatus());
  };

  const registerAnimation = function () {
    const rows = $("#detailsSection table tbody tr");

    rows.each((index, row) => {
      const $lastCells = $(row).find("td.hidden");

      setTimeout(() => {
        $lastCells.addClass("show");
      }, index * 800);
    });

    setTimeout(() => {
      $("#detailTableStatus").addClass("show");
    }, rows.length * 800);
  };

  const handleVerifyButton = function () {
    $("#documentAndVerification").on("click", "#verifyDocument", function () {
      renderVerifyTable($(this));
      registerAnimation();
    });
  };

  const getTableStatus = function () {
    if (config.isBlockchain) {
      if (!config.hasIssuance) {
        return strFormat(
          warningAlertTemplate,
          L("DocumentViewer:Blockchain:Status:Pending")
        );
      }

      return strFormat(
        successAlertTemplate,
        L("DocumentViewer:Blockchain:Status:Success")
      );
    }

    return strFormat(successAlertTemplate, L("DocumentViewer:Status:Success"));
  };

  const handleHideDetailsButton = function () {
    $("#detailsSection").on("click", "#hideDetails", function (e) {
      e.preventDefault();

      const detailsSection = $("#detailsSection");

      if (!detailsSection.hasClass("d-none")) {
        detailsSection.find("tbody").empty();

        let tableStatus = $("#detailTableStatus");
        tableStatus.empty();
        tableStatus.removeClass("show").addClass("hidden");

        detailsSection.addClass("d-none");
        $("#verifyDocument").removeClass("d-none");
      }
    });
  };

  return {
    init: function (customConfig) {
      config = $.extend(true, {}, config, customConfig);

      const viewerConfig = {
        displayType: displayType.INLINE,
      };

      DocumentViewer.init(viewerConfig);

      handleDocumentsList();
      handleVerifyButton();
      handleHideDetailsButton();
    },
  };
})();
