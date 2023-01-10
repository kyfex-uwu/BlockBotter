const utils = require('../utils');
const ContainerHTML = utils.getTextFile("./scenes/Container.html");

exports.scene = class AbstractScene{
	constructor(path, title="Unknown", body="", script=""){
		this.path=path;
		this.title=title;
		this.body=body;
		this.script=script;
	}

	register(app){
		app.get(this.path, (req, res) => {
			res.send(ContainerHTML
				.replace("<!--REPLACE TITLE-->","KDBI - "+this.title)
				.replace("<!--REPLACE BODY-->",this.body)
				.replace("//REPLACE SCRIPT",this.script));
		});
	}
}
