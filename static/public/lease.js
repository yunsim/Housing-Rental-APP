var showLeasesBtn = $('#btn-showLeases');
console.log(showLeasesBtn);
showLeasesBtn.click(function (event) {
  console.log("button pressed")
  getLeases();
});

function getLeases() {
  $.getJSON("/Leases/all", function (data) {
    var table = $("#resultsTable");
    var tableHead = $('#tablehead');
    document.getElementById('resultsTable').innerHTML = "";
    document.getElementById('tablehead').innerHTML = "";

    tableHead.append(
        "<th>LeaseID</th>" +
        "<th>FirstName</th><th>LastName</th>" + 
        "<th>City</th>" + "<th>Location</th>" +
        "<th>Building</th>" + "<th>Address</th>" +
        "<th>Unit</th>" + "<th>UnitType</th>" +
        "<th>MonthlyRate</th>" + "<th>BeginDate</th>" +
        "<th>Duration</th>" + 
        "<th>Edit</th><th>Delete</th>");
    $.each(data, function (ID, LeaseObject) {
      if (ID == 'recordset') {
        LeaseObject.forEach(function(LeaseObject) {
          var rowData = $('<tr></tr>');
          rowData.append("<td>" + LeaseObject.LeaseID + "</td>");
          rowData.append("<td>" + LeaseObject.FirstName + "</td>");
          rowData.append("<td>" + LeaseObject.LastName + "</td>");
          rowData.append("<td>" + LeaseObject.City + "</td>");
          rowData.append("<td>" + LeaseObject.location + "</td>");
          rowData.append("<td>" + LeaseObject.Building + "</td>");
          rowData.append("<td>" + LeaseObject.BuildingAddress + "</td>");
          rowData.append("<td>" + LeaseObject.Unit + "</td>");
          rowData.append("<td>" + LeaseObject.UnitType + "</td>");
          rowData.append("<td>" + LeaseObject.MonthlyPrice + "</td>");
          rowData.append("<td>" + LeaseObject.BeginDate + "</td>");
          rowData.append("<td>" + LeaseObject.Duration + "</td>");
          rowData.append("<td><button type='submit' class='btn btn-info' onclick='editLease("
            + LeaseObject.LeaseID + ")'>Edit</button></td>");
          rowData.append("<td><button type='submit' class='btn btn-info'onclick='deleteLease("
            + LeaseObject.LeaseID + ")'>Delete</button></td>");
          table.append(rowData);
        })
      } 
    });
  });
}

function editLease(LeaseID) {
  window.location.href = "/editLease/" + LeaseID;
}

function deleteLease(LeaseID) {
  window.location.href = "/deleteLease/" + LeaseID;
}