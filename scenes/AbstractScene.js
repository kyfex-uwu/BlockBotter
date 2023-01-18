const utils = require('../utils');
const ContainerHTML = utils.getTextFile("./scenes/Container.html");

exports.scene = class AbstractScene{
	constructor(path, title="Unknown", body="", script="", replaceMap=[]){
		this.path=path;
		this.title=title;
		this.body=body;
		this.script=script;
		this.replaceMap=replaceMap;
	}

	register(app){
		app.get(this.path, (req, res) => {
			let toSend=ContainerHTML
				.replace("<!--REPLACE TITLE-->","KDBI - "+this.title)
				.replace("<!--REPLACE BODY-->",this.body)
				.replace("//REPLACE SCRIPT",this.script);

			for(let i=0;i<this.replaceMap.length;i++){
				toSend=toSend.replaceAll("<!--REPLACE MAP "+this.replaceMap[i][0]+"-->",this.replaceMap[i][1]);
				toSend=toSend.replaceAll("/*REPLACE MAP "+this.replaceMap[i][0]+"*/",this.replaceMap[i][1]);
			}
			res.send(toSend);
		});
	}
}
