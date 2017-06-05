$(document).ready(function () {
	var href = window.location.href;
	var splitString = href.split("/");
	var LeaseID = splitString[splitString.length -1];
	console.log(LeaseID);
	getLeaseObject(LeaseID);
})

function getLeaseObject(LeaseID) {
	$.getJSON("/getLease/" + LeaseID, function (data) {
		var LeaseObject = data.recordset[0];
		$("#LeaseID").val(LeaseObject.LeaseID);
	});
}