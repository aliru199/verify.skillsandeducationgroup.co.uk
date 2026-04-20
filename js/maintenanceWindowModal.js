$(async function () {
  // Do nothing if the modal been dismissed for this maintenance window according to local storage
  const maintenanceWindowId = $("#maintenanceWindowModal").data(
    "maintenance-window-id"
  );
  const localMaintenanceWindowId = localStorage.getItem(
    "maintenance-window-id"
  );

  if (
    localMaintenanceWindowId &&
    localMaintenanceWindowId === maintenanceWindowId
  )
    return;

  // Do nothing if the modal been dismissed for this maintenance window according to the server
  const shouldShow = await abp.services.app.maintenanceWindowModal.shouldShow();

  if (!shouldShow) return;

  // Cause the OK button in the modal to close the modal
  $("#maintenanceWindowModal .btn-success").on("click", function () {
    $("#maintenanceWindowModal").modal("hide");
  });

  // When the modal is dismissed...
  $("#maintenanceWindowModal").on("hide.bs.modal", async function () {
    // Store locally that the modal has been dismissed for this maintenance window
    localStorage.setItem("maintenance-window-id", maintenanceWindowId);

    // If user is authenticated, store on server that the modal has been dismissed for this maintenance window
    if (abp.session.userId !== null)
      await abp.services.app.maintenanceWindowModal.confirmCurrentMaintenanceWindow();
  });

  // Show the modal
  $("#maintenanceWindowModal").modal("show");
});
