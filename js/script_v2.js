/*This JS file contains
** delete function have bug.. same ID after delete

*/


window.onload = function(){
	sync();
	tickFuel();
	show();
}

//VARIABLES
var USER=[];
var SKY=[];
var BUZZ=[];

var CUI=-1;
var FUEL_RATE = 1;
var FUEL_MS = 5000;

var FUEL_VOL=0;
//FUEL COSTS

var INITIAL_FUEL = 30;
var PAPER_BUY_PRICE = 10;
var PAPER_SELL_PRICE = 8;
var newPlaneCost = 5;
var fuelPlaneCost = 5;
var flyPlaneCost = 5;
var newPlaneCost = 5;
var newMessageCost = 5;
var buzzCost = 5;

//CONSTRUCTOR
function User (name,pass,gender,horoscope){
	//instance variables
	this.uid = (USER.length==0)?(1000):(USER[USER.length-1].uid+1);
	this.name = name;
	this.pass = pass;
	this.gender = gender;
	this.horoscope = horoscope;
	this.answer = [];
	
	this.paper = 1;
	this.plane = [];
	this.plane2 = [];
	
	this.inbox = [];
	this.outbox = [];
	
	this.quiz = [];
	this.fuel = INITIAL_FUEL;
}
function Plane(decoration,answer){
	//instance variables
	this.pid = (USER[CUI].plane.length==0)?(USER[CUI].uid*10000+9000):(USER[CUI].plane[(USER[CUI].plane.length-1)].pid+1);
	
	this.uid = USER[CUI].uid;
	this.name = USER[CUI].name;
	this.fueled = false;
	this.status = 0;
	this.shotAcknowledge = false;
	this.decoration = decoration;
	this.answer = answer;
}
function Message(name2,title,content){
	this.mid = (USER[CUI].outbox.length==0)?(USER[CUI].uid*10000+8000):(USER[CUI].outbox[USER[CUI].outbox.length-1].mid+1);
	this.name1 = USER[CUI].name;
	this.name2 = name2;
	this.title = title;
	this.content = content;
	this.status = 0;
}
function Buzz(content){
	this.bid = BUZZ.length + 5000;
	this.uid = USER[CUI].uid;
	this.name = USER[CUI].name;
	this.content = content;
}

/**Functions*******/

//storage
function sync(){
	USER  = $.jStorage.get("USER",[]);
	SKY   = $.jStorage.get("SKY",[]);
	BUZZ = $.jStorage.get("BUZZ",[]);
	CUI = $.jStorage.get("CUI",-1);
	show();
}
function save(){
	$.jStorage.set("USER",USER);
	$.jStorage.set("SKY",SKY);
	$.jStorage.set("BUZZ",BUZZ);
	$.jStorage.set("CUI",CUI);
	show();
}
function flush(){
	$.jStorage.flush();
	sync();
}
function createDefault(){
	newUser("Desmond",123,"male","cancer");
	newUser("Sesmond",123,"male","aries");
	newUser("Aesmond",123,"female","taurus");
	logIn("Desmond");
	newMessage('Desmond',"title","ccc");
	
	sendMessage(10008000);
	buzz("asdads");
	
	buyPaper(2);
	
	newPlane("deco","none");
	newPlane("deco2","none");
	USER[CUI].plane[0].fueled=true;
	USER[CUI].plane[1].fueled=true;
	flyPlane(10009000);
	flyPlane(10009001);
}

//FUNCTIONS OF USER

function newUser(name,pass,gender,horoscope){
	USER.push(new User(name,pass,gender,horoscope));
	save();
}
function logIn(name){
	for (var i in USER){
		if (name==USER[i].name){
			CUI = i;
			save();
			return;
		}
	}
	alert("Username \""+name+"\""+", dont exist.. or password failure");
}
function logOut(){
	CUI = -1;
	window.location="index.html";
	save();
}
function updatePrivacy(name,pass){
	USER[CUI].name = name;
	USER[CUI].pass = pass;
	save();
}
function updateAnswer(answer){
	USER[CUI].answer = answer;
	save();
}
function buyPaper(qty){
	USER[CUI].fuel -= PAPER_BUY_PRICE * qty;
	USER[CUI].paper += parseInt(qty);
	save();
}
function sellPaper(qty){
	USER[CUI].fuel +=PAPER_SELL_PRICE * qty;
	USER[CUI].paper -= parseInt(qty);
	save();
}
function newPlane(decoration,answer){
	if (USER[CUI].fuel<newPlaneCost){alert("Not enough fuel...");return;}
	USER[CUI].paper -=1; //uses 1 paper
	USER[CUI].plane[USER[CUI].plane.length]= new Plane(decoration,answer);
	USER[CUI].fuel -=newPlaneCost;
	save();
}
function fuelPlaneP(pid){
	if (USER[CUI].fuel<fuelPlaneCost){alert("Not enough fuel...");return;}
	for (var i in USER){
		for (var j in USER[i].plane){
			if (pid == USER[i].plane[j].pid){
				USER[i].plane[j].fueled = true;
				USER[CUI].fuel -=fuelPlaneCost;
				save();
				return;
			}
		}
	}
	alert("error fuel plane");
}
function fuelPlane(pid){
	if (USER[CUI].fuel<fuelPlaneCost){alert("Not enough fuel...");return;}
	var plane = null;
	var previousKey = null;
	FUEL_VOL = 0;
	//find plane in CUSER
	for (var i in USER[CUI].plane){
		if (pid == USER[CUI].plane[i].pid && USER[CUI].plane[i].status == 0){
			plane = USER[CUI].plane[i];
			break;
		}
	}
	//if not found
	if (plane == null) {
		alert("plane not found! or not in hangar"); 
		return;
	}
	//if (fueled)
	if (plane.fueled){
		alert("this plane is fueled");
		return;
	}
	
	document.getElementById("fuel_plane_box").style.display = "block";
	document.getElementById("show_fuel_process").innerHTML="0%";
	//add event listener
	document.addEventListener("keydown",keyDown);
	function keyDown(event){
		var key = event.keyCode;
		if ((key == 90 ||key == 88)&& key !=previousKey){// if z or x and !=previous
			document.getElementById("show_fuel_process").innerHTML=FUEL_VOL+"%";
			FUEL_VOL +=2;
			if (FUEL_VOL >100) {
				
				document.removeEventListener("keydown",keyDown);
				plane.fueled = true;
				alert("Plane is Fueled!");
				document.getElementById("fuel_plane_box").style.display = "none";
				USER[CUI].fuel -=fuelPlaneCost;
				save();
			}
			previousKey = key;
		}
	}
}
function flyPlane(pid){ //find plane, push PID, set status
	if (USER[CUI].fuel<flyPlaneCost){alert("Not enough fuel...");return;}
	var plane = null;
	//find plane in CUSER plane
	for (var i in USER[CUI].plane){
		if (pid == USER[CUI].plane[i].pid){
			plane = USER[CUI].plane[i];
		}
	}
	
	if (plane.status !=0 || !plane.fueled){
		alert("this plane cannot fly. no fuel or in sky or crashed");
		return;
	}
	
	SKY.push(pid); //push PID
	USER[CUI].fuel -=flyPlaneCost;
	plane.status = 1;
	save();
}
function landPlane(pid){
	for (var i in USER[CUI].plane){
		if (pid == USER[CUI].plane[i].pid && USER[CUI].plane[i].status == 1){ //plane exist in user, status =1
			USER[CUI].plane[i].status=0;
			USER[CUI].plane[i].fueled=false;
			SKY.splice(SKY.indexOf(pid),1);
			save();
			return;
		}
	}
	alert("this plane not in sky!");
}
function shootPlane(pid){
	for (var i in USER){//find plane in all planes of all users
		for (var j in USER[i].plane){
			if (pid == USER[i].plane[j].pid && USER[CUI].plane[j].status ==1){
				SKY.splice(SKY.indexOf(pid),1); // splice PID in SKY
				USER[i].plane[j].fueled = false; // set fueled = false
				USER[i].plane[j].status = 3; //set status = 3
				USER[CUI].plane2.push(pid); //push to CUSER plane2
				alert("Plane DOWN! "+pid);
				USER[CUI].fuel -=10;
				save();
				return;
			}
		}
	}
	alert("fail to shoot");
}
function deletePlane(pid){
	if(!confirm("sure to delete?!")) return;
	for (var i in USER[CUI].plane){ //find plane in CUSER with PID, splice
		if (pid == USER[CUI].plane[i].pid){
			USER[CUI].plane.splice(USER[CUI].plane.indexOf(USER[CUI].plane[i]),1);// splice in Cuser
			SKY.splice(SKY.indexOf(pid),1); //splice in SKY
			save();
			return;
		}
	}
	alert("fail to delete");
}
function playQuiz(){}
function newMessage(name2,title,content){
	if (USER[CUI].fuel<newMessageCost){alert("Not enough fuel...");return;}
	USER[CUI].outbox.push(new Message(name2,title,content));
	USER[CUI].fuel -=newMessageCost;
	try{
		showInbox();
		showOutbox();}
	catch(err){}
	save();
}
function sendMessage(mid){
	var message;
	for (var i in USER[CUI].outbox){ // find msg in CUSER outbox with MID
		if (mid == USER[CUI].outbox[i].mid){
			message = USER[CUI].outbox[i] //declare message
		}
	}
	//if message status is not 0
	if (message.status !=0) {
		alert("message cannot be sent [status !=0]");
		return;
	}
	
	message.status =1;
	
	for (var i in USER){ //find receiver in USER with name2
		if (message.name2 == USER[i].name){
			USER[i].inbox.push(mid); //push MID
			try{
					showInbox();
					showOutbox();}
				catch(err){}
			save();
			return;
		}
	}
	alert("fail to send");
}
function readMessage(mid){
	for (var i in USER){ //find msg in all outbox of all user with mid
		for (var j in USER[i].outbox){
			if (mid == USER[i].outbox[j].mid){
				USER[i].outbox[j].status = 2; //set status =2;
				try{
					showInbox();
					showOutbox();}
				catch(err){}
				save();
				return;
			}
		}
	}
	alert("fail to read msg");
}
function deleteMessage(mid){
	if(!confirm("Are you sure to delete?"))return;
	for (var i in USER[CUI].outbox){//find msg in CUSER outbox
		if (mid == USER[CUI].outbox[i].mid){
			USER[CUI].outbox.splice(USER[CUI].outbox.indexOf(USER[CUI].outbox[i]),1);//splice CUSER outbox
		}
	}
	for (var i in USER){//find msg in receiver inbox
		for (var j in USER[i].inbox){
			if (mid == USER[i].inbox[j]){
				USER[i].inbox.splice(USER[i].inbox.indexOf(USER[i].inbox[j]),1);
				try{
					showInbox();
					showOutbox();}
				catch(err){}
				save();
				return;
			}
		}
	}
	alert("error delete msg");
}
function buzz(content){
	if (USER[CUI].fuel<buzzCost){alert("Not enough fuel...");return;}
	BUZZ.push(new Buzz(content));
	USER[CUI].fuel -=buzzCost;
	save();
}
function tickFuel(){
	setInterval(function(){
		USER[CUI].fuel +=FUEL_RATE;
		save();
		show();
	},FUEL_MS);
}



//FUNCTIONS OF FORMS AND VALIDATIONS

function submitSignUp(){
	var name = document.forms["sign_up"]["name"].value;
	var pass1 = document.forms["sign_up"]["pass1"].value;
	var pass2 = document.forms["sign_up"]["pass2"].value;
	var gender = document.forms["sign_up"]["gender"];
	var horoscope = document.forms["sign_up"]["horoscope"];
	for (var i in gender){
		if (gender[i].checked){
			gender = gender[i].value;
			break;
		}
	}
	horoscope = horoscope.options[horoscope.selectedIndex].value;
	//v here
	if (name.length<3 || name.length>30 || pass1.length<3 || pass1.length>30 || pass2.length<3 || pass2.length>30){
		alert("name (3~30 char), pass (3~30 char)");
		return;
	}
	if (USER.length>0){
		for (var i in USER){
			if (name == USER[i].name){
				alert("USERNAME exists, choose another username");
				return;
			}
		}
	}
	if (pass1!=pass2){
		alert("pasword x match");
		return;
	}
	if (gender!="male"&& gender!="female"){
		alert("gender unknown!");
		alert(gender);
		return;
	}
	//v ends
	newUser(name,pass1,gender,horoscope);
	logIn(name);
	alert("Welcome to FLY UP, "+name+"!");
	window.location = "hangar.html";
}
function submitLogIn(){
	var name = document.forms["log_in"]["name"].value;
	var pass = document.forms["log_in"]["pass"].value;
	var match = false;
	//v start
	for (var i in USER){
		if (name==USER[i].name && pass==USER[i].pass){
			match = true;
			break;
		}
	}
	if (!match){
		alert("no user or pass");
		return;
	}
	//v end
	logIn(name);
	window.location = "user_home.html";
}
function submitUpdatePrivacy(){
	var name = document.forms["update_privacy"]["name"].value;
	var oldpass = document.forms["update_privacy"]["old_pass"].value;
	var newpass = document.forms["update_privacy"]["new_pass"].value;
	var newpass2 = document.forms["update_privacy"]["new_pass2"].value;
	
	//v start
	if (CUI == -1){
		alert("You must log in first to change privacy");
		return;
	}
	if (name == "" && newpass == ""){
		alert("u are not changing anything");
		return;
	}
	if (oldpass != USER[CUI].pass){
		alert("Please enter the correct old pass!");
		return;
	}
	if (name != null && name != "" && (name.length<3 || name.length>30)){
		alert("new name must between 3~30 char!");
		return;
	}
	if (newpass != "" && newpass != null && (newpass.length<8 || newpass.length>30)){
		alert("new password must between 8~30 char!");
		return;
	}
	if (newpass != newpass2 ){
		alert("newpass does not match");
		return;
	}
	if (newpass == null || newpass ==""){
		newpass = oldpass;
	}
	
	//v end
	
	updatePrivacy(name,newpass);
}
function submitUpdateAnswer(){
	var pass = document.forms["update_answer"]["pass"].value;
	var c1 = document.forms["update_answer"]["c1"].value;
	var c2 = document.forms["update_answer"]["c2"].value;
	var c3 = document.forms["update_answer"]["c3"].value;
	var c4 = document.forms["update_answer"]["c4"].value;
	var answer = [];
	var max = 30;
	var min = 4;
	//v start
	if (pass != USER[CUI].pass){
		alert("pass word salah");
		return;
	}
	if (c1.length>max ||c1.length<min||
	c2.length>max ||c2.length<min||
	c3.length>max ||c3.length<min||
	c4.length>max ||c4.length<min){
		alert("answeristic must between "+min+"~"+max+" chars.");
		return;
	}
	//v end
	
	answer = [c1,c2,c3,c4];
	updateAnswer(answer);
}
function submitNewPlane(){
	var d1 = USER[CUI].gender;
	var d2 = USER[CUI].horoscope;
	var d3 = document.forms["new_plane"]["d3"];
	var d3Checked = false;
	for (var i in d3){
		if (d3[i].checked){
			d3 = d3[i].value;
			d3Checked = true;
			break;
		}
	}
	var c1 = document.forms["new_plane"]["c1"].value;
	var c2 = document.forms["new_plane"]["c2"].value;
	var c3 = document.forms["new_plane"]["c3"].value;
	var c4 = document.forms["new_plane"]["c4"].value;
	var decoration = [];
	var answer = [];
	var max = 30;
	var min = 4;
	//v start
	if (d1 == null || d2 == null || d3 == null || !d3Checked){
		alert("Select deco please!");
		return;
	}
	if (USER[CUI].paper<=0){
		alert("No more paper!");
		return;
	}
	if (c1.length>max ||c1.length<min||
	c2.length>max ||c2.length<min||
	c3.length>max ||c3.length<min||
	c4.length>max ||c4.length<min){
		alert("answeristic must between "+min+"~"+max+" chars.");
		return;
	}
	//v end
	decoration = [d1,d2,d3];
	answer = [c1,c2,c3,c4];
	USER[CUI].answer = answer;
	if (USER[CUI].fuel<newPlaneCost) enoughFuel = false;
	newPlane(decoration,answer);
	if (!enoughFuel) return;
	document.getElementById("new_plane_box").style.display = "none";
	document.getElementById("show_plane_box").style.display = "inline";
}
function submitNewMessage(){
	var name2 = document.forms["new_message"]["name2"].value;
	var title = document.forms["new_message"]["title"].value;
	var content = document.forms["new_message"]["content"].value;
	var found = false;
	
	//v start
	for (var i in USER){//find uid2 in USER with name2
		if (name2 == USER[i].name){
			found = true;
			break;
		}
	}
	if (!found){
		alert("the user u want to send is not found!");
		return;
	}
	if (title.length==0 || title.length>80||content.length ==0||content.length>500){
		alert("the title/content is empty");
		return;
	}
	//v end
	
	newMessage(name2,title,content);
}
function submitBuzz(){
	var content = document.forms["buzz"]["content"].value;
	
	//v start
	if (content.length<3||content.length>250){
		alert("buzz is limited to 3~250 chars");
		return;
	}
	//v end
	
	buzz(content);
}
function submitPaper(){
	var qtyBuy = document.forms["paper"]["buy"].value;
	var qtySell = document.forms["paper"]["sell"].value;
	
	//v start
	if (qtyBuy<0 || qtySell<0 ||(qtyBuy==0&&qtySell==0)||(qtyBuy ==""&&qtySell == "")){
		alert("You are not doing the business the right way!");
		return;
	}
	if (isNaN(qtyBuy)||isNaN(qtySell)){
		alert("That's not a number!");
		return;
	}
	if ((qtyBuy!="") &&(qtyBuy*PAPER_BUY_PRICE > USER[CUI].fuel)){
		alert("Not enough fuel to buy "+qtyBuy+" papers!");
		return;
	}
	if (qtySell > USER[CUI].paper){
		alert("You dont have so many papers to be sold!");
		return;
	}
	//v end
	if ((qtyBuy>0) && (!isNaN(qtyBuy))) buyPaper(qtyBuy);
	if ((qtySell>0) && (!isNaN(qtySell)))sellPaper(qtySell);
	}


//SHOW
function show(){
	
	showHangarPlane();
	showPlane2P();
	showSkyPlaneP();
	showMessage();
	showFuelbarNum();
	text="___ALL USER___<br/><br/>";
	for (var i in USER){
		text += JSON.stringify(USER[i]) +"<br/><br/>";
	}
	text +="___CUSER___<br/><br/>";
	text += JSON.stringify(USER[CUI])+"<br/><br/>";
	text +="___SKY___<br/><br/>";
	text += JSON.stringify(SKY)+"<br/><br/>";
	text +="___BUZZ___<br/><br/>";
	for (var i in BUZZ){
		text += JSON.stringify(BUZZ[i])+"<br/>";
	}
	try{
		document.getElementById("show_all").innerHTML = text;
	}catch(err){};
}
//OTHER SHOW

function showHangarPlane(){
	text ="";
	text2="";
	if (CUI==-1){
		return;
	}
	for (var i in USER[CUI].plane){
		text+= USER[CUI].plane[i].pid;
		text+= "<div onClick='fuelPlaneP("+USER[CUI].plane[i].pid+")'>>>Fuel plane ["+USER[CUI].plane[i].fueled+"]</div>";
		text+= "<div onClick='flyPlane("+USER[CUI].plane[i].pid+")'>>>Fly plane ["+((USER[CUI].plane[i].status==0)?"in hangar":"not in hangar")+"]</div>";
		text+= "<div onClick='landPlane("+USER[CUI].plane[i].pid+")'>>>Land plane ["+((USER[CUI].plane[i].status==1)?"in Sky":"not in sky")+"]</div>";
		text+= "<div onClick='deletePlane("+USER[CUI].plane[i].pid+")'>>>Delete plane</div>";
	}
	
	for (var i in USER[CUI].plane){
		text2+="<div class='hangar_plane_obj'>\
		"+USER[CUI].plane[i].pid+"<br\>\
		\
		<img src='img//plane3.gif'/>\
		<div id='fuelHP' onClick ='fuelPlane("+USER[CUI].plane[i].pid+")'>Fuel</div>\
		<div id='flyHP' onClick ='flyPlane("+USER[CUI].plane[i].pid+")'>Fly</div>\
		<div id='landHP' onClick ='landPlane("+USER[CUI].plane[i].pid+")'>Land</div>\
		<div id='delHP' onClick ='deletePlane("+USER[CUI].plane[i].pid+")'>Del</div>\
		</div>\
		<div class='details_box'>\
			<img src='img//plane3.gif'/>\
			<strong>PID:</strong>"+USER[CUI].plane[i].pid+"<br\>\
			<strong>Fuel:</strong>"+((USER[CUI].plane[i].fueled)?('Fueled!'):('Not fueled'))+"<br\>\
			<strong>Location:</strong>"+((USER[CUI].plane[i].status==0)?('Hangar'):((USER[CUI].plane[i].status==1)?('Sky'):('Shot down')))+"<br\>\
			<strong>Interest:</strong>"+USER[CUI].plane[i].decoration[2]+"<br\>\
			<strong>Answer:</strong><br\>\
			1."+USER[CUI].plane[i].answer[0]+"<br\>\
			2."+USER[CUI].plane[i].answer[1]+"<br\>\
			3."+USER[CUI].plane[i].answer[2]+"<br\>\
			4."+USER[CUI].plane[i].answer[3]+"<br\>\
		</div>";
	}
	try{
		document.getElementById("show_hangar_plane").innerHTML = text;
	}catch(err){}
	try{
		document.getElementById("hangar_plane_box").innerHTML = text2;
	}catch(err){}
	try{
		document.getElementById("show_paper_num2").innerHTML = USER[CUI].paper;
		document.getElementById("show_fuel_num").innerHTML = USER[CUI].fuel;
	}catch(err){}
}
function showPlane2P(){
	if (CUI==-1) return;
	text="";
	var plane;
	for (var i in USER[CUI].plane2){// find plane2 obj in all plane of all USER
		for (var j in USER){
			for (var k in USER[j].plane){
				if (USER[CUI].plane2[i] == USER[j].plane[k].pid){
					plane = USER[j].plane[k];
					text+=plane.pid+"<br/>";
					text+=">>Owner: "+plane.name+"<br/>";
					var name = plane.name;
					text+=">>Decor: "+plane.decoration+"<br/>";
					text+=">>Char: "+plane.answer+"<br/>";
					text+="<div onClick='showNewMessage("+plane.uid+")'>>>send msg</div>";
				}
			}
		}
	}
	try{
		document.getElementById("show_plane2").innerHTML= text;	
	}catch(err){}
}
function showSkyPlaneP(){
	var text="";
	for (var i =0 ;i<SKY.length;i++){
		text+=SKY[i];
		text+="<div onClick='shootPlane("+SKY[i]+")'>>>shoot</div>";
		try{
			document.getElementById("show_sky_planeP").innerHTML = text;
		}catch(err){}
	}
}
function showMessage(){
	text="";
	//
	if (CUI==-1) return;
	//get outbox msg
	text+="###Outbox<br/>";
	for (var i in USER[CUI].outbox){
		text+="To: "+USER[CUI].outbox[i].name2+"<br/>";
		text+=USER[CUI].outbox[i].title+"<br/>";
		text+=USER[CUI].outbox[i].content;
		text+="<div onClick='sendMessage("+USER[CUI].outbox[i].mid+")'>>>Send["+USER[CUI].outbox[i].status+"]</div>";
		text+="<div onClick='deleteMessage("+USER[CUI].outbox[i].mid+")'>>>Delete</div>";
	}
	//get inbox msg
	text+="<br/>###Inbox<br/>";
	for (var i in USER[CUI].inbox){//loop each CUSER inbox, match with all outbox of all USER
		for (var j in USER){
			for (var k in USER[j].outbox){
				if (USER[CUI].inbox[i] == USER[j].outbox[k].mid){
					var message = USER[j].outbox[k];
					text+="From: "+ message.name1+"<br/>";
					text+=message.title+"<br/>";
					text+=message.content+"<br/>";
				}
			}
		}
	}
	try{
		document.getElementById("show_message").innerHTML= text;
	}catch(err){}
}
function showNewMessage(uid){
	var name2;
	for (var i in USER){
		if (uid == USER[i].uid){
			name2 = USER[i].name;
		}
	}
	try{
		document.forms["new_message"]["name2"].value = name2;
	}catch(err){}
}
function showNewPlaneBox(){
	document.getElementById("show_plane_box").style.display = "none";
	document.getElementById("new_plane_box").style.display = "block";
}
function showShowPlaneBox(){
	document.getElementById("show_plane_box").style.display = "block";
	document.getElementById("new_plane_box").style.display = "none";
}
function showPaperBox(){
	document.getElementById("buy_paper_box").style.display = "block";
	document.addEventListener("keydown",hideBuyPaper);
	function hideBuyPaper(e){
		if (e.keyCode == 27){
			document.getElementById("buy_paper_box").style.display = "none";
			document.removeEventListener(hideBuyPaper);
		}
	}
}
function showInbox(){
	var text3="<table width=100%>\
		<tr>\
		<th width=30%>Sender</th>\
		<th width=30%>Title</th>\
		<th width=20%>Status</th>\
		<th width=20%>Action</th>\
		</tr>";
	for (var i in USER[CUI].inbox){//loop each CUSER inbox, match with all outbox of all USER
		for (var j in USER){
			for (var k in USER[j].outbox){
				if (USER[CUI].inbox[i] == USER[j].outbox[k].mid){
					var message = USER[j].outbox[k];
					text3+="\
					\
					<tr>\
					<td>"+ message.name1+"</td>\
					<td>"+message.title+"</td>\
					\
					<td>"+((message.status==1)?('unread'):('read'))+"</td>\
					<td>\
					<div class='inbox_msg'><div onClick='readMessage("+message.mid+")'>READ</div></div>\
					\
					<div class='msg_details'>\
					From: "+message.name1+"<br>\
					<strong>"+message.title+"</strong><br>\
					"+message.content+"\
					</div>\
					</td>\
					</tr>\
					";
				}
			}
		}
	}
	text3 +="</table>";
	try{
		document.getElementById("show_inbox").innerHTML= text3;
	}catch(err){}
}
function showOutbox(){
	var text4="<table width=100%>\
		<tr>\
		<th width=30%>Receiver</th>\
		<th width=30%>Title</th>\
		<th width=20%>Status</th>\
		<th colspan=2 width=20%>Action</th>\
		</tr>";
	for (var i in USER[CUI].outbox){
		text4+="\
		<tr>\
		<div class='outbox_msg'>\
		<td>"+USER[CUI].outbox[i].name2+"</td>\
		<td>"+USER[CUI].outbox[i].title+"</td>\
		<td>"+((USER[CUI].outbox[i].status==1)?('sent'):((USER[CUI].outbox[i].status==2)?('read'):('outbox')))+"</td>\
		<td>\
		<div class='inbox_msg'><div onClick='sendMessage("+USER[CUI].outbox[i].mid+")'>SEND|</div></div>\
		<div class='msg_details'>\
		From: "+USER[CUI].outbox[i].name1+"<br>\
		<strong>"+USER[CUI].outbox[i].title+"</strong><br>\
		"+USER[CUI].outbox[i].content+"\
		</div>\
		</td>\
		<td><div onClick='deleteMessage("+USER[CUI].outbox[i].mid+")'\
		>DEL</div></td>\
		</div></tr>";
	}
	//<div onClick='sendMessage("+USER[CUI].outbox[i].mid+")'\
		//>Send
	text4+="</table>"
	try{
		document.getElementById("show_outbox").innerHTML= text4;
	}catch(err){}
}
function showSkyPlane(){
	var sp1;
	var sp2;
	var sp3;
	var sp4;
	
	var i = 0;
		sp1 = SKY[i++];
		if (i>=SKY.length) i=0;
		sp2 = SKY[i++];
		if (i>=SKY.length) i=0;
		sp3 = SKY[i++];
		if (i>=SKY.length) i=0;
		sp4 = SKY[i++];
		if (i>=SKY.length) i=0;
	document.getElementById('sky_plane').innerHTML = "\
	<a href='#'><div class = 'sky_plane_obj' id='sp1' onClick='shootPlane("+sp1+")'><img src='img//plane.gif'/><span>"+sp1+"</span></div></a>\
	<a href='#'><div class = 'sky_plane_obj' id='sp2' onClick='shootPlane("+sp2+")'><img src='img//plane2.gif'/><span>"+sp2+"</span></div></a>\
	<a href='#'><div class = 'sky_plane_obj' id='sp3' onClick='shootPlane("+sp3+")'><img src='img//plane3.gif'/><span>"+sp3+"</span></div></a>\
	<a href='#'><div class = 'sky_plane_obj' id='sp4' onClick='shootPlane("+sp4+")'><img src='img//plane4.gif'/><span>"+sp4+"</span></div></a>\
	";
	
	var inter = setInterval(changePlane,10000);
	
	function changePlane(){
		sp1 = SKY[i++];
		if (i>=SKY.length) i=0;
		sp2 = SKY[i++];
		if (i>=SKY.length) i=0;
		sp3 = SKY[i++];
		if (i>=SKY.length) i=0;
		sp4 = SKY[i++];
		if (i>=SKY.length) i=0;
		
		document.getElementById('sky_plane').innerHTML = "\
		<a href='#'><div class = 'sky_plane_obj' id='sp1' onClick='shootPlane("+sp1+")'><img src='img//plane.gif'/><span>"+sp1+"</span></div></a>\
		<a href='#'><div class = 'sky_plane_obj' id='sp2' onClick='shootPlane("+sp2+")'><img src='img//plane2.gif'/><span>"+sp2+"</span></div></a>\
		<a href='#'><div class = 'sky_plane_obj' id='sp3' onClick='shootPlane("+sp3+")'><img src='img//plane3.gif'/><span>"+sp3+"</span></div></a>\
		<a href='#'><div class = 'sky_plane_obj' id='sp4' onClick='shootPlane("+sp4+")'><img src='img//plane4.gif'/><span>"+sp4+"</span></div></a>\
		";
	}
}
function showPlane2(){
	var text6="";
	for (var i in USER[CUI].plane2){
		for (var j in USER){
			for (var k in USER[j].plane){
				if (USER[CUI].plane2[i] == USER[j].plane[k].pid){
					var plane = USER[j].plane[k];
					text6+="\
					<div class='p2_obj'>\
					<img src='img//plane.gif'/>\
					\
					"+plane.pid+"<br\>\
					</div>\
					<div class='details_box'>\
						<img src='img//plane.gif'/>\
						<strong>PID:</strong>"+plane.pid+"<br\>\
						<strong>Location:</strong>"+((plane.status==0)?('Hangar'):((plane.status==1)?('Sky'):('Shot down')))+"<br\>\
						<strong>Interest:</strong>"+plane.decoration[2]+"<br\>\
						<strong>Answer:</strong><br\>\
						1."+plane.answer[0]+"<br\>\
						2."+plane.answer[1]+"<br\>\
						3."+plane.answer[2]+"<br\>\
						4."+plane.answer[3]+"<br\>\
					</div>";
				}
			}
		}
	}
	document.getElementById("p2").innerHTML = text6;
	
}
function showBuzzBox(){
	var text7 = "";
	for (var i = BUZZ.length-1; i>=0; i--){
		text7+="\
		<div id = 'buzz_obj'>\
		<strong>"+BUZZ[i].name+":</strong>\
		"+BUZZ[i].content+"\
		</div>\
		";
	}
	document.getElementById("show_buzz_box").innerHTML = text7;
}
function showFuelbarNum(){
	var fuelnum;
	if (CUI==-1) return;
	document.getElementById("fuelbar").style.display="block";
	fuelnum = USER[CUI].fuel;
	try{
		document.getElementById("show_fuelbar_num").innerHTML = fuelnum;
	}catch(err){}
}



