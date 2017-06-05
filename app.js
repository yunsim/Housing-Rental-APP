'use strict'

// loading packages
var sql = require('mssql')
var express = require('express')
var cors = require('cors')
var path = require('path')
var app = express();
var bodyParser = require('body-parser');

// setting configuration
app.use(express.static(__dirname + '/static/public'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// functions

function getPasswd() {
  var pass = 'GoHuskies!'
  if (!pass) {
    throw new Error('Missing PASSWORD environment variable')
  }
  return pass
}

function connectToDb() {
  var config = {
    user: 'INFO445',
    password: getPasswd(),
    server: 'IS-HAY04.ischool.uw.edu',
    database: 'HOUSE_RENT'
  }
  return sql.connect(config)
}


function displayUsers() {
  console.log("displaying top 1000 Users");
  return new sql.Request().query('SELECT TOP 1000 * FROM dbo.tblCUSTOMER ORDER BY CustomerID DESC');
}

function displayLeases() {
  console.log("displaying top 1000 Leases");
  return new sql.Request().execute('display_lease');
}

function updateUser(CustID, CustFname, CustLname, CustPhone, CustEmail, CustAddress, CustCity, CustState, CustZip, CustDOB, CustPasswd) {
  console.log("Updating Customer");
  return new sql.Request()
    .input('CID', sql.Int(), CustID)
    .input('Fname', sql.VarChar(60), CustFname)
    .input('Lname', sql.VarChar(60), CustLname)
    .input('CPhone', sql.VarChar(20), CustPhone)
    .input('CEmail', sql.VarChar(70), CustEmail)
    .input('CAddress', sql.VarChar(150), CustAddress)
    .input('City', sql.VarChar(40), CustCity)
    .input('State', sql.VarChar(70), CustState)
    .input('CZip', sql.VarChar(10), CustZip)
    .input('CDOB', sql.Date(), CustDOB)
    .input('password', sql.VarChar(50), CustPasswd)
    .execute('dbo.UpdateCustomer');
}

function updateLease(LeaseID, Building, Address, Unit, Location, City, Email, passwd, BeginDate, Duration, SignDate) {
  console.log("Updating Lease");
  return new sql.Request()
    .input('LID', sql.Int(), LeaseID)
    .input('Building', sql.VarChar(100), Building)
    .input('Address', sql.VarChar(150), Address)
    .input('Unit', sql.VarChar(100), Unit)
    .input('Loc', sql.VarChar(50), Location)
    .input('City1', sql.VarChar(25), City)
    .input('CusEmail', sql.VarChar(70), Email)
    .input('Cuspass', sql.VarChar(12), passwd)
    .input('BeDate', sql.Date(), BeginDate)
    .input('Duration1', sql.Int(), Duration)
    .input('SignD', sql.Date(), SignDate)
    .execute('dbo.UpdateLease')
}

function registerUser(CustFname, CustLname, CustPhone, CustEmail, CustAddress, CustCity, CustState, CustZip, CustDOB, Custpasswd) {
  console.log("Registering a new Customer");
  return new sql.Request()
    .input('Fname', sql.VarChar(60), CustFname)
    .input('Lname', sql.VarChar(60), CustLname)
    .input('CPhone', sql.VarChar(20), CustPhone)
    .input('CEmail', sql.VarChar(70), CustEmail)
    .input('CAddress', sql.VarChar(150), CustAddress)
    .input('City', sql.VarChar(40), CustCity)
    .input('State', sql.VarChar(70), CustState)
    .input('CZip', sql.VarChar(10), CustZip)
    .input('CDOB', sql.Date(), CustDOB)
    .input('password', sql.VarChar(50), Custpasswd)
    .execute('dbo.NewCustomer')
}

function signLease(Building, Address, Unit, Location, City, Email, passwd, BeginDate, Duration, SignDate) {
  console.log("Signing a new Lease");
  return new sql.Request()
    .input('Building', sql.VarChar(100), Building)
    .input('Address', sql.VarChar(150), Address)
    .input('Unit', sql.VarChar(100), Unit)
    .input('Loc', sql.VarChar(50), Location)
    .input('City1', sql.VarChar(25), City)
    .input('CusEmail', sql.VarChar(70), Email)
    .input('Cuspass', sql.VarChar(12), passwd)
    .input('BeDate', sql.Date(), BeginDate)
    .input('Duration1', sql.Int(), Duration)
    .input('SignD', sql.Date(), SignDate)
    .execute('dbo.NewLease')
}

function deleteCustomer(CustID) {
  console.log("Deleting Customer");
  var query = "DELETE FROM dbo.tblCUSTOMER WHERE CustomerID=" + CustID;
  console.log(query);
  return new sql.Request().query(query);
}

function deleteLease(LeaseID) {
  console.log("Deleting Lease");
  var query = "DELETE FROM dbo.tblLEASE WHERE LeaseID=" + LeaseID;
  console.log(query);
  return new sql.Request().query(query);
}

function getCustomerObject(CustID) {
    return new sql.Request().query('SELECT * FROM dbo.tblCUSTOMER WHERE CustomerID =' + CustID);
}

function getLeaseObject(LeaseID) {
    return new sql.Request().query('SELECT * FROM dbo.tblLEASE WHERE LeaseID =' + LeaseID);
}

//SET ROUTES
function makeRouter() {
  app.use(cors())  
 
  // frames
  app.get('/', function (req, res) {
    res.sendFile('/static/views/demo.html', { root: __dirname })
  })

  app.get('/Customers/all', function (req, res) {
    displayUsers().then(function (data) {
      return res.json(data);
    });
  })

  app.get('/Leases/all', function (req, res) {
    displayLeases().then(function (data) {
      return res.json(data);
    });
  })

  app.get('/editCustomer/:CustomerID', function (req, res) {
    res.sendFile('/static/views/editCustomer.html', { root: __dirname })
  })

  app.get('/editLease/:LeaseID', function (req, res) {
    res.sendFile('/static/views/editLease.html', { root: __dirname })
  })
  
  app.get("/getCustomer/:CustomerID", function(req, res) {
    var CustID = req.params.CustomerID;
    console.log(CustID);
    getCustomerObject(CustID).then(function(data) {
      return res.json(data);
    })
  })

  app.get("/getLease/:LeaseID", function(req, res) {
    var LeaseID = req.params.LeaseID;
    console.log(LeaseID);
    getLeaseObject(LeaseID).then(function(data) {
      return res.json(data);
    })
  })

  app.get("/deleteCustomer/:CustomerID", function(req, res) {
    var CustID = req.params.CustomerID;
    deleteCustomer(CustID).then(function(data) {
      res.redirect('/')
    })
  })
  
  app.get('/deleteCustomer', function (req, res) {
    deleteCustomer(CustID).then(function () {
      console.log(req.CustID);
      res.redirect('/')
    }).catch(function (err) {
      console.log(err);
    });
  })

  app.get("/deleteLease/:LeaseID", function(req, res) {
    var LeaseID = req.params.LeaseID;
    deleteLease(LeaseID).then(function(data) {
      res.redirect('/')
    })
  })
  
  app.get('/deleteLease', function (req, res) {
    deleteLease(LeaseID).then(function () {
      console.log(req.LeaseID);
      res.redirect('/')
    }).catch(function (err) {
      console.log(err);
    });
  })

  app.post('/registerUser', function (req, res) {
    var CustFname = req.body.CustFname;
    var CustLname = req.body.CustLname;
    var CustPhone = req.body.CustPhone;
    var CustEmail = req.body.CustEmail;
    var CustAddress = req.body.CustAddress;
    var CustCity = req.body.CustCity;
    var CustState = req.body.CustState;
    var CustZip = req.body.CustZip;
    var CustDOB = req.body.CustDOB;
    var CustPasswd = req.body.CustPasswd;

    registerUser(CustFname, CustLname, CustPhone, CustEmail, CustAddress, CustCity, CustState, CustZip, CustDOB, CustPasswd).then(function () {
      res.redirect('/')
    }).catch(function (err) {
      console.log(err);
    });
  });

  app.post('/signLease', function (req, res) {
    var Building = req.body.BuildingName;
    var Address = req.body.Address;
    var Unit = req.body.UnitName;
    var Location = req.body.LocationName;
    var City = req.body.CityName;
    var Email = req.body.UserEmail;
    var passwd = req.body.UserPasswd;
    var BeginDate = req.body.BeginDate;
    var Duration = req.body.duration;
    var SignDate = req.body.SignDate;

    signLease(Building, Address, Unit, Location, City, Email, passwd, BeginDate, Duration, SignDate).then(function () {
      res.redirect('/')
    }).catch(function (err) {
      console.log(err);
    });
  });

  app.post('/UserUpdate', function (req, res) {
    var CustID = req.body.CustomerID;
    console.log(CustID);
    var CustFname = req.body.FirstName;
    var CustLname = req.body.LastName;
    var CustPhone = req.body.CustPhone;
    var CustEmail = req.body.CustEmail;
    var CustAddress = req.body.CustAddress;
    var CustCity = req.body.CustCity;
    var CustState = req.body.CustState;
    var CustZip = req.body.CustZip;
    var CustDOB = req.body.DateOfBirth;
    var CustPasswd = req.body.password;

    updateUser(CustID, CustFname, CustLname, CustPhone, CustEmail, CustAddress, CustCity, CustState, CustZip, CustDOB, CustPasswd).then(function() {
      res.redirect('/')
    }).catch(function (error) {
      console.log(error);
    });
  });

  app.post('/LeaseUpdate', function (req, res) {
    var LeaseID = req.body.LeaseID;
    var Building = req.body.BuildingName;
    var Address = req.body.Address;
    var Unit = req.body.UnitName;
    var Location = req.body.LocationName;
    var City = req.body.CityName;
    var Email = req.body.UserEmail;
    var passwd = req.body.UserPasswd;
    var BeginDate = req.body.BeginDate;
    var Duration = req.body.duration;
    var SignDate = req.body.SignDate;
    updateLease(LeaseID, Building, Address, Unit, Location, City, Email, passwd, BeginDate, Duration, SignDate).then(function() {
        res.redirect('/')
    }).catch(function (error) {
      console.log(error);
    });
  });
}

function startParty() {
  connectToDb().then(() => {
    makeRouter();
    app.listen(process.env.PORT || 3000);
  })
}

startParty()

console.log("Server started!")