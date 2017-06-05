var showUsersBtn = $('#btn-showUsers');

console.log(showUsersBtn);
showUsersBtn.click(function (event) {
  console.log("button pressed")
  getUsers();
});

function getUsers() {
  $.getJSON('/Customers/all', function (data) {
    var table = $("#resultsTable");
    var tableHead = $('#tablehead');
    document.getElementById('resultsTable').innerHTML = "";
    document.getElementById('tablehead').innerHTML = "";
    tableHead.append(
        "<th>CustomerID</th><th>FirstName</th>" + 
        "<th>LastName</th><th>DateOfBirth</th>" +
        "<th>Email</th><th>Phone</th>" +
        "<th>City</th><th>Zip</th>" +
        "<th>Edit</th><th>Delete</th>");
    $.each(data, function (ID, CustomerObject) {
      
      if(ID == 'recordset'){
        // console.log(CustomerObject)
        CustomerObject.forEach(function(CustomerObject){

          var rowData = $('<tr></tr>');
          rowData.append("<td>" + CustomerObject.CustomerID + "</td>");
          rowData.append("<td>" + CustomerObject.FirstName + "</td>");
          rowData.append("<td>" + CustomerObject.LastName + "</td>");
          rowData.append("<td>" + CustomerObject.DateOfBirth + "</td>");
          rowData.append("<td>" + CustomerObject.CustEmail + "</td>");
          rowData.append("<td>" + CustomerObject.CustPhone + "</td>");
          rowData.append("<td>" + CustomerObject.CustCity + "</td>");
          rowData.append("<td>" + CustomerObject.CustZip + "</td>");
          rowData.append("<td><button type='submit' class='btn btn-info' onclick='editUser("
            + CustomerObject.CustomerID + ")'>Edit</button></td>");
          rowData.append("<td><button type='submit' class='btn btn-info'onclick='deleteUser("
            + CustomerObject.CustomerID + ")'>Delete</button></td>");
          table.append(rowData);
        })       
      }
    });
  });
}

function editUser(CustomerID) {
  window.location.href = "/editCustomer/" + CustomerID;
}

function deleteUser(CustomerID) {
  window.location.href = "/deleteCustomer/" + CustomerID;
}