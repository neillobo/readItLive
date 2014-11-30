exports.index = function(req, res){
  console.log("Serving get request on /");
     res.render('index');
};

