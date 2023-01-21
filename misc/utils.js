const fs = require('fs');

exports.getTextFile = function(str){
	try{
		return fs.readFileSync(str).toString();
	}catch(e){
		return "";
	}
}