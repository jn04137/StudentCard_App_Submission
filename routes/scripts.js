var express = require('express');
var router = express.Router();
const path = require("path");

//if scripts/<scriptname> is accessed, return the file from public/script/<scriptname>
router.get('/*', function(req, res, next) {
    //Potential for injection!
    //The client will have the ability to access any file in public/scripts/
    res.sendFile(path.resolve('public/scripts/' + req.url) );

});



module.exports = router;