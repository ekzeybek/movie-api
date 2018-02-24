const mongoose=require("mongoose");
module.exports=function() 
{  
    mongoose.connect("mongodb://ekz:123456@ds249128.mlab.com:49128/movie");

    mongoose.connection.on('open',function(){
        console.log("mongo bağlandı");
    });
    mongoose.connection.on('error',function(err){
        console.log(err);
    });
}