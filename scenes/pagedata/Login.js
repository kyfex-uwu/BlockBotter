let buttons=[];
try{
	buttons=JSON.parse('/*REPLACE MAP buttons*/');
}catch{}

let parent = document.getElementById("login");
for(let i=0;i<buttons.length;i++){
	html`<button
	type="button"
	style="
		margin:0.5em;
		display: inline-block;"
	@click="${()=>{
		window.location.href = "/login?id="+i;
	}}">${buttons[i].name}</button>`(parent);
}