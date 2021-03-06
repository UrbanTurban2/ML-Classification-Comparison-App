var express = require("express"),
	bodyParser= require("body-parser"),
    app = express(),
    fileUpload = require('express-fileupload');
var PythonShell = require('python-shell'),
sys = require('sys');
var spawn = require("child_process").spawn;


app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(fileUpload());
app.use(express.static(__dirname));

app.get("/", function(req, res){

	res.render("form");
});
app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  console.log('body'+req.body);
  let sampleFile = req.files.sampleFile;
  var filename = req.files.sampleFile.name;
    // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(__dirname+'/data/'+filename, function(err) {
    if (err)
      return res.status(500).send(err);
 	
 
  var options = {
  mode: 'text',
 // pythonPath: "C:/Users/hp/Anaconda3-2/python.exe",
  pythonPath:"C:/Users/lenovo/anaconda3/python.exe",
  pythonOptions: ['-u'],
  scriptPath: './',
  args: ["./data/"+filename]
};

var shell = new PythonShell('compare.py', options);
shell.on('message', function (message) {

 //console.log("message is"+message);
 console.log(typeof(message));
	var len = message.length;
  var fs = require('fs');
var obj;
fs.readFile('output', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
   console.log((obj));
   res.render("result", {obj:obj});
});


	//message = message.slice(2, len-1);
   //console.log("message is"+message);
	//message = JSON.parse(message);
	//console.log(message);
 
 //	res.render("result", {message: message, claim: claim, says:says});
// console.log("hii");

});

  });
});

app.listen(3000, "localhost", function(err){
	console.log("Server on duty, Mallady!");
});