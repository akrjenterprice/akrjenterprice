var mysql=require('mysql');
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"akrj signup"
})
con.connect(function(err){
    if(err) throw err;
    console.log("connected");
    con.query("SELECT * FROM signup",function(err,result){
        if(err) return console.log(err);
        return console.log(fields);
    })
})