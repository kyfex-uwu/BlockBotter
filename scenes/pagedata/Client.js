let internalWebsocket = new WebSocket("ws://localhost:3001");

internalWebsocket.addEventListener('message',(event)=>{
	let response=JSON.parse(event.data);
	if(response.responseToRequest){
		//resolve the promise with the event data
		waitingForResponses[response.sendId](response.data);
		return;
	}
	switch(response.event){
		case "addGuild":
			addServerIcon(response.data);
			break;
		case "addMessage":
			addMessage(response.data,"new");
			break;
	}
});

let currentSendId=0;
let waitingForResponses={};
function sendAndWait(event,toSend){
	currentSendId++;
	internalWebsocket.send(JSON.stringify({
		requestResponse:true,
		sendId:currentSendId,
		event: event,
		data: toSend
	}));
	return new Promise((resolve)=>{
		waitingForResponses[currentSendId]=resolve;
	});
}

//--

let localChannelCache={};

//--

const guildContainer = document.getElementById("guildContainer");
const channelContainer = document.getElementById("channelContainer");
const messageContainer = document.getElementById("messageContainer");

let currentGuild;//id
function switchGuild(guildId){
	currentGuild=guildId;
	currentChannel=undefined;
	channelContainer.textContent = "";

	sendAndWait("getGuildChannelsVisual",guildId)
		.then((guildChannels)=>{
			guildChannels.forEach((channelData)=>{
				if(currentChannel==undefined&&channelData.switchable)
					switchChannel(channelData.id);

				localChannelCache[channelData.id]=channelData.name;


				html`<li
					class="channel"
					data-discordId="${channelData.id}"
					@click="${(e)=>{
						switchChannel(channelData.id)
					}}">
					#${channelData.name}
					</li>`(channelContainer);
			});
		});
}

let currentChannel;//id
function switchChannel(channelId){
	currentChannel=channelId;
	messageContainer.textContent = "";

	sendAndWait("getChannelMessagesVisual",channelId)
		.then((messages)=>{
			messages.forEach((message)=>{
				addMessage(message,"old");
			});

			messageContainer.scroll({top:9999,behavior:"smooth"});
		});
}

//--

function addServerIcon(guildData){
	html`<li><img
		src="${guildData.iconURL}"
		class="server-img"
		@click="${(e)=>{
			switchGuild(guildData.id);
		}}"></li>`(guildContainer);
	if(currentGuild==undefined)
		switchGuild(guildData.id)
}

function addMessage(messageData, position){
	let toAdd = document.createElement("div");
	toAdd.classList.add("message");

	if(position=="old")
		messageContainer.append(toAdd);
	if(position=="new")
		messageContainer.prepend(toAdd);

	html`<img class="pfp-img" src="${messageData.pfp}">
		<span>
			<div>${messageData.name}</div>
			<div style="word-break: break-word;">
			${cleanMessage(messageData.content)}
			</div>
		</span>`(toAdd);
}

function cleanMessage(str){
	return str.replaceAll("\n","<br>")
	.replaceAll(/```(([^`]|([^`]..)|(.[^`].)|(..[^`]))+?)```/gs, (match, capture1)=>{ //multi line code blocks
		return `<div><code>${capture1}</code></div>`;
	}).replaceAll(/\*\*(([^*]|([^*].)|([^*].))+?)\*\*/g, (match, capture1)=>{ //bold
		return `<b>${capture1}</b>`;
	}).replaceAll(/\*(([^*]|([^*].)|(.[^*]))+?)\*/g, (match, capture1)=>{ //italic
		return `<em>${capture1}</em>`;
	}).replaceAll(/~~(([^~]|([^~].)|(.[^~].)|(..[^~]))+?)~~/g, (match, capture1)=>{ //strikethrough
		return `<s>${capture1}</s>`;
	}).replaceAll(/<#(\d+?)>/g, (match, capture1) => { //channels
		return `<a class="channel-link" onclick="document.querySelector('[data-discordId=\\'${capture1}\\']').click()">${localChannelCache[capture1]}</a>`;
	}).replaceAll(/<@(\d+?)>/g, (match, capture1) => { //mention
		(async function(){
			sendAndWait("askForUser",capture1)
				.then((user)=>{
					let toFix = document.querySelector(`[data-mention-waiter="${capture1}"]`);
					toFix.removeAttribute("data-mention-waiter");
					toFix.innerText=user.name;
				});
		})();
		return `<span class="mention" data-mention-waiter="${capture1}">${capture1}</span>`;
	}).replaceAll(/<:.+?:(\d+?)>/g, (match, capture1) => { //emojis
	    return `<span class="emoji"><img src="https://cdn.discordapp.com/emojis/${capture1}"></span>`;
	});
}