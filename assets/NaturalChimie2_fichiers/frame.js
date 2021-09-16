cashFrame = function() { }

cashFrame.vpos = "middle";
cashFrame.maskColor = "#555555";
cashFrame.borderColor = "#FFFFFF";
cashFrame.embedHTML = false;

cashFrame.launch = function( params, host ) {
	if( window.mt && window.mt.js && window.mt.js.Twinoid ){
		mt.js.Twinoid.call('askCashFrame',[params,(function(){ if( window.cashFrame.onClose!=null ) window.cashFrame.onClose(); })]);
		return;
	}

	if( host == null )
		host = "cash.motion-twin.com";
	window.scrollTo(0,0);

	this.hideFlash();

	if( this.embedHTML ){
		var cid = "cashFrameUniqDiv_"+Math.random();
		document.write("<div id=\""+cid+"\"></div>");
		this.container = document.getElementById(cid);


		var html = "";
		html += '<div id="mtcashframed" style="width: 100%; text-align: center;">';
			html += '<div style="padding: 5px; margin: auto; height: 520px; width: 820px; background-color: '+cashFrame.borderColor+'; border-radius: 6px;">';
				html += '<iframe name="mtcashframef" id="mtcashframef" style="position: static; margin: 0px; padding: 0px; width: 820px; height: 520px; border: 0px;" frameBorder="0" src="http://'+host+'/frame/init?'+params+'"></iframe>';
			html += '</div>';
		html += '</div>';

	}else{
		this.container = document.createElement("div");
		this.container.id = "mtcashframeContainer";
		document.body.insertBefore(this.container,document.body.firstChild);

		var vcss = "top: 50%; margin-top: -255px;";
		if( cashFrame.vpos != "middle" ){
			vcss = "top: "+cashFrame.vpos+"px;";
		}

		var html = "";
		html += '<div id="mtcashframed" style="position: fixed; width: 100%; top: 30px; z-index: 1008; ">';
			html += '<div style="position: fixed; width: 100%; height: 100%; z-index: 1007; top: 0px; bottom: 0px; left: 0px; background-color: #4E5162; opacity: 0.7; filter: alpha(opacity=70); zoom: 1;"></div>';
			html += '<div style="position: absolute; z-index: 1009; width: 100%; ">';
			html += '<div style="padding:0px; margin: auto; width: 820px;">';
				html += '<a href="#" class="mtcashframeclosebtn" onclick="cashFrame.close(); return false;" style="margin-left: 773px; position: absolute; margin-top: 9px; width: 34px; height: 34px; border-radius: 2px; -moz-border-radius: 2px; -webkit-border-radius: 2px;"></a>'
				html += '<iframe name="mtcashframef" id="mtcashframef" style="display: block; width: 100%; height: 740px; border: 0px; margin: 0px; position: static;" frameBorder="0" allowtransparency="true" scrolling="no" src="http://'+host+'/frame/init?'+params+'"></iframe>';
			html += '</div>';
			html += '</div>';
		html += '</div>';
		html += '<style type="text/css">';
		html += '#mtcashframeContainer {';
		html += 'position: static;';
		html += '}';
		html += '.mtcashframeclosebtn {';
		html += 'background: #bd3d00 url(\'http://'+host+'/img/design/cross.png\') no-repeat center center;';
		html += '-moz-box-shadow: inset 0px -2px 0px #5B1E00, inset 0px 0px 2px #5B1E00, 0px 0px 4px black;';
		html += '-webkit-box-shadow: inset 0px -2px 0px #5B1E00, inset 0px 0px 2px #5B1E00, 0px 0px 4px black;';
		html += 'box-shadow: inset 0px -2px 0px #5B1E00, inset 0px 0px 2px #5B1E00, 0px 0px 4px black;';
		html += '}';
		html += '.mtcashframeclosebtn:hover {';
		html += 'background: #fe7d00 url(\'http://'+host+'/img/design/cross.png\') no-repeat center center;';
		html += 'border-color: white;';
		html += '}';
		html += '</style>';
	}

	this.container.innerHTML = html;
}

cashFrame.hideFlash = function(){
	var l = document.getElementsByTagName("embed");
	for( var i=0; i<l.length; i++ ){
		var e = l[i];
		if( e.style.visibility != null )
			e.setAttribute("mtcashframe_oldVis",e.style.visibility);
		e.style.visibility = 'hidden';
	}
	l = document.getElementsByTagName("object");
	for( var i=0; i<l.length; i++ ){
		var e = l[i];
		if( e.style.visibility != null )
			e.setAttribute("mtcashframe_oldVis",e.style.visibility);
		e.style.visibility = 'hidden';
	}
}

cashFrame.showFlash = function(){
	var l = document.getElementsByTagName("embed");
	for( var i=0; i<l.length; i++ ){
		var e = l[i];
		e.style.visibility = e.getAttribute("mtcashframe_oldVis");
	}
	l = document.getElementsByTagName("object");
	for( var i=0; i<l.length; i++ ){
		var e = l[i];
		e.style.visibility = e.getAttribute("mtcashframe_oldVis");
	}
}

cashFrame.close = function (){
	if( this.container == null )
		return;
	document.body.removeChild( this.container );
	if( this.onClose != null )
		this.onClose();
	this.showFlash();
}

