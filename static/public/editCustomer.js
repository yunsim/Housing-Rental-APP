
$(document).ready(function () {
	console.log('test');
	var href = window.location.href;
	var splitString = href.split("/");
	var CustomerID = splitString[splitString.length -1];
	getCustomerObject(CustomerID);
})

function getCustomerObject(CustomerID) {
	$.getJSON("/getCustomer/" + CustomerID, function (data) {
		var CustomerObject = data.recordset[0];
		$("#CustomerID").val(CustomerObject.CustomerID);
	});
}