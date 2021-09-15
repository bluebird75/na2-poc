(function (console, $hx_exports, $global) { "use strict";
$hx_exports.mt = $hx_exports.mt || {};
$hx_exports.mt.js = $hx_exports.mt.js || {};
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var DateTools = function() { };
$hxClasses["DateTools"] = DateTools;
DateTools.__name__ = ["DateTools"];
DateTools.delta = function(d,t) {
	var t1 = d.getTime() + t;
	var d1 = new Date();
	d1.setTime(t1);
	return d1;
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,matchedPos: function() {
		if(this.r.m == null) throw new js__$Boot_HaxeError("No string matched");
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) this.r.s = s;
			return b;
		} else {
			var b1 = this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf = new StringBuf();
		do {
			if(offset >= s.length) break; else if(!this.matchSub(s,offset)) {
				buf.add(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf.add(HxOverrides.substr(s,offset,p.pos - offset));
			buf.add(f(this));
			if(p.len == 0) {
				buf.add(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else offset = p.pos + p.len;
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) buf.add(HxOverrides.substr(s,offset,null));
		return buf.b;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = [];
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
};
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
};
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,last: function() {
		if(this.q == null) return null; else return this.q[0];
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,iterator: function() {
		return new _$List_ListIterator(this.h);
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else if(sep == null) s.b += "null"; else s.b += "" + sep;
			s.add(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,__class__: List
};
var _$List_ListIterator = function(head) {
	this.head = head;
	this.val = null;
};
$hxClasses["_List.ListIterator"] = _$List_ListIterator;
_$List_ListIterator.__name__ = ["_List","ListIterator"];
_$List_ListIterator.prototype = {
	hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		this.val = this.head[0];
		this.head = this.head[1];
		return this.val;
	}
	,__class__: _$List_ListIterator
};
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0;
	var _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		Reflect.setField(o2,f,Reflect.field(o,f));
	}
	return o2;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
};
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
};
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&quot;").join("\"").split("&#039;").join("'").split("&amp;").join("&");
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw new js__$Boot_HaxeError("No such constructor " + constr);
	if(Reflect.isFunction(f)) {
		if(params == null) throw new js__$Boot_HaxeError("Constructor " + constr + " need parameters");
		return Reflect.callMethod(e,f,params);
	}
	if(params != null && params.length != 0) throw new js__$Boot_HaxeError("Constructor " + constr + " does not need parameters");
	return f;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js_Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e1 ) {
		if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
		return false;
	}
	return true;
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	__class__: haxe_IMap
};
var haxe_Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
	this.withCredentials = false;
};
$hxClasses["haxe.Http"] = haxe_Http;
haxe_Http.__name__ = ["haxe","Http"];
haxe_Http.prototype = {
	request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js_Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				if (e instanceof js__$Boot_HaxeError) e = e.val;
				s = null;
			}
			if(s != null) {
				var protocol = window.location.protocol.toLowerCase();
				var rlocalProtocol = new EReg("^(?:about|app|app-storage|.+-extension|file|res|widget):$","");
				var isLocal = rlocalProtocol.match(protocol);
				if(isLocal) if(r.responseText != null) s = 200; else s = 404;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var _g_head = this.params.h;
			var _g_val = null;
			while(_g_head != null) {
				var p;
				p = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		r.withCredentials = this.withCredentials;
		var _g_head1 = this.headers.h;
		var _g_val1 = null;
		while(_g_head1 != null) {
			var h1;
			h1 = (function($this) {
				var $r;
				_g_val1 = _g_head1[0];
				_g_head1 = _g_head1[1];
				$r = _g_val1;
				return $r;
			}(this));
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe_Http
};
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
$hxClasses["haxe._Int64.___Int64"] = haxe__$Int64__$_$_$Int64;
haxe__$Int64__$_$_$Int64.__name__ = ["haxe","_Int64","___Int64"];
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_Serializer = function() {
	this.buf = new StringBuf();
	this.cache = [];
	this.useCache = haxe_Serializer.USE_CACHE;
	this.useEnumIndex = haxe_Serializer.USE_ENUM_INDEX;
	this.shash = new haxe_ds_StringMap();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe_Serializer;
haxe_Serializer.__name__ = ["haxe","Serializer"];
haxe_Serializer.run = function(v) {
	var s = new haxe_Serializer();
	s.serialize(v);
	return s.toString();
};
haxe_Serializer.prototype = {
	toString: function() {
		return this.buf.b;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += "R";
			if(x == null) this.buf.b += "null"; else this.buf.b += "" + x;
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += "y";
		s = encodeURIComponent(s);
		if(s.length == null) this.buf.b += "null"; else this.buf.b += "" + s.length;
		this.buf.b += ":";
		if(s == null) this.buf.b += "null"; else this.buf.b += "" + s;
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0;
		var _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
				if(i == null) this.buf.b += "null"; else this.buf.b += "" + i;
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeFields: function(v) {
		var _g = 0;
		var _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += "g";
	}
	,serialize: function(v) {
		{
			var _g = Type["typeof"](v);
			switch(_g[1]) {
			case 0:
				this.buf.b += "n";
				break;
			case 1:
				var v1 = v;
				if(v1 == 0) {
					this.buf.b += "z";
					return;
				}
				this.buf.b += "i";
				if(v1 == null) this.buf.b += "null"; else this.buf.b += "" + v1;
				break;
			case 2:
				var v2 = v;
				if(isNaN(v2)) this.buf.b += "k"; else if(!isFinite(v2)) if(v2 < 0) this.buf.b += "m"; else this.buf.b += "p"; else {
					this.buf.b += "d";
					if(v2 == null) this.buf.b += "null"; else this.buf.b += "" + v2;
				}
				break;
			case 3:
				if(v) this.buf.b += "t"; else this.buf.b += "f";
				break;
			case 6:
				var c = _g[2];
				if(c == String) {
					this.serializeString(v);
					return;
				}
				if(this.useCache && this.serializeRef(v)) return;
				switch(c) {
				case Array:
					var ucount = 0;
					this.buf.b += "a";
					var l = v.length;
					var _g1 = 0;
					while(_g1 < l) {
						var i = _g1++;
						if(v[i] == null) ucount++; else {
							if(ucount > 0) {
								if(ucount == 1) this.buf.b += "n"; else {
									this.buf.b += "u";
									if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
								}
								ucount = 0;
							}
							this.serialize(v[i]);
						}
					}
					if(ucount > 0) {
						if(ucount == 1) this.buf.b += "n"; else {
							this.buf.b += "u";
							if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
						}
					}
					this.buf.b += "h";
					break;
				case List:
					this.buf.b += "l";
					var v3 = v;
					var _g1_head = v3.h;
					var _g1_val = null;
					while(_g1_head != null) {
						var i1;
						_g1_val = _g1_head[0];
						_g1_head = _g1_head[1];
						i1 = _g1_val;
						this.serialize(i1);
					}
					this.buf.b += "h";
					break;
				case Date:
					var d = v;
					this.buf.b += "v";
					this.buf.add(d.getTime());
					break;
				case haxe_ds_StringMap:
					this.buf.b += "b";
					var v4 = v;
					var $it0 = v4.keys();
					while( $it0.hasNext() ) {
						var k = $it0.next();
						this.serializeString(k);
						this.serialize(__map_reserved[k] != null?v4.getReserved(k):v4.h[k]);
					}
					this.buf.b += "h";
					break;
				case haxe_ds_IntMap:
					this.buf.b += "q";
					var v5 = v;
					var $it1 = v5.keys();
					while( $it1.hasNext() ) {
						var k1 = $it1.next();
						this.buf.b += ":";
						if(k1 == null) this.buf.b += "null"; else this.buf.b += "" + k1;
						this.serialize(v5.h[k1]);
					}
					this.buf.b += "h";
					break;
				case haxe_ds_ObjectMap:
					this.buf.b += "M";
					var v6 = v;
					var $it2 = v6.keys();
					while( $it2.hasNext() ) {
						var k2 = $it2.next();
						var id = Reflect.field(k2,"__id__");
						Reflect.deleteField(k2,"__id__");
						this.serialize(k2);
						k2.__id__ = id;
						this.serialize(v6.h[k2.__id__]);
					}
					this.buf.b += "h";
					break;
				case haxe_io_Bytes:
					var v7 = v;
					var i2 = 0;
					var max = v7.length - 2;
					var charsBuf = new StringBuf();
					var b64 = haxe_Serializer.BASE64;
					while(i2 < max) {
						var b1 = v7.get(i2++);
						var b2 = v7.get(i2++);
						var b3 = v7.get(i2++);
						charsBuf.add(b64.charAt(b1 >> 2));
						charsBuf.add(b64.charAt((b1 << 4 | b2 >> 4) & 63));
						charsBuf.add(b64.charAt((b2 << 2 | b3 >> 6) & 63));
						charsBuf.add(b64.charAt(b3 & 63));
					}
					if(i2 == max) {
						var b11 = v7.get(i2++);
						var b21 = v7.get(i2++);
						charsBuf.add(b64.charAt(b11 >> 2));
						charsBuf.add(b64.charAt((b11 << 4 | b21 >> 4) & 63));
						charsBuf.add(b64.charAt(b21 << 2 & 63));
					} else if(i2 == max + 1) {
						var b12 = v7.get(i2++);
						charsBuf.add(b64.charAt(b12 >> 2));
						charsBuf.add(b64.charAt(b12 << 4 & 63));
					}
					var chars = charsBuf.b;
					this.buf.b += "s";
					if(chars.length == null) this.buf.b += "null"; else this.buf.b += "" + chars.length;
					this.buf.b += ":";
					if(chars == null) this.buf.b += "null"; else this.buf.b += "" + chars;
					break;
				default:
					if(this.useCache) this.cache.pop();
					if(v.hxSerialize != null) {
						this.buf.b += "C";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						v.hxSerialize(this);
						this.buf.b += "g";
					} else {
						this.buf.b += "c";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						this.serializeFields(v);
					}
				}
				break;
			case 4:
				if(js_Boot.__instanceof(v,Class)) {
					var className = Type.getClassName(v);
					this.buf.b += "A";
					this.serializeString(className);
				} else if(js_Boot.__instanceof(v,Enum)) {
					this.buf.b += "B";
					this.serializeString(Type.getEnumName(v));
				} else {
					if(this.useCache && this.serializeRef(v)) return;
					this.buf.b += "o";
					this.serializeFields(v);
				}
				break;
			case 7:
				var e = _g[2];
				if(this.useCache) {
					if(this.serializeRef(v)) return;
					this.cache.pop();
				}
				if(this.useEnumIndex) this.buf.b += "j"; else this.buf.b += "w";
				this.serializeString(Type.getEnumName(e));
				if(this.useEnumIndex) {
					this.buf.b += ":";
					this.buf.b += Std.string(v[1]);
				} else this.serializeString(v[0]);
				this.buf.b += ":";
				var l1 = v.length;
				this.buf.b += Std.string(l1 - 2);
				var _g11 = 2;
				while(_g11 < l1) {
					var i3 = _g11++;
					this.serialize(v[i3]);
				}
				if(this.useCache) this.cache.push(v);
				break;
			case 5:
				throw new js__$Boot_HaxeError("Cannot serialize function");
				break;
			default:
				throw new js__$Boot_HaxeError("Cannot serialize " + Std.string(v));
			}
		}
	}
	,__class__: haxe_Serializer
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe_Timer;
haxe_Timer.__name__ = ["haxe","Timer"];
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = [];
	this.cache = [];
	var r = haxe_Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe_Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe_Unserializer;
haxe_Unserializer.__name__ = ["haxe","Unserializer"];
haxe_Unserializer.initCodes = function() {
	var codes = [];
	var _g1 = 0;
	var _g = haxe_Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe_Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe_Unserializer.run = function(v) {
	return new haxe_Unserializer(v).unserialize();
};
haxe_Unserializer.prototype = {
	setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,readFloat: function() {
		var p1 = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
		}
		return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw new js__$Boot_HaxeError("Invalid object");
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!(typeof(k) == "string")) throw new js__$Boot_HaxeError("Invalid object key");
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw new js__$Boot_HaxeError("Invalid enum format");
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = [];
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			return this.readFloat();
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw new js__$Boot_HaxeError("Invalid string length");
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 107:
			return NaN;
		case 109:
			return -Infinity;
		case 112:
			return Infinity;
		case 97:
			var buf = this.buf;
			var a = [];
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw new js__$Boot_HaxeError("Invalid reference");
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw new js__$Boot_HaxeError("Invalid string reference");
			return this.scache[n2];
		case 120:
			throw new js__$Boot_HaxeError(this.unserialize());
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw new js__$Boot_HaxeError("Class not found " + name);
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw new js__$Boot_HaxeError("Enum not found " + name1);
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw new js__$Boot_HaxeError("Enum not found " + name2);
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw new js__$Boot_HaxeError("Unknown enum index " + name2 + "@" + index);
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe_ds_StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe_ds_IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c1 = this.get(this.pos++);
			while(c1 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c1 = this.get(this.pos++);
			}
			if(c1 != 104) throw new js__$Boot_HaxeError("Invalid IntMap format");
			return h1;
		case 77:
			var h2 = new haxe_ds_ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			if(this.buf.charCodeAt(this.pos) >= 48 && this.buf.charCodeAt(this.pos) <= 57 && this.buf.charCodeAt(this.pos + 1) >= 48 && this.buf.charCodeAt(this.pos + 1) <= 57 && this.buf.charCodeAt(this.pos + 2) >= 48 && this.buf.charCodeAt(this.pos + 2) <= 57 && this.buf.charCodeAt(this.pos + 3) >= 48 && this.buf.charCodeAt(this.pos + 3) <= 57 && this.buf.charCodeAt(this.pos + 4) == 45) {
				var s3 = HxOverrides.substr(this.buf,this.pos,19);
				d = HxOverrides.strDate(s3);
				this.pos += 19;
			} else {
				var t = this.readFloat();
				var d1 = new Date();
				d1.setTime(t);
				d = d1;
			}
			this.cache.push(d);
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw new js__$Boot_HaxeError("Invalid bytes length");
			var codes = haxe_Unserializer.CODES;
			if(codes == null) {
				codes = haxe_Unserializer.initCodes();
				haxe_Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe_io_Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c2 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c2 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c2 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c21 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c21 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw new js__$Boot_HaxeError("Class not found " + name3);
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw new js__$Boot_HaxeError("Invalid custom data");
			return o2;
		case 65:
			var name4 = this.unserialize();
			var cl2 = this.resolver.resolveClass(name4);
			if(cl2 == null) throw new js__$Boot_HaxeError("Class not found " + name4);
			return cl2;
		case 66:
			var name5 = this.unserialize();
			var e2 = this.resolver.resolveEnum(name5);
			if(e2 == null) throw new js__$Boot_HaxeError("Enum not found " + name5);
			return e2;
		default:
		}
		this.pos--;
		throw new js__$Boot_HaxeError("Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos);
	}
	,__class__: haxe_Unserializer
};
var haxe_crypto_Md5 = function() {
};
$hxClasses["haxe.crypto.Md5"] = haxe_crypto_Md5;
haxe_crypto_Md5.__name__ = ["haxe","crypto","Md5"];
haxe_crypto_Md5.encode = function(s) {
	var m = new haxe_crypto_Md5();
	var h = m.doEncode(haxe_crypto_Md5.str2blks(s));
	return m.hex(h);
};
haxe_crypto_Md5.str2blks = function(str) {
	var nblk = (str.length + 8 >> 6) + 1;
	var blks = [];
	var blksSize = nblk * 16;
	var _g = 0;
	while(_g < blksSize) {
		var i1 = _g++;
		blks[i1] = 0;
	}
	var i = 0;
	while(i < str.length) {
		blks[i >> 2] |= HxOverrides.cca(str,i) << (str.length * 8 + i) % 4 * 8;
		i++;
	}
	blks[i >> 2] |= 128 << (str.length * 8 + i) % 4 * 8;
	var l = str.length * 8;
	var k = nblk * 16 - 2;
	blks[k] = l & 255;
	blks[k] |= (l >>> 8 & 255) << 8;
	blks[k] |= (l >>> 16 & 255) << 16;
	blks[k] |= (l >>> 24 & 255) << 24;
	return blks;
};
haxe_crypto_Md5.prototype = {
	bitOR: function(a,b) {
		var lsb = a & 1 | b & 1;
		var msb31 = a >>> 1 | b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitXOR: function(a,b) {
		var lsb = a & 1 ^ b & 1;
		var msb31 = a >>> 1 ^ b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitAND: function(a,b) {
		var lsb = a & 1 & (b & 1);
		var msb31 = a >>> 1 & b >>> 1;
		return msb31 << 1 | lsb;
	}
	,addme: function(x,y) {
		var lsw = (x & 65535) + (y & 65535);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return msw << 16 | lsw & 65535;
	}
	,hex: function(a) {
		var str = "";
		var hex_chr = "0123456789abcdef";
		var _g = 0;
		while(_g < a.length) {
			var num = a[_g];
			++_g;
			var _g1 = 0;
			while(_g1 < 4) {
				var j = _g1++;
				str += hex_chr.charAt(num >> j * 8 + 4 & 15) + hex_chr.charAt(num >> j * 8 & 15);
			}
		}
		return str;
	}
	,rol: function(num,cnt) {
		return num << cnt | num >>> 32 - cnt;
	}
	,cmn: function(q,a,b,x,s,t) {
		return this.addme(this.rol(this.addme(this.addme(a,q),this.addme(x,t)),s),b);
	}
	,ff: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,c),this.bitAND(~b,d)),a,b,x,s,t);
	}
	,gg: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,d),this.bitAND(c,~d)),a,b,x,s,t);
	}
	,hh: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(this.bitXOR(b,c),d),a,b,x,s,t);
	}
	,ii: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(c,this.bitOR(b,~d)),a,b,x,s,t);
	}
	,doEncode: function(x) {
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		var step;
		var i = 0;
		while(i < x.length) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			step = 0;
			a = this.ff(a,b,c,d,x[i],7,-680876936);
			d = this.ff(d,a,b,c,x[i + 1],12,-389564586);
			c = this.ff(c,d,a,b,x[i + 2],17,606105819);
			b = this.ff(b,c,d,a,x[i + 3],22,-1044525330);
			a = this.ff(a,b,c,d,x[i + 4],7,-176418897);
			d = this.ff(d,a,b,c,x[i + 5],12,1200080426);
			c = this.ff(c,d,a,b,x[i + 6],17,-1473231341);
			b = this.ff(b,c,d,a,x[i + 7],22,-45705983);
			a = this.ff(a,b,c,d,x[i + 8],7,1770035416);
			d = this.ff(d,a,b,c,x[i + 9],12,-1958414417);
			c = this.ff(c,d,a,b,x[i + 10],17,-42063);
			b = this.ff(b,c,d,a,x[i + 11],22,-1990404162);
			a = this.ff(a,b,c,d,x[i + 12],7,1804603682);
			d = this.ff(d,a,b,c,x[i + 13],12,-40341101);
			c = this.ff(c,d,a,b,x[i + 14],17,-1502002290);
			b = this.ff(b,c,d,a,x[i + 15],22,1236535329);
			a = this.gg(a,b,c,d,x[i + 1],5,-165796510);
			d = this.gg(d,a,b,c,x[i + 6],9,-1069501632);
			c = this.gg(c,d,a,b,x[i + 11],14,643717713);
			b = this.gg(b,c,d,a,x[i],20,-373897302);
			a = this.gg(a,b,c,d,x[i + 5],5,-701558691);
			d = this.gg(d,a,b,c,x[i + 10],9,38016083);
			c = this.gg(c,d,a,b,x[i + 15],14,-660478335);
			b = this.gg(b,c,d,a,x[i + 4],20,-405537848);
			a = this.gg(a,b,c,d,x[i + 9],5,568446438);
			d = this.gg(d,a,b,c,x[i + 14],9,-1019803690);
			c = this.gg(c,d,a,b,x[i + 3],14,-187363961);
			b = this.gg(b,c,d,a,x[i + 8],20,1163531501);
			a = this.gg(a,b,c,d,x[i + 13],5,-1444681467);
			d = this.gg(d,a,b,c,x[i + 2],9,-51403784);
			c = this.gg(c,d,a,b,x[i + 7],14,1735328473);
			b = this.gg(b,c,d,a,x[i + 12],20,-1926607734);
			a = this.hh(a,b,c,d,x[i + 5],4,-378558);
			d = this.hh(d,a,b,c,x[i + 8],11,-2022574463);
			c = this.hh(c,d,a,b,x[i + 11],16,1839030562);
			b = this.hh(b,c,d,a,x[i + 14],23,-35309556);
			a = this.hh(a,b,c,d,x[i + 1],4,-1530992060);
			d = this.hh(d,a,b,c,x[i + 4],11,1272893353);
			c = this.hh(c,d,a,b,x[i + 7],16,-155497632);
			b = this.hh(b,c,d,a,x[i + 10],23,-1094730640);
			a = this.hh(a,b,c,d,x[i + 13],4,681279174);
			d = this.hh(d,a,b,c,x[i],11,-358537222);
			c = this.hh(c,d,a,b,x[i + 3],16,-722521979);
			b = this.hh(b,c,d,a,x[i + 6],23,76029189);
			a = this.hh(a,b,c,d,x[i + 9],4,-640364487);
			d = this.hh(d,a,b,c,x[i + 12],11,-421815835);
			c = this.hh(c,d,a,b,x[i + 15],16,530742520);
			b = this.hh(b,c,d,a,x[i + 2],23,-995338651);
			a = this.ii(a,b,c,d,x[i],6,-198630844);
			d = this.ii(d,a,b,c,x[i + 7],10,1126891415);
			c = this.ii(c,d,a,b,x[i + 14],15,-1416354905);
			b = this.ii(b,c,d,a,x[i + 5],21,-57434055);
			a = this.ii(a,b,c,d,x[i + 12],6,1700485571);
			d = this.ii(d,a,b,c,x[i + 3],10,-1894986606);
			c = this.ii(c,d,a,b,x[i + 10],15,-1051523);
			b = this.ii(b,c,d,a,x[i + 1],21,-2054922799);
			a = this.ii(a,b,c,d,x[i + 8],6,1873313359);
			d = this.ii(d,a,b,c,x[i + 15],10,-30611744);
			c = this.ii(c,d,a,b,x[i + 6],15,-1560198380);
			b = this.ii(b,c,d,a,x[i + 13],21,1309151649);
			a = this.ii(a,b,c,d,x[i + 4],6,-145523070);
			d = this.ii(d,a,b,c,x[i + 11],10,-1120210379);
			c = this.ii(c,d,a,b,x[i + 2],15,718787259);
			b = this.ii(b,c,d,a,x[i + 9],21,-343485551);
			a = this.addme(a,olda);
			b = this.addme(b,oldb);
			c = this.addme(c,oldc);
			d = this.addme(d,oldd);
			i += 16;
		}
		return [a,b,c,d];
	}
	,__class__: haxe_crypto_Md5
};
var haxe_ds_GenericCell = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
$hxClasses["haxe.ds.GenericCell"] = haxe_ds_GenericCell;
haxe_ds_GenericCell.__name__ = ["haxe","ds","GenericCell"];
haxe_ds_GenericCell.prototype = {
	__class__: haxe_ds_GenericCell
};
var haxe_ds_GenericStack = function() {
};
$hxClasses["haxe.ds.GenericStack"] = haxe_ds_GenericStack;
haxe_ds_GenericStack.__name__ = ["haxe","ds","GenericStack"];
haxe_ds_GenericStack.prototype = {
	add: function(item) {
		this.head = new haxe_ds_GenericCell(item,this.head);
	}
	,pop: function() {
		var k = this.head;
		if(k == null) return null; else {
			this.head = k.next;
			return k.elt;
		}
	}
	,__class__: haxe_ds_GenericStack
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = ["haxe","ds","IntMap"];
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
haxe_ds_ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe_ds_ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
$hxClasses["haxe.ds._StringMap.StringMapIterator"] = haxe_ds__$StringMap_StringMapIterator;
haxe_ds__$StringMap_StringMapIterator.__name__ = ["haxe","ds","_StringMap","StringMapIterator"];
haxe_ds__$StringMap_StringMapIterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: haxe_ds__$StringMap_StringMapIterator
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
haxe_io_Bytes.__name__ = ["haxe","io","Bytes"];
haxe_io_Bytes.alloc = function(length) {
	return new haxe_io_Bytes(new ArrayBuffer(length));
};
haxe_io_Bytes.ofString = function(s) {
	var a = [];
	var i = 0;
	while(i < s.length) {
		var c = StringTools.fastCodeAt(s,i++);
		if(55296 <= c && c <= 56319) c = c - 55232 << 10 | StringTools.fastCodeAt(s,i++) & 1023;
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		if(srcpos == 0 && len == src.length) this.b.set(src.b,pos); else this.b.set(src.b.subarray(srcpos,srcpos + len),pos);
	}
	,__class__: haxe_io_Bytes
};
var haxe_io_Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var haxe_io_FPHelper = function() { };
$hxClasses["haxe.io.FPHelper"] = haxe_io_FPHelper;
haxe_io_FPHelper.__name__ = ["haxe","io","FPHelper"];
haxe_io_FPHelper.i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
haxe_io_FPHelper.i64ToDouble = function(low,high) {
	var sign = 1 - (high >>> 31 << 1);
	var exp = (high >> 20 & 2047) - 1023;
	var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
haxe_io_FPHelper.doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		var av;
		if(v < 0) av = -v; else av = v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		var sig;
		var v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		sig = Math.round(v1);
		var sig_l = sig | 0;
		var sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
var haxe_web_Request = function() { };
$hxClasses["haxe.web.Request"] = haxe_web_Request;
haxe_web_Request.__name__ = ["haxe","web","Request"];
haxe_web_Request.getParams = function() {
	var get;
	var _this = window.location.search;
	get = HxOverrides.substr(_this,1,null);
	var params = new haxe_ds_StringMap();
	var _g = 0;
	var _g1 = new EReg("[&;]","g").split(get);
	while(_g < _g1.length) {
		var p = _g1[_g];
		++_g;
		var pl = p.split("=");
		if(pl.length < 2) continue;
		var name = pl.shift();
		params.set(decodeURIComponent(name.split("+").join(" ")),StringTools.urlDecode(pl.join("=")));
	}
	return params;
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
$hxClasses["js._Boot.HaxeError"] = js__$Boot_HaxeError;
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = ["js","Boot"];
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_Browser = function() { };
$hxClasses["js.Browser"] = js_Browser;
js_Browser.__name__ = ["js","Browser"];
js_Browser.getLocalStorage = function() {
	try {
		var s = window.localStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
js_Browser.getSessionStorage = function() {
	try {
		var s = window.sessionStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
js_Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw new js__$Boot_HaxeError("Unable to create XMLHttpRequest object.");
};
js_Browser.alert = function(v) {
	window.alert(js_Boot.__string_rec(v,""));
};
var js_Cookie = function() { };
$hxClasses["js.Cookie"] = js_Cookie;
js_Cookie.__name__ = ["js","Cookie"];
js_Cookie.set = function(name,value,expireDelay,path,domain) {
	var s = name + "=" + encodeURIComponent(value);
	if(expireDelay != null) {
		var d = DateTools.delta(new Date(),expireDelay * 1000);
		s += ";expires=" + d.toGMTString();
	}
	if(path != null) s += ";path=" + path;
	if(domain != null) s += ";domain=" + domain;
	window.document.cookie = s;
};
js_Cookie.all = function() {
	var h = new haxe_ds_StringMap();
	var a = window.document.cookie.split(";");
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		e = StringTools.ltrim(e);
		var t = e.split("=");
		if(t.length < 2) continue;
		h.set(t[0],decodeURIComponent(t[1].split("+").join(" ")));
	}
	return h;
};
js_Cookie.get = function(name) {
	return js_Cookie.all().get(name);
};
js_Cookie.exists = function(name) {
	return js_Cookie.all().exists(name);
};
var js_Lib = function() { };
$hxClasses["js.Lib"] = js_Lib;
js_Lib.__name__ = ["js","Lib"];
var js_Selection = function(doc) {
	this.doc = doc;
};
$hxClasses["js.Selection"] = js_Selection;
js_Selection.__name__ = ["js","Selection"];
js_Selection.prototype = {
	get: function() {
		if(this.doc.selectionStart != null) return this.doc.value.substring(this.doc.selectionStart,this.doc.selectionEnd);
		var range = js_Lib.document.selection.createRange();
		if(range.parentElement() != this.doc) return "";
		return range.text;
	}
	,select: function(start,end) {
		this.doc.focus();
		if(this.doc.selectionStart != null) {
			this.doc.selectionStart = start;
			this.doc.selectionEnd = end;
			return;
		}
		var value = this.doc.value;
		var p = 0;
		var delta = 0;
		while(true) {
			var i = value.indexOf("\r\n",p);
			if(i < 0 || i > start) break;
			delta++;
			p = i + 2;
		}
		start -= delta;
		while(true) {
			var i1 = value.indexOf("\r\n",p);
			if(i1 < 0 || i1 > end) break;
			delta++;
			p = i1 + 2;
		}
		end -= delta;
		var r = this.doc.createTextRange();
		r.moveEnd("textedit",-1);
		r.moveStart("character",start);
		r.moveEnd("character",end - start);
		r.select();
	}
	,insert: function(left,text,right) {
		this.doc.focus();
		if(this.doc.selectionStart != null) {
			var top = this.doc.scrollTop;
			var start = this.doc.selectionStart;
			var end = this.doc.selectionEnd;
			this.doc.value = Std.string(this.doc.value.substr(0,start)) + left + text + right + Std.string(this.doc.value.substr(end));
			this.doc.selectionStart = start + left.length;
			this.doc.selectionEnd = start + left.length + text.length;
			this.doc.scrollTop = top;
			return;
		}
		var range = js_Lib.document.selection.createRange();
		range.text = left + text + right;
		range.moveStart("character",-text.length - right.length);
		range.moveEnd("character",-right.length);
		range.select();
	}
	,__class__: js_Selection
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
$hxClasses["js.html.compat.ArrayBuffer"] = js_html_compat_ArrayBuffer;
js_html_compat_ArrayBuffer.__name__ = ["js","html","compat","ArrayBuffer"];
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_DataView = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	if(byteOffset == null) this.offset = 0; else this.offset = byteOffset;
	if(byteLength == null) this.length = buffer.byteLength - this.offset; else this.length = byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
};
$hxClasses["js.html.compat.DataView"] = js_html_compat_DataView;
js_html_compat_DataView.__name__ = ["js","html","compat","DataView"];
js_html_compat_DataView.prototype = {
	getInt8: function(byteOffset) {
		var v = this.buf.a[this.offset + byteOffset];
		if(v >= 128) return v - 256; else return v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		var v = this.getUint16(byteOffset,littleEndian);
		if(v >= 32768) return v - 65536; else return v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		if(littleEndian) return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8; else return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		var p = this.offset + byteOffset;
		var a = this.buf.a[p++];
		var b = this.buf.a[p++];
		var c = this.buf.a[p++];
		var d = this.buf.a[p++];
		if(littleEndian) return a | b << 8 | c << 16 | d << 24; else return d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		var v = this.getInt32(byteOffset,littleEndian);
		if(v < 0) return v + 4294967296.; else return v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return haxe_io_FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		var a = this.getInt32(byteOffset,littleEndian);
		var b = this.getInt32(byteOffset + 4,littleEndian);
		return haxe_io_FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		if(value < 0) this.buf.a[byteOffset + this.offset] = value + 128 & 255; else this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,haxe_io_FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		var i64 = haxe_io_FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js_html_compat_DataView
};
var js_html_compat_Uint8Array = function() { };
$hxClasses["js.html.compat.Uint8Array"] = js_html_compat_Uint8Array;
js_html_compat_Uint8Array.__name__ = ["js","html","compat","Uint8Array"];
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_HaxeError("TODO");
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
var mt_MLib = function() { };
$hxClasses["mt.MLib"] = mt_MLib;
mt_MLib.__name__ = ["mt","MLib"];
mt_MLib.NaN = function() {
	return NaN;
};
mt_MLib.POSITIVE_INFINITY = function() {
	return Infinity;
};
mt_MLib.NEGATIVE_INFINITY = function() {
	return -Infinity;
};
mt_MLib.toRad = function(deg) {
	return deg * 0.017453292519943295;
};
mt_MLib.toDeg = function(rad) {
	return rad * 57.295779513082323;
};
mt_MLib.min = function(x,y) {
	if(x < y) return x; else return y;
};
mt_MLib.max = function(x,y) {
	if(x > y) return x; else return y;
};
mt_MLib.iabs = function(x) {
	if(x < 0) return -x; else return x;
};
mt_MLib.sign = function(x) {
	if(x > 0) return 1; else if(x < 0) return -1; else return 0;
};
mt_MLib.sgn = function(x) {
	if(x > 0) return 1; else if(x < 0) return -1; else return 0;
};
mt_MLib.clamp = function(x,min,max) {
	if(x < min) return min; else if(x > max) return max; else return x;
};
mt_MLib.clampSym = function(x,i) {
	if(x < -i) return -i; else if(x > i) return i; else return x;
};
mt_MLib.wrap = function(x,min,max) {
	if(x < min) return x - min + max + 1; else if(x > max) return x - max + min - 1; else return x;
};
mt_MLib.fmin = function(x,y) {
	if(x < y) return x; else return y;
};
mt_MLib.fmax = function(x,y) {
	if(x > y) return x; else return y;
};
mt_MLib.fabs = function(x) {
	if(x < 0) return -x; else return x;
};
mt_MLib.fsgn = function(x) {
	if(x > 0.) return 1; else if(x < 0.) return -1; else return 0;
};
mt_MLib.fclamp = function(x,min,max) {
	if(x < min) return min; else if(x > max) return max; else return x;
};
mt_MLib.fclampSym = function(x,i) {
	if(x < -i) return -i; else if(x > i) return i; else return x;
};
mt_MLib.fwrap = function(value,lower,upper) {
	return value - ((value - lower) / (upper - lower) | 0) * (upper - lower);
};
mt_MLib.eqSgn = function(x,y) {
	return (x ^ y) >= 0;
};
mt_MLib.feqSgn = function(x,y) {
	return x * y >= 0;
};
mt_MLib.isEven = function(x) {
	return (x & 1) == 0;
};
mt_MLib.isPow2 = function(x) {
	return x > 0 && (x & x - 1) == 0;
};
mt_MLib.nearestPow2 = function(x) {
	return Math.pow(2,Math.round(Math.log(x) / Math.log(2)));
};
mt_MLib.lerp = function(a,b,t) {
	return a + (b - a) * t;
};
mt_MLib.slerp = function(a,b,t) {
	var m = Math;
	var c1 = m.sin(a * .5);
	var r1 = m.cos(a * .5);
	var c2 = m.sin(b * .5);
	var r2 = m.cos(b * .5);
	var c = r1 * r2 + c1 * c2;
	if(c < 0.) {
		if(1. + c > 1e-6) {
			var o = m.acos(-c);
			var s = m.sin(o);
			var s0 = m.sin((1 - t) * o) / s;
			var s1 = m.sin(t * o) / s;
			return m.atan2(s0 * c1 - s1 * c2,s0 * r1 - s1 * r2) * 2.;
		} else {
			var s01 = 1 - t;
			var s11 = t;
			return m.atan2(s01 * c1 - s11 * c2,s01 * r1 - s11 * r2) * 2;
		}
	} else if(1 - c > 1e-6) {
		var o1 = m.acos(c);
		var s2 = m.sin(o1);
		var s02 = m.sin((1 - t) * o1) / s2;
		var s12 = m.sin(t * o1) / s2;
		return m.atan2(s02 * c1 + s12 * c2,s02 * r1 + s12 * r2) * 2.;
	} else {
		var s03 = 1 - t;
		var s13 = t;
		return m.atan2(s03 * c1 + s13 * c2,s03 * r1 + s13 * r2) * 2;
	}
};
mt_MLib.nextPow2 = function(x) {
	var t = x;
	t |= t >> 1;
	t |= t >> 2;
	t |= t >> 3;
	t |= t >> 4;
	t |= t >> 5;
	return t + 1;
};
mt_MLib.exp = function(a,n) {
	var t = 1;
	var r = 0;
	while(true) {
		if((n & 1) != 0) t = a * t;
		n >>= 1;
		if(n == 0) {
			r = t;
			break;
		} else a *= a;
	}
	return r;
};
mt_MLib.roundTo = function(x,y) {
	return mt_MLib.round(x / y) * y;
};
mt_MLib.round = function(x) {
	return (x > 0?x + .5:x < 0?x - .5:0) | 0;
};
mt_MLib.ceil = function(x) {
	if(x > .0) {
		var t = x + .5 | 0;
		if(t < x) return t + 1; else return t;
	} else if(x < .0) {
		var t1 = x - .5 | 0;
		if(t1 < x) return t1 + 1; else return t1;
	} else return 0;
};
mt_MLib.floor = function(x) {
	if(x >= 0) return x | 0; else {
		var i = x | 0;
		if(x == i) return i; else return i - 1;
	}
};
mt_MLib.invSqrt = function(x) {
	return 1 / Math.sqrt(x);
};
mt_MLib.cmpAbs = function(x,y,eps) {
	var d = x - y;
	if(d > 0) return d < eps; else return -d < eps;
};
mt_MLib.cmpZero = function(x,eps) {
	if(x > 0) return x < eps; else return -x < eps;
};
mt_MLib.snap = function(x,y) {
	return mt_MLib.floor((x + y * .5) / y);
};
mt_MLib.inRange = function(x,min,max) {
	return x >= min && x <= max;
};
mt_MLib.rand = function(max,rnd) {
	if(max == null) max = 2147483647;
	return Std["int"]((rnd == null?Math.random():rnd()) * max);
};
mt_MLib.randRange = function(min,max,rnd) {
	var l = min - .4999;
	var h = max + .4999;
	return mt_MLib.round(l + (h - l) * (rnd == null?Math.random():rnd()));
};
mt_MLib.randRangeSym = function(range,rnd) {
	return mt_MLib.randRange(-range,range,rnd);
};
mt_MLib.frand = function(rnd) {
	if(rnd == null) return Math.random(); else return rnd();
};
mt_MLib.frandRange = function(min,max,rnd) {
	return min + (max - min) * (rnd == null?Math.random():rnd());
};
mt_MLib.frandRangeSym = function(range,rnd) {
	return mt_MLib.frandRange(-range,range,rnd);
};
mt_MLib.wrapToPi = function(x) {
	var t = mt_MLib.round(x / 6.283185307179586);
	if(x < -3.1415926535897931) return x - t * 6.283185307179586; else if(x > 3.141592653589793) return x - t * 6.283185307179586; else return x;
};
mt_MLib.wrapTo = function(n,mod) {
	var t = mt_MLib.round(n / mod);
	if(n < -2 * mod) return n - t * mod; else if(n > 2 * mod) return n - t * mod; else return n;
};
mt_MLib.sMod = function(n,mod) {
	if(mod != 0.0) {
		while(n >= mod) n -= mod;
		while(n < 0) n += mod;
	}
	return n;
};
mt_MLib.hMod = function(n,mod) {
	while(n > mod) n -= mod * 2;
	while(n < -mod) n += mod * 2;
	return n;
};
mt_MLib.gcd = function(x,y) {
	var d = 0;
	var r = 0;
	if(x < 0) x = -x; else x = x;
	if(y < 0) y = -y; else y = y;
	while(true) if(y == 0) {
		d = x;
		break;
	} else {
		r = x % y;
		x = y;
		y = r;
	}
	return d;
};
mt_MLib.maxPrecision = function(x,precision) {
	if(x == 0) return x; else {
		var correction = 10;
		var _g1 = 0;
		var _g = precision - 1;
		while(_g1 < _g) {
			var i = _g1++;
			correction *= 10;
		}
		return mt_MLib.round(correction * x) / correction;
	}
};
mt_MLib.ofBool = function(x) {
	if(x) return 1; else return 0;
};
mt_MLib.normAngle = function(f) {
	var pi = Math.PI;
	while(f >= pi * 2) f -= pi * 2;
	while(f <= -pi * 2) f += pi * 2;
	return f;
};
mt_MLib.posMod = function(i,m) {
	var mod = i % m;
	if(mod >= 0) return mod; else return mod + m;
};
mt_MLib.dist3Sq = function(x,y,z) {
	return x * x + y * y + z * z;
};
mt_MLib.dist3 = function(x,y,z) {
	return Math.sqrt(x * x + y * y + z * z);
};
mt_MLib.dist2Sq = function(x,y) {
	return x * x + y * y;
};
mt_MLib.dist2 = function(x,y) {
	return Math.sqrt(x * x + y * y);
};
mt_MLib.factorial = function(v) {
	var r = 1;
	var _g1 = 1;
	var _g = v + 1;
	while(_g1 < _g) {
		var i = _g1++;
		r *= i;
	}
	return r;
};
var mt_ArrayStd = function() { };
$hxClasses["mt.ArrayStd"] = mt_ArrayStd;
mt_ArrayStd.__name__ = ["mt","ArrayStd"];
mt_ArrayStd.isEmpty = function(ar) {
	return ar.length == 0;
};
mt_ArrayStd.size = function(ar) {
	return ar.length;
};
mt_ArrayStd.first = function(ar) {
	return ar[0];
};
mt_ArrayStd.last = function(ar) {
	return ar[ar.length - 1];
};
mt_ArrayStd.clear = function(ar) {
	ar.splice(0,ar.length);
	return ar;
};
mt_ArrayStd.set = function(ar,index,v) {
	ar[index] = v;
	return ar;
};
mt_ArrayStd.get = function(ar,index) {
	return ar[index];
};
mt_ArrayStd.exists = function(ar,index) {
	return index >= 0 && index < ar.length && ar[index] != null;
};
mt_ArrayStd.has = function(ar,elt) {
	return mt_ArrayStd.indexOf(ar,elt) >= 0;
};
mt_ArrayStd.indexOf = function(ar,elt) {
	var id = -1;
	var i = -1;
	var _g = 0;
	while(_g < ar.length) {
		var e = ar[_g];
		++_g;
		++i;
		if(e == elt) {
			id = i;
			break;
		}
	}
	return id;
};
mt_ArrayStd.addFirst = function(ar,e) {
	ar.unshift(e);
	return ar;
};
mt_ArrayStd.addLast = function(ar,e) {
	ar.push(e);
	return ar;
};
mt_ArrayStd.removeFirst = function(ar) {
	return ar.shift();
};
mt_ArrayStd.removeLast = function(ar) {
	return ar.pop();
};
mt_ArrayStd.map = function(ar,f) {
	var output = [];
	var _g = 0;
	while(_g < ar.length) {
		var e = ar[_g];
		++_g;
		output.push(f(e));
	}
	return output;
};
mt_ArrayStd.stripNull = function(ar) {
	while(HxOverrides.remove(ar,null)) {
	}
	return ar;
};
mt_ArrayStd.flatten = function(ar) {
	var out = [];
	var _g1 = 0;
	var _g = ar.length;
	while(_g1 < _g) {
		var i = _g1++;
		var $it0 = $iterator(ar[i])();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			out.push(x);
			out;
		}
		out;
	}
	return out;
};
mt_ArrayStd.append = function(ar,it) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		ar.push(x);
		ar;
	}
	return ar;
};
mt_ArrayStd.prepend = function(ar,it) {
	var a = Lambda.array(it);
	a.reverse();
	var _g = 0;
	while(_g < a.length) {
		var x = a[_g];
		++_g;
		ar.unshift(x);
		ar;
	}
	return ar;
};
mt_ArrayStd.shuffle = function(ar,rand) {
	var rnd;
	if(rand != null) rnd = rand; else rnd = Std.random;
	var size = ar.length;
	var _g1 = 0;
	var _g = size << 1;
	while(_g1 < _g) {
		var i = _g1++;
		var id0 = rnd(size);
		var id1 = rnd(size);
		var tmp = ar[id0];
		ar[id0] = ar[id1];
		ar[id1] = tmp;
	}
	return ar;
};
mt_ArrayStd.getRandom = function(ar,rnd) {
	var random;
	if(rnd != null) random = rnd; else random = Std.random;
	var id = random(ar.length);
	return ar[id];
};
mt_ArrayStd.usort = function(t,f) {
	var a = t;
	var i = 0;
	var l = t.length;
	while(i < l) {
		var swap = false;
		var j = 0;
		var max = l - i - 1;
		while(j < max) {
			if(f(a[j],a[j + 1]) > 0) {
				var tmp = a[j + 1];
				a[j + 1] = a[j];
				a[j] = tmp;
				swap = true;
			}
			j += 1;
		}
		if(!swap) break;
		i += 1;
	}
	return a;
};
var mt_ArrayFloatStd = function() { };
$hxClasses["mt.ArrayFloatStd"] = mt_ArrayFloatStd;
mt_ArrayFloatStd.__name__ = ["mt","ArrayFloatStd"];
mt_ArrayFloatStd.zero = function(t) {
	var _g1 = 0;
	var _g = t.length;
	while(_g1 < _g) {
		var i = _g1++;
		t[i] = 0.0;
	}
};
var mt_ArrayIntStd = function() { };
$hxClasses["mt.ArrayIntStd"] = mt_ArrayIntStd;
mt_ArrayIntStd.__name__ = ["mt","ArrayIntStd"];
mt_ArrayIntStd.zero = function(t) {
	var _g1 = 0;
	var _g = t.length;
	while(_g1 < _g) {
		var i = _g1++;
		t[i] = 0;
	}
};
var mt_ArrayNullStd = function() { };
$hxClasses["mt.ArrayNullStd"] = mt_ArrayNullStd;
mt_ArrayNullStd.__name__ = ["mt","ArrayNullStd"];
mt_ArrayNullStd.zero = function(t) {
	var _g1 = 0;
	var _g = t.length;
	while(_g1 < _g) {
		var i = _g1++;
		t[i] = null;
	}
};
var mt_ListStd = function() { };
$hxClasses["mt.ListStd"] = mt_ListStd;
mt_ListStd.__name__ = ["mt","ListStd"];
mt_ListStd.size = function(l) {
	return l.length;
};
mt_ListStd.get = function(l,index) {
	var ite_head = l.h;
	var ite_val = null;
	while(--index > -1 && ite_head != null) {
		ite_val = ite_head[0];
		ite_head = ite_head[1];
		ite_val;
	}
	if(index == -1) return (function($this) {
		var $r;
		ite_val = ite_head[0];
		ite_head = ite_head[1];
		$r = ite_val;
		return $r;
	}(this)); else return null;
};
mt_ListStd.exists = function(l,index) {
	return index >= 0 && index < l.length && mt_ListStd.get(l,index) != null;
};
mt_ListStd.has = function(l,elt) {
	return mt_ListStd.indexOf(l,elt) > -1;
};
mt_ListStd.indexOf = function(l,elt) {
	var id = -1;
	var i = -1;
	var _g_head = l.h;
	var _g_val = null;
	while(_g_head != null) {
		var e;
		e = (function($this) {
			var $r;
			_g_val = _g_head[0];
			_g_head = _g_head[1];
			$r = _g_val;
			return $r;
		}(this));
		++i;
		if(e == elt) {
			id = i;
			break;
		}
	}
	return id;
};
mt_ListStd.addFirst = function(l,e) {
	l.push(e);
	return l;
};
mt_ListStd.addLast = function(l,e) {
	l.add(e);
	return l;
};
mt_ListStd.removeFirst = function(l) {
	return l.pop();
};
mt_ListStd.removeLast = function(l) {
	var cpy = Lambda.list(l);
	var ite_head = cpy.h;
	var ite_val = null;
	var last = l.last();
	l.clear();
	var _g1 = 0;
	var _g = cpy.length - 1;
	while(_g1 < _g) {
		var i = _g1++;
		l.add((function($this) {
			var $r;
			ite_val = ite_head[0];
			ite_head = ite_head[1];
			$r = ite_val;
			return $r;
		}(this)));
	}
	return last;
};
mt_ListStd.copy = function(l) {
	return Lambda.list(l);
};
mt_ListStd.flatten = function(l) {
	var out = new List();
	var _g1 = 0;
	var _g = l.length;
	while(_g1 < _g) {
		var i = _g1++;
		mt_ListStd.append(out,mt_ListStd.get(l,i));
	}
	return out;
};
mt_ListStd.append = function(l,it) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	return l;
};
mt_ListStd.prepend = function(l,it) {
	var a = Lambda.array(it);
	a.reverse();
	var _g = 0;
	while(_g < a.length) {
		var x = a[_g];
		++_g;
		l.push(x);
		l;
	}
	return l;
};
mt_ListStd.reverse = function(l) {
	var cpy = [];
	while(l.length > 0) mt_ArrayStd.addFirst(cpy,l.pop());
	while(cpy.length > 0) mt_ListStd.addFirst(l,cpy.pop());
	return l;
};
mt_ListStd.shuffle = function(l,rand) {
	var ar = Lambda.array(l);
	mt_ArrayStd.shuffle(ar,rand);
	l.clear();
	var _g1 = 0;
	var _g = ar.length;
	while(_g1 < _g) {
		var i = _g1++;
		l.add(ar[i]);
		l;
	}
	ar = null;
	return l;
};
mt_ListStd.slice = function(l,pos,end) {
	var out = new List();
	if(end == null) end = l.length;
	var _g = pos;
	while(_g < end) {
		var i = _g++;
		mt_ListStd.addLast(out,mt_ListStd.get(l,i));
	}
	return out;
};
mt_ListStd.splice = function(l,pos,len) {
	var out = new List();
	var copy = Lambda.list(l);
	l.clear();
	var i = 0;
	var _g_head = copy.h;
	var _g_val = null;
	while(_g_head != null) {
		var e;
		e = (function($this) {
			var $r;
			_g_val = _g_head[0];
			_g_head = _g_head[1];
			$r = _g_val;
			return $r;
		}(this));
		if(i < pos) {
			l.add(e);
			l;
		} else if(i >= pos + len) {
			l.add(e);
			l;
		} else {
			out.add(e);
			out;
		}
		i++;
	}
	return out;
};
mt_ListStd.stripNull = function(l) {
	while(l.remove(null)) {
	}
	return l;
};
mt_ListStd.getRandom = function(l,rnd) {
	var random;
	if(rnd != null) random = rnd; else random = Std.random;
	var id = random(l.length);
	return mt_ListStd.get(l,id);
};
mt_ListStd.usort = function(l,f) {
	var a = Lambda.array(l);
	a = mt_ArrayStd.usort(a,f);
	l.clear();
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		l.add(e);
		l;
	}
	return l;
};
mt_ListStd.inject = function(dst,src) {
	var _g = 0;
	var _g1 = Reflect.fields(src);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		Reflect.setProperty(dst,f,Reflect.getProperty(src,f));
	}
};
var mt_Utf8 = function() { };
$hxClasses["mt.Utf8"] = mt_Utf8;
mt_Utf8.__name__ = ["mt","Utf8"];
mt_Utf8.removeAccents = function(s) {
	var b_b = "";
	var _g1 = 0;
	var _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = HxOverrides.cca(s,i);
		if(c != null) switch(c) {
		case 233:case 232:case 234:case 235:case 7867:case 7875:
			b_b += "e";
			break;
		case 201:case 200:case 202:case 203:case 7866:case 7874:
			b_b += "E";
			break;
		case 224:case 226:case 228:case 225:case 259:case 227:case 229:case 7843:case 7849:case 7859:
			b_b += "a";
			break;
		case 192:case 194:case 196:case 193:case 258:case 195:case 197:case 7842:case 7848:case 7858:
			b_b += "A";
			break;
		case 249:case 251:case 252:case 250:case 363:case 7911:case 7917:
			b_b += "u";
			break;
		case 217:case 219:case 220:case 218:case 362:case 7910:case 7916:
			b_b += "U";
			break;
		case 238:case 239:case 237:case 236:case 7881:
			b_b += "i";
			break;
		case 206:case 207:case 205:case 204:case 7880:
			b_b += "I";
			break;
		case 244:case 243:case 246:case 245:case 248:case 7887:case 7893:case 7903:
			b_b += "o";
			break;
		case 212:case 211:case 214:case 213:case 216:case 7886:case 7892:case 7902:
			b_b += "O";
			break;
		case 375:case 255:case 253:case 7923:case 7927:
			b_b += "y";
			break;
		case 374:case 376:case 221:case 7922:case 7926:
			b_b += "Y";
			break;
		case 230:case 198:
			b_b += "a";
			b_b += "e";
			break;
		case 339:case 338:
			b_b += "o";
			b_b += "e";
			break;
		case 231:
			b_b += "c";
			break;
		case 199:
			b_b += "C";
			break;
		case 241:
			b_b += "n";
			break;
		case 209:
			b_b += "N";
			break;
		case 353:
			b_b += "s";
			break;
		case 352:
			b_b += "S";
			break;
		case 382:
			b_b += "z";
			break;
		case 381:
			b_b += "Z";
			break;
		default:
			b_b += String.fromCharCode(c);
		} else b_b += String.fromCharCode(c);
	}
	return b_b;
};
mt_Utf8.addNbsps = function(str) {
	str = StringTools.replace(str," !",mt_Utf8.NBSP + "!");
	str = StringTools.replace(str," ?",mt_Utf8.NBSP + "?");
	str = StringTools.replace(str," :",mt_Utf8.NBSP + ":");
	str = StringTools.replace(str," ;",mt_Utf8.NBSP + ";");
	str = StringTools.replace(str," / ",mt_Utf8.NBSP + "/" + mt_Utf8.NBSP);
	return str;
};
mt_Utf8.uppercase = function(s) {
	return s.toUpperCase();
};
mt_Utf8.lowercase = function(s) {
	return s.toLowerCase();
};
mt_Utf8.capitalizeWord = function(s) {
	return mt_Utf8.uppercase(HxOverrides.substr(s,0,1)) + HxOverrides.substr(s,1,null);
};
var mt_db_Phoneme = function() {
	if(mt_db_Phoneme.tables == null) mt_db_Phoneme.initTables();
};
$hxClasses["mt.db.Phoneme"] = mt_db_Phoneme;
mt_db_Phoneme.__name__ = ["mt","db","Phoneme"];
mt_db_Phoneme.initTables = function() {
	mt_db_Phoneme.tables = [{ terminal : null, table : []}];
	mt_db_Phoneme.repl("EAU","O");
	mt_db_Phoneme.repl("AU","O");
	mt_db_Phoneme.repl("OU","U");
	mt_db_Phoneme.repl("EU","e");
	mt_db_Phoneme.repl("AI","e");
	mt_db_Phoneme.repl("ER","e");
	mt_db_Phoneme.repl("CH","sh");
	mt_db_Phoneme.repl("OE","e");
	mt_db_Phoneme.repl("PH","F");
	mt_db_Phoneme.repl("H","");
	mt_db_Phoneme.repl("S$","$");
	mt_db_Phoneme.repl("T$","$");
	mt_db_Phoneme.repl("TS$","$");
	mt_db_Phoneme.repl("E$","$");
	mt_db_Phoneme.repl("ES$","$");
	mt_db_Phoneme.repl("P$","$");
	mt_db_Phoneme.repl("X$","$");
	mt_db_Phoneme.repl("ER$","e$");
	mt_db_Phoneme.repl("EE","e");
	mt_db_Phoneme.repl("AA","A");
	mt_db_Phoneme.repl("OO","O");
	mt_db_Phoneme.repl("UU","U");
	mt_db_Phoneme.repl("II","I");
	mt_db_Phoneme.repl("LL","L");
	mt_db_Phoneme.repl("TT","T");
	mt_db_Phoneme.repl("SS","S");
	mt_db_Phoneme.repl("NN","N");
	mt_db_Phoneme.repl("MM","N");
	mt_db_Phoneme.repl("RR","R");
	mt_db_Phoneme.repl("PP","P");
	mt_db_Phoneme.repl("FF","F");
	mt_db_Phoneme.repl("C","K");
	mt_db_Phoneme.repl("CE","SE");
	mt_db_Phoneme.repl("CS","X");
	mt_db_Phoneme.repl("CK","K");
	mt_db_Phoneme.repl("SK","K");
	mt_db_Phoneme.repl("QU","K");
	mt_db_Phoneme.repl("GU","G");
	mt_db_Phoneme.repl("GE","J");
	mt_db_Phoneme.repl("Y","I");
	mt_db_Phoneme.repl("Z","S");
	mt_db_Phoneme.repl("TIO","SIO");
	mt_db_Phoneme.repl("TIA","SIA");
	mt_db_Phoneme.repl("ERT","ert");
	mt_db_Phoneme.repl("EN","n");
	mt_db_Phoneme.repl("ON","n");
	mt_db_Phoneme.repl("ION","ioN");
	mt_db_Phoneme.repl("IN","n");
	mt_db_Phoneme.repl("INE","iNE");
	mt_db_Phoneme.repl("AIN","n");
	mt_db_Phoneme.repl("AN","n");
	mt_db_Phoneme.repl("AM","n");
	mt_db_Phoneme.repl("EM","n");
	mt_db_Phoneme.repl("OM","n");
	mt_db_Phoneme.repl("EMM","em");
	mt_db_Phoneme.repl("AMM","am");
	mt_db_Phoneme.repl("OMM","om");
};
mt_db_Phoneme.repl = function(a,b) {
	var state = 0;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		var t1 = mt_db_Phoneme.tables[state].table;
		var c = HxOverrides.cca(a,i);
		state = t1[c];
		if(state == null) {
			state = mt_db_Phoneme.tables.length;
			t1[c] = state;
			mt_db_Phoneme.tables.push({ terminal : null, table : []});
		}
	}
	var t = mt_db_Phoneme.tables[state];
	if(t.terminal != null) throw new js__$Boot_HaxeError("Duplicate replace " + a);
	if(a.length < b.length) throw new js__$Boot_HaxeError("Invalid replace " + a + ":" + b);
	t.terminal = haxe_io_Bytes.ofString(b);
};
mt_db_Phoneme.removeAccentsUTF8 = function(s) {
	return mt_Utf8.removeAccents(s);
};
mt_db_Phoneme.levenshtein = function(a,b) {
	var d = [];
	var k = a.length + 1;
	var k2 = b.length + 1;
	var _g = 0;
	while(_g < k) {
		var i = _g++;
		d[i] = i;
	}
	var _g1 = 0;
	while(_g1 < k2) {
		var j = _g1++;
		d[j * k] = j;
	}
	var _g2 = 1;
	while(_g2 < k) {
		var i1 = _g2++;
		var _g11 = 1;
		while(_g11 < k2) {
			var j1 = _g11++;
			var v;
			if(a.charCodeAt(i1 - 1) == b.charCodeAt(j1 - 1)) v = 0; else v = 1;
			var er = d[i1 - 1 + j1 * k] + 1;
			var ins = d[i1 + (j1 - 1) * k] + 1;
			var sub = d[i1 - 1 + (j1 - 1) * k] + v;
			if(er < ins) {
				if(er < sub) d[i1 + j1 * k] = er; else d[i1 + j1 * k] = sub;
			} else if(ins < sub) d[i1 + j1 * k] = ins; else d[i1 + j1 * k] = sub;
		}
	}
	return d[a.length + b.length * k];
};
mt_db_Phoneme.prototype = {
	get: function(at) {
		return HxOverrides.cca(this.s,at);
	}
	,make: function(s) {
		s = mt_Utf8.removeAccents(s);
		s = s.toUpperCase();
		var buf_b = "";
		var b = haxe_io_Bytes.ofString("$" + new EReg("[^A-Z]+","g").split(s).join("$") + "$");
		var i = 0;
		var max = b.length;
		var tables = mt_db_Phoneme.tables;
		var t;
		var state;
		var lastpos = 0;
		var last;
		var startpos;
		while(i < max) {
			last = null;
			startpos = i;
			t = tables[0];
			do {
				state = t.table[b.b[i]];
				if(state == null) break;
				t = tables[state];
				++i;
				if(t.terminal != null) {
					last = t.terminal;
					lastpos = i;
				}
			} while(i < max);
			if(last == null) {
				i = startpos;
				var c = b.b[i];
				if(c >= 97 && c <= 122) c += -32;
				buf_b += String.fromCharCode(c);
				i++;
			} else {
				var len = last.length;
				i = lastpos - len;
				b.blit(i,last,0,len);
			}
		}
		return buf_b;
	}
	,__class__: mt_db_Phoneme
};
var mt_deepnight_Color = function() { };
$hxClasses["mt.deepnight.Color"] = mt_deepnight_Color;
mt_deepnight_Color.__name__ = ["mt","deepnight","Color"];
mt_deepnight_Color.hexToRgb = function(hex) {
	if(hex == null) throw new js__$Boot_HaxeError("hexToColor with null");
	if(hex.indexOf("#") == 0) hex = HxOverrides.substr(hex,1,999);
	return { r : Std.parseInt("0x" + HxOverrides.substr(hex,0,2)), g : Std.parseInt("0x" + HxOverrides.substr(hex,2,2)), b : Std.parseInt("0x" + HxOverrides.substr(hex,4,2))};
};
mt_deepnight_Color.hexToInt = function(hex) {
	return Std.parseInt("0x" + HxOverrides.substr(hex,1,999));
};
mt_deepnight_Color.hexToInta = function(hex) {
	return Std.parseInt("0xff" + HxOverrides.substr(hex,1,999));
};
mt_deepnight_Color.rgbToInt = function(c) {
	return c.r << 16 | c.g << 8 | c.b;
};
mt_deepnight_Color.rgbToHex = function(c) {
	return mt_deepnight_Color.intToHex(c.r << 16 | c.g << 8 | c.b,null);
};
mt_deepnight_Color.rgbToHsl = function(c) {
	var r = c.r / 255;
	var g = c.g / 255;
	var b = c.b / 255;
	var min;
	if(r <= g && r <= b) min = r; else if(g <= b) min = g; else min = b;
	var max;
	if(r >= g && r >= b) max = r; else if(g >= b) max = g; else max = b;
	var delta = max - min;
	var hsl = { h : 0., s : 0., l : 0.};
	hsl.l = max;
	if(delta != 0) {
		hsl.s = delta / max;
		var dr = ((max - r) / 6 + delta / 2) / delta;
		var dg = ((max - g) / 6 + delta / 2) / delta;
		var db = ((max - b) / 6 + delta / 2) / delta;
		if(r == max) hsl.h = db - dg; else if(g == max) hsl.h = 0.33333333333333331 + dr - db; else if(b == max) hsl.h = 0.66666666666666663 + dg - dr;
		if(hsl.h < 0) hsl.h++;
		if(hsl.h > 1) hsl.h--;
	}
	return hsl;
};
mt_deepnight_Color.hslToRgb = function(hsl) {
	var c = { r : 0, g : 0, b : 0};
	var r = 0.;
	var g = 0.;
	var b = 0.;
	if(hsl.s == 0) c.r = c.g = c.b = Math.round(hsl.l * 255); else {
		var h = hsl.h * 6;
		var i = Math.floor(h);
		var c1 = hsl.l * (1 - hsl.s);
		var c2 = hsl.l * (1 - hsl.s * (h - i));
		var c3 = hsl.l * (1 - hsl.s * (1 - (h - i)));
		if(i == 0 || i == 6) {
			r = hsl.l;
			g = c3;
			b = c1;
		} else if(i == 1) {
			r = c2;
			g = hsl.l;
			b = c1;
		} else if(i == 2) {
			r = c1;
			g = hsl.l;
			b = c3;
		} else if(i == 3) {
			r = c1;
			g = c2;
			b = hsl.l;
		} else if(i == 4) {
			r = c3;
			g = c1;
			b = hsl.l;
		} else {
			r = hsl.l;
			g = c1;
			b = c2;
		}
		c.r = Math.round(r * 255);
		c.g = Math.round(g * 255);
		c.b = Math.round(b * 255);
	}
	return c;
};
mt_deepnight_Color.rgbToMatrix = function(c) {
	var matrix = [];
	matrix = matrix.concat([c.r / 255,0,0,0,0]);
	matrix = matrix.concat([0,c.g / 255,0,0,0]);
	matrix = matrix.concat([0,0,c.b / 255,0,0]);
	matrix = matrix.concat([0,0,0,1.0,0]);
	return matrix;
};
mt_deepnight_Color.intToHex = function(c,leadingZeros) {
	if(leadingZeros == null) leadingZeros = 6;
	var h = StringTools.hex(c);
	while(h.length < leadingZeros) h = "0" + h;
	return "#" + h;
};
mt_deepnight_Color.intToRgb = function(c) {
	return { r : c >> 16, g : c >> 8 & 255, b : c & 255};
};
mt_deepnight_Color.intToRgba = function(c) {
	return { a : c >>> 24, r : c >> 16 & 255, g : c >> 8 & 255, b : c & 255};
};
mt_deepnight_Color.intToHsl = function(c) {
	return mt_deepnight_Color.rgbToHsl({ r : c >> 16, g : c >> 8 & 255, b : c & 255});
};
mt_deepnight_Color.hslToInt = function(c) {
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.hslToRgb(c));
};
mt_deepnight_Color.rgbaToInt = function(c) {
	return c.a << 24 | c.r << 16 | c.g << 8 | c.b;
};
mt_deepnight_Color.rgbaToRgb = function(c) {
	return { r : c.r, g : c.g, b : c.b};
};
mt_deepnight_Color.multiply = function(c,f) {
	return { r : c.r * f | 0, g : c.g * f | 0, b : c.b * f | 0};
};
mt_deepnight_Color.saturation = function(c,delta) {
	var hsl = mt_deepnight_Color.rgbToHsl(c);
	hsl.s += delta;
	if(hsl.s > 1) hsl.s = 1;
	if(hsl.s < 0) hsl.s = 0;
	return mt_deepnight_Color.hslToRgb(hsl);
};
mt_deepnight_Color.saturationInt = function(c,delta) {
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.saturation({ r : c >> 16, g : c >> 8 & 255, b : c & 255},delta));
};
mt_deepnight_Color.clampBrightness = function(c,minLum,maxLum) {
	var hsl = mt_deepnight_Color.rgbToHsl(c);
	if(hsl.l > maxLum) {
		hsl.l = maxLum;
		return mt_deepnight_Color.hslToRgb(hsl);
	} else if(hsl.l < minLum) {
		hsl.l = minLum;
		return mt_deepnight_Color.hslToRgb(hsl);
	} else return c;
};
mt_deepnight_Color.clampBrightnessInt = function(cint,minLum,maxLum) {
	var hsl = mt_deepnight_Color.rgbToHsl({ r : cint >> 16, g : cint >> 8 & 255, b : cint & 255});
	if(hsl.l > maxLum) {
		hsl.l = maxLum;
		return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.hslToRgb(hsl));
	} else if(hsl.l < minLum) {
		hsl.l = minLum;
		return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.hslToRgb(hsl));
	} else return cint;
};
mt_deepnight_Color.cap = function(c,sat,lum) {
	var hsl = mt_deepnight_Color.rgbToHsl(c);
	if(hsl.s > sat) hsl.s = sat;
	if(hsl.l > lum) hsl.l = lum;
	return mt_deepnight_Color.hslToRgb(hsl);
};
mt_deepnight_Color.capInt = function(c,sat,lum) {
	var hsl = mt_deepnight_Color.rgbToHsl({ r : c >> 16, g : c >> 8 & 255, b : c & 255});
	if(hsl.s > sat) hsl.s = sat;
	if(hsl.l > lum) hsl.l = lum;
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.hslToRgb(hsl));
};
mt_deepnight_Color.hue = function(c,f) {
	var hsl = mt_deepnight_Color.rgbToHsl(c);
	hsl.h += f;
	if(hsl.h > 1) hsl.h = 1;
	if(hsl.h < 0) hsl.h = 0;
	return mt_deepnight_Color.hslToRgb(hsl);
};
mt_deepnight_Color.hueInt = function(c,f) {
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.hue({ r : c >> 16, g : c >> 8 & 255, b : c & 255},f));
};
mt_deepnight_Color.change = function(cint,lum,sat) {
	var hsl = mt_deepnight_Color.rgbToHsl({ r : cint >> 16, g : cint >> 8 & 255, b : cint & 255});
	if(lum != null) hsl.l = lum;
	if(sat != null) hsl.s = sat;
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.hslToRgb(hsl));
};
mt_deepnight_Color.brightnessInt = function(cint,delta) {
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.brightness({ r : cint >> 16, g : cint >> 8 & 255, b : cint & 255},delta));
};
mt_deepnight_Color.brightness = function(c,delta) {
	var hsl = mt_deepnight_Color.rgbToHsl(c);
	if(delta < 0) {
		hsl.l += delta;
		if(hsl.l < 0) hsl.l = 0;
	} else {
		var d = 1 - hsl.l;
		if(d > delta) hsl.l += delta; else {
			hsl.l = 1;
			hsl.s -= delta - d;
			if(hsl.s < 0) hsl.s = 0;
		}
	}
	return mt_deepnight_Color.hslToRgb(hsl);
};
mt_deepnight_Color.desaturate = function(c,ratio) {
	var gray = 0.3 * c.r + 0.59 * c.g + 0.11 * c.b;
	return { r : gray * ratio + c.r * (1 - ratio) | 0, g : gray * ratio + c.g * (1 - ratio) | 0, b : gray * ratio + c.b * (1 - ratio) | 0};
};
mt_deepnight_Color.desaturateInt = function(c,ratio) {
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.desaturate({ r : c >> 16, g : c >> 8 & 255, b : c & 255},ratio));
};
mt_deepnight_Color.getAlpha = function(c) {
	return c >>> 24;
};
mt_deepnight_Color.getAlphaF = function(c) {
	return (c >>> 24) / 255.0;
};
mt_deepnight_Color.removeAlpha = function(col32) {
	return col32 & 16777215;
};
mt_deepnight_Color.addAlphaF = function(c,a) {
	if(a == null) a = 1.0;
	return (a * 255 | 0) << 24 | c;
};
mt_deepnight_Color.addAlphaI = function(c,a) {
	if(a == null) a = 255;
	return a << 24 | c;
};
mt_deepnight_Color.randomColor = function(hue,sat,lum) {
	if(lum == null) lum = 1.0;
	if(sat == null) sat = 1.0;
	return mt_deepnight_Color.makeColorHsl(hue,sat,lum);
};
mt_deepnight_Color.fromString = function(k) {
	var csum = 0;
	var _g1 = 0;
	var _g = k.length;
	while(_g1 < _g) {
		var i = _g1++;
		csum += HxOverrides.cca(k,i);
	}
	return mt_deepnight_Color.makeColorHsl(csum % 1000 / 1000,0.5 + 0.5 * (csum % 637) / 637,0.6 + 0.4 * (csum % 1221) / 1221);
};
mt_deepnight_Color.makeColorHsl = function(hue,saturation,luminosity) {
	if(luminosity == null) luminosity = 1.0;
	if(saturation == null) saturation = 1.0;
	var hsl = { h : hue, s : saturation, l : luminosity};
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.hslToRgb(hsl));
};
mt_deepnight_Color.makeColor = function(r,g,b,a) {
	if(a == null) a = 1.0;
	return mt_deepnight_Color.rgbaToInt({ r : r * 255 | 0, g : g * 255 | 0, b : b * 255 | 0, a : a * 255 | 0});
};
mt_deepnight_Color.getRgbRatio = function(cint,crgb) {
	var c;
	if(cint != null) c = { r : cint >> 16, g : cint >> 8 & 255, b : cint & 255}; else c = crgb;
	var max;
	if(c.b > c.g && c.b > c.r) max = c.b; else if(c.g > c.r && c.g > c.b) max = c.g; else max = c.r;
	return { r : c.r / max, g : c.g / max, b : c.b / max};
};
mt_deepnight_Color.getLuminosityPerception = function(c) {
	return Math.sqrt(0.241 * (c.r * c.r) + 0.691 * (c.g * c.g) + 0.068 * (c.b * c.b));
};
mt_deepnight_Color.autoContrast = function(c,dark,light) {
	if(light == null) light = 16777215;
	if(dark == null) dark = 0;
	if(mt_deepnight_Color.getLuminosityPerception({ r : c >> 16, g : c >> 8 & 255, b : c & 255}) >= 125) return dark; else return light;
};
mt_deepnight_Color.getLuminosity = function(c,cint) {
	if(c != null) return mt_deepnight_Color.rgbToHsl(c).l; else return mt_deepnight_Color.rgbToHsl({ r : cint >> 16, g : cint >> 8 & 255, b : cint & 255}).l;
};
mt_deepnight_Color.setLuminosity = function(c,lum) {
	var hsl = mt_deepnight_Color.rgbToHsl(c);
	hsl.l = lum;
	return mt_deepnight_Color.hslToRgb(hsl);
};
mt_deepnight_Color.changeHslInt = function(c,lum,sat) {
	var hsl = mt_deepnight_Color.rgbToHsl({ r : c >> 16, g : c >> 8 & 255, b : c & 255});
	hsl.l = lum;
	hsl.s = sat;
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.hslToRgb(hsl));
};
mt_deepnight_Color.addHslInt = function(c,hDelta,sDelta,lDelta) {
	var hsl = mt_deepnight_Color.rgbToHsl({ r : c >> 16, g : c >> 8 & 255, b : c & 255});
	hsl.h += hDelta;
	hsl.s += sDelta;
	hsl.l += lDelta;
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.hslToRgb(hsl));
};
mt_deepnight_Color.setLuminosityInt = function(c,lum) {
	var hsl = mt_deepnight_Color.rgbToHsl({ r : c >> 16, g : c >> 8 & 255, b : c & 255});
	hsl.l = lum;
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.hslToRgb(hsl));
};
mt_deepnight_Color.offsetColor = function(c,delta) {
	return { r : Std["int"](mt_MLib.fmax(0,mt_MLib.fmin(255,c.r + delta))), g : Std["int"](mt_MLib.fmax(0,mt_MLib.fmin(255,c.g + delta))), b : Std["int"](mt_MLib.fmax(0,mt_MLib.fmin(255,c.b + delta)))};
};
mt_deepnight_Color.offsetColorRgba = function(c,delta) {
	return { r : Std["int"](mt_MLib.fmax(0,mt_MLib.fmin(255,c.r + delta))), g : Std["int"](mt_MLib.fmax(0,mt_MLib.fmin(255,c.g + delta))), b : Std["int"](mt_MLib.fmax(0,mt_MLib.fmin(255,c.b + delta))), a : c.a};
};
mt_deepnight_Color.offsetColorInt = function(c,delta) {
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.offsetColor({ r : c >> 16, g : c >> 8 & 255, b : c & 255},delta));
};
mt_deepnight_Color.interpolatePal = function(from,to,ratio) {
	var result = [];
	var _g1 = 0;
	var _g = from.length;
	while(_g1 < _g) {
		var i = _g1++;
		result[i] = mt_deepnight_Color.interpolate(from[i],to[i],ratio);
	}
	return result;
};
mt_deepnight_Color.interpolate = function(from,to,ratio) {
	if(ratio < 0) ratio = 0; else if(ratio > 1) ratio = 1; else ratio = ratio;
	return { r : from.r + (to.r - from.r) * ratio | 0, g : from.g + (to.g - from.g) * ratio | 0, b : from.b + (to.b - from.b) * ratio | 0};
};
mt_deepnight_Color.interpolateInt = function(from,to,ratio) {
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.interpolate({ r : from >> 16, g : from >> 8 & 255, b : from & 255},{ r : to >> 16, g : to >> 8 & 255, b : to & 255},ratio));
};
mt_deepnight_Color.mix = function(from,to,ratio) {
	var _g = Type["typeof"](from);
	switch(_g[1]) {
	case 1:
		return mt_deepnight_Color.interpolateInt(from,to,ratio);
	case 4:
		return mt_deepnight_Color.interpolate(from,to,ratio);
	default:
		throw new js__$Boot_HaxeError("error");
	}
};
mt_deepnight_Color.average = function(a) {
	if(a.length == 0) return 0;
	var c = a[0];
	var _g1 = 1;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		c = mt_deepnight_Color.interpolateInt(c,a[i],0.5);
	}
	return c;
};
mt_deepnight_Color.interpolateIntArray = function(colors,ratio) {
	if(colors.length < 2) throw new js__$Boot_HaxeError("Need 2 colors or more!");
	if(ratio < 0) ratio = 0; else if(ratio > 1) ratio = 1; else ratio = ratio;
	var idx = ratio * (colors.length - 1) | 0;
	var segLen = 1 / (colors.length - 1);
	var subRatio = (ratio - segLen * idx) / segLen;
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.interpolate(mt_deepnight_Color.intToRgb(colors[idx]),mt_deepnight_Color.intToRgb(colors[idx + 1]),subRatio));
};
mt_deepnight_Color.darken = function(c,ratio) {
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.interpolate({ r : c >> 16, g : c >> 8 & 255, b : c & 255},mt_deepnight_Color.BLACK,ratio));
};
mt_deepnight_Color.lighten = function(c,ratio) {
	return mt_deepnight_Color.rgbToInt(mt_deepnight_Color.interpolate({ r : c >> 16, g : c >> 8 & 255, b : c & 255},mt_deepnight_Color.WHITE,ratio));
};
mt_deepnight_Color.getPaletteAverage = function(pal) {
	if(pal.length < 0) return Reflect.copy(mt_deepnight_Color.BLACK);
	var c_r = 0;
	var c_g = 0;
	var c_b = 0;
	var _g = 0;
	while(_g < pal.length) {
		var p = pal[_g];
		++_g;
		c_r += p.r;
		c_g += p.g;
		c_b += p.b;
	}
	return { r : c_r / pal.length | 0, g : c_g / pal.length | 0, b : c_b / pal.length | 0};
};
mt_deepnight_Color.interpolateArrays = function(ary1,ary2,t) {
	var result = [];
	var _g1 = 0;
	var _g = ary1.length;
	while(_g1 < _g) {
		var i = _g1++;
		result[i] = ary1[i] + (ary2[i] - ary1[i]) * t;
	}
	return result;
};
var mt_js_ScrollBar = function(container,buttons,convertClassName) {
	if(buttons == null) buttons = false;
	this.container = container;
	this.buttons = buttons;
	this.padding = mt_js_ScrollBar.DEFAULT_PADDING;
	this.barBorder = mt_js_ScrollBar.DEFAULT_BORDER;
	if(convertClassName == null) convertClassName = function(s) {
		return s;
	};
	this.getClassName = convertClassName;
	this.init();
};
$hxClasses["mt.js.ScrollBar"] = mt_js_ScrollBar;
mt_js_ScrollBar.__name__ = ["mt","js","ScrollBar"];
mt_js_ScrollBar.j = function(q) {
	return js.JQuery(q);
};
mt_js_ScrollBar.mouseIsOver = function(e,q) {
	var p = q.offset();
	if(e.x < p.left || e.x > p.left + q.width()) return false;
	if(e.y < p.top || e.y > p.top + q.height()) return false;
	return true;
};
mt_js_ScrollBar.prototype = {
	check: function() {
		this.updateHeight();
		if(this.contentHeight > this.height + 2) this.showBar(); else this.hideBar();
	}
	,init: function() {
		var _g = this;
		this.content = this.container.children().wrapAll("<div class=\"" + this.getClassName("scrollContent") + "\"></div>").parent();
		this.content.data("mt.scroll",this);
		this.content = this.content.wrap("<div class=\"" + this.getClassName("scrollContentWrapper") + "\"></div>").parent();
		this.content.css({ overflow : "hidden"});
		var mh = this.container.css("max-height");
		var h = this.container.css("height");
		if(mh != null && mh != "") this.content.css("max-height",mh); else if(h != null && h != "") this.content.css("height",h);
		this.content.bind("scroll.mtscroll",$bind(this,this.onScroll));
		this.container.bind("mousewheel.mtscroll",function(e1) {
			_g.onWheel(e1.originalEvent.wheelDelta / 2,function() {
				e1.preventDefault();
				e1.stopPropagation();
			});
		});
		var onFFScroll = function(e) {
			if(mt_js_ScrollBar.mouseIsOver({ x : e.pageX, y : e.pageY},_g.container)) _g.onWheel(e.detail * -20,function() {
				e.preventDefault();
				e.stopPropagation();
			});
		};
		if(($_=window,$bind($_,$_.addEventListener)) != null) window.addEventListener("DOMMouseScroll",onFFScroll);
		this.check();
		var _g1 = 1;
		while(_g1 < 4) {
			var i = _g1++;
			haxe_Timer.delay($bind(this,this.check),i * 500);
		}
	}
	,updateHeight: function() {
		this.contentHeight = this.content[0].scrollHeight;
		this.height = this.container.height();
	}
	,showBar: function() {
		var _g = this;
		if(this.track == null) {
			this.track = mt_js_ScrollBar.j("<div class=\"" + this.getClassName("scrollTrack") + "\"></div>");
			this.content.before(this.track);
			this.bar = mt_js_ScrollBar.j("<div class=\"" + this.getClassName("scrollBar") + "\"><span/></div>").appendTo(this.track);
			this.sTop = mt_js_ScrollBar.j("<span class=\"" + this.getClassName("scrollTop") + "\"/>").appendTo(this.track);
			this.sBot = mt_js_ScrollBar.j("<span class=\"" + this.getClassName("scrollBot") + "\"/>").appendTo(this.track);
			this.bar.bind("mousedown.mtscroll",function(e) {
				var mask = mt_js_ScrollBar.j("<div style=\"position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 50;\"></div>");
				mt_js_ScrollBar.j("body").css({ '-moz-user-select' : "none", '-webkit-user-select' : "none", '-ms-user-select' : "none"}).prepend(mask);
				_g.bar.addClass("on");
				var ly = e.pageY;
				var win = mt_js_ScrollBar.j("body");
				win.bind("mousemove.mtscroll",(function($this) {
					var $r;
					var onmove = function(e1) {
						var y = e1.pageY;
						var d = ly - y;
						ly = y;
						_g.scrollDelta(Math.round(d * _g.contentHeight / _g.trackHeight));
						e1.preventDefault();
						e1.stopPropagation();
					};
					$r = onmove;
					return $r;
				}(this)));
				win.bind("mouseup.mtscroll",function(e2) {
					_g.bar.removeClass("on");
					win.unbind("mousemove.mtscroll");
					win.unbind("mouseup.mtscroll");
					mask.remove();
					mt_js_ScrollBar.j("body").css({ '-moz-user-select' : "", '-webkit-user-select' : "", '-ms-user-select' : ""}).focus();
				});
			});
			this.track.bind("click.mtscroll",function(e3) {
				var y1 = e3.pageY;
				var bp = _g.bar.offset().top;
				if(y1 < bp) _g.scrollDelta(_g.height); else if(y1 > bp + _g.bar.height()) _g.scrollDelta(-_g.height);
			});
		}
		var tm = this.track.width();
		this.track.css({ 'margin-left' : this.container.width() - tm});
		this.content.css({ 'margin-right' : tm});
		this.track.height(this.height);
		this.trackHeight = this.height - this.padding * 2 - this.barBorder * 2;
		this.trackTop = this.padding;
		if(this.buttons) {
			this.trackHeight -= this.sTop.height();
			this.trackTop += this.sTop.height();
			this.trackHeight -= this.sBot.height();
			this.sBot.css({ 'top' : this.height - this.sBot.height()});
		}
		this.bar.height(Math.round(this.height / this.contentHeight * this.trackHeight));
		this.onScroll(null);
	}
	,hideBar: function() {
		if(this.track == null) return;
		this.track.remove();
		this.track = null;
		this.content.css({ 'margin-right' : ""});
	}
	,onScroll: function(_) {
		var top = this.content.scrollTop();
		this.bar.css({ 'margin-top' : top / this.contentHeight * this.trackHeight + this.trackTop});
	}
	,scrollDelta: function(d) {
		var st = this.content.scrollTop();
		var maxScroll = this.contentHeight - this.height;
		var nst = st - d;
		if(nst < 0) nst = 0; else if(nst > maxScroll) nst = maxScroll;
		if(st != nst) {
			this.content.scrollTop(nst);
			return true;
		}
		return false;
	}
	,onWheel: function(delta,prevDefault) {
		if(this.scrollDelta(delta)) prevDefault();
	}
	,__class__: mt_js_ScrollBar
};
var mt_js_Twinoid = $hx_exports.mt.js.Twinoid = function() { };
$hxClasses["mt.js.Twinoid"] = mt_js_Twinoid;
mt_js_Twinoid.__name__ = ["mt","js","Twinoid"];
mt_js_Twinoid.call = function(method,args,callb) {
	if(mt_js_Twinoid.boot != null) {
		var o = mt_js_Twinoid.boot;
		if(HxOverrides.substr(method,0,3) == "fb.") {
			method = HxOverrides.substr(method,3,null);
			o = mt_js_Twinoid.boot.fb;
			if(o == null) return;
		}
		var m = Reflect.field(o,method);
		if(m == null) throw new js__$Boot_HaxeError("No such method '" + method + "'");
		var r = m.apply(o,args);
		if(callb != null) callb(r);
		return;
	}
	var calls;
	try {
		calls = window._tid_calls;
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		calls = null;
	}
	if(calls == null) {
		var t = new haxe_Timer(100);
		t.run = function() {
			var tid = null;
			try {
				tid = _tid;
			} catch( e1 ) {
				if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			}
			if(tid == null || !tid.isReady) return;
			mt_js_Twinoid.boot = tid;
			t.stop();
			var _g = 0;
			while(_g < calls.length) {
				var c = calls[_g];
				++_g;
				mt_js_Twinoid.call(c.m,c.a,c.c);
			}
			window._tid_calls = null;
		};
		calls = window._tid_calls = [];
	}
	calls.push({ m : method, a : args, c : callb});
};
mt_js_Twinoid.isConnected = function(proc) {
	mt_js_Twinoid.call("isConnected",[proc]);
};
mt_js_Twinoid.onLoad = function() {
	mt_js_Twinoid.call("onLoad",[]);
};
mt_js_Twinoid.quickNotice = function(msg,error) {
	mt_js_Twinoid.call("quickNotice",[msg,error]);
};
mt_js_Twinoid.notice = function(msg,error) {
	mt_js_Twinoid.call("notice",[msg,error]);
};
mt_js_Twinoid.lockBar = function() {
	mt_js_Twinoid.call("lockBar",[]);
};
mt_js_Twinoid.point = function(e,html) {
	mt_js_Twinoid.call("point",[e,html]);
};
mt_js_Twinoid.hidePointer = function() {
	mt_js_Twinoid.call("hidePointer",[]);
};
mt_js_Twinoid.onCssReady = function(cb) {
	mt_js_Twinoid.call("isCssReady",[],function(b) {
		if(b) cb(); else haxe_Timer.delay((function(f,cb1) {
			return function() {
				f(cb1);
				return;
			};
		})(mt_js_Twinoid.onCssReady,cb),100);
	});
};
mt_js_Twinoid.popImage = function(url,title) {
	mt_js_Twinoid.call("popImage",[url,title]);
};
mt_js_Twinoid.wallAutoShareUrl = function(url) {
	mt_js_Twinoid.call("wallAutoShareUrl",[url]);
};
mt_js_Twinoid.askCashFrame = function(params,onClose) {
	mt_js_Twinoid.call("askCashFrame",[params,onClose]);
};
mt_js_Twinoid.addLoadListener = function(callb) {
	mt_js_Twinoid.call("addLoadListener",[callb]);
};
mt_js_Twinoid.trackGlobalPageView = function(path) {
	try {
		mt_js_Twinoid.call("trackGlobalPageView",[path]);
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
	}
};
mt_js_Twinoid.trackSitePageView = function(path) {
	try {
		mt_js_Twinoid.call("trackSitePageView",[path]);
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
	}
};
mt_js_Twinoid.trackGlobalEvent = function(category,action,label) {
	try {
		mt_js_Twinoid.call("trackGlobalEvent",[category,action,label]);
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
	}
};
mt_js_Twinoid.trackSiteEvent = function(category,action,label) {
	try {
		mt_js_Twinoid.call("trackSiteEvent",[category,action,label]);
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
	}
};
var tid_Boot = function() {
	this.sendingStorage = false;
	this.onLoadListener = [];
	this.onEventNotifListener = [];
	this.userNameCache = new haxe_ds_IntMap();
	this.userCache = new haxe_ds_StringMap();
	this.infos = window.__tid;
	this.wsOnline = false;
	this.cornerClicks = { left : "", right : ""};
	this.local = this.infos.local;
	this.host = "twinoid.com";
	if(this.local) this.host = "local." + this.host; else if(this.infos.demo) this.host = "demo." + this.host;
	this.dataHost = "data." + this.host;
	if(this.infos.local || this.infos.demo) this.IMGUP = "//demo.imgup.motion-twin.com/"; else this.IMGUP = "https://imgup.motion-twin.com/";
	if(this.infos.fbApp != null) this.host = "fb." + this.host;
	this.store = js_Browser.getSessionStorage();
	this.initSessStorage();
	this.protocol = window.location.protocol;
	this.checkRef();
	this.initContact();
	this.infos.ch = this.contact.hash();
	var body = tid_Boot.j("body");
	var css;
	if(this.local && window.location.host != this.host) css = this.host + "/bar/css"; else css = this.dataHost + "/css/" + this.infos.ver + "/bar.css";
	tid_Boot.j("head").append("<link type=\"text/css\" rel=\"stylesheet\" href=\"//" + css + "\"/>");
	if(this.infos == null || this.infos.fbApp == null) body.prepend("<div id=\"tid_bar\" class=\"tid_barWrapper\" style=\"height:32px;background-color:#262a35\"/>"); else body.prepend("<div id=\"tid_bar\" style=\"display:none\"/>");
	tid_Boot.j("#tid_bar_down").remove();
	body.append("<div id=\"tid_bar_down\" class=\"tid_safe_bar_down\"/>");
	var n = tid_Boot.j("<div id=\"tid_noticeList\" style=\"display:none\">" + "<div class=\"tid_wrapper\"></div>" + "</div>");
	body.prepend(n);
	var n1 = tid_Boot.j("<div id=\"tid_baseNotice\" style=\"display:none\"> <div class=\"tid_black\"></div> " + "<div class=\"tid_wrapper\">" + "<div class=\"tid_box\"> <div class=\"tid_close\"></div> <div class=\"tid_content\"></div> </div>" + "</div>" + "</div>");
	n1.find(".tid_close").click($bind(this,this.hideNotice));
	body.prepend(n1);
	if(js.JQuery.browser.mozilla) body.addClass("tid_ff");
	if(js.JQuery.browser.msie) body.addClass("tid_ie");
	if(js.JQuery.browser.opera) body.addClass("tid_opera");
	if(js.JQuery.browser.webkit) body.addClass("tid_webkit");
	tid_Boot.j(window).resize($bind(this,this.onResize));
	this.onResize();
	if(Modernizr != null && Modernizr.touch) tid_Boot.j(window).scroll($bind(this,this.onResize));
	this.checkActivity();
	body.addClass("tid_v" + Std.parseInt(js.JQuery.browser.version));
	body.addClass("tid_lang_" + this.infos.lang);
	if(body.width() <= 1000) body.addClass("tid_narrow");
	if(this.store != null) {
		this.initBar(this.store.getItem("tid_bar"),false);
		this.initBarDown(this.store.getItem("tid_bar_down"));
	}
	this.barLoaded = false;
	haxe_Timer.delay($bind(this,this.init),1);
	haxe_Timer.delay($bind(this,this.checkBarActive),5000);
	try {
		this.session = haxe_Unserializer.run(this.store.getItem(this.savedSessCookie()));
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		this.session = null;
	}
	tid_Boot.j("#tid_bar .tid_search a.tid_submit").live("click",function(_) {
		tid_Boot.j("#tid_bar .tid_search").submit();
	});
	var tf = tid_Boot.j("#tid_bar .tid_search .tid_field");
	tf.live("click",$bind(this,this.onFocusDefaultField));
	tf.live("focus",$bind(this,this.onFocusDefaultField));
	tf.live("blur",$bind(this,this.onBlurDefaultField));
	var w = window;
	if($bind(w,w.addEventListener) != null) w.addEventListener("message",$bind(this,this.onMessage),false); else if(w.attachEvent != null) w.attachEvent("onmessage",$bind(this,this.onMessage));
	this.ga = new tid_GoogleAnalytics();
	this.tga = new tid_GoogleAnalytics();
	this.xsTags = null;
	if(this.infos.fbApp != null) this.fb = new tid_Facebook(this);
};
$hxClasses["tid.Boot"] = tid_Boot;
tid_Boot.__name__ = ["tid","Boot"];
tid_Boot.input = function(name) {
	return tid_Boot.j("input[name=\"" + name + "\"]");
};
tid_Boot.main = function() {
	window._tid = new tid_Boot();
	tid_Editor.init();
};
tid_Boot.mouseIsOver = function(e,q) {
	var p = q.offset();
	if(e.x < p.left || e.x > p.left + q.width()) return false;
	if(e.y < p.top || e.y > p.top + q.height()) return false;
	return true;
};
tid_Boot.j = function(q) {
	return js.JQuery(q);
};
tid_Boot.prototype = {
	isCssReady: function() {
		return tid_Boot.j("#tid_cssCheck").css("position") == "absolute";
	}
	,waitCss: function(f,waitLoad) {
		if(waitLoad == null) waitLoad = false;
		var _g = this;
		var f2;
		var f21 = null;
		f21 = function() {
			if(_g.isCssReady()) f(); else haxe_Timer.delay(f21,200);
		};
		f2 = f21;
		if(!waitLoad) f2(); else tid_Boot.j(window).load(function(e) {
			f2();
		});
	}
	,callInPopup: function(s) {
		var p = tid_Boot.j("#tid_popup iframe");
		if(p.length > 0) p[0].contentWindow.postMessage(s,this.protocol + "//" + this.host);
	}
	,popupReady: function() {
		if(this.isSmall) this.callInPopup("$('body').addClass('fullFrame');");
	}
	,isActive: function() {
		if(this.lastActivity == null) return true;
		return new Date().getTime() - this.lastActivity.getTime() < 420000.;
	}
	,checkActivity: function() {
		var _g = this;
		this.lastActivity = new Date();
		haxe_Timer.delay(function() {
			$(window).on(tid_Boot.ACTIVITY_EVENTS,function(_) {
				$(window).off(tid_Boot.ACTIVITY_EVENTS);
				_g.checkActivity();
			});
		},15000);
	}
	,onResize: function(e) {
		var win = tid_Boot.j(window);
		var w = win.innerWidth();
		if(!this.isSmall && w <= 650) {
			this.isSmall = true;
			this.callInPopup("$('body').addClass('fullFrame');");
		} else if(this.isSmall && w > 650) {
			this.isSmall = false;
			this.callInPopup("$('body').removeClass('fullFrame');");
		}
		var op = tid_Boot.j(".tid_sidePanel.tid_open");
		if(op.length > 0) {
			var c = op.find(".tid_sidePanelScrollable");
			if(c.length > 0) {
				var h = win.height();
				c.height(h - c.position().top);
			}
		}
	}
	,onFocusDefaultField: function(evt) {
		var e = tid_Boot.j(evt.target);
		if(e.val() == e.attr("tid_default") || e.val() == e.attr("tid_default")) {
			e.removeClass("tid_default");
			e.val("");
		}
	}
	,onBlurDefaultField: function(evt) {
		var e = tid_Boot.j(evt.target);
		if(e.val() == "") {
			e.addClass("tid_default");
			var def = e.attr("tid_default");
			if(def == null) def = e.attr("tid_default");
			e.val(def);
		}
	}
	,lockUnload: function() {
		var _g = this;
		tid_Boot.j(window).bind("beforeunload",function(e) {
			var _g1 = _g.infos.lang;
			switch(_g1) {
			case "fr":
				return "Etes-vous sûr de vouloir quitter la page ? Des données risquent de ne pas être enregistrées.";
			default:
				return "Are you sure?";
			}
		});
	}
	,unlockUnload: function() {
		tid_Boot.j(window).unbind("beforeunload");
	}
	,onMessage: function(e) {
		if(e.origin != "http://" + this.host && e.origin != "https://" + this.host && e.origin != "https://" + this.cashHost()) return;
		var _g = e.data;
		switch(_g) {
		case "popupReady":
			this.popupReady();
			break;
		case "hidePopup":
			this.hidePopup();
			break;
		case "onLoad":
			this.onLoad();
			break;
		case "reloadBar":
			this.reloadBar();
			break;
		case "hideFloatFrame":
			this.hideFloatFrame();
			break;
		case "forumReload":
			if(this.forum != null) this.forum.reload();
			break;
		case "forcedisconnect":
			this.disconnect(true);
			break;
		default:
			var i = e.data.indexOf(":");
			if(i > 0) {
				var a = HxOverrides.substr(e.data,0,i);
				var p = HxOverrides.substr(e.data,i + 1,null);
				switch(a) {
				case "exec":
					eval(p);
					break;
				case "verifyToken":
					this.onVerifyToken(p);
					break;
				case "unlockForm":
					this.unlockForm(tid_Boot.j("#" + p));
					break;
				case "ev":
					var a1 = p.split(":");
					var isForum = a1[1] == "forum";
					if(isForum && this.forum != null) this.forum.loadRight("thread/" + a1[0]); else this["goto"]("/ev/" + a1[0]);
					break;
				}
			}
		}
	}
	,onLoad: function(sub) {
		this.checkModules(sub);
		this.checkUsers(sub);
		this.checkInputs(sub);
		this.checkTips(sub);
		this.checkEditorContents(sub);
		this.checkXSTags(sub);
		this.initForum();
		this.initGroup();
		this.updatePageTitle();
		var _g = 0;
		var _g1 = this.onLoadListener;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l();
		}
	}
	,setXSTags: function(xsTags) {
		this.xsTags = xsTags;
	}
	,hasXSTags: function(tag) {
		return this.xsTags != null && HxOverrides.indexOf(this.xsTags,tag,0) >= 0;
	}
	,addLoadListener: function(f) {
		this.onLoadListener.push(f);
	}
	,updatePageTitle: function() {
		if(!tid_Boot.j("#tid_bar")["is"](":visible")) return;
		var n = Std.parseInt(tid_Boot.j("#tid_newsCount").html()) + Std.parseInt(tid_Boot.j("#tid_userNotifCount").html());
		var t = window.document.title;
		if(n > 0) {
			if(t.indexOf("(") == 0) {
				var pos = t.indexOf(")") + 1;
				t = HxOverrides.substr(t,pos,null);
			}
			window.document.title = "(" + n + ") " + t;
		} else if(t.indexOf("(") == 0) {
			var pos1 = t.indexOf(")") + 1;
			window.document.title = HxOverrides.substr(t,pos1,null);
		}
	}
	,checkBarActive: function() {
		if(!this.barLoaded && this.infos.infos == "n") {
			var texts;
			var _g = this.infos.lang;
			switch(_g) {
			case "fr":
				texts = ["Identifiant","Mot de Passe","Twinoid indisponible"];
				break;
			case "es":
				texts = ["Cuenta","Contraseña","Twinoid is not available"];
				break;
			case "de":
				texts = ["Mein Account","Passwort","Twinoid is not available"];
				break;
			default:
				texts = ["Login","Password","Twinoid is not available"];
			}
			tid_Boot.j("#tid_bar .tid_container").html("<form method=\"POST\" class=\"tid_failSafe\" action=\"/tid/safeLogin\">" + "<span>" + texts[2] + "</span>" + "<label>" + texts[0] + "</label><input type=\"text\" class=\"tid_field\" name=\"tidUser\"/>" + "<label>" + texts[1] + "</label><input class=\"tid_field\" name=\"tidPass\" type=\"password\"/>" + "<input class=\"tid_submit\" type=\"submit\" value=\"OK\"/></form>");
			this.barLoaded = true;
		}
	}
	,initUserSearch: function(e) {
		var name = e.attr("name");
		if(name == null || StringTools.endsWith(name,"_name")) return;
		new tid_Search(e,this);
	}
	,fillSearch: function(name,search) {
		return function(html) {
			throw new js__$Boot_HaxeError("fillSearch");
		};
	}
	,fillSearchContacts: function(name) {
		return function(html) {
			throw new js__$Boot_HaxeError("fillSearchContacts");
		};
	}
	,setUserSearchUrl: function(url) {
		this.uSearchUrl = url;
		tid_Boot.j("#tid_bar .tid_search form input[name=customUrl]").val(this.uSearchUrl);
	}
	,checkRef: function() {
		var params = haxe_web_Request.getParams();
		if(this.infos.ref == null) {
			this.infos.ref = __map_reserved.ref != null?params.getReserved("ref"):params.h["ref"];
			if(this.infos.ref == null && this.store != null) this.infos.ref = this.store.getItem("ref");
		}
		if(this.infos.refid == null) {
			this.infos.refid = Std.parseInt(__map_reserved.refid != null?params.getReserved("refid"):params.h["refid"]);
			if(this.infos.refid == null && this.store != null) this.infos.refid = Std.parseInt(this.store.getItem("refid"));
		}
		if(this.infos.ref != null && this.store != null) this.store.setItem("ref",this.infos.ref);
		if(this.infos.refid != null && this.store != null) this.store.setItem("refid","" + this.infos.refid);
	}
	,init: function() {
		this.loadBar(false);
		var t = new haxe_Timer(300000);
		t.run = $bind(this,this.reloadBar);
		var url = window.location.search;
		if(url.indexOf("tid_create=1") >= 0) this.askCreate(); else if(url.indexOf("tid_assoc=1") >= 0) this.askAssoc(); else if(url.indexOf("tid_login=1") >= 0) this.askLogin(); else if(url.indexOf("tid_play=1") >= 0) this.askPlay(); else if(url.indexOf("tid_forget_pass=1") >= 0) this.askForgetPass(); else if(url.indexOf("tid_track=") >= 0) {
			var r = new EReg("tid_track=([-A-Za-z0-9_]+)","");
			if(!r.match(url)) return;
			var tag = r.matched(1);
			var loctk = js_Cookie.get("loctk");
			if(loctk == null || !(function($this) {
				var $r;
				var _this = loctk.split("@");
				$r = HxOverrides.remove(_this,tag);
				return $r;
			}(this))) {
				if(loctk == null) loctk = tag; else loctk = loctk + "@" + tag;
				js_Cookie.set("loctk",loctk,8640000,"/","." + this.topDomain());
				this.loadJS("/track/" + tag,{ redir : ""});
			}
		}
	}
	,loadBar: function(reload) {
		var p = Reflect.copy(this.infos);
		try {
			p.tz = new Date().getTimezoneOffset();
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
		}
		if(reload) p.reload = 1;
		if(!this.isActive()) p.inactive = 1;
		try {
			var fv = deconcept.SWFObjectUtil.getPlayerVersion();
			if(fv != null && fv.major != null && fv.major != 0) p.fver = fv.major + "." + fv.minor + "." + fv.rev;
		} catch( e1 ) {
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
		}
		p.jsm = 1;
		p.url = this.getCurrentURL();
		this.barLoading = true;
		this.loadJS("/bar/view",p);
	}
	,reloadBar: function() {
		if(this.barLoading) return;
		this.loadBar(true);
	}
	,onEventNotif: function(eventId) {
		this.reloadBar();
		var _g = 0;
		var _g1 = this.onEventNotifListener;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			f(eventId);
		}
	}
	,onEventTicker: function(data) {
		var html = "<strong><img src=\"" + data.site.icon + "\"/> " + data.site.name + "</strong> " + data.text;
		this.quickNotice(html,false,function() {
			window.location.assign(data.url);
		});
	}
	,addEventNotifListener: function(f) {
		this.onEventNotifListener.push(f);
	}
	,onSiteNotif: function(host,jsData) {
		if(host != window.location.host) return;
		eval(jsData);
	}
	,showTip: function(e,txt) {
		this.createBubbleTip(e,"tid_simpleTip",txt,true);
	}
	,hideTip: function() {
		tid_Boot.j("#tid_simpleTip").remove();
	}
	,point: function(e,html) {
		var _g = this;
		if(this.pointerRecalTimer != null) this.pointerRecalTimer.stop();
		this.createBubbleTip(e,"tid_simplePointer",html,false);
		this.pointerRecalTimer = new haxe_Timer(1000);
		this.pointerRecalTimer.run = function() {
			var ptr = tid_Boot.j("#tid_simplePointer");
			if(ptr.length == 0) {
				_g.pointerRecalTimer.stop();
				_g.pointerRecalTimer = null;
			} else {
				var of = e.offset();
				ptr.css({ top : of.top - ptr.height() - 7 - 5, left : e.width() * 0.5 + of.left - ptr.width() * 0.5});
			}
		};
	}
	,hidePointer: function() {
		tid_Boot.j("#tid_simplePointer").remove();
	}
	,createBubbleTip: function(e,id,html,hideOnOver) {
		tid_Boot.j("#" + id).remove();
		if(e == null || e.length == 0) return;
		html = StringTools.replace(html,"\\n","<br/>");
		if(!this.isCssReady()) {
			haxe_Timer.delay((function(f,e1,id1,a1,a2) {
				return function() {
					f(e1,id1,a1,a2);
				};
			})($bind(this,this.createBubbleTip),e,id,html,hideOnOver),400);
			return;
		}
		var ptr = tid_Boot.j("<div id=\"" + id + "\"><img class=\"tid_arrow\" alt=\"\"/><div class=\"tid_inner\">" + html + "</div></div>");
		tid_Boot.j("body").prepend(ptr);
		var of = e.offset();
		var w = e.outerWidth();
		var ptrWidth = ptr.width();
		if(hideOnOver) ptr.mouseover(function(_) {
			tid_Boot.j("#" + id).remove();
		});
		var y = of.top - ptr.height() - 7;
		var left = w * 0.5 + of.left - ptrWidth * 0.5;
		var bw = Math.max(tid_Boot.j("body").width(),of.left + w);
		var aLeft = ptrWidth * 0.5 - 5;
		var aTop = ptr.height() - 1;
		if(left < 0) {
			aLeft += left;
			left = 0;
		} else if(left + ptrWidth > bw) {
			aLeft += left + ptrWidth - bw;
			left = bw - ptrWidth;
		}
		var arrow = "simpleTipArrow.png";
		if(y < 5) {
			y = of.top + e.outerHeight() + 7;
			aTop = -6;
			arrow = "simpleTipArrowUp.png";
		}
		ptr.find(".tid_arrow").attr("src","//" + this.dataHost + "/img/design/" + arrow).css({ marginLeft : aLeft, marginTop : aTop});
		ptr.css("opacity","0.1").css({ top : y - 5, left : left}).animate({ opacity : 1, top : y},200,"linear");
	}
	,checkEditorContents: function(sub) {
		var all;
		if(sub == null) all = tid_Boot.j(".tid_editorContent"); else all = sub.find(".tid_editorContent");
		var $it0 = (function($this) {
			var $r;
			var _this = all.not(".tid_parsed");
			$r = (_this.iterator)();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var e = $it0.next();
			e.addClass("tid_parsed");
			this.fitImages(e);
			if(Modernizr.touch) e.find(".tid_spoil").bind("mouseover.spoil",function(_) {
				js.JQuery(this).addClass("tid_hover");
			}).bind("mouseout.spoil",function(_1) {
				js.JQuery(this).removeClass("tid_hover");
			});
		}
	}
	,checkTips: function(sub) {
		var _g = this;
		this.hideTip();
		var q;
		if(sub == null) q = tid_Boot.j(".tid_tip"); else q = sub.find(".tid_tip");
		var $it0 = (function($this) {
			var $r;
			var _this = q.not(".tid_parsed");
			$r = (_this.iterator)();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var e = $it0.next();
			var e1 = [e];
			e1[0].addClass("tid_parsed");
			if(e1[0].attr("title") != null) {
				var txt = [e1[0].attr("title")];
				e1[0].removeAttr("title");
				e1[0].hover((function(txt,e1) {
					return function(_) {
						_g.showTip(e1[0],txt[0]);
					};
				})(txt,e1),(function() {
					return function(_1) {
						_g.hideTip();
					};
				})());
				e1[0].click((function() {
					return function(_2) {
						_g.hideTip();
					};
				})());
			}
		}
	}
	,checkXSTags: function(sub) {
		var q;
		if(sub == null) q = tid_Boot.j(".tid_condXSTag"); else q = sub.find(".tid_condXSTag");
		var $it0 = (q.iterator)();
		while( $it0.hasNext() ) {
			var e = $it0.next();
			console.log(e);
			if(this.xsTags == null) {
				e.hide();
				continue;
			}
			var t = e.data("xstag");
			if(t == null) {
				if(this.infos.local) console.log("missing data-xstag attribute");
				continue;
			}
			var not = HxOverrides.cca(t,0) == 33;
			if(not) t = HxOverrides.substr(t,1,null);
			if(this.hasXSTags(t) == !not) e.show(); else e.hide();
		}
	}
	,checkInputs: function(sub) {
		var q;
		if(sub == null) q = tid_Boot.j("input.tid_userSearch"); else q = sub.find("input.tid_userSearch");
		var $it0 = (function($this) {
			var $r;
			var _this = q.not("input.tid_parsed");
			$r = (_this.iterator)();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var e = $it0.next();
			if(e.width() == 0 && e.height() == 0) continue;
			e.addClass("tid_parsed");
			new tid_Search(e,this);
		}
		if(sub == null) q = tid_Boot.j("input.tid_groupSearch"); else q = sub.find("input.tid_groupSearch");
		var $it1 = (function($this) {
			var $r;
			var _this1 = q.not("input.tid_parsed");
			$r = (_this1.iterator)();
			return $r;
		}(this));
		while( $it1.hasNext() ) {
			var e1 = $it1.next();
			e1.addClass("tid_parsed");
			new tid_GroupSearch(e1,this);
		}
		if(sub == null) q = tid_Boot.j("input[type=text]"); else q = sub.find("input[type=text]");
		var $it2 = (function($this) {
			var $r;
			var _this2 = q.not(".tid_defParsed");
			$r = (_this2.iterator)();
			return $r;
		}(this));
		while( $it2.hasNext() ) {
			var e2 = $it2.next();
			e2.addClass("tid_defParsed");
			if(e2.attr("tid_default") != null) {
				if(e2.val() == "") {
					e2.addClass("tid_default");
					e2.val(e2.attr("tid_default"));
				}
				e2.click($bind(this,this.onFocusDefaultField));
				e2.focus($bind(this,this.onFocusDefaultField));
				e2.blur($bind(this,this.onBlurDefaultField));
			}
		}
	}
	,checkUsers: function(sub) {
		var _g = this;
		var q;
		if(sub == null) q = tid_Boot.j(".tid_user"); else q = sub.find(".tid_user");
		var reqNames = [];
		var $it0 = (function($this) {
			var $r;
			var _this = q.not(".tid_parsed");
			$r = (_this.iterator)();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var e = $it0.next();
			var suid = e.attr("tid_id");
			if(suid == null) suid = e.attr("tid:id");
			if(suid == null) suid = "";
			if(HxOverrides.substr(suid,0,4) == "tmp_") continue;
			if(suid == "null") e.addClass("tid_userSystem");
			if(suid != null) {
				if(e.attr("tid_menu") != "0" && e.attr("tid:menu") != "0") e.click(function(event) {
					event.stopPropagation();
					if(event.which != 2) {
						_g.openUserMenu(js.JQuery(this));
						event.preventDefault();
					}
				});
				e.addClass("tid_user_" + suid);
			}
			if(e.attr("tid_bg") == "1" || e.attr("tid:bg") == "1") e.addClass("tid_userBg"); else e.addClass("tid_userNoBg");
			if(e.attr("tid_icon") == "0") e.addClass("tid_userNoIcon");
			var av = e.attr("tid_avatar");
			if(av == null) av = e.attr("tid:avatar");
			if(av != null) {
				if(av.length == 0 || av == "null") e.prepend("<span class=\"tid_ulaContainer\"></span>"); else e.prepend("<span class=\"tid_ulaContainer\"><img src=\"" + av + "\" alt=\"?\" class=\"tid_ula\"/></span>");
				e.addClass("tid_userWithAvatar");
			}
			var uid = Std.parseInt(suid);
			if(uid != null && e.attr("tid_auto") == "1") {
				if(this.userNameCache.h.hasOwnProperty(uid)) e.text(this.userNameCache.h[uid]); else {
					HxOverrides.remove(reqNames,uid);
					reqNames.push(uid);
				}
			}
			var friend = uid == this.session.tid || this.contact.has(uid);
			if(friend) e.addClass("tid_userFriend"); else e.addClass("tid_userUnknown");
			if(e.hasClass("tid_userButton")) e.html("<span class='tid_button' href='#' onclick='return false'><img src='http://" + this.host + "/img/icons/twinoid.png'/></a>");
			e.addClass("tid_parsed");
		}
		if(reqNames.length > 0) this.loadJS("/mod/usersName",{ ids : reqNames.join(",")});
	}
	,updateUserSheets: function(q) {
		if(q == null) q = tid_Boot.j(".tid_userSheet");
		var $it0 = (q.iterator)();
		while( $it0.hasNext() ) {
			var e = $it0.next();
			if(this.contact.has(Std.parseInt(e.attr("tid_id")))) {
				e.find(".tid_userSheetBg").removeClass("tid_isUnknown").addClass("tid_isContact");
				e.find(".tid_contactButton.tid_isContact").css("display","block");
				e.find(".tid_contactButton.tid_isUnknown").hide();
			} else {
				e.find(".tid_userSheetBg").removeClass("tid_isContact").addClass("tid_isUnknown");
				e.find(".tid_contactButton.tid_isContact").hide();
				e.find(".tid_contactButton.tid_isUnknown").css("display","block");
			}
		}
	}
	,getUserName: function(id) {
		if(this.userNameCache.h.hasOwnProperty(id)) return this.userNameCache.h[id];
		var $it0 = (function($this) {
			var $r;
			var _this = tid_Boot.j(".tid_user[tid_id=" + id + "]");
			$r = (_this.iterator)();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var q = $it0.next();
			var name = q.text();
			if(name != "...") {
				this.userNameCache.h[id] = name;
				return name;
			}
		}
		haxe_Timer.delay((function(f,id1) {
			return function() {
				f(id1);
			};
		})($bind(this,this.delayedGetUserName),id),1000);
		return "...";
	}
	,delayedGetUserName: function(id) {
		var q = tid_Boot.j(".tid_user[tid_id=" + id + "]");
		if(q.length == 0) return;
		if(this.userNameCache.h.hasOwnProperty(id)) {
			q.text(this.userNameCache.h[id]);
			return;
		}
		this.userNameCache.h[id] = "...";
		this.loadJS("/mod/userName",{ id : id});
	}
	,setUserName: function(id,name) {
		this.userNameCache.h[id] = name;
		tid_Boot.j(".tid_user[tid_id=" + id + "]").text(name);
		this.onLoad();
	}
	,getUserByName: function(name) {
		if(this.userCache.exists(name)) return this.userCache.get(name);
		haxe_Timer.delay((function(f,a1) {
			return function() {
				f(a1);
			};
		})($bind(this,this.delayedGetUserByName),name),1000);
		var t = { id : "tmp_" + name, name : name};
		this.userCache.set(name,t);
		return t;
	}
	,delayedGetUserByName: function(name) {
		var q = tid_Boot.j(".tid_user[tid_id=tmp_" + name + "]");
		if(q.length == 0) {
			this.userCache.remove(name);
			return;
		}
		if(this.userCache.exists(name) && this.userCache.get(name).id != "tmp_" + name) {
			this.setUserInfos(name,this.userCache.get(name));
			return;
		}
		this.loadJS("/mod/userByName",{ name : name});
	}
	,setUserInfos: function(name,o) {
		this.userCache.set(name,o);
		if(o == null) tid_Boot.j(".tid_user[tid_id=tmp_" + name + "]").replaceWith("@" + name); else tid_Boot.j(".tid_user[tid_id=tmp_" + name + "]").text(o.name).attr("tid_id",o.id == null?"null":"" + o.id);
		this.onLoad();
	}
	,openUserMenu: function(q) {
		var _g = this;
		tid_Boot.j("#tid_userMenu").remove();
		var m = tid_Boot.j("<div id=\"tid_userMenu\"><div class=\"tid_noclick\"/><div class=\"tid_content\"><div class=\"tid_reload\"></div></div></div>");
		tid_Boot.j("body").prepend(m);
		var content = m.find(".tid_content");
		content.hide().fadeIn();
		m.find(".tid_noclick").click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			_g.closeUserMenu();
		});
		var o = q.offset();
		var left = o.left;
		var mw = content.width();
		var ww = tid_Boot.j(window).width() - 24;
		if(left + mw > ww) left = ww - mw;
		tid_Boot.j("#tid_userMenu").css({ background : "red", marginLeft : left + "px", marginTop : o.top + q.height() + "px"});
		var o1 = { };
		var i = tid_Boot.j("#tidHost");
		if(i.length == 1 && i.val() != this.host) o1.oriHost = i.val();
		var uid = q.attr("tid_id");
		if(uid == null) uid = q.attr("tid:id");
		this.loadModule(q,"/mod/userMenu/" + uid,o1);
	}
	,initFilterer: function(inputQuery,listQuery) {
		var input = tid_Boot.j(inputQuery);
		var old = input.val();
		tid_Boot.j(".tid_filtererIcon").remove();
		var icon = tid_Boot.j("<img class=\"tid_filtererIcon\" src=\"http://" + this.host + "/img/icons/remove.png\" alt=\"x\"/>");
		icon.css("visibility","hidden");
		input.after(icon);
		input.attr("autocomplete","off");
		var resetFilter = function() {
			old = "";
			icon.css("visibility","hidden");
			tid_Boot.j(listQuery).filter("[tid_value]:hidden").show();
		};
		var filter = function(s) {
			if(s.length <= 1) return;
			var elems = tid_Boot.j(listQuery).filter("[tid_value]:visible");
			s = StringTools.trim(s.toLowerCase());
			icon.css("visibility","visible");
			var $it0 = (elems.iterator)();
			while( $it0.hasNext() ) {
				var e = $it0.next();
				if(e.attr("tid_valueLow") == null) e.attr("tid_valueLow",e.attr("tid_value").toLowerCase());
				if(e.attr("tid_valueLow").indexOf(s) >= 0) e.filter(":hidden").show(); else e.filter(":visible").hide();
			}
		};
		icon.unbind("click.filterer");
		input.unbind("keyup.filterer");
		input.unbind("change.filterer");
		icon.bind("click.filterer",function(_1) {
			input.val("");
			input.focus();
			icon.hide();
			resetFilter();
		});
		var startFilter = function(_) {
			var v = input.val();
			if(old.length > v.length) resetFilter();
			if(old != v) filter(v);
			old = v;
		};
		input.bind("keyup.filterer",startFilter);
		input.bind("change.filterer",startFilter);
	}
	,stopFollow: function(ev,q,id) {
		if($bind(ev,ev.preventDefault) != null) ev.preventDefault();
		this.stopEvent(ev);
		q.fadeOut();
		this.loadModule(q,"/mod/stopFollow/" + id,{ });
	}
	,stopFollowRequests: function(ev,id) {
		if($bind(ev,ev.preventDefault) != null) ev.preventDefault();
		this.stopEvent(ev);
		this.openPopup("");
		this.loadJS("/mod/stopFollow/" + id,{ });
	}
	,wallFollow: function(q,id,b) {
		q.hide().parent().find(".tid_follow_" + (b == null?"null":"" + b)).show();
		this.loadModule(q,"/mod/wall/follow/" + id,{ b : b});
		return false;
	}
	,wallDelPost: function(q,id) {
		var p = q.parents(".tid_wallEvent");
		this.loadModule(p,"/mod/wall/delete/" + id,{ });
		p.fadeOut(1000,function() {
			p.remove();
		});
	}
	,wallHideComment: function(q,id,idx) {
		var p = q.parents(".tid_comment");
		this.loadModule(p,"/mod/wall/commentHide/" + id + "/" + idx,{ });
		p.fadeOut(1000,function() {
			p.remove();
		});
		var c = p.parents(".tid_wallEvent").find(".tid_comCount");
		c.html(Std.string(Std.parseInt(c.html()) - 1));
	}
	,wallAutoShareUrl: function(modUrl) {
		var s = window.location.search;
		if(s == null || s.length == 0) return;
		var raw = HxOverrides.substr(s,1,null).split(";");
		var params = new haxe_ds_StringMap();
		var _g = 0;
		while(_g < raw.length) {
			var p = raw[_g];
			++_g;
			if(p.indexOf("=") > 0) {
				var key = p.split("=")[0];
				var value = p.split("=")[1];
				if(__map_reserved[key] != null) params.setReserved(key,value); else params.h[key] = value;
			}
		}
		if(__map_reserved.t != null?params.existsReserved("t"):params.h.hasOwnProperty("t")) {
			this.loadModule(tid_Boot.j("#tid_newPostTarget"),modUrl,{ draft : StringTools.urlDecode(__map_reserved.t != null?params.getReserved("t"):params.h["t"])});
			tid_Boot.j(".tid_twinoidWall textarea.tid_fake").remove();
		}
	}
	,onWallPost: function() {
		var s = window.location.search;
		if(s == null) s = "";
		var raw = HxOverrides.substr(s,1,null).split(";");
		var params = new haxe_ds_StringMap();
		var _g = 0;
		while(_g < raw.length) {
			var p = raw[_g];
			++_g;
			if(p.indexOf("=") > 0) {
				var key = p.split("=")[0];
				var value = p.split("=")[1];
				if(__map_reserved[key] != null) params.setReserved(key,value); else params.h[key] = value;
			}
		}
		if(__map_reserved.t != null?params.existsReserved("t"):params.h.hasOwnProperty("t")) window.location.search = ""; else this.invalidateParentModule(tid_Boot.j(".tid_twinoidWall"));
	}
	,initForwardPost: function() {
		if(this.isTwinoid() || tid_Boot.j("#tid_forwardPost").length > 0) return;
		tid_Boot.j("<iframe id=\"tid_forwardPost\" scrolling=\"no\" frameborder=\"0\" allowTransparency=\"true\" class=\"tid_frame\" src=\"" + this.makeUrl("/forwardPost",{ }) + "\"></iframe>").appendTo(window.document.body);
	}
	,sendForwardModule: function(form) {
		if(form.attr("action") == null) {
			var e = js.JQuery(form).parents(".tid_module").first();
			if(e.length == 0) throw new js__$Boot_HaxeError("action outside module");
			var act = this.makeUrl(e.data("mod-url"),e.data("mod-params"));
			form.attr("action",act);
		}
		this.sendForward(form);
	}
	,sendForward: function(form) {
		if(form.data("lock") == true) return;
		this.lockForm(form);
		try {
			var o = { url : form.attr("action"), params : form.serializeArray(), id : form.attr("id")};
			var s = haxe_Serializer.run(o);
			if(this.isTwinoid()) window._.forwardPost(s); else {
				if(js.JQuery.browser.msie && Std.parseInt(js.JQuery.browser.version) <= 7) js_Browser.alert("Error: Please ugrade your browser.");
				tid_Boot.j("#tid_forwardPost")[0].contentWindow.postMessage(s,"*");
			}
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
		}
	}
	,lockForm: function(form) {
		this.uniqueId(form);
		form.data("lock",true);
		form.find("[type=submit]").attr("disabled","disabled").addClass("tid_disabled");
	}
	,unlockForm: function(form) {
		form.data("lock",false);
		form.find("[type=submit]").removeAttr("disabled").removeClass("tid_disabled");
	}
	,fillUserMenu: function(id) {
		var _g = this;
		return function(html) {
			var e = tid_Boot.j("#tid_userMenu .tid_content").html(_g.addNamespace(html,"tid_")).addClass("tid_modinit");
			var lc = e.find(".tid_links .tid_siteLinks");
			var $it0 = (function($this) {
				var $r;
				var _this = tid_Boot.j("#" + id).find("a,.tid_extra");
				$r = (_this.iterator)();
				return $r;
			}(this));
			while( $it0.hasNext() ) {
				var link = $it0.next();
				var l = link.clone();
				if(l[0].nodeName.toString() != "A" && l.attr("href") != null) l = l.wrap("<a>").parent().attr("href",l.attr("href"));
				lc.append(l);
			}
			var dc = e.find("div.tid_site_div");
			var $it1 = (function($this) {
				var $r;
				var _this1 = tid_Boot.j("#" + id).find(".tid_extraDiv");
				$r = (_this1.iterator)();
				return $r;
			}(this));
			while( $it1.hasNext() ) {
				var div = $it1.next();
				div.clone().appendTo(dc);
			}
			e.find("a").click(function(_) {
				_g.closeUserMenu();
			});
			_g.onLoad();
		};
	}
	,closeUserMenu: function() {
		tid_Boot.j("#tid_userMenu").remove();
	}
	,checkModules: function(sub) {
		var q;
		if(sub == null) q = tid_Boot.j(".tid_module"); else q = sub.find(".tid_module");
		var $it0 = (function($this) {
			var $r;
			var _this = q.not(".tid_moduleLoading");
			$r = (_this.iterator)();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var e = $it0.next();
			var pjs = e[0].ondblclick;
			e.addClass("tid_moduleLoading");
			if(pjs == null) continue;
			var p = null;
			try {
				p = pjs();
			} catch( e1 ) {
				if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
				return;
			}
			var url = p.url;
			Reflect.deleteField(p,"url");
			this.loadModule(e,url,p,true);
		}
	}
	,uniqueId: function(e) {
		var id = e.attr("id");
		if(id == null || id == "") {
			do id = "tid_" + tid_Boot.UID++; while(tid_Boot.j("#" + id).length > 0);
			e.attr("id",id);
		}
		return id;
	}
	,loadModule: function(e,url,params,init) {
		var id = this.uniqueId(e);
		e.data("mod-url",url);
		e.data("mod-params",params);
		if(init && e.hasClass("tid_modinit")) return;
		params._id = id;
		if(StringTools.trim(e.html()).length == 0) e.prepend(this.loadingHTML());
		this.loadJS(url,params);
	}
	,loadingHTML: function() {
		var txt;
		var _g = this.infos.lang;
		switch(_g) {
		case "fr":
			txt = "Chargement...";
			break;
		case "es":
			txt = "Cargando...";
			break;
		default:
			txt = "Loading...";
		}
		return "<div class=\"tid_loading\"><img src=\"//" + this.dataHost + "/img/loading.gif\"/> " + txt + "</div>";
	}
	,newIconHTML: function() {
		var txt;
		var _g = this.infos.lang;
		switch(_g) {
		case "fr":
			txt = "Nouveau !";
			break;
		case "es":
			txt = "¡Nuevo!";
			break;
		case "de":
			txt = "Neu!";
			break;
		default:
			txt = "New!";
		}
		return "<div class=\"tid_newIcon\" title=\"" + txt + "\"></div>";
	}
	,trackOut: function() {
		var r = new haxe_Http("http://" + this.host + "/track/out?redir=");
		r.request(false);
	}
	,stopGif: function() {
		var reg = new EReg("^(?!data:).*\\.gif","i");
		var $it0 = (function($this) {
			var $r;
			var _this = tid_Boot.j("img");
			$r = (_this.iterator)();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var img = $it0.next();
			if(!reg.match(img.attr("src"))) continue;
			var i = img[0];
			var c = window.document.createElement("canvas");
			var w = c.width = i.width;
			var h = c.height = i.height;
			c.getContext("2d").drawImage(i,0,0,w,h);
			try {
				i.src = c.toDataURL("image/gif");
			} catch( e ) {
				if (e instanceof js__$Boot_HaxeError) e = e.val;
				var _g = 0;
				var _g1 = i.attributes;
				while(_g < _g1.length) {
					var a = _g1[_g];
					++_g;
					c.setAttribute(a.name,a.value);
				}
				i.parentNode.replaceChild(c,i);
			}
		}
	}
	,stopEvent: function(e) {
		if(e == null) e = window.event;
		if(e == null) return;
		e.cancelBubble = true;
		if($bind(e,e.stopPropagation)) e.stopPropagation();
	}
	,moduleAction: function(root,params,event) {
		this.stopEvent(event);
		var e = js.JQuery(root).parents(".tid_module");
		if(e.length == 0) throw new js__$Boot_HaxeError("action outside module");
		if(e.length > 1) e = e.eq(0);
		var url = e.data("mod-url");
		if(url == null) throw new js__$Boot_HaxeError("module missing url");
		var fparams = Reflect.copy(e.data("mod-params"));
		var _g = 0;
		var _g1 = Reflect.fields(params);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			Reflect.setField(fparams,f,Reflect.field(params,f));
		}
		this.loadModule(e,url,fparams);
		return false;
	}
	,topDomain: function() {
		var domain = window.location.hostname;
		var dparts = domain.split(".");
		while(dparts.length > 2) dparts.shift();
		return dparts.join(".");
	}
	,savedSessCookie: function() {
		if(this.infos == null || this.infos.fbApp == null) return "saved_tid_sess"; else return "fb_tid_sess";
	}
	,saveSession: function(value) {
		var old = this.store.getItem(this.savedSessCookie());
		if(value != old) {
			this.store.setItem(this.savedSessCookie(),value);
			this.syncStorage();
		}
	}
	,syncStorage: function() {
		this.sendingStorage = true;
		var o = { };
		var _g = 0;
		var _g1 = [this.savedSessCookie()];
		while(_g < _g1.length) {
			var k = _g1[_g];
			++_g;
			Reflect.setField(o,k,this.store.getItem(k));
		}
		var localStorage = js_Browser.getLocalStorage();
		if(localStorage != null) {
			localStorage.setItem("tid_storeSessStorage",JSON.stringify(o));
			localStorage.removeItem("tid_storeSessStorage");
		}
		this.sendingStorage = false;
	}
	,initSessStorage: function() {
		var _g = this;
		var transfer = function(event) {
			if(event == null || event.newValue == null) return;
			if(event.key == "tid_xfSessStorage") _g.syncStorage(); else if(event.key == "tid_storeSessStorage" && !_g.sendingStorage) {
				var data = JSON.parse(event.newValue);
				var _g1 = 0;
				var _g2 = Reflect.fields(data);
				while(_g1 < _g2.length) {
					var key = _g2[_g1];
					++_g1;
					_g.store.setItem(key,Reflect.field(data,key));
				}
			}
		};
		var win = window;
		if($bind(win,win.addEventListener) != null) win.addEventListener("storage",transfer,false);
		var v = this.store.getItem(this.savedSessCookie());
		if(v == null || v == "") {
			var localStorage = js_Browser.getLocalStorage();
			if(localStorage != null) {
				localStorage.setItem("tid_xfSessStorage","a");
				localStorage.removeItem("tid_xfSessStorage");
			}
		}
	}
	,setSession: function(sid,_tid,hasTID,isDevice,doGlobalTrack,newVisit) {
		if(newVisit == null) newVisit = false;
		if(doGlobalTrack == null) doGlobalTrack = false;
		this.session = { sid : sid, tid : _tid, hasTID : hasTID, isDevice : isDevice};
		this.saveSession(haxe_Serializer.run(this.session));
		if(_tid != null) this.initWS();
		try {
			if(newVisit && this.infos.fbApp != null) window.FB.AppEvents.activateApp();
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
		}
	}
	,initWS: function() {
		var _g = this;
		try {
			if(!Modernizr.websockets) return;
			if(this.infos.fbApp != null) return;
			if(this.ws == null) {
				if(this.wsError == null) this.wsError = 0;
				var url = this.makeRelUrl("/bar/ws",{ });
				var proto = "wss";
				var fullUrl = proto + "://ws." + this.host + url;
				if(this.local || this.infos.demo) {
					var port = "1235";
					fullUrl = proto + "://" + this.host + ":" + port + url;
				}
				this.ws = new WebSocket(fullUrl);
				this.ws.onopen = function(_) {
					_g.wsOnline = true;
					if(_g.channels != null) {
						var keys;
						var _g1 = [];
						var $it0 = _g.channels.iterator();
						while( $it0.hasNext() ) {
							var c = $it0.next();
							_g1.push(c.id);
						}
						keys = _g1;
						_g.ws.send("joinChannel=" + keys.join(","));
					}
				};
				this.ws.onmessage = function(e) {
					eval(e.data);
				};
				this.ws.onclose = function(e1) {
					_g.wsOnline = false;
					_g.ws = null;
					_g.wsError++;
					if(e1 != null && e1.wasClean) return;
					haxe_Timer.delay($bind(_g,_g.initWS),1000 * _g.wsError);
				};
			}
		} catch( e2 ) {
			if (e2 instanceof js__$Boot_HaxeError) e2 = e2.val;
			if(this.local) console.log(e2);
		}
	}
	,joinChannel: function(id,onMessage) {
		if(this.channels == null) this.channels = new haxe_ds_StringMap();
		var k = id;
		var arr = id.split("/");
		if(arr[0] == "ext") {
			arr.pop();
			k = arr.join("/");
		}
		var o = this.channels.get(k);
		if(o == null) {
			o = { id : id, onMessage : onMessage};
			this.channels.set(k,o);
			if(this.wsOnline) this.ws.send("joinChannel=" + id);
		} else o.onMessage = onMessage;
	}
	,leaveChannel: function(id) {
		var k = id;
		var arr = id.split("/");
		if(arr[0] == "ext") {
			arr.pop();
			k = arr.join("/");
		}
		var o = this.channels.get(k);
		if(o == null) return;
		if(this.wsOnline) this.ws.send("leaveChannel=" + id);
		this.channels.remove(k);
	}
	,onChanMsg: function(id,msg) {
		var o = this.channels.get(id);
		if(o != null) o.onMessage(msg);
	}
	,makeParams: function(params) {
		params = Reflect.copy(params);
		Reflect.setField(params,"host",window.location.hostname);
		Reflect.setField(params,"proto",window.location.protocol);
		if(this.session != null) params.sid = this.session.sid;
		return params;
	}
	,makeRelUrl: function(url,params) {
		params = this.makeParams(params);
		var sparams = null;
		var _g = 0;
		var _g1 = Reflect.fields(params);
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			var v = Reflect.field(params,p);
			if(v == null) continue;
			if(sparams == null) sparams = "?"; else sparams += ";";
			sparams += p + "=" + encodeURIComponent(Std.string(v));
		}
		return url + sparams;
	}
	,makeUrl: function(url,params) {
		return "https://" + this.host + this.makeRelUrl(url,params);
	}
	,loadAsyncJS: function(url) {
		var s = window.document.createElement("script");
		s.async = true;
		s.src = url;
		window.document.body.appendChild(s);
	}
	,loadJS: function(url,params) {
		var p = Reflect.copy(params);
		p.jsm = "1";
		if(!Object.prototype.hasOwnProperty.call(p,"lang")) p.lang = this.infos.lang;
		this.loadAsyncJS(this.makeUrl(url,p));
	}
	,addNamespace: function(html,ns) {
		html = html.split(" id=\"").join(" id=\"" + ns);
		var excl = new EReg("^(fb|twitter)-","");
		html = new EReg(" class=\"([^\"]+)\"","g").map(html,function(r) {
			var classes = r.matched(1).split(" ");
			var _g1 = 0;
			var _g = classes.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(excl.match(classes[i])) continue;
				classes[i] = ns + classes[i];
			}
			return " class=\"" + classes.join(" ") + "\"";
		});
		return html;
	}
	,initContact: function(s) {
		if(this.contact == null) this.contact = new tid_Contact("");
		if(this.store != null) {
			if(s != null) try {
				this.store.setItem("tid_contact",s);
			} catch( e ) {
				if (e instanceof js__$Boot_HaxeError) e = e.val;
			} else s = this.store.getItem("tid_contact");
		}
		if(s != null) {
			this.contact.update(s);
			var q = tid_Boot.j(".tid_user");
			if(q.length > 0) {
				q.filter(".tid_userFriend").removeClass("tid_userFriend").addClass("tid_userUnknown");
				var $it0 = (function($this) {
					var $r;
					var this1 = $this.contact.getList();
					$r = this1.keys();
					return $r;
				}(this));
				while( $it0.hasNext() ) {
					var uid = $it0.next();
					q.filter(".tid_user_" + uid).removeClass("tid_userUnknown").addClass("tid_userFriend");
				}
			}
			this.updateUserSheets();
		}
	}
	,initBar: function(html,$final) {
		if($final == null) $final = true;
		this.setSidePanel("twinoid",false);
		this.setSidePanel("user",false);
		if(window.scrollY <= 0) window.scrollTo(0,0);
		if(html == null) return;
		this.barLoaded = true;
		var b = tid_Boot.j("#tid_bar");
		var l = b.find(".tid_barLock");
		var locked = l.length > 0 && l.css("display") != "none";
		b.html(this.addNamespace(html,"tid_"));
		var content = tid_Boot.j("#tid_bar_custom_content");
		if(content.length > 0) {
			var html1 = content.html();
			html1 = StringTools.replace(html1,"tid_button","tid_barButton");
			tid_Boot.j("#tid_bar_custom").html(html1).show();
		}
		if(!this.isCssReady()) {
			tid_Boot.j("#tid_bar .tid_container").hide();
			tid_Boot.j("#tid_bar .tid_adminSubBar").hide();
			b.css("overflow","hidden");
		}
		if($final) this.waitCss(function() {
			tid_Boot.j("#tid_bar .tid_container").show();
			tid_Boot.j("#tid_bar .tid_adminSubBar").show();
			tid_Boot.j("#tid_bar").css("overflow","visible");
		});
		if($final) {
			this.barLoading = false;
			tid_Boot.j(".tid_adminSubBar").show();
			tid_Boot.j("#tid_openLeft").mouseenter($bind(this,this.onOverLeftCorner)).mouseleave($bind(this,this.onLeaveLeftCornerButton));
			tid_Boot.j("#tid_openRight").mouseenter($bind(this,this.onOverRightCorner)).mouseleave($bind(this,this.onLeaveRightCornerButton));
			tid_Boot.j("#tid_sidePanel_twinoid, #tid_sidePanel_user").mouseenter($bind(this,this.onOverPanel)).mouseleave($bind(this,this.onLeavePanel));
			if(locked) this.lockBar();
		}
		if(this.uSearchUrl != null) this.setUserSearchUrl(this.uSearchUrl);
		try {
			if(this.store != null) this.store.setItem("tid_bar",html);
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
		}
		if($final) this.isReady = true;
	}
	,initBarDown: function(html) {
		if(html == null) return;
		tid_Boot.j("#tid_bar_down").html(this.addNamespace(html,"tid_"));
		try {
			if(this.store != null) this.store.setItem("tid_bar_down",html.split("text/javascript").join("disabled"));
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
		}
		if(this.fb != null) this.fb.xfbml(tid_Boot.j("#tid_bar_down")[0]);
	}
	,hideSwf: function(flag) {
		if(flag) this.hideUnderSwf(tid_Boot.j("body")); else this.showUnderSwf();
	}
	,openPopup: function(html,onClose) {
		tid_Boot.j("#tid_popup").remove();
		var h = "<div id='tid_popup'>" + "<div class='tid_content'>" + html + "</div>" + "<div class='tid_loadingWrapper'>" + this.loadingHTML() + "</div>" + "<div class='tid_black'/>" + "</div>";
		var popup = tid_Boot.j(h);
		popup.prependTo("body");
		this.hideSwf(true);
		tid_Boot.j("body").children().not("#tid_popup").addClass("tid_behindPopup");
		this.popupOnClose = onClose;
	}
	,isTwinoid: function() {
		return window.location.hostname == this.host;
	}
	,popImage: function(url,title) {
		var p = tid_Boot.j("<div class='tid_imgPopUp'/>");
		var caption = tid_Boot.j("<div class='tid_caption'>" + title + "</div>");
		var i = tid_Boot.j("<img alt='image#" + url + "' class='tid_img' title='" + title + "'/>");
		i.load(function(_) {
			i.css({ maxWidth : "100%"});
			caption.css({ maxWidth : i.width() + "px"});
		});
		i.attr("src",url);
		p.append(i);
		if(title != null) p.append(caption);
		this.popHtml(p);
	}
	,popHtml: function(elem) {
		tid_Boot.j("#tid_simpleViewer").remove();
		var $window = tid_Boot.j(window);
		var e = tid_Boot.j("<div id='tid_simpleViewer'> <div class='tid_black'></div> <div class='tid_wrapper'><div class='tid_container'></div></div> </div>");
		tid_Boot.j("body").prepend(e);
		e.click(function(_) {
			e.remove();
			$window.off("resize.pop");
		});
		elem.hide().fadeIn(300).show();
		var container = e.find(".tid_container");
		container.append(elem);
		e.show();
		var img = e.find("img");
		$window.on("resize.pop",function(_1) {
			var mw = $window.width() * 0.9;
			var mh = $window.height() * 0.75;
			img.css({ maxWidth : mw, maxHeight : mh});
			e.find(".tid_caption").css({ maxWidth : img.width()});
			container.css({ marginTop : $window.height() * 0.5 - container.height() * 0.5});
		});
		$window.resize();
		img.load(function(_2) {
			$window.resize();
		});
		return e;
	}
	,openPopupFrame: function(fclass,url,params,closeBtn,onClose) {
		var _g = this;
		this.hideMenu();
		var curl;
		if(new EReg("^(https?:)?//","").match(url)) curl = url; else curl = "https://" + this.host + url;
		var p;
		if(new EReg("^https?://" + this.host.split(".").join("\\.") + "/","i").match(curl)) p = this.makeParams(params); else p = { };
		this.openPopup("<div id=\"tid_frameWrapper\" class=\"tid_" + fclass + "\"><iframe scrolling=\"no\" name=\"tid_" + fclass + "\" frameborder=\"0\" allowTransparency=\"true\" class=\"tid_frame\"/></div>",onClose);
		var form = tid_Boot.j("<form target=\"tid_" + fclass + "\" method=\"post\" action=\"" + curl + "\" style=\"display:none\"></form>");
		var _g1 = 0;
		var _g11 = Reflect.fields(p);
		while(_g1 < _g11.length) {
			var f = _g11[_g1];
			++_g1;
			tid_Boot.j("<input type=\"hidden\" name=\"" + f + "\"/>").val(Reflect.field(p,f)).appendTo(form);
		}
		form.appendTo("body");
		form.submit();
		if(closeBtn) {
			var wrapper = tid_Boot.j("#tid_frameWrapper");
			var bt = tid_Boot.j("<a class='tid_closeFrame' id='tid_closeFrame' href='#' onclick='return false'></a>");
			wrapper.prepend(bt);
			bt.wrap("<div class='tid_closeFrameWrapper'></div>");
			var btWrapper = bt.parent();
			bt.click(function(_) {
				_g.hidePopup();
				bt.hide();
			});
			btWrapper.hide();
			haxe_Timer.delay(function() {
				btWrapper.fadeIn(350);
			},700);
		}
		window.scrollTo(0,0);
		var popup = tid_Boot.j("#tid_popup");
		var msize = Math.max(tid_Boot.j("#tid_frameWrapper").height(),720);
		if(tid_Boot.j(window).height() >= msize) popup.css("position","fixed");
		var content = popup.children(".content");
		content.hide();
	}
	,hideFloatFrame: function() {
		this.unlockUnload();
		tid_Boot.j("#tid_frameFloat").remove();
		this.onLoad();
	}
	,hidePopup: function() {
		this.unlockUnload();
		tid_Boot.j("#tid_popup").remove();
		js.JQuery(this).remove();
		this.hideSwf(false);
		tid_Boot.j("body").children().removeClass("tid_behindPopup");
		this.onLoad();
		if(this.popupOnClose != null) {
			this.popupOnClose();
			this.popupOnClose = null;
		}
	}
	,setAbsoluteBar: function() {
		tid_Boot.j("#tid_bar").addClass("tid_absolute");
	}
	,hideNotice: function(_) {
		tid_Boot.j("#tid_baseNotice").hide();
		this.hideSwf(false);
	}
	,notice: function(str,error) {
		var notif = tid_Boot.j("#tid_baseNotice");
		notif.show();
		this.hideSwf(true);
		notif.find(".tid_content").html(StringTools.htmlUnescape(str));
	}
	,quickNotice: function(str,error,onClick) {
		var _g = this;
		var list = tid_Boot.j("#tid_noticeList");
		if(!tid_Boot.j("#tid_bar")["is"](":visible")) tid_Boot.j("#tid_noticeList").css("top","0px");
		var wrapper = tid_Boot.j("#tid_noticeList .tid_wrapper");
		var notif = tid_Boot.j("<div class=\"tid_notice\" style=\"display:none\">" + "<div class=\"tid_closeWrapper\">" + "<div class=\"tid_close\">TODO</div>" + "</div>" + "<div class=\"tid_content\">" + str + "</div>" + "<div class=\"tid_clear\"></div>" + "</div>");
		if(error) notif.addClass("tid_error");
		list.unbind("mouseover").unbind("mouseout");
		list.bind("mouseover",function(_) {
			if(_g.noticeTimer != null) _g.noticeTimer.stop();
		});
		list.bind("mouseout",function(_1) {
			_g.setQuickNoticeTimer(true);
		});
		var close = function(e) {
			if(notif["is"](":animated")) return;
			notif.remove();
			if(list.find(".tid_notice").not(".tid_skel").length == 0) list.hide();
			_g.setQuickNoticeTimer();
			e.stopPropagation();
		};
		if(onClick == null) notif.click(close); else {
			notif.find(".tid_closeWrapper").click(close);
			notif.find(".tid_content").click(function(_2) {
				onClick();
			});
		}
		wrapper.prepend(notif);
		list.show();
		notif.slideDown(500);
		if(this.noticeTimer == null) this.setQuickNoticeTimer();
		this.scrollVisible(notif);
	}
	,setQuickNoticeTimer: function(faster) {
		if(faster == null) faster = false;
		if(this.noticeTimer != null) {
			this.noticeTimer.stop();
			this.noticeTimer = null;
		}
		var e = tid_Boot.j("#tid_noticeList").find(".tid_notice:not(.tid_skel):not(.hidding)").last().find(".tid_content");
		if(e.length > 0) {
			var t;
			t = (faster?0:2500) + e.text().length * 18;
			this.noticeTimer = new haxe_Timer(t);
			this.noticeTimer.run = $bind(this,this.hideLastQuickNotice);
		}
	}
	,setAnalytics: function(id) {
		this.analyticsCode = id;
	}
	,hideLastQuickNotice: function() {
		var list = tid_Boot.j("#tid_noticeList");
		var e = list.find(".tid_notice").not(".tid_skel").last();
		e.addClass("hidding");
		e.slideUp(200,function() {
			e.remove();
			if(list.find(".tid_notice").not(".tid_skel").length == 0) list.hide();
		});
		this.setQuickNoticeTimer();
	}
	,verifyPassword: function(q,cb,transmitPassword) {
		if(transmitPassword == null) transmitPassword = false;
		var token = q.find("[name=token]");
		if(token.length >= 1) {
			if(cb == null) return true;
			cb(q);
			token.remove();
			return false;
		}
		var id = this.uniqueId(q);
		var p = { id : id};
		if(transmitPassword) p.transmitPassword = "1";
		this.openPopupFrame("verifyPassword","/user/verifyPassword",p,true);
		return false;
	}
	,onVerifyToken: function(p) {
		this.hidePopup();
		var a = p.split("|");
		var id = a[0];
		var token = a[1];
		var password = a[2];
		var form = tid_Boot.j("#" + id);
		form.append("<input type=\"hidden\" name=\"token\" value=\"" + token + "\"/>");
		if(password != null) form.append("<input type=\"hidden\" name=\"password\" value=\"" + password + "\"/>");
		form.submit();
	}
	,askShare: function(q) {
		var m = tid_Boot.j("<div class=\"tid_shareBox\"><div class=\"tid_noclick\"/><div class=\"tid_content\"><div class=\"tid_reload\"></div></div></div>");
		tid_Boot.j("body").prepend(m);
		var content = m.find(".tid_content");
		content.hide().fadeIn();
		m.find(".tid_noclick").click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			m.remove();
		});
		var o = q.offset();
		var ml = Std["int"](o.left - content.width() / 2 + q.width() / 2);
		var mt = o.top + q.height();
		m.css({ marginLeft : Math.max(ml,0) + "px", marginTop : Math.max(mt,0) + "px"});
		var o1 = { url : q.attr("tid_url")};
		var t = q.attr("tid_text");
		if(t != null) o1.text = t;
		var t1 = q.attr("tid_tag");
		if(t1 != null) o1.tag = t1;
		this.loadModule(m.find(".tid_content"),"/mod/share",o1);
		this.trackEvent("Twinoid","nativeTwinoidShare");
	}
	,isConnected: function(cb) {
		var _g = this;
		var callCb;
		var callCb1 = null;
		callCb1 = function() {
			if(_g.session == null) {
				haxe_Timer.delay(callCb1,200);
				return;
			}
			cb(_g.session.tid != null);
		};
		callCb = callCb1;
		callCb();
	}
	,notifyAdmin: function(eventId,idx) {
		this.hideMenu();
		this.openPopupFrame("report","/ev/notifyAdmin/" + eventId + "/" + idx,{ },true);
	}
	,askComplain: function(eventId,idx) {
		this.hideMenu();
		this.openPopupFrame("report","/ev/complain/" + eventId + "/" + idx,{ },true);
	}
	,askReport: function(url) {
		this.hideMenu();
		this.openPopupFrame("report","/report",{ url : url},true);
	}
	,askImpressum: function() {
		this.hideMenu();
		this.openPopupFrame("impressum","/impressum",{ },true);
	}
	,askModerate: function(uid) {
		var url;
		if(uid != null) url = "/moderate/user/" + uid; else url = "/moderate";
		if(this.isTwinoid() && tid_Boot.j("#frameContent").hasClass("moderate")) window.location.assign(url); else {
			this.hideMenu();
			this.openPopupFrame("moderate",url,{ },true);
			tid_Boot.j("#tid_popup").addClass("tid_miniBottom");
		}
	}
	,askUserMenu: function(e) {
		this.openUserMenu(e);
	}
	,askDiscuss: function($with) {
		if(this.isTwinoid() && window._discuss != null) window._discuss.newThread($with); else {
			var a;
			if($with == null) a = { }; else a = { 'with' : $with};
			if(arguments.length > 0 && a["with"] == null) a.oldUser = true;
			this._askDiscuss(a);
		}
	}
	,askDiscussGroup: function(groupId) {
		this._askDiscuss({ 'with' : -groupId});
	}
	,askDiscussThread: function(threadId) {
		this._askDiscuss({ thread : threadId});
	}
	,_askDiscuss: function(a) {
		if(this.session.tid == null) {
			this.askLogin();
			return;
		}
		this.hideMenu();
		this.lockUnload();
		window.scrollTo(0,0);
		this.openPopupFrame("discuss","/discuss",a,true);
	}
	,askContact: function() {
		this.hideMenu();
		this.openPopupFrame("contact","/contact",{ },true);
	}
	,askNews: function() {
		if(!tid_Boot.j("#tid_bar")["is"](":visible")) return;
		this.hideMenu();
		this.openPopupFrame("news","/story/latest",{ },true,$bind(this,this.reloadBar));
	}
	,askNotes: function() {
		this.hideMenu();
		this.openPopupFrame("notes","/user/notes",{ },true);
	}
	,askStatusEdit: function() {
		this.openPopupFrame("statusEdit","/user/statusEdit",{ },true);
	}
	,askTitleEdit: function() {
		this.openPopupFrame("titleEdit","/user/title",{ },true);
	}
	,invalidateParentModule: function(q) {
		q.closest(".tid_module").removeClass("tid_modinit").removeClass("tid_moduleLoading");
	}
	,initForum: function() {
		var e = tid_Boot.j("#tid_forum").not(".tid_forum_init");
		if(e.length != 1) return;
		this.forum = new tid_Forum(this,e);
	}
	,initGroup: function() {
		var e = tid_Boot.j("#tid_group").not(".tid_group_init");
		if(e.length != 1) return;
		this.group = new tid_Group(this,e);
	}
	,addContact: function(twinId) {
		this.loadJS("/mod/contact/" + twinId + "/add",{ });
	}
	,remContact: function(twinId) {
		this.loadJS("/mod/contact/" + twinId + "/rem",{ });
	}
	,addBlock: function(twinId) {
		this.loadJS("/mod/block/" + twinId + "/add",{ });
		var s;
		var _g = this.infos.lang;
		switch(_g) {
		case "fr":
			s = "Cet utilisateur a été ajouté à votre liste noire.";
			break;
		case "es":
			s = "Este usuario está ahora en tu Lista Negra.";
			break;
		case "de":
			s = "Du hast diesen Spieler auf deine Blacklist gesetzt.";
			break;
		default:
			s = "This user has been blacklisted.";
		}
		this.quickNotice(s,true);
	}
	,remBlock: function(twinId) {
		this.loadJS("/mod/block/" + twinId + "/rem",{ });
		var s;
		var _g = this.infos.lang;
		switch(_g) {
		case "fr":
			s = "Cet utilisateur a été retiré de votre liste noire.";
			break;
		case "es":
			s = "Este usuario ya no está en tu Lista Negra.";
			break;
		case "de":
			s = "Du hast diesen Spieler von deiner Blacklist genommen.";
			break;
		default:
			s = "This user has been removed from your blacklist.";
		}
		this.quickNotice(s);
	}
	,getCurrentURL: function() {
		var l = window.location;
		var fSearch = [];
		if(HxOverrides.cca(l.search,0) == 63) new EReg("([^&;=]+)=[^&;]*","g").map(HxOverrides.substr(l.search,1,null),function(r) {
			var k = r.matched(1);
			if(HxOverrides.substr(k,0,4) != "tid_" && k != "chk" && k != "lang") fSearch.push(r.matched(0));
			return "";
		});
		return l.pathname + (fSearch.length == 0?"":"?" + fSearch.join("&")) + (l.hash != null?l.hash:"");
	}
	,cashHost: function() {
		var h = "cash.motion-twin.com";
		if(this.local) h = "local." + h; else if(this.infos.demo) h = "demo." + h;
		return h;
	}
	,askCashFrame: function(params,onClose) {
		var obj = { };
		try {
			params += "&gcid=" + StringTools.urlEncode(this.tga.get("clientId"));
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
		}
		try {
			params += "&scid=" + StringTools.urlEncode(this.ga.get("clientId"));
		} catch( e1 ) {
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
		}
		if(this.infos.fbApp != null) {
			if(this.fb == null || this.fb.authResponse == null) {
				js_Browser.alert("FB init failed");
				return;
			}
			this.fb.startPayment(params,onClose);
		} else this.openPopupFrame("cashFrame","https://" + this.cashHost() + "/frame/init?" + params,obj,true,onClose);
		var m = null;
		try {
			var a = new EReg("[;&]","g").split(params);
			var _g = 0;
			while(_g < a.length) {
				var e2 = a[_g];
				++_g;
				if(HxOverrides.substr(e2,0,2) == "m=") {
					m = StringTools.urlDecode(HxOverrides.substr(e2,2,null));
					break;
				}
			}
		} catch( e3 ) {
			if (e3 instanceof js__$Boot_HaxeError) e3 = e3.val;
		}
		this.trackEvent("cash","askCashFrame",m);
	}
	,cashSetParams: function(money,params) {
		if(this.cashParams == null) this.cashParams = new haxe_ds_StringMap();
		this.cashParams.set(money,params);
	}
	,cashListProducts: function(money,cbuid) {
		var _g = this;
		if(this.cashParams == null || !this.cashParams.exists(money)) return;
		var p = this.cashParams.get(money);
		var cb = "callback=_tid.cashCallback(" + cbuid + ")&";
		if(this.infos.fbApp == null) this.loadAsyncJS("https://" + this.cashHost() + "/frame/list?" + cb + p); else this.fb.token(function(tk) {
			_g.loadAsyncJS("https://" + _g.cashHost() + "/fb/list?tk=" + encodeURIComponent(tk) + "&" + cb + p);
		});
		var c;
		if(this.infos.fbApp != null) c = "fb"; else c = "frame";
	}
	,cashCallback: function(uid) {
		var _g = this;
		if(uid == null) return function(_) {
		};
		return function(dat) {
			_g.getFlashObject().mtcash(uid,haxe_Serializer.run(dat));
		};
	}
	,fbcall: function(fun,uid,args) {
		if(this.fb != null) return this.fb.call(fun,uid,args);
		var fobj = this.getFlashObject();
		try {
			fobj.mtfacebook(uid,haxe_Serializer.run(null));
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			null;
		}
		return false;
	}
	,askBetaInvite: function(code) {
		var prm = { url : this.getCurrentURL()};
		if(code != null) prm.code = code;
		this.openPopupFrame("login","/user/betaInvite",prm,true);
		this.trackEvent("Twinoid","askBetaInvite");
	}
	,askGoalCode: function(code) {
		if(this.session != null && this.session.tid == null) {
			this.askLogin();
			return;
		}
		var prm = { };
		if(code != null) prm.code = code;
		this.openPopupFrame("goalCode","/tid/goalCode",prm,true);
	}
	,askLogin: function() {
		if(this.session != null && this.session.isDevice) {
			this["goto"]("mt://login");
			return;
		}
		this.openPopupFrame("login","/user/login",{ login : tid_Boot.input("login").val(), pass : tid_Boot.input("pass").val(), ref : this.infos.ref, refid : this.infos.refid, url : this.getCurrentURL()},true);
		this.trackEvent("Twinoid","login","askLogin");
	}
	,askPlay: function(url) {
		if(this.session.tid == null) {
			if(url != null) window.location.assign(url); else if(this.session.hasTID) this.askLogin(); else this.askCreate();
		} else {
			if(this.session != null && this.session.isDevice) {
				this["goto"]("mt://login");
				return;
			}
			this.openPopupFrame("login","/user/checkLogin",{ ref : this.infos.ref, refid : this.infos.refid, url : url == null?this.getCurrentURL():url},true);
			this.trackEvent("Twinoid","login","askPlay");
		}
	}
	,askLangs: function() {
		tid_Boot.j("#tid_underBar .tid_langs").stop(true,true).fadeToggle(100);
		tid_Boot.j("#tid_bar a.tid_lang").toggleClass("tid_active");
		tid_Boot.j("#tid_noClickLangs").toggle();
		this.trackEvent("Twinoid","askLangs");
	}
	,fullUrl: function(url) {
		if(HxOverrides.substr(url,0,5) != "http:" && HxOverrides.substr(url,0,6) != "https:") url = "http://" + this.host + url;
		return url;
	}
	,specialClick: function(ev,fn) {
		if(ev.which == 2 || ev.button == 4) return true;
		fn();
		return false;
	}
	,redirect: function(url) {
		url = this.fullUrl(url);
		this.hideMenu();
		window.location.assign(url);
		return false;
	}
	,disconnect: function(force) {
		this.trackEvent("Twinoid","logout");
		var o = { };
		if(force) o = { force : true};
		this.loadJS("/user/logoff",o);
	}
	,askBeforeLogout: function() {
		this.openPopupFrame("beforeLogout","/user/beforeLogout",{ },true);
	}
	,twTrack: function(act,params) {
		this.loadJS("/bar/trackEvent",{ act : act, params : params});
	}
	,trackEvent: function(cat,act,label) {
		this.trackGlobalEvent(cat,act,label);
		this.trackSiteEvent(cat,act,label);
	}
	,trackGlobalEvent: function(cat,act,label) {
		this.tga.trackEvent(cat,act,label);
	}
	,trackSiteEvent: function(cat,act,label) {
		this.ga.trackEvent(cat,act,label);
	}
	,trackGlobalSocial: function(cat,act,label) {
		this.tga.trackSocial(cat,act,label);
	}
	,trackSiteSocial: function(cat,act,label) {
		this.ga.trackSocial(cat,act,label);
	}
	,trackGlobalPageView: function(url) {
		this.tga.trackPageView(url);
	}
	,trackSitePageView: function(url) {
		this.ga.trackPageView(url);
	}
	,cleanup: function() {
		if(this.store != null) this.store.clear();
		this.saveSession("");
	}
	,askCreate: function() {
		if(this.session != null && this.session.isDevice) {
			this["goto"]("mt://login/?create=1");
			return;
		}
		this.openPopupFrame("create","/user/create",this.infos,true);
		this.trackEvent("Twinoid","login","askCreate");
	}
	,askForgetPass: function() {
		this.openPopupFrame("forget","/user/forgetPass",this.infos,true);
	}
	,askAssoc: function() {
		this.openPopupFrame("assoc","/user/assoc",this.infos,true);
	}
	,onJsException: function(msg,stack) {
		if(this.local || stack != null) js_Browser.alert(msg + (stack == null?"":"\nSTACK=" + stack));
		this.checkBarActive();
	}
	,getFlashObject: function() {
		var q = js.JQuery("#client");
		if(q.length == 0 || !q["is"]("embed,object")) q = js.JQuery("embed,object");
		return q[0];
	}
	,showUnderSwf: function() {
		if(this.hiddenSwf != null) {
			this.hiddenSwf.css("visibility","");
			if(this.ieVersion() != null) this.hiddenSwf.find("object,embed").css({ 'top' : "", 'position' : js.JQuery(this).data("_tidOldCSSpos")});
			this.hiddenSwf = null;
		}
		tid_Boot.j("div.tid_hiddenSwf").remove();
	}
	,hideUnderSwf: function(e) {
		var hidden = js.JQuery("object,embed").not("embed[wmode=transparent]").parent().filter(".swf").not(".transparent");
		hidden = hidden.add(tid_Boot.j(".tid_editorContent iframe"));
		var ep = e.offset();
		var ew = e.width();
		var eh = e.height();
		if(e["is"]("#tid_sidePanel_twinoid")) ep.left = 0; else if(e["is"]("#tid_sidePanel_user")) ep.left = tid_Boot.j(window).width() - ew;
		var txt;
		var _g = this.infos.lang;
		switch(_g) {
		case "fr":
			txt = "Cet élément a été automatiquement masqué car il ne peut pas être affiché en même temps qu'un menu de votre barre.";
			break;
		case "es":
			txt = "Este elemento se oculta automáticamente porque no puede ser mostrado al mismo tiempo que un menú en tu barra.";
			break;
		case "de":
			txt = "Dieses Element wurde automatisch ausgeblendet, weil es nicht zeitgleich mit der Menüleiste angezeigt werden kann.";
			break;
		default:
			txt = "This element was automatically hidden because it cannot be displayed at the same time as your menu bar.";
		}
		var $it0 = (hidden.iterator)();
		while( $it0.hasNext() ) {
			var e1 = $it0.next();
			var p = e1.offset();
			var w = e1.width();
			var h = e1.height();
			if(e1["is"](":hidden") || p.left > ep.left + ew || p.top > ep.top + eh || p.left + w < ep.left || p.top + h < ep.top) hidden = hidden.not(e1.get()[0]); else {
				var screenshot = null;
				var embed = e1.find("embed,object");
				if(embed.length > 0) try {
					screenshot = embed[0].exportScreenshot();
				} catch( e2 ) {
					if (e2 instanceof js__$Boot_HaxeError) e2 = e2.val;
					screenshot = null;
				}
				if(screenshot != null && screenshot.length > 4) {
					var w1 = embed.width();
					var h1 = embed.height();
					var dimg = tid_Boot.j("<div class=\"tid_hiddenSwf tid_screenshot\"><img width=\"" + w1 + "\" height=\"" + h1 + "\"/></div>");
					var img = dimg.find("img")[0];
					img.src = "data:image/png;base64," + screenshot;
					e1.before(dimg);
				} else if(w >= 200 && h >= 32) {
					if(!e1["is"]("iframe")) e1.before("<div class=\"tid_hiddenSwf\" style=\"width:" + w + "px; height:" + h + "px\"><div class=\"tid_inner\" style=\"padding-top:" + h * 0.4 + "px\">" + txt + "</div></div>");
				}
			}
		}
		hidden.add(tid_Boot.j("object,embed").not("embed[wmode=transparent]"));
		hidden.css("visibility","hidden");
		if(this.hiddenSwf == null) this.hiddenSwf = hidden; else this.hiddenSwf.add(hidden);
		if(this.ieVersion() != null) hidden.find("object,embed").data("_tidOldCSSpos",(function($this) {
			var $r;
			try {
				$r = js.JQuery($this).css("position");
			} catch( e3 ) {
				if (e3 instanceof js__$Boot_HaxeError) e3 = e3.val;
				$r = null;
			}
			return $r;
		}(this))).css({ 'top' : "-3000px", 'position' : "absolute"});
		return hidden;
	}
	,autoClickVisible: function(e) {
		if(e.length == 0) return;
		var w = tid_Boot.j(window);
		w.bind("scroll.autoClick",function(_) {
			if(!e.parents(":last")["is"]("html")) {
				w.unbind("scroll.autoClick");
				return;
			}
			var y = e.offset().top;
			var top = w.scrollTop();
			var wh = w.innerHeight();
			var visible = y < top + wh && top < y + e.height();
			if(visible) {
				e.click();
				w.unbind("scroll.autoClick");
			}
		});
	}
	,scrollVisible: function(q,marginTop,marginBottom,upOnly) {
		if(upOnly == null) upOnly = false;
		if(marginBottom == null) marginBottom = 0.0;
		if(marginTop == null) marginTop = 0.0;
		if(q.length == 0) return q;
		var e = q.first();
		var parent = null;
		var p = e.parent();
		while(p.length > 0) {
			var e1 = p[0];
			var co = p.css("overflow");
			if(p["is"]("html") || (co == "scroll" || co == "auto" || p.hasClass("scrollContentWrapper")) && e1.scrollHeight > e1.clientHeight && (e1.offsetHeight == null || e1.scrollHeight > e1.offsetHeight)) {
				parent = p;
				break;
			}
			p = p.parent();
		}
		if(parent == null) return q;
		var top;
		var ph;
		if(parent["is"]("html")) {
			var b = tid_Boot.j("#tid_bar");
			if(b["is"](".tid_floating")) marginTop += b.innerHeight();
			parent = tid_Boot.j(window);
			top = Std["int"](Math.max(0,e.offset().top));
			ph = parent.height();
		} else {
			top = e.offset().top - parent.offset().top + parent.scrollTop();
			ph = parent.innerHeight();
			this.scrollVisible(parent);
		}
		var h = e.innerHeight();
		var cur = parent.scrollTop();
		var nv = null;
		if(top - marginTop < cur) nv = top - marginTop; else if(!upOnly && top + h - ph + marginBottom > cur) nv = Std["int"](Math.min(top - marginTop,top + h - ph + marginBottom));
		if(nv != null) {
			var animate = parent[0] != window && Math.abs(cur - nv) < 400;
			if(animate) {
				var d = Std["int"](Math.min(Math.abs(cur - nv) * 3,500));
				if(parent[0] == window) tid_Boot.j("html,body").stop().animate({ scrollTop : nv},d); else parent.stop().animate({ scrollTop : nv},d);
			} else parent.stop().scrollTop(nv | 0);
		}
		return q;
	}
	,removeIframes: function(html) {
		var _g = this;
		if(this.session == null || !this.session.isDevice) return html;
		var h = tid_Boot.j(html);
		h.find("iframe").each(function() {
			var e = js.JQuery(this);
			var preview = tid_Boot.j("<div class=\"tid_bigObject\"></div>");
			preview.click(function(evt) {
				_g.popHtml(e);
			});
			preview.insertBefore(e);
			e.detach();
		});
		return h;
	}
	,fillModule: function(id) {
		var _g = this;
		return function(html) {
			tid_Boot.j("#" + id).html(_g.removeIframes(_g.addNamespace(html,"tid_"))).addClass("tid_modinit");
			_g.onLoad();
		};
	}
	,appendModule: function(id,sub) {
		var _g = this;
		return function(html) {
			var q = tid_Boot.j("#" + id);
			if(sub != null) q = q.find(sub);
			q.append(_g.removeIframes(_g.addNamespace(html,"tid_")));
			_g.onLoad();
		};
	}
	,fillPopup: function(html) {
		tid_Boot.j("#tid_popup .tid_content").html(this.addNamespace(html,"tid_"));
	}
	,showCookieWarning: function(html) {
		if(js_Cookie.exists("hcw")) return;
		tid_Boot.j("body").prepend(this.addNamespace(html,"tid_"));
	}
	,hideCookieWarning: function() {
		tid_Boot.j("#tid_cookieWarning").remove();
		js_Cookie.set("hcw","1",126144000,"/");
		this.loadJS("/bar/sethcw",{ });
	}
	,showCampaign: function(cid,html,css) {
		var _g = this;
		var c = tid_Boot.j("#tid_campaign");
		if(c.length == 0) {
			tid_Boot.j("body").prepend("<div id=\"tid_campaign\"></div>");
			c = tid_Boot.j("#tid_campaign");
		}
		css = new EReg("^([A-Z0-9_#., \t\\[\\]=:-]+){","mig").map(css,function(r) {
			var a = r.matched(1).split(",");
			a = a.map(function(s) {
				return "#tid_campaign " + new EReg("(\\.|#)([A-Z0-9_-]+)","ig").map(s,function(r1) {
					return r1.matched(1) + "tid_" + r1.matched(2);
				});
			});
			return a.join(", ") + "{";
		});
		c.html(this.addNamespace(html,"tid_") + "<style>" + css + "</style>");
		c.find("a").not(".tid_closeBtn").bind("click",function(ev) {
			_g.hideCampaign(cid,false);
		});
	}
	,hideCampaign: function(cid,close) {
		if(close == null) close = true;
		tid_Boot.j("#tid_campaign").remove();
		this.loadJS("/bar/clickCampaign/" + cid,{ close : close});
	}
	,hideMenu: function() {
		this.hideSidePanel("twinoid");
		this.hideSidePanel("user");
	}
	,updateNotify: function(count,imp) {
		var notif = tid_Boot.j("#tid_newsNotif");
		notif.find(".tid_counter").html(count == null?"null":"" + count);
		if(count > 0) {
			var b = tid_Boot.j("#tid_newsBlink");
			b.bind("click.remove",function(e) {
				b.hide();
			});
			b.stop(true,true).fadeIn(200).fadeOut(800);
			notif.show();
		} else notif.hide();
		if(this.store == null) return;
		var cache = this.store.getItem("tid_bar");
		if(cache != null) {
			var jcache = tid_Boot.j("<div></div>").html(cache);
			jcache.find("#tid_newsNotif").replaceWith(notif);
			try {
				this.store.setItem("tid_bar",jcache.html());
			} catch( e1 ) {
				if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			}
		}
		this.updatePageTitle();
	}
	,updateEvents: function(count,newMail,canGlow) {
		if(canGlow == null) canGlow = true;
		var notif = tid_Boot.j("#tid_userNotif");
		notif.find(".tid_counter").html(count == null?"null":"" + count);
		if(count > 0) {
			if(canGlow) {
				var b = tid_Boot.j("#tid_notifBlink");
				b.bind("click.remove",function(e) {
					b.hide();
				});
				b.stop(true,true).fadeIn(200).fadeOut(800);
			}
			notif.show();
		} else notif.hide();
		if(newMail && count > 0) notif.find("img.tid_mail").show(); else notif.find("img.tid_mail").hide();
		if(this.store == null) return;
		var cache = this.store.getItem("tid_bar");
		if(cache != null) {
			var jcache = tid_Boot.j("<div></div>").html(cache);
			jcache.find("#tid_userNotif").replaceWith(notif);
			try {
				this.store.setItem("tid_bar",jcache.html());
			} catch( e1 ) {
				if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			}
		}
		this.updatePageTitle();
	}
	,markEventsRead: function() {
		this.loadJS("/bar/markEventsRead",{ });
		tid_Boot.j("#tid_sidePanel_" + "user").find(".tid_eventItem.tid_read_false").removeClass("tid_read_false").addClass("tid_read_true");
	}
	,markStoriesRead: function() {
		this.loadJS("/bar/markStoriesRead",{ });
		tid_Boot.j("#tid_sidePanel_" + "twinoid").find(".tid_story.tid_read_false").removeClass("tid_read_false").addClass("tid_read_true");
	}
	,storyComment: function(e) {
		var item = e.closest(".tid_story");
		item.find(".tid_comments").show(200);
		item.find(".tid_comment").show(200);
		return false;
	}
	,storyReply: function(e) {
		var item = e.closest(".tid_story");
		item.find(".tid_commentLink").hide();
		item.find(".tid_reply").show(200);
		item.find(".tid_reply textarea").focus();
		return false;
	}
	,storyMenu: function(e) {
		var menu = e.closest(".tid_itemMenu");
		var content = menu.find(".tid_itemMenuContent");
		var bt = menu.find("a.tid_open");
		if(content["is"](":visible")) bt.removeClass("tid_active"); else bt.addClass("tid_active");
		tid_Boot.j(".tid_itemMenuContent").not(content[0]).hide();
		content.toggle();
		return false;
	}
	,getStoryItem: function(bt) {
		return bt.closest(".tid_story");
	}
	,uploadImage: function(callb,resize,urlMode,errMsg) {
		if(urlMode == null) urlMode = false;
		window.scrollTo(0,0);
		this.openPopup("");
		var a;
		if(resize == null) a = { urlMode : urlMode}; else a = { resize : resize, urlMode : urlMode};
		this.uploadResult = $bind(this,this.internalUploadResult);
		this.loadJS("/mod/upload",a);
		if(errMsg == null) errMsg = "Error (%msg)";
		this.uploadFileInfos = { callb : callb, errMsg : errMsg};
		return false;
	}
	,uploadResult: function(msg,err) {
		this.internalUploadResult(msg,err);
	}
	,internalUploadResult: function(msg,err) {
		this.hidePopup();
		var inf = this.uploadFileInfos;
		if(inf == null) return;
		this.uploadFileInfos = null;
		if(err) {
			js_Browser.alert(inf.errMsg.split("%msg").join(msg));
			return;
		}
		inf.callb(msg);
	}
	,uploadLink: function(flag) {
		haxe_Timer.delay(function() {
			if(flag) tid_Boot.j(".tid_upload_target").addClass("tid_hover"); else tid_Boot.j(".tid_upload_target").removeClass("tid_hover");
		},1);
	}
	,addOverlay: function(q) {
		var of = q.offset();
		var d = tid_Boot.j("<div id=\"tid_uploadingOverlay\"></div>").css({ top : of.top, left : of.left, width : q.outerWidth(), height : q.outerHeight()});
		d.html(this.loadingHTML());
		d.find(".tid_loading").css({ marginTop : d.height() / 2 - 10});
		tid_Boot.j("body").prepend(d);
	}
	,rmOverlay: function() {
		tid_Boot.j("#tid_uploadingOverlay").remove();
	}
	,initDropZone: function(q,params,uploadedCallback,progress) {
		var _g = this;
		if(params.indexOf("prefix=") < 0) params += "&prefix=" + this.session.tid + "";
		var c = 0;
		q.off("dragenter.dropZone");
		q.on("dragenter.dropZone",function(e) {
			e.preventDefault();
			e.stopPropagation();
			var ev = e.originalEvent;
			ev.dataTransfer.dropEffect = "copy";
			if(c++ == 0) q.addClass("tid_fileOver");
		});
		q.off("dragleave.dropZone");
		q.on("dragleave.dropZone",function(e1) {
			e1.preventDefault();
			e1.stopPropagation();
			if(--c == 0) q.removeClass("tid_fileOver");
		});
		q.off("dragover.dropZone");
		q.on("dragover.dropZone",function(e2) {
			e2.preventDefault();
			e2.stopPropagation();
		});
		q.off("drop.dropZone");
		q.on("drop.dropZone",function(e3) {
			e3.stopPropagation();
			e3.preventDefault();
			c = 0;
			q.removeClass("tid_fileOver");
			var dt = e3.originalEvent.dataTransfer;
			if(dt == null) return;
			if(dt.files == null || dt.files.length == 0) return;
			_g.addOverlay(q);
			_g.processUpload(dt.files,params,uploadedCallback);
		});
	}
	,processUpload: function(files,params,uploadedCallback,progress) {
		var _g = this;
		if(uploadedCallback == null) uploadedCallback = $bind(this,this.uploadResult);
		if(progress != null && progress.length == 0) progress = null;
		var formData = new FormData();
		var _g1 = 0;
		while(_g1 < files.length) {
			var f = files[_g1];
			++_g1;
			formData.append("file",f,f.name);
		}
		var request = new XMLHttpRequest();
		request.onerror = function(e) {
			js_Browser.alert("an error occured: " + e);
			_g.rmOverlay();
			uploadedCallback(e == null?"null":"" + e,true);
		};
		request.onload = function(e1) {
			var r;
			try {
				r = haxe_Unserializer.run(request.responseText);
			} catch( e2 ) {
				if (e2 instanceof js__$Boot_HaxeError) e2 = e2.val;
				r = null;
			}
			var url = Std.string(r);
			var isError = url == null || url.indexOf("/") == -1;
			var complete = function() {
				_g.rmOverlay();
				uploadedCallback(url,isError);
			};
			if(progress != null) progress.fadeOut(400,function() {
				progress.hide();
				complete();
			}); else complete();
		};
		if(progress != null) {
			progress.show();
			request.onprogress = function(e3) {
				progress.css("width",Math.ceil(e3.loaded / e3.total) * 100 + "%");
			};
		}
		request.open("POST",this.IMGUP + "upload/?" + params);
		request.send(formData);
	}
	,'goto': function(url) {
		if(url == null) url = "";
		if(HxOverrides.substr(url,0,5) == "mt://") window.location.assign(url); else window.location.assign("http://" + this.host + url);
		return false;
	}
	,hideNewSite: function() {
		this.loadJS("/bar/hideNewSite",{ });
	}
	,hideGameReco: function() {
		this.loadJS("/tid/hideGameReco",{ });
	}
	,lockBar: function() {
		this.isLocked = true;
		this.hideMenu();
	}
	,unlockBar: function() {
		this.isLocked = false;
	}
	,pageForm: function(q,goPage) {
		var prefix;
		if(q.parent().hasClass("pagination")) prefix = ""; else prefix = "tid_";
		var cancelForm = function(_) {
			q.find("." + prefix + "pageInput").hide().find("input").unbind("change");
			q.find("." + prefix + "pageNumber").show();
			q.find("." + prefix + "help").hide();
		};
		var defGoPage = function(p) {
			var h = q.attr("href");
			if(h != null) window.location.assign(h + p);
		};
		q.find("." + prefix + "pageNumber").hide();
		q.find("." + prefix + "pageInput").show().find("input").change(function(_1) {
			var p1 = Std.parseInt(js.JQuery(this).val());
			if(p1 == null) return;
			if(goPage == null) defGoPage(p1); else goPage(p1);
		}).focus().val("");
		q.find("." + prefix + "help").fadeIn(250);
		q.find("." + prefix + "pageInput input").blur(cancelForm);
	}
	,editorInit: function() {
		tid_Editor.init();
	}
	,initGoals: function() {
		var e = tid_Boot.j(".tid_userGoals");
		var conf = window._tid_goalsConf;
		if(conf == null) conf = { color : [{ bg : "#3b4151", text : "white"},{ bg : "#3b4151", text : "white"},{ bg : "#323745", text : "white"}]};
		var rules = [];
		var n = 1;
		var _g = 0;
		var _g1 = conf.color;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			if(c == null) continue;
			var rgb = mt_deepnight_Color.hexToRgb(c.bg);
			var lighter = mt_deepnight_Color.rgbToHex(mt_deepnight_Color.brightness(rgb,0.15));
			rules.push(".tid_border" + n + " { border-color:" + lighter + " !important; }");
			rules.push(".tid_bg" + n + " { background-color:" + c.bg + "; color:" + c.text + " !important; }");
			rules.push(".tid_over" + n + ":hover { background-color:" + c.bg + " !important; color:" + c.text + " !important; }");
			rules.push(".tid_over" + n + ":hover .tid_gold { color:" + c.text + " !important; }");
			n++;
		}
		if(conf.color[2] != null) {
			var lum = mt_deepnight_Color.getLuminosity(mt_deepnight_Color.hexToRgb(conf.color[2].bg),null);
			if(lum >= 150) rules.push(".tid_gold { color: #AE4200; }");
		}
		var _g11 = 0;
		var _g2 = rules.length;
		while(_g11 < _g2) {
			var i = _g11++;
			rules[i] = ".tid_userGoals " + rules[i];
		}
		var h = "<style type=\"text/css\">" + rules.join(" ") + "</style>";
		e.before(h);
		var $it0 = (function($this) {
			var $r;
			var _this = e.find(".tid_reachList,.tid_goalListWrapper");
			$r = (_this.iterator)();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var q = $it0.next();
			var s = new mt_js_ScrollBar(q,false,function(c1) {
				switch(c1) {
				case "scrollTrack":
					return "tid_bg3 tid_border3 tid_" + c1;
				case "scrollBar":case "scrollBot":case "scrollTop":
					return "tid_bg2 tid_border2 tid_" + c1;
				default:
					return "tid_" + c1;
				}
			});
		}
		var $it1 = (e.iterator)();
		while( $it1.hasNext() ) {
			var div = $it1.next();
			if(div.width() < 250) div.addClass("tid_small");
		}
	}
	,fitImages: function(parent) {
		var _g = this;
		var imgs = parent.find(".tid_img:not(.tid_parsed)");
		var $it0 = (imgs.iterator)();
		while( $it0.hasNext() ) {
			var e = $it0.next();
			var e1 = [e];
			e1[0].addClass("tid_parsed");
			if(e1[0].parents("a").length == 0 && e1[0].width() >= 100) e1[0].click((function(e1) {
				return function(_) {
					_g.popImage(e1[0].attr("src"));
				};
			})(e1));
		}
		var objects = parent.find("iframe").not(".tid_parsed");
		objects.hide();
		this.waitCss(function() {
			if(parent.width() == 0 || !parent.parents(":last")["is"]("html")) return;
			parent.addClass("tid_parsed");
			var w = parent.innerWidth();
			objects.each(function() {
				var e2 = js.JQuery(this);
				e2.addClass("tid_parsed");
				e2.show();
				if(e2["is"]("iframe")) e2.wrap("<div class='tid_iframeWrapper'></div>").parent();
				if(e2.width() > w) {
					var preview = tid_Boot.j("<div class=\"tid_bigObject\"></div>");
					preview.click(function(evt) {
						_g.popHtml(e2);
					});
					preview.insertBefore(e2);
					e2.detach();
				}
			});
		},false);
	}
	,draftKey: function(key) {
		var t;
		if(this.session == null) t = null; else t = this.session.tid;
		return "tw_draft_" + t + "_" + key;
	}
	,storeDraft: function(key,content) {
		try {
			if(this.store != null) this.store.setItem(this.draftKey(key),content);
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
		}
	}
	,clearDraft: function(key) {
		if(this.store != null) this.store.removeItem(this.draftKey(key));
	}
	,restoreDraft: function(key) {
		if(this.store != null) return this.store.getItem(this.draftKey(key));
		return null;
	}
	,getSidePanel: function(side) {
		return tid_Boot.j("#tid_sidePanel_" + side);
	}
	,toggleSidePanel: function(side) {
		this.setSidePanel(side,!tid_Boot.j("#tid_sidePanel_" + side).hasClass("tid_open"));
	}
	,onOverLeftCorner: function(e) {
		if(this.isLocked || this.overCornerButton) return;
		if(!this.checkCornerClick("left",e)) return;
		this.overCornerButton = true;
		tid_Boot.j("#tid_openLeft").addClass("tid_blockLogoOver");
		this.setSideDelay("twinoid",true,200);
	}
	,onOverRightCorner: function(e) {
		if(this.isLocked || this.overCornerButton) return;
		if(!this.checkCornerClick("right",e)) return;
		this.overCornerButton = true;
		tid_Boot.j("#tid_openRight").addClass("tid_blockNameOver");
		this.setSideDelay("user",true,200);
	}
	,checkCornerClick: function(side,e) {
		if(Modernizr == null || !Modernizr.touch || e == null) return true;
		var delay = 100;
		var t = new Date().getTime();
		var pos = e.pageX + ";" + e.pageY;
		var res = false;
		switch(side) {
		case "left":case "twinoid":
			res = this.cornerClicks.left != pos;
			this.cornerClicks.left = pos;
			break;
		case "right":case "user":
			res = this.cornerClicks.right != pos;
			this.cornerClicks.right = pos;
			break;
		default:
			return false;
		}
		return res;
	}
	,onLeaveLeftCornerButton: function(_) {
		this.overCornerButton = false;
		tid_Boot.j("#tid_openLeft").removeClass("tid_blockLogoOver");
	}
	,onLeaveRightCornerButton: function(_) {
		this.overCornerButton = false;
		tid_Boot.j("#tid_openRight").removeClass("tid_blockNameOver");
	}
	,onOverPanel: function(_) {
		this.overPanel = true;
	}
	,onLeavePanel: function(_) {
		this.overPanel = false;
	}
	,setSideDelay: function(s,show,delay) {
		var _g = this;
		var isOpen = this.isOpenSidePanel(s);
		if(show && isOpen || !show && !isOpen) return;
		haxe_Timer.delay(function() {
			if(show && _g.overCornerButton) _g.setSidePanel(s,show);
			if(!show && !_g.overPanel) _g.setSidePanel(s,show);
		},delay);
	}
	,showSidePanel: function(side,e) {
		if(!this.checkCornerClick(side,e)) return;
		this.setSidePanel(side,true);
	}
	,closeLeftPanel: function(e) {
		if(!this.checkCornerClick("left",e)) return false;
		this.setSidePanel("twinoid",false);
		return false;
	}
	,closeRightPanel: function(e) {
		if(!this.checkCornerClick("right",e)) return false;
		this.setSidePanel("user",false);
		return false;
	}
	,hideSidePanel: function(side) {
		this.setSidePanel(side,false);
	}
	,hidePanel: function() {
		var o = tid_Boot.j(".tid_sidePanel.tid_open");
		if(o.length > 0) this.hideSidePanel(o.data("side"));
	}
	,isOpenSidePanel: function(side) {
		return tid_Boot.j("#tid_sidePanel_" + side).hasClass("tid_open");
	}
	,setSidePanel: function(side,open) {
		var _g = this;
		if(open && this.cbSidePanel != null) {
			var cb = this.cbSidePanel;
			this.cbSidePanel = null;
			cb();
		}
		var panel = tid_Boot.j("#tid_sidePanel_" + side);
		panel.bind("mouseleave.uniq",function(e) {
			_g.setSideDelay(side,false,900);
		});
		panel.data("side",side);
		var noclick = tid_Boot.j("#tid_panelNoclick");
		if(open && panel.hasClass("tid_open")) return;
		if(!open && !panel.hasClass("tid_open")) return;
		if(open) {
			if(noclick.length == 0) {
				noclick = tid_Boot.j("<div id=\"tid_panelNoclick\" class=\"tid_noclick\"/>");
				noclick.click(function(e1) {
					e1.preventDefault();
					e1.stopPropagation();
					_g.hidePanel();
				});
				tid_Boot.j("body").prepend(noclick);
			}
			panel.addClass("tid_open");
			panel.find(".tid_sidePanelContent").html("");
			switch(side) {
			case "twinoid":
				tid_Boot.j("#tid_sidePanel_" + "user").removeClass("tid_open");
				break;
			case "user":
				tid_Boot.j("#tid_sidePanel_" + "twinoid").removeClass("tid_open");
				break;
			}
			var loadCont = panel.children(".tid_sidePanelContent");
			loadCont.html(this.loadingHTML());
			this.onLoad(panel);
			this.loadPanel(panel,side);
			this.hideUnderSwf(panel);
		} else {
			panel.find(".tid_sidePanelContent").html("");
			noclick.remove();
			panel.removeClass("tid_open");
			this.showUnderSwf();
		}
	}
	,loadPanel: function(p,side,args) {
		if(args == null) args = { };
		var cont = p.children(".tid_sidePanelContent");
		this.loadJS("/bar/" + side,args);
		this.initMouseScroll(p.find(".tid_sidePanelScrollable"));
	}
	,showAllGames: function(link) {
		if(tid_Boot.j(window).innerHeight() <= 600) return true; else {
			link.replaceWith(this.loadingHTML());
			this.loadPanel(tid_Boot.j("#tid_sidePanel_" + "twinoid"),"twinoid",{ allGames : true});
			return false;
		}
	}
	,fillSidePanel: function(side) {
		var _g = this;
		var panel = tid_Boot.j("#tid_sidePanel_" + side);
		return function(html) {
			html = _g.addNamespace(html,"tid_");
			panel.children(".tid_sidePanelContent").html(html);
			_g.initMouseScroll(panel.find(".tid_sidePanelScrollable"));
			_g.onLoad(panel);
		};
	}
	,initMouseScroll: function(q) {
		if(q.hasClass("tid_scrollInit")) return;
		q.addClass("tid_scrollInit");
		this.onResize();
		var scrollDelta = function(d) {
			var st = q.scrollTop();
			var maxScroll = q[0].scrollHeight - q.height();
			var nst = st - d;
			if(nst < 0) nst = 0; else if(nst > maxScroll) nst = maxScroll;
			if(st != nst) {
				q.scrollTop(nst);
				return true;
			}
			return false;
		};
		q.bind("mousewheel.tidscroll",function(e1) {
			scrollDelta(e1.originalEvent.wheelDelta / 2);
			e1.preventDefault();
			e1.stopPropagation();
		});
		var onFFScroll = function(e) {
			if(tid_Boot.mouseIsOver({ x : e.pageX, y : e.pageY},q)) {
				scrollDelta(e.detail * -20);
				e.preventDefault();
				e.stopPropagation();
			}
		};
		if(($_=window,$bind($_,$_.addEventListener)) != null) window.addEventListener("DOMMouseScroll",onFFScroll);
	}
	,nme: function(script) {
		var win = window;
		var l = win.NMEQ;
		win.NMEQ = function() {
			if(l != null) l();
			win.NME.call(script);
			win.NMEQ = null;
		};
		if(win.NME != null) win.NMEQ();
	}
	,ieVersion: function() {
		try {
			
			if (window.ActiveXObject === undefined) return null;
			if (!document.querySelector) return 7;
			if (!document.addEventListener) return 8;
			if (!window.atob) return 9;
			if (!document.__proto__) return 10;
			;
			return 11;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return null;
		}
	}
	,__class__: tid_Boot
};
var tid_Contact = function(s) {
	this.s = s;
};
$hxClasses["tid.Contact"] = tid_Contact;
tid_Contact.__name__ = ["tid","Contact"];
tid_Contact.prototype = {
	update: function(s) {
		this.s = s;
		this.h = null;
	}
	,getList: function() {
		if(this.h == null) this.h = new tid_ContactDecoder(this.s).read();
		return this.h;
	}
	,has: function(uid,isFriend) {
		if(isFriend == null) isFriend = false;
		if(isFriend) return ((function($this) {
			var $r;
			var this1 = $this.getList();
			$r = this1.get(uid);
			return $r;
		}(this)) & 1) > 0; else {
			var this2 = this.getList();
			return this2.exists(uid);
		}
	}
	,hash: function() {
		return haxe_crypto_Md5.encode(this.s == null?"":this.s);
	}
	,__class__: tid_Contact
};
var tid_ContactDecoder = function(data) {
	if(data == null) this.data = ""; else this.data = data;
	this.pos = 0;
	this.nbits = 0;
	this.bits = 0;
};
$hxClasses["tid.ContactDecoder"] = tid_ContactDecoder;
tid_ContactDecoder.__name__ = ["tid","ContactDecoder"];
tid_ContactDecoder.initInvChars = function() {
	var a = [];
	var _g = 0;
	while(_g < 64) {
		var i = _g++;
		a[HxOverrides.cca(tid_ContactDecoder.ENCODE,i)] = i;
	}
	return a;
};
tid_ContactDecoder.prototype = {
	_r: function(n) {
		while(this.nbits < n) {
			var c = tid_ContactDecoder.DECODE[(function($this) {
				var $r;
				var index = $this.pos++;
				$r = HxOverrides.cca($this.data,index);
				return $r;
			}(this))];
			if(c == null) throw new js__$Boot_HaxeError("EOF");
			this.nbits += 6;
			this.bits <<= 6;
			this.bits |= c;
		}
		this.nbits -= n;
		return this.bits >> this.nbits & (1 << n) - 1;
	}
	,read: function() {
		var len = this.data.length;
		var h = new haxe_ds_IntMap();
		while(this.pos < len) {
			var k = this._r(29);
			var v = this._r(1);
			h.h[k] = v;
		}
		return h;
	}
	,__class__: tid_ContactDecoder
};
var tid_Editor = function(name) {
	this.name = name;
	this.config = { icons : new List(), buttons : [], tags : new haxe_ds_StringMap(), codes : new haxe_ds_StringMap(), fun : null, funTitle : "", linkTarget : "_blank", header : "", footer : "", uids : new haxe_ds_StringMap(), imgUp : "", modes : null, frpl : null};
	this.classPrefix = "tid_";
};
$hxClasses["tid.Editor"] = tid_Editor;
tid_Editor.__name__ = ["tid","Editor"];
tid_Editor.escapeEreg = function(s) {
	return tid_Editor.REG_ESCAPEREG.replace(s,"\\$1");
};
tid_Editor.init = function() {
	var a = window._tid_editorInit;
	if(a == null) return;
	var _g = 0;
	while(_g < a.length) {
		var c = a[_g];
		++_g;
		var e = new tid_Editor(c[0]);
		e.loadConfig(c[1]);
		e.initInput(c[2],c[3]);
		Reflect.setField(window,"editor_" + Std.string(c[0]),e);
	}
	window._tid_editorInit = null;
};
tid_Editor.j = function(r) {
	return js.JQuery(r);
};
tid_Editor.textToUrl = function(text) {
	text = mt_Utf8.removeAccents(text);
	text = StringTools.replace(text,"&nbsp;"," ");
	text = new EReg("[^a-z0-9]+","g").replace(text.toLowerCase(),"-");
	while(HxOverrides.cca(text,0) == 45) text = HxOverrides.substr(text,1,null);
	while(text.length > 0 && HxOverrides.cca(text,text.length - 1) == 45) text = HxOverrides.substr(text,0,text.length - 1);
	return text;
};
tid_Editor.prototype = {
	initIcons: function() {
		if(this.hIcons != null) return;
		this.hIcons = new haxe_ds_StringMap();
		var a = [];
		var _g_head = this.config.icons.h;
		var _g_val = null;
		while(_g_head != null) {
			var cat;
			cat = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			var _g_head1 = cat.icons.h;
			var _g_val1 = null;
			while(_g_head1 != null) {
				var icon;
				icon = (function($this) {
					var $r;
					_g_val1 = _g_head1[0];
					_g_head1 = _g_head1[1];
					$r = _g_val1;
					return $r;
				}(this));
				var itag = StringTools.htmlEscape(icon.tag,true);
				icon.initMax = icon.max;
				var o = { icon : icon, url : cat.url + icon.image};
				a.push(tid_Editor.escapeEreg(itag));
				this.hIcons.set(itag,o);
				if(icon.alt != null) {
					var ialt = StringTools.htmlEscape(icon.alt,true);
					var ealt = this.hIcons.get(ialt);
					if(cat.active || ealt == null) {
						if(ealt == null) a.push(tid_Editor.escapeEreg(ialt)); else ealt.icon.alt = null;
						this.hIcons.set(ialt,o);
					} else icon.alt = null;
				}
			}
		}
		this.regIcons = [];
		while(a.length > 0) this.regIcons.push(new EReg("(" + a.splice(0,1000).join("|") + ")","g"));
	}
	,initRegUsers: function() {
		if(this.regUsers != null) return;
		var a = ["[A-Za-z0-9_-]*(:[0-9]+)?"];
		var $it0 = this.config.uids.keys();
		while( $it0.hasNext() ) {
			var k = $it0.next();
			a.push(tid_Editor.escapeEreg(k));
		}
		this.regUsers = new EReg("\\B@(" + a.join("|") + ")","g");
	}
	,initFormat: function() {
		this.initIcons();
		this.initRegUsers();
		this.tf = new tid_Format();
		this.tf.formatCode = $bind(this,this.formatCode);
		this.tf.formatTag = $bind(this,this.formatTag);
		this.tf.formatPlainText = $bind(this,this.formatPlainText);
	}
	,formatCode: function(code,attrib,content) {
		var _g = this;
		if(!this.config.codes.exists(code)) return null;
		if(code.toLowerCase() == "question") {
			if(content == "") return "";
			var questions = Lambda.array(StringTools.trim(content).split("\n").map(function(q) {
				return _g.formatPlainText(q);
			}).filter(function(q1) {
				return q1 != "";
			}));
			var s = "<div class=\"" + this.classPrefix + "questionModule\"><div>";
			var _g1 = 0;
			while(_g1 < questions.length) {
				var q2 = questions[_g1];
				++_g1;
				s += "<div class=\"" + this.classPrefix + "questionLine\">" + q2 + "</div>";
			}
			s += "</div></div>";
			return s;
		}
		var h = this.config.codes.get(code);
		if(h == "::table::") {
			var b = new StringBuf();
			b.b += Std.string("<table class=\"" + this.classPrefix + code + "\">");
			var _g2 = 0;
			var _g11 = content.split("\n");
			while(_g2 < _g11.length) {
				var l = _g11[_g2];
				++_g2;
				var a = l.split("|");
				if(a.length < 2) continue;
				b.b += "<tr>";
				var _g21 = 0;
				while(_g21 < a.length) {
					var e = a[_g21];
					++_g21;
					b.b += "<td>";
					b.add(this.formatPlainText(e));
					b.b += "</td>";
				}
				b.b += "</tr>";
			}
			b.b += "</table>";
			h = b.b;
		} else {
			if(h.indexOf("::content::") >= 0) h = h.split("::content::").join(content);
			if(h.indexOf("::escapedContent::") >= 0) h = h.split("::escapedContent::").join(StringTools.htmlEscape(content,true));
			if(h.indexOf("::attr::") >= 0) h = h.split("::attr::").join(attrib == null?"":attrib);
			if(h.indexOf("::node::") >= 0) h = h.split("::node::").join(code);
		}
		return h;
	}
	,formatTag: function(t,attrib,span) {
		var c = this.config.tags.get(t);
		if(c != null) {
			var wrap = null;
			var pre = "";
			if(c == "cite" && attrib != null && attrib != "") pre = "<span class=\"" + this.classPrefix + "preCite\">" + this.formatPlainText(attrib) + "</span>";
			if(c == ">class=\"roleplay\"" && attrib != null && attrib != "") pre = "<span class=\"" + this.classPrefix + "preRoleplay\">" + this.formatPlainText(attrib) + "</span>";
			if(c == "a") {
				var url;
				if(attrib == null || !tid_Editor.REG_LNK.match(attrib)) url = "#"; else url = tid_Editor.REG_LNK.matched(1);
				var inf = this.simplifyUrl({ url : url, target : this.config.linkTarget, title : ""});
				c += " target=\"" + inf.target + "\" href=\"" + inf.url + "\"";
			} else if(HxOverrides.substr(c,0,1) == " " || HxOverrides.substr(c,0,1) == ">") {
				if(HxOverrides.substr(c,0,1) == ">") wrap = HxOverrides.substr(c,1,null).split("class=\"").join("class=\"" + this.classPrefix + "w");
				c = (span?"span ":"div ") + HxOverrides.substr(c,1,null).split("class=\"").join("class=\"" + this.classPrefix);
			}
			return [pre + "<" + c + ">" + (wrap != null?"<span " + wrap + ">":""),(wrap != null?"</span>":"") + "</" + c.split(" ")[0] + ">"];
		} else {
			if(this.config.tags.exists("_span")) {
				if(span) return ["<span class=\"" + this.classPrefix + t + "\">","</span>"]; else return ["<div class=\"" + this.classPrefix + t + "\">","</div>"];
			}
			return null;
		}
	}
	,formatFunTag: function(t) {
		if(this.config.fun == null) return "{" + t + "}";
		var a = t.split(":");
		var i = this.config.fun.get(a[0]);
		if(i == null) return "{" + t + "}";
		var value = "??";
		var _g = i.t;
		switch(_g) {
		case "regspan":
			var arg;
			if(a[1] == null) arg = ""; else arg = a[1];
			var r = new EReg("^" + i.v + "$","");
			if(r.match(a[1])) value = a[1]; else return "{" + t + "}";
			break;
		}
		return "<span class=\"" + this.classPrefix + "funTag " + this.classPrefix + "funTag_" + i.i + "\">" + StringTools.htmlEscape(value,true) + "</span>";
	}
	,simplifyUrl: function(inf) {
		return inf;
	}
	,mkImageNode: function(ref,className) {
		var urlPrefix = this.config.imgUp;
		if(StringTools.startsWith(ref,"http://") || StringTools.startsWith(ref,"https://") || StringTools.startsWith(ref,"//")) urlPrefix = "";
		return "<img src=\"" + urlPrefix + ref + "\" class=\"" + this.classPrefix + "img" + (className != null?" " + this.classPrefix + className:"") + "\"/>";
	}
	,formatPlainText: function(t) {
		var _g = this;
		t = StringTools.htmlEscape(t,true);
		t = t.split(" !").join("&nbsp;!").split(" :").join("&nbsp;:").split(" ?").join("&nbsp;?");
		var sections = [];
		var addSection = function(str) {
			var r = "<s:" + sections.length + "/>";
			sections.push(str);
			return r;
		};
		if(this.config.tags.exists("_absimg")) {
			t = new EReg("@(https://([A-Za-z0-9_/.]+))@","g").map(t,function(r1) {
				return addSection(_g.mkImageNode(r1.matched(1)));
			});
			var dataHost = "//" + window._tid.dataHost;
			t = new EReg("@http://([A-Za-z0-9_/.]+?(\\.png|\\.jpg|\\.gif))@","ig").map(t,function(r2) {
				return addSection(_g.mkImageNode(dataHost + "/proxy/" + r2.matched(1)));
			});
		}
		if(this.config.tags.exists("link")) t = tid_Editor.REG_URL.map(t,function(r3) {
			var url = r3.matched(1);
			var inf = _g.simplifyUrl({ url : url, target : _g.config.linkTarget, title : url.length > 40?HxOverrides.substr(url,0,37) + "...":url});
			return addSection("<a href=\"" + inf.url + "\" target=\"" + inf.target + "\">" + StringTools.htmlEscape(inf.title,true) + "</a>");
		});
		t = new EReg("\\{([A-Za-z0-9:,]+)\\}","g").map(t,function(r4) {
			return addSection(_g.formatFunTag(r4.matched(1)));
		});
		var _g1 = 0;
		var _g11 = this.regIcons;
		while(_g1 < _g11.length) {
			var r5 = _g11[_g1];
			++_g1;
			t = r5.map(t,function(r6) {
				var t1 = r6.matched(1);
				if(!_g.hIcons.exists(t1)) return t1;
				var o = _g.hIcons.get(t1);
				if(o.icon.max != null) {
					if(o.icon.max <= 0) return t1;
					o.icon.max--;
				}
				return addSection("<img src=\"" + o.url + "\" alt=\"" + t1 + "\" class=\"" + _g.classPrefix + (o.icon.ico?"ico":"img") + "\"/>");
			});
		}
		t = new EReg("<s:([0-9]+)/>","g").map(t,function(r7) {
			return sections[Std.parseInt(r7.matched(1))];
		});
		if(this.config.tags.exists("_img")) t = new EReg("@([A-Za-z0-9_/.]+)(:([A-Za-z0-9_]+))?@","g").map(t,function(r8) {
			return _g.mkImageNode(r8.matched(1),r8.matched(3));
		});
		t = this.regUsers.map(t,function(r9) {
			var s = r9.matched(1);
			var id = null;
			var name = null;
			if(_g.config.uids.exists(s)) id = _g.config.uids.get(s); else {
				var a = s.split(":");
				if(a[1] != null && Std.parseInt(a[1]) != null) id = Std.parseInt(a[1]); else name = a[0];
			}
			if(id != null) {
				var rname = window._tid.getUserName(id);
				if(rname == "..." && name != null) rname = name;
				return "<span class=\"" + _g.classPrefix + "user\" tid_bg=\"1\" tid_id=\"" + id + "\">" + StringTools.htmlEscape(rname,true) + "</span>";
			} else if(name != null) {
				var u = window._tid.getUserByName(name);
				if(u != null) return "<span class=\"" + _g.classPrefix + "user\" tid_bg=\"1\" tid_id=\"" + u.id + "\">" + StringTools.htmlEscape(u.name,true) + "</span>";
			}
			return "@" + s;
		});
		return t;
	}
	,format: function(txt) {
		this.text = txt;
		if(this.tf == null) this.initFormat(); else {
			var _g_head = this.config.icons.h;
			var _g_val = null;
			while(_g_head != null) {
				var c;
				c = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				var _g_head1 = c.icons.h;
				var _g_val1 = null;
				while(_g_head1 != null) {
					var i;
					i = (function($this) {
						var $r;
						_g_val1 = _g_head1[0];
						_g_head1 = _g_head1[1];
						$r = _g_val1;
						return $r;
					}(this));
					i.max = i.initMax;
				}
			}
		}
		var r = this.tf.format(this.config.header + txt + this.config.footer);
		if(this.smileysPanel != null) {
			var _g_head2 = this.config.icons.h;
			var _g_val2 = null;
			while(_g_head2 != null) {
				var c1;
				c1 = (function($this) {
					var $r;
					_g_val2 = _g_head2[0];
					_g_head2 = _g_head2[1];
					$r = _g_val2;
					return $r;
				}(this));
				var _g_head3 = c1.icons.h;
				var _g_val3 = null;
				while(_g_head3 != null) {
					var i1;
					i1 = (function($this) {
						var $r;
						_g_val3 = _g_head3[0];
						_g_head3 = _g_head3[1];
						$r = _g_val3;
						return $r;
					}(this));
					if(i1.max != null) this.smileysPanel.find(".tid_max_" + i1.tag.split(":").join("")).html(i1.max == null?"null":"" + i1.max);
				}
			}
		}
		this.afterFormat(this);
		return { html : r, text : this.text};
	}
	,afterFormat: function(e) {
	}
	,loadConfig: function(str) {
		this.config = haxe_Unserializer.run(str);
	}
	,insert: function(txt) {
		this.quoteSelection(txt,"");
	}
	,insertImage: function(url) {
		this.insert("@" + url + "@");
	}
	,getSelection: function() {
		var sel = new js_Selection(this.input[0]);
		var r = sel.get();
		if(r == null) r = "";
		return r;
	}
	,quoteSelection: function(begin,end) {
		var sel = new js_Selection(this.input[0]);
		sel.insert(begin,sel.get(),end);
		this.updatePreview(null);
	}
	,replaceSelection: function(txt) {
		var sel = new js_Selection(this.input[0]);
		sel.insert("",txt,"");
		this.updatePreview(null);
	}
	,initInput: function(styleButtons,smileyButtons) {
		if(smileyButtons == null) smileyButtons = true;
		if(styleButtons == null) styleButtons = true;
		this.initFastReplace();
		this.input = js.JQuery("#" + this.name);
		this.initPreview();
		if(styleButtons) this.initButtons();
		if(smileyButtons) this.initSmileys();
		if(!this.input.hasClass("noAutoFocus") && !this.input.hasClass("tid_noAutoFocus")) try {
			var sel = new js_Selection(this.input[0]);
			var l = this.input.val().length;
			sel.select(l,l);
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
		}
	}
	,initButtons: function() {
		var _g = this;
		var s_b = "";
		s_b += "<div class=\"tid_buttonBar tid_editorButtons\">";
		var _g1 = 0;
		var _g2 = this.config.buttons.length;
		while(_g1 < _g2) {
			var i = _g1++;
			var b = this.config.buttons[i];
			s_b += Std.string("<a href=\"#\" class=\"tid_editorButton tid_editorBut_" + b.node + "\" tid_idx=\"" + i + "\">" + b.title + "</a>");
		}
		s_b += "<div class='tid_clear'></div>";
		s_b += "</div>";
		var buttons = js.JQuery(s_b);
		buttons.find("a.tid_editorButton").click(function() {
			var idx = Std.parseInt(js.JQuery(this).attr("tid_idx"));
			var but = _g.config.buttons[idx];
			var _g11 = but.node;
			switch(_g11) {
			case "question":
				var sel = _g.getSelection();
				var p = but.prompt.split(";");
				if(sel == "") {
					var questions = [window.prompt(p[0],"")];
					var a;
					var noMore = false;
					do {
						var a1 = window.prompt(p[1],"");
						noMore = a1 == null || a1 == "";
						if(!noMore) questions.push(a1);
					} while(!noMore);
					_g.insert("<question>\n" + questions.join("\n") + "\n</question>");
				} else _g.quoteSelection("<question>","</question>");
				break;
			case "link":
				var sel1 = _g.getSelection();
				var p1 = but.prompt.split(";");
				if(sel1 == "") {
					var u = window.prompt(p1[0],"http://");
					var t = window.prompt(p1[1],"");
					if(u != null && t != null) _g.insert("[link=" + u + "]" + t + "[/link]");
				} else if(tid_Editor.REG_URL.match(sel1) && tid_Editor.REG_URL.matched(0) == sel1) {
					var t1 = window.prompt(p1[1],"");
					if(t1 != null) _g.replaceSelection("[link=" + sel1 + "]" + t1 + "[/link]");
				} else {
					var u1 = window.prompt(p1[0],"http://");
					if(u1 != null) _g.quoteSelection("[link=" + u1 + "]","[/link]");
				}
				break;
			case "rp":
				var t2 = window.prompt(but.prompt,"");
				if(t2 != null && t2 != "") _g.quoteSelection("[" + but.node + "=" + t2 + "]","[/" + but.node + "]"); else _g.quoteSelection("[" + but.node + "]","[/" + but.node + "]");
				break;
			case "_span":
				var t3 = window.prompt(but.prompt,"");
				if(t3 != null && t3 != "") _g.quoteSelection("[" + t3 + "]","[/" + t3 + "]");
				break;
			case "_user":
				_g.initUserSearch();
				break;
			case "_li":
				_g.insert("\n * ");
				break;
			case "_img":
				var cb = function(img) {
					if(img != null && img != "") _g.insertImage(img);
				};
				_tid.uploadImage(cb);
				break;
			default:
				if(but.code) _g.quoteSelection("<" + but.node + ">","</" + but.node + ">"); else if(but["short"] != null) _g.quoteSelection(but["short"],but["short"]); else _g.quoteSelection("[" + but.node + "]","[/" + but.node + "]");
			}
			return false;
		});
		if(this.config.tags.exists("_img")) window._tid.initDropZone(this.input,"site=twinoid",function(url,error) {
			if(!error && url != null && url != "") _g.insertImage(url);
		});
		this.input.before(buttons);
	}
	,initUserSearch: function() {
		var q = this.input.siblings(".tid_editorUserSearch");
		if(q.length > 0) {
			q.remove();
			return;
		}
		var form = js.JQuery("<form class=\"tid_editorUserSearch\" onsubmit=\"editor_" + this.name + ".insert('@'+$(this).find('[name=tid_editorUSearch_" + this.name + "_name]').val()+':'+$(this).find('[name=tid_editorUSearch_" + this.name + "]').val()); editor_" + this.name + ".initUserSearch(); _tid.stopEvent(event); return false;\"><input type=\"text\" class=\"tid_userSearch\" name=\"tid_editorUSearch_" + this.name + "\"/></form>");
		this.input.before(form);
		this.onLoad();
		form.find("input.tid_userSearch").focus();
	}
	,initSmileys: function() {
		var _g = this;
		var s = new StringBuf();
		s.b += "<div class=\"tid_smileyPanel\">";
		var _g_head = this.config.icons.h;
		var _g_val = null;
		while(_g_head != null) {
			var cat;
			cat = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			s.add("<a href=\"#\" tid_cat=\"" + StringTools.htmlEscape(cat.category,true) + "\" class=\"tid_smcat\" onclick=\"return false;\"><span class=\"tid_drop\"></span><img src=\"" + cat.url + cat.image + "\" title=\"" + StringTools.htmlEscape(cat.category,true) + "\"/></a>");
		}
		if(this.config.fun != null) s.add("<a href=\"#\" tid_cat=\"_funtag\" class=\"tid_smcat\" onclick=\"return false;\"><span class=\"tid_drop\"></span><img src=\"//data." + _tid.host + "/img/icons/dice.png\" title=\"" + StringTools.htmlEscape(this.config.funTitle,true) + "\"/></a>");
		s.b += "<div class=\"tid_clear\"></div>";
		s.b += "</div>";
		this.smileysPanel = js.JQuery(s.b);
		this.smileysPanel.find(".tid_smcat").click(function() {
			return _g.loadSmileys(js.JQuery(this));
		});
		this.input.after(this.smileysPanel);
	}
	,loadSmileys: function(q) {
		var _g = this;
		this.initIcons();
		if(this.smileysPanel.find(".tid_active").removeClass("tid_active")["is"](q)) return this.hideSmileys(true);
		this.hideSmileys(false);
		var cid = q.attr("tid_cat");
		var cat = null;
		if(cid != "_funtag") {
			var _g_head = this.config.icons.h;
			var _g_val = null;
			while(_g_head != null) {
				var c;
				c = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				if(c.category == cid) {
					cat = c;
					break;
				}
			}
			if(cat == null) return false;
		}
		var s = new StringBuf();
		s.b += "<div class=\"tid_smileyPopUp\">";
		if(cid == "_funtag") {
			s.b += Std.string("<div class=\"tid_title\">" + this.config.funTitle + "</div>");
			var keys = [];
			var $it0 = this.config.fun.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				keys.push(k);
			}
			keys.sort(function(a,b) {
				return Reflect.compare(a,b);
			});
			var _g1 = 0;
			while(_g1 < keys.length) {
				var k1 = keys[_g1];
				++_g1;
				s.add("<a class=\"tid_fun\" href=\"#\" tid_s=\"" + StringTools.htmlEscape("{" + k1 + "}") + "\"><img src=\"//data." + _tid.host + "/img/icons/" + this.config.fun.get(k1).i + ".png\" alt=\"" + k1 + "\" title=\"" + StringTools.htmlEscape(this.config.fun.get(k1).n) + "\"/>" + StringTools.htmlEscape(this.config.fun.get(k1).n) + "</a>");
			}
		} else {
			s.b += Std.string("<div class=\"tid_title\">" + cat.category + "</div>");
			s.b += "<div class=\"tid_wrapper\">";
			var _g_head1 = cat.icons.h;
			var _g_val1 = null;
			while(_g_head1 != null) {
				var i;
				i = (function($this) {
					var $r;
					_g_val1 = _g_head1[0];
					_g_head1 = _g_head1[1];
					$r = _g_val1;
					return $r;
				}(this));
				var str = i.tag;
				var desc = i.tag;
				if(i.alt != null) {
					str = i.alt;
					desc = i.alt + ", " + i.tag;
				}
				var mh = "";
				if(i.max != null) mh += "<span class=\"tid_max tid_max_" + i.tag.split(":").join("") + "\">" + i.max + "</span>";
				s.add("<a class=\"tid_smiley\" href=\"#\">" + mh + "<img src=\"" + cat.url + i.image + "\" tid_s=\"" + StringTools.htmlEscape(str,true) + "\" title=\"" + StringTools.htmlEscape(desc,true) + "\"/></a>");
			}
			s.b += "</div>";
		}
		s.b += "<div class=\"tid_clear\"></div>";
		s.b += "</div>";
		q.addClass("tid_active");
		var pop = js.JQuery(s.b);
		q.parent().append(pop);
		pop.hide().slideDown(200);
		if(cid == "_funtag") pop.find("a.tid_fun").click(function() {
			_g.insert(js.JQuery(this).attr("tid_s"));
			return false;
		}); else pop.find("a.tid_smiley").click(function() {
			var m = js.JQuery(this).find(".tid_max");
			if(m.length > 0 && Std.parseInt(m.html()) == 0) return false;
			_g.insert(js.JQuery(this).find("img").attr("tid_s"));
			return false;
		});
		return false;
	}
	,hideSmileys: function(anim) {
		this.smileysPanel.find(".tid_active").removeClass("tid_active");
		if(anim) {
			var pop = this.smileysPanel.find(".tid_smileyPopUp");
			pop.slideUp(200,function() {
				pop.remove();
			});
		} else this.smileysPanel.find(".tid_smileyPopUp").remove();
		return false;
	}
	,initPreview: function() {
		var _g = this;
		this.preview = js.JQuery("#" + this.name + "_preview");
		if(this.preview.length == 0) this.preview = null;
		this.content = "";
		var t = new haxe_Timer(500);
		t.run = function() {
			_g.updatePreview(null);
		};
		this.input.keyup($bind(this,this.updatePreview));
		this.input.blur($bind(this,this.updatePreview));
		this.updatePreview(null);
	}
	,initFastReplace: function() {
		if(this.regFrpl != null || this.config.frpl == null) return;
		this.regFrpl = new EReg("\\B%%([A-Za-z0-9_-]+)(\\s)","i");
	}
	,updatePreview: function(_) {
		var _g = this;
		var v = this.input.val();
		if(v == this.content) return;
		if(this.config.frpl != null) {
			var nv = this.regFrpl.map(v,function(r) {
				var k = r.matched(1).toLowerCase();
				if(_g.config.frpl.exists(k)) return _g.config.frpl.get(k).text + r.matched(2); else {
					var l = k.length;
					var c = 0;
					var nk = null;
					var $it0 = _g.config.frpl.keys();
					while( $it0.hasNext() ) {
						var s = $it0.next();
						if(HxOverrides.substr(s,0,l) == k) {
							c++;
							if(c == 1) nk = s; else {
								nk = null;
								break;
							}
						}
					}
					if(nk != null) return _g.config.frpl.get(nk).text + r.matched(2);
					return r.matched(0);
				}
			});
			if(v != nv) {
				v = nv;
				this.input.val(nv);
			}
		}
		this.content = v;
		if(this.config.frpl != null) {
			var r1 = new EReg("\\B%%([A-Za-z0-9_-]*?)$","");
			if(r1.match(this.content)) this.showFastReplHelp(r1.matched(1)); else this.hideFastReplHelp();
		}
		if(this.preview != null) this.preview.html(this.format(v).html);
		this.onLoad();
	}
	,showFastReplHelp: function(start) {
		var _g = this;
		if(this.qFrpl == null) this.qFrpl = js.JQuery("<div class=\"tid_editorFastRepl\"></div>").insertBefore(this.input);
		var s_b = "";
		start = start.toLowerCase();
		var l = start.length;
		var $it0 = this.config.frpl.keys();
		while( $it0.hasNext() ) {
			var k = $it0.next();
			if(l > 0 && HxOverrides.substr(k,0,l) != start) continue;
			var o = this.config.frpl.get(k);
			var ke = HxOverrides.substr(o.key,l,null);
			var kh;
			if(l == 0) kh = StringTools.htmlEscape(o.key); else kh = "<strong>" + StringTools.htmlEscape(HxOverrides.substr(o.key,0,l)) + "</strong>" + StringTools.htmlEscape(ke);
			var x = o.text;
			var tip = StringTools.htmlEscape(x).split("\"").join("&quot;").split("\n").join("<br/>") + "<br/><em>(" + o.grp + ")</em>";
			var html = "<div>" + "<a class=\"tid_edit\" href=\"//" + _tid.host + "/fastReplace/edit/" + o.id + "\" target=\"_blank\">edit</a>" + "<a href=\"" + ke + "\" class=\"tid_fk tid_tip\" title=\"" + StringTools.htmlEscape(tip) + "\">" + "<span>" + kh + " </span>" + StringTools.htmlEscape(HxOverrides.substr(x,0,30)) + "</a>" + "</div>";
			if(html == null) s_b += "null"; else s_b += "" + html;
		}
		this.qFrpl.html("<div class=\"tid_list\">" + s_b + "</div><a href=\"//" + _tid.host + "/fastReplace\" target=\"_blank\">Editer</a>");
		this.qFrpl.find("a.tid_fk").bind("click",function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			_g.insert(js.JQuery(this).attr("href") + " ");
		});
	}
	,hideFastReplHelp: function() {
		if(this.qFrpl != null) {
			this.qFrpl.remove();
			this.qFrpl = null;
		}
	}
	,onLoad: function() {
		if(this.preview != null) this.preview.closest(".tid_editorContent").removeClass("tid_parsed").addClass("tid_speedFit");
		if(window._tid != null) window._tid.onLoad();
	}
	,__class__: tid_Editor
};
var tid_Facebook = function(boot) {
	this.boot = boot;
	this.init();
};
$hxClasses["tid.Facebook"] = tid_Facebook;
tid_Facebook.__name__ = ["tid","Facebook"];
tid_Facebook.prototype = {
	init: function() {
		if(window.FB == null) {
			window.alert("FB SDK missing");
			return;
		}
		if(!this.isInited) {
			this.isInited = true;
			window.FB.init({ appId : this.boot.infos.fbApp, frictionlessRequests : true, status : true, version : "v2.1", hideFlashCallback : $bind(this,this.hideFlashCallback)});
			window.FB.Event.subscribe("auth.statusChange",$bind(this,this.onStatusChange));
		}
	}
	,hideFlashCallback: function(info) {
		if(info.state == "opened") this.boot.hideUnderSwf(js.JQuery("body")); else this.boot.showUnderSwf();
	}
	,onStatusChange: function(resp) {
		this.authResponse = resp.authResponse;
		if(this.authQueue != null) {
			var _g = 0;
			var _g1 = this.authQueue;
			while(_g < _g1.length) {
				var f = _g1[_g];
				++_g;
				f();
			}
			this.authQueue = null;
		}
	}
	,startPayment: function(params,onClose) {
		window.scrollTo(0,0);
		this.boot.openPopup("",onClose);
		this.loadJS("https://" + this.boot.cashHost() + "/fb/list?tk=" + StringTools.urlEncode(this.getToken()) + "&" + params);
	}
	,loadJS: function(url) {
		var s = window.document.createElement("script");
		s.async = true;
		s.src = url;
		window.document.body.appendChild(s);
	}
	,getToken: function() {
		if(this.authResponse == null) return null; else return window.FB.getAuthResponse().accessToken;
	}
	,call: function(fun,uid,args) {
		var _g = this;
		var args1 = haxe_Unserializer.run(args);
		args1.push(function(resp) {
			var fobj = _g.boot.getFlashObject();
			try {
				fobj.mtfacebook(uid,haxe_Serializer.run(resp));
			} catch( e ) {
				if (e instanceof js__$Boot_HaxeError) e = e.val;
				null;
			}
		});
		Reflect.callMethod(this,Reflect.field(this,fun),args1);
		return true;
	}
	,graph: function(url,callback) {
		window.FB.api(url,callback);
	}
	,ui: function(p,callback) {
		window.FB.ui(p,callback);
	}
	,token: function(callback) {
		var _g = this;
		if(this.authResponse != null) callback(this.getToken()); else {
			if(this.authQueue == null) this.authQueue = [];
			this.authQueue.push(function() {
				callback(_g.getToken());
			});
		}
	}
	,logEvent: function(event,valueToSum,params) {
		window.FB.AppEvents.logEvent(event,valueToSum,params);
	}
	,activateApp: function() {
		window.FB.AppEvents.activateApp();
	}
	,xfbml: function(elem) {
		window.FB.XFBML.parse(elem);
	}
	,__class__: tid_Facebook
};
var tid__$Format_Token = $hxClasses["tid._Format.Token"] = { __ename__ : ["tid","_Format","Token"], __constructs__ : ["TData","TSpace","TNewLine","TBlockEnd","TEof","THead","TTagOpen","TTagClose","TCodeOpen","TCodeClose","TList","TDouble"] };
tid__$Format_Token.TData = function(str) { var $x = ["TData",0,str]; $x.__enum__ = tid__$Format_Token; $x.toString = $estr; return $x; };
tid__$Format_Token.TSpace = ["TSpace",1];
tid__$Format_Token.TSpace.toString = $estr;
tid__$Format_Token.TSpace.__enum__ = tid__$Format_Token;
tid__$Format_Token.TNewLine = ["TNewLine",2];
tid__$Format_Token.TNewLine.toString = $estr;
tid__$Format_Token.TNewLine.__enum__ = tid__$Format_Token;
tid__$Format_Token.TBlockEnd = ["TBlockEnd",3];
tid__$Format_Token.TBlockEnd.toString = $estr;
tid__$Format_Token.TBlockEnd.__enum__ = tid__$Format_Token;
tid__$Format_Token.TEof = ["TEof",4];
tid__$Format_Token.TEof.toString = $estr;
tid__$Format_Token.TEof.__enum__ = tid__$Format_Token;
tid__$Format_Token.THead = function(count) { var $x = ["THead",5,count]; $x.__enum__ = tid__$Format_Token; $x.toString = $estr; return $x; };
tid__$Format_Token.TTagOpen = function(name,attrib) { var $x = ["TTagOpen",6,name,attrib]; $x.__enum__ = tid__$Format_Token; $x.toString = $estr; return $x; };
tid__$Format_Token.TTagClose = function(name) { var $x = ["TTagClose",7,name]; $x.__enum__ = tid__$Format_Token; $x.toString = $estr; return $x; };
tid__$Format_Token.TCodeOpen = function(name,attrib) { var $x = ["TCodeOpen",8,name,attrib]; $x.__enum__ = tid__$Format_Token; $x.toString = $estr; return $x; };
tid__$Format_Token.TCodeClose = function(name) { var $x = ["TCodeClose",9,name]; $x.__enum__ = tid__$Format_Token; $x.toString = $estr; return $x; };
tid__$Format_Token.TList = function(count) { var $x = ["TList",10,count]; $x.__enum__ = tid__$Format_Token; $x.toString = $estr; return $x; };
tid__$Format_Token.TDouble = function(c) { var $x = ["TDouble",11,c]; $x.__enum__ = tid__$Format_Token; $x.toString = $estr; return $x; };
var tid__$Format_FlowItem = $hxClasses["tid._Format.FlowItem"] = { __ename__ : ["tid","_Format","FlowItem"], __constructs__ : ["Paragraph","Heading","Span","Div","Code","Li","Text","LineBreak","Space"] };
tid__$Format_FlowItem.Paragraph = function(f) { var $x = ["Paragraph",0,f]; $x.__enum__ = tid__$Format_FlowItem; $x.toString = $estr; return $x; };
tid__$Format_FlowItem.Heading = function(k,f) { var $x = ["Heading",1,k,f]; $x.__enum__ = tid__$Format_FlowItem; $x.toString = $estr; return $x; };
tid__$Format_FlowItem.Span = function(t,attrib,f) { var $x = ["Span",2,t,attrib,f]; $x.__enum__ = tid__$Format_FlowItem; $x.toString = $estr; return $x; };
tid__$Format_FlowItem.Div = function(t,attrib,f) { var $x = ["Div",3,t,attrib,f]; $x.__enum__ = tid__$Format_FlowItem; $x.toString = $estr; return $x; };
tid__$Format_FlowItem.Code = function(t,attrib,f) { var $x = ["Code",4,t,attrib,f]; $x.__enum__ = tid__$Format_FlowItem; $x.toString = $estr; return $x; };
tid__$Format_FlowItem.Li = function(items) { var $x = ["Li",5,items]; $x.__enum__ = tid__$Format_FlowItem; $x.toString = $estr; return $x; };
tid__$Format_FlowItem.Text = function(s) { var $x = ["Text",6,s]; $x.__enum__ = tid__$Format_FlowItem; $x.toString = $estr; return $x; };
tid__$Format_FlowItem.LineBreak = ["LineBreak",7];
tid__$Format_FlowItem.LineBreak.toString = $estr;
tid__$Format_FlowItem.LineBreak.__enum__ = tid__$Format_FlowItem;
tid__$Format_FlowItem.Space = ["Space",8];
tid__$Format_FlowItem.Space.toString = $estr;
tid__$Format_FlowItem.Space.__enum__ = tid__$Format_FlowItem;
var tid_Format = function() {
};
$hxClasses["tid.Format"] = tid_Format;
tid_Format.__name__ = ["tid","Format"];
tid_Format.prototype = {
	formatTag: function(t,attrib,span) {
		switch(t) {
		case "g":case "b":case "strong":case "star":
			return ["<strong>","</strong>"];
		case "i":case "em":case "slash":
			return ["<em>","</em>"];
		case "h1":case "h2":case "h3":
			return ["<" + t + ">","</" + t + ">"];
		case "quote":
			return ["<code>","</code>"];
		case "link":case "lien":
			var rlink = new EReg("^(https?://[a-zA-Z0-9/?;&%_.#=|-]+)","");
			var url;
			if(attrib == null || !rlink.match(attrib)) url = "#"; else url = rlink.matched(1);
			return ["<a href=\"" + url + "\" target=\"_blank\">","</a>"];
		default:
			if(span) return ["<span class=\"" + t + "\">","</span>"]; else return ["<div class=\"" + t + "\">","</div>"];
		}
	}
	,formatPlainText: function(t) {
		t = StringTools.htmlEscape(t);
		t = t.split(" !").join("&nbsp;!").split(" :").join("&nbsp;:").split(" ?").join("&nbsp;?");
		t = new EReg("(https?://[a-zA-Z0-9/?;&%_.#=|-]+)","g").map(t,function(r) {
			var url = r.matched(1);
			return "<a href=\"" + url + "\" target=\"_blank\">" + (url.length > 40?HxOverrides.substr(url,0,37) + "...":url) + "</a>";
		});
		t = new EReg("@([A-Za-z0-9_/.]+)@","g").replace(t,"<img src=\"$1\"/>");
		return t;
	}
	,formatCode: function(code,attrib,content) {
		if(code == "html") return content;
		return null;
	}
	,format: function(s) {
		this.buf = s;
		this.pos = 0;
		this.inSpan = 0;
		this.inList = 0;
		this.newLine = true;
		this.openedTags = [];
		this.cachedTokens = new haxe_ds_GenericStack();
		var flow = [];
		while(true) {
			var t = this.token();
			if(t == tid__$Format_Token.TEof) break;
			this.cachedTokens.add(t);
			flow.push(this.parseBlock(false));
		}
		this.openedTags = [];
		this.outBuf = new StringBuf();
		this.printFlow(flow);
		flow = null;
		return this.outBuf.b;
	}
	,outTag: function(a) {
		if(a == null) {
			this.outBuf.add(this.openedTags.pop());
			return;
		}
		this.openedTags.push(a[1]);
		this.outBuf.b += Std.string(a[0]);
	}
	,printFlow: function(f) {
		var text = null;
		var _g = 0;
		while(_g < f.length) {
			var i = f[_g];
			++_g;
			switch(i[1]) {
			case 6:
				var str = i[2];
				if(text == null) text = str; else text += str;
				break;
			default:
				if(text != null) {
					this.outBuf.add(this.formatPlainText(text));
					text = null;
				}
				this.printItem(i);
			}
		}
		if(text != null) {
			this.outBuf.add(this.formatPlainText(text));
			text = null;
		}
	}
	,printItem: function(f) {
		switch(f[1]) {
		case 0:
			var f1 = f[2];
			this.outTag(["<p>","</p>"]);
			this.printFlow(f1);
			this.outTag();
			break;
		case 5:
			var item = f[2];
			this.outTag(["<ul>","</ul>"]);
			var _g = 0;
			while(_g < item.length) {
				var i = item[_g];
				++_g;
				this.outTag(["<li>","</li>"]);
				switch(i[1]) {
				case 0:
					var f2 = i[2];
					this.printFlow(f2);
					break;
				default:
					this.printItem(i);
				}
				this.outTag();
			}
			this.outTag();
			break;
		case 1:
			var f3 = f[3];
			var k = f[2];
			var tt = this.formatTag("h" + (k + 1),null,false);
			if(tt == null) {
				var f4 = f3.slice();
				f4.unshift(tid__$Format_FlowItem.Text(this.tokenStr(tid__$Format_Token.THead(k))));
				f4.push(tid__$Format_FlowItem.Text(this.tokenStr(tid__$Format_Token.THead(k))));
				this.printFlow(f4);
			} else {
				this.outTag(tt);
				this.printFlow(f3);
				this.outTag();
			}
			break;
		case 6:
			var str = f[2];
			this.outBuf.add(this.formatPlainText(str));
			break;
		case 2:
			var f5 = f[4];
			var a = f[3];
			var t = f[2];
			var tt1 = this.formatTag(t,a,true);
			if(tt1 == null) {
				var f6 = f5.slice();
				f6.unshift(tid__$Format_FlowItem.Text(this.tokenStr(tid__$Format_Token.TTagOpen(t,a))));
				f6.push(tid__$Format_FlowItem.Text(this.tokenStr(tid__$Format_Token.TTagClose(t))));
				this.printFlow(f6);
			} else {
				this.outTag(tt1);
				this.printFlow(f5);
				this.outTag();
			}
			break;
		case 3:
			var f7 = f[4];
			var a1 = f[3];
			var t1 = f[2];
			var tt2 = this.formatTag(t1,a1,false);
			if(tt2 == null) {
				var f8 = f7.slice();
				f8.unshift(tid__$Format_FlowItem.Text(this.tokenStr(tid__$Format_Token.TTagOpen(t1,a1))));
				f8.push(tid__$Format_FlowItem.Text(this.tokenStr(tid__$Format_Token.TTagClose(t1))));
				this.printFlow(f8);
			} else {
				this.outTag(tt2);
				this.printFlow(f7);
				this.outTag();
			}
			break;
		case 4:
			var f9 = f[4];
			var a2 = f[3];
			var t2 = f[2];
			var old = this.outBuf;
			this.outBuf = new StringBuf();
			var _g1 = 0;
			while(_g1 < f9.length) {
				var f10 = f9[_g1];
				++_g1;
				switch(f10[1]) {
				case 6:
					var s = f10[2];
					if(s == null) this.outBuf.b += "null"; else this.outBuf.b += "" + s;
					break;
				default:
					this.printItem(f10);
				}
			}
			var str1 = this.outBuf.b;
			this.outBuf = old;
			var r = this.formatCode(t2,a2,str1);
			if(r == null) this.printFlow([tid__$Format_FlowItem.Text(this.tokenStr(tid__$Format_Token.TCodeOpen(t2,a2)) + str1 + this.tokenStr(tid__$Format_Token.TCodeClose(t2)))]); else if(r == null) this.outBuf.b += "null"; else this.outBuf.b += "" + r;
			break;
		case 8:
			this.outBuf.b += " ";
			break;
		case 7:
			this.outBuf.b += "<br/>";
			break;
		}
	}
	,push: function(t) {
		this.cachedTokens.add(t);
	}
	,tokenStr: function(t) {
		switch(t[1]) {
		case 0:
			var str = t[2];
			return str;
		case 1:
			return " ";
		case 2:
			return "\n";
		case 4:
			return "<eof>";
		case 5:
			var count = t[2];
			return HxOverrides.substr("======",0,6 - count);
		case 6:
			var attrib = t[3];
			var name = t[2];
			return "[" + name + (attrib == null?"":"=" + attrib) + "]";
		case 7:
			var name1 = t[2];
			return "[/" + name1 + "]";
		case 10:
			var count1 = t[2];
			return " *";
		case 3:
			return "\n\n";
		case 8:
			var attrib1 = t[3];
			var name2 = t[2];
			return "<" + name2 + (attrib1 == null?"":" " + attrib1) + ">";
		case 9:
			var name3 = t[2];
			return "</" + name3 + ">";
		case 11:
			var c = t[2];
			var c1 = String.fromCharCode(c);
			return c1 + c1;
		}
	}
	,ignoreEnd: function() {
		if(this.inList > 0) return;
		var t = this.token();
		if(t != tid__$Format_Token.TBlockEnd && t != tid__$Format_Token.TNewLine) this.cachedTokens.add(t);
	}
	,parseBlock: function(limited) {
		var t = this.token();
		switch(t[1]) {
		case 4:
			if(limited) return null;
			break;
		case 5:
			var count = t[2];
			var f = this.parseFlow();
			var t2 = this.token();
			if(!Type.enumEq(t2,t)) {
				this.cachedTokens.add(t2);
				f.unshift(tid__$Format_FlowItem.Text(this.tokenStr(t)));
				return tid__$Format_FlowItem.Paragraph(f);
			}
			this.ignoreEnd();
			return tid__$Format_FlowItem.Heading(count,f);
		case 3:
			if(limited) {
				this.cachedTokens.add(t);
				return null;
			}
			break;
		case 1:
			return this.parseBlock(limited);
		case 2:
			if(this.inSpan == 0) return tid__$Format_FlowItem.LineBreak; else return this.parseBlock(limited);
			break;
		case 10:
			var count1 = t[2];
			var items = [];
			this.inList++;
			while(true) {
				var b = this.parseBlock(true);
				if(b == null) break;
				items.push(b);
				try {
					do {
						t = this.token();
						switch(t[1]) {
						case 4:
							return tid__$Format_FlowItem.Li(items);
						case 10:
							var c2 = t[2];
							if(c2 == count1) throw "__break__";
							this.cachedTokens.add(t);
							if(c2 < count1) return tid__$Format_FlowItem.Li(items);
							switch(b[1]) {
							case 0:
								var flow = b[2];
								var b1 = this.parseBlock(true);
								if(b1 == null) throw "__break__";
								flow.push(b1);
								break;
							default:
							}
							break;
						default:
							this.cachedTokens.add(t);
							throw "__break__";
						}
					} while(true);
				} catch( e ) { if( e != "__break__" ) throw e; }
			}
			this.inList--;
			this.ignoreEnd();
			return tid__$Format_FlowItem.Li(items);
		case 6:
			var attrib = t[3];
			var name = t[2];
			var t21 = this.token();
			var hasP = false;
			if(t21 == tid__$Format_Token.TBlockEnd) {
				hasP = true;
				t21 = tid__$Format_Token.TNewLine;
			}
			if(t21 != tid__$Format_Token.TNewLine) this.cachedTokens.add(t21); else {
				var flow1 = [];
				var old = this.inList;
				this.inList = 0;
				this.openedTags.push(name);
				try {
					while(true) {
						t = this.token();
						switch(t[1]) {
						case 4:
							throw "__break__";
							break;
						case 7:
							var name2 = t[2];
							if(name == name2) throw "__break__";
							var _g = 0;
							var _g1 = this.openedTags;
							while(_g < _g1.length) {
								var n = _g1[_g];
								++_g;
								if(n == name2) {
									this.cachedTokens.add(t);
									t = null;
									break;
								}
							}
							if(t == null) throw "__break__";
							break;
						default:
						}
						this.cachedTokens.add(t);
						var b2 = this.parseBlock(false);
						switch(b2[1]) {
						case 0:
							var f1 = b2[2];
							if(f1.length == 1) {
								var _g2 = f1[0];
								switch(_g2[1]) {
								case 2:
									b2 = f1[0];
									break;
								default:
								}
							}
							break;
						default:
						}
						flow1.push(b2);
					}
				} catch( e ) { if( e != "__break__" ) throw e; }
				this.openedTags.pop();
				if(flow1.length == 1 && !hasP) {
					var _g3 = flow1[0];
					switch(_g3[1]) {
					case 0:
						var f2 = _g3[2];
						flow1 = f2;
						break;
					default:
					}
				}
				this.inList = old;
				this.ignoreEnd();
				return tid__$Format_FlowItem.Div(name,attrib,flow1);
			}
			break;
		case 8:
			var attrib1 = t[3];
			var name1 = t[2];
			var flow2 = [];
			var buf_b = "";
			this.openedTags.push("code:" + name1);
			try {
				while(true) {
					t = this.token();
					switch(t[1]) {
					case 8:
						this.cachedTokens.add(t);
						flow2.push(this.parseBlock(false));
						continue;
						break;
					case 4:
						throw "__break__";
						break;
					case 9:
						var n2 = t[2];
						if(n2 == name1) throw "__break__";
						if(Lambda.has(this.openedTags,"code:" + n2)) {
							this.cachedTokens.add(t);
							throw "__break__";
						}
						break;
					default:
					}
					flow2.push(tid__$Format_FlowItem.Text(this.tokenStr(t)));
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			this.openedTags.pop();
			this.ignoreEnd();
			return tid__$Format_FlowItem.Code(name1,attrib1,flow2);
		case 7:
			if(limited) {
				this.cachedTokens.add(t);
				return null;
			}
			break;
		case 9:
			if(limited) {
				this.cachedTokens.add(t);
				return null;
			}
			t = tid__$Format_Token.TData(this.tokenStr(t));
			break;
		case 0:case 11:
			break;
		}
		this.cachedTokens.add(t);
		return tid__$Format_FlowItem.Paragraph(this.parseFlow());
	}
	,parseFlow: function() {
		var flow = [];
		try {
			while(true) {
				var t = this.token();
				switch(t[1]) {
				case 0:
					var str = t[2];
					flow.push(tid__$Format_FlowItem.Text(str));
					break;
				case 3:
					if(this.inSpan == 0 && flow.length > 0) {
						if(this.inList > 0) this.cachedTokens.add(t);
						throw "__break__";
					}
					flow.push(tid__$Format_FlowItem.LineBreak);
					flow.push(tid__$Format_FlowItem.LineBreak);
					break;
				case 2:
					flow.push(tid__$Format_FlowItem.LineBreak);
					break;
				case 1:
					if(flow.length > 0 || this.inSpan > 0) flow.push(tid__$Format_FlowItem.Space);
					break;
				case 11:
					var $char = t[2];
					var k;
					k = ":" + (function($this) {
						var $r;
						switch($char) {
						case 39:
							$r = "quote";
							break;
						case 42:
							$r = "star";
							break;
						case 47:
							$r = "slash";
							break;
						case 45:
							$r = "dash";
							break;
						default:
							$r = "unk";
						}
						return $r;
					}(this));
					var _g = 0;
					var _g1 = this.openedTags;
					while(_g < _g1.length) {
						var tag = _g1[_g];
						++_g;
						if(tag == k) {
							this.cachedTokens.add(t);
							t = null;
							break;
						}
					}
					if(t == null) throw "__break__";
					this.openedTags.push(k);
					this.inSpan++;
					var f = this.parseFlow();
					this.inSpan--;
					this.openedTags.pop();
					var t2 = this.token();
					if(!Type.enumEq(t2,t)) {
						this.cachedTokens.add(t2);
						flow.push(tid__$Format_FlowItem.Text(this.tokenStr(t)));
						var _g2 = 0;
						while(_g2 < f.length) {
							var i = f[_g2];
							++_g2;
							flow.push(i);
						}
						throw "__break__";
					}
					flow.push(tid__$Format_FlowItem.Span(HxOverrides.substr(k,1,null),null,f));
					break;
				case 6:
					var attrib = t[3];
					var name = t[2];
					this.openedTags.push(name);
					this.inSpan++;
					var f1 = this.parseFlow();
					this.inSpan--;
					this.openedTags.pop();
					var t21 = this.token();
					if(!Type.enumEq(t21,tid__$Format_Token.TTagClose(name))) {
						this.cachedTokens.add(t21);
						if(flow[flow.length - 1] == tid__$Format_FlowItem.LineBreak) {
							var breaks = 0;
							var _g3 = 0;
							while(_g3 < f1.length) {
								var i1 = f1[_g3];
								++_g3;
								if(i1 == tid__$Format_FlowItem.LineBreak) breaks++; else break;
							}
							if(breaks == f1.length) {
								var _g4 = 0;
								while(_g4 < breaks) {
									var i2 = _g4++;
									this.cachedTokens.add(tid__$Format_Token.TNewLine);
								}
								if(breaks > 1) {
									this.cachedTokens.pop();
									this.cachedTokens.pop();
									this.cachedTokens.add(tid__$Format_Token.TBlockEnd);
								}
								this.cachedTokens.add(t);
								throw "__break__";
							}
						}
						flow.push(tid__$Format_FlowItem.Text(this.tokenStr(t)));
						var _g5 = 0;
						while(_g5 < f1.length) {
							var i3 = f1[_g5];
							++_g5;
							flow.push(i3);
						}
						throw "__break__";
					}
					flow.push(tid__$Format_FlowItem.Span(name,attrib,f1));
					break;
				case 7:
					var name1 = t[2];
					var _g6 = 0;
					var _g11 = this.openedTags;
					while(_g6 < _g11.length) {
						var tag1 = _g11[_g6];
						++_g6;
						if(tag1 == name1) {
							this.cachedTokens.add(t);
							t = null;
							break;
						}
					}
					if(t == null) throw "__break__";
					flow.push(tid__$Format_FlowItem.Text(this.tokenStr(t)));
					break;
				case 4:case 5:case 10:case 8:case 9:
					this.cachedTokens.add(t);
					throw "__break__";
					break;
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		if(this.inSpan == 0) try {
			while(flow.length > 0) {
				var _g7 = flow[flow.length - 1];
				switch(_g7[1]) {
				case 8:case 7:
					flow.pop();
					break;
				default:
					throw "__break__";
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return flow;
	}
	,_token: function() {
		var t = this.cachedTokens.pop();
		if(t != null) return t;
		var t1 = this._token();
		return t1;
	}
	,isAlphaNum: function(c) {
		return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57;
	}
	,token: function() {
		var t = this.cachedTokens.pop();
		if(t != null) return t;
		var pos = this.pos;
		var c = StringTools.fastCodeAt(this.buf,pos++);
		if(c != c) return tid__$Format_Token.TEof;
		switch(c) {
		case 13:
			if(this.buf.charCodeAt(pos) == 10) pos++;
			while(this.buf.charCodeAt(pos) == 13) {
				pos++;
				if(this.buf.charCodeAt(pos) == 10) pos++;
				this.cachedTokens.add(tid__$Format_Token.TNewLine);
			}
			this.newLine = true;
			this.pos = pos;
			if(this.cachedTokens.pop() != null) return tid__$Format_Token.TBlockEnd;
			return tid__$Format_Token.TNewLine;
		case 10:
			while(this.buf.charCodeAt(pos) == 10) {
				pos++;
				this.cachedTokens.add(tid__$Format_Token.TNewLine);
			}
			this.newLine = true;
			this.pos = pos;
			if(this.cachedTokens.pop() != null) return tid__$Format_Token.TBlockEnd;
			return tid__$Format_Token.TNewLine;
		case 32:case 9:
			while(true) {
				var c1 = this.buf.charCodeAt(pos);
				if(c1 != 32 && c1 != 9) {
					if(this.newLine && c1 == 42) {
						this.newLine = false;
						var count = pos - this.pos;
						this.pos = pos + 1;
						return tid__$Format_Token.TList(count);
					}
					break;
				}
				pos++;
			}
			this.pos = pos;
			return tid__$Format_Token.TSpace;
		case 91:
			var close = false;
			if(this.buf.charCodeAt(pos) == 47) {
				pos++;
				close = true;
			}
			var start1 = pos;
			var name = null;
			var attrib = null;
			while(true) {
				var c2 = this.buf.charCodeAt(pos);
				if(!(c2 >= 97 && c2 <= 122 || c2 >= 65 && c2 <= 90 || c2 >= 48 && c2 <= 57)) {
					if(!close && c2 == 61 && name == null && pos > start1) {
						name = HxOverrides.substr(this.buf,start1,pos - start1);
						pos++;
						var old = start1;
						start1 = pos;
						while(true) {
							var c3 = this.buf.charCodeAt(pos);
							if(c3 != c3 || c3 == 13 || c3 == 10) {
								this.pos = old;
								return tid__$Format_Token.TData("[");
							}
							if(c3 == 93) break;
							pos++;
						}
						attrib = HxOverrides.substr(this.buf,start1,pos - start1);
						pos++;
						break;
					}
					if(c2 != 93 || start1 == pos) {
						this.pos = start1;
						return tid__$Format_Token.TData(close?"[/":"[");
					}
					name = HxOverrides.substr(this.buf,start1,pos - start1);
					pos++;
					break;
				}
				pos++;
			}
			this.pos = pos;
			if(close) return tid__$Format_Token.TTagClose(name); else return tid__$Format_Token.TTagOpen(name,attrib);
			break;
		case 61:
			var count1 = 1;
			while(count1 < 6) if(StringTools.fastCodeAt(this.buf,pos++) == 61) count1++; else {
				pos--;
				break;
			}
			this.pos = pos;
			if(count1 >= 4) return tid__$Format_Token.THead(6 - count1); else return tid__$Format_Token.TData(HxOverrides.substr("====",0,count1));
			break;
		case 60:
			var close1 = false;
			if(this.buf.charCodeAt(pos) == 47) {
				pos++;
				close1 = true;
			}
			var start2 = pos;
			var name1 = null;
			var attrib1 = null;
			while(true) {
				var c4 = this.buf.charCodeAt(pos);
				if(!(c4 >= 97 && c4 <= 122 || c4 >= 65 && c4 <= 90 || c4 >= 48 && c4 <= 57)) {
					if(!close1 && c4 == 32 && name1 == null && pos > start2) {
						name1 = HxOverrides.substr(this.buf,start2,pos - start2);
						pos++;
						var old1 = start2;
						start2 = pos;
						while(true) {
							var c5 = this.buf.charCodeAt(pos);
							if(c5 != c5 || c5 == 13 || c5 == 10) {
								this.pos = old1;
								return tid__$Format_Token.TData("<");
							}
							if(c5 == 62) break;
							pos++;
						}
						attrib1 = HxOverrides.substr(this.buf,start2,pos - start2);
						start2 = old1;
						pos++;
						break;
					}
					if(c4 != 62 || start2 == pos) {
						this.pos = start2;
						return tid__$Format_Token.TData(close1?"</":"<");
					}
					name1 = HxOverrides.substr(this.buf,start2,pos - start2);
					pos++;
					break;
				}
				pos++;
			}
			if(!close1 && this.formatCode(name1,attrib1,"") == null) {
				this.pos = start2;
				return tid__$Format_Token.TData("<");
			}
			this.pos = pos;
			if(close1) return tid__$Format_Token.TCodeClose(name1); else return tid__$Format_Token.TCodeOpen(name1,attrib1);
			break;
		case 39:case 42:case 47:case 45:
			if((pos < 2 || c != 47 || this.buf.charCodeAt(pos - 2) != 58) && this.buf.charCodeAt(pos) == c) {
				this.pos = pos + 1;
				return tid__$Format_Token.TDouble(c);
			}
			this.pos = pos;
			return tid__$Format_Token.TData(String.fromCharCode(c));
		default:
		}
		var t1 = tid_Format.STABLE;
		var start = this.pos;
		do {
			c = StringTools.fastCodeAt(this.buf,pos++);
			if(c != c) break;
		} while(!t1[c]);
		this.pos = pos - 1;
		this.newLine = false;
		return tid__$Format_Token.TData(HxOverrides.substr(this.buf,start,pos - start - 1));
	}
	,__class__: tid_Format
};
var tid_Forum = function(boot,container) {
	this.boot = boot;
	this.container = container;
	this.lock = false;
	this.queue = [];
	this.singleColumn = false;
	this.conf = window._tid_forumConf;
	if(this.conf == null) this.conf = { };
	container.addClass("tid_forum_init");
	this.init();
};
$hxClasses["tid.Forum"] = tid_Forum;
tid_Forum.__name__ = ["tid","Forum"];
tid_Forum.j = function(q) {
	return js.JQuery(q);
};
tid_Forum.prototype = {
	init: function() {
		var _g = this;
		this.singleColumn = this.conf.compact == true;
		this.container.html("<div id=\"tid_forum_all\"></div>" + "<table class=\"tid_forumLayout\">" + "\t<tr>" + "\t\t<td id=\"tid_forum_left\"></td>" + "\t\t<td id=\"tid_forum_right\"></td>" + "\t</tr>" + "</table>");
		var rules = new List();
		if(this.conf.color != null) {
			if(this.conf.color.length == 3) this.conf.color.push(this.conf.color[0]);
			var _g1 = 0;
			var _g2 = this.conf.color.length;
			while(_g1 < _g2) {
				var i = _g1++;
				var c = this.conf.color[i];
				if(c == null) break;
				if(c.bg != null) {
					rules.add("#tid_forum .tid_bg" + (i + 1) + " { background-color:" + c.bg + "; }");
					rules.add("#tid_forum .tid_border" + (i + 1) + " { border-color:" + c.bg + "; }");
				}
				if(c.text != null) rules.add("#tid_forum .tid_bg" + (i + 1) + " { color:" + c.text + "; }");
			}
		}
		if(rules.length > 0) {
			var css = tid_Forum.j("<style type=\"text/css\">" + rules.join("\n") + "</style>");
			this.container.before(css);
		}
		this.onResize();
		var h = window.location.hash;
		if(h != null && h != "") this.onHashChange(window.location.hash); else this.loadLeft("");
		tid_Forum.j(window).bind("hashchange",function(e) {
			_g.onHashChange(window.location.hash);
		});
		tid_Forum.j(window).bind("resize",function(e1) {
			_g.onResize();
		});
	}
	,onResize: function() {
		var wasSingle = this.singleColumn;
		var w = this.container.innerWidth();
		this.container.removeClass("tid_singleColumn tid_maxWidth_800 tid_maxWidth_600 tid_maxWidth_400");
		this.singleColumn = w <= 800 || this.conf.compact == true;
		if(w <= 800) this.container.addClass("tid_maxWidth_800");
		if(w <= 600) this.container.addClass("tid_maxWidth_600");
		if(w <= 400) this.container.addClass("tid_maxWidth_400");
		if(this.singleColumn) this.container.addClass("tid_singleColumn");
		if(this.urlLeft != null && wasSingle != this.singleColumn) {
			if(!this.singleColumn) {
				this.showLeft();
				this.showRight();
			}
			this.reload();
		}
	}
	,loadingHTML: function() {
		return this.boot.loadingHTML();
	}
	,loadURL: function(url,p) {
		if(this.lock) {
			this.queue.push(url);
			return;
		}
		this.lock = true;
		if(p == null) p = { };
		if(url.indexOf("?") >= 0) {
			var idx = url.indexOf("?");
			var a = new EReg("[;&]","g").split(HxOverrides.substr(url,idx + 1,null));
			var _g = 0;
			while(_g < a.length) {
				var e = a[_g];
				++_g;
				var b = e.split("=");
				Reflect.setField(p,b[0],decodeURIComponent(b[1].split("+").join(" ")));
			}
			url = HxOverrides.substr(url,0,idx);
		}
		if(!new EReg("^[0-9a-zA-z/_.-]*$","").match(url)) return;
		if(this.singleColumn) p.compact = 1;
		this.boot.loadModule(this.container,"/mod/forum/" + url,p);
	}
	,unlock: function() {
		this.lock = false;
		if(this.queue.length > 0) this.loadURL(this.queue.shift());
	}
	,loadLeft: function(url,updH) {
		if(updH == null) updH = true;
		if(this.isHome() && this.singleColumn) tid_Forum.j("#tid_forum_left").html(this.loadingHTML()); else tid_Forum.j("#tid_forum_left").prepend(this.loadingHTML());
		this.urlLeft = url;
		this.loadURL(url,{ side : "L"});
		if(updH) this.updateHash();
	}
	,refreshLeft: function() {
		this.loadLeft(this.urlLeft);
	}
	,loadRight: function(url,updH) {
		if(updH == null) updH = true;
		this.urlRight = url;
		this.replyLoaded = false;
		this.replyLoading = false;
		tid_Forum.j("#tid_forum_right").prepend(this.loadingHTML());
		if(this.singleColumn) this.hideLeft();
		this.loadURL(url,{ side : "R"});
		if(updH) this.updateHash();
	}
	,cite: function(name,uid,q) {
		q = q.eq(0);
		q = q.clone();
		var $it0 = (function($this) {
			var $r;
			var _this = q.find("img");
			$r = (_this.iterator)();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var e = $it0.next();
			var alt = e.attr("alt");
			if(alt != null) e.replaceWith(alt);
		}
		var $it1 = (function($this) {
			var $r;
			var _this1 = q.find(".tid_user");
			$r = (_this1.iterator)();
			return $r;
		}(this));
		while( $it1.hasNext() ) {
			var u = $it1.next();
			if(u.attr("tid_id") != null && u.attr("tid_id") != "null") {
				var t1 = u.text();
				if(!new EReg("^[0-9A-Za-z]+$","").match(t1)) t1 = "";
				u.replaceWith("@" + t1 + ":" + u.attr("tid_id"));
			}
		}
		var $it2 = (function($this) {
			var $r;
			var _this2 = q.find("a");
			$r = (_this2.iterator)();
			return $r;
		}(this));
		while( $it2.hasNext() ) {
			var a = $it2.next();
			a.prepend("[link=" + a.attr("href") + "]").append("[/link]");
		}
		q.find("br").replaceWith("\n");
		q.find("p").append("\n\n");
		q.find("cite").remove();
		q.find(".tid_questionModule").remove();
		q.find(".tid_preCite").remove();
		q.find("strong").prepend("**").append("**");
		q.find("li").prepend("\n * ");
		q.find("em").prepend("//").append("//");
		q.find(".tid_strike").prepend("--").append("--");
		q.find(".tid_spoil").prepend("[spoil]").append("[/spoil]");
		q.find("pre").prepend("&lt;code&gt;").append("&lt;/code&gt;");
		var $it3 = (function($this) {
			var $r;
			var _this3 = q.find(".tid_roleplay");
			$r = (_this3.iterator)();
			return $r;
		}(this));
		while( $it3.hasNext() ) {
			var e1 = $it3.next();
			var p = e1.prev();
			if(p["is"](".tid_preRoleplay")) e1.prepend("[rp=" + p.remove().text() + "]").append("[/rp]"); else e1.prepend("[rp]").append("[/rp]");
		}
		var t = StringTools.trim(q.text());
		while(t.length > 0 && t.charAt(0) == "\n") t = StringTools.ltrim(HxOverrides.substr(t,1,null));
		while(t.length > 0 && t.charAt(t.length - 1) == "\n") t = StringTools.rtrim(HxOverrides.substr(t,0,t.length - 1));
		if(!new EReg("^[0-9A-Za-z]+$","").match(name)) name = "";
		var attr;
		if(uid == null) attr = ""; else attr = "=@" + name + ":" + uid;
		if(StringTools.trim(t).length > 0) this.reply("\n[cite" + attr + "]\n" + t + "[/cite]\n"); else this.reply();
	}
	,reply: function(content) {
		tid_Forum.j("#tid_forumReplyForm:hidden").slideDown(500).html(this.loadingHTML());
		if(this.replyLoaded) return this.goReply(content);
		if(content != null) {
			if(this.replyTmp == null) this.replyTmp = "";
			this.replyTmp += content;
		}
		if(this.replyLoading) return;
		this.replyLoading = true;
		this.loadURL("reply/" + this.lastThread);
		return;
	}
	,fillReply: function(html) {
		tid_Forum.j("#tid_forumReplyForm").html(this.boot.addNamespace(html,"tid_"));
		this.afterFill("reply");
		this.replyLoaded = true;
		this.replyLoading = false;
		this.goReply(this.replyTmp);
		this.replyTmp = null;
	}
	,goReply: function(content) {
		if(content != null) {
			if(window.editor_tid_forumMsg != null) window.editor_tid_forumMsg.insert(content);
		}
		tid_Forum.j("#tid_forumMsg").focus();
		this.boot.scrollVisible(tid_Forum.j("#tid_forumReplyForm"),100,100);
	}
	,closeMoveList: function() {
		tid_Forum.j("#tid_forumMoveMenu").remove();
	}
	,moveList: function(thread,q) {
		var _g = this;
		var m = tid_Forum.j("<div id=\"tid_forumMoveMenu\"><div class=\"tid_noclick\"/><div class=\"tid_content\"><div class=\"tid_reload\"></div></div></div>");
		tid_Forum.j("body").prepend(m);
		var content = m.find(".tid_content");
		content.hide().fadeIn();
		m.find(".tid_noclick").click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			_g.closeMoveList();
		});
		var o = q.offset();
		m.css({ background : "red", marginLeft : o.left - 50 + "px", marginTop : o.top + q.height() + "px"});
		this.boot.loadModule(content,"/mod/forum/moveList/" + thread,{ });
		return false;
	}
	,modAction: function(act,prompt) {
		var p = window.prompt(prompt);
		if(p == null || (p == null?"null":"" + p) == "null" || (p == null?"null":"" + p) == "undefined") return false;
		this.loadURL(act,{ reason : p});
		this.reload();
		return false;
	}
	,reload: function() {
		var r = this.urlRight;
		this.loadLeft(this.urlLeft);
		if(r != null) this.loadRight(r);
	}
	,switchSide: function(url) {
		var u = this.urlLeft;
		this.loadLeft(url);
		this.loadRight(u);
		this.unlock();
	}
	,onHashChange: function(furl) {
		if(furl == this.lastHash) return;
		if(HxOverrides.substr(furl,0,1) == "#") furl = HxOverrides.substr(furl,1,null);
		if(HxOverrides.substr(furl,0,1) == "!") furl = HxOverrides.substr(furl,1,null);
		var a = furl.split("%7C").join("|").split("|");
		if(a[0] != this.urlLeft) this.loadLeft(a[0],false);
		if(a[1] != null && a[1] != "" && a[1] != this.urlRight) this.loadRight(a[1],false); else if((a[1] == null || a[1] == "") && this.urlRight != null) {
			if(this.singleColumn) this.showLeft(true); else this.cleanRight();
		}
		this.updateHash();
	}
	,updateHash: function() {
		var n = "#!" + this.urlLeft;
		if(this.urlRight != null && this.urlRight != "") n += "|" + this.urlRight;
		this.lastHash = window.location.hash;
		if(n == this.lastHash) return;
		window.location.hash = n;
		this.lastHash = window.location.hash;
	}
	,getFocusUrl: function(f) {
		var n = this.urlLeft;
		if(this.urlRight != null && this.urlRight != "") n += "|" + this.urlRight;
		n += "|" + f;
		var l = window.location;
		return l.protocol + "://" + l.host + l.pathname + "#" + n;
	}
	,softCleanRight: function() {
		if(this.isSearch()) return;
		this.cleanRight();
	}
	,cleanRight: function() {
		this.urlRight = null;
		this.lastThread = null;
		if(this.singleColumn) tid_Forum.j("#tid_forum_right").html(""); else tid_Forum.j("#tid_forum_right").html(tid_Forum.j("#tid_forumRulesSkel").html());
		tid_Forum.j("#tid_forum_collapser").hide();
		this.onShowThread();
		this.updateHash();
	}
	,fill: function(part) {
		var _g = this;
		if(part == "right") this.stopDraft();
		var c;
		if(part == "") c = this.container; else c = tid_Forum.j("#tid_forum_" + part);
		if(part == "left" && this.urlRight == null) this.cleanRight();
		return function(html) {
			_g.boot.scrollVisible(_g.container,15,0,true);
			c.html(_g.boot.removeIframes("<div class=\"tid_containerWrapper\">" + _g.boot.addNamespace(html,"tid_") + "</div>"));
			_g.afterFill(part);
		};
	}
	,afterFill: function(part) {
		var _g = this;
		var $it0 = (function($this) {
			var $r;
			var _this = $this.container.find("a");
			$r = (_this.iterator)();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var a = $it0.next();
			var h = a.attr("tid_href");
			if(h != null) {
				var i = h.indexOf(":");
				var dir = HxOverrides.substr(h,0,i);
				var u = [HxOverrides.substr(h,i + 1,null)];
				if(dir == "left") {
					var cr = [u[0] == ""];
					a.attr("href","/tid/forum#!" + u[0] + (this.urlRight != null && !cr[0]?"|" + this.urlRight:""));
					a.unbind("click.tidForumLink");
					a.bind("click.tidForumLink",(function(cr,u) {
						return function(e) {
							e.stopPropagation();
							if(e.which != 2) {
								e.preventDefault();
								_g.loadLeft(u[0]);
								if(cr[0]) _g.cleanRight();
							}
						};
					})(cr,u));
				} else if(dir == "right") {
					a.attr("href","/tid/forum#!" + this.urlLeft + "|" + u[0]);
					a.unbind("click.tidForumLink");
					tid_Forum.j("#tid_forum_collapser").show();
					a.bind("click.tidForumLink",(function(u) {
						return function(e1) {
							e1.stopPropagation();
							if(e1.which != 2) {
								e1.preventDefault();
								_g.loadRight(u[0]);
							}
						};
					})(u));
				}
			}
		}
		var $it1 = (function($this) {
			var $r;
			var _this1 = $this.container.find(".tid_threadLink");
			$r = (_this1.iterator)();
			return $r;
		}(this));
		while( $it1.hasNext() ) {
			var td = $it1.next();
			var h1 = [td.attr("tid_href")];
			if(h1[0] == null) continue;
			td.unbind("click.tidForumLink");
			td.bind("click.tidForumLink",(function(h1) {
				return function(e2) {
					e2.preventDefault();
					e2.stopPropagation();
					if(HxOverrides.substr(h1[0],0,6) == "right:") _g.loadRight(HxOverrides.substr(h1[0],6,null));
				};
			})(h1));
		}
		if(part == "left" && this.urlRight == null) this.showLeft();
		if(this.isHome()) this.container.addClass("tid_forumHome"); else this.container.removeClass("tid_forumHome");
		if(part == "right" && this.urlRight != null) this.showRight();
		if(!this.isHome() && !this.singleColumn) this.showRight();
		if(this.isHome() && this.isSearch()) this.hideLeft();
		if(this.singleColumn && part == "right" && this.urlRight != null) this.hideLeft();
		this.boot.onLoad();
		this.onShowThread();
		this.unlock();
	}
	,onShowThread: function(id,lastPage) {
		if(lastPage == null) lastPage = false;
		var _g = this;
		if(id != null) this.lastThread = id;
		tid_Forum.j("#tid_forum_left table.tid_threads tr.tid_selected").removeClass("tid_selected");
		tid_Forum.j("#tid_forum_right .tid_img").click(function(_) {
			_g.boot.popImage(js.JQuery(this).attr("src"));
		});
		if(this.lastThread != null) {
			var q = tid_Forum.j("#tid_forumThread_" + this.lastThread);
			q.addClass("tid_selected");
			if(lastPage) q.removeClass("tid_unread").addClass("tid_read");
		}
	}
	,isHome: function() {
		return this.urlLeft == null || this.urlLeft == "" || this.urlLeft.charAt(0) == "?";
	}
	,isSearch: function() {
		return this.urlRight != null && this.urlRight.indexOf("search") == 0;
	}
	,hideLeft: function() {
		tid_Forum.j("#tid_forum_left").hide();
		tid_Forum.j("#tid_forum_collapser").addClass("tid_expander");
		if(this.singleColumn) tid_Forum.j("#tid_forum_right").show();
	}
	,showLeft: function(reload) {
		if(reload == null) reload = false;
		tid_Forum.j("#tid_forum_left").show();
		tid_Forum.j("#tid_forum_collapser").removeClass("tid_expander");
		if(this.singleColumn) {
			if(reload) this.loadLeft(this.urlLeft);
			tid_Forum.j("#tid_forum_right").hide();
			this.cleanRight();
		}
	}
	,hideRight: function() {
		tid_Forum.j("#tid_forum_right").hide();
	}
	,showRight: function(reload) {
		if(reload == null) reload = false;
		tid_Forum.j("#tid_forum_right").show();
		if(reload) this.loadRight(this.urlRight);
	}
	,pageForm: function(q) {
		var _g = this;
		this.boot.pageForm(q,function(p) {
			var h = q.attr("tid_href");
			if(h != null) {
				h += p;
				if(HxOverrides.substr(h,0,5) == "left:") _g.loadLeft(HxOverrides.substr(h,5,null)); else if(HxOverrides.substr(h,0,6) == "right:") _g.loadRight(HxOverrides.substr(h,6,null));
			}
		});
	}
	,toggleSection: function(e) {
		e.toggleClass("tid_collapsed").next().slideToggle(250);
	}
	,focusPost: function(idx) {
		var posts = tid_Forum.j(".tid_post");
		posts.removeClass("tid_focus").removeClass("tid_emphasize");
		var e = posts.filter("#tid_forumPost_" + idx);
		if(e.length != 0) {
			if(e.hasClass("tid_hidden")) e.show().prev(".tid_hiddenNotice").hide();
			if(e.hasClass("tid_niceHidden")) e.show().prev(".tid_niceHiddenNotice").hide();
			if(e.hasClass("tid_userHidden")) e.show().prev(".tid_userHiddenNotice").hide();
			e.addClass("tid_focus");
			e.css("border-color",e.find(".tid_header").css("background-color"));
			posts.not(".tid_focus").addClass("tid_emphasize");
			this.boot.scrollVisible(e,10,10);
		}
	}
	,onWindowScroll: function(e) {
		var topics = this.container.find("#tid_forum_left .tid_containerWrapper");
		var lhei = topics.height();
		var rhei = this.container.find("#tid_forum_right .tid_containerWrapper").height();
		var $window = tid_Forum.j(window);
		var m = 0;
		if(lhei < $window.height()) {
			m = $window.scrollTop() + 23 - this.container.offset().top;
			if(lhei + m > rhei) m = rhei - lhei;
			if(m < 0) m = 0;
		}
		topics.css({ marginTop : m});
	}
	,highlightWords: function(jcontext,words) {
		var splitter = "<span style=\"opacity:0.5\">&nbsp;[...]&nbsp;</span>";
		var a = [];
		words = new EReg("\"([^\"]+)\"","g").map(words,function(r) {
			a.push(r.matched(1));
			return "";
		});
		var _g = 0;
		var _g1 = new EReg("( |\\+)+","g").split(words);
		while(_g < _g1.length) {
			var w = _g1[_g];
			++_g;
			if(w.length > 0 && HxOverrides.substr(w,0,1) != "-") a.push(w);
		}
		jcontext.each(function() {
			var cur = js.JQuery(this);
			var txt = cur.html();
			var _g2 = 0;
			while(_g2 < a.length) {
				var word = a[_g2];
				++_g2;
				if(word.length == 0) continue;
				var t = txt;
				var lct = t.toLowerCase();
				txt = "";
				var i = -1;
				var reg = new EReg("\\b" + tid_Editor.escapeEreg(word) + "\\b","ig");
				var start = "<span class=\"tid_highlight\">";
				var end = "</span>";
				while(t.length > 0) {
					if(reg.match(HxOverrides.substr(lct,i + 1,null))) i = reg.matchedPos().pos + i + 1; else i = -1;
					if(i < 0) {
						txt += t;
						t = "";
					} else if(t.lastIndexOf(">",i) >= t.lastIndexOf("<",i) && lct.lastIndexOf("/script>",i) >= lct.lastIndexOf("<script",i)) {
						txt += HxOverrides.substr(t,0,i) + start + HxOverrides.substr(t,i,word.length) + end;
						t = HxOverrides.substr(t,i + word.length,null);
						lct = HxOverrides.substr(lct,i + word.length,null);
						i = -1;
					}
				}
			}
			cur.html(txt);
		});
	}
	,saveDraft: function(url) {
		this.stopDraft();
		var ta = tid_Forum.j("#tid_forumMsg");
		var r = this.boot.restoreDraft(url);
		if(ta.val() == "" && r != null) ta.val(r);
		this.draftUrl = url;
		this.draftTimer = new haxe_Timer(5000);
		this.draftTimer.run = $bind(this,this.storeDraft);
	}
	,stopDraft: function() {
		if(this.draftTimer == null) return;
		this.storeDraft();
		this.draftTimer.stop();
		this.draftTimer = null;
	}
	,storeDraft: function() {
		var ta = tid_Forum.j("#tid_forumMsg");
		if(ta.length == 1 && this.draftUrl != null) this.boot.storeDraft(this.draftUrl,ta.val());
	}
	,clearDraft: function(url) {
		this.stopDraft();
		this.boot.clearDraft(url);
	}
	,__class__: tid_Forum
};
var tid_GoogleAnalytics = function() {
	this.isReady = false;
	this.buffer = [];
};
$hxClasses["tid.GoogleAnalytics"] = tid_GoogleAnalytics;
tid_GoogleAnalytics.__name__ = ["tid","GoogleAnalytics"];
tid_GoogleAnalytics.prototype = {
	get: function(k) {
		return window.ga.getByName(this.trackerName).get(k);
	}
	,set: function(k,v) {
		try {
			window.ga.getByName(this.trackerName).set(k,v);
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
		}
	}
	,call: function(fun,a,b,c,d,e) {
		try {
			if(fun != "create" && this.trackerName != null) fun = this.trackerName + "." + Std.string(fun);
			window.ga(fun,a,b,c,d,e);
		} catch( e1 ) {
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
		}
	}
	,init: function(trackerId,userId,isGlobal,autoTrackView) {
		if(autoTrackView == null) autoTrackView = true;
		if(isGlobal == null) isGlobal = false;
		try {
			var opt = { };
			if(isGlobal) this.trackerName = "tid"; else this.trackerName = "t" + tid_GoogleAnalytics.IDX++;
			opt.name = this.trackerName;
			if(userId != null) opt.userId = haxe_crypto_Md5.encode("twinoid#" + userId);
			this.call("create",trackerId,"auto",opt);
			var ref = this.get("referrer");
			if(ref != null && new EReg("^https?://(demo\\.|local\\.)?twinoid\\.com/user/","i").match(ref)) this.set("referrer",null);
			if(autoTrackView) this.call("send","pageview");
			var _g = 0;
			var _g1 = this.buffer;
			while(_g < _g1.length) {
				var b = _g1[_g];
				++_g;
				$bind(this,this.call).apply(this,b);
			}
			this.isReady = true;
			this.buffer = [];
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
		}
	}
	,trackSocial: function(network,action,target,view) {
		if(this.isReady) this.call("send","social",network,action,target,view); else this.buffer.push(["send","social",network,action,target,view]);
	}
	,trackPageView: function(page) {
		if(this.isReady) this.call("send","pageview",page); else this.buffer.push(["send","pageview",page]);
	}
	,trackEvent: function(cat,action,label,value) {
		if(this.isReady) this.call("send","event",cat,action,label,value); else this.buffer.push(["send","event",cat,action,label,value]);
	}
	,__class__: tid_GoogleAnalytics
};
var tid_Group = function(boot,container) {
	this.boot = boot;
	this.container = container;
	this.lastUrl = null;
	this.init();
	container.addClass("tid_group_init");
};
$hxClasses["tid.Group"] = tid_Group;
tid_Group.__name__ = ["tid","Group"];
tid_Group.j = function(q) {
	return js.JQuery(q);
};
tid_Group.prototype = {
	init: function() {
		var _g = this;
		this.id = Std.parseInt(this.container.attr("group"));
		var conf = window._tid_groupConf;
		if(conf == null) conf = { };
		if(conf.color != null) {
			var rules = [];
			var n = 1;
			var _g1 = 0;
			var _g11 = conf.color;
			while(_g1 < _g11.length) {
				var c = _g11[_g1];
				++_g1;
				if(c == null) continue;
				var rgb = mt_deepnight_Color.hexToRgb(c.bg);
				var lighter = mt_deepnight_Color.rgbToHex(mt_deepnight_Color.brightness(rgb,0.15));
				rules.push(".tid_border" + n + " { border-color:" + lighter + " !important; }");
				rules.push(".tid_bg" + n + " { background-color:" + c.bg + "; color:" + c.text + " !important; }");
				rules.push(".tid_over" + n + ":hover { background-color:" + c.bg + " !important; color:" + c.text + " !important; }");
				n++;
			}
			var _g12 = 0;
			var _g2 = rules.length;
			while(_g12 < _g2) {
				var i = _g12++;
				rules[i] = "#tid_group " + rules[i];
			}
			var h1 = "<style type=\"text/css\">" + rules.join(" ") + "</style>";
			this.container.before(h1);
		}
		this.vertical = conf.vertical || conf.vertical == null;
		var h = window.location.hash;
		this.onHashChange(window.location.hash);
		tid_Group.j(window).bind("hashchange",function(e) {
			_g.onHashChange(window.location.hash);
		});
		this.ajaxifyLinks();
		this.boot.addLoadListener($bind(this,this.ajaxifyLinks));
	}
	,ajaxifyLinks: function() {
		var _g = this;
		var $it0 = (function($this) {
			var $r;
			var _this = $this.container.find("a");
			$r = (_this.iterator)();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var a = $it0.next();
			var a1 = [a];
			if(a1[0].hasClass("tid_liLink")) a1[0].closest("li").addClass("tid_clickable").unbind("click.liLink").bind("click.liLink",(function(a1) {
				return function(e) {
					a1[0].click();
				};
			})(a1));
			var href = [a1[0].attr("href")];
			if(href[0] == null || a1[0].attr("onclick") != null || HxOverrides.substr(href[0],0,1) != "#" || !a1[0].hasClass("tid_gbut")) a1[0].click((function() {
				return function(e1) {
					e1.stopPropagation();
				};
			})()); else a1[0].click((function(href) {
				return function(e2) {
					e2.stopPropagation();
					e2.preventDefault();
					_g.loadURL(HxOverrides.substr(href[0],1,null));
				};
			})(href));
		}
		var me = this;
		if(this.container.sortable != null) this.container.find("ul.tid_sortable").not("tid_parsed").addClass("tid_parsed").sortable({ handle : ".tid_move", placeholder : "tid_border2", forcePlaceholderSize : true, update : function(event,ui) {
			var a2 = js.JQuery(this).sortable("toArray",{ attribute : "sort_id"});
			var p = { order : a2.join(",")};
			if(js.JQuery(this).hasClass("tid_private")) p.priv = true;
			me.loadURL("updateOrder",p,true);
		}}); else this.container.find("ul.tid_sortable").removeClass("tid_sortable");
	}
	,loadingHTML: function() {
		return this.boot.loadingHTML();
	}
	,loadURL: function(url,p,bgLoad) {
		if(bgLoad == null) bgLoad = false;
		if(!bgLoad) {
			if(url == this.lastUrl) return;
		}
		if(p == null) p = { };
		var rurl = url;
		if(rurl.indexOf("?") >= 0) {
			var idx = rurl.indexOf("?");
			var a = new EReg("[;&]","g").split(HxOverrides.substr(rurl,idx + 1,null));
			var _g = 0;
			while(_g < a.length) {
				var e = a[_g];
				++_g;
				var b = e.split("=");
				Reflect.setField(p,b[0],decodeURIComponent(b[1].split("+").join(" ")));
			}
			rurl = HxOverrides.substr(rurl,0,idx);
		}
		if(!new EReg("^[0-9a-zA-z/_.-]*$","").match(rurl)) return;
		if(this.vertical) p.vertical = 1;
		this.boot.loadModule(this.container,"/mod/group/" + this.id + "/" + rurl,p);
		if(!bgLoad) {
			this.lastUrl = url;
			window.location.hash = "#" + this.lastUrl;
		}
	}
	,onHashChange: function(url) {
		this.loadURL(HxOverrides.substr(url,1,null));
	}
	,__class__: tid_Group
};
var tid_GroupSearch = function(e,boot) {
	var _g = this;
	this.input = e;
	this.boot = boot;
	this.name = this.input.attr("name");
	this.waitingReply = false;
	this.askedSubmit = false;
	this.locked = false;
	tid_GroupSearch.ICON_URL = "http://" + boot.host + "/i/c#.png";
	tid_GroupSearch.ICON_UNKNOWN = "http://" + boot.host + "/img/icons/grayCol.png";
	var padding = Std.parseInt(this.input.css("padding-left"));
	this.cont = js.JQuery("<div class='tid_userSearchContainer'></div>");
	this.input.wrap(this.cont);
	this.cont = this.input.closest(".tid_userSearchContainer");
	var w = this.input.width();
	var h = this.input.height();
	if(w == 0) w = 100;
	if(h == 0) h = 16;
	this.cont.css({ width : w, height : h});
	this.input.css({ width : w, height : h});
	this.loading = js.JQuery("<img class=\"tid_loadingSearch\" src=\"//" + boot.dataHost + "/img/loading.gif\"/>");
	this.popup = js.JQuery("<div class=\"tid_search_popup\" style=\"display:none\"/>");
	this.hidden = tid_GroupSearch.j("<input type=\"hidden\" name=\"" + this.name + "\" id=\"" + this.input.attr("id") + "\"/>");
	if(this.input.attr("tid_friends") != "0" && this.input.attr("tid:friends") != "0") {
		var frBut = js.JQuery("<a href='#' class='tid_friendsButton'></a>");
		frBut.append("<img class='tid_down' src='http://" + boot.host + "/img/design/arrowDrop.png' alt=''/>");
		frBut.append("<img class='tid_ficon' src='http://" + boot.host + "/img/icons/contact.png' alt=''/>");
		frBut.css({ height : this.input.height() + "px", lineHeight : this.input.height() + "px", zIndex : 2, position : "absolute"});
		frBut.click($bind(this,this.onShowGroups));
		this.cont.prepend(frBut);
		this.input.addClass("tid_withFriends");
		this.mygroups = js.JQuery("<div class=\"tid_search_popup\" style=\"display:none\"/>");
		this.cont.prepend(this.mygroups);
		this.popup.css("margin-left","25px");
		padding += 25;
	}
	this.popup.mousedown(function(e1) {
		_g.focusPopUp = true;
	});
	this.input.click(function(e2) {
		_g.focusPopUp = false;
	});
	if(this.input.css("float") != null) {
		this.cont.css("float",this.input.css("float"));
		this.input.css("float","none");
		if(this.input.css("position") == "relative") this.cont.css("position",this.input.css("position"));
	}
	this.input.css({ position : "absolute", zIndex : 1, width : Std.parseInt(this.input.css("width")) - padding + "px", paddingLeft : padding + "px"});
	this.cont.prepend(this.popup);
	this.cont.append(this.hidden);
	this.cont.prepend(this.loading);
	this.input.attr("name",this.name + "_name");
	this.input.attr("autocomplete","off");
	this.input.keyup($bind(this,this.onKeyUp));
	this.input.keydown($bind(this,this.onKeyDown));
	this.input.focus($bind(this,this.onFocus));
	this.input.blur($bind(this,this.onLoseFocus));
	this.oldVal = this.getInputVal();
	this.form = this.input.closest("form");
	this.form.submit(function(e3) {
		if(_g.locked) {
			e3.stopImmediatePropagation();
			e3.stopPropagation();
			e3.preventDefault();
		}
	});
	this.lockForm();
	var n = this.form.find("input").not("[type=hidden]").not("[type=submit]").not("[type=reset]").length - 1;
	n += this.form.find("textarea").length;
	n += this.form.find("select").length;
	n += this.form.find("button").length;
	this.simpleForm = n <= 0;
	if(this.input.attr("tid_value") != null) {
		var v = this.input.attr("tid_value");
		this.name = v.split("/")[0];
		this.input.val(this.name);
		this.hidden.val(v.split("/")[1]);
		this.oldVal = this.name;
		this.unlockForm();
	}
};
$hxClasses["tid.GroupSearch"] = tid_GroupSearch;
tid_GroupSearch.__name__ = ["tid","GroupSearch"];
tid_GroupSearch.j = function(q) {
	return js.JQuery(q);
};
tid_GroupSearch.prototype = {
	getInputVal: function() {
		if(this.input.attr("tid_default") != null && this.input.val() == this.input.attr("tid_default") || this.input.attr("tid:default") != null && this.input.val() == this.input.attr("tid:default")) return ""; else return this.input.val();
	}
	,isOptional: function() {
		return this.input.attr("tid_optional") == "1" || this.input.attr("tid:optional") == "1";
	}
	,isSiteLock: function() {
		return this.input.attr("tid_siteLock") == "1";
	}
	,onKeyDown: function(k) {
		var _g = k.which;
		switch(_g) {
		case 40:
			this.onArrowKey(1);
			break;
		case 38:
			this.onArrowKey(-1);
			break;
		}
	}
	,onKeyUp: function(k) {
		var _g = k.which;
		switch(_g) {
		case 9:
			break;
		case 8:
			this.reset();
			if(this.getInputVal().length <= 2) {
				this.closeSearch();
				this.stopTimer();
			} else this.startTimer();
			break;
		case 13:
			if(this.getInputVal().length >= tid_GroupSearch.MIN_LENGTH) {
				if(this.timer != null) this.onTimer();
				if(this.waitingReply) {
					this.askedSubmit = true;
					this.input.blur();
				} else {
					this.input.blur();
					this.submit();
				}
			}
			break;
		default:
			if(this.getInputVal() != this.oldVal) {
				this.reset();
				this.closeSearch();
				if(this.timer == null && this.getInputVal().length >= tid_GroupSearch.MIN_LENGTH) this.startTimer();
			}
			this.oldVal = this.getInputVal();
		}
	}
	,onArrowKey: function(d) {
		var all = this.popup.find(".tid_select");
		var old = all.filter(".tid_active").index(".tid_select");
		var cur = d + old;
		if(cur >= all.length) cur = all.length - 1;
		if(cur < 0) cur = 0;
		if(cur == old) return;
		this.boot.scrollVisible(all.removeClass("tid_active").eq(cur).addClass("tid_active"));
	}
	,lockForm: function() {
		if(this.getInputVal().length != 0 || !this.isOptional()) {
			this.locked = true;
			if(this.form.attr("onsubmit") != null) {
				this.oldOnSubmit = this.form.attr("onsubmit");
				this.form.removeAttr("onsubmit");
			}
			if(this.input.attr("tid_debug") == "1") this.form.css("outline","1px dashed red");
		}
	}
	,unlockForm: function() {
		this.locked = false;
		if(this.oldOnSubmit != null) {
			this.form.attr("onsubmit",this.oldOnSubmit);
			this.oldOnSubmit = null;
		}
		if(this.input.attr("tid_debug") == "1") this.form.css("outline","none");
	}
	,submit: function() {
		this.unlockForm();
		this.form.submit();
	}
	,error: function() {
		this.input.addClass("tid_search_error");
		this.hidden.val("");
		this.lockForm();
	}
	,reset: function() {
		this.input.removeClass("tid_search_error");
		this.hidden.val("");
		this.lockForm();
	}
	,search: function() {
		var _g = this;
		this.waitingReply = true;
		var s = this.getInputVal();
		if(s.length < tid_GroupSearch.MIN_LENGTH) {
			this.closeSearch();
			if(s.length > 0) this.error();
			return false;
		}
		this.closeSearch();
		this.loading.show();
		this.lastRequest = s;
		this.boot.loadJS("/mod/searchGroups",{ str : s, name : this.name, siteHost : this.isSiteLock()?window.location.hostname:null});
		this.boot.fillSearch = function(name2,search) {
			if(name2 == _g.name && search == s) return $bind(_g,_g.onSearch); else return function(_) {
			};
		};
		return true;
	}
	,onSearch: function(html) {
		var _g = this;
		this.waitingReply = false;
		this.loading.hide();
		console.log("onsearch " + html);
		this.popup.html(this.boot.addNamespace(html,"tid_"));
		if(!this.input["is"](":focus")) {
			if(!this.selectResult(this.popup,null,false)) this.error(); else if(this.askedSubmit) this.submit();
			this.closeSearch();
		} else {
			this.popup.show().fadeTo(300,1);
			this.popup.find(".tid_select").mouseover(function(_) {
				_g.popup.find(".tid_select").removeClass("tid_active");
				js.JQuery(this).addClass("tid_active");
			});
			this.popup.find(".tid_select").click(function() {
				_g.selectResult(_g.popup,js.JQuery(this));
				return false;
			});
		}
	}
	,selectResult: function(parent,sel,autoSubmit) {
		if(autoSubmit == null) autoSubmit = true;
		console.log("selectResult auto=" + (autoSubmit == null?"null":"" + autoSubmit) + " sel=" + Std.string(sel));
		if(sel == null) {
			sel = parent.find(".tid_active");
			if(sel.length == 0) sel = parent.find(".tid_select").first();
			if(sel.length == 0) return false;
		}
		var r = sel.attr("tid_data").split("/");
		this.input.val(r[0]);
		this.hidden.val(r[1]);
		this.closeSearch(true);
		this.unlockForm();
		if(autoSubmit && this.simpleForm && !this.askedSubmit) this.submit();
		return true;
	}
	,closeSearch: function(delay) {
		if(delay == null) delay = false;
		var _g = this;
		var d;
		if(delay) d = 250; else d = 0;
		haxe_Timer.delay(function() {
			_g.popup.hide();
			_g.popup.html("");
		},d);
	}
	,stopTimer: function() {
		if(this.timer != null) {
			this.loading.hide();
			this.timer.stop();
			this.timer = null;
		}
	}
	,startTimer: function() {
		this.loading.show();
		this.stopTimer();
		this.timer = new haxe_Timer(500);
		this.timer.run = $bind(this,this.onTimer);
	}
	,onTimer: function() {
		this.stopTimer();
		this.search();
	}
	,onFocus: function(_) {
		this.askedSubmit = false;
		this.focusPopUp = false;
		this.closeMygroups();
	}
	,onLoseFocus: function(_) {
		if(this.focusPopUp) return;
		if(this.getInputVal().length == 0 && this.isOptional()) this.unlockForm();
		if(this.lastRequest != this.getInputVal()) {
			this.lockForm();
			this.search();
		} else if(!this.waitingReply) {
			if(this.hidden.val() == "") {
				if(!this.selectResult(this.popup,null,false) && this.getInputVal() != "") {
					this.closeSearch(true);
					this.error();
				}
			}
		}
	}
	,closeMygroups: function() {
		if(this.mygroups != null) this.mygroups.hide();
	}
	,onShowGroups: function() {
		var _g = this;
		this.mygroups.toggle();
		if(this.mygroups.html().length == 0) {
			this.mygroups.html(this.boot.loadingHTML());
			this.boot.loadJS("/mod/myGroups",{ name : this.name, host : this.isSiteLock()?window.location.hostname:null});
			this.boot.fillSearchContacts = function(name2) {
				if(name2 == _g.name) return $bind(_g,_g.onMyGroups); else return function(_) {
				};
			};
		}
		return false;
	}
	,onMyGroups: function(html) {
		var _g = this;
		this.mygroups.html(this.boot.addNamespace(html,"tid_"));
		this.mygroups.find(".tid_select").click(function() {
			_g.reset();
			_g.selectResult(_g.mygroups,js.JQuery(this));
			_g.mygroups.hide();
			return false;
		});
	}
	,__class__: tid_GroupSearch
};
var tid_Search = function(e,boot) {
	var _g = this;
	this.input = e;
	this.boot = boot;
	this.name = this.input.attr("name");
	this.waitingReply = false;
	this.askedSubmit = false;
	this.locked = false;
	tid_Search.ICON_UNKNOWN = "//data." + boot.host + "/img/icons/grayCol.png";
	var padding = Std.parseInt(this.input.css("padding-left"));
	this.cont = js.JQuery("<div class='tid_userSearchContainer'></div>");
	this.input.wrap(this.cont);
	this.cont = this.input.closest(".tid_userSearchContainer");
	var w = this.input.width();
	var h = this.input.height();
	if(w == 0) w = 100;
	if(h == 0) h = 16;
	this.cont.css({ width : w, height : h});
	this.input.css({ width : w, height : h});
	this.loading = js.JQuery("<img class=\"tid_loadingSearch\" src=\"//" + boot.dataHost + "/img/loading.gif\"/>");
	this.popup = js.JQuery("<div class=\"tid_search_popup\" style=\"display:none\"/>");
	this.hidden = tid_Search.j("<input type=\"hidden\" name=\"" + this.name + "\" id=\"" + this.input.attr("id") + "\"/>");
	if(this.input.attr("tid_friends") != "0" && this.input.attr("tid:friends") != "0") {
		var frBut = js.JQuery("<a href='#' class='tid_friendsButton'></a>");
		frBut.append("<img class='tid_down' src='//data." + boot.host + "/img/design/arrowDrop.png' alt=''/>");
		frBut.append("<img class='tid_ficon' src='//data." + boot.host + "/img/icons/contact.png' alt=''/>");
		frBut.css({ height : this.input.height() + "px", paddingTop : this.input.css("padding-top"), lineHeight : this.input.height() + "px", zIndex : 2, position : "absolute"});
		frBut.click($bind(this,this.onShowFriends));
		this.cont.prepend(frBut);
		this.input.addClass("tid_withFriends");
		this.friends = js.JQuery("<div class=\"tid_search_popup\" style=\"display:none\"/>");
		this.cont.prepend(this.friends);
		this.popup.css("margin-left","25px");
		padding += 25;
	}
	this.popup.mousedown(function(e1) {
		_g.focusPopUp = true;
	});
	this.input.click(function(e2) {
		_g.focusPopUp = false;
	});
	if(this.input.css("float") != null) {
		this.cont.css("float",this.input.css("float"));
		this.input.css("float","none");
		if(this.input.css("position") == "relative") this.cont.css("position",this.input.css("position"));
	}
	this.input.css({ position : "absolute", zIndex : 1, width : Std.parseInt(this.input.css("width")) - padding + "px", paddingLeft : padding + "px"});
	this.cont.prepend(this.popup);
	this.cont.append(this.hidden);
	this.cont.prepend(this.loading);
	this.input.attr("name",this.name + "_name");
	this.input.attr("autocomplete","off");
	this.input.keyup($bind(this,this.onKeyUp));
	this.input.keydown($bind(this,this.onKeyDown));
	this.input.focus($bind(this,this.onFocus));
	this.input.blur($bind(this,this.onLoseFocus));
	this.oldVal = this.getInputVal();
	this.form = this.input.closest("form");
	this.form.submit(function(e3) {
		if(_g.locked) {
			e3.stopImmediatePropagation();
			e3.stopPropagation();
			e3.preventDefault();
		}
	});
	this.lockForm();
	var n = this.form.find("input").not("[type=hidden]").not("[type=submit]").not("[type=reset]").length - 1;
	n += this.form.find("textarea").length;
	n += this.form.find("select").length;
	n += this.form.find("button").length;
	this.simpleForm = n <= 0;
	if(this.input.attr("tid_value") != null) {
		var v = this.input.attr("tid_value");
		this.name = v.split("/")[0];
		this.input.val(this.name);
		this.hidden.val(v.split("/")[1]);
		this.oldVal = this.name;
		this.unlockForm();
	}
};
$hxClasses["tid.Search"] = tid_Search;
tid_Search.__name__ = ["tid","Search"];
tid_Search.j = function(q) {
	return js.JQuery(q);
};
tid_Search.prototype = {
	getInputVal: function() {
		if(this.input.attr("tid_default") != null && this.input.val() == this.input.attr("tid_default") || this.input.attr("tid:default") != null && this.input.val() == this.input.attr("tid:default")) return ""; else return this.input.val();
	}
	,isOptional: function() {
		return this.input.attr("tid_optional") == "1" || this.input.attr("tid:optional") == "1";
	}
	,isSiteLock: function() {
		return this.input.attr("tid_siteLock") == "1";
	}
	,onKeyDown: function(k) {
		var _g = k.which;
		switch(_g) {
		case 40:
			this.onArrowKey(1);
			break;
		case 38:
			this.onArrowKey(-1);
			break;
		}
	}
	,onKeyUp: function(k) {
		var _g = k.which;
		switch(_g) {
		case 9:
			break;
		case 8:
			this.reset();
			if(this.getInputVal().length <= 2) {
				this.closeSearch();
				this.stopTimer();
			} else this.startTimer();
			break;
		case 13:
			if(this.getInputVal().length >= tid_Search.MIN_LENGTH) {
				if(this.timer != null) this.onTimer();
				if(this.waitingReply) {
					this.askedSubmit = true;
					this.input.blur();
				} else {
					this.input.blur();
					this.submit();
				}
			}
			break;
		default:
			if(this.getInputVal() != this.oldVal) {
				this.reset();
				this.closeSearch();
				if(this.timer == null && this.getInputVal().length >= tid_Search.MIN_LENGTH) this.startTimer();
			}
			this.oldVal = this.getInputVal();
		}
	}
	,onArrowKey: function(d) {
		var all = this.popup.find(".tid_select");
		var old = all.filter(".tid_active").index(".tid_select");
		var cur = d + old;
		if(cur >= all.length) cur = all.length - 1;
		if(cur < 0) cur = 0;
		if(cur == old) return;
		this.boot.scrollVisible(all.removeClass("tid_active").eq(cur).addClass("tid_active"));
	}
	,lockForm: function() {
		if(this.getInputVal().length != 0 || !this.isOptional()) {
			this.locked = true;
			if(this.form.attr("onsubmit") != null) {
				this.oldOnSubmit = this.form.attr("onsubmit");
				this.form.removeAttr("onsubmit");
			}
			if(this.input.attr("tid_debug") == "1") this.form.css("outline","1px dashed red");
		}
	}
	,unlockForm: function() {
		this.locked = false;
		if(this.oldOnSubmit != null) {
			this.form.attr("onsubmit",this.oldOnSubmit);
			this.oldOnSubmit = null;
		}
		if(this.input.attr("tid_debug") == "1") this.form.css("outline","none");
	}
	,submit: function() {
		this.unlockForm();
		this.form.submit();
	}
	,error: function() {
		this.input.addClass("tid_search_error");
		this.hidden.val("");
		this.lockForm();
	}
	,reset: function() {
		this.input.removeClass("tid_search_error");
		this.hidden.val("");
		this.lockForm();
	}
	,search: function() {
		var _g = this;
		this.waitingReply = true;
		var s = this.getInputVal();
		if(s.length < tid_Search.MIN_LENGTH) {
			this.closeSearch();
			if(s.length > 0) this.error();
			return false;
		}
		this.closeSearch();
		this.loading.show();
		this.lastRequest = s;
		this.boot.loadJS("/mod/search",{ name : s, elt : this.name, siteHost : this.isSiteLock()?window.location.hostname:null});
		this.boot.fillSearch = function(name2,search) {
			if(name2 == _g.name && search == s) return $bind(_g,_g.onSearch); else return function(_) {
			};
		};
		return true;
	}
	,onSearch: function(html) {
		var _g = this;
		this.waitingReply = false;
		this.loading.hide();
		this.popup.html(this.boot.addNamespace(html,"tid_"));
		if(!this.input["is"](":focus")) {
			if(!this.selectResult(this.popup,null,false)) this.error(); else if(this.askedSubmit) this.submit();
			this.closeSearch();
		} else {
			this.popup.show().fadeTo(300,1);
			var pt = this.popup.offset();
			if(pt.left + this.popup.width() >= window.innerWidth) {
				var m = window.innerWidth - this.popup.width() - pt.left;
				this.popup.css("margin-left",m + "px");
			}
			this.popup.find(".tid_select").mouseover(function(_) {
				_g.popup.find(".tid_select").removeClass("tid_active");
				js.JQuery(this).addClass("tid_active");
			});
			this.popup.find(".tid_select").click(function() {
				_g.selectResult(_g.popup,js.JQuery(this));
				return false;
			});
		}
	}
	,selectResult: function(parent,sel,autoSubmit) {
		if(autoSubmit == null) autoSubmit = true;
		if(sel == null) {
			sel = parent.find(".tid_active");
			if(sel.length == 0) sel = parent.find(".tid_select").first();
			if(sel.length == 0) return false;
		}
		var r = sel.attr("tid_data").split("/");
		this.input.val(r[0]);
		this.hidden.val(r[1]);
		this.closeSearch(true);
		this.unlockForm();
		if(autoSubmit && this.simpleForm && !this.askedSubmit) this.submit();
		return true;
	}
	,closeSearch: function(delay) {
		if(delay == null) delay = false;
		var _g = this;
		var d;
		if(delay) d = 250; else d = 0;
		haxe_Timer.delay(function() {
			_g.popup.hide();
			_g.popup.html("");
		},d);
	}
	,stopTimer: function() {
		if(this.timer != null) {
			this.loading.hide();
			this.timer.stop();
			this.timer = null;
		}
	}
	,startTimer: function() {
		this.loading.show();
		this.stopTimer();
		this.timer = new haxe_Timer(500);
		this.timer.run = $bind(this,this.onTimer);
	}
	,onTimer: function() {
		this.stopTimer();
		this.search();
	}
	,onFocus: function(_) {
		this.askedSubmit = false;
		this.focusPopUp = false;
		this.closeFriends();
	}
	,onLoseFocus: function(_) {
		if(this.focusPopUp) return;
		if(this.getInputVal().length == 0 && this.isOptional()) this.unlockForm();
		if(this.lastRequest != this.getInputVal()) {
			this.lockForm();
			this.search();
		} else if(!this.waitingReply) {
			if(this.hidden.val() == "") {
				if(!this.selectResult(this.popup,null,false) && this.getInputVal() != "") {
					this.closeSearch(true);
					this.error();
				}
			}
		}
	}
	,closeFriends: function() {
		if(this.friends != null) this.friends.hide();
	}
	,onShowFriends: function() {
		var _g = this;
		this.friends.toggle();
		if(this.friends.html().length == 0) {
			this.friends.html(this.boot.loadingHTML());
			this.boot.loadJS("/mod/searchContacts",{ name : this.name, siteHost : this.isSiteLock()?window.location.hostname:null});
			this.boot.fillSearchContacts = function(name2) {
				if(name2 == _g.name) return $bind(_g,_g.onFriends); else return function(_) {
				};
			};
		}
		return false;
	}
	,onFriends: function(html) {
		var _g = this;
		this.friends.html(this.boot.addNamespace(html,"tid_"));
		this.friends.find(".tid_select").click(function() {
			_g.reset();
			_g.selectResult(_g.friends,js.JQuery(this));
			_g.friends.hide();
			return false;
		});
	}
	,__class__: tid_Search
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
var __map_reserved = {}
var q = window.jQuery;
var js = js || {}
js.JQuery = q;
q.fn.iterator = function() {
	return { pos : 0, j : this, hasNext : function() {
		return this.pos < this.j.length;
	}, next : function() {
		return $(this.j[this.pos++]);
	}};
};
var ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = $global.DataView || js_html_compat_DataView;
var Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
var win = window;
if(win.mt == null) win.mt = { };
if(win.mt.js == null) win.mt.js = { };
win.mt.js.Twinoid = mt_js_Twinoid;
haxe_Serializer.USE_CACHE = false;
haxe_Serializer.USE_ENUM_INDEX = false;
haxe_Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe_Unserializer.DEFAULT_RESOLVER = Type;
haxe_Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe_ds_ObjectMap.count = 0;
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
mt_MLib.INT8_MIN = -128;
mt_MLib.INT8_MAX = 127;
mt_MLib.UINT8_MAX = 255;
mt_MLib.INT16_MIN = -32768;
mt_MLib.INT16_MAX = 32767;
mt_MLib.UINT16_MAX = 65535;
mt_MLib.INT32_MIN = -2147483648;
mt_MLib.INT32_MAX = 2147483647;
mt_MLib.UINT32_MAX = -1;
mt_MLib.INT_BITS = 32;
mt_MLib.FLOAT_MAX = 3.4028234663852886e+38;
mt_MLib.FLOAT_MIN = -3.4028234663852886e+38;
mt_MLib.DOUBLE_MAX = 1.7976931348623157e+308;
mt_MLib.DOUBLE_MIN = -1.7976931348623157e+308;
mt_MLib.RAD_DEG = 57.295779513082323;
mt_MLib.DEG_RAD = 0.017453292519943295;
mt_MLib.LN2 = 0.6931471805599453;
mt_MLib.PIHALF = 1.5707963267948966;
mt_MLib.PI = 3.141592653589793;
mt_MLib.PI2 = 6.283185307179586;
mt_MLib.EPS = 1e-6;
mt_MLib.SQRT2 = 1.414213562373095;
mt_Utf8.NBSP = " ";
mt_deepnight_Color.BLACK = { r : 0, g : 0, b : 0};
mt_deepnight_Color.WHITE = { r : 255, g : 255, b : 255};
mt_deepnight_Color.MEDIAN_GRAY = { r : 128, g : 128, b : 128};
mt_js_ScrollBar.DEFAULT_PADDING = 1;
mt_js_ScrollBar.DEFAULT_BORDER = 1;
tid_Boot.OUT_MENU_TIMER = 200;
tid_Boot.UID = 0;
tid_Boot.PAGEID = Std.random(16777216);
tid_Boot.ACTIVITY_EVENTS = "resize.monitorActivity scroll.monitorActivity mousemove.monitorActivity mousedownkeydown.monitorActivity";
tid_ContactDecoder.ENCODE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
tid_ContactDecoder.DECODE = tid_ContactDecoder.initInvChars();
tid_Editor.REG_URL = new EReg("(https?://[a-zA-Z0-9/?;&%_.#=|!+@,():-]+)","g");
tid_Editor.REG_LNK = new EReg("^(https?://[a-zA-Z0-9/?;&%_.#=|!+@,():-]+)","");
tid_Editor.REG_ESCAPEREG = new EReg("([\\\\()\\[\\]{}<>.+*?^$=!|:-])","g");
tid_Format.SPECIAL_CHARS = "\r\n \t=[*/<'-";
tid_Format.STABLE = (function($this) {
	var $r;
	var t = [];
	{
		var _g1 = 0;
		var _g = tid_Format.SPECIAL_CHARS.length;
		while(_g1 < _g) {
			var i = _g1++;
			t[HxOverrides.cca(tid_Format.SPECIAL_CHARS,i)] = true;
		}
	}
	$r = t;
	return $r;
}(this));
tid_GoogleAnalytics.IDX = 0;
tid_GroupSearch.MIN_LENGTH = 3;
tid_GroupSearch.ICON_URL = "";
tid_GroupSearch.ICON_UNKNOWN = "";
tid_Search.MIN_LENGTH = 3;
tid_Search.ICON_UNKNOWN = "";
tid_Boot.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
