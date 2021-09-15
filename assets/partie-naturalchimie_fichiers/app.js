var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += " => ";
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.cca(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntHash = $hxClasses["IntHash"] = function() {
	this.h = { };
};
IntHash.__name__ = ["IntHash"];
IntHash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += " => ";
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,h: null
	,__class__: IntHash
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Lambda = $hxClasses["Lambda"] = function() { }
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += "{";
		while(l != null) {
			if(first) first = false; else s.b += ", ";
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += "}";
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
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
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return x <= 0?0:Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	return quotes?s.split("\"").join("&quot;").split("'").join("&#039;"):s;
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&quot;").join("\"").split("&#039;").join("'").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.cca(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
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
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
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
		var c = v.__class__;
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
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var Xml = $hxClasses["Xml"] = function() {
};
Xml.__name__ = ["Xml"];
Xml.Element = null;
Xml.PCData = null;
Xml.CData = null;
Xml.Comment = null;
Xml.DocType = null;
Xml.Prolog = null;
Xml.Document = null;
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
}
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new Hash();
	r.set_nodeName(name);
	return r;
}
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
}
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
}
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
}
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
}
Xml.createProlog = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Prolog;
	r.set_nodeValue(data);
	return r;
}
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
}
Xml.prototype = {
	toString: function() {
		if(this.nodeType == Xml.PCData) return this._nodeValue;
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.Prolog) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b += "<";
			s.b += Std.string(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b += " ";
				s.b += Std.string(k);
				s.b += "=\"";
				s.b += Std.string(this._attributes.get(k));
				s.b += "\"";
			}
			if(this._children.length == 0) {
				s.b += "/>";
				return s.b;
			}
			s.b += ">";
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.b += Std.string(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b += "</";
			s.b += Std.string(this._nodeName);
			s.b += ">";
		}
		return s.b;
	}
	,insertChild: function(x,pos) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.splice(pos,0,x);
	}
	,removeChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		var b = HxOverrides.remove(this._children,x);
		if(b) x._parent = null;
		return b;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,firstChild: function() {
		if(this._children == null) throw "bad nodetype";
		return this._children[0];
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k++;
				if(n.nodeType == Xml.Element && n._nodeName == name) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
		}};
	}
	,attributes: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.keys();
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,remove: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.remove(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,get_parent: function() {
		return this._parent;
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,get_nodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,_parent: null
	,_children: null
	,_attributes: null
	,_nodeValue: null
	,_nodeName: null
	,parent: null
	,nodeType: null
	,__class__: Xml
	,__properties__: {set_nodeName:"set_nodeName",get_nodeName:"get_nodeName",set_nodeValue:"set_nodeValue",get_nodeValue:"get_nodeValue",get_parent:"get_parent"}
}
var haxe = haxe || {}
haxe.Http = $hxClasses["haxe.Http"] = function(url) {
	this.url = url;
	this.headers = new Hash();
	this.params = new Hash();
	this.async = true;
};
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.requestUrl = function(url) {
	var h = new haxe.Http(url);
	h.async = false;
	var r = null;
	h.onData = function(d) {
		r = d;
	};
	h.onError = function(e) {
		throw e;
	};
	h.request(false);
	return r;
}
haxe.Http.prototype = {
	onStatus: function(status) {
	}
	,onError: function(msg) {
	}
	,onData: function(data) {
	}
	,request: function(post) {
		var me = this;
		var r = new js.XMLHttpRequest();
		var onreadystatechange = function() {
			if(r.readyState != 4) return;
			var s = (function($this) {
				var $r;
				try {
					$r = r.status;
				} catch( e ) {
					$r = null;
				}
				return $r;
			}(this));
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) me.onData(r.responseText); else switch(s) {
			case null: case undefined:
				me.onError("Failed to connect or resolve host");
				break;
			case 12029:
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.onError("Unknown host");
				break;
			default:
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.keys();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += StringTools.urlEncode(p) + "=" + StringTools.urlEncode(this.params.get(p));
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e ) {
			this.onError(e.toString());
			return;
		}
		if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.keys();
		while( $it1.hasNext() ) {
			var h = $it1.next();
			r.setRequestHeader(h,this.headers.get(h));
		}
		r.send(uri);
		if(!this.async) onreadystatechange();
	}
	,setPostData: function(data) {
		this.postData = data;
	}
	,setParameter: function(param,value) {
		this.params.set(param,value);
	}
	,setHeader: function(header,value) {
		this.headers.set(header,value);
	}
	,params: null
	,headers: null
	,postData: null
	,async: null
	,url: null
	,__class__: haxe.Http
}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Serializer = $hxClasses["haxe.Serializer"] = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new Hash();
	this.scount = 0;
};
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
}
haxe.Serializer.prototype = {
	serializeException: function(e) {
		this.buf.b += "x";
		this.serialize(e);
	}
	,serialize: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 0:
			this.buf.b += "n";
			break;
		case 1:
			if(v == 0) {
				this.buf.b += "z";
				return;
			}
			this.buf.b += "i";
			this.buf.b += Std.string(v);
			break;
		case 2:
			if(Math.isNaN(v)) this.buf.b += "k"; else if(!Math.isFinite(v)) this.buf.b += Std.string(v < 0?"m":"p"); else {
				this.buf.b += "d";
				this.buf.b += Std.string(v);
			}
			break;
		case 3:
			this.buf.b += Std.string(v?"t":"f");
			break;
		case 6:
			var c = $e[2];
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
				var _g = 0;
				while(_g < l) {
					var i = _g++;
					if(v[i] == null) ucount++; else {
						if(ucount > 0) {
							if(ucount == 1) this.buf.b += "n"; else {
								this.buf.b += "u";
								this.buf.b += Std.string(ucount);
							}
							ucount = 0;
						}
						this.serialize(v[i]);
					}
				}
				if(ucount > 0) {
					if(ucount == 1) this.buf.b += "n"; else {
						this.buf.b += "u";
						this.buf.b += Std.string(ucount);
					}
				}
				this.buf.b += "h";
				break;
			case List:
				this.buf.b += "l";
				var v1 = v;
				var $it0 = v1.iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					this.serialize(i);
				}
				this.buf.b += "h";
				break;
			case Date:
				var d = v;
				this.buf.b += "v";
				this.buf.b += Std.string(HxOverrides.dateStr(d));
				break;
			case Hash:
				this.buf.b += "b";
				var v1 = v;
				var $it1 = v1.keys();
				while( $it1.hasNext() ) {
					var k = $it1.next();
					this.serializeString(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += "h";
				break;
			case IntHash:
				this.buf.b += "q";
				var v1 = v;
				var $it2 = v1.keys();
				while( $it2.hasNext() ) {
					var k = $it2.next();
					this.buf.b += ":";
					this.buf.b += Std.string(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += "h";
				break;
			case haxe.io.Bytes:
				var v1 = v;
				var i = 0;
				var max = v1.length - 2;
				var charsBuf = new StringBuf();
				var b64 = haxe.Serializer.BASE64;
				while(i < max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					var b3 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt((b2 << 2 | b3 >> 6) & 63));
					charsBuf.b += Std.string(b64.charAt(b3 & 63));
				}
				if(i == max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt(b2 << 2 & 63));
				} else if(i == max + 1) {
					var b1 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt(b1 << 4 & 63));
				}
				var chars = charsBuf.b;
				this.buf.b += "s";
				this.buf.b += Std.string(chars.length);
				this.buf.b += ":";
				this.buf.b += Std.string(chars);
				break;
			default:
				this.cache.pop();
				if(v.hxSerialize != null) {
					this.buf.b += "C";
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					v.hxSerialize(this);
					this.buf.b += "g";
				} else {
					this.buf.b += "c";
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					this.serializeFields(v);
				}
			}
			break;
		case 4:
			if(this.useCache && this.serializeRef(v)) return;
			this.buf.b += "o";
			this.serializeFields(v);
			break;
		case 7:
			var e = $e[2];
			if(this.useCache && this.serializeRef(v)) return;
			this.cache.pop();
			this.buf.b += Std.string(this.useEnumIndex?"j":"w");
			this.serializeString(Type.getEnumName(e));
			if(this.useEnumIndex) {
				this.buf.b += ":";
				this.buf.b += Std.string(v[1]);
			} else this.serializeString(v[0]);
			this.buf.b += ":";
			var l = v.length;
			this.buf.b += Std.string(l - 2);
			var _g = 2;
			while(_g < l) {
				var i = _g++;
				this.serialize(v[i]);
			}
			this.cache.push(v);
			break;
		case 5:
			throw "Cannot serialize function";
			break;
		default:
			throw "Cannot serialize " + Std.string(v);
		}
	}
	,serializeFields: function(v) {
		var _g = 0, _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += "g";
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0, _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
				this.buf.b += Std.string(i);
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += "R";
			this.buf.b += Std.string(x);
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += "y";
		s = StringTools.urlEncode(s);
		this.buf.b += Std.string(s.length);
		this.buf.b += ":";
		this.buf.b += Std.string(s);
	}
	,toString: function() {
		return this.buf.b;
	}
	,useEnumIndex: null
	,useCache: null
	,scount: null
	,shash: null
	,cache: null
	,buf: null
	,__class__: haxe.Serializer
}
haxe.Timer = $hxClasses["haxe.Timer"] = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,id: null
	,__class__: haxe.Timer
}
haxe.Unserializer = $hxClasses["haxe.Unserializer"] = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0, _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.cca(i)] = i;
	}
	return codes;
}
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
}
haxe.Unserializer.prototype = {
	unserialize: function() {
		switch(this.buf.cca(this.pos++)) {
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
			var p1 = this.pos;
			while(true) {
				var c = this.buf.cca(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.buf.cca(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = StringTools.urlDecode(s);
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c = this.buf.cca(this.pos);
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
			var n = this.readDigits();
			if(n < 0 || n >= this.cache.length) throw "Invalid reference";
			return this.cache[n];
		case 82:
			var n = this.readDigits();
			if(n < 0 || n >= this.scache.length) throw "Invalid string reference";
			return this.scache[n];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 119:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl)[index];
			if(tag == null) throw "Unknown enum index " + name + "@" + index;
			var e = this.unserializeEnum(edecl,tag);
			this.cache.push(e);
			return e;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf = this.buf;
			while(this.buf.cca(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new Hash();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.cca(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h = new IntHash();
			this.cache.push(h);
			var buf = this.buf;
			var c = this.buf.cca(this.pos++);
			while(c == 58) {
				var i = this.readDigits();
				h.set(i,this.unserialize());
				c = this.buf.cca(this.pos++);
			}
			if(c != 104) throw "Invalid IntHash format";
			return h;
		case 118:
			var d = HxOverrides.strDate(HxOverrides.substr(this.buf,this.pos,19));
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len = this.readDigits();
			var buf = this.buf;
			if(this.buf.cca(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i = this.pos;
			var rest = len & 3;
			var size = (len >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i + (len - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i < max) {
				var c1 = codes[buf.cca(i++)];
				var c2 = codes[buf.cca(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				var c3 = codes[buf.cca(i++)];
				bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				var c4 = codes[buf.cca(i++)];
				bytes.b[bpos++] = (c3 << 6 | c4) & 255;
			}
			if(rest >= 2) {
				var c1 = codes[buf.cca(i++)];
				var c2 = codes[buf.cca(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				if(rest == 3) {
					var c3 = codes[buf.cca(i++)];
					bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				}
			}
			this.pos += len;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			o.hxUnserialize(this);
			if(this.buf.cca(this.pos++) != 103) throw "Invalid custom data";
			return o;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.buf.cca(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.cca(this.pos) == 103) break;
			var k = this.unserialize();
			if(!js.Boot.__instanceof(k,String)) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.cca(this.pos);
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
	,get: function(p) {
		return this.buf.cca(p);
	}
	,getResolver: function() {
		return this.resolver;
	}
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_) {
			return null;
		}}; else this.resolver = r;
	}
	,resolver: null
	,scache: null
	,cache: null
	,length: null
	,pos: null
	,buf: null
	,__class__: haxe.Unserializer
}
if(!haxe.io) haxe.io = {}
haxe.io.Bytes = $hxClasses["haxe.io.Bytes"] = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.cca(i);
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
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.fastGet = function(b,pos) {
	return b[pos];
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0, _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g1 = 0, _g = this.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.b[i];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length?this.length:other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,b: null
	,length: null
	,__class__: haxe.io.Bytes
}
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
if(!haxe.remoting) haxe.remoting = {}
haxe.remoting.Connection = $hxClasses["haxe.remoting.Connection"] = function() { }
haxe.remoting.Connection.__name__ = ["haxe","remoting","Connection"];
haxe.remoting.Connection.prototype = {
	call: null
	,resolve: null
	,__class__: haxe.remoting.Connection
}
haxe.remoting.Context = $hxClasses["haxe.remoting.Context"] = function() {
	this.objects = new Hash();
};
haxe.remoting.Context.__name__ = ["haxe","remoting","Context"];
haxe.remoting.Context.share = function(name,obj) {
	var ctx = new haxe.remoting.Context();
	ctx.addObject(name,obj);
	return ctx;
}
haxe.remoting.Context.prototype = {
	call: function(path,params) {
		if(path.length < 2) throw "Invalid path '" + path.join(".") + "'";
		var inf = this.objects.get(path[0]);
		if(inf == null) throw "No such object " + path[0];
		var o = inf.obj;
		var m = Reflect.field(o,path[1]);
		if(path.length > 2) {
			if(!inf.rec) throw "Can't access " + path.join(".");
			var _g1 = 2, _g = path.length;
			while(_g1 < _g) {
				var i = _g1++;
				o = m;
				m = Reflect.field(o,path[i]);
			}
		}
		if(!Reflect.isFunction(m)) throw "No such method " + path.join(".");
		return m.apply(o,params);
	}
	,addObject: function(name,obj,recursive) {
		this.objects.set(name,{ obj : obj, rec : recursive});
	}
	,objects: null
	,__class__: haxe.remoting.Context
}
haxe.remoting.ExternalConnection = $hxClasses["haxe.remoting.ExternalConnection"] = function(data,path) {
	this.__data = data;
	this.__path = path;
};
haxe.remoting.ExternalConnection.__name__ = ["haxe","remoting","ExternalConnection"];
haxe.remoting.ExternalConnection.__interfaces__ = [haxe.remoting.Connection];
haxe.remoting.ExternalConnection.escapeString = function(s) {
	return s;
}
haxe.remoting.ExternalConnection.doCall = function(name,path,params) {
	try {
		var cnx = haxe.remoting.ExternalConnection.connections.get(name);
		if(cnx == null) throw "Unknown connection : " + name;
		if(cnx.__data.ctx == null) throw "No context shared for the connection " + name;
		var params1 = new haxe.Unserializer(params).unserialize();
		var ret = cnx.__data.ctx.call(path.split("."),params1);
		var s = new haxe.Serializer();
		s.serialize(ret);
		return s.toString() + "#";
	} catch( e ) {
		var s = new haxe.Serializer();
		s.serializeException(e);
		return s.toString();
	}
}
haxe.remoting.ExternalConnection.flashConnect = function(name,flashObjectID,ctx) {
	var cnx = new haxe.remoting.ExternalConnection({ ctx : ctx, name : name, flash : flashObjectID},[]);
	haxe.remoting.ExternalConnection.connections.set(name,cnx);
	return cnx;
}
haxe.remoting.ExternalConnection.prototype = {
	call: function(params) {
		var s = new haxe.Serializer();
		s.serialize(params);
		var params1 = s.toString();
		var data = null;
		var fobj = window.document[this.__data.flash];
		if(fobj == null) fobj = window.document.getElementById(this.__data.flash);
		if(fobj == null) throw "Could not find flash object '" + this.__data.flash + "'";
		try {
			data = fobj.externalRemotingCall(this.__data.name,this.__path.join("."),params1);
		} catch( e ) {
		}
		if(data == null) {
			var domain, pageDomain;
			try {
				domain = fobj.src.split("/")[2];
				pageDomain = js.Lib.window.location.host;
			} catch( e ) {
				domain = null;
				pageDomain = null;
			}
			if(domain != pageDomain) throw "ExternalConnection call failure : SWF need allowDomain('" + pageDomain + "')";
			throw "Call failure : ExternalConnection is not " + "initialized in Flash";
		}
		return new haxe.Unserializer(data).unserialize();
	}
	,close: function() {
		haxe.remoting.ExternalConnection.connections.remove(this.__data.name);
	}
	,resolve: function(field) {
		var e = new haxe.remoting.ExternalConnection(this.__data,this.__path.slice());
		e.__path.push(field);
		return e;
	}
	,__path: null
	,__data: null
	,__class__: haxe.remoting.ExternalConnection
}
if(!haxe.xml) haxe.xml = {}
haxe.xml.Parser = $hxClasses["haxe.xml.Parser"] = function() { }
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
}
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.cca(p);
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			}
			break;
		case 17:
			if(c == 93 && str.cca(p + 1) == 93 && str.cca(p + 2) == 62) {
				var child = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.cca(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.cca(p + 1) == 68 || str.cca(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.cca(p + 1) != 45 || str.cca(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.cca(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.cca(p + 1) == 45 && str.cca(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.cca(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProlog(str1));
				state = 1;
			}
			break;
		}
		c = str.cca(++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
haxe.xml.Parser.isValidChar = function(c) {
	return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45;
}
var js = js || {}
js.Tip = $hxClasses["js.Tip"] = function() { }
js.Tip.__name__ = ["js","Tip"];
js.Tip.lastRef = null;
js.Tip.placeRef = null;
js.Tip.initialized = null;
js.Tip.tooltip = null;
js.Tip.tooltipContent = null;
js.Tip.mousePos = null;
js.Tip.onHide = null;
js.Tip.show = function(refObj,contentHTML,cName,pRef) {
	js.Tip.init();
	if(js.Tip.tooltip == null) {
		js.Tip.tooltip = js.Lib.document.getElementById(js.Tip.tooltipId);
		if(js.Tip.tooltip == null) {
			js.Tip.tooltip = js.Lib.document.createElement("div");
			js.Tip.tooltip.id = js.Tip.tooltipId;
			js.Lib.document.body.insertBefore(js.Tip.tooltip,js.Lib.document.body.firstChild);
		}
		js.Tip.tooltip.style.top = "-1000px";
		js.Tip.tooltip.style.position = "absolute";
		js.Tip.tooltip.style.zIndex = 10;
	}
	if(js.Tip.tooltipContent == null) {
		js.Tip.tooltipContent = js.Lib.document.getElementById(js.Tip.tooltipContentId);
		if(js.Tip.tooltipContent == null) {
			js.Tip.tooltipContent = js.Lib.document.createElement("div");
			js.Tip.tooltipContent.id = js.Tip.tooltipContentId;
			js.Tip.tooltip.appendChild(js.Tip.tooltipContent);
		}
	}
	if(pRef == null) pRef = false;
	js.Tip.placeRef = pRef;
	if(cName == null) js.Tip.tooltip.className = js.Tip.defaultClass; else js.Tip.tooltip.className = cName;
	if(js.Tip.lastRef != null && js.Tip.onHide != null) {
		js.Tip.onHide();
		js.Tip.onHide = null;
	}
	js.Tip.lastRef = refObj;
	js.Tip.tooltipContent.innerHTML = contentHTML;
	if(js.Tip.placeRef) js.Tip.placeTooltipRef(); else js.Tip.placeTooltip();
}
js.Tip.placeTooltip = function() {
	if(js.Tip.mousePos == null) return;
	var tts = js.Tip.elementSize(js.Tip.tooltip);
	var w = js.Tip.windowSize();
	var top = 0;
	var left = 0;
	left = js.Tip.mousePos.x + js.Tip.xOffset;
	top = js.Tip.mousePos.y + js.Tip.yOffset;
	if(top + tts.height > w.height - 2 + w.scrollTop) {
		if(js.Tip.mousePos.y - tts.height > 5 + w.scrollTop) top = js.Tip.mousePos.y - tts.height - 5; else top = w.height - 2 + w.scrollTop - tts.height;
	}
	if(left + tts.width > w.width - 22 + w.scrollLeft) {
		if(js.Tip.mousePos.x - tts.width > 5 + w.scrollLeft) left = js.Tip.mousePos.x - tts.width - 5; else left = w.width - 22 + w.scrollLeft - tts.width;
	}
	if(top < 0) top = 0;
	if(left < 0) left = 0;
	js.Tip.tooltip.style.left = left + "px";
	js.Tip.tooltip.style.top = top + "px";
}
js.Tip.placeTooltipRef = function() {
	var o = js.Tip.elementSize(js.Tip.lastRef);
	var tts = js.Tip.elementSize(js.Tip.tooltip);
	if(o.width <= 0) js.Tip.tooltip.style.left = o.x + "px"; else js.Tip.tooltip.style.left = o.x - tts.width * 0.5 + o.width * 0.5 + "px";
	js.Tip.tooltip.style.top = o.y + Math.max(js.Tip.minOffsetY,o.height) + "px";
}
js.Tip.showTitledTip = function(refObj,title,contentBase,cName,pRef) {
	contentBase = "<div class='tbody'>" + contentBase + "</div>";
	js.Tip.show(refObj,"<div class=\"title\">" + title + "</div>" + contentBase,cName,pRef);
}
js.Tip.showTip = function(refObj,contentBase,cName,pRef) {
	contentBase = "<div class='tbody'>" + contentBase + "</div>";
	js.Tip.show(refObj,contentBase,cName,pRef);
}
js.Tip.hide = function() {
	if(js.Tip.lastRef == null) return;
	js.Tip.lastRef = null;
	if(js.Tip.onHide != null) {
		js.Tip.onHide();
		js.Tip.onHide = null;
	}
	js.Tip.tooltip.style.top = "-1000px";
	js.Tip.tooltip.style.width = "";
}
js.Tip.clean = function() {
	if(js.Tip.lastRef == null) return;
	if(js.Tip.lastRef.parentNode == null) return js.Tip.hide();
	if(js.Tip.lastRef.id != null && js.Tip.lastRef.id != "") {
		if(js.Lib.document.getElementById(js.Tip.lastRef.id) != js.Tip.lastRef) return js.Tip.hide();
	}
	return;
}
js.Tip.elementSize = function(o) {
	var ret = { x : 0, y : 0, width : o.clientWidth, height : o.clientHeight};
	var p = o;
	while(p != null) {
		if(p.offsetParent != null) {
			ret.x += p.offsetLeft - p.scrollLeft;
			ret.y += p.offsetTop - p.scrollTop;
		} else {
			ret.x += p.offsetLeft;
			ret.y += p.offsetTop;
		}
		p = p.offsetParent;
	}
	return ret;
}
js.Tip.windowSize = function() {
	var ret = { x : 0, y : 0, width : js.Lib.window.innerWidth, height : js.Lib.window.innerHeight, scrollLeft : js.Lib.document.body.scrollLeft + js.Lib.document.documentElement.scrollLeft, scrollTop : js.Lib.document.body.scrollTop + js.Lib.document.documentElement.scrollTop};
	var body = js.JQuery.browser.msie?js.Lib.document.documentElement:js.Lib.document.body;
	if(ret.width == null) ret.width = body.clientWidth;
	if(ret.height == null) ret.height = body.clientHeight;
	return ret;
}
js.Tip.onMouseMove = function(evt) {
	try {
		var posx = 0;
		var posy = 0;
		if(evt == null) evt = js.Lib.window.event;
		var e = evt;
		if(e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		} else if(e.clientX || e.clientY) {
			posx = e.clientX + js.Lib.document.body.scrollLeft + js.Lib.document.documentElement.scrollLeft;
			posy = e.clientY + js.Lib.document.body.scrollTop + js.Lib.document.documentElement.scrollTop;
		}
		js.Tip.mousePos = { x : posx, y : posy};
		if(js.Tip.lastRef != null && !js.Tip.placeRef) js.Tip.placeTooltip();
	} catch( e ) {
	}
}
js.Tip.init = function() {
	if(js.Tip.initialized) return;
	if(document.body != null) {
		js.Tip.initialized = true;
		document.body.onmousemove = js.Tip.onMouseMove;
	}
}
var tools = tools || {}
tools.Editor = $hxClasses["tools.Editor"] = function(name,max) {
	this.name = name;
	this.saveIt = false;
	this.newspaper = false;
	this.withImg = false;
	this.contentName = name + "_content";
	if(max != null) this.maxSize = max;
	this.config = { buttons : new List(), icons : new List(), uIcons : new List(), inks : new List(), iconsUrl : "", autoLink : true, uploadData : null, uploadColors : { bg : 0, fg : 16777215, fill : 32768}};
};
tools.Editor.__name__ = ["tools","Editor"];
tools.Editor.getElementPosition = function(o) {
	var ret = { x : 0, y : 0, width : o.clientWidth, height : o.clientHeight};
	var p = o;
	while(p != null) {
		if(p.offsetParent != null) {
			ret.x += p.offsetLeft - p.scrollLeft;
			ret.y += p.offsetTop - p.scrollTop;
		} else {
			ret.x += p.offsetLeft;
			ret.y += p.offsetTop;
		}
		p = p.offsetParent;
	}
	return ret;
}
tools.Editor.getAbsoluteParent = function(o) {
	var prev = o.parentNode;
	while(o != null) {
		haxe.Log.trace(o.tagName + ("#" + o.id) + " " + Std.string(o.style.position),{ fileName : "Editor.hx", lineNumber : 481, className : "tools.Editor", methodName : "getAbsoluteParent"});
		prev = o;
		o = o.parentNode;
		if(new EReg("^(body|html)$","i").match(o.tagName)) break;
	}
	return prev;
}
tools.Editor.prototype = {
	uploadError: function(e) {
		js.Lib.alert(this.config.uploadData.error + "\n(" + e + ")");
	}
	,uploadResult: function(url) {
		this.uploadInfos.act(url);
	}
	,initUpload: function(id,act,target) {
		this.uploadInfos = { id : id, act : act};
		if(this.config.uploadData == null) throw "No data domain";
		var cnxName = "edcnx_" + this.name;
		var cnx = haxe.remoting.ExternalConnection.flashConnect(cnxName,null,haxe.remoting.Context.share("api",this));
		var params = [this.config.uploadData.url + "upload/upload.swf","swf_" + id,"100%","100%",9];
		var swfobj;
		try {
			swfobj = eval("js.SWFObject");
		} catch( e ) {
			swfobj = eval("SWFObject");
		}
		var obj = Type.createInstance(swfobj,params);
		obj.addParam("AllowScriptAccess","always");
		var c = this.config.uploadColors;
		var colors = "&bgcolor=" + c.bg + "&fgcolor=" + c.fg + "&color=" + c.fill;
		obj.addParam("FlashVars","name=" + cnxName + "&site=" + this.config.uploadData.site + "&prefix=" + this.config.uploadData.uid + colors + (target != null?"&click=1":""));
		obj.addParam("wmode","transparent");
		obj.write(id);
		return false;
	}
	,uploadInfos: null
	,updatePreview: function(id) {
		var doc = js.Lib.document.getElementById(id);
		var d = this.getDocument();
		if(this.maxSize != null && this.getOnlyTextLength(d.value) > this.maxSize) d.value = HxOverrides.substr(d.value,0,this.lastValidLength != null?this.lastValidLength:this.maxSize); else this.lastValidLength = d.value.length;
		doc.innerHTML = this.format(d.value);
	}
	,quoteSelection: function(begin,end) {
		var doc = this.getDocument();
		var sel = new js.Selection(doc);
		sel.insert(begin,sel.get(),end);
		if(doc.onkeyup != null) doc.onkeyup(null);
	}
	,insertImage: function(url) {
		this.insert("@" + url + "@");
	}
	,insert: function(txt) {
		this.quoteSelection(txt,"");
	}
	,execute: function(act) {
		var act1 = haxe.Unserializer.run(act);
		var $e = (act1);
		switch( $e[1] ) {
		case 0:
			var tag = $e[2];
			this.insert(tag);
			break;
		case 2:
			var tag = $e[2];
			this.insert(tag);
			break;
		case 1:
			var tag = $e[2];
			this.insert(tag);
			break;
		case 5:
			var c = $e[4], span = $e[3], node = $e[2];
			this.quoteSelection("[" + node + "]","[/" + node + "]");
			break;
		case 3:
		case 4:
			var tag = $e[2];
			this.quoteSelection("[" + tag + "]","[/" + tag + "]");
			break;
		case 6:
			var node = $e[4], text = $e[3], addr = $e[2];
			var url = js.Lib.window.prompt(addr,"http://");
			if(url == null || url.length == 0 || url == "http://") return false;
			if(text != null && text != "") {
				var comment = js.Lib.window.prompt(text,url);
				if(comment.length == 0 || comment == url) this.insert("[" + node + "]" + url + "[/" + node + "]"); else this.insert("[" + node + "=" + url + "]" + comment + "[/" + node + "]");
			} else this.insert("[" + node + "]" + url + "[/" + node + "]");
			break;
		case 7:
			break;
		}
		return false;
	}
	,loadConfig: function(str) {
		this.config = haxe.Unserializer.run(str);
	}
	,getDocument: function() {
		return js.Lib.document.getElementsByName(this.contentName)[0];
	}
	,setUploadButton: function(target,act) {
		var id = target + "_swf";
		var loaded = false;
		js.Lib.document.write("<div id=\"" + id + "\"></div>");
		var but = js.Lib.document.getElementById(target);
		var me = this;
		but.onmouseover = function(_) {
			if(loaded) return;
			loaded = true;
			var doc = js.Lib.document;
			var win = js.Lib.window;
			var swf = doc.getElementById(id);
			swf.style.position = "absolute";
			swf.style.left = "0px";
			swf.style.top = "0px";
			var p = tools.Editor.getElementPosition(but);
			swf.style.width = p.width + "px";
			swf.style.height = p.height + "px";
			swf.style.zIndex = 10;
			var p2 = tools.Editor.getElementPosition(swf);
			swf.style.top = p.y - p2.y + "px";
			swf.style.left = p.x - p2.x + "px";
			me.initUpload(id,act,but);
		};
	}
	,getOnlyTextLength: function(s) {
		if(s == null || s == "") return 0;
		var res = StringTools.replace(s,":)","");
		res = StringTools.replace(res,":(","");
		res = StringTools.replace(res,"\n","");
		res = new EReg(":([^ ]+):","g").replace(res,"");
		res = new EReg("\\[([^ \\[\\]]+)\\]","g").replace(res,"");
		res = new EReg("([éèêëàâùûôç])","g").replace(res,"e");
		return res.length;
	}
	,format: function(txt) {
		if(txt == null) txt = "";
		txt = StringTools.htmlEscape(txt);
		txt = txt.split("\r\n").join("\n");
		txt = txt.split("\r").join("\n");
		txt = StringTools.trim(txt);
		txt = txt.split("\\0")[0];
		if(txt == null) return "";
		if(this.config.autoLink) {
			txt = new EReg("([^@=>\\]\"])(http://[a-zA-Z0-9/?;&=%_.-]+)","g").replace(txt,"$1<a href=\"$2\">$2</a>");
			txt = new EReg("^(http://[a-zA-Z0-9/?;&=%_.-]+)","g").replace(txt,"<a href=\"$1\">$1</a>");
		}
		if(this.config.uploadData != null) txt = new EReg("@([A-Za-z0-9/_.]+)@","g").replace(txt,"<img src=\"" + this.config.uploadData.url + "$1\"/>");
		var $it0 = this.config.icons.iterator();
		while( $it0.hasNext() ) {
			var i = $it0.next();
			txt = this.formatAction(txt,i.act);
		}
		var $it1 = this.config.uIcons.iterator();
		while( $it1.hasNext() ) {
			var i = $it1.next();
			txt = this.formatAction(txt,i.act);
		}
		var $it2 = this.config.buttons.iterator();
		while( $it2.hasNext() ) {
			var b = $it2.next();
			txt = this.formatAction(txt,b.act);
		}
		var $it3 = this.config.inks.iterator();
		while( $it3.hasNext() ) {
			var ink = $it3.next();
			txt = this.formatAction(txt,ink.act);
		}
		txt = new EReg("<([a-z]+)></\\1>","i").replace(txt,"");
		var schar = "";
		txt = txt.split(schar).join("");
		txt = new EReg("<([a-zA-Z0-9]+[^>]*/>)","g").replace(txt,schar + "$1");
		var r = new EReg("<([a-zA-Z0-9]+)([^>]*>[^<]*)</\\1>","g");
		while(true) {
			var t = r.replace(txt,schar + "$1$2" + schar + "/$1>");
			if(t == txt) break;
			txt = t;
		}
		txt = new EReg("</?[a-zA-Z0-9]+[^>]*>","g").replace(txt,"");
		txt = txt.split(schar).join("<");
		var b = new StringBuf();
		this.wordify(b,Xml.parse(txt));
		return b.b;
	}
	,wordify: function(b,x) {
		switch(x.nodeType) {
		case Xml.Document:
			var $it0 = x.iterator();
			while( $it0.hasNext() ) {
				var x1 = $it0.next();
				this.wordify(b,x1);
			}
			break;
		case Xml.Element:
			b.b += Std.string("<" + x.get_nodeName());
			var $it1 = x.attributes();
			while( $it1.hasNext() ) {
				var a = $it1.next();
				b.b += Std.string(" " + a + "=\"" + x.get(a) + "\"");
			}
			if(x.firstChild() == null) b.b += "/>"; else {
				b.b += ">";
				var $it2 = x.iterator();
				while( $it2.hasNext() ) {
					var x1 = $it2.next();
					this.wordify(b,x1);
				}
				b.b += Std.string("</" + x.get_nodeName() + ">");
			}
			break;
		case Xml.PCData:case Xml.CData:
			var first = false;
			var _g = 0, _g1 = x.get_nodeValue().split(" ");
			while(_g < _g1.length) {
				var data = _g1[_g];
				++_g;
				if(first) first = false; else b.b += " ";
				while(data.length > 40) {
					b.b += Std.string(HxOverrides.substr(data,0,40));
					b.b += " ";
					data = HxOverrides.substr(data,40,null);
				}
				b.b += Std.string(data);
			}
			break;
		default:
		}
	}
	,getInk: function(c) {
		var $it0 = this.config.inks.iterator();
		while( $it0.hasNext() ) {
			var i = $it0.next();
			if(i.col == c) return i;
		}
		return null;
	}
	,formatAction: function(txt,act) {
		var $e = (act);
		switch( $e[1] ) {
		case 0:
			var img = $e[3], tag = $e[2];
			return txt.split(tag).join("<img src=\"" + this.image(img) + "\" alt=\"\"/>");
		case 1:
			var withImg = $e[5], notOnPaper = $e[4], helpOnly = $e[3], tag = $e[2];
			return txt;
		case 2:
			var nb = $e[4], img = $e[3], tag = $e[2];
			var t = txt.split(tag);
			if(nb > 0) {
				var span = js.Lib.document.getElementById("uIcon_" + img + "_nb");
				if(span != null) span.innerHTML = Std.string(Math.max(0,nb - (t.length - 1)) | 0);
			}
			if(nb == -1 || t.length <= nb + 1) return txt.split(tag).join("<img src=\"" + this.image(img) + "\" alt=\"\"/>"); else {
				var tt = t.splice(0,nb + 1);
				var s = tt.join("<img src=\"" + this.image(img) + "\" alt=\"\"/>");
				return s + t.join("");
			}
			break;
		case 5:
			var c = $e[4], span = $e[3], node = $e[2];
			var ink = this.getInk(c);
			var cused = null;
			if(ink != null) {
				cused = this.formatColorNode(txt,node,"<span class=\"" + span + "\">","</span>");
				ink.nb = ink.nbs - cused.count;
				if(ink.nb < 0) ink.nb = 0;
				var div = js.Lib.document.getElementById("bink_" + c);
				if(div != null) div.style.height = Std.string((Math.min(ink.nb * 23 / 1500,23) | 0) + 6) + "px";
			}
			return cused != null?cused.txt:txt;
		case 3:
			var wImg = $e[6], notOnPaper = $e[5], helpOnly = $e[4], html = $e[3], node = $e[2];
			return this.formatNode(txt,node,"<" + html + ">","</" + html + ">");
		case 4:
			var wImg = $e[6], notOnPaper = $e[5], helpOnly = $e[4], span = $e[3], node = $e[2];
			return this.formatNode(txt,node,"<span class=\"" + span + "\">","</span>");
		case 6:
			var wImg = $e[7], notOnPaper = $e[6], helpOnly = $e[5], node = $e[4];
			var r = new EReg("\\[" + node + "\\](http://[^\"]*?)\\[\\/" + node + "\\]","ig");
			txt = r.replace(txt,"<a href=\"$1\" target=\"_blank\">$1</a>");
			r = new EReg("\\[" + node + "=(http://[^\"]*?)\\](.*?)\\[\\/" + node + "\\]","ig");
			return r.replace(txt,"<a href=\"$1\" target=\"_blank\">$2</a>");
		case 7:
			var wImg = $e[6], notOnPaper = $e[5], helpOnly = $e[4], replace = $e[3], ereg = $e[2];
			var r = new EReg(ereg,"ig");
			return r.replace(txt,replace);
		}
	}
	,formatColorNode: function(txt,node,h1,h2) {
		var tt = txt.split("[" + node + "]");
		var count = 0;
		var _g = 0;
		while(_g < tt.length) {
			var t = tt[_g];
			++_g;
			var test = t.split("[/" + node + "]");
			if(test.length == 2) count += StringTools.replace(test[0]," ","").length;
		}
		return { txt : tt.join(h1).split("[/" + node + "]").join(h2), count : count};
	}
	,formatNode: function(txt,node,h1,h2) {
		return txt.split("[" + node + "]").join(h1).split("[/" + node + "]").join(h2);
	}
	,image: function(img) {
		return this.config.iconsUrl.split("::img::").join(img);
	}
	,lastValidLength: null
	,config: null
	,withImg: null
	,newspaper: null
	,maxSize: null
	,name: null
	,saveIt: null
	,contentName: null
	,__class__: tools.Editor
}
if(!js.fx) js.fx = {}
js.fx.Accordion = $hxClasses["js.fx.Accordion"] = function(onlyOneItemActive) {
	this.time = 200;
	this.exclusive = onlyOneItemActive == false?false:true;
	this.items = new List();
	this.current = null;
	this.transition = null;
};
js.fx.Accordion.__name__ = ["js","fx","Accordion"];
js.fx.Accordion.prototype = {
	toggleActive: function(item) {
		item.active = !item.active;
		if(this.onChangeStatus != null) this.onChangeStatus(item);
		if(item.active) js.fx.Tool.addCssClass(item.title,"active"); else js.fx.Tool.removeCssClass(item.title,"active");
	}
	,clicked: function(item) {
		if(!this.exclusive) {
			this.toggleActive(item);
			item.slide.duration = this.getDuration();
			item.slide.toggle();
			return;
		}
		var anim = new js.fx.MultiMorph();
		if(this.exclusive) {
			if(this.current == item) {
				this.toggleActive(item);
				anim.add(item.slide);
				this.current = null;
			} else {
				if(this.current != null) {
					anim.add(this.current.slide);
					this.toggleActive(this.current);
				}
				this.current = item;
				anim.add(item.slide);
				this.toggleActive(item);
			}
		}
		anim.onComplete = function() {
			var $it0 = anim.anims.iterator();
			while( $it0.hasNext() ) {
				var a = $it0.next();
				a.updateOpenStatus();
			}
		};
		anim.duration = this.time;
		anim.start();
	}
	,collapseAll: function(animate) {
		if(animate == null) animate = true;
		if(this.exclusive) this.current = null;
		var $it0 = this.items.iterator();
		while( $it0.hasNext() ) {
			var item = $it0.next();
			if(item.active) {
				this.toggleActive(item);
				item.slide.duration = this.getDuration();
				if(animate) item.slide.toggle(); else item.slide.hide();
			}
		}
	}
	,expandAll: function(animate) {
		if(animate == null) animate = true;
		if(this.exclusive) return;
		var $it0 = this.items.iterator();
		while( $it0.hasNext() ) {
			var item = $it0.next();
			if(!item.active) {
				this.toggleActive(item);
				item.slide.duration = this.getDuration();
				if(animate) item.slide.toggle(); else item.slide.show();
			}
		}
	}
	,add: function(title,content,open) {
		var item = { title : title, content : content, slide : new js.fx.Slide(content,js.fx.SlideKind.Vertical), active : false};
		if(this.transition != null) item.slide.transition = this.transition;
		item.slide.duration = this.getDuration();
		this.items.push(item);
		var me = this;
		title.onclick = function(_) {
			me.clicked(item);
		};
		if(open == true) {
			item.active = true;
			js.fx.Tool.addCssClass(item.title,"active");
			if(this.exclusive && this.current != null) {
				this.current.slide.hide();
				this.current.active = false;
				js.fx.Tool.removeCssClass(this.current.title,"active");
				this.current = item;
			}
			this.current = item;
		} else item.slide.hide();
	}
	,setTransition: function(t) {
		this.transition = js.fx.TransitionFunctions.get(t);
		var $it0 = this.items.iterator();
		while( $it0.hasNext() ) {
			var i = $it0.next();
			i.slide.transition = this.transition;
		}
	}
	,getDuration: function() {
		return this.time;
	}
	,setDuration: function(v) {
		this.time = v;
		var $it0 = this.items.iterator();
		while( $it0.hasNext() ) {
			var i = $it0.next();
			i.slide.duration = this.time;
		}
		return this.time;
	}
	,onChangeStatus: null
	,transition: null
	,time: null
	,exclusive: null
	,items: null
	,current: null
	,__class__: js.fx.Accordion
	,__properties__: {set_duration:"setDuration",get_duration:"getDuration"}
}
js.App = $hxClasses["js.App"] = function() { }
js.App.__name__ = ["js","App"];
js.App.answers = null;
js.App.aLinks = null;
js.App.toggle = function(id) {
	var elt = js.Lib.document.getElementById(id);
	elt.style.display = elt.style.display == "none"?"":"none";
	return false;
}
js.App.main = function() {
	haxe.Timer.delay(js.App.connectLoop,js.App.DELAY);
}
js.App.initFlashConnect = function() {
	++js.App.flashAttempts;
	if(js.App.flashAttempts > 10) return;
	try {
		js.App.flc = haxe.remoting.ExternalConnection.flashConnect(js.App.CONNECT_ID,js.App.CONNECT_ID,new haxe.remoting.Context());
	} catch( e ) {
		haxe.Log.trace("error : " + Std.string(e),{ fileName : "App.hx", lineNumber : 71, className : "js.App", methodName : "initFlashConnect"});
		js.App.flc = null;
	}
}
js.App.initFlashAvatarConnect = function() {
	++js.App.flashAvAttempts;
	if(js.App.flashAvAttempts > 10) return;
	try {
		js.App.flcav = haxe.remoting.ExternalConnection.flashConnect(js.App.CONNECT_AVATAR_ID,js.App.CONNECT_AVATAR_ID,new haxe.remoting.Context());
	} catch( e ) {
		haxe.Log.trace("error : " + Std.string(e),{ fileName : "App.hx", lineNumber : 86, className : "js.App", methodName : "initFlashAvatarConnect"});
		js.App.flcav = null;
	}
}
js.App.initFlashPnjConnect = function() {
	++js.App.flashPnjAttempts;
	if(js.App.flashPnjAttempts > 10) return;
	try {
		js.App.flcpnj = haxe.remoting.ExternalConnection.flashConnect(js.App.CONNECT_PNJV_ID,js.App.CONNECT_PNJV_ID,new haxe.remoting.Context());
	} catch( e ) {
		haxe.Log.trace("error : " + Std.string(e),{ fileName : "App.hx", lineNumber : 101, className : "js.App", methodName : "initFlashPnjConnect"});
		js.App.flcpnj = null;
	}
}
js.App.connectLoop = function() {
	if(js.App.flc == null && js.Lib.document.getElementById(js.App.CONNECT_ID) != null) js.App.initFlashConnect();
	if(js.App.flcav == null && js.Lib.document.getElementById(js.App.CONNECT_AVATAR_ID) != null) js.App.initFlashAvatarConnect();
	if(js.App.flc == null && js.Lib.document.getElementById(js.App.CONNECT_PNJV_ID) != null) js.App.initFlashPnjConnect();
	if(js.App.flc == null) haxe.Timer.delay(js.App.connectLoop,js.App.DELAY);
}
js.App.switchMap = function() {
	if(js.App.flc == null) {
		js.Lib.alert("flc is null");
		return;
	}
	if(js.App.flc.resolve("_Com").resolve("_sMap").call([])) {
		js.Lib.document.getElementById("move_span_id").innerHTML = "Fermer la carte";
		js.App.activeOnly("a_map");
	} else {
		js.Lib.document.getElementById("move_span_id").innerHTML = "Se déplacer";
		js.App.activeAll();
	}
}
js.App.startDialog = function(id) {
	if(js.App.flc == null) return;
	if(js.App.flc.resolve("_Com").resolve("_sDialog").call([id])) {
		js.App.unactiveAll("a_dialog/" + id);
		js.App.switchDiv(js.App.DESC_ID,false);
	}
}
js.App.callChx = function() {
	var url = "/msg/buy";
	if(js.App.flc == null) {
		js.Lib.window.location.replace(url);
		return;
	}
	if(js.App.flc.resolve("_Com").resolve("_sDialog").call(["callChx"])) js.App.switchDiv(js.App.DESC_ID,false); else js.Lib.window.location.replace(url);
}
js.App.switchDiv = function(divid,b) {
	var e = js.Lib.document.getElementById(divid);
	if(e == null) return;
	e.style.display = b?"block":"none";
}
js.App.autoSwitch = function(divid) {
	var e = js.Lib.document.getElementById(divid);
	if(e == null) return;
	e.style.display = e.style.display == "none"?"block":"none";
}
js.App.showEditMsg = function() {
	if(js.Lib.document.getElementById("msgField") == null) return;
	js.App.switchDiv("msgBox",false);
	js.App.switchDiv("msgField",true);
	js.Lib.document.getElementById("msgField").focus();
}
js.App.saveMessage = function(url) {
	var tf = js.Lib.document.getElementById("msgText");
	var h = new haxe.Http(url);
	h.setParameter("msg",tf.value);
	js.App.switchDiv("msgField",false);
	js.App.switchDiv("msgWait",true);
	h.onData = function(data) {
		js.App.switchDiv("msgWait",false);
		js.App.switchDiv("msgBox",true);
		js.App.fill(js.Lib.document.getElementById("msgBox"),data);
	};
	haxe.Timer.delay(function() {
		h.request(true);
	},100);
}
js.App.fill = function(e,html) {
	if(HxOverrides.substr(html,0,5) == "<!DOC") {
		var r = new EReg("<body[^>]*>([^�]*)</body>","");
		js.Lib.document.getElementsByTagName("body")[0].innerHTML = r.match(html)?r.matched(1):html;
	} else e.innerHTML = html;
}
js.App.moreMeans = function() {
	js.App.switchDiv("hiddenMeans",true);
	js.App.switchDiv("hidbutton",false);
}
js.App.setAnswers = function(sa) {
	if(sa == null) return;
	js.App.answers = Lambda.map(sa.split("#"),function(s) {
		var a = s.split("µ");
		return { id : a[0], text : a[1]};
	});
	if(js.App.answers == null || js.App.answers.length < 1) {
		haxe.Log.trace("error on answers",{ fileName : "App.hx", lineNumber : 242, className : "js.App", methodName : "setAnswers"});
		return;
	}
	js.App.switchDiv(js.App.DESC_ID,false);
	var adiv = js.Lib.document.getElementById(js.App.ANSWERS_ID);
	var s = "";
	var $it0 = js.App.answers.iterator();
	while( $it0.hasNext() ) {
		var a = $it0.next();
		s += "<li id=\"law_" + a.id + "\"><a class=\"aanswer\" id=\"aw_" + a.id + "\" href=\"javascript:js.App.answer('" + a.id + "');\">" + a.text + "</a></li>";
	}
	adiv.innerHTML = "<ul class=\"puce\">" + s + "</ul>";
	js.App.switchDiv(js.App.DIALOG_ID,true);
}
js.App.answer = function(id) {
	if(js.App.flc == null) return;
	var $it0 = js.App.answers.iterator();
	while( $it0.hasNext() ) {
		var a = $it0.next();
		if(a.id == id) {
			if(js.App.flc.resolve("_Com").resolve("_answer").call([id])) js.App.lockAnswers(id);
			return;
		}
	}
}
js.App.hideAnswers = function() {
	js.App.switchDiv(js.App.DIALOG_ID,false);
	js.Lib.document.getElementById(js.App.ANSWERS_ID).innerHTML = "";
}
js.App.showDesc = function() {
	js.App.switchDiv(js.App.DESC_ID,true);
}
js.App.lockAnswers = function(id) {
	js.App.switchDiv(js.App.DIALOG_ID,false);
	js.Lib.document.getElementById(js.App.ANSWERS_ID).innerHTML = "";
}
js.App.wtg = function(t,g,p) {
	if(js.App.flcav == null) return;
	js.App.flcav.resolve("_Com").resolve("_addInfos").call([t,g,p]);
}
js.App.avu = function(s) {
	if(js.App.flcav == null) return;
	js.App.flcav.resolve("_Com").resolve("_transform").call([s]);
}
js.App.upbo = function(id,rank,a) {
	js.Lib.document.getElementById("r_" + id + "_canDoIt").innerHTML = a == "1"?"<img src=\"" + js.App.DATADOMAIN + "/img/icons/puce_ticksmall.gif\" />":"<img src=\"" + js.App.DATADOMAIN + "/img/icons/puce_failsmall.gif\" />";
	js.App.showRecipe(id);
}
js.App.dorec = function(sok,t) {
	var e = js.Lib.document.getElementById("actrecLink");
	if(e == null) return;
	var ok = Std.parseInt(sok) == 1;
	e.href = ok?"javascript:js.App.doActrec('" + t + "');":"#";
	e.className = ok?"inlinebutton":"actionInactiveInline";
}
js.App.doActrec = function(txt) {
	var e = js.Lib.document.getElementById("actrecLink");
	if(e == null) return;
	if(js.Lib.window.confirm(txt)) js.Lib.window.location.replace("/act/do?a=actrec");
}
js.App.upra = function(l,dom) {
	var elems = l.split("#");
	var i = 0;
	var _g = 0;
	while(_g < elems.length) {
		var e = elems[_g];
		++_g;
		var infos = e.split(",");
		js.Lib.document.getElementById("qty_" + infos[0]).innerHTML = js.App.numberToImage("/img/font/element",Std.parseInt(infos[1]),dom);
		if(infos[2] == "1") js.Lib.document.getElementById("done_" + infos[0]).style.display = "block";
		js.Lib.document.getElementById("live_qty_" + infos[0]).innerHTML = js.App.numberToImage("/img/font/GM",Std.parseInt(infos[3]),dom);
		var ae = js.Lib.document.getElementById("live_" + infos[0]);
		haxe.Timer.delay((function(f,ae1) {
			return function() {
				return f(ae1);
			};
		})(js.App.animUpra,ae),i * 300);
		i++;
	}
}
js.App.animUpra = function(ae) {
	js.fx.Style.setStyles(ae,{ display : "none", bottom : 15, opacity : 1});
	var anim = new js.fx.Morph(ae,{ bottom : 60});
	anim.setTransition(js.fx.Transition.Elastic(js.fx.TransitionParam.Out,0.8));
	anim.duration = 2500;
	anim.onComplete = function() {
		haxe.Timer.delay((function(f,ae1) {
			return function() {
				return f(ae1);
			};
		})(js.App.hideUpra,ae),1500);
	};
	anim.start();
	ae.style.display = "block";
}
js.App.hideUpra = function(ae) {
	js.fx.Style.setStyles(ae,{ opacity : 1});
	var anim = new js.fx.Morph(ae,{ opacity : 0});
	anim.setTransition(js.fx.Transition.Quint(js.fx.TransitionParam.Out));
	anim.duration = 2500;
	anim.onComplete = function() {
		js.fx.Style.setStyles(ae,{ display : "none", bottom : 15, opacity : 1});
	};
	anim.start();
}
js.App.addActionLink = function(aid,al,actClass) {
	if(js.App.aLinks == null) js.App.aLinks = new List();
	js.App.aLinks.push({ id : aid, href : al, cclass : js.App.DEFAULT_ACTIVE_CLASS, activeClass : actClass, active : true, highlight : false, element : js.Lib.document.getElementById(aid), liclass : null, li : null});
}
js.App.activeOnly = function(id) {
	var $it0 = js.App.aLinks.iterator();
	while( $it0.hasNext() ) {
		var a = $it0.next();
		if(a.id == "a_play") continue;
		if(a.id == id) {
			if(a.active) continue;
			js.App.active(a);
		} else js.App.unactive(a);
	}
}
js.App.unactiveAll = function(id) {
	var $it0 = js.App.aLinks.iterator();
	while( $it0.hasNext() ) {
		var a = $it0.next();
		js.App.unactive(a);
		if(id != null && a.id == id) js.App.highlight(a);
	}
}
js.App.activeAll = function() {
	var $it0 = js.App.aLinks.iterator();
	while( $it0.hasNext() ) {
		var a = $it0.next();
		js.App.active(a);
	}
}
js.App.unactive = function(a) {
	a.element.href = "#";
	a.cclass = js.App.DEFAULT_INACTIVE_CLASS;
	a.element.className = a.cclass;
	a.active = false;
	a.highlight = false;
	if(a.id == "a_play") {
		a.li = js.Lib.document.getElementById("l_play");
		if(a.li == null) return;
		a.liclass = a.li.className;
		a.li.className = a.li.className + "_off";
	}
}
js.App.active = function(a) {
	a.element.href = a.href;
	a.cclass = js.App.DEFAULT_ACTIVE_CLASS;
	a.element.className = a.activeClass;
	if(a.li != null) a.li.className = a.liclass;
	a.active = true;
	a.highlight = false;
}
js.App.highlight = function(a) {
	a.cclass = js.App.DEFAULT_HIGHLIGHT_CLASS;
	a.element.className = a.cclass;
	a.highlight = true;
}
js.App.questShowed = null;
js.App.showQuestInfos = function(n) {
	var e = null;
	if(js.App.questShowed != null) {
		e = js.Lib.document.getElementById(js.App.questShowed);
		if(e != null) e.style.display = "none";
	}
	if(n == js.App.questShowed) {
		js.App.questShowed = null;
		return;
	}
	e = js.Lib.document.getElementById(n);
	if(e != null) {
		e.style.display = "block";
		js.App.questShowed = n;
	}
}
js.App.showGoals = function(id,all) {
	var _g = 0, _g1 = all.split(";");
	while(_g < _g1.length) {
		var i = _g1[_g];
		++_g;
		var e = js.Lib.document.getElementById("infos_" + i);
		if(e == null) continue;
		e.style.display = i == id?e.style.display == "block"?"none":"block":"none";
	}
}
js.App.chapterInfos = null;
js.App.setChapterInfos = function(c,p,s,cp) {
	if(js.App.chapterInfos == null) js.App.chapterInfos = new Array();
	js.App.chapterInfos[Std.parseInt(c)] = Std.parseInt(p);
	js.App.cChapter = Std.parseInt(s);
	js.App.cPage = Std.parseInt(cp);
}
js.App.nextPage = function() {
	if(js.App.cPage >= js.App.chapterInfos[js.App.cChapter] - 1) return;
	js.App.setPage(Std.string(js.App.cPage + 1));
}
js.App.prevPage = function() {
	if(js.App.cPage <= 0) return;
	js.App.setPage(Std.string(js.App.cPage - 1));
}
js.App.setPage = function(sp) {
	var p = Std.parseInt(sp);
	if(js.App.chapterInfos[js.App.cChapter] <= p) return;
	var e = js.Lib.document.getElementById("chapter_" + js.App.cChapter + "_browse");
	if(e != null) e.innerHTML = p + 1 + "/" + js.App.chapterInfos[js.App.cChapter];
	var _g = 0;
	while(_g < 2) {
		var i = _g++;
		var e1 = js.Lib.document.getElementById("chapter_" + js.App.cChapter + "_" + js.App.cPage);
		if(e1 != null) e1.style.display = i == 0?"none":"block";
		if(i == 0) js.App.cPage = p;
	}
}
js.App.sctDistrib = function(id) {
	var e = js.Lib.document.getElementById("box_" + id);
	if(e != null) e.style.display = "block";
}
js.App.setChapter = function(c) {
	js.App.cChapter = Std.parseInt(c);
	js.App.cPage = 0;
	js.App.hideAllBook();
	js.App.activeChapter(Std.string(c));
}
js.App.hideAllBook = function() {
	var _g1 = 0, _g = js.App.chapterInfos.length;
	while(_g1 < _g) {
		var i = _g1++;
		var e = js.Lib.document.getElementById("chapter_mark_" + i);
		e.className = "inactive";
		e = js.Lib.document.getElementById("chapter_" + i);
		e.style.display = "none";
		var _g3 = 0, _g2 = js.App.chapterInfos[i];
		while(_g3 < _g2) {
			var j = _g3++;
			e = js.Lib.document.getElementById("chapter_" + i + "_" + j);
			if(e != null) e.style.display = "none";
			e = js.Lib.document.getElementById("chapter_" + i + "_browse_" + j);
			if(e != null) e.className = j == 0?"active":"inactive";
		}
	}
}
js.App.activeChapter = function(c) {
	var e = js.Lib.document.getElementById("chapter_mark_" + c);
	e.className = "active";
	e = js.Lib.document.getElementById("chapter_" + c + "_0");
	if(e != null) e.style.display = "block";
	js.App.showCat(c);
	e = js.Lib.document.getElementById("chapter_" + c);
	e.style.display = "block";
	var e1 = js.Lib.document.getElementById("chapter_" + js.App.cChapter + "_browse");
	if(e1 != null) e1.innerHTML = "1/" + js.App.chapterInfos[js.App.cChapter];
}
js.App.showRecipe = function(id) {
	if(js.App.lastSRecipe != "") {
		var e = js.Lib.document.getElementById("r_" + js.App.lastSRecipe);
		if(e != null) e.className = "aRecipe";
	}
	js.App.toRightPage("right_" + id);
	var e = js.Lib.document.getElementById("r_" + id);
	if(e != null) {
		e.className = "aRecipe selected";
		js.App.lastSRecipe = id;
	} else js.App.lastSRecipe = "";
}
js.App.showCat = function(i) {
	js.App.toRightPage("chapter_desc_" + i);
}
js.App.toRightPage = function(divid) {
	var right = js.Lib.document.getElementById(js.App.RIGHTID);
	if(right == null) return;
	var rd = js.Lib.document.getElementById(divid);
	if(rd == null) return;
	right.innerHTML = rd.innerHTML;
}
js.App.startShakeChx = function() {
	var e = js.Lib.document.getElementById("mcex");
	if(e == null) return;
	haxe.Timer.delay(js.App.shakeChx,3000);
}
js.App.shakeChx = function() {
	var e = js.Lib.document.getElementById("mcex");
	if(e == null) return;
	var to = e.style.marginTop;
	e.style.marginTop = "5px";
	var anim = new js.fx.Morph(e,{ marginTop : 0});
	anim.setTransition(js.fx.Transition.Elastic(js.fx.TransitionParam.Out,0.5));
	anim.duration = 350;
	anim.onComplete = js.App.startShakeChx;
	anim.start();
}
js.App.sethscroll = function(id,from,erase) {
	var c = js.Lib.document.getElementById(from);
	var hs = js.Lib.document.getElementById("hscroll" + id);
	var hsc = js.Lib.document.getElementById("chscroll" + id);
	var inner = js.Lib.document.getElementById("innerScroll" + id);
	if(c == null || hs == null || hsc == null || inner == null) return;
	inner.innerHTML = c.innerHTML;
	inner.style.width = c.style.width;
	inner.style.height = c.style.height;
	var size = js.Tip.elementSize(inner);
	hsc.style.height = inner.style.height;
	if(erase == "1") c.innerHTML = "";
}
js.App.movehscroll = function(id,s,delta) {
	var hsc = js.Lib.document.getElementById("chscroll" + id);
	var inner = js.Lib.document.getElementById("innerScroll" + id);
	var innerS = js.Tip.elementSize(inner);
	var hS = js.Tip.elementSize(hsc);
	var innerW = Std.parseInt(HxOverrides.substr(inner.style.width,0,inner.style.width.length - 2));
	var innerML = inner.style.marginLeft != null && inner.style.marginLeft != ""?Std.parseInt(inner.style.marginLeft.substr(0,inner.style.marginLeft.length - 2)):0;
	var params = null;
	if(s == 0) {
		if(innerS.x >= hS.x) return;
		params = { marginLeft : innerML + delta};
		if(params.marginLeft > 0) params.marginLeft = 0;
	} else if(s == 1) {
		if(innerS.x + innerW <= hS.x + hS.width) return;
		params = { marginLeft : innerML - delta};
		if(Math.abs(params.marginLeft) > innerW - hS.width) params.marginLeft = -(innerW - hS.width);
	}
	var anim = new js.fx.Morph(inner,params);
	anim.setTransition(js.fx.Transition.Quart(js.fx.TransitionParam.Out));
	anim.duration = 350;
	anim.start();
}
js.App.updateTitle = function() {
	js.App.showTool("currentTitle","dispTitle","fixedRightTooltip");
}
js.App.updateThrower = function(from) {
	js.App.showTool(from,"dispThrower","fixedRightTooltip");
}
js.App.hideTitle = function() {
	js.App.hideTool();
}
js.App.updateBelt = function(fromId,contentId,i) {
	js.App.cBeltIndex = i;
	js.App.sethscroll("0",contentId,"0");
	js.App.showTool(fromId,"hscroll0","selector",true);
}
js.App.putInBelt = function(id) {
	js.Lib.window.location.replace("/act/putInBelt?o=" + id + "&i=" + js.App.cBeltIndex);
}
js.App.showTool = function(fromId,contentId,classN,middle) {
	if(js.App.toolAnim) return;
	if(js.App.toolActive) {
		if(js.App.currentFromToolId != fromId) js.App.hideTool((function(f,a1,a2,a3,a4) {
			return function() {
				return f(a1,a2,a3,a4);
			};
		})(js.App.showTool,fromId,contentId,classN,middle),100); else js.App.hideTool();
		return;
	}
	js.App.toolAnim = true;
	var tool = js.Lib.document.getElementById(js.App.toolId);
	var infos = js.Lib.document.getElementById(contentId);
	var from = js.Lib.document.getElementById(fromId);
	if(infos == null) return;
	var size = js.Tip.elementSize(infos);
	if(classN == null) {
		tool.style.backgroundColor = "#675949";
		tool.className = null;
	} else {
		tool.style.backgroundColor = null;
		tool.className = classN;
	}
	js.App.placeTool(from,tool,middle);
	tool.innerHTML = "";
	js.App.currentToolId = contentId;
	js.App.currentFromToolId = fromId;
	js.App.toolActive = true;
	tool.innerHTML = infos.innerHTML;
	infos.innerHTML = "";
	js.App.toolAnim = false;
}
js.App.showQuest = function() {
	if(js.App.questToolActive) return;
	var tool = js.Lib.document.getElementById(js.App.questToolId);
	if(tool == null) return;
	var size = js.Tip.elementSize(tool);
	var to = { width : size.width - 14, height : size.height - 14};
	tool.style.height = "0px";
	tool.style.top = "355px";
	tool.style.left = "37px";
	tool.style.width = Std.string(to.width) + "px";
	tool.style.height = Std.string(to.height) + "px";
	js.App.questToolActive = true;
}
js.App.showQuestRecipe = function() {
	var e = js.Lib.document.getElementById("validationBox");
	if(e != null) e.style.display = "block";
}
js.App.hideQuest = function() {
	if(!js.App.questToolActive) return;
	var t = js.Lib.document.getElementById(js.App.questToolId);
	js.App.questToolActive = false;
	t.style.position = "absolute";
	t.style.top = "-2000px";
	t.style.left = "-1000px";
}
js.App.placeTool = function(from,tooltip,middle) {
	var o = js.Tip.elementSize(from);
	var tts = js.Tip.elementSize(tooltip);
	if(o.width <= 0) tooltip.style.left = o.x + "px"; else if(middle) tooltip.style.left = o.x - tts.width * 0.5 + o.width * 0.5 + "px"; else tooltip.style.left = o.x + o.width * 0.5 + "px";
	tooltip.style.top = o.y + Math.max(js.Tip.minOffsetY,o.height) + "px";
}
js.App.hideTool = function(f,d) {
	if(d == null) d = 0;
	if(!js.App.toolActive || js.App.toolAnim) return;
	js.App.toolAnim = true;
	var tool = js.Lib.document.getElementById(js.App.toolId);
	js.App.toolActive = false;
	if(js.App.currentToolId != null) js.Lib.document.getElementById(js.App.currentToolId).innerHTML = tool.innerHTML;
	js.App.currentToolId = null;
	js.App.currentFromToolId = null;
	tool.innerHTML = "";
	tool.style.position = "absolute";
	tool.style.top = "-1000px";
	js.App.toolAnim = false;
	if(f != null) f();
}
js.App.showShop = function(sh) {
	if(sh == "buy") {
		js.Lib.document.getElementById("buyTabLink").className = "selected";
		js.Lib.document.getElementById("SellTabLink").className = "";
		js.App.switchDiv("sellTab",false);
		js.App.switchDiv("buyTab",true);
		if(js.App.flcpnj != null) js.App.flcpnj.resolve("_Com").resolve("_sFrame").call(["normal"]);
	} else if(sh == "sell") {
		js.Lib.document.getElementById("buyTabLink").className = "";
		js.Lib.document.getElementById("SellTabLink").className = "selected";
		js.App.switchDiv("buyTab",false);
		js.App.switchDiv("sellTab",true);
		if(js.App.flcpnj != null) js.App.flcpnj.resolve("_Com").resolve("_sFrame").call(["hide"]);
	}
}
js.App.toggleShop = function(item,url,pData) {
	var id = url + "_infos_" + item;
	js.Lib.document.getElementById(url + "_infos_" + (url == "buy"?js.App.buy_last_infos:js.App.sell_last_infos)).style.display = "none";
	js.Lib.document.getElementById(id).style.display = "block";
	if(url == "buy") js.App.buy_last_infos = item; else js.App.sell_last_infos = item;
	if(js.App.flcpnj == null || pData == null) return;
	js.App.flcpnj.resolve("_Com").resolve("_sObj").call([pData]);
}
js.App.updateTotalCost = function(url,pid,iid,t,g,dom) {
	var sq = js.Lib.document.getElementById(iid).value;
	var q = 1;
	if(sq == null || sq == "") q = 0; else q = Std.parseInt(sq);
	var token = js.Lib.document.getElementById(url + "_totalToken_" + pid);
	var gold = js.Lib.document.getElementById(url + "_totalGold_" + pid);
	var ttoken = js.Lib.document.getElementById(url + "_totalToken_" + pid + "_text");
	var tgold = js.Lib.document.getElementById(url + "_totalGold_" + pid + "_text");
	if(q <= 0) {
		token.style.display = "none";
		gold.style.display = "none";
	} else {
		ttoken.innerHTML = js.App.numberToImage("/img/font/XP",t * q,dom);
		tgold.innerHTML = js.App.numberToImage("/img/font/kubor",g * q,dom);
		token.style.display = t * q > 0?"inline":"none";
		gold.style.display = g * q > 0?"inline":"none";
	}
}
js.App.switchQuickHelp = function() {
	var id = "shelp";
	var d = js.Lib.document.getElementById(id);
	if(d.style.display == "none") d.style.display = "block"; else d.style.display = "none";
}
js.App.numberToImage = function(fonts,n,dom) {
	if(n == null) return "null";
	var dataroot = dom;
	var res = new StringBuf();
	var str = n + "";
	var _g1 = 0, _g = str.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = str.charAt(i);
		res.b += "<img alt=\"";
		res.b += Std.string(c);
		res.b += "\" src=\"";
		res.b += Std.string(dataroot);
		res.b += Std.string(fonts);
		res.b += "/";
		if(c == ".") res.b += "dot"; else if(c == "-") res.b += "moins"; else if(c == "+") res.b += "plus"; else res.b += Std.string(c);
		res.b += ".gif\"/>";
	}
	return res.b;
}
js.App.chooseRecipe = function(sid) {
	var cid = Std.parseInt(sid);
	var _g = 0;
	while(_g < 5) {
		var c = _g++;
		if(c == cid) {
			js.App.switchDiv("r_" + c,true);
			js.Lib.document.getElementById("sr_" + c).className = "chooseOver";
		} else {
			js.App.switchDiv("r_" + c,false);
			js.Lib.document.getElementById("sr_" + c).className = "choose";
		}
	}
	js.Lib.document.getElementById("rid").value = sid;
}
js.App.pConf = function() {
	js.App.game_started = true;
}
js.App.gameBack = function(txt) {
	if(!js.App.game_started) js.Lib.window.location.replace("/act"); else if(js.Lib.window.confirm(txt)) js.Lib.window.location.replace("/act?nw=1");
}
js.App.majQ = function(s) {
	var te = s.split(",");
	var _g = 0;
	while(_g < te.length) {
		var e = te[_g];
		++_g;
		var v = e.split(";");
		var sp = js.Lib.document.getElementById("qty_" + v[0]);
		if(sp != null) sp.innerHTML = v[1];
	}
}
js.App.majC = function(i,n) {
	var e = js.Lib.document.getElementById("ch_" + i);
	if(e == null) return;
	e.src = js.App.DATADOMAIN + "/img/inventory/" + n + ".png";
}
js.App.editGuildianTitle = function(from,title,max) {
	var etitle = js.Lib.document.getElementById(title);
	var efrom = js.Lib.document.getElementById(from);
	if(efrom.value != null && efrom.value.length <= max) etitle.innerHTML = efrom.value;
}
js.App.switchFailReason = function(from,to,id) {
	var eto = js.Lib.document.getElementById(to);
	var efrom = js.Lib.document.getElementById(from);
	eto.style.display = efrom.value == id?"block":"none";
}
js.App.editGuildianImage = function(from,img) {
	var eimg = js.Lib.document.getElementById(img);
	var efrom = js.Lib.document.getElementById(from);
	var value = efrom.options[efrom.selectedIndex].value;
	if(value == "0") {
		eimg.style.display = "none";
		eimg.src = "";
	} else {
		eimg.style.display = "block";
		eimg.src = "/file/" + value + ".dat";
	}
}
js.App.editGuildianCat = function(from,cat) {
	var ecat = js.Lib.document.getElementById(cat);
	var efrom = js.Lib.document.getElementById(from);
	var value = efrom.options[efrom.selectedIndex].innerHTML;
	ecat.innerHTML = value;
}
js.App.historyMoreInfo = function(id,show) {
	js.App.switchDiv("moreInfo_" + id,show);
	js.App.switchDiv("aOff_" + id,show);
	js.App.switchDiv("aOn_" + id,!show);
}
js.App.wheels = null;
js.App.rSpends = null;
js.App.wheelUrlBase = null;
js.App.wmax = null;
js.App.noUrl = null;
js.App.setWheelInfos = function(w,url,l,max,s,nUrl) {
	js.App.wheels = w;
	js.App.wheelUrlBase = url;
	js.App.wmax = max;
	js.App.noUrl = nUrl;
	js.App.rSpends = new Array();
	var _g = 0;
	while(_g < l) {
		var i = _g++;
		js.App.rSpends[i] = 0;
	}
	if(s == "") return;
	var all = 0;
	var ts = s.split(",");
	var _g1 = 0, _g = ts.length;
	while(_g1 < _g) {
		var i = _g1++;
		all += Std.parseInt(ts[i]);
	}
	if(all > js.App.wheels) return;
	var _g1 = 0, _g = ts.length;
	while(_g1 < _g) {
		var i = _g1++;
		js.App.setLineTo(Std.parseInt(ts[i]),i);
	}
}
js.App.modWheel = function(v,l) {
	if(js.App.wheels < 0 || js.App.rSpends[l] + v > js.App.wmax) return;
	if(v > 0) {
		if(v > js.App.wheels) return;
		var from = js.App.rSpends[l];
		var _g = 0;
		while(_g < v) {
			var i = _g++;
			var e = js.Lib.document.getElementById("slot_" + Std.string(from + i) + "_" + l);
			if(e == null) return;
			if(e.className == "rslotEmptyOff") e.className = "rslotEmptyOn"; else if(e.className == "rslotOff") e.className = "rslotOn";
			js.App.wheels -= 1;
			js.App.rSpends[l] += 1;
		}
	} else {
		if(v * -1 > js.App.rSpends[l]) return;
		var from = js.App.rSpends[l];
		var _g1 = 0, _g = v * -1;
		while(_g1 < _g) {
			var i = _g1++;
			var e = js.Lib.document.getElementById("slot_" + Std.string(from - i - 1) + "_" + l);
			if(e == null) return;
			if(e.className == "rslotEmptyOn") e.className = "rslotEmptyOff"; else if(e.className == "rslotOn") e.className = "rslotOff";
			js.App.wheels += 1;
			js.App.rSpends[l] -= 1;
		}
	}
	js.Lib.document.getElementById("wStock").innerHTML = Std.string(js.App.wheels);
	js.Lib.document.getElementById("fw").value = js.App.rSpends.join(",");
	if(js.App.noUrl != null && js.App.noUrl == 1) return;
	var purl = js.Lib.document.getElementById("purl");
	if(purl.innerHTML == "") js.Lib.document.getElementById("durl").style.display = "block";
	purl.innerHTML = js.App.wheelUrlBase + js.App.rSpends.join(",");
}
js.App.setLineTo = function(v,l) {
	js.App.modWheel(v - js.App.rSpends[l],l);
}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
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
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
js.Selection = $hxClasses["js.Selection"] = function(doc) {
	this.doc = doc;
};
js.Selection.__name__ = ["js","Selection"];
js.Selection.prototype = {
	insert: function(left,text,right) {
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
		var range = js.Lib.document.selection.createRange();
		range.text = left + text + right;
		range.moveStart("character",-text.length - right.length);
		range.moveEnd("character",-right.length);
		range.select();
	}
	,select: function(start,end) {
		this.doc.focus();
		if(this.doc.selectionStart != null) {
			this.doc.selectionStart = start;
			this.doc.selectionEnd = end;
			return;
		}
		var value = this.doc.value;
		var p = 0, delta = 0;
		while(true) {
			var i = value.indexOf("\r\n",p);
			if(i < 0 || i > start) break;
			delta++;
			p = i + 2;
		}
		start -= delta;
		while(true) {
			var i = value.indexOf("\r\n",p);
			if(i < 0 || i > end) break;
			delta++;
			p = i + 2;
		}
		end -= delta;
		var r = this.doc.createTextRange();
		r.moveEnd("textedit",-1);
		r.moveStart("character",start);
		r.moveEnd("character",end - start);
		r.select();
	}
	,get: function() {
		if(this.doc.selectionStart != null) return this.doc.value.substring(this.doc.selectionStart,this.doc.selectionEnd);
		var range = js.Lib.document.selection.createRange();
		if(range.parentElement() != this.doc) return "";
		return range.text;
	}
	,doc: null
	,__class__: js.Selection
}
js.fx.Anim = $hxClasses["js.fx.Anim"] = function() {
	this.fps = 60;
	this.duration = 250;
	this.transition = js.fx.TransitionFunctions.get(js.fx.Transition.Linear);
};
js.fx.Anim.__name__ = ["js","fx","Anim"];
js.fx.Anim.prototype = {
	startTimer: function() {
		if(this.timer != null) return false;
		this.time = new Date().getTime() - this.time;
		this.timer = js.fx.Timer.periodical((function(f) {
			return function() {
				return f();
			};
		})($bind(this,this.next)),Math.round(1000 / this.fps));
		return true;
	}
	,stopTimer: function() {
		if(this.timer == null) return false;
		this.time = new Date().getTime() - this.time;
		this.timer = js.fx.Timer.clear(this.timer);
		return true;
	}
	,complete: function() {
		if(this.stopTimer()) {
			if(this.onComplete != null) this.onComplete();
			return true;
		}
		return false;
	}
	,next: function() {
		var now = new Date().getTime();
		if(now < this.time + this.duration) {
			var delta = this.transition((now - this.time) / this.duration);
			this.set(delta);
		} else {
			this.set(1);
			this.complete();
		}
	}
	,set: function(delta) {
		throw "set(delta:Float) not implemented";
	}
	,resume: function() {
		this.startTimer();
	}
	,pause: function() {
		this.stopTimer();
	}
	,cancel: function() {
		if(this.stopTimer() && this.onCancel != null) this.onCancel();
	}
	,start: function() {
		this.time = 0;
		this.startTimer();
		if(this.onStart != null) this.onStart();
	}
	,setTransition: function(t) {
		this.transition = js.fx.TransitionFunctions.get(t);
	}
	,onCancel: null
	,onStart: null
	,onComplete: null
	,transition: null
	,timer: null
	,time: null
	,fps: null
	,duration: null
	,__class__: js.fx.Anim
}
js.fx.Morph = $hxClasses["js.fx.Morph"] = function(e,toStyle) {
	js.fx.Anim.call(this);
	this.element = e;
	this.targetStyle = toStyle;
	this.originStyle = js.fx.Style.getStyles(this.element,toStyle);
};
js.fx.Morph.__name__ = ["js","fx","Morph"];
js.fx.Morph.__super__ = js.fx.Anim;
js.fx.Morph.prototype = $extend(js.fx.Anim.prototype,{
	set: function(delta) {
		js.fx.Style.setStyles(this.element,js.fx.Delta.styles(this.originStyle,this.targetStyle,delta));
	}
	,targetStyle: null
	,originStyle: null
	,element: null
	,__class__: js.fx.Morph
});
js.fx.MultiMorph = $hxClasses["js.fx.MultiMorph"] = function() {
	js.fx.Anim.call(this);
	this.anims = new List();
};
js.fx.MultiMorph.__name__ = ["js","fx","MultiMorph"];
js.fx.MultiMorph.__super__ = js.fx.Anim;
js.fx.MultiMorph.prototype = $extend(js.fx.Anim.prototype,{
	set: function(delta) {
		var $it0 = this.anims.iterator();
		while( $it0.hasNext() ) {
			var a = $it0.next();
			a.set(delta);
		}
	}
	,add: function(anim) {
		this.anims.push(anim);
	}
	,anims: null
	,__class__: js.fx.MultiMorph
});
js.fx.Slide = $hxClasses["js.fx.Slide"] = function(e,k,noFlow) {
	js.fx.Anim.call(this);
	this.keepElementSpace = noFlow == true;
	this.element = e;
	this.kind = k;
	if(this.element.wrapper == null) {
		var parent = this.element.parentNode;
		this.wrapper = js.Lib.document.createElement("DIV");
		parent.replaceChild(this.wrapper,this.element);
		this.wrapper.appendChild(this.element);
		js.fx.Style.setStyles(this.wrapper,js.fx.Style.getStyles(this.element,{ marginLeft : 0, marginTop : 0, marginRight : 0, marginBottom : 0, position : ""}));
		js.fx.Style.setStyles(this.wrapper,{ overflow : "hidden", position : "relative", padding : 0});
		js.fx.Style.setStyles(this.element,{ margin : "0px", position : "relative"});
		this.element.wrapper = this.wrapper;
	} else this.wrapper = this.element.wrapper;
	this.open = true;
};
js.fx.Slide.__name__ = ["js","fx","Slide"];
js.fx.Slide.__super__ = js.fx.Anim;
js.fx.Slide.prototype = $extend(js.fx.Anim.prototype,{
	complete: function() {
		if(js.fx.Anim.prototype.complete.call(this)) {
			this.updateOpenStatus();
			return true;
		}
		return false;
	}
	,updateOpenStatus: function() {
		this.open = (function($this) {
			var $r;
			switch( ($this.kind)[1] ) {
			case 0:
				$r = $this.element.style.marginTop == "0px";
				break;
			case 1:
				$r = $this.keepElementSpace?$this.element.style.marginTop == "0px":$this.wrapper.offsetHeight == $this.height;
				break;
			case 2:
				$r = $this.element.style.marginLeft == "0px";
				break;
			case 3:
				$r = $this.keepElementSpace?$this.element.style.marginLeft == "0px":$this.wrapper.offsetWidth == $this.width;
				break;
			}
			return $r;
		}(this));
	}
	,set: function(delta) {
		this.height = this.element.offsetHeight;
		this.width = this.element.offsetWidth;
		if(this.keepElementSpace) {
			switch( (this.kind)[1] ) {
			case 0:
				js.fx.Style.setStyles(this.element,{ marginTop : (this.open?-this.height * delta:-this.height + delta * this.height) | 0});
				break;
			case 1:
				js.fx.Style.setStyles(this.element,{ marginTop : -1 * ((this.open?-this.height * delta:-this.height + delta * this.height) | 0)});
				break;
			case 2:
				js.fx.Style.setStyles(this.element,{ marginLeft : (this.open?-this.width * delta:-this.width + delta * this.width) | 0});
				break;
			case 3:
				js.fx.Style.setStyles(this.element,{ marginLeft : -1 * ((this.open?-this.width * delta:-this.width + delta * this.width) | 0)});
				break;
			}
		} else {
			switch( (this.kind)[1] ) {
			case 0:
				var marginTop = (this.open?-this.height * delta:-this.height + delta * this.height) | 0;
				js.fx.Style.setStyles(this.element,{ marginTop : marginTop});
				js.fx.Style.setStyles(this.wrapper,{ height : this.height + marginTop});
				break;
			case 2:
				var marginLeft = (this.open?-this.width * delta:-this.width + delta * this.width) | 0;
				js.fx.Style.setStyles(this.element,{ marginLeft : marginLeft});
				js.fx.Style.setStyles(this.wrapper,{ width : this.width + marginLeft});
				break;
			case 1:
				var marginTop = -1 * ((this.open?-this.height * delta:-this.height + delta * this.height) | 0);
				js.fx.Style.setStyles(this.wrapper,{ height : this.height - marginTop});
				break;
			case 3:
				var marginLeft = -1 * ((this.open?-this.width * delta:-this.width + delta * this.width) | 0);
				js.fx.Style.setStyles(this.wrapper,{ width : this.width - marginLeft});
				break;
			}
		}
	}
	,toggle: function() {
		if(this.timer != null) {
			this.open = !this.open;
			var elapsed = new Date().getTime() - this.time;
			var remain = this.duration - elapsed;
			this.time = new Date().getTime() - remain;
		} else this.start();
	}
	,show: function() {
		if(this.open) return;
		this.open = true;
		this.set(0);
	}
	,hide: function() {
		if(!this.open) return;
		this.open = false;
		this.set(0);
	}
	,height: null
	,width: null
	,offset: null
	,wrapper: null
	,kind: null
	,element: null
	,keepElementSpace: null
	,open: null
	,__class__: js.fx.Slide
});
js.fx.SlideKind = $hxClasses["js.fx.SlideKind"] = { __ename__ : ["js","fx","SlideKind"], __constructs__ : ["Vertical","VerticalBottom","Horizontal","HorizontalRight"] }
js.fx.SlideKind.Vertical = ["Vertical",0];
js.fx.SlideKind.Vertical.toString = $estr;
js.fx.SlideKind.Vertical.__enum__ = js.fx.SlideKind;
js.fx.SlideKind.VerticalBottom = ["VerticalBottom",1];
js.fx.SlideKind.VerticalBottom.toString = $estr;
js.fx.SlideKind.VerticalBottom.__enum__ = js.fx.SlideKind;
js.fx.SlideKind.Horizontal = ["Horizontal",2];
js.fx.SlideKind.Horizontal.toString = $estr;
js.fx.SlideKind.Horizontal.__enum__ = js.fx.SlideKind;
js.fx.SlideKind.HorizontalRight = ["HorizontalRight",3];
js.fx.SlideKind.HorizontalRight.toString = $estr;
js.fx.SlideKind.HorizontalRight.__enum__ = js.fx.SlideKind;
js.fx.Style = $hxClasses["js.fx.Style"] = function() { }
js.fx.Style.__name__ = ["js","fx","Style"];
js.fx.Style.getDocumentStyles = function(selector) {
	var result = { };
	var found = false;
	var _g1 = 0, _g = js.Lib.document.styleSheets.length;
	while(_g1 < _g) {
		var i = _g1++;
		var sheet = js.Lib.document.styleSheets[i];
		if(sheet.href != null && sheet.href.indexOf("://") != -1 && sheet.href.indexOf(js.Lib.document.domain) == -1) continue;
		var rules = sheet.rules != null?sheet.rules:sheet.cssRules;
		if(rules == null) continue;
		var _g3 = 0, _g2 = rules.length;
		while(_g3 < _g2) {
			var j = _g3++;
			var rule = rules[j];
			if(rule.style == null || rule.selectorText == null || rule.selectorText != selector) continue;
			found = true;
			if(js.fx.Tool.isIE) {
				var _g4 = 0, _g5 = Reflect.fields(rule.style);
				while(_g4 < _g5.length) {
					var f = _g5[_g4];
					++_g4;
					var value = Reflect.field(rule.style,f);
					if(value == null || value == "") continue;
					var value1 = js.fx.Style.parseStyle(value);
					if(value1 != null && value1 != "") result[f] = value1;
				}
			} else {
				var _g5 = 0, _g4 = rule.style.length;
				while(_g5 < _g4) {
					var s = _g5++;
					var style = rule.style[s];
					var camel = js.fx.Style.camel(style);
					var value = Reflect.field(rule.style,camel);
					if(value != null && value != "") result[camel] = js.fx.Style.parseStyle(value);
				}
			}
		}
	}
	if(!found) return null;
	return result;
}
js.fx.Style.getStyles = function(e,template) {
	var getter = null;
	if(e.currentStyle != null) getter = function(key) {
		return e.currentStyle[key];
	};
	if(getter == null) {
		var window = js.Lib.document.defaultView?js.Lib.document.defaultView:js.Lib.document.parentWindow;
		if(window != null && window.getComputedStyle != null) {
			var cs = window.getComputedStyle(e,null);
			if(cs != null) getter = function(key) {
				return cs.getPropertyValue(js.fx.Style.hyphen(key));
			};
		}
	}
	if(getter == null) getter = function(key) {
		return Reflect.field(e,key);
	};
	var result = { };
	var _g = 0, _g1 = Reflect.fields(template);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		var currentValue = f == "opacity"?Std.string(js.fx.Style.getOpacity(e)):getter(f);
		var expectedType = Reflect.field(template,f);
		if(js.Boot.__instanceof(expectedType,js.fx.RGBA)) {
			var value = js.fx.RGBA.parse(currentValue);
			if(value == null) value = new js.fx.RGBA(0,0,0,0);
			result[f] = value;
			continue;
		}
		if(js.Boot.__instanceof(expectedType,js.fx.RGB)) {
			var value = js.fx.RGB.parse(currentValue);
			if(value == null) value = new js.fx.RGB(0,0,0);
			result[f] = value;
			continue;
		}
		if(js.Boot.__instanceof(expectedType,js.fx.Unit)) {
			var value = js.fx.Unit.parse(currentValue);
			if(value == null) value = new js.fx.Unit(expectedType.kind,0);
			if(value.kind != expectedType.kind) throw "Unit kind mismatch " + Std.string(value) + " != " + Std.string(expectedType);
			result[f] = value;
			continue;
		}
		if(js.Boot.__instanceof(expectedType,String)) result[f] = currentValue;
		var type = Type["typeof"](expectedType);
		if(type == ValueType.TFloat || f == "opacity") {
			var value = Std.parseFloat(Std.string(currentValue)) + 0.000000001;
			if(value == null) value = 0.000000001;
			result[f] = value;
		} else if(type == ValueType.TInt) {
			var value = Std.parseInt(Std.string(currentValue));
			if(value == null) value = 0;
			result[f] = value;
		}
	}
	return result;
}
js.fx.Style.setStyles = function(e,styles) {
	var _g = 0, _g1 = Reflect.fields(styles);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		js.fx.Style.setStyle(e,f,Reflect.field(styles,f));
	}
}
js.fx.Style.setStyle = function(e,property,value) {
	switch(property) {
	case "opacity":
		js.fx.Style.setOpacity(e,value);
		return;
	case "float":
		property = js.fx.Style.REQUIRES_FILTERS?"styleFloat":"cssFloat";
		break;
	case "zIndex":
		value = Std.string(value);
		break;
	}
	e.style[property] = js.fx.Style.styleValueToString(value);
}
js.fx.Style.setOpacity = function(e,opacity) {
	e.style.visibility = opacity == 0.0?"hidden":"visible";
	if(js.fx.Style.REQUIRES_FILTERS) {
		e.style.zoom = 1;
		e.style["-ms-filter"] = "\"progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (opacity * 100 | 0) + ")\"";
		e.style.filter = opacity == 1.0?"":"alpha(opacity=" + (opacity * 100 | 0) + ")";
	}
	e.style.opacity = opacity;
	e.style._opacity = opacity;
}
js.fx.Style.getOpacity = function(element) {
	var v = element.style._opacity;
	if(v == null) return (function($this) {
		var $r;
		switch(element.style.visibility) {
		case "visible":
			$r = 1.0;
			break;
		case "hidden":
			$r = 0.0;
			break;
		case "":
			$r = element.style.display == "none"?0.0:1.0;
			break;
		}
		return $r;
	}(this));
	return v;
}
js.fx.Style.styleValueToString = function(v) {
	return (function($this) {
		var $r;
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 6:
			var c = $e[2];
			$r = Std.string(v);
			break;
		case 1:
			$r = Std.string(v) + "px";
			break;
		case 2:
			$r = Std.string(v);
			break;
		case 0:
			$r = "";
			break;
		default:
			$r = (function($this) {
				var $r;
				throw "Unsupported js.fx.Style value " + Std.string(Type["typeof"](v));
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
js.fx.Style.parseStyle = function(s) {
	var rgba = js.fx.RGBA.parse(s);
	if(rgba != null) return rgba;
	var rgb = js.fx.RGB.parse(s);
	if(rgb != null) return rgb;
	var unit = js.fx.Unit.parse(s);
	if(unit != null) return unit;
	return s;
}
js.fx.Style.camel = function(hyphen) {
	return new EReg("(-[a-z])","").customReplace(hyphen,function(reg) {
		return reg.matched(1).charAt(1).toUpperCase();
	});
}
js.fx.Style.hyphen = function(camel) {
	return new EReg("([A-Z])","").customReplace(camel,function(reg) {
		return "-" + reg.matched(1).toLowerCase();
	});
}
js.fx.RGBA = $hxClasses["js.fx.RGBA"] = function(r,g,b,a) {
	this.r = r;
	this.g = g;
	this.b = g;
	this.a = a;
};
js.fx.RGBA.__name__ = ["js","fx","RGBA"];
js.fx.RGBA.hexToInt = function(str) {
	str = str.toLowerCase();
	if(str.length == 0) return 0;
	if(str.length == 1) {
		var c = HxOverrides.cca(str,0);
		var a = HxOverrides.cca("a",0);
		if(c >= a) return 10 + c - a;
		var z = HxOverrides.cca("0",0);
		if(c >= z) return c - z;
	}
	if(str.length == 2) return 16 * js.fx.RGBA.hexToInt(str.charAt(0)) + js.fx.RGBA.hexToInt(str.charAt(1));
	return 0;
}
js.fx.RGBA.parse = function(value) {
	var reg = new EReg("^#?([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})$","i");
	if(reg.match(value)) {
		var result = new js.fx.RGBA(js.fx.RGBA.hexToInt(reg.matched(1)),js.fx.RGBA.hexToInt(reg.matched(2)),js.fx.RGBA.hexToInt(reg.matched(3)),js.fx.RGBA.hexToInt(reg.matched(4)));
		return result;
	}
	var reg1 = new EReg("rgba\\(\\s*(\\d+),\\s*(\\d+),\\s*(\\d+),\\s*(\\d+)\\s*\\)","");
	if(reg1.match(value)) return new js.fx.RGBA(Std.parseInt(reg1.matched(1)),Std.parseInt(reg1.matched(2)),Std.parseInt(reg1.matched(3)),Std.parseInt(reg1.matched(4)));
	return null;
}
js.fx.RGBA.prototype = {
	toString: function() {
		return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
	}
	,a: null
	,b: null
	,g: null
	,r: null
	,__class__: js.fx.RGBA
}
js.fx.RGB = $hxClasses["js.fx.RGB"] = function(r,g,b) {
	this.r = r;
	this.g = g;
	this.b = g;
};
js.fx.RGB.__name__ = ["js","fx","RGB"];
js.fx.RGB.hexToInt = function(str) {
	str = str.toLowerCase();
	if(str.length == 0) return 0;
	if(str.length == 1) {
		var c = HxOverrides.cca(str,0);
		var a = HxOverrides.cca("a",0);
		if(c >= a) return 10 + c - a;
		var z = HxOverrides.cca("0",0);
		if(c >= z) return c - z;
	}
	if(str.length == 2) return 16 * js.fx.RGB.hexToInt(str.charAt(0)) + js.fx.RGB.hexToInt(str.charAt(1));
	return 0;
}
js.fx.RGB.parse = function(value) {
	var reg = new EReg("^#?([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})$","i");
	if(reg.match(value)) {
		var result = new js.fx.RGB(js.fx.RGB.hexToInt(reg.matched(1)),js.fx.RGB.hexToInt(reg.matched(2)),js.fx.RGB.hexToInt(reg.matched(3)));
		return result;
	}
	var reg1 = new EReg("rgb\\(\\s*(\\d+),\\s*(\\d+),\\s*(\\d+)\\s*\\)","");
	if(reg1.match(value)) return new js.fx.RGB(Std.parseInt(reg1.matched(1)),Std.parseInt(reg1.matched(2)),Std.parseInt(reg1.matched(3)));
	return null;
}
js.fx.RGB.prototype = {
	toString: function() {
		return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
	}
	,b: null
	,g: null
	,r: null
	,__class__: js.fx.RGB
}
js.fx.UnitKind = $hxClasses["js.fx.UnitKind"] = { __ename__ : ["js","fx","UnitKind"], __constructs__ : ["KEm","KPt","KPc","KPx"] }
js.fx.UnitKind.KEm = ["KEm",0];
js.fx.UnitKind.KEm.toString = $estr;
js.fx.UnitKind.KEm.__enum__ = js.fx.UnitKind;
js.fx.UnitKind.KPt = ["KPt",1];
js.fx.UnitKind.KPt.toString = $estr;
js.fx.UnitKind.KPt.__enum__ = js.fx.UnitKind;
js.fx.UnitKind.KPc = ["KPc",2];
js.fx.UnitKind.KPc.toString = $estr;
js.fx.UnitKind.KPc.__enum__ = js.fx.UnitKind;
js.fx.UnitKind.KPx = ["KPx",3];
js.fx.UnitKind.KPx.toString = $estr;
js.fx.UnitKind.KPx.__enum__ = js.fx.UnitKind;
js.fx.Unit = $hxClasses["js.fx.Unit"] = function(k,v) {
	this.kind = k;
	this.value = v;
	this.toString = (function($this) {
		var $r;
		switch( (k)[1] ) {
		case 0:
			$r = $bind($this,$this.emToString);
			break;
		case 1:
			$r = $bind($this,$this.ptToString);
			break;
		case 2:
			$r = $bind($this,$this.pcToString);
			break;
		case 3:
			$r = $bind($this,$this.pxToString);
			break;
		}
		return $r;
	}(this));
};
js.fx.Unit.__name__ = ["js","fx","Unit"];
js.fx.Unit.parse = function(value) {
	var reg = new EReg("^(\\-?[0-9.]+)(em|pt|%|px|)$","i");
	if(!reg.match(value)) return null;
	var val = Std.parseFloat(reg.matched(1));
	var kst = reg.matched(2);
	return (function($this) {
		var $r;
		switch(kst) {
		case "em":
			$r = new js.fx.Unit(js.fx.UnitKind.KEm,val);
			break;
		case "pt":
			$r = new js.fx.Unit(js.fx.UnitKind.KPt,val);
			break;
		case "px":
			$r = new js.fx.Unit(js.fx.UnitKind.KPx,val);
			break;
		case "%":
			$r = new js.fx.Unit(js.fx.UnitKind.KPc,val);
			break;
		default:
			$r = new js.fx.Unit(js.fx.UnitKind.KPx,val);
		}
		return $r;
	}(this));
}
js.fx.Unit.prototype = {
	pxToString: function() {
		return Math.round(this.value) + "px";
	}
	,pcToString: function() {
		return Math.round(this.value * 10) / 10 + "%";
	}
	,ptToString: function() {
		return Math.round(this.value * 10) / 10 + "pt";
	}
	,emToString: function() {
		return Math.round(this.value * 10) / 10 + "em";
	}
	,toString: null
	,value: null
	,kind: null
	,__class__: js.fx.Unit
}
js.fx.Delta = $hxClasses["js.fx.Delta"] = function() { }
js.fx.Delta.__name__ = ["js","fx","Delta"];
js.fx.Delta.getDeltaFunc = function(from,to) {
	return js.Boot.__instanceof(from,js.fx.RGB)?js.fx.Delta.rgb:js.Boot.__instanceof(from,js.fx.RGBA)?js.fx.Delta.rgba:js.Boot.__instanceof(from,js.fx.Unit)?js.fx.Delta.unit:js.Boot.__instanceof(from,String)?js.fx.Delta.string:Type["typeof"](from) == ValueType.TFloat?js.fx.Delta["float"]:Type["typeof"](from) == ValueType.TInt?js.fx.Delta["int"]:js.fx.Delta.unknown;
}
js.fx.Delta.styles = function(from,to,delta) {
	var result = { };
	var _g = 0, _g1 = Reflect.fields(from);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		result[f] = js.fx.Delta.any(Reflect.field(from,f),Reflect.field(to,f),delta);
	}
	return result;
}
js.fx.Delta.unknown = function(from,to,delta) {
	return delta < 0.5?from:to;
}
js.fx.Delta.any = function(a,b,delta) {
	return (js.fx.Delta.getDeltaFunc(a,b))(a,b,delta);
}
js.fx.Delta.rgb = function(from,to,delta) {
	return new js.fx.RGB(js.fx.Delta["int"](from.r,to.r,delta),js.fx.Delta["int"](from.g,to.g,delta),js.fx.Delta["int"](from.b,to.b,delta));
}
js.fx.Delta.rgba = function(from,to,delta) {
	return new js.fx.RGBA(js.fx.Delta["int"](from.r,to.r,delta),js.fx.Delta["int"](from.g,to.g,delta),js.fx.Delta["int"](from.b,to.b,delta),js.fx.Delta["int"](from.a,to.a,delta));
}
js.fx.Delta.unit = function(from,to,delta) {
	return new js.fx.Unit(from.kind,js.fx.Delta["float"](from.value,to.value,delta));
}
js.fx.Delta.string = function(from,to,delta) {
	return delta < 0.5?from:to;
}
js.fx.Delta["int"] = function(from,to,delta) {
	return Math.floor((to - from) * delta + from) | 0;
}
js.fx.Delta["float"] = function(from,to,delta) {
	return (to - from) * delta + from;
}
js.fx.Timer = $hxClasses["js.fx.Timer"] = function() {
};
js.fx.Timer.__name__ = ["js","fx","Timer"];
js.fx.Timer.timeout = function(cb,delay) {
	var t = new js.fx.Timer();
	t.data = setTimeout(cb,delay);
	return t;
}
js.fx.Timer.periodical = function(cb,delay) {
	var t = new js.fx.Timer();
	t.data = setInterval(cb,delay);
	return t;
}
js.fx.Timer.clear = function(t) {
	clearTimeout(t.data);
	clearInterval(t.data);
	return null;
}
js.fx.Timer.prototype = {
	data: null
	,__class__: js.fx.Timer
}
js.fx.Tool = $hxClasses["js.fx.Tool"] = function() { }
js.fx.Tool.__name__ = ["js","fx","Tool"];
js.fx.Tool.nextElement = function(node) {
	var next = node.nextSibling;
	while(next != null && next.nodeName != node.nodeName) next = next.nextSibling;
	return next;
}
js.fx.Tool.prevElement = function(node) {
	var prev = node.previousSibling;
	while(prev != null && prev.nodeName != node.nodeName) prev = prev.previousSibling;
	return prev;
}
js.fx.Tool.placeBefore = function(newNode,oldNode) {
	if(newNode.parentNode != null) newNode.parentNode.removeChild(newNode);
	oldNode.parentNode.insertBefore(newNode,oldNode);
}
js.fx.Tool.placeAfter = function(newNode,oldNode) {
	if(newNode.parentNode != null) newNode.parentNode.removeChild(newNode);
	if(oldNode.nextSibling == null) oldNode.parentNode.appendChild(newNode); else oldNode.parentNode.insertBefore(newNode,oldNode.nextSibling);
}
js.fx.Tool.trace = function(x) {
	js.Lib.document.getElementById("trace").innerHTML = Std.string(x);
}
js.fx.Tool.addCssClass = function(e,c) {
	if(e.className.indexOf(c) == -1) e.className = e.className + " " + c;
}
js.fx.Tool.removeCssClass = function(e,c) {
	if(e.className.indexOf(c) != -1) e.className = StringTools.replace(e.className,c,"");
}
js.fx.Tool.preventDefault = function(evt) {
	if(evt == null) evt = js.Lib.window.event;
	if(evt.preventDefault != null) evt.preventDefault(); else evt.returnValue = false;
	return false;
}
js.fx.Tool.cancelBubble = function(evt) {
	if(evt == null) evt = js.Lib.window.event;
	if($bind(evt,evt.stopPropagation) != null) evt.stopPropagation(); else evt.cancelBubble = true;
	return false;
}
js.fx.Tool.findElementsWithClassName = function(parent,tag,className) {
	if(parent == null) parent = js.Lib.document.body;
	if(tag == null) tag = "*";
	var elements = tag == "*" && parent.all != null?parent.all:parent.getElementsByTagName(tag);
	var results = new List();
	var regexp = new EReg("(^|\\s)" + className + "(\\s|$)","");
	var _g1 = 0, _g = elements.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(Std.string(elements[i].className) == "") continue;
		if(regexp.match("" + elements[i].className)) results.push(elements[i]);
	}
	return results;
}
js.fx.Transition = $hxClasses["js.fx.Transition"] = { __ename__ : ["js","fx","Transition"], __constructs__ : ["Linear","Quad","Cubic","Quart","Quint","Pow","Expo","Circ","Sine","Back","Bounce","Elastic"] }
js.fx.Transition.Linear = ["Linear",0];
js.fx.Transition.Linear.toString = $estr;
js.fx.Transition.Linear.__enum__ = js.fx.Transition;
js.fx.Transition.Quad = function(p) { var $x = ["Quad",1,p]; $x.__enum__ = js.fx.Transition; $x.toString = $estr; return $x; }
js.fx.Transition.Cubic = function(p) { var $x = ["Cubic",2,p]; $x.__enum__ = js.fx.Transition; $x.toString = $estr; return $x; }
js.fx.Transition.Quart = function(p) { var $x = ["Quart",3,p]; $x.__enum__ = js.fx.Transition; $x.toString = $estr; return $x; }
js.fx.Transition.Quint = function(p) { var $x = ["Quint",4,p]; $x.__enum__ = js.fx.Transition; $x.toString = $estr; return $x; }
js.fx.Transition.Pow = function(pa) { var $x = ["Pow",5,pa]; $x.__enum__ = js.fx.Transition; $x.toString = $estr; return $x; }
js.fx.Transition.Expo = function(p) { var $x = ["Expo",6,p]; $x.__enum__ = js.fx.Transition; $x.toString = $estr; return $x; }
js.fx.Transition.Circ = function(p) { var $x = ["Circ",7,p]; $x.__enum__ = js.fx.Transition; $x.toString = $estr; return $x; }
js.fx.Transition.Sine = function(p) { var $x = ["Sine",8,p]; $x.__enum__ = js.fx.Transition; $x.toString = $estr; return $x; }
js.fx.Transition.Back = function(p,pa) { var $x = ["Back",9,p,pa]; $x.__enum__ = js.fx.Transition; $x.toString = $estr; return $x; }
js.fx.Transition.Bounce = function(p) { var $x = ["Bounce",10,p]; $x.__enum__ = js.fx.Transition; $x.toString = $estr; return $x; }
js.fx.Transition.Elastic = function(p,pa) { var $x = ["Elastic",11,p,pa]; $x.__enum__ = js.fx.Transition; $x.toString = $estr; return $x; }
js.fx.TransitionFunctions = $hxClasses["js.fx.TransitionFunctions"] = function() { }
js.fx.TransitionFunctions.__name__ = ["js","fx","TransitionFunctions"];
js.fx.TransitionFunctions.transitionParam = function(p,f) {
	return (function($this) {
		var $r;
		switch( (p)[1] ) {
		case 0:
			$r = f;
			break;
		case 1:
			$r = function(pos) {
				return 1 - f(1 - pos);
			};
			break;
		case 2:
			$r = function(pos) {
				return pos <= 0.5?f(2 * pos) / 2:2 - f(2 * (1 - pos)) / 2;
			};
			break;
		}
		return $r;
	}(this));
}
js.fx.TransitionFunctions.get = function(t) {
	return (function($this) {
		var $r;
		var $e = (t);
		switch( $e[1] ) {
		case 0:
			$r = js.fx.TransitionFunctions.linear;
			break;
		case 1:
			var p = $e[2];
			$r = js.fx.TransitionFunctions.transitionParam(p,js.fx.TransitionFunctions.quad);
			break;
		case 2:
			var p = $e[2];
			$r = js.fx.TransitionFunctions.transitionParam(p,js.fx.TransitionFunctions.cubic);
			break;
		case 3:
			var p = $e[2];
			$r = js.fx.TransitionFunctions.transitionParam(p,js.fx.TransitionFunctions.quart);
			break;
		case 4:
			var p = $e[2];
			$r = js.fx.TransitionFunctions.transitionParam(p,js.fx.TransitionFunctions.quint);
			break;
		case 5:
			var p = $e[2];
			$r = (function(f,x) {
				return function(p1) {
					return f(x,p1);
				};
			})(js.fx.TransitionFunctions.pow,p);
			break;
		case 6:
			var p = $e[2];
			$r = js.fx.TransitionFunctions.transitionParam(p,js.fx.TransitionFunctions.expo);
			break;
		case 7:
			var p = $e[2];
			$r = js.fx.TransitionFunctions.transitionParam(p,js.fx.TransitionFunctions.circ);
			break;
		case 8:
			var p = $e[2];
			$r = js.fx.TransitionFunctions.transitionParam(p,js.fx.TransitionFunctions.sine);
			break;
		case 9:
			var pa = $e[3], p = $e[2];
			$r = js.fx.TransitionFunctions.transitionParam(p,(function(f1,pa1) {
				return function(p1) {
					return f1(pa1,p1);
				};
			})(js.fx.TransitionFunctions.back,pa));
			break;
		case 10:
			var p = $e[2];
			$r = js.fx.TransitionFunctions.transitionParam(p,js.fx.TransitionFunctions.bounce);
			break;
		case 11:
			var pa = $e[3], p = $e[2];
			$r = js.fx.TransitionFunctions.transitionParam(p,(function(f2,pa2) {
				return function(p1) {
					return f2(pa2,p1);
				};
			})(js.fx.TransitionFunctions.elastic,pa));
			break;
		}
		return $r;
	}(this));
}
js.fx.TransitionFunctions.linear = function(p) {
	return p;
}
js.fx.TransitionFunctions.pow = function(x,p) {
	if(x == null) x = 6.0;
	return Math.pow(p,x);
}
js.fx.TransitionFunctions.expo = function(p) {
	return Math.pow(2,8 * (p - 1));
}
js.fx.TransitionFunctions.circ = function(p) {
	return 1 - Math.sin(Math.acos(p));
}
js.fx.TransitionFunctions.sine = function(p) {
	return 1 - Math.sin((1 - p) * Math.PI / 2);
}
js.fx.TransitionFunctions.back = function(pa,p) {
	if(pa == null) pa = 1.618;
	return Math.pow(p,2) * ((pa + 1) * p - pa);
}
js.fx.TransitionFunctions.bounce = function(p) {
	var value = null;
	var a = 0.0;
	var b = 1.0;
	while(true) {
		if(p >= (7 - 4 * a) / 11) {
			value = -Math.pow((11 - 6 * a - 11 * p) / 4,2) + b * b;
			break;
		}
		a += b;
		b /= 2.0;
	}
	return value;
}
js.fx.TransitionFunctions.elastic = function(pa,p) {
	if(pa == null) pa = 1.0;
	return Math.pow(2,10 * --p) * Math.cos(20 * p * Math.PI * pa / 3);
}
js.fx.TransitionFunctions.quad = function(p) {
	return Math.pow(p,2);
}
js.fx.TransitionFunctions.cubic = function(p) {
	return Math.pow(p,3);
}
js.fx.TransitionFunctions.quart = function(p) {
	return Math.pow(p,4);
}
js.fx.TransitionFunctions.quint = function(p) {
	return Math.pow(p,5);
}
js.fx.TransitionParam = $hxClasses["js.fx.TransitionParam"] = { __ename__ : ["js","fx","TransitionParam"], __constructs__ : ["In","Out","InOut"] }
js.fx.TransitionParam.In = ["In",0];
js.fx.TransitionParam.In.toString = $estr;
js.fx.TransitionParam.In.__enum__ = js.fx.TransitionParam;
js.fx.TransitionParam.Out = ["Out",1];
js.fx.TransitionParam.Out.toString = $estr;
js.fx.TransitionParam.Out.__enum__ = js.fx.TransitionParam;
js.fx.TransitionParam.InOut = ["InOut",2];
js.fx.TransitionParam.InOut.toString = $estr;
js.fx.TransitionParam.InOut.__enum__ = js.fx.TransitionParam;
tools.EditorAction = $hxClasses["tools.EditorAction"] = { __ename__ : ["tools","EditorAction"], __constructs__ : ["AImage","ATag","AUserImage","ANode","ASpan","AColSpan","ALink","AReg"] }
tools.EditorAction.AImage = function(tag,url) { var $x = ["AImage",0,tag,url]; $x.__enum__ = tools.EditorAction; $x.toString = $estr; return $x; }
tools.EditorAction.ATag = function(tag,helpOnly,notOnPaper,wImg) { var $x = ["ATag",1,tag,helpOnly,notOnPaper,wImg]; $x.__enum__ = tools.EditorAction; $x.toString = $estr; return $x; }
tools.EditorAction.AUserImage = function(tag,url,nb) { var $x = ["AUserImage",2,tag,url,nb]; $x.__enum__ = tools.EditorAction; $x.toString = $estr; return $x; }
tools.EditorAction.ANode = function(node,html,helpOnly,notOnPaper,wiImg) { var $x = ["ANode",3,node,html,helpOnly,notOnPaper,wiImg]; $x.__enum__ = tools.EditorAction; $x.toString = $estr; return $x; }
tools.EditorAction.ASpan = function(node,span,helpOnly,notOnPaper,wiImg) { var $x = ["ASpan",4,node,span,helpOnly,notOnPaper,wiImg]; $x.__enum__ = tools.EditorAction; $x.toString = $estr; return $x; }
tools.EditorAction.AColSpan = function(node,span,col) { var $x = ["AColSpan",5,node,span,col]; $x.__enum__ = tools.EditorAction; $x.toString = $estr; return $x; }
tools.EditorAction.ALink = function(text1,text2,node,helpOnly,notOnPaper,wiImg) { var $x = ["ALink",6,text1,text2,node,helpOnly,notOnPaper,wiImg]; $x.__enum__ = tools.EditorAction; $x.toString = $estr; return $x; }
tools.EditorAction.AReg = function(ereg,replace,helpOnly,notOnPaper,wiImg) { var $x = ["AReg",7,ereg,replace,helpOnly,notOnPaper,wiImg]; $x.__enum__ = tools.EditorAction; $x.toString = $estr; return $x; }
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
if(String.prototype.cca == null) String.prototype.cca = String.prototype.charCodeAt;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
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
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.Prolog = "prolog";
Xml.Document = "document";
js.Tip.init();
var q = window.jQuery;
js.JQuery = q;
q.fn.iterator = function() {
	return { pos : 0, j : this, hasNext : function() {
		return this.pos < this.j.length;
	}, next : function() {
		return $(this.j[this.pos++]);
	}};
};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
js.XMLHttpRequest = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch( e ) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch( e1 ) {
			throw "Unable to create XMLHttpRequest object.";
		}
	}
}:(function($this) {
	var $r;
	throw "Unable to create XMLHttpRequest object.";
	return $r;
}(this));
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.CODES = null;
haxe.remoting.ExternalConnection.connections = new Hash();
js.Tip.xOffset = 3;
js.Tip.yOffset = 22;
js.Tip.defaultClass = "normalTip";
js.Tip.tooltipId = "tooltip";
js.Tip.tooltipContentId = "tooltipContent";
js.Tip.minOffsetY = 23;
js.App.DELAY = 1000;
js.App.CONNECT_ID = "zone";
js.App.CONNECT_AVATAR_ID = "persos_viewer";
js.App.CONNECT_PNJV_ID = "pnjViewer";
js.App.DESC_ID = "descBox";
js.App.DIALOG_ID = "dialogBox";
js.App.ANSWERS_ID = "answers";
js.App.TOKEN_ID = "token";
js.App.GOLD_ID = "gold";
js.App.DATADOMAIN = "http://data.naturalchimie.com";
js.App.DEFAULT_ACTIVE_CLASS = "actionActive";
js.App.DEFAULT_INACTIVE_CLASS = "actionInactive";
js.App.DEFAULT_HIGHLIGHT_CLASS = "actionHighlight";
js.App.liToChange = ["play","ice","creuse","mission","vent","schoolCup"];
js.App.flc = null;
js.App.flcav = null;
js.App.flcpnj = null;
js.App.flashAttempts = 0;
js.App.flashAvAttempts = 0;
js.App.flashPnjAttempts = 0;
js.App.ref = [haxe.remoting.Connection,js.Tip,tools.Editor,js.fx.Accordion];
js.App.cChapter = 0;
js.App.cPage = 0;
js.App.RIGHTID = "rightPage";
js.App.lastSRecipe = "";
js.App.toolActive = false;
js.App.toolAnim = false;
js.App.toolId = "ttool";
js.App.currentToolId = null;
js.App.currentFromToolId = null;
js.App.cBeltIndex = null;
js.App.questToolActive = false;
js.App.questToolId = "qtool";
js.App.buy_last_infos = "default";
js.App.sell_last_infos = "default";
js.App.game_started = false;
js.Lib.onerror = null;
js.fx.Style.REQUIRES_FILTERS = js.Lib.window.ActiveXObject != null;
js.fx.Tool.isIE = typeof document!='undefined' && document.all != null && typeof window!='undefined' && window.opera == null;
js.App.main();
