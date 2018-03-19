﻿String.format = function (str)
{
  if (arguments.length == 0)
    return null;

  var str = arguments[0];
  for (var i = 1; i < arguments.length; i++)
  {
    var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
    str = str.replace(re, arguments[i]);
  }
  return str;
};

/*对象序列化为字符串*/
String.toSerialize = function (obj)
{
  var ransferCharForJavascript = function (s)
  {
    var newStr = s.replace(
          /[\x26\x27\x3C\x3E\x0D\x0A\x22\x2C\x5C\x00]/g,
          function (c)
          {
            ascii = c.charCodeAt(0);
            return '\\u00' + (ascii < 16 ? '0' + ascii.toString(16) : ascii.toString(16));
          }
     );
    return newStr;
  }
  if (obj == null)
  {
    return null;
  }
  else if (obj.constructor == Array)
  {
    var builder = [];
    builder.push("[");
    for (var index in obj)
    {
      if (typeof obj[index] == "function") continue;
      if (index > 0) builder.push(",");
      builder.push(String.toSerialize(obj[index]));
    }
    builder.push("]");
    return builder.join("");
  }
  else if (obj.constructor == Object)
  {
    var builder = [];
    builder.push("{");
    var index = 0;
    for (var key in obj)
    {
      if (typeof obj[key] == "function") continue;
      if (index > 0) builder.push(",");
      builder.push(String.format("\"{0}\":{1}", key, String.toSerialize(obj[key])));
      index++;
    }
    builder.push("}");
    return builder.join("");
  }
  else if (obj.constructor == Boolean)
  {
    return obj.toString();
  }
  else if (obj.constructor == Number)
  {
    return obj.toString();
  }
  else if (obj.constructor == String)
  {
    return String.format('"{0}"', ransferCharForJavascript(obj));
  }
  else if (obj.constructor == Date)
  {
    return String.format('{"__DataType":"Date","__thisue":{0}}', obj.getTime() - (new Date(1970, 0, 1, 0, 0, 0)).getTime());
  }
  else if (this.toString != undefined)
  {
    return String.toSerialize(obj);
  }
};

String.formToSerialize = function (o)
{
  /// <summary>
  /// //主要是推荐这个函数。将jquery系列化form后的值转为name:value的形式。
  /// </summary>
  var v = {};
  for (var i in o)
  {
    if (typeof (v[o[i].name]) == 'undefined') v[o[i].name] = o[i].value;
    else v[o[i].name] += "," + o[i].value;
  }
  return String.toSerialize(v);
};

/*- ==========================================================
*     功能说明：对Math对象的扩展
*     使用说明： 1、重写后的数学三角函数的参数不再是弧度，而是角度
*                2、Math.Radian()，将角度转换为弧度
*                3、Math.Angel()，将弧度转换为角度
*                4、Math.Sin()，计算角度的正弦
*                5、Math.Cin()，计算角度的余弦
*                6、Math.Tan()，计算角度的正切
*                7、Math.Pol()，通过x,y坐标计算距离和角度
*                7、Math.Rec()，通过距离和角度计算坐标
-*/
Math.Radian=function( angel )    {    return angel*this.PI/180;                }
Math.Angel=function( radian )    {    return radian*180/this.PI;                }
Math.Sin=function( angel )    {    return this.sin( this.Radian( angel ) );    }
Math.Asin=function( nums )    {    return this.Angel( this.asin( nums ) );    }
Math.Cos=function( angel )    {    return this.cos( this.Radian( angel ) );    }
Math.Acos=function( nums )    {    return this.Angel( this.acos( nums ) );    }
Math.Tan  =function( angel )    {    return this.tan( this.Radian( angel ) );    }
Math.Atan=function( nums )    {    return this.Angel( this.atan( nums ) );    }
Math.Atan2=function( x, y )        {    return this.Angel( this.atan2( y, x ) );    }
Math.Pol=function( x, y )        {    return [ this.sqrt( x*x + y*y ), this.Atan2( x, y ) ];        }
Math.Rec =function( dist, angel )    {    return [ dist*this.Cos( angel ), dist*this.Sin( angel ) ];    }

//四舍五入
Math.Round=function(num, x)
{   
	var t=Math.pow(10,   x);   
	return Math.round(num * t) / t;
};

/*************************************************************
**		Date基础函数扩展
**************************************************************/
Date.prototype.dateAdd = function (p_Interval, p_Number)
{
  var thing = new String();

  //in the spirt of VB we'll make this function non-case sensitive
  //and convert the charcters for the coder.
  p_Interval = p_Interval.toLowerCase();

  if (isNaN(p_Number))
  {
    //Only accpets numbers 
    //throws an error so that the coder can see why he effed up    
    throw "The second parameter must be a number. /n You passed: " + p_Number;
    return false;
  }
  p_Number = new Number(p_Number);
  switch (p_Interval.toLowerCase())
  {
    case "yyyy": {// year
      this.setFullYear(this.getFullYear() + p_Number);
      break;
    }
    case "q": {        // quarter
      this.setMonth(this.getMonth() + (p_Number * 3));
      break;
    }
    case "m": {        // month
      this.setMonth(this.getMonth() + p_Number);
      break;
    }
    case "y":        // day of year
    case "d":        // day
    case "w": {        // weekday
      this.setDate(this.getDate() + p_Number);
      break;
    }
    case "ww": {    // week of year
      this.setDate(this.getDate() + (p_Number * 7));
      break;
    }
    case "h": {        // hour
      this.setHours(this.getHours() + p_Number);
      break;
    }
    case "n": {        // minute
      this.setMinutes(this.getMinutes() + p_Number);
      break;
    }
    case "s": {        // second
      this.setSeconds(this.getSeconds() + p_Number);
      break;
    }
    case "ms": {        // second
      this.setMilliseconds(this.getMilliseconds() + p_Number);
      break;
    }
    default: {

      //throws an error so that the coder can see why he effed up and
      //a list of elegible letters.
      throw "The first parameter must be a string from this list: /n" +
              "yyyy, q, m, y, d, w, ww, h, n, s, or ms. You passed: " + p_Interval;
      return false;
    }
  }
  return this;
}

/*************************************************************
**		Array基础函数扩展
**************************************************************/
//在指定位置插入对象元素
Array.prototype.insert = function (index, obj)
{
	if ($.isArray(obj))
	{
		var me = this;
		$.each(obj.reverse(), function (i, item)
		{
			return me.splice(index, 0, item);
		});
	}
	else
	{
		return this.splice(index, 0, obj);
	}
}

//删除指定对象元素
Array.prototype.remove=function(o) 
{
	var i=this.indexOf(o);
	if (i>-1) this.splice(i,1);
	return (i>-1);
}

// 删除指定索引的数据
Array.prototype.removeAt=function(n)
{
    if (n<0) return this;
    return this.slice(0,n).concat(this.slice(n+1,this.length));
}

// 删除指定索引的数据
Array.prototype.removeById=function(_key, id)
{
  for (var i = 0, _len = this.length; i < _len; i++)
  {
    if (this[i][_key] == id)
    {
      this.splice(i, 1);
      return this;
    }
  }
  return this;
}
// 数组洗牌
Array.prototype.random=function()
{
    var nr=[], me=this, t;
    while(me.length>0)
    {
        nr[nr.length]=me[t=Math.floor(Math.random() * me.length)];
        me=me.removeAt(t);
    }
    return nr;
}
// 数字数组排序
Array.prototype.sortNum=function(f)
{
    if (!f) f=0;
    if (f==1) return this.sort(function(a,b){return b-a;});
    return this.sort(function(a,b){return a-b;});
}
// 获得数字数组的最大项
Array.prototype.getMax=function()
{
    return this.sortNum(1)[0];
}
// 获得数字数组的最小项
Array.prototype.getMin=function()
{
    return this.sortNum(0)[0];
}
// 数组第一次出现指定元素值的位置
Array.prototype.indexOf=function(o)
{
    for (var i=0; i<this.length; i++) if (this[i]==o) return i;
    return -1;
}
// 根据指定的字段名，字段值查找数据对象
Array.prototype.find=function(_key, id)
{
	if (typeof _key == "object")
	{
		for (var i = 0; i < this.length; i++)
		{
			var isOK = true;
			var me = this;
			$.each(_key, function (key, value)
			{
				if (me[i][key] != value)
				{
					isOK = false;
				}
			});
			if (isOK)
			{
				return this[i];
			}
		}
	}
	else if (typeof id == "undefined")
	{
		for (var i = 0; i < this.length; i++)
		{
			if (this[i] == _key)
			{
				return this[i];
			}
		}
	}
	else
	{
		for (var i = 0; i < this.length; i++)
		{
			if (this[i][_key] == id)
			{
				return this[i];
			}
		}
	}
	return null;
}
 // 根据指定的字段名，字段值查找数据对象
Array.prototype.findAll = function (_key, id)
{
	var find = [];
	if (typeof _key == "object")
	{
		for (var i = 0; i < this.length; i++)
		{
			var isOK = true;
			var me = this;
			$.each(_key, function (key, value)
			{
				if (me[i][key] != value)
				{
					isOK = false;
				}
			});
			if (isOK)
			{
				find.push(this[i]);
			}
		}
	}
	else
	{
		for (var i = 0; i < this.length; i++)
		{
			if (this[i][_key] == id)
			{
				find.push(this[i]);
			}
		}
	}
	return find;
}

// 移除数组中重复的项
Array.prototype.removeRepeat=function()
{
    this.sort();
    var rs=[];
    var cr=false;
    for (var i=0; i<this.length; i++)
    {
        if (!cr) cr=this[i];
        else if (cr==this[i]) rs[rs.length]=i;
        else cr=this[i];
    }
    var re=this;
    for (var i=rs.length-1; i>=0; i--) re=re.removeAt(rs[i]);
    return re;
}
//javascript数组操作：将n移动到m
Array.prototype.movePosition = function (n, m)
{
	n = n < 0 ? 0 : (n > this.length - 1 ? this.length - 1 : n);
	m = m < 0 ? 0 : (m > this.length - 1 ? this.length - 1 : m);
	if (n === m)
	{
		return this;
	}
	else
	{
		if (n > m)//向前移动>对两个索引位置及其中间的元素重新赋值[顺推]   
		{
			var temp = [this[m], this[m] = this[n]][0]; //交换n和m的值并将m上的值赋给temp   
			for (var i = m + 1; i <= n; i++)
			{
				temp = [this[i], this[i] = temp][0];
			}
		}
		else
		{//向后移动>对两个索引位置及其中间的元素重新赋值[倒推]   
			var temp = [this[m], this[m] = this[n]][0]; //交换n和m的值并将m上的值赋给temp   
			for (var i = m - 1; i >= n; i--)
			{
				temp = [this[i], this[i] = temp][0];
			}
		}
		return this;
	}
};
 
/*************************************************************
**		String基础函数扩展
**************************************************************/
String.prototype.trim = function ()   //去除字符串前后空格
{
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.trimBegin=function()   //去除字符串前面的空格
{
	return this.replace(/(^[\s]*)/g,"");
}

String.prototype.trimEnd=function()   //去除字符串后面的空格
{
	return this.replace(/(^[\s]*$)/g,"");
}

String.prototype.trimHTMLTag = function()
{
	return this.replace(/(<[^>]*>)/gi,"").replace(/&nbsp;/g, "");	//<\/*[^<>]*>
};

String.prototype.getValidHTMLTag = function()
{
  return this.replace(/(<img{0}[^>]*>)/gi, "").replace(/&nbsp;/g, "");
};

String.prototype.getLength = function ()
{
  var text = this.replace(/[^\x00-\xff]/g, "**");
  return text.length;
}

String.prototype.getShort = function (len, alt)
{
  var tempStr = this;
  if (this.getLength() > len)
  {
    if (!alt)
    {
      alt = "...";
    }
    var i = 0;
    for (var z = 0; z < len; z++)
    {
      if (tempStr.charCodeAt(z) > 255)
      {
        i = i + 2;
      } else
      {
        i = i + 1;
      }
      if (i >= len)
      {
        tempStr = tempStr.slice(0, (z + 1)) + alt;
        break;
      }
    }
    return tempStr;
  } else
  {
    return this + "";
  }
}

/*************************************************************
**		事件
**************************************************************/
//快捷键，实现shift + S
$(function ()
{
  $('body').keydown(function (event) {
    //	alert(event.keyCode);
    if (event.ctrlKey && event.shiftKey && event.keyCode == 83)		//shift + S
    {
      helper.save();
    }
    else if (event.ctrlKey && event.shiftKey && event.keyCode == 65)		//shift + A
    {
      helper.add();
    }
  });

  //快捷键，实现ctrl + tab
  var m_keyTabCount = 0;				//按tab键次数
  $('body').keyup(function (event)
  {
    if (event.ctrlKey && event.keyCode == 9)	//9 TabKey Code
    {
      m_keyTabCount++;
    }
    if (event.keyCode == 17)	//17 CtrlKey Code
    {
      //if(m_keyTabCount>0)top.ctrlTab(m_keyTabCount);

      m_keyTabCount = 0;
    }
  })
});

/*************************************************************
**		基础函数
**************************************************************/
Globals = {
	$: function ($name)		//获得元素
	{
		return document.getElementById($name);
	},

	getParentNode: function ($node, $parentTagName)		//获得父级节点
	{
		var $body = ($parentTagName != null) ? $parentTagName : "BODY";
		$body = $body.toUpperCase();
		while ($node.tagName && $node.tagName.toUpperCase() != $body && $node != null)
		{
			$node = $node.parentNode;
		}
		return $node;
	},

	getId: function ()
	{
		var id = this.getUrlParam("id");
		if (!id) id = window.location.hash.replace("#", "");
		return id;
	},

	getMenuId: function ()
	{
		var id = this.getUrlParam("Menu_Id");
		return id;
	},

	getUrlParam: function (paramName)		//获得Url参数
	{
		var oRegex = new RegExp('[\?&]' + paramName + '=([^&]+)', 'i');
		var oMatch = oRegex.exec(window.location.search);

		if (oMatch && oMatch.length > 1)
			return decodeURIComponent(oMatch[1]);
		else
			return '';
	},

	tableName: function ()
	{
		return this.getUrlParam("tablename");
	},

	tableView: function ()
	{
		var t = this.getUrlParam("tableview");
		if (!t) t = this.tableName();
		return t;
	},

	operation: function ()
	{
		var t = this.getUrlParam("op");
		if (!t) t = this.getUrlParam("operation");
		return t;
	},

	modelName: function ()
	{
		var t = this.getUrlParam("ModelName");
		if (!t) t = this.tableView();
		return t;
	},

	getParamByUrl: function (url, paramName)		//获得制定的Url参数
	{
		var oRegex = new RegExp('[\?&]' + paramName + '=([^&]+)', 'i');
		var oMatch = oRegex.exec(url);

		if (oMatch && oMatch.length > 1)
			return oMatch[1];
		else
			return '';
	},
	changeJsonDate: function (value)
	{
		if (typeof (value) == "string" && value.indexOf("/Date") >= 0)
		{
			value = value.replace(/\//g, "").replace("Date", "new Date");
			value = Globals.formatDate(value, "yyyy-MM-dd HH:mm:ss");
		}
		return value;
	},
	formatDate: function (date, $p_format)
	{
		if (!date) return "";
		if (typeof date == "string") date = date.replace(/\.000/gi, '');
		if (typeof date == "number") date = new Date(date);
		var $MonthArr = new Array('January ', 'February ', 'March ', 'April ', 'May ', 'June ', 'July ', 'August ', 'September ', 'October ', 'November ', 'December ', 'Jan ', 'Feb ', 'Mar ', 'Apr ', 'May ', 'Jun ', 'Jul ', 'Aug ', 'Sep ', 'Oct ', 'Nov ', 'Dec');
		var $WeekArr = new Array('Sunday ', 'Monday ', 'Tuesday ', 'Wednesday ', 'Thursday ', 'Friday ', 'Saturday ', 'Sun ', 'Mon ', 'Tue ', 'Wed ', 'Thu ', 'Fri ', 'Sat');
		function parseDate(value)
		{
			var date = null;
			if (Date.prototype.isPrototypeOf(value))
			{
				date = value;
			}
			else if (typeof (value) == "string")
			{
				if (value.indexOf("Date") >= 0)
				{
					date = eval(value);
				}
				else
				{
					date = new Date(value.replace(/-/g, "/"));
				}
			}
			return date;
		};
		function $plusPreZero(x)
		{
			return (x < 0 || x > 9 ? "" : "0") + x;
		};

		date = parseDate(date);   //by xtb 

		$p_format = $p_format + "";
		var $eventReturnValue = "";
		var $G = 0;
		var $char = "";
		y;
		var $1 = "";
		var y = date.getYear() + "";
		var M = date.getMonth() + 1;
		var d = date.getDate();
		var E = date.getDay();
		var H = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
		var value = new Object();
		if (y.length < 4)
		{
			y = "" + (y - 0 + 1900);
		};
		value["y"] = "" + y;
		value["yyyy"] = y;
		value["yy"] = y.substring(2, 4);
		value["M"] = M;
		value["MM"] = $plusPreZero(M);
		value["MMM"] = $MonthArr[M - 1];
		value["NNN"] = $MonthArr[M + 11];
		value["d"] = d;
		value["dd"] = $plusPreZero(d);
		value["E"] = $WeekArr[E + 7];
		value["EE"] = $WeekArr[E];
		value["H"] = H;
		value["HH"] = $plusPreZero(H);
		if (H == 0)
		{
			value["h"] = 12;
		}
		else if (H > 12)
		{
			value["h"] = H - 12;
		}
		else
		{
			value["h"] = H;
		};
		value["hh"] = $plusPreZero(value["h"]);
		if (H > 11)
		{
			value["K"] = H - 12;
		}
		else
		{
			value["K"] = H;
		};
		value["k"] = H + 1;
		value["KK"] = $plusPreZero(value["K"]);
		value["kk"] = $plusPreZero(value["k"]);
		if (H > 11)
		{
			value["a"] = "PM";
		}
		else
		{
			value["a"] = "AM";
		};
		value["m"] = m;
		value["mm"] = $plusPreZero(m);
		value["s"] = s;
		value["ss"] = $plusPreZero(s);
		while ($G < $p_format.length)
		{
			$char = $p_format.charAt($G);
			$1 = "";
			while (($p_format.charAt($G) == $char) && ($G < $p_format.length))
			{
				$1 += $p_format.charAt($G++);
			};
			if (value[$1] != null)
			{
				$eventReturnValue = $eventReturnValue + value[$1];
			}
			else
			{
				$eventReturnValue = $eventReturnValue + $1;
			}
		};
		return $eventReturnValue;
	},
	formatNumber: function (number, pattern, zeroExc)
	{
		if (number == undefined) return number;

		function _format(pattern, num, z)
		{
			var j = pattern.length >= num.length ? pattern.length : num.length;
			var p = pattern.split("");
			var n = num.split("");
			var bool = true, nn = "";
			for (var i = 0; i < j; i++)
			{
				var x = n[n.length - j + i];
				var y = p[p.length - j + i];
				if (z == 0)
				{
					if (bool)
					{
						if ((x && y && (x != "0" || y == "0")) || (x && x != "0" && !y) || (y && y == "0" && !x))
						{
							nn += x ? x : "0";
							bool = false;
						}
					} else
					{
						nn += x ? x : "0";
					}
				} else
				{
					if (y && (y == "0" || (y == "#" && x)))
						nn += x ? x : "0";
				}
			}
			return nn;
		}
		function _formatNumber(numChar, pattern)
		{
			var patterns = pattern.split(".");
			var numChars = numChar.split(".");
			var z = patterns[0].indexOf(",") == -1 ? -1 : patterns[0].length - patterns[0].indexOf(",");
			var num1 = _format(patterns[0].replace(",", ''), numChars[0], 0);
			var num2 = _format(patterns[1] ? patterns[1].split('').reverse().join('') : "", numChars[1] ? numChars[1].split('').reverse().join('') : "", 1);
			num1 = num1.split("").reverse().join('');
			var reCat = eval("/[0-9]{" + (z - 1) + "," + (z - 1) + "}/gi");
			var arrdata = z > -1 ? num1.match(reCat) : undefined;
			if (arrdata && arrdata.length > 0)
			{
				var w = num1.replace(arrdata.join(''), '');
				num1 = arrdata.join(',') + (w == "" ? "" : ",") + w;
			}
			num1 = num1.split("").reverse().join("");
			return (num1 == "" ? "0" : num1) + (num2 != "" ? "." + num2.split("").reverse().join('') : "");
		}

		pattern = pattern || "#.##";
		zeroExc = zeroExc || true;

		var reCat = /[0#,.]{1,}/gi;
		var _pattern = pattern.match(reCat)[0];
		var numChar = number.toString();
		return !(zeroExc && numChar == 0) ? pattern.replace(_pattern, _formatNumber(numChar, _pattern)) : pattern.replace(_pattern, "0");
	},

	//获得周几
	getWeek: function (date)
	{
		var d, day, x;
		var x = new Array("星期日", "星期一", "星期二");
		var x = x.concat("星期三", "星期四", "星期五"); var x = x.concat("星期六");
		day = date.getDay();
		return (x[day]);
	},

	loadXML: function (xml)		//加载XML数据
	{
		var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.3.0");
		xmlDoc.async = false;
		xmlDoc.loadXML(xml);
		if (xmlDoc.parseError.errorCode != 0)
		{
			var myErr = xmlDoc.parseError;
			alert("You have error " + myErr.reason);
			return null;
		}
		//return xmlDoc.documentElement;
		return xmlDoc;
	},

	documentElement: function ()		//获得根文档
	{
		var documentElement;
		if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat')
		{
			documentElement = document.documentElement;
		}
		else if (typeof document.body != 'undefined')
		{
			documentElement = document.body;
		}
		return documentElement;
	},

	getImageOriginWidth: function (oImage)
	{
		var OriginImage = new Image();
		OriginImage.src = oImage.src;
		return OriginImage.width;
	},
	getImageOriginHeight: function (oImage)
	{
		var OriginImage = new Image();
		OriginImage.src = oImage.src;
		return OriginImage.height;
	},
	getHost: function ()
	{
		return "http:/" + "/" + document.location.host;
	},
	ascii: function (str)
	{
		return str.replace(/[^\u0000-\u00FF]/g, function ($0) { return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;") });
	},

	unicode: function (str)
	{
		return str.replace(/[^\u0000-\u00FF]/g, function ($0) { return escape($0).replace(/(%u)(\w{4})/gi, "\\u$2") });
	},

	reconvert: function (str)
	{
		str = str.replace(/(\\u)(\w{4})/gi, function ($0)
		{
			return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{4})/g, "$2")), 16)));
		});

		str = str.replace(/(&#x)(\w{4});/gi, function ($0)
		{
			return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{4})(%3B)/g, "$2"), 16));
		});
		str = str.replace(/(&#)(\d{4,5});/gi, function ($0)
		{
			return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{4,5})(%3B)/g, "$2"), 10));
		});
		return str;
	},

	//post弹窗
	postOpen: function (url, postParams, width, height, isToolbar, isFullScreen)
	{
		var form = $("#popupform");
		if (form.length == 0)
		{
			form = $('<form action="" method="post" id="popupform" target="_blank"></form>').appendTo('body');
		}
		form.html('');
		$.each(postParams, function (name, value)
		{
			$('<input type="hidden" id="' + name + '" name="' + name + '" value=\'' + value + '\'/>').appendTo(form);
		});
		form.attr("action", url);

		//打开窗体，并post提交页面
		var windowname = "win" + Math.round(Math.random() * 100000);
		var p = "resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=no";
		if (isToolbar)
		{
			p = "resizable=yes,scrollbars=yes,status=yes,toolbar=yes,menubar=yes,location=no";
		}
		if (isFullScreen)
		{
			p += ",fullscreen";
		}
		if (width) p += ",width=" + width;
		if (height) p += ",height=" + height;
		window.open(url, windowname, p);
		form.attr("target", windowname);
		form.submit();
	},

	//判断全部为空   
	isEmpty: function (expression)
	{
		var arry;
		if (typeof (expression) == "undefined")
		{
			arry = $(".isEmpty");
		} else
		{
			arry = $(expression);
		}
		for (i = 0; i < arry.length; i++)
		{
			var cur = $(arry[i]);
			if (cur.val() == "")
			{
				alert(cur.attr("info"));
				cur.focus();
				cur.select();
				return false;
			}
		}
		return true;
	},

	//判断全是整数   
	isInteger: function (expression)
	{
		var arry;
		if (typeof (expression) == "undefined")
		{
			arry = $(".isInteger");
		} else
		{
			arry = $(expression);
		}
		for (i = 0; i < arry.length; i++)
		{
			var cur = $(arry[i]);
			if (!/^\d+$/.test(cur.val()))
			{
				alert(cur.attr("info") ? cur.attr("info") : '' + "必须是整数！");
				cur.focus();
				cur.select();
				return false;
			}
		}
		return true;
	},

	//判断全是数字   
	isNumber: function (expression)
	{
		var arry;
		if (typeof (expression) == "undefined")
		{
			arry = $(".isNumber");
		} else
		{
			arry = $(expression);
		}
		for (i = 0; i < arry.length; i++)
		{
			var cur = $(arry[i]);
			if (!isNaN(cur.val()))
			{
				alert(cur.attr("info") + "必须是数字！");
				cur.focus();
				cur.select();
				return false;
			}
		}
		return true;
	},
	getMaxZIndex: function ()
	{
		var maxZ = Math.max.apply(null, $.map($("div[style*='position']"),
		function (e, n)
		{
			if ('absolute,fixed,relative'.indexOf($(e).css('position') >= 0))
				return parseInt($(e).css('z-index')) || 1;
		}));
		return maxZ;
	},
	GUID: function ()
	{
		function G()
		{
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
		}
		var g = (G() + G() + "-" + G() + "-" + G() + "-" + G() + "-" + G() + G() + G()).toUpperCase();
		return g;
	}
};

/*************************************************************
**		输入框光标操作
**************************************************************/
(function (jQuery)
{
	jQuery.fn.getCursorPosition = function ()
	{
		return $(this).getSelectionStart();
	}
	jQuery.fn.setCursorPosition = function (position)
	{
		return $(this).setSelection(position, position);
	}
	jQuery.fn.getSelection = function ()
	{
		var s = $(this).getSelectionStart();
		var e = $(this).getSelectionEnd();
		return this[0].value.substring(s, e);
	}
	jQuery.fn.getSelectionStart = function ()
	{
		input = this[0];

		var pos = input.value.length;

		if (input.createTextRange)
		{
			var r = document.selection.createRange().duplicate();
			r.moveEnd('character', input.value.length);
			if (r.text == '')
				pos = input.value.length;
			pos = input.value.lastIndexOf(r.text);
		} else if (typeof (input.selectionStart) != "undefined")
			pos = input.selectionStart;

		return pos;
	}
	jQuery.fn.getSelectionEnd = function ()
	{
		input = this[0];

		var pos = input.value.length;

		if (input.createTextRange)
		{
			var r = document.selection.createRange().duplicate();
			r.moveStart('character', -input.value.length);
			if (r.text == '')
				pos = input.value.length;
			pos = input.value.lastIndexOf(r.text);
		} else if (typeof (input.selectionEnd) != "undefined")
			pos = input.selectionEnd;

		return pos;
	}
	jQuery.fn.setSelection = function (selectionStart, selectionEnd)
	{
		input = this[0];

		if (input.createTextRange)
		{
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		} else if (input.setSelectionRange)
		{
			input.focus();
			input.setSelectionRange(selectionStart, selectionEnd);
		}

		return this;
	}
  jQuery.fn.isSelected = function ()
  {
    var select_field = this;
    word = '';
    if (document.selection)
    {
      var sel = document.selection.createRange();
      if (sel.text.length > 0)
      {
        word = sel.text;
      }
    }    /*ie浏览器*/
    else if (select_field.selectionStart || select_field.selectionStart == '0')
    {
      var startP = select_field.selectionStart;
      var endP = select_field.selectionEnd;
      if (startP != endP)
      {
        word = select_field.value.substring(startP, endP);
      }
    }
    /*标准浏览器*/
    if (word == '') return false;
    else return true;
  }
	jQuery.fn.insertAtCousor = function (myValue)
	{
		var $t = $(this)[0];
		if (document.selection)
		{
			this.focus();
			sel = document.selection.createRange();
			sel.text = myValue;
			this.focus();
		} else if ($t.selectionStart || $t.selectionStart == '0')
		{
			var startPos = $t.selectionStart;
			var endPos = $t.selectionEnd;
			var scrollTop = $t.scrollTop;
			$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
			this.focus();
			$t.selectionStart = startPos + myValue.length;
			$t.selectionEnd = startPos + myValue.length;
			$t.scrollTop = scrollTop;
		} else
		{
			this.value += myValue;
			this.focus();
		}
	}
})(jQuery);
(function (jQuery)
{
  if (jQuery.browser) return;

  jQuery.browser = {};
  jQuery.browser.mozilla = false;
  jQuery.browser.webkit = false;
  jQuery.browser.opera = false;
  jQuery.browser.msie = false;

  var nAgt = navigator.userAgent;
  jQuery.browser.name = navigator.appName;
  jQuery.browser.fullVersion = '' + parseFloat(navigator.appVersion);
  jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
  var nameOffset, verOffset, ix;

  // In Opera, the true version is after "Opera" or after "Version" 
  if ((verOffset = nAgt.indexOf("Opera")) != -1)
  {
    jQuery.browser.opera = true;
    jQuery.browser.name = "Opera";
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
  }
    // In MSIE, the true version is after "MSIE" in userAgent 
  else if ((verOffset = nAgt.indexOf("MSIE")) != -1)
  {
    jQuery.browser.msie = true;
    jQuery.browser.name = "Microsoft Internet Explorer";
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 5);
  }
    // In Chrome, the true version is after "Chrome" 
  else if ((verOffset = nAgt.indexOf("Chrome")) != -1)
  {
    jQuery.browser.webkit = true;
    jQuery.browser.name = "Chrome";
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 7);
  }
    // In Safari, the true version is after "Safari" or after "Version" 
  else if ((verOffset = nAgt.indexOf("Safari")) != -1)
  {
    jQuery.browser.webkit = true;
    jQuery.browser.name = "Safari";
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
  }
    // In Firefox, the true version is after "Firefox" 
  else if ((verOffset = nAgt.indexOf("Firefox")) != -1)
  {
    jQuery.browser.mozilla = true;
    jQuery.browser.name = "Firefox";
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
  }
    // In most other browsers, "name/version" is at the end of userAgent 
  else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
  (verOffset = nAgt.lastIndexOf('/')))
  {
    jQuery.browser.name = nAgt.substring(nameOffset, verOffset);
    jQuery.browser.fullVersion = nAgt.substring(verOffset + 1);
    if (jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase())
    {
      jQuery.browser.name = navigator.appName;
    }
  }
  // trim the fullVersion string at semicolon/space if present 
  if ((ix = jQuery.browser.fullVersion.indexOf(";")) != -1)
    jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix);
  if ((ix = jQuery.browser.fullVersion.indexOf(" ")) != -1)
    jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix);

  jQuery.browser.majorVersion = parseInt('' + jQuery.browser.fullVersion, 10);
  if (isNaN(jQuery.browser.majorVersion))
  {
    jQuery.browser.fullVersion = '' + parseFloat(navigator.appVersion);
    jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
  }
  jQuery.browser.version = jQuery.browser.majorVersion;
})(jQuery);
(function ($)
{
	function _drag(e)
	{
		var _state = $.data(e.data.target, "draggable");
		var _opts = _state.options;
		var _proxy = _state.proxy;
		var _eData = e.data;
		var _startLeft = _eData.startLeft + e.pageX - _eData.startX;
		var _startTop = _eData.startTop + e.pageY - _eData.startY;
		if (_proxy)
		{
			if (_proxy.parent()[0] == document.body)
			{
				if (_opts.deltaX != null && _opts.deltaX != undefined)
				{
					_startLeft = e.pageX + _opts.deltaX;
				} else
				{
					_startLeft = e.pageX - e.data.offsetWidth;
				}
				if (_opts.deltaY != null && _opts.deltaY != undefined)
				{
					_startTop = e.pageY + _opts.deltaY;
				} else
				{
					_startTop = e.pageY - e.data.offsetHeight;
				}
			} else
			{
				if (_opts.deltaX != null && _opts.deltaX != undefined)
				{
					_startLeft += e.data.offsetWidth + _opts.deltaX;
				}
				if (_opts.deltaY != null && _opts.deltaY != undefined)
				{
					_startTop += e.data.offsetHeight + _opts.deltaY;
				}
			}
		}
		if (e.data.parent != document.body && _opts.position!="fixed")
		{
			_startLeft += $(e.data.parent).scrollLeft();
			_startTop += $(e.data.parent).scrollTop();
		}
    if(_opts.position=="fixed")
    {
      _startLeft=_startLeft-$(window).scrollLeft();
      _startTop=_startTop-$(window).scrollTop();
    }
		if (_opts.axis == "h")
		{
			_eData.left = _startLeft;
		} else
		{
			if (_opts.axis == "v")
			{
				_eData.top = _startTop;
			} else
			{
				_eData.left = _startLeft;
				_eData.top = _startTop;
			}
		}
	};
	function _applyDrag(e)
	{
		var _state = $.data(e.data.target, "draggable");
		var _opts = _state.options;
		var _proxy = _state.proxy;
		if (!_proxy)
		{
			_proxy = $(e.data.target);
		}
		_proxy.css({
			left: e.data.left,
			top: e.data.top
		});
		$("body").css("cursor", _opts.cursor);
	};
	function _docDownDraggable(e)
	{
		$.fn.draggable.isDragging = true;
		var _state = $.data(e.data.target, "draggable");
		var _opts = _state.options;
		var _droppables = $(".droppable").filter(function ()
		{
			return e.data.target != this;
		}).filter(function ()
		{
			var _10 = $.data(this, "droppable").options.accept;
			if (_10)
			{
				return $(_10).filter(function ()
				{
					return this == e.data.target;
				}).length > 0;
			} else
			{
				return true;
			}
		});
		_state.droppables = _droppables;
		var _proxy = _state.proxy;
		if (!_proxy) {
			if (_opts.proxy) {
				if (_opts.proxy == "clone") {
          if(_opts.proxyContainer)
          {
  					_proxy = $(e.data.target).clone().appendTo(_opts.proxyContainer);
          }
          else
          {
  					_proxy = $(e.data.target).clone().insertAfter(e.data.target);
          }
				} else {
					_proxy = _opts.proxy.call(e.data.target, e.data.target);
				}
        _proxy.css({"z-index": Globals.getMaxZIndex()+1});
				$.data(e.data.target, "draggable").proxy = _proxy;
			} else {
				_proxy = $(e.data.target);
			}
		}
		_proxy.css("position", _opts.position);
		_drag(e);
		_applyDrag(e);
		_opts.onStartDrag.call(e.data.target, e);
		return false;
	};
	function _docMoveDraggable(e)
	{
		var _state = $.data(e.data.target, "draggable");
		_drag(e);
		if (_state.options.onDrag.call(e.data.target, e) != false)
		{
			_applyDrag(e);
		}
		var _target = e.data.target;
		_state.droppables.each(function ()
		{
			var _15 = $(this);
			if (_15.droppable("options").disabled)
			{
				return;
			}
			var p2 = _15.offset();
			if (e.pageX > p2.left && e.pageX < p2.left + _15.outerWidth() && e.pageY > p2.top && e.pageY < p2.top + _15.outerHeight())
			{
				if (!this.entered)
				{
					$(this).trigger("_dragenter", [_target]);
					this.entered = true;
				}
				$(this).trigger("_dragover", [_target]);
			} else
			{
				if (this.entered)
				{
					$(this).trigger("_dragleave", [_target]);
					this.entered = false;
				}
			}
		});
		return false;
	};
	function _docUpDraggable(e)
	{
		$.fn.draggable.isDragging = false;
		_docMoveDraggable(e);
		var _state = $.data(e.data.target, "draggable");
		var _proxy = _state.proxy;
		var _opts = _state.options;
		if (_opts.revert)
		{
			if (_triggerDrop() == true)
			{
				$(e.data.target).css({
					position: e.data.startPosition,
					left: e.data.startLeft,
					top: e.data.startTop
				});
			} else
			{
				if (_proxy)
				{
					var _1b, top;
					if (_proxy.parent()[0] == document.body)
					{
						_1b = e.data.startX - e.data.offsetWidth;
						top = e.data.startY - e.data.offsetHeight;
					} else
					{
						_1b = e.data.startLeft;
						top = e.data.startTop;
					}
					_proxy.animate({
						left: _1b,
						top: top
					},
					function ()
					{
						_removeProxy();
					});
				} else
				{
					$(e.data.target).animate({
						left: e.data.startLeft,
						top: e.data.startTop
					},
					function ()
					{
						$(e.data.target).css("position", e.data.startPosition);
					});
				}
			}
		} else
		{
			$(e.data.target).css({
				position: _opts.position,
				left: e.data.left,
				top: e.data.top
			});
			_triggerDrop();
		}
		_opts.onStopDrag.call(e.data.target, e);
		$(document).unbind(".draggable");
		setTimeout(function ()
		{
			$("body").css("cursor", "");
		},
		100);
		function _removeProxy()
		{
			if (_proxy)
			{
				_proxy.remove();
			}
			_state.proxy = null;
		};
		function _triggerDrop()
		{
			var _isTrigger = false;
			_state.droppables.each(function ()
			{
				var _jdrop = $(this);
				if (_jdrop.droppable("options").disabled)
				{
					return;
				}
				var p2 = _jdrop.offset();
				if (e.pageX > p2.left && e.pageX < p2.left + _jdrop.outerWidth() && e.pageY > p2.top && e.pageY < p2.top + _jdrop.outerHeight())
				{
					if (_opts.revert)
					{
						$(e.data.target).css({
							position: e.data.startPosition,
							left: e.data.startLeft,
							top: e.data.startTop
						});
					}
					$(this).trigger("_drop", [e.data.target, e]);
					_removeProxy();
					_isTrigger = true;
					this.entered = false;
					return false;
				}
			});
			if (!_isTrigger && !_opts.revert)
			{
				_removeProxy();
			}
			return _isTrigger;
		};
		return false;
	};
	$.fn.draggable = function (_options, _param)
	{
		if (typeof _options == "string")
		{
			return $.fn.draggable.methods[_options](this, _param);
		}
		return this.each(function ()
		{
			var _opts;
			var _state = $.data(this, "draggable");
			if (_state)
			{
				_state.handle.unbind(".draggable");
				_opts = $.extend(_state.options, _options);
			} else
			{
				_opts = $.extend({},
				$.fn.draggable.defaults, $.fn.draggable.parseOptions(this), _options || {});
			}
			var _handle = _opts.handle ? (typeof _opts.handle == "string" ? $(_opts.handle, this) : _opts.handle) : $(this);
			$.data(this, "draggable", {
				options: _opts,
				handle: _handle
			});
			if (_opts.disabled)
			{
				$(this).css("cursor", "");
				return;
			}
			_handle.unbind(".draggable").bind("mousemove.draggable", {
				target: this
			},
			function (e)
			{
				if ($.fn.draggable.isDragging)
				{
					return;
				}
				var _opts = $.data(e.data.target, "draggable").options;
				if (_mouseInner(e))
				{
					$(this).css("cursor", _opts.cursor);
				} else
				{
					$(this).css("cursor", "");
				}
			}).bind("mouseleave.draggable", {
				target: this
			},
			function (e)
			{
				$(this).css("cursor", "");
			}).bind("mousedown.draggable", {
				target: this
			}, _mousedownDraggable);
      function _mousedownDraggable(e)
			{
				if (_mouseInner(e) == false)
				{
					return;
				}
				var _opts = $.data(e.data.target, "draggable").options;
				$(this).css("cursor", "");
				var _position = $(e.data.target).position();
        var left=_position.left;
        var top=_position.top;
        if(_opts.position=="fixed")
        {
          left=left-$(window).scrollLeft();
          top=top-$(window).scrollTop();
        }
				var _offset = $(e.data.target).offset();
				var _opts1 = {
					startPosition: $(e.data.target).css("position"),
					startLeft: _position.left,
					startTop: _position.top,
					left: left,
					top: top,
					startX: e.pageX,
					startY: e.pageY,
					offsetWidth: (e.pageX - _offset.left),
					offsetHeight: (e.pageY - _offset.top),
					target: e.data.target,
					parent: $(e.data.target).parent()[0]
				};
				$.extend(e.data, _opts1);
				if (_opts.onBeforeDrag.call(e.data.target, e) == false)
				{
					return;
				}
				$(document).bind("mousedown.draggable", e.data, _docDownDraggable);
				$(document).bind("mousemove.draggable", e.data, _docMoveDraggable);
				$(document).bind("mouseup.draggable", e.data, _docUpDraggable);
			};
			function _mouseInner(e)
			{
				var _2a = $.data(e.data.target, "draggable");
				var _2b = _2a.handle;
				var _2c = $(_2b).offset();
				var _2d = $(_2b).outerWidth();
				var _2e = $(_2b).outerHeight();
				var t = e.pageY - _2c.top;
				var r = _2c.left + _2d - e.pageX;
				var b = _2c.top + _2e - e.pageY;
				var l = e.pageX - _2c.left;
				return Math.min(t, r, b, l) > _2a.options.edge;
			};
		});
	};
	$.fn.draggable.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "draggable").options;
		},
		proxy: function (jq)
		{
			return $.data(jq[0], "draggable").proxy;
		},
		enable: function (jq)
		{
			return jq.each(function ()
			{
				$(this).draggable({
					disabled: false
				});
			});
		},
		disable: function (jq)
		{
			return jq.each(function ()
			{
				$(this).draggable({
					disabled: true
				});
			});
		}
	};
	$.fn.draggable.parseOptions = function (_2f)
	{
		var t = $(_2f);
		return $.extend({},
		$.parser.parseOptions(_2f, ["cursor", "handle", "axis", {
			"revert": "boolean",
			"deltaX": "number",
			"deltaY": "number",
			"edge": "number"
		}]), {
			disabled: (t.attr("disabled") ? true : undefined)
		});
	};
	$.fn.draggable.defaults = {
    position:'absolute',
		proxy: null,
    proxyContainer: null, //拖动时对象所在容器
		revert: false,
		cursor: "move",
		deltaX: null,
		deltaY: null,
		handle: null,
		disabled: false,
		edge: 0,
		axis: null,
		onBeforeDrag: function (e) { },
		onStartDrag: function (e) { },
		onDrag: function (e) { },
		onStopDrag: function (e) { }
	};
	$.fn.draggable.isDragging = false;
})(jQuery);
(function ($)
{
	function _init(_target)
	{
		$(_target).addClass("droppable");
		$(_target).bind("_dragenter",
		function (e, _3)
		{
			$.data(_target, "droppable").options.onDragEnter.apply(_target, [e, _3]);
		});
		$(_target).bind("_dragleave",
		function (e, _4)
		{
			$.data(_target, "droppable").options.onDragLeave.apply(_target, [e, _4]);
		});
		$(_target).bind("_dragover",
		function (e, _5)
		{
			$.data(_target, "droppable").options.onDragOver.apply(_target, [e, _5]);
		});
		$(_target).bind("_drop",
		function (e, _source, eDocument)
		{
			$.data(_target, "droppable").options.onDrop.apply(_target, [e, _source, eDocument]);
		});
	};
	$.fn.droppable = function (_7, _8)
	{
		if (typeof _7 == "string")
		{
			return $.fn.droppable.methods[_7](this, _8);
		}
		_7 = _7 || {};
		return this.each(function ()
		{
			var _9 = $.data(this, "droppable");
			if (_9)
			{
				$.extend(_9.options, _7);
			} else
			{
				_init(this);
				$.data(this, "droppable", {
					options: $.extend({},
					$.fn.droppable.defaults, $.fn.droppable.parseOptions(this), _7)
				});
			}
		});
	};
	$.fn.droppable.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "droppable").options;
		},
		enable: function (jq)
		{
			return jq.each(function ()
			{
				$(this).droppable({
					disabled: false
				});
			});
		},
		disable: function (jq)
		{
			return jq.each(function ()
			{
				$(this).droppable({
					disabled: true
				});
			});
		}
	};
	$.fn.droppable.parseOptions = function (_a)
	{
		var t = $(_a);
		return $.extend({},
		$.parser.parseOptions(_a, ["accept"]), {
			disabled: (t.attr("disabled") ? true : undefined)
		});
	};
	$.fn.droppable.defaults = {
		accept: null,
		disabled: false,
		onDragEnter: function (e, _b) { },
		onDragOver: function (e, _c) { },
		onDragLeave: function (e, _d) { },
		onDrop: function (e, _e) { }
	};
})(jQuery);
(function ($)
{
	$.fn.resizable = function (_1, _2)
	{
		if (typeof _1 == "string")
		{
			return $.fn.resizable.methods[_1](this, _2);
		}
		function _3(e)
		{
			var _4 = e.data;
			var _5 = $.data(_4.target, "resizable").options;
			if (_4.dir.indexOf("e") != -1)
			{
				var _6 = _4.startWidth + e.pageX - _4.startX;
				_6 = Math.min(Math.max(_6, _5.minWidth), _5.maxWidth);
				_4.width = _6;
			}
			if (_4.dir.indexOf("s") != -1)
			{
				var _7 = _4.startHeight + e.pageY - _4.startY;
				_7 = Math.min(Math.max(_7, _5.minHeight), _5.maxHeight);
				_4.height = _7;
			}
			if (_4.dir.indexOf("w") != -1)
			{
				var _6 = _4.startWidth - e.pageX + _4.startX;
				_6 = Math.min(Math.max(_6, _5.minWidth), _5.maxWidth);
				_4.width = _6;
				_4.left = _4.startLeft + _4.startWidth - _4.width;
			}
			if (_4.dir.indexOf("n") != -1)
			{
				var _7 = _4.startHeight - e.pageY + _4.startY;
				_7 = Math.min(Math.max(_7, _5.minHeight), _5.maxHeight);
				_4.height = _7;
				_4.top = _4.startTop + _4.startHeight - _4.height;
			}
		};
		function _8(e)
		{
			var _9 = e.data;
			var t = $(_9.target);
			t.css({
				left: _9.left,
				top: _9.top
			});
			if (t.outerWidth() != _9.width)
			{
				t._outerWidth(_9.width);
			}
			if (t.outerHeight() != _9.height)
			{
				t._outerHeight(_9.height);
			}
		};
		function _a(e)
		{
			$.fn.resizable.isResizing = true;
			$.data(e.data.target, "resizable").options.onStartResize.call(e.data.target, e);
			return false;
		};
		function _b(e)
		{
			_3(e);
			if ($.data(e.data.target, "resizable").options.onResize.call(e.data.target, e) != false)
			{
				_8(e);
			}
			return false;
		};
		function _c(e)
		{
			$.fn.resizable.isResizing = false;
			_3(e, true);
			_8(e);
			$.data(e.data.target, "resizable").options.onStopResize.call(e.data.target, e);
			$(document).unbind(".resizable");
			$("body").css("cursor", "");
			return false;
		};
		return this.each(function ()
		{
			var _d = null;
			var _e = $.data(this, "resizable");
			if (_e)
			{
				$(this).unbind(".resizable");
				_d = $.extend(_e.options, _1 || {});
			} else
			{
				_d = $.extend({},
				$.fn.resizable.defaults, $.fn.resizable.parseOptions(this), _1 || {});
				$.data(this, "resizable", {
					options: _d
				});
			}
			if (_d.disabled == true)
			{
				return;
			}
			$(this).bind("mousemove.resizable", {
				target: this
			},
			function (e)
			{
				if ($.fn.resizable.isResizing)
				{
					return;
				}
				var _f = _10(e);
				if (_f == "")
				{
					$(e.data.target).css("cursor", "");
				} else
				{
					$(e.data.target).css("cursor", _f + "-resize");
				}
			}).bind("mouseleave.resizable", {
				target: this
			},
			function (e)
			{
				$(e.data.target).css("cursor", "");
			}).bind("mousedown.resizable", {
				target: this
			},
			function (e)
			{
				var dir = _10(e);
				if (dir == "")
				{
					return;
				}
				function _11(css)
				{
					var val = parseInt($(e.data.target).css(css));
					if (isNaN(val))
					{
						return 0;
					} else
					{
						return val;
					}
				};
				var _12 = {
					target: e.data.target,
					dir: dir,
					startLeft: _11("left"),
					startTop: _11("top"),
					left: _11("left"),
					top: _11("top"),
					startX: e.pageX,
					startY: e.pageY,
					startWidth: $(e.data.target).outerWidth(),
					startHeight: $(e.data.target).outerHeight(),
					width: $(e.data.target).outerWidth(),
					height: $(e.data.target).outerHeight(),
					deltaWidth: $(e.data.target).outerWidth() - $(e.data.target).width(),
					deltaHeight: $(e.data.target).outerHeight() - $(e.data.target).height()
				};
				$(document).bind("mousedown.resizable", _12, _a);
				$(document).bind("mousemove.resizable", _12, _b);
				$(document).bind("mouseup.resizable", _12, _c);
				$("body").css("cursor", dir + "-resize");
			});
			function _10(e)
			{
				var tt = $(e.data.target);
				var dir = "";
				var _13 = tt.offset();
				var _14 = tt.outerWidth();
				var _15 = tt.outerHeight();
				var _16 = _d.edge;
				if (e.pageY > _13.top && e.pageY < _13.top + _16)
				{
					dir += "n";
				} else
				{
					if (e.pageY < _13.top + _15 && e.pageY > _13.top + _15 - _16)
					{
						dir += "s";
					}
				}
				if (e.pageX > _13.left && e.pageX < _13.left + _16)
				{
					dir += "w";
				} else
				{
					if (e.pageX < _13.left + _14 && e.pageX > _13.left + _14 - _16)
					{
						dir += "e";
					}
				}
				var _state = _d.handles.split(",");
				for (var i = 0; i < _state.length; i++)
				{
					var _proxy = _state[i].replace(/(^\s*)|(\s*$)/g, "");
					if (_proxy == "all" || _proxy == dir)
					{
						return dir;
					}
				}
				return "";
			};
		});
	};
	$.fn.resizable.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "resizable").options;
		},
		enable: function (jq)
		{
			return jq.each(function ()
			{
				$(this).resizable({
					disabled: false
				});
			});
		},
		disable: function (jq)
		{
			return jq.each(function ()
			{
				$(this).resizable({
					disabled: true
				});
			});
		}
	};
	$.fn.resizable.parseOptions = function (_opts)
	{
		var t = $(_opts);
		return $.extend({},
		$.parser.parseOptions(_opts, ["handles", {
			minWidth: "number",
			minHeight: "number",
			maxWidth: "number",
			maxHeight: "number",
			edge: "number"
		}]), {
			disabled: (t.attr("disabled") ? true : undefined)
		});
	};
	$.fn.resizable.defaults = {
		disabled: false,
		handles: "n, e, s, w, ne, se, sw, nw, all",
		minWidth: 10,
		minHeight: 10,
		maxWidth: 10000,
		maxHeight: 10000,
		edge: 5,
		onStartResize: function (e) { },
		onResize: function (e) { },
		onStopResize: function (e) { }
	};
	$.fn.resizable.isResizing = false;
})(jQuery);
(function ($)
{

	function createButton(target)
	{
		var opts = $.data(target, 'linkbutton').options;
		var t = $(target);

		t.addClass('l-btn').removeClass('l-btn-plain l-btn-selected l-btn-plain-selected');
		if (opts.plain) { t.addClass('l-btn-plain') }
		if (opts.selected)
		{
			t.addClass(opts.plain ? 'l-btn-selected l-btn-plain-selected' : 'l-btn-selected');
		}
		t.attr('group', opts.group || '');
		t.attr('id', opts.id || '');
		t.html(
			'<span class="l-btn-left">' +
				'<span class="l-btn-text"></span>' +
			'</span>'
		);
		if (opts.text)
		{
			t.find('.l-btn-text').html(opts.text);
			if (opts.iconCls)
			{
				t.find('.l-btn-text').addClass(opts.iconCls).addClass(opts.iconAlign == 'left' ? 'l-btn-icon-left' : 'l-btn-icon-right');
			}
			if (opts.icon)
			{
				$(target).find(".l-btn-text").css(
        {
        	"padding-left": "20px",
        	"background": "url('/Scripts/RattanUI/themes/icons/" + opts.icon + "') no-repeat"
        });
			}
		} else
		{
			t.find('.l-btn-text').html('<span class="l-btn-empty">&nbsp;</span>');
			if (opts.iconCls)
			{
				t.find('.l-btn-empty').addClass(opts.iconCls);
			}
		}

		t.unbind('.linkbutton').bind('focus.linkbutton', function ()
		{
			if (!opts.disabled)
			{
				$(this).find('.l-btn-text').addClass('l-btn-focus');
			}
		}).bind('blur.linkbutton', function ()
		{
			$(this).find('.l-btn-text').removeClass('l-btn-focus');
		});
		if (opts.toggle && !opts.disabled)
		{
			t.bind('click.linkbutton', function ()
			{
				if (opts.selected)
				{
					$(this).linkbutton('unselect');
				} else
				{
					$(this).linkbutton('select');
				}
			});
		}

		setSelected(target, opts.selected)
		setDisabled(target, opts.disabled);
	}

	function setSelected(target, selected)
	{
		var opts = $.data(target, 'linkbutton').options;
		if (selected)
		{
			if (opts.group)
			{
				$('a.l-btn[group="' + opts.group + '"]').each(function ()
				{
					var o = $(this).linkbutton('options');
					if (o.toggle)
					{
						$(this).removeClass('l-btn-selected l-btn-plain-selected');
						o.selected = false;
					}
				});
			}
			$(target).addClass(opts.plain ? 'l-btn-selected l-btn-plain-selected' : 'l-btn-selected');
			opts.selected = true;
		} else
		{
			if (!opts.group)
			{
				$(target).removeClass('l-btn-selected l-btn-plain-selected');
				opts.selected = false;
			}
		}
	}

	function setDisabled(target, disabled)
	{
		var state = $.data(target, 'linkbutton');
		var opts = state.options;
		$(target).removeClass('l-btn-disabled l-btn-plain-disabled');
		if (disabled)
		{
			opts.disabled = true;
			var href = $(target).attr('href');
			if (href)
			{
				state.href = href;
				$(target).attr('href', 'javascript:void(0)');
			}
			if (target.onclick)
			{
				state.onclick = target.onclick;
				target.onclick = null;
			}
			opts.plain ? $(target).addClass('l-btn-disabled l-btn-plain-disabled') : $(target).addClass('l-btn-disabled');
		} else
		{
			opts.disabled = false;
			if (state.href)
			{
				$(target).attr('href', state.href);
			}
			if (state.onclick)
			{
				target.onclick = state.onclick;
			}
			if (state.options.onclick)
			{
				target.onclick = state.options.onclick;
			}
			if (state.options.handler)
			{
				target.onclick = state.options.handler;
			}
		}
	}

	$.fn.linkbutton = function (options, param)
	{
		if (typeof options == 'string')
		{
			return $.fn.linkbutton.methods[options](this, param);
		}

		options = options || {};
		return this.each(function ()
		{
			var state = $.data(this, 'linkbutton');
			if (state)
			{
				$.extend(state.options, options);
			} else
			{
				$.data(this, 'linkbutton', {
					options: $.extend({}, $.fn.linkbutton.defaults, $.fn.linkbutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
			}

			createButton(this);
		});
	};

	$.fn.linkbutton.methods = {
		options: function (jq)
		{
			return $.data(jq[0], 'linkbutton').options;
		},
		enable: function (jq)
		{
			return jq.each(function ()
			{
				setDisabled(this, false);
			});
		},
		disable: function (jq)
		{
			return jq.each(function ()
			{
				setDisabled(this, true);
			});
		},
		setDisabled: function (jq, _disabled)
		{  //by xtb
			return jq.each(function ()
			{
				setDisabled(this, _disabled);
			});
		},
		select: function (jq)
		{
			return jq.each(function ()
			{
				setSelected(this, true);
			});
		},
		unselect: function (jq)
		{
			return jq.each(function ()
			{
				setSelected(this, false);
			});
		}
	};

	$.fn.linkbutton.parseOptions = function (target)
	{
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target,
			['id', 'iconCls', 'iconAlign', 'group', { plain: 'boolean', toggle: 'boolean', selected: 'boolean'}]
		), {
			disabled: (t.attr('disabled') ? true : undefined),
			text: $.trim(t.html()),
			iconCls: (t.attr('icon') || t.attr('iconCls'))
		});
	};

	$.fn.linkbutton.defaults = {
		id: null,
		disabled: false,
		toggle: false,
		selected: false,
		group: null,
		plain: false,
		text: '',
		iconCls: null,
		iconAlign: 'left',
		onclick: null
	};
})(jQuery);
(function ($)
{
	function _1(_2)
	{
		$(_2).addClass("progressbar");
		$(_2).html("<div class=\"progressbar-text\"></div><div class=\"progressbar-value\"><div class=\"progressbar-text\"></div></div>");
		return $(_2);
	};
	function _3(_4, _5)
	{
		var _6 = $.data(_4, "progressbar").options;
		var _7 = $.data(_4, "progressbar").bar;
		if (_5)
		{
			_6.width = _5;
		}
		_7._outerWidth(_6.width)._outerHeight(_6.height);
		_7.find("div.progressbar-text").width(_7.width());
		_7.find("div.progressbar-text,div.progressbar-value").css({
			height: _7.height() + "px",
			lineHeight: _7.height() + "px"
		});
	};
	$.fn.progressbar = function (_8, _9)
	{
		if (typeof _8 == "string")
		{
			var _a = $.fn.progressbar.methods[_8];
			if (_a)
			{
				return _a(this, _9);
			}
		}
		_8 = _8 || {};
		return this.each(function ()
		{
			var _b = $.data(this, "progressbar");
			if (_b)
			{
				$.extend(_b.options, _8);
			} else
			{
				_b = $.data(this, "progressbar", {
					options: $.extend({},
					$.fn.progressbar.defaults, $.fn.progressbar.parseOptions(this), _8),
					bar: _1(this)
				});
			}
			$(this).progressbar("setValue", _b.options.value);
			_3(this);
		});
	};
	$.fn.progressbar.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "progressbar").options;
		},
		resize: function (jq, _c)
		{
			return jq.each(function ()
			{
				_3(this, _c);
			});
		},
		getValue: function (jq)
		{
			return $.data(jq[0], "progressbar").options.value;
		},
		setValue: function (jq, _d)
		{
			if (_d < 0)
			{
				_d = 0;
			}
			if (_d > 100)
			{
				_d = 100;
			}
			return jq.each(function ()
			{
				var _e = $.data(this, "progressbar").options;
				var _f = _e.text.replace(/{value}/, _d);
				var _10 = _e.value;
				_e.value = _d;
				$(this).find("div.progressbar-value").width(_d + "%");
				$(this).find("div.progressbar-text").html(_f);
				if (_10 != _d)
				{
					_e.onChange.call(this, _d, _10);
				}
			});
		}
	};
	$.fn.progressbar.parseOptions = function (_11)
	{
		return $.extend({},
		$.parser.parseOptions(_11, ["width", "height", "text", {
			value: "number"
		}]));
	};
	$.fn.progressbar.defaults = {
		width: "auto",
		height: 22,
		value: 0,
		text: "{value}%",
		onChange: function (_12, _13) { }
	};
})(jQuery);
(function ($)
{
	function _createPagination(_target)
	{
		var _state = $.data(_target, "pagination");
		var _opts = _state.options;
		var bb = _state.bb = {};
		var _ptable = $(_target).addClass("pagination").html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tr></tr></table>");
		var tr = _ptable.find("tr");
		function _getNav(_type)
		{
			var _navAction = _opts.nav[_type];
			var a = $("<a href=\"javascript:void(0)\"></a>").appendTo(tr);
			a.wrap("<td></td>");
			a.linkbutton({
				iconCls: _navAction.iconCls,
				plain: true
			}).unbind(".pagination").bind("click.pagination",
			function ()
			{
				_navAction.handler.call(_target);
			});
			return a;
		};
		if (_opts.showPageList)
		{
			var ps = $("<select class=\"pagination-page-list\"></select>");
			ps.bind("change",
			function ()
			{
				_opts.pageSize = parseInt($(this).val());
				_opts.onChangePageSize.call(_target, _opts.pageSize);
				_select(_target, _opts.pageNumber);
			});
			for (var i = 0; i < _opts.pageList.length; i++)
			{
				$("<option></option>").text(_opts.pageList[i]).appendTo(ps);
			}
			$("<td></td>").append(ps).appendTo(tr);
			$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
		}
		$('<td id="pagePilot"></td>').appendTo(tr);
		$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
		bb.first = _getNav("first");
		bb.prev = _getNav("prev");
		$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
		$("<span style=\"padding-left:6px;\"></span>").html(_opts.beforePageText).appendTo(tr).wrap("<td></td>");
		bb.num = $("<input class=\"pagination-num\" type=\"text\" value=\"1\" size=\"2\">").appendTo(tr).wrap("<td></td>");
		bb.num.unbind(".pagination").bind("keydown.pagination",
		function (e)
		{
			if (e.keyCode == 13)
			{
				var _9 = parseInt($(this).val()) || 1;
				_select(_target, _9);
				return false;
			}
		});
		bb.after = $("<span style=\"padding-right:6px;\"></span>").appendTo(tr).wrap("<td></td>");
		$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
		bb.next = _getNav("next");
		bb.last = _getNav("last");
		if (_opts.showRefresh)
		{
			$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
			bb.refresh = _getNav("refresh");
		}
		if (_opts.buttons)
		{
			$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
			if ($.isArray(_opts.buttons))
			{
				for (var i = 0; i < _opts.buttons.length; i++)
				{
					var _btnOpts = _opts.buttons[i];
					if (_btnOpts == "-")
					{
						$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
					} else
					{
						var td = $("<td></td>").appendTo(tr);
						var a = $("<a href=\"javascript:void(0)\"></a>").appendTo(td);
						a[0].onclick = eval(_btnOpts.handler ||
						function () { });
						a.linkbutton($.extend({},
						_btnOpts, {
							plain: true
						}));
					}
				}
			} else
			{
				var td = $("<td></td>").appendTo(tr);
				$(_opts.buttons).appendTo(td).show();
			}
		}
		$("<div class=\"pagination-info\"></div>").appendTo(_ptable);
		$("<div style=\"clear:both;\"></div>").appendTo(_ptable);
	};
	function _select(_target, _index)
	{
		var _e = $.data(_target, "pagination").options;
		_refresh(_target, {
			pageNumber: _index
		});
		_e.onSelectPage.call(_target, _e.pageNumber, _e.pageSize);
	};
	function _refresh(_target, _param)
	{
		var _state = $.data(_target, "pagination");
		var _opts = _state.options;
		var bb = _state.bb;
		$.extend(_opts, _param || {});
		var ps = $(_target).find("select.pagination-page-list");
		if (ps.length)
		{
			ps.val(_opts.pageSize + "");
			_opts.pageSize = parseInt(ps.val());
		}
		var _pageCount = Math.ceil(_opts.total / _opts.pageSize) || 1;
		if (_opts.pageNumber < 1)
		{
			_opts.pageNumber = 1;
		}
		if (_opts.pageNumber > _pageCount)
		{
			_opts.pageNumber = _pageCount;
		}
		bb.num.val(_opts.pageNumber);
		bb.after.html(_opts.afterPageText.replace(/{pages}/, _pageCount));
		var _msg = _opts.displayMsg;
		_msg = _msg.replace(/{from}/, _opts.total == 0 ? 0 : _opts.pageSize * (_opts.pageNumber - 1) + 1);
		_msg = _msg.replace(/{to}/, Math.min(_opts.pageSize * (_opts.pageNumber), _opts.total));
		_msg = _msg.replace(/{total}/, _opts.total);
		$(_target).find("div.pagination-info").html(_msg);

      var _pilot = _pagePilot(_target);
		//$("#pagePilot").html(_pilot);
		$(_target).find(".pagination-pagelink").unbind(".pagination").bind("click.pagination",
			function ()
			{
				var _pageNumber = parseInt($(this).text());
				_select(_target, _pageNumber);
			});

		bb.first.add(bb.prev).linkbutton({
			disabled: (_opts.pageNumber == 1)
		});
		bb.next.add(bb.last).linkbutton({
			disabled: (_opts.pageNumber == _pageCount)
		});
		_loaded(_target, _opts.loading);
	};
	function _pagePilot(_target)
	{
		/*var _opts = $.data(_target, "pagination").options;
		var _pageCount = Math.ceil(_opts.total / _opts.pageSize) || 1;

		var html = "";
		var _maxLink = _opts.maxLink;
		var _pageIndexFrom = _opts.pageNumber - parseInt(_maxLink / 2);
		if (_pageIndexFrom > (_pageCount - _maxLink + 1))
		{
			_pageIndexFrom = _pageCount - _maxLink + 1;
		};
		if (_pageIndexFrom < 1)
		{
			_pageIndexFrom = 1;
		};
		var _linkCount = _pageIndexFrom + _maxLink - 1;
		if (_linkCount > _pageCount)
		{
			_linkCount = _pageCount;
		};
		if (_pageIndexFrom > 1)
		{
			html += _renderPagePilotIndex(_target, 1);
			if (_pageIndexFrom > 2)
			{
				html += '<span class="pagination-omittedlink">...</span>';
			}
		};
		for (var i = _pageIndexFrom; i <= _linkCount; i++)
		{
			html += _renderPagePilotIndex(_target, i);
		};
		if (_linkCount < _pageCount)
		{
			if (_linkCount < _pageCount - 1)
			{
				html += '<span class="pagination-omittedlink">...</span>';
			};
			html += _renderPagePilotIndex(_target, _pageCount);
		}
		return html;*/
      return '';
	}
	function _renderPagePilotIndex(_target, _pageIndex)
	{
		var _opts = $.data(_target, "pagination").options;
		var className = 'pagination-pagelink';
		if (_pageIndex == _opts.pageNumber) className = 'pagination-currentpagelink';
		//if(_pageIndex==_opts.pageNumber)className='pagination-visitedpagelink';

		var label = '<span class="' + className + '">';
		label += _pageIndex;
		label += "</span>";

		return label;
	};
	function _loaded(_target, _param)
	{
		var _target = $.data(_target, "pagination");
		var _opts = _target.options;
		var bb = _target.bb;
		_opts.loading = _param;
		if (_opts.showRefresh)
		{
			_target.bb.refresh.linkbutton({
				iconCls: (_opts.loading ? "pagination-loading" : "pagination-load")
			});
		}
	};
	$.fn.pagination = function (_options, _param)
	{
		if (typeof _options == "string")
		{
			return $.fn.pagination.methods[_options](this, _param);
		}
		_options = _options || {};
		return this.each(function ()
		{
			var _1d;
			var _1e = $.data(this, "pagination");
			if (_1e)
			{
				_1d = $.extend(_1e.options, _options);
			} else
			{
				_1d = $.extend({},
				$.fn.pagination.defaults, $.fn.pagination.parseOptions(this), _options);
				$.data(this, "pagination", {
					options: _1d
				});
			}
			_createPagination(this);
			_refresh(this);
		});
	};
	$.fn.pagination.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "pagination").options;
		},
		loading: function (jq)
		{
			return jq.each(function ()
			{
				_loaded(this, true);
			});
		},
		loaded: function (jq)
		{
			return jq.each(function ()
			{
				_loaded(this, false);
			});
		},
		refresh: function (jq, _param)
		{
			return jq.each(function ()
			{
				_refresh(this, _param);
			});
		},
		select: function (jq, _param)
		{
			return jq.each(function ()
			{
				_select(this, _param);
			});
		}
	};
	$.fn.pagination.parseOptions = function (_target)
	{
		var t = $(_target);
		return $.extend({},
		$.parser.parseOptions(_target, [{
			total: "number",
			pageSize: "number",
			pageNumber: "number"
		},
		{
			loading: "boolean",
			showPageList: "boolean",
			showRefresh: "boolean"
		}]), {
			pageList: (t.attr("pageList") ? eval(t.attr("pageList")) : undefined)
		});
	};
	$.fn.pagination.defaults = {
		total: 1,
		pageSize: 10,
		pageNumber: 1,
		pageList: [10, 20, 30, 50],
		loading: false,
		buttons: null,
		showPageList: true,
		showRefresh: true,
		onSelectPage: function (_index, _opts) { },
		onBeforeRefresh: function (_24, _25) { },
		onRefresh: function (_26, _27) { },
		onChangePageSize: function (_28) { },
		beforePageText: "Page",
		afterPageText: "of {pages}",
		displayMsg: "Displaying {from} to {to} of {total} items",
		nav: {
			first: {
				iconCls: "pagination-first",
				handler: function ()
				{
					var _btnOpts = $(this).pagination("options");
					if (_btnOpts.pageNumber > 1)
					{
						$(this).pagination("select", 1);
					}
				}
			},
			prev: {
				iconCls: "pagination-prev",
				handler: function ()
				{
					var _btnOpts = $(this).pagination("options");
					if (_btnOpts.pageNumber > 1)
					{
						$(this).pagination("select", _btnOpts.pageNumber - 1);
					}
				}
			},
			next: {
				iconCls: "pagination-next",
				handler: function ()
				{
					var _btnOpts = $(this).pagination("options");
					var _2c = Math.ceil(_btnOpts.total / _btnOpts.pageSize);
					if (_btnOpts.pageNumber < _2c)
					{
						$(this).pagination("select", _btnOpts.pageNumber + 1);
					}
				}
			},
			last: {
				iconCls: "pagination-last",
				handler: function ()
				{
					var _btnOpts = $(this).pagination("options");
					var _2e = Math.ceil(_btnOpts.total / _btnOpts.pageSize);
					if (_btnOpts.pageNumber < _2e)
					{
						$(this).pagination("select", _2e);
					}
				}
			},
			refresh: {
				iconCls: "pagination-refresh",
				handler: function ()
				{
					var _btnOpts = $(this).pagination("options");
					if (_btnOpts.onBeforeRefresh.call(this, _btnOpts.pageNumber, _btnOpts.pageSize) != false)
					{
						$(this).pagination("select", _btnOpts.pageNumber);
						_btnOpts.onRefresh.call(this, _btnOpts.pageNumber, _btnOpts.pageSize);
					}
				}
			}
		},
		maxLink: 15  //最大页面数
	};
})(jQuery);
/**
 * "panel"
 */
(function($) {
	$.fn._remove = function() {
		return this.each(function() {
			$(this).remove();
			try {
				this.outerHTML = "";
			} catch(err) {}
		});
	};
	function _remove(_panel) {
		_panel._remove();
	};
	function _resize(_target, _param) {
		var _opts = $.data(_target, "panel").options;
		var _panel = $.data(_target, "panel").panel;
		var _pheader = _panel.children("div.panel-header");
		var _pbody = _panel.children("div.panel-body");
		if (_param) {
			if (_param.width) {
				_opts.width = _param.width;
			}
			if (_param.height) {
				_opts.height = _param.height;
			}
			if (_param.left != null) {
				_opts.left = _param.left;
			}
			if (_param.top != null) {
				_opts.top = _param.top;
			}
		}
		_opts.fit ? $.extend(_opts, _panel._fit()) : _panel._fit(false);
		_panel.css({
			left: _opts.left,
			top: _opts.top
		});
    if(_opts.panelMinWidth)
    {
      _panel.css({
        "min-width": _opts.panelMinWidth
      });
    }
    if(_opts.panelMinHeight)
    {
      _panel.css({
        "min-height": _opts.panelMinHeight
      });
    }
		if (!isNaN(_opts.width)) {
			_panel._outerWidth(_opts.width);
		} else {
			_panel.width("auto");
		}
		_pheader.add(_pbody)._outerWidth(_panel.width());
		if (!isNaN(_opts.height)) {
			_panel._outerHeight(_opts.height);
			_pbody._outerHeight(_panel.height() - _pheader._outerHeight());
		} else {
			_pbody.height("auto");
		}
		_panel.css("height", "");
		_opts.onResize.apply(_target, [_opts.width, _opts.height]);
		_panel.find(">div.panel-body>div").triggerHandler("_resize");
	};
	function _move(_target, _param) {
		var _opts = $.data(_target, "panel").options;
		var _panel = $.data(_target, "panel").panel;
		if (_param) {
			if (_param.left != null) {
				_opts.left = _param.left;
			}
			if (_param.top != null) {
				_opts.top = _param.top;
			}
		}
		_panel.css({
			left: _opts.left,
			top: _opts.top
		});
		_opts.onMove.apply(_target, [_opts.left, _opts.top]);
	};
	function _wrapPanel(_target) {
		$(_target).addClass("panel-body");
		var _panel = $("<div class=\"panel\"></div>").insertBefore(_target);
		_panel[0].appendChild(_target);
		_panel.bind("_resize",
		function() {
			var _opts = $.data(_target, "panel").options;
			if (_opts.fit == true) {
				_resize(_target);
			}
			return false;
		});
		return _panel;
	};
	function _addHeader(_target) {
		var _opts = $.data(_target, "panel").options;
		var _panel = $.data(_target, "panel").panel;
		if (_opts.tools && typeof _opts.tools == "string") {
			_panel.find(">div.panel-header>div.panel-tool .panel-tool-a").appendTo(_opts.tools);
		}
		_remove(_panel.children("div.panel-header"));
		if (_opts.title && !_opts.noheader) {
			var _header = $("<div class=\"panel-header\"><div class=\"panel-title\">" + _opts.title + "</div></div>").prependTo(_panel);
			if (_opts.iconCls) {
				_header.find(".panel-title").addClass("panel-with-icon");
				$("<div class=\"panel-icon\"></div>").addClass(_opts.iconCls).appendTo(_header);
			}
			var _tool = $("<div class=\"panel-tool\"></div>").appendTo(_header);
			_tool.bind("click",
			function(e) {
				e.stopPropagation();
			});
			if (_opts.tools) {
				if (typeof _opts.tools == "string") {
					$(_opts.tools).children().each(function() {
						$(this).addClass($(this).attr("iconCls")).addClass("panel-tool-a").appendTo(_tool);
					});
				} else {
					for (var i = 0; i < _opts.tools.length; i++) {
            var node = _opts.tools[i];
						var t = $("<a href=\"javascript:void(0)\"></a>").addClass(node.iconCls).appendTo(_tool);
            if (node.icon) {
              t.css(
              {
                width:"16px", 
                height:"16",
                "margin-left":"5px",
                "cursor":"pointer",
                "display":"block",
                "background":"url('/Scripts/RattanUI/themes/icons/"+node.icon+"') no-repeat"
              });
            }
						if (_opts.tools[i].handler) {
							t.bind("click", eval(_opts.tools[i].handler));
						}
					}
				}
			}
			if (_opts.collapsible) {
				$("<a class=\"panel-tool-collapse\" href=\"javascript:void(0)\"></a>").appendTo(_tool).bind("click",
				function() {
					if (_opts.collapsed == true) {
						_expand(_target, true);
					} else {
						_collapse(_target, true);
					}
					return false;
				});
			}
			if (_opts.minimizable) {
				$("<a class=\"panel-tool-min\" href=\"javascript:void(0)\"></a>").appendTo(_tool).bind("click",
				function() {
					_minimize(_target);
					return false;
				});
			}
			if (_opts.maximizable) {
				$("<a class=\"panel-tool-max\" href=\"javascript:void(0)\"></a>").appendTo(_tool).bind("click",
				function() {
					if (_opts.maximized == true) {
						_restore(_target);
					} else {
						_maximize(_target);
					}
					return false;
				});
			}
			if (_opts.closable) {
				$("<a class=\"panel-tool-close\" href=\"javascript:void(0)\"></a>").appendTo(_tool).bind("click",
				function() {
					_close(_target);
					return false;
				});
			}
			_panel.children("div.panel-body").removeClass("panel-body-noheader");
		} else {
			_panel.children("div.panel-body").addClass("panel-body-noheader");
		}
	};
	function _loadData(_target) {
		var _state = $.data(_target, "panel");
		var _opts = _state.options;
		if (_opts.href) {
			if (!_state.isLoaded || !_opts.cache) {
				if (_opts.onBeforeLoad.call(_target) == false) {
					return;
				}
				_state.isLoaded = false;
				_destroyCompment(_target);
				if (_opts.loadingMessage) {
					$(_target).html($("<div class=\"panel-loading\"></div>").html(_opts.loadingMessage));
				}
				$.ajax({
					url: _opts.href,
					cache: false,
					dataType: "html",
					success: function(_data) {
						_parse(_opts.extractor.call(_target, _data));
						_opts.onLoad.apply(_target, arguments);
						_state.isLoaded = true;
					}
				});
			}
		} else {
			if (_opts.content) {
				if (!_state.isLoaded) {
					_destroyCompment(_target);
					_parse(_opts.content);
					_state.isLoaded = true;
				}
			}
		}
		function _parse(_data) {
			$(_target).html(_data);
			if ($.parser) {
				$.parser.parse($(_target));
			}
		};
	};
	function _destroyCompment(_target) {
		var t = $(_target);
		t.find(".combo-f").each(function() {
			$(this).combo("destroy");
		});
		t.find(".m-btn").each(function() {
			$(this).menubutton("destroy");
		});
		t.find(".s-btn").each(function() {
			$(this).splitbutton("destroy");
		});
		t.find(".tooltipRattan-f").tooltipRattan("destroy");
	};
	function _triggerResize(_target) {
		$(_target).find("div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible").each(function() {
			$(this).triggerHandler("_resize", [true]);
		});
	};
	function _open(_target, _param) {
		var _opts = $.data(_target, "panel").options;
		var _panel = $.data(_target, "panel").panel;
		if (_param != true) {
			if (_opts.onBeforeOpen.call(_target) == false) {
				return;
			}
		}
		_panel.show();
		_opts.closed = false;
		_opts.minimized = false;
		var _2a = _panel.children("div.panel-header").find("a.panel-tool-restore");
		if (_2a.length) {
			_opts.maximized = true;
		}
		_opts.onOpen.call(_target);
		if (_opts.maximized == true) {
			_opts.maximized = false;
			_maximize(_target);
		}
		if (_opts.collapsed == true) {
			_opts.collapsed = false;
			_collapse(_target);
		}
		if (!_opts.collapsed) {
			_loadData(_target);
			_triggerResize(_target);
		}
	};
	function _close(_target, _param) {
		var _opts = $.data(_target, "panel").options;
		var _panel = $.data(_target, "panel").panel;
		if (_param != true) {
			if (_opts.onBeforeClose.call(_target) == false) {
				return;
			}
		}
		_panel._fit(false);
		_panel.hide();
		_opts.closed = true;
		_opts.onClose.call(_target);
	};
	function _destroy(_target, _param) {
		var _opts = $.data(_target, "panel").options;
		var _panel = $.data(_target, "panel").panel;
		if (_param != true) {
			if (_opts.onBeforeDestroy.call(_target) == false) {
				return;
			}
		}
		_destroyCompment(_target);
		_remove(_panel);
		_opts.onDestroy.call(_target);
	};
	function _collapse(_target, _param) {
		var _opts = $.data(_target, "panel").options;
		var _panel = $.data(_target, "panel").panel;
		var _body = _panel.children("div.panel-body");
		var _header = _panel.children("div.panel-header").find("a.panel-tool-collapse");
		if (_opts.collapsed == true) {
			return;
		}
		_body.stop(true, true);
		if (_opts.onBeforeCollapse.call(_target) == false) {
			return;
		}
		_header.addClass("panel-tool-expand");
		if (_param == true) {
			_body.slideUp("normal",
			function() {
				_opts.collapsed = true;
				_opts.onCollapse.call(_target);
			});
		} else {
			_body.hide();
			_opts.collapsed = true;
			_opts.onCollapse.call(_target);
		}
	};
	function _expand(_target, _param) {
		var _opts = $.data(_target, "panel").options;
		var _panel = $.data(_target, "panel").panel;
		var _body = _panel.children("div.panel-body");
		var _header = _panel.children("div.panel-header").find("a.panel-tool-collapse");
		if (_opts.collapsed == false) {
			return;
		}
		_body.stop(true, true);
		if (_opts.onBeforeExpand.call(_target) == false) {
			return;
		}
		_header.removeClass("panel-tool-expand");
		if (_param == true) {
			_body.slideDown("normal",
			function() {
				_opts.collapsed = false;
				_opts.onExpand.call(_target);
				_loadData(_target);
				_triggerResize(_target);
			});
		} else {
			_body.show();
			_opts.collapsed = false;
			_opts.onExpand.call(_target);
			_loadData(_target);
			_triggerResize(_target);
		}
	};
	function _maximize(_target) {
		var _opts = $.data(_target, "panel").options;
		var _panel = $.data(_target, "panel").panel;
		var _header = _panel.children("div.panel-header").find("a.panel-tool-max");
		if (_opts.maximized == true) {
			return;
		}
		_header.addClass("panel-tool-restore");
		if (!$.data(_target, "panel").original) {
			$.data(_target, "panel").original = {
				width: _opts.width,
				height: _opts.height,
				left: _opts.left,
				top: _opts.top,
				fit: _opts.fit
			};
		}
		_opts.left = 0;
		_opts.top = 0;
		_opts.fit = true;
		_resize(_target);
		_opts.minimized = false;
		_opts.maximized = true;
		_opts.onMaximize.call(_target);
	};
	function _minimize(_target) {
		var _opts = $.data(_target, "panel").options;
		var _panel = $.data(_target, "panel").panel;
		_panel._fit(false);
		_panel.hide();
		_opts.minimized = true;
		_opts.maximized = false;
		_opts.onMinimize.call(_target);
	};
	function _restore(_4c) {
		var _opts = $.data(_4c, "panel").options;
		var _panel = $.data(_4c, "panel").panel;
		var _header = _panel.children("div.panel-header").find("a.panel-tool-max");
		if (_opts.maximized == false) {
			return;
		}
		_panel.show();
		_header.removeClass("panel-tool-restore");
		$.extend(_opts, $.data(_4c, "panel").original);
		_resize(_4c);
		_opts.minimized = false;
		_opts.maximized = false;
		$.data(_4c, "panel").original = null;
		_opts.onRestore.call(_4c);
	};
	function _setBorder(_target) {
		var _opts = $.data(_target, "panel").options;
		var _panel = $.data(_target, "panel").panel;
		var _header = $(_target).panel("header");
		var _body = $(_target).panel("body");
		_panel.css(_opts.style);
		_panel.addClass(_opts.cls);
		if (_opts.border) {
			_header.removeClass("panel-header-noborder");
			_body.removeClass("panel-body-noborder");
		} else {
			_header.addClass("panel-header-noborder");
			_body.addClass("panel-body-noborder");
		}
		_header.addClass(_opts.headerCls);
		_body.addClass(_opts.bodyCls);
		_panel.children("div.panel-body").css(_opts.bodyStyle);
		if (_opts.id) {
			$(_target).attr("id", _opts.id);
		} else {
			$(_target).attr("id", "");
		}
	};
	function _setTitle(_target, _param) {
		$.data(_target, "panel").options.title = _param;
		$(_target).panel("header").find("div.panel-title").html(_param);
	};
	var m_resizeHandler = false;
	var m_resizeEnd = true;
	$(window).unbind(".panel").bind("resize.panel",
	function() {
		if (!m_resizeEnd) {
			return;
		}
		if (m_resizeHandler !== false) {
			clearTimeout(m_resizeHandler);
		}
		m_resizeHandler = setTimeout(function() {
			m_resizeEnd = false;
			var _bodylayout = $("body.layout");
			if (_bodylayout.length) {
				_bodylayout.layout("resize");
			} else {
				$("body").children("div.panel,div.accordion,div.tabs-container,div.layout").triggerHandler("_resize");
			}
			m_resizeEnd = true;
			m_resizeHandler = false;
		},
		200);
	});
	$.fn.panel = function(_options, _param) {
		if (typeof _options == "string") {
			return $.fn.panel.methods[_options](this, _param);
		}
		_options = _options || {};
		return this.each(function() {
			var _state = $.data(this, "panel");
			var _opts;
			if (_state) {
				_opts = $.extend(_state.options, _options);
				_state.isLoaded = false;
			} else {
				_opts = $.extend({},
				$.fn.panel.defaults, $.fn.panel.parseOptions(this), _options);
				$(this).attr("title", "");
				_state = $.data(this, "panel", {
					options: _opts,
					panel: _wrapPanel(this),
					isLoaded: false
				});
			}
      _loadData(this);  //by xtb
			_addHeader(this);
			_setBorder(this);
			if (_opts.doSize == true) {
				_state.panel.css("display", "block");
				_resize(this);
			}
			if (_opts.closed == true || _opts.minimized == true) {
				_state.panel.hide();
			} else {
				_open(this);
			}
      _opts.onAfterInit.call(this);
		});
	};
	$.fn.panel.methods = {
		options: function(jq) {
			return $.data(jq[0], "panel").options;
		},
		panel: function(jq) {
			return $.data(jq[0], "panel").panel;
		},
		header: function(jq) {
			return $.data(jq[0], "panel").panel.find(">div.panel-header");
		},
		body: function(jq) {
			return $.data(jq[0], "panel").panel.find(">div.panel-body");
		},
		setTitle: function(jq, _param) {
			return jq.each(function() {
				_setTitle(this, _param);
			});
		},
		open: function(jq, _param) {
			return jq.each(function() {
				_open(this, _param);
			});
		},
		close: function(jq, _param) {
			return jq.each(function() {
				_close(this, _param);
			});
		},
		destroy: function(jq, _param) {
			return jq.each(function() {
				_destroy(this, _param);
			});
		},
		refresh: function(jq, _param) {
			return jq.each(function() {
				$.data(this, "panel").isLoaded = false;
				if (_param) {
					$.data(this, "panel").options.href = _param;
				}
				_loadData(this);
			});
		},
		resize: function(jq, _param) {
			return jq.each(function() {
				_resize(this, _param);
			});
		},
		move: function(jq, _param) {
			return jq.each(function() {
				_move(this, _param);
			});
		},
		maximize: function(jq) {
			return jq.each(function() {
				_maximize(this);
			});
		},
		minimize: function(jq) {
			return jq.each(function() {
				_minimize(this);
			});
		},
		restore: function(jq) {
			return jq.each(function() {
				_restore(this);
			});
		},
		collapse: function(jq, _param) {
			return jq.each(function() {
				_collapse(this, _param);
			});
		},
		expand: function(jq, _param) {
			return jq.each(function() {
				_expand(this, _param);
			});
		}
	};
	$.fn.panel.parseOptions = function(_target) {
		var t = $(_target);
		return $.extend({},
		$.parser.parseOptions(_target, ["id", "width", "height", "left", "top", "title", "iconCls", "cls", "headerCls", "bodyCls", "tools", "href", "tools", "onAfterInit", {
			cache: "boolean",
			fit: "boolean",
			border: "boolean",
			noheader: "boolean"
		},
		{
			collapsible: "boolean",
			minimizable: "boolean",
			maximizable: "boolean"
		},
		{
			closable: "boolean",
			collapsed: "boolean",
			minimized: "boolean",
			maximized: "boolean",
			closed: "boolean"
		}]), {
			loadingMessage: (t.attr("loadingMessage") != undefined ? t.attr("loadingMessage") : undefined)
		});
	};
	$.fn.panel.defaults = {
		id: null,
		title: null,
		iconCls: null,
		width: "auto",
		height: "auto",
		left: null,
		top: null,
		cls: null,
		headerCls: null,
		bodyCls: null,
		style: {},
    bodyStyle: {},
		href: null,
		cache: true,
		fit: false,
		border: true,
		doSize: true,
		noheader: false,
		content: null,
		collapsible: false,
		minimizable: false,
		maximizable: false,
		closable: false,
		collapsed: false,
		minimized: false,
		maximized: false,
		closed: false,
		tools: '',
		href: null,
		loadingMessage: "Loading...",
		extractor: function(_69) {
			var _6a = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
			var _6b = _6a.exec(_69);
			if (_6b) {
				return _6b[1];
			} else {
				return _69;
			}
		},
		onBeforeLoad: function() {},
		onAfterInit: function() {},
		onLoad: function() {},
		onBeforeOpen: function() {},
		onOpen: function() {},
		onBeforeClose: function() {},
		onClose: function() {},
		onBeforeDestroy: function() {},
		onDestroy: function() {},
		onResize: function(_6c, _6d) {},
		onMove: function(_6e, top) {},
		onMaximize: function() {},
		onRestore: function() {},
		onMinimize: function() {},
		onBeforeCollapse: function() {},
		onBeforeExpand: function() {},
		onCollapse: function() {},
		onExpand: function() {}
	};
})(jQuery);
(function ($)
{
	function _resize(_target, _param)
	{
		var _state = $.data(_target, "window").options;
		if (_param)
		{
			if (_param.width)
			{
				_state.width = _param.width;
			}
			if (_param.height)
			{
				_state.height = _param.height;
			}
			if (_param.left != null)
			{
				_state.left = _param.left;
			}
			if (_param.top != null)
			{
				_state.top = _param.top;
			}
		}
		$(_target).panel("resize", _state);
	};
	function _move(_target, _opts)
	{
		var _state = $.data(_target, "window");
		if (_opts)
		{
			if (_opts.left != null)
			{
				_state.options.left = _opts.left;
			}
			if (_opts.top != null)
			{
				_state.options.top = _opts.top;
			}
		}
		$(_target).panel("move", _state.options);
		if (_state.shadow)
		{
			_state.shadow.css({
				left: _state.options.left,
				top: _state.options.top
			});
		}
	};
	function _createWindow(_target)
	{
		var _state = $.data(_target, "window");
		var _opts = _state.options;
		var _panel = $(_target).panel($.extend({},
		_state.options, {
			border: false,
			doSize: true,
			closed: true,
			cls: "window",
			headerCls: "window-header",
			bodyCls: "window-body " + (_state.options.noheader ? "window-body-noheader" : ""),
			onBeforeDestroy: function ()
			{
				if (_state.options.onBeforeDestroy.call(_target) == false)
				{
					return false;
				}
				if (_state.shadow)
				{
					_state.shadow.remove();
				}
				if (_state.mask)
				{
					_state.mask.remove();
				}
				if (_state.nomodalmask)
				{
					_state.nomodalmask.remove();
				}
			},
			onClose: function ()
			{
				if (_state.shadow)
				{
					_state.shadow.hide();
				}
				if (_state.mask)
				{
					_state.mask.hide();
				}
				_state.options.onClose.call(_target);
			},
			onOpen: function ()
			{
				if (_state.mask)
				{
					_state.mask.css({
						display: "block",
						zIndex: $.fn.window.defaults.zIndex++
					});
				}
				if (_state.shadow)
				{
					_state.shadow.css({
						display: "block",
						zIndex: $.fn.window.defaults.zIndex++,
						left: _state.options.left,
						top: _state.options.top,
						width: _state.windowBody.outerWidth(),
						height: _state.windowBody.outerHeight()
					});
				}
				_state.windowBody.css("z-index", $.fn.window.defaults.zIndex++);
				_state.options.onOpen.call(_target);
			},
			onResize: function (_width, _height)
			{
				var _f = $(_target).panel("options");
				_state.options.width = _f.width;
				_state.options.height = _f.height;
				_state.options.left = _f.left;
				_state.options.top = _f.top;
				if (_state.shadow)
				{
					_state.shadow.css({
						left: _state.options.left,
						top: _state.options.top,
						width: _state.windowBody.outerWidth(),
						height: _state.windowBody.outerHeight()
					});
				}
				_state.options.onResize.call(_target, _width, _height);
			},
			onMinimize: function ()
			{
				if (_state.shadow)
				{
					_state.shadow.hide();
				}
				if (_state.mask)
				{
					_state.mask.hide();
				}
				_state.options.onMinimize.call(_target);
			},
			onBeforeCollapse: function ()
			{
				if (_state.options.onBeforeCollapse.call(_target) == false)
				{
					return false;
				}
				if (_state.shadow)
				{
					_state.shadow.hide();
				}
			},
			onExpand: function ()
			{
				if (_state.shadow)
				{
					_state.shadow.show();
				}
				_state.options.onExpand.call(_target);
			}
		}));
		var win = $(_target).parent();
		win.css("position", _opts.position);
		_resize(_target, _state.options);
		_state.panel = _panel;
		_state.windowBody = _panel.panel("panel");
		if (_state.mask)
		{
			_state.mask.remove();
		}
		if (_state.options.modal == true)
		{
			_state.mask = $("<div class=\"window-mask\"></div>").insertAfter(_state.windowBody);
			_state.mask.css({
				width: (_state.options.inline ? _state.mask.parent().width() : _compatMode().width),
				height: (_state.options.inline ? _state.mask.parent().height() : _compatMode().height),
				display: "none"
			});
		}
		else
		{
			if (_state.nomodalmask) _state.nomodalmask.remove();
			_state.nomodalmask = $("<div class=\"window-nomodalmask\"></div>").insertAfter(_state.windowBody);
			_state.nomodalmask.css({
				width: (_state.options.inline ? _state.nomodalmask.parent().width() : _compatMode().width),
				height: (_state.options.inline ? _state.nomodalmask.parent().height() : _compatMode().height),
				display: "none"
			});
		}
		if (_state.shadow)
		{
			_state.shadow.remove();
		}
		if (_state.options.shadow == true)
		{
			_state.shadow = $("<div class=\"window-shadow\"></div>").insertAfter(_state.windowBody);
			_state.shadow.css({
				display: "none"
			});
		}
		if (_state.options.left == null)
		{
			var _width = _state.options.width;
			if (isNaN(_width))
			{
				_width = _state.windowBody.outerWidth();
			}
			if (_state.options.inline)
			{
				var _parent = _state.windowBody.parent();
				_state.options.left = _opts.position == "fixed" ? (_parent.width() - _width) / 2 : (_parent.width() - _width) / 2 + _parent.scrollLeft();
			} else
			{
			  _state.options.left = _opts.position == "fixed" ? ($(window).width() - _width) / 2 : ($(window).width() - _width) / 2 + $(document).scrollLeft();
			}
		}
		if (_state.options.top == null)
		{
			var _winHeight = _state.windowBody.height;
			if (isNaN(_winHeight))
			{
				_winHeight = _state.windowBody.outerHeight();
			}
			if (_state.options.inline)
			{
				var _parent = _state.windowBody.parent();
				_state.options.top = _opts.position == "fixed" ? (_parent.height() - _winHeight) / 2 : (_parent.height() - _winHeight) / 2 + _parent.scrollTop();
			} else
			{
			  _state.options.top = _opts.position == "fixed" ? ($(window).height() - _winHeight) / 2 : ($(window).height() - _winHeight) / 2 + $(document).scrollTop();
			}
		}
		_move(_target);
		if (_state.options.closed == false)
		{
			_panel.window("open");
		}
	};
	function _bindEvent(_target)
	{
	  var _state = $.data(_target, "window");
	  var _opts = _state.options;
	  _state.windowBody.draggable({
	    position: _opts.position,
			handle: ">div.panel-header>div.panel-title",
			disabled: _state.options.draggable == false,
			onStartDrag: function (e)
			{
				if (_state.options.modal)
				{
					_state.mask.css("z-index", $.fn.window.defaults.zIndex++);
				}
				else
				{
					_state.nomodalmask.css("z-index", $.fn.window.defaults.zIndex++).show();
				}
				if (_state.shadow)
				{
					_state.shadow.css("z-index", $.fn.window.defaults.zIndex++);
				}
				_state.windowBody.css("z-index", $.fn.window.defaults.zIndex++);
				if (!_state.proxy)
				{
					_state.proxy = $("<div class=\"window-proxy\"></div>").insertAfter(_state.windowBody);
				}
				_state.proxy.css({
				  position: _opts.position,
				  display: "none",
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top,
					width: ($.support.boxModel == true ? (_state.windowBody.outerWidth() - (_state.proxy.outerWidth() - _state.proxy.width())) : _state.windowBody.outerWidth()),
					height: ($.support.boxModel == true ? (_state.windowBody.outerHeight() - (_state.proxy.outerHeight() - _state.proxy.height())) : _state.windowBody.outerHeight())
				});
				setTimeout(function ()
				{
					if (_state.proxy)
					{
						_state.proxy.show();
					}
				},
				500);
			},
			onDrag: function (e)
			{
				_state.proxy.css({
					display: "block",
					left: e.data.left,
					top: e.data.top
				});
				return false;
			},
			onStopDrag: function (e)
			{
				_state.options.left = e.data.left;
				_state.options.top = e.data.top;
				var win = $(_target).parent();
				win.css("position", _opts.position);
				$(_target).window("move");
				if (_state.nomodalmask)
				{
					_state.nomodalmask.hide();
				}
				_state.proxy.remove();
				_state.proxy = null;
			}
		});
		_state.windowBody.resizable({
			disabled: _state.options.resizable == false,
			onStartResize: function (e)
			{
				if (!_state.options.modal)
				{
					_state.nomodalmask.css("z-index", $.fn.window.defaults.zIndex++).show();
				}
				_state.pmask = $("<div class=\"window-proxy-mask\"></div>").insertAfter(_state.windowBody);
				_state.pmask.css({
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top,
					width: _state.windowBody.outerWidth(),
					height: _state.windowBody.outerHeight()
				});
				if (!_state.proxy)
				{
				  _state.proxy = $("<div class=\"window-proxy\"></div>").insertAfter(_state.windowBody);
				}
				_state.proxy.css({
				  zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top,
					width: ($.support.boxModel == true ? (e.data.width - (_state.proxy.outerWidth() - _state.proxy.width())) : e.data.width),
					height: ($.support.boxModel == true ? (e.data.height - (_state.proxy.outerHeight() - _state.proxy.height())) : e.data.height)
				});
			},
			onResize: function (e)
			{
				_state.proxy.css({
					left: e.data.left,
					top: e.data.top,
					width: ($.support.boxModel == true ? (e.data.width - (_state.proxy.outerWidth() - _state.proxy.width())) : e.data.width),
					height: ($.support.boxModel == true ? (e.data.height - (_state.proxy.outerHeight() - _state.proxy.height())) : e.data.height)
				});
				return false;
			},
			onStopResize: function (e)
			{
				_state.options.left = e.data.left;
				_state.options.top = e.data.top;
				_state.options.width = e.data.width;
				_state.options.height = e.data.height;
				_resize(_target);
				if (_state.nomodalmask)
				{
					_state.nomodalmask.hide();
				}
				_state.pmask.remove();
				_state.pmask = null;
				_state.proxy.remove();
				_state.proxy = null;
			}
		});
	};
	function _compatMode()
	{
		if (document.compatMode == "BackCompat")
		{
			return {
				width: Math.max(document.body.scrollWidth, document.body.clientWidth),
				height: Math.max(document.body.scrollHeight, document.body.clientHeight)
			};
		} else
		{
			return {
				width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
				height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
			};
		}
	};
	$(window).resize(function ()
	{
		$("body>div.window-mask").css({
			width: $(window).width(),
			height: $(window).height()
		});
		setTimeout(function ()
		{
			$("body>div.window-mask").css({
				width: _compatMode().width,
				height: _compatMode().height
			});
		},
		50);
	});
	$.fn.window = function (_options, _param)
	{
		if (typeof _options == "string")
		{
			var _method = $.fn.window.methods[_options];
			if (_method)
			{
				return _method(this, _param);
			} else
			{
				return this.panel(_options, _param);
			}
		}
		_options = _options || {};
		var me = this.each(function ()
		{
			var _state = $.data(this, "window");
			if (_state)
			{
				$.extend(_state.options, _options);
			} else
			{
				_state = $.data(this, "window", {
					options: $.extend({},
					$.fn.window.defaults, $.fn.window.parseOptions(this), _options)
				});
				if (!_state.options.inline)
				{
					$(this).appendTo("body");
				}
			}
			_createWindow(this);
			_bindEvent(this);
		});

		$.each($.fn.window.methods, function (name, body)
		{
			me[name] = function (_param) { return body(me, _param); }
		});
		$.each($.fn.panel.methods, function (name, body)
		{
			if (name == "panel") return true;
			me[name] = function (_param) { return body(me, _param); }
		});

		_options.me = me;
		return me;
	};
	$.fn.window.methods = {
		options: function (jq)
		{
			var _panelOpts = jq.panel("options");
			var _opts = $.data(jq[0], "window").options;
			return $.extend(_opts, {
				closed: _panelOpts.closed,
				collapsed: _panelOpts.collapsed,
				minimized: _panelOpts.minimized,
				maximized: _panelOpts.maximized
			});
		},
		windowPanel: function (jq)
		{
			return $.data(jq[0], "window").panel;
		},
		windowBody: function (jq)
		{
			return $.data(jq[0], "window").windowBody;
		},
		resize: function (jq, _1d)
		{
			return jq.each(function ()
			{
				_resize(this, _1d);
			});
		},
		move: function (jq, _opts)
		{
			return jq.each(function ()
			{
				_move(this, _opts);
			});
		}
	};
	$.fn.window.parseOptions = function (_target)
	{
		var t = $(_target);
		return $.extend({},
		$.fn.panel.parseOptions(_target), {
			draggable: (t.attr("draggable") ? t.attr("draggable") == "true" : undefined),
			resizable: (t.attr("resizable") ? t.attr("resizable") == "true" : undefined),
			closed: (t.attr("closed") ? t.attr("closed") == "true" : undefined),
			shadow: (t.attr("shadow") ? t.attr("shadow") == "true" : undefined),
			modal: (t.attr("modal") ? t.attr("modal") == "true" : undefined),
			inline: (t.attr("inline") ? t.attr("inline") == "true" : undefined)
		});
	};
	$.fn.window.defaults = $.extend({},
	$.fn.panel.defaults, {
    position:'fixed',
		zIndex: 9000,
		draggable: true,
		resizable: true,
		shadow: false,
		modal: false,
		inline: false,
		title: "New Window",
		collapsible: true,
		minimizable: true,
		maximizable: true,
		closable: true,
		closed: false
	});
})(jQuery);
(function ($)
{
	function _1(_2)
	{
		var cp = document.createElement("div");
		while (_2.firstChild)
		{
			cp.appendChild(_2.firstChild);
		}
		_2.appendChild(cp);
		var _3 = $(cp);
		_3.attr("style", $(_2).attr("style"));
		$(_2).removeAttr("style").css("overflow", "hidden");
		_3.panel({
			border: false,
			doSize: false,
			bodyCls: "dialog-content"
		});
		return _3;
	};
	function _4(_5)
	{
		var _6 = $.data(_5, "dialog").options;
		var _7 = $.data(_5, "dialog").contentPanel;
		if (_6.toolbar)
		{
			if ($.isArray(_6.toolbar))
			{
				$(_5).find("div.dialog-toolbar").remove();
				var _8 = $("<div class=\"dialog-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(_5);
				var tr = _8.find("tr");
				for (var i = 0; i < _6.toolbar.length; i++)
				{
					var _9 = _6.toolbar[i];
					if (_9 == "-")
					{
						$("<td><div class=\"dialog-tool-separator\"></div></td>").appendTo(tr);
					} else
					{
						var td = $("<td></td>").appendTo(tr);
						var _a = $("<a href=\"javascript:void(0)\"></a>").appendTo(td);
						_a[0].onclick = eval(_9.handler ||
						function () { });
						_a.linkbutton($.extend({},
						_9, {
							plain: true
						}));
					}
				}
			} else
			{
				$(_6.toolbar).addClass("dialog-toolbar").prependTo(_5);
				$(_6.toolbar).show();
			}
		} else
		{
			$(_5).find("div.dialog-toolbar").remove();
		}
		if (_6.buttons)
		{
			if ($.isArray(_6.buttons))
			{
				$(_5).find("div.dialog-button").remove();
				var _b = $("<div class=\"dialog-button\"></div>").appendTo(_5);
				for (var i = 0; i < _6.buttons.length; i++)
				{
					var p = _6.buttons[i];
					var _c = $("<a href=\"javascript:void(0)\"></a>").appendTo(_b);
					if (p.handler)
					{
						_c[0].onclick = p.handler;
					}
					_c.linkbutton(p);
				}
			} else
			{
				$(_6.buttons).addClass("dialog-button").appendTo(_5);
				$(_6.buttons).show();
			}
		} else
		{
			$(_5).find("div.dialog-button").remove();
		}
		var _d = _6.href;
		var _e = _6.content;
		_6.href = null;
		_6.content = null;
		_7.panel({
			closed: _6.closed,
			cache: _6.cache,
			href: _d,
			content: _e,
			onLoad: function ()
			{
				if (_6.height == "auto")
				{
					$(_5).window("resize");
				}
				_6.onLoad.apply(_5, arguments);
			}
		});
		$(_5).window($.extend({},
		_6, {
			onOpen: function ()
			{
				if (_7.panel("options").closed)
				{
					_7.panel("open");
				}
				if (_6.onOpen)
				{
					_6.onOpen.call(_5);
				}
			},
			onResize: function (_f, _10)
			{
				var _11 = $(_5);
				_7.panel("panel").show();
				_7.panel("resize", {
					width: _11.width(),
					height: (_10 == "auto") ? "auto" : _11.height() - _11.children("div.dialog-toolbar")._outerHeight() - _11.children("div.dialog-button")._outerHeight()
				});
				if (_6.onResize)
				{
					_6.onResize.call(_5, _f, _10);
				}
			}
		}));
		_6.href = _d;
		_6.content = _e;
	};
	function _12(_13, _14)
	{
		var _15 = $.data(_13, "dialog").contentPanel;
		_15.panel("refresh", _14);
	};
	$.fn.dialog = function (_16, _state)
	{
		if (typeof _16 == "string")
		{
			var _proxy = $.fn.dialog.methods[_16];
			if (_proxy)
			{
				return _proxy(this, _state);
			} else
			{
				return this.window(_16, _state);
			}
		}
		_16 = _16 || {};
		return this.each(function ()
		{
			var _opts = $.data(this, "dialog");
			if (_opts)
			{
				$.extend(_opts.options, _16);
			} else
			{
				$.data(this, "dialog", {
					options: $.extend({},
					$.fn.dialog.defaults, $.fn.dialog.parseOptions(this), _16),
					contentPanel: _1(this)
				});
			}
			_4(this);
		});
	};
	$.fn.dialog.methods = {
		options: function (jq)
		{
			var _1a = $.data(jq[0], "dialog").options;
			var _1b = jq.panel("options");
			$.extend(_1a, {
				closed: _1b.closed,
				collapsed: _1b.collapsed,
				minimized: _1b.minimized,
				maximized: _1b.maximized
			});
			var _1c = $.data(jq[0], "dialog").contentPanel;
			return _1a;
		},
		dialog: function (jq)
		{
			return jq.window("window");
		},
		refresh: function (jq, _1d)
		{
			return jq.each(function ()
			{
				_12(this, _1d);
			});
		}
	};
	$.fn.dialog.parseOptions = function (_1e)
	{
		return $.extend({},
		$.fn.window.parseOptions(_1e), $.parser.parseOptions(_1e, ["toolbar", "buttons"]));
	};
	$.fn.dialog.defaults = $.extend({},
	$.fn.window.defaults, {
		title: "New Dialog",
		collapsible: false,
		minimizable: false,
		maximizable: false,
		resizable: false,
		toolbar: null,
		buttons: null
	});
})(jQuery);
/**
 * jQuery.columnmenu
 */
(function ($)
{
  function _createColumnMenu(_target)
  {
    var _opts = $.data(_target, "columnmenu").options;
    if (_opts.gridhandler.isLoadedColumnMenu) return;

    if (_opts.menuid)
    {
      $(_opts.menuid).menu({});
    }

    var datasetColumnMenu = [{ "ID": "=", "Name": "=" }, { "ID": ">=", "Name": ">=" }, { "ID": "<=", "Name": "<=" }, { "ID": "<>", "Name": "<>" }, { "ID": "like", "Name": "like" }];
    comboboxColumnMenu = {
      valueField: 'ID',
      textField: 'Name',
      data: datasetColumnMenu,
      required: false,
      editable: false,
      panelWidth: 80,
      panelHeight: 110,
      fixedWidth: true,
      onShowPanel: function ()
      {
        //var opts = $.data($(_opts.menuid)[0], "menu").options;
        //opts.isMenuShow=true;
      },
      onHidePanel: function ()
      {
        //var opts = $.data($(_opts.menuid)[0], "menu").options;
        //window.setTimeout(function(){opts.isMenuShow=false;}, 500);
      }
    };

    $('#txtOperator').combobox(comboboxColumnMenu);
    $('#txtOperator').combobox("setzIndex", 120000);
    $('#txtOperator').combobox("setValue", 'like');

    $('#txtDateFrom').datebox({ panelWidth: 180 });
    $('#txtDateTo').datebox({ panelWidth: 180 });
    $('#txtNumberFrom').numberbox();
    $('#txtNumberTo').numberbox();
    $("#txtColumnWidth").numberbox();
    _opts.gridhandler.isLoadedColumnMenu = true;
  }

  function _initColumnmenu(_target)
  {
    var _opts = $.data(_target, "columnmenu").options;
    var _jme = $(_target);

    $(_target).unbind(".columnmenu").bind("mouseenter.columnmenu",
		function ()
		{
		  var d = new Date();
		  var time = d.getTime();
		  var beforetime = _opts.gridhandler.showtime ? _opts.gridhandler.showtime : 0;
		  var sec = time - beforetime;

		  var opts = $.data($(_opts.menuid)[0], "menu").options;
		  if (sec / 1000 < 3)
		  {
		    _showMenu(_target);
		    _opts.gridhandler.showtime = time;
		  }
		  $(this).css("background-position", '-14px center');
		}).bind("mouseleave.datagrid",
		function ()
		{
		  $(this).css("background-position", 'left center');
		}).bind("click.datagrid",
		function (e)
		{
		  var d = new Date();
		  _opts.gridhandler.showtime = d.getTime();
		  _showMenu(_target);
		  e.stopPropagation();
		});

    $(document).click(function ()
    {
      $(_target).columnmenu('hideMenu');
    });
  };

  function _showMenu(_target)
  {
    var _opts = $.data(_target, "columnmenu").options;
    if (!_opts.menuid)
    {
      return;
    }
    var _jme = $(_target);
    $(_opts.menuid).menu({
      onShow: function ()
      {
        var opts = $.data($(_opts.menuid)[0], "menu").options;
        opts.isMenuShow = true;

        var td = _jme.parent().parent().addClass("datagrid-header-over");
        _jme.addClass("datagrid-columnmenu-over");
        td[0].isExpendMenu = true;
      },
      onHide: function ()
      {
        var opts = $.data($(_opts.menuid)[0], "menu").options;
        var td = _jme.parent().parent().removeClass("datagrid-header-over");
        _jme.removeClass("datagrid-columnmenu-over");
        td[0].isExpendMenu = false;
        opts.isMenuShow = false;
      }
    });
    var menuitem = $(_opts.menuid).menu("findItem", "顺序");
    $(menuitem.target).unbind(".columnmenu").bind("click.columnmenu", function (e)
    {
      var td = _jme.parent().parent().removeClass("datagrid-header-over");
      var fieldname = td.attr("field");
      var param = { sortName: fieldname, sortOrder: 'asc', columnmenu: _jme };
      if (_opts.gridhandler)
      {
        $(_opts.gridhandler).datagrid("orderBy", param);
      }
    });
    var menuitem = $(_opts.menuid).menu("findItem", "倒序");
    $(menuitem.target).unbind(".columnmenu").bind("click.columnmenu", function (e)
    {
      var td = _jme.parent().parent().removeClass("datagrid-header-over");
      var fieldname = td.attr("field");
      var param = { sortName: fieldname, sortOrder: 'desc', columnmenu: _jme };
      if (_opts.gridhandler)
      {
        $(_opts.gridhandler).datagrid("orderBy", param);
      }
    });

    var _left = _jme.offset().left;
    if (_left + $(_opts.menuid).outerWidth() + 5 > $(window).width())
    {
      _left = $(window).width() - $(_opts.menuid).outerWidth() - 5;
    }
    //$("body>div.menu-top").menu("hide");
    $(_opts.menuid).menu("show", {
      left: _left,
      top: _jme.offset().top + _jme.outerHeight()
    });
    _jme.blur();
    _jme.parent().parent()[0].isExpendMenu = true;	//td.isExpendMenu=true
    _setSuperSearch(_target);
  };

  function _setSuperSearch(_target)
  {
    var _opts = $.data(_target, "columnmenu").options;
    var _jme = $(_target);
    var td = _jme.parent().parent();
    var _fieldname = td.attr("field");
    var _columninfo = $(_opts.gridhandler).datagrid("getColumnOption", _fieldname);

    $("#columnOptionBox").hide();
    $("#columnPlanBox").hide();
    $("#menuBox").css({ height: 55 });
    switch (_columninfo.datatype)
    {
      case "Byte":
      case "Decimal":
      case "Double":
      case "Int16":
      case "Int32":
      case "Int64":
      case "Single":
        $("#textbox").hide();
        $("#datebox").hide();
        $("#numberbox").show();
        break;
      case "DateTime":
        $("#textbox").hide();
        $("#datebox").show();
        $("#numberbox").hide();
        $("#menuBox").css({ height: 75 });
        break;
      default:
        $("#textbox").show();
        $("#datebox").hide();
        $("#numberbox").hide();
        break;
    }

    //绑定下拉框
    if (_columninfo.combobox && _columninfo.searchType != 1) //searchType==1模糊查询
    {
      $("#textbox").hide();
      $("#datebox").hide();
      $("#numberbox").hide();
      $("#menuBox").css({ height: 155 });

      if (_columninfo.combobox.navbar)
      {
        $("#columnOptionBox").hide();
        $("#columnPlanBox").show();
        $("#menuBox").css({ height: 235 });
        var checkedvalue_navbar = td[0].checkedvalue_navbar;

        var _panel = $('#columnPlanBox').empty();
        var _header = $('<div class="combobox-nav-head"><ul></ul></div>').appendTo(_panel);
        $.each(_columninfo.combobox.navbar.data, function (i, item)
        {
          var li = $('<li>' + item.Name + '</li>').appendTo(_header.find('ul'));
          li.attr('value', item.ID);
          if (checkedvalue_navbar && checkedvalue_navbar.filterKey == item.Name)
          {
            li.addClass('selected');
          }
        });
        _header.find('ul li').click(function ()
        {
          _header.find('ul li').removeClass('selected');
          $(this).addClass('selected');
          var filterValue = $(this).attr("value");
          _filterData(_target, _columninfo.combobox, filterValue);
        });
        var _top = _panel.find('.combobox-nav-head').outerHeight();
        $('<div class="combobox-nav-boby"></div>').appendTo(_panel).css({ top: _top });
        _loadData(_target, _columninfo.combobox);
      }
      else
      {
        $("#columnOptionBox").show();
        $("#columnPlanBox").hide();

        var _colmenudata = [{
          "id": 0,
          "text": "全部",
          children: []
        }];
        //构建下拉框children数据
        var dataset = _columninfo.combobox.data;
        var valueField = _columninfo.combobox.valueField;
        var textField = _columninfo.combobox.textField;
        var _fieldname = td.attr("field");
        var _columninfo = $(_opts.gridhandler).datagrid("getColumnOption", _fieldname);
        var isString = true;
        switch (_columninfo.datatype)
        {
          case "Byte":
          case "Decimal":
          case "Double":
          case "Int16":
          case "Int32":
          case "Int64":
          case "Single":
            isString = false;
            break;
        }
        for (var i = 0; i < dataset.length; i++)
        {
          var checked = true;
          if (td[0].checkedvalue != undefined)	//是否选中
          {
            var v = isString ? "'" + dataset[i][textField] + "'" : dataset[i][textField];
            checked = td[0].checkedvalue.indexOf(v) >= 0;
          }
          var item = { id: dataset[i][valueField], text: dataset[i][textField], checked: checked };
          _colmenudata[0].children.push(item);
        }

        $('#columnOption').tree({
          animate: true,
          checkbox: true,
          data: _colmenudata,
          onClick: function (node)
          {
            $(this).tree('toggle', node.target);
          }
        });
      }

    }
    else
    {
      $("#columnOption").html('');
      $('#columnPlanBox .combobox-item-selected').removeClass('combobox-item-selected');
    }
    $(_opts.menuid + ' .confirm').unbind(".columnmenu").bind("click.columnmenu", function (e)
    {
      _getQuery(_target);
    });
    $(_opts.menuid + ' .cancel').unbind(".columnmenu").bind("click.columnmenu", function (e)
    {
      _cancel(_target);
    });

    $(_opts.menuid + ' .reset').unbind(".columnmenu").bind("click.columnmenu", function (e)
    {
      _reset(_target);
    });

    $("#txtOperator").val(td[0].operator ? td[0].operator : "like");
    $("#txtQuery").val(td[0].query);
    $("#txtDateFrom").val(td[0].datefrom);
    $("#txtDateTo").val(td[0].dateto);
    $("#txtNumberFrom").val(td[0].numberfrom);
    $("#txtNumberTo").val(td[0].numberto);


    $('#txtQuery,#txtDateFrom,#txtDateTo,#txtNumberFrom,#txtNumberTo').unbind(".columnmenu").bind("keydown.columnmenu", function (e)
    {
      if (e.keyCode != 13) return true;
      return _getQuery(_target);
    });

    //设置列宽
    $("#txtColumnWidth").numberbox('setValue', _columninfo.width).unbind(".columnmenu").bind("keydown.columnmenu", function (e)
    {
      if (e.keyCode != 13) return true;
      $(_opts.menuid + ' .setcolwidth').click();
      return false;
    });
    $(_opts.menuid + ' .setcolwidth').click(function (e)
    {
      var _width = $("#txtColumnWidth").val();
      if (!_width) { alert("请设置列宽！"); return; }
      var _width = parseInt(_width);
      $(_opts.gridhandler).datagrid("resizeColumnWidth", { fieldname: _fieldname, width: _width });
      $(_opts.menuid).menu("hide");
    });
  }

  //获得menucolumn查询条件
  function _getWhere(_target, _isClear)
  {
    var _opts = $.data(_target, "columnmenu").options;
    var _jme = $(_target);
    var td = _jme.parent().parent();

    var where = '';	//获得查询条件
    $("#" + _opts.gridhandler.id + "_mainHeaderInner td").each(function ()
    {
      var fieldname = $(this).attr("field");
      if (this.query != undefined && this.query != '')
      {
        if (where) where += " And ";
        switch (this.operator)
        {
          case "=":
          case ">=":
          case "<=":
          case "<>":
            where += fieldname + this.operator + "'" + this.query + "'";
            break;
          case "like":
            where += fieldname + ' ' + this.operator + " '%" + this.query + "%'";
            break;
        }
      }
      if (this.datefrom != undefined && this.datefrom != '')
      {
        if (where) where += " And ";
        where += fieldname + ">='" + this.datefrom + "'";
      }
      if (this.dateto != undefined && this.dateto != '')
      {
        if (where) where += " And ";
        where += fieldname + "<='" + this.dateto + "'";
      }
      if (this.numberfrom != undefined && this.numberfrom != '')
      {
        if (where) where += " And ";
        where += fieldname + ">=" + this.numberfrom;
      }
      if (this.numberto != undefined && this.numberto != '')
      {
        if (where) where += " And ";
        where += fieldname + "<=" + this.numberto;
      }
      if (this.checkedvalue != undefined && this.checkedvalue != '')
      {
        var col = $(_opts.gridhandler).datagrid("getColumnOption", fieldname);
        var idField = fieldname;
        if (where) where += " And ";
        where += idField + " in(" + this.checkedvalue.join(',') + ")";
      }
      if (this.checkedvalue_navbar != undefined && this.checkedvalue_navbar.navbarValues.length)
      {
        var col = $(_opts.gridhandler).datagrid("getColumnOption", fieldname);
        var idField = fieldname;
        if (where) where += " And ";
        where += idField + " in(" + this.checkedvalue_navbar.navbarValues.join(',') + ")";
      }
    });
    return where;
  }
  function _getQuery(_target, _isClear)
  {
    var _opts = $.data(_target, "columnmenu").options;
    var _jme = $(_target);
    var td = _jme.parent().parent();

    if (_isClear)
    {
      if (td[0].query != undefined) td[0].query = undefined;
      if (td[0].datefrom != undefined) td[0].datefrom = undefined;
      if (td[0].dateto != undefined) td[0].dateto = undefined;
      if (td[0].numberfrom != undefined) td[0].numberfrom = undefined;
      if (td[0].numberto != undefined) td[0].numberto = undefined;
      if (td[0].checkedvalue != undefined) td[0].checkedvalue = undefined;
      if (td[0].checkedvalue_navbar != undefined) td[0].checkedvalue_navbar = undefined;
    }
    else
    {
      var operator = $('#txtOperator').val();
      var query = $('#txtQuery').val();
      td[0].operator = operator;
      td[0].query = query.trim();

      var numberfrom = $('#txtNumberFrom').val();
      var numberto = $('#txtNumberTo').val();
      td[0].numberfrom = numberfrom;
      td[0].numberto = numberto;

      var datefrom = $('#txtDateFrom').val();
      var dateto = $('#txtDateTo').val();
      if (dateto) dateto += " 23:59:59";
      td[0].datefrom = datefrom;
      td[0].dateto = dateto;

      //获取选中下拉框数据
      var checkeditem = $('#columnOption').tree("getChecked");
      var checkedvalue = [];
      var checkedvalue_navbar = null;
      var _fieldname = td.attr("field");
      var _columninfo = $(_opts.gridhandler).datagrid("getColumnOption", _fieldname);
      var isString = true;
      switch (_columninfo.datatype)
      {
        case "Byte":
        case "Decimal":
        case "Double":
        case "Int16":
        case "Int32":
        case "Int64":
        case "Single":
          isString = false;
          break;
      }
      for (var i = 0; i < checkeditem.length; i++)
      {
        var v = isString ? "'" + checkeditem[i].text + "'" : checkeditem[i].id;
        checkedvalue.push(v);
      }
      td[0].checkedvalue = checkedvalue;

      if(checkedvalue && checkedvalue.length)
      {
        td[0].checkedvalue_navbar = null;
      }
      else
      {
        //获得navbar选中值
        var filterKey = $('#columnPlanBox .combobox-nav-head li.selected').text();
        var navbarValues = [];
        $('#columnPlanBox .combobox-item-selected').each(function ()
        {
          var v = $(this).text();
          var v = isString ? "'" + v + "'" : v;
          navbarValues.push(v);
        });
        checkedvalue_navbar = { filterKey: filterKey, navbarValues: navbarValues };
        td[0].checkedvalue_navbar = checkedvalue_navbar;
      }

      if (query == '' && numberfrom == '' && numberto == '' && datefrom == '' && dateto == '' && checkedvalue.join(',') == ''
      && (!checkedvalue_navbar || checkedvalue_navbar.navbarValues.join(',') == ''))
      {
        $(".datagrid-columnm-searchtip", td).removeClass("show");
      }
      else
      {
        $(".datagrid-columnm-searchtip", td).addClass("show");
      }
    }

    var _where = _getWhere(_target, _isClear);
    if (_opts.gridhandler)
    {
      $(_opts.gridhandler).datagrid('load', { where: _where });
    }
    $(_opts.menuid).menu("hide");
    return false;
  }

  function _cancel(_target)
  {
    var _opts = $.data(_target, "columnmenu").options;
    var _jme = $(_target);
    var td = _jme.parent().parent();

    $("#txtQuery").val('');
    $("#txtDateFrom").val('');
    $("#txtDateTo").val('');
    $("#txtNumberFrom").val('');
    $("#txtNumberTo").val('');
    var node = $('#columnOption').tree("find", 0);
    if (node) $('#columnOption').tree("check", node.target);
    $(".datagrid-columnm-searchtip", td).removeClass("show");
    $('#columnPlanBox .combobox-nav-head li.selected').removeClass('selected');
    $('#columnPlanBox .combobox-item-selected').removeClass('combobox-item-selected');

    _getQuery(_target, true);
    $(_opts.menuid).menu("hide");
  }

  function _reset(_target)
  {
    var _opts = $.data(_target, "columnmenu").options;
    var _jme = $(_target);
    var td = _jme.parent().parent();

    $("#" + _opts.gridhandler.id + "_mainHeaderInner td").each(function ()
    {
      if (this.query != undefined) this.query = undefined;
      if (this.datefrom != undefined) this.datefrom = undefined;
      if (this.dateto != undefined) this.dateto = undefined;
      if (this.numberfrom != undefined) this.numberfrom = undefined;
      if (this.numberto != undefined) this.numberto = undefined;
      if (this.checkedvalue != undefined) this.checkedvalue = undefined;
      if (this.checkedvalue_navbar != undefined) this.checkedvalue_navbar = undefined;
      $(".datagrid-columnm-searchtip", td).removeClass("show");
    });
    if (_opts.gridhandler) $(_opts.gridhandler).datagrid('load', { where: '' });
    $(_opts.menuid).menu("hide");
  }
  function _filterData(_target, _comboOpts, filterValue)
  {
    _comboOpts.navbar.filterValue = filterValue;
    _loadData(_target, _comboOpts);
  }
  function _loadData(_target, _comboOpts)
  {
    var _opts = $.data(_target, "columnmenu").options;
    var _jme = $(_target);
    var td = _jme.parent().parent();
    var checkedvalue_navbar = td[0].checkedvalue_navbar;
    var _fieldname = td.attr("field");
    var _columninfo = $(_opts.gridhandler).datagrid("getColumnOption", _fieldname);
    var isString = true;
    switch (_columninfo.datatype)
    {
      case "Byte":
      case "Decimal":
      case "Double":
      case "Int16":
      case "Int32":
      case "Int64":
      case "Single":
        isString = false;
        break;
    }

    var _panel = $('#columnPlanBox');
    var _filterdata = _comboOpts.data;
    _panel.find('.combobox-nav-boby').empty();
    if (_comboOpts.navbar.filterKey && _comboOpts.navbar.filterValue !== null && _comboOpts.navbar.filterValue !== undefined)
    {
      _filterdata = _comboOpts.data.findAll(_comboOpts.navbar.filterKey, _comboOpts.navbar.filterValue);
    }
    for (var i = 0; i < _filterdata.length; i++)
    {
      var v = _filterdata[i][_comboOpts.valueField];
      var _text = _filterdata[i][_comboOpts.textField];
      var _item = null;
      _item = $("<div class=\"combobox-item combobox-nav-item\"></div>").appendTo(_panel.find('.combobox-nav-boby'));
      if (_comboOpts.navbar.itemWidth)
      {
        _item.css({ width: _comboOpts.navbar.itemWidth, overflow: 'hidden' });
      }
      _item.attr("value", v);
      _item.html(_text);
      if (checkedvalue_navbar && checkedvalue_navbar.navbarValues.length)
      {
        var fText = _text;
        if (isString) fText = "'" + fText + "'";
        if (checkedvalue_navbar.navbarValues.find(fText))
        {
          _item.addClass('combobox-item-selected');
        }
      }
    }
    $(".combobox-item", _panel).hover(function ()
    {
      $(this).addClass("combobox-item-hover");
    },
		function ()
		{
		  $(this).removeClass("combobox-item-hover");
		}).click(function (e)
		{
		  var _item = $(this);
		  if (_item.hasClass('combobox-item-selected'))
		  {
		    _item.removeClass('combobox-item-selected');
		  }
		  else
		  {
		    _item.addClass('combobox-item-selected');
		  }
		  e.stopPropagation();
		});
  };

  $.fn.columnmenu = function (_options, _param)
  {
    if (typeof _options == "string")
    {
      return $.fn.columnmenu.methods[_options](this, _param);
    }
    _options = _options || {};
    var me = this.each(function ()
    {
      var _state = $.data(this, "columnmenu");
      if (_state)
      {
        $.extend(_state.options, _options);
      } else
      {
        $.data(this, "columnmenu", {
          options: $.extend({},
					$.fn.columnmenu.defaults, $.fn.columnmenu.parseOptions(this), _options)
        });
        $(this).removeAttr("disabled");
      }
      _createColumnMenu(this);
      _initColumnmenu(this);
    });

    $.each($.fn.columnmenu.methods, function (name, body)
    {
      me[name] = function (_param) { return body(me, _param); }
    });
    _options.me = me;
    return me;
  };
  $.fn.columnmenu.methods = {
    options: function (jq)
    {
      return $.data(jq[0], "columnmenu").options;
    },
    enable: function (jq)
    {
      return jq.each(function ()
      {
        _enable(this, false);
      });
    },
    disable: function (jq)
    {
      return jq.each(function ()
      {
        _enable(this, true);
      });
    },
    isExpendMenu: function (jq)
    {
      var td = jq.parent().parent();
      return td[0].isExpendMenu;
    },
    hideMenu: function (jq)
    {
      var _opts = $.data(jq[0], "columnmenu").options;
      return $(_opts.menuid).menu("hide");
    },
    getWhere: function (jq)
    {
      return _getWhere(jq[0]);
    }
  };
  $.fn.columnmenu.parseOptions = function (_target)
  {
    var t = $(_target);
    return $.extend({}, {});
  };
  $.fn.columnmenu.defaults = $.extend({},
	{
	  plain: true,
	  menuid: '#columnmenuid',
	  duration: 100,
	  showable: false,
	  gridhandler: null
	});
})(jQuery);

/**
 * jQuery.validatebox
 */
(function($) {
	function _init(_target) {
		$(_target).addClass("validatebox-text");
	};
	function _destroy(_target) {
		var _state = $.data(_target, "validatebox");
		_state.validating = false;
		var _tip = _state.tip;
		if (_tip) {
			_tip.remove();
		}
		$(_target).unbind();
		$(_target).remove();
	};
	function _bindEvents(_target) {
		var _box = $(_target);
		var _state = $.data(_target, "validatebox");
		_state.validating = false;
		_box.unbind(".validatebox").bind("focus.validatebox",
		function() {
			_state.validating = true;
			_state.value = undefined; (function() {
				if (_state.validating) {
					if (_state.value != _box.val()) {
						_state.value = _box.val();
						_validate(_target);
					}
					setTimeout(arguments.callee, 200);
				}
			})();
		}).bind("blur.validatebox",
		function() {
			_state.validating = false;
			_hideTip(_target);
		}).bind("mouseenter.validatebox",
		function() {
			if (_box.hasClass("validatebox-invalid")) {
				_showTip(_target);
			}
		}).bind("mouseleave.validatebox",
		function() {
			_hideTip(_target);
		});
	};
	function _showTip(_target) {
		var _box = $(_target);
		var _message = $.data(_target, "validatebox").message;
		var tip = $.data(_target, "validatebox").tip;
		if (!tip) {
			tip = $("<div class=\"validatebox-tip\">" + "<span class=\"validatebox-tip-content\">" + "</span>" + "<span class=\"validatebox-tip-pointer\">" + "</span>" + "</div>").appendTo("body");
			$.data(_target, "validatebox").tip = tip;
		}
		tip.find(".validatebox-tip-content").html(_message);
		tip.css({
			left: _box.offset().left + _box.outerWidth(),
			top: _box.offset().top
		});
		tip.show();
	};
	function _hideTip(_target) {
		var tip = $.data(_target, "validatebox").tip;
		if (tip) {
			tip.remove();
			$.data(_target, "validatebox").tip = null;
		}
	};
	function _validate(_target) {
		var _opts = $.data(_target, "validatebox").options;
		var tip = $.data(_target, "validatebox").tip;
		var box = $(_target);
		var _value = box.val();
		if(_target.jme && _target.jme.hasClass("combo-text") && !_target.jme.hasClass("combotree-f"))
		{
			_value=_target.jme.combobox("getValue");
		}
		function _setTipMessage(msg) {
			$.data(_target, "validatebox").message = msg;
		};
		var _disabled = box.attr("disabled");
		if (_disabled == true || _disabled == "true") {
			return true;
		}
		if (_opts.required) {
			if (_value === "" || _value===null) {
				box.addClass("validatebox-invalid");
				_setTipMessage(_opts.missingMessage);
				_showTip(_target);
				return false;
			}
		}
		if (_opts.validType) {
			var _result = /([a-zA-Z_]+)(.*)/.exec(_opts.validType);
			if(_opts.validType=="regular")
			{
				var _rule = _opts.rules[_opts.validType];
				if (!_rule["validator"](_value, _opts.validParam)) 
				{
					box.addClass("validatebox-invalid");
					var _message = _rule["message"];
					if (_param) {
						for (var i = 0; i < _param.length; i++) {
							_message = _message.replace(new RegExp("\\{" + i + "\\}", "g"), _param[i]);
						}
					}
					_setTipMessage(_opts.invalidMessage || _message);
					_showTip(_target);
					return false;
				}
			}
			else
			{
				var _rule = _opts.rules[_result[1]];
				if (_value && _rule) {
					var _param = eval(_result[2]);
					if (!_rule["validator"](_value, _param)) {
						box.addClass("validatebox-invalid");
						var _message = _rule["message"];
						if (_param) {
							for (var i = 0; i < _param.length; i++) {
								_message = _message.replace(new RegExp("\\{" + i + "\\}", "g"), _param[i]);
							}
						}
						_setTipMessage(_opts.invalidMessage || _message);
						_showTip(_target);
						return false;
					}
				}
			}
		}
		box.removeClass("validatebox-invalid");
		_hideTip(_target);
		return true;
	};
	$.fn.validatebox = function(_options, _param) {
		if (typeof _options == "string") {
			return $.fn.validatebox.methods[_options](this, _param);
		}
		_options = _options || {};
		return this.each(function() {
			var _state = $.data(this, "validatebox");
			if (_state) {
				$.extend(_state.options, _options);
			} else {
				_init(this);
				$.data(this, "validatebox", {
					options: $.extend({},
					$.fn.validatebox.defaults, $.fn.validatebox.parseOptions(this), _options)
				});
			}
			_bindEvents(this);
		});
	};
	$.fn.validatebox.methods = {
		destroy: function(jq) {
			return jq.each(function() {
				_destroy(this);
			});
		},
		validate: function(jq) {
			return jq.each(function() {
				_validate(this);
			});
		},
		isValid: function(jq) {
			return _validate(jq[0]);
		}
	};
	$.fn.validatebox.parseOptions = function(_target) {
		var t = $(_target);
		return {
			required: (t.attr("required") ? (t.attr("required") == "required" || t.attr("required") == "true" || t.attr("required") == true) : undefined),
			validType: (t.attr("validType") || undefined),
			missingMessage: (t.attr("missingMessage") || undefined),
			invalidMessage: (t.attr("invalidMessage") || undefined)
		};
	};
	$.fn.validatebox.defaults = {
		required: false,
		validType: null,
		validParam:null,
		missingMessage: "This field is required.",
		invalidMessage: null,
		rules: {
			email: {
				validator: function(_1f) {
					return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(_1f);
				},
				message: "Please enter a valid email address."
			},
			url: {
				validator: function(_20) {
					return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(_20);
				},
				message: "Please enter a valid URL."
			},
			length: {
				validator: function(_value, _param) {
					var len = $.trim(_value).length;
					return len >= _param[0] && len <= _param[1];
				},
				message: "Please enter a value between {0} and {1}."
			},
			remote: {
				validator: function(_value, _param) {
					var _params = {};
					_params[_param[1]] = _value;
					var _result = $.ajax({
						url: _param[0],
						dataType: "json",
						data: _params,
						async: false,
						cache: false,
						type: "post"
					}).responseText;
					return _result == "true";
				},
				message: "Please fix this field."
			},
			regular: {
				validator: function(_value, _express) {
					return _express.test(_value);
				},
				message: "输入合法有效数据。"
			}
		}
	};
})(jQuery);
/*v1.3.4*/
(function ($)
{
	function _initNumberbox(_target)
	{
		$(_target).addClass("numberbox-f");
    $(_target).removeAttr("disabled");
    $(_target).css({
      imeMode: "disabled"
    });
		/*var v = $("<input type=\"hidden\">").insertAfter(_target);
		var _name = $(_target).attr("name");
		if (_name)
		{
			v.attr("name", _name);
			$(_target).removeAttr("name").attr("numberboxName", _name);
		}
		return v;*/
	};
	function _initValue(_target)
	{
		var _opts = $.data(_target, "numberbox").options;
		var fn = _opts.onChange;
		_opts.onChange = function () { };
		_setValue(_target, _opts.parser.call(_target, _opts.value));
		_opts.onChange = fn;
		_opts.originalValue = _getValue(_target);
	};
	function _getValue(_target)
	{
		var _state = $.data(_target, "numberbox");
		return _state.factValue;
	};
	function _setValue(_target, _value)
	{
		var _state = $.data(_target, "numberbox");
		var _opts = _state.options;
		var _oldValue = _getValue(_target);
		_value = _opts.parser.call(_target, _value);
		_opts.value = _value;
		_state.factValue =_value;
		$(_target).val(_opts.formatter.call(_target, _value));
		if (_oldValue != _value)
		{
			_opts.onChange.call(_target, _value, _oldValue);
		}
	};
	function _bindEvent(_target)
	{
		var _opts = $.data(_target, "numberbox").options;
		$(_target).unbind(".numberbox").bind("keypress.numberbox",
		function (e)
		{
			return _opts.filter.call(_target, e);
		}).bind("blur.numberbox",
		function ()
		{
			_setValue(_target, $(this).val());
			$(this).val(_opts.formatter.call(_target, _getValue(_target)));
		}).bind("focus.numberbox",
		function ()
		{
			var vv = _getValue(_target);
			if (vv != _opts.parser.call(_target, $(this).val()))
			{
				$(this).val(_opts.formatter.call(_target, vv));
			}
		});
	};
	function _initValidatebox(_target)
	{
		if ($.fn.validatebox)
		{
			var _opts = $.data(_target, "numberbox").options;
			$(_target).validatebox(_opts);
		}
	};
	function _disable(_target, _param)
	{
		var _opts = $.data(_target, "numberbox").options;
		if (_param)
		{
			_opts.disabled = true;
			$(_target).attr("disabled", true);
		} else
		{
			_opts.disabled = false;
			$(_target).removeAttr("disabled");
		}
	};
	$.fn.numberbox = function (_options, _param)
	{
		if (typeof _options == "string")
		{
			var _method = $.fn.numberbox.methods[_options];
			if (_method)
			{
				return _method(this, _param);
			} else
			{
				return this.validatebox(_options, _param);
			}
		}
		_options = _options || {};
		var jme=this;
		var me = this.each(function ()
		{
			this.jme=jme;
			var _state = $.data(this, "numberbox");
			if (_state)
			{
				$.extend(_state.options, _options);
			} else
			{
				_state = $.data(this, "numberbox", {
					options: $.extend({},
					$.fn.numberbox.defaults, $.fn.numberbox.parseOptions(this), _options),
					factValue: null /*by xtb 真是数据*/
				});
        _initNumberbox(this);
			}
			_disable(this, _state.options.disabled);
			_bindEvent(this);
			_initValidatebox(this);
			_initValue(this);
		});

    $.each($.fn.numberbox.methods, function (name, body)
    {
      me[name] = function () 
      {
        var args = Array.prototype.slice.call(arguments);
        return body.apply($.fn.numberbox.methods, [me].concat(args)); 
      }
    });

    _options.me = me;
    return me;
  };
	$.fn.numberbox.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "numberbox").options;
		},
		destroy: function (jq)
		{
			return jq.each(function ()
			{
				//$.data(this, "numberbox").factValue.remove();
				$(this).validatebox("destroy");
				$(this).remove();
			});
		},
		disable: function (jq)
		{
			return jq.each(function ()
			{
				_disable(this, true);
			});
		},
		enable: function (jq)
		{
			return jq.each(function ()
			{
				_disable(this, false);
			});
		},
		fix: function (jq)
		{
			return jq.each(function ()
			{
				_setValue(this, $(this).val());
			});
		},
		setValue: function (jq, _value)
		{
			return jq.each(function ()
			{
				_setValue(this, _value);
			});
		},
		getValue: function (jq)
		{
			return _getValue(jq[0]);
		},
		clear: function (jq)
		{
			return jq.each(function ()
			{
				var _state = $.data(this, "numberbox");
				_state.factValue=null;
				$(this).val("");
			});
		},
		reset: function (jq)
		{
			return jq.each(function ()
			{
				var _opts = $(this).numberbox("options");
				$(this).numberbox("setValue", _opts.originalValue);
			});
		}
	};
	$.fn.numberbox.parseOptions = function (_target)
	{
		var t = $(_target);
		return $.extend({},
		$.fn.validatebox.parseOptions(_target), $.parser.parseOptions(_target, ["decimalSeparator", "groupSeparator", "suffix", {
			min: "number",
			max: "number",
			precision: "number"
		}]), {
			prefix: (t.attr("prefix") ? t.attr("prefix") : undefined),
			disabled: (t.attr("disabled") ? true : undefined),
			value: (t.val() || undefined)
		});
	};
	$.fn.numberbox.defaults = $.extend({},
	$.fn.validatebox.defaults, {
		disabled: false,
		value: "",
		min: null,
		max: null,
		precision: 0,
		decimalSeparator: ".",
		groupSeparator: "",
		prefix: "",
		suffix: "",
		filter: function (e)
		{
			var _target = $(this).numberbox("options");
			if (e.which == 45)
			{
				return ($(this).val().indexOf("-") == -1 ? true : false);
			}
			var c = String.fromCharCode(e.which);
			if (c == _target.decimalSeparator)
			{
				return ($(this).val().indexOf(c) == -1 ? true : false);
			} else
			{
				if (c == _target.groupSeparator)
				{
					return true;
				} else
				{
					if ((e.which >= 48 && e.which <= 57 && e.ctrlKey == false && e.shiftKey == false) || e.which == 0 || e.which == 8)
					{
						return true;
					} else
					{
						if (e.ctrlKey == true && (e.which == 99 || e.which == 118))
						{
							return true;
						} else
						{
							return false;
						}
					}
				}
			}
		},
		formatter: function (_value)
		{
			if (!_value)
			{
				return _value;
			}
			_value = _value + "";
			var _opts = $(this).numberbox("options");
			var _preValue = _value,
			_pointValue = "";
			var _dot = _value.indexOf(".");
			if (_dot >= 0)
			{
				_preValue = _value.substring(0, _dot);
				_pointValue = _value.substring(_dot + 1, _value.length);
			}
			if (_opts.groupSeparator)
			{
				var p = /(\d+)(\d{3})/;
				while (p.test(_preValue))
				{
					_preValue = _preValue.replace(p, "$1" + _opts.groupSeparator + "$2");
				}
			}
			if (_pointValue)
			{
				return _opts.prefix + _preValue + _opts.decimalSeparator + _pointValue + _opts.suffix;
			} else
			{
				return _opts.prefix + _preValue + _opts.suffix;
			}
		},
		parser: function (s)
		{
			s = s + "";
			var _opts = $(this).numberbox("options");
			if (parseFloat(s) != s)
			{
				if (_opts.prefix)
				{
					s = $.trim(s.replace(new RegExp("\\" + $.trim(_opts.prefix), "g"), ""));
				}
				if (_opts.suffix)
				{
					s = $.trim(s.replace(new RegExp("\\" + $.trim(_opts.suffix), "g"), ""));
				}
				if (_opts.groupSeparator)
				{
					s = $.trim(s.replace(new RegExp("\\" + _opts.groupSeparator, "g"), ""));
				}
				if (_opts.decimalSeparator)
				{
					s = $.trim(s.replace(new RegExp("\\" + _opts.decimalSeparator, "g"), "."));
				}
				s = s.replace(/\s/g, "");
			}
			var val = parseFloat(s).toFixed(_opts.precision);
			if (isNaN(val))
			{
				val = "";
			} else
			{
				if (typeof (_opts.min) == "number" && val < _opts.min)
				{
					val = _opts.min.toFixed(_opts.precision);
				} else
				{
					if (typeof (_opts.max) == "number" && val > _opts.max)
					{
						val = _opts.max.toFixed(_opts.precision);
					}
				}
			}
			return val;
		},
		onChange: function (_target, _value) { }
	});
})(jQuery);
(function ($)
{
	function _onBeforeOpen(el, _showType, _showSpeed, _timeout)
	{
		var _win = $(el).window("windowBody");
		if (!_win)
		{
			return;
		}
		switch (_showType)
		{
			case null:
				_win.show();
				break;
			case "slide":
				_win.slideDown(_showSpeed);
				break;
			case "fade":
				_win.fadeIn(_showSpeed);
				break;
			case "show":
				_win.show(_showSpeed);
				break;
		}
		var _timehandler = null;
		if (_timeout > 0)
		{
			_timehandler = setTimeout(function ()
			{
				_onBeforeClose(el, _showType, _showSpeed);
			},
			_timeout);
		}
		_win.hover(function ()
		{
			if (_timehandler)
			{
				clearTimeout(_timehandler);
			}
		},
		function ()
		{
			if (_timeout > 0)
			{
				_timehandler = setTimeout(function ()
				{
					_onBeforeClose(el, _showType, _showSpeed);
				},
				_timeout);
			}
		});
	};
	function _onBeforeClose(el, _showType, _showSpeed)
	{
		if (el.locked == true)
		{
			return;
		}
		el.locked = true;
		var _win = $(el).window("windowBody");
		if (!_win)
		{
			return;
		}
		switch (_showType)
		{
			case null:
				_win.hide();
				break;
			case "slide":
				_win.slideUp(_showSpeed);
				break;
			case "fade":
				_win.fadeOut(_showSpeed);
				break;
			case "show":
				_win.hide(_showSpeed);
				break;
		}
		setTimeout(function ()
		{
			$(el).window("destroy");
		},
		_showSpeed);
	};
	function _createWindow(_title, _content, _eventList)
	{
		var _msgBody = $("<div class=\"messager-body\"></div>").appendTo("body");
		_msgBody.append(_content);
		if (_eventList)
		{
			var tb = $("<div class=\"messager-button\"></div>").appendTo(_msgBody);
			for (var _event in _eventList)
			{
				$("<a></a>").attr("href", "javascript:void(0)").text(_event).css("margin-left", 10).bind("click", eval(_eventList[_event])).appendTo(tb).linkbutton();
			}
		}
		_msgBody.window({
			title: _title,
			noheader: (_title ? false : true),
			width: 350,
			height: "auto",
			modal: true,
			collapsible: false,
			minimizable: false,
			maximizable: false,
			resizable: false,
			onClose: function ()
			{
				setTimeout(function ()
				{
					_msgBody.window("destroy");
				},
				100);
			}
		});

		_msgBody.window("windowBody").addClass("messager-window");
		return _msgBody;
	};
	$.messager = {
	    showWindowAuto: function (_op, width, height, title, color) {
	        var _options = {};
	        if (typeof (_op) == "string") _options = { msg: _op };
	        else _options = _op;

	        if (!isNaN(width)) _options.width = width;
	        if (!isNaN(height)) _options.height = height;
	        if (title) _options.title = title;
	        if (color) _options.color = color;

	        var _opts = $.extend({
	            width: 720,
	            height: 100,
	            msg: "",
	            title: "消息提示",
	            color: 'red',
	            fontBold: false,
	            modal: true,
	            timeout: 4000,
	            collapsible: false,
	            minimizable: false,
	            maximizable: false,
	            shadow: false,
	            draggable: true,
	            resizable: true,
	            closed: false,
	            bodyCss: { "font-size": "40px", "line-height": "60px", "font-family": "微软雅黑", "text-align": "center" }
	        }, _options || {});
	        var win = null;
	        if (_opts.msg.length > 17 && _opts.height == 100) {
	            var linecount = Math.ceil(_opts.msg.length / 17);
	            _opts.height = 100 + (linecount * 50);
	            _opts.bodyCss = { "font-size": "40px", "line-height": "60px", "font-family": "微软雅黑", "text-align": "left" };
	        }
	        
	        if (typeof (_opts.msg) == "string") win = $("<div class=\"messager-body\"></div>").html(_opts.msg).appendTo("body");
	        else win = $("<div class=\"messager-body\"></div>").append(_opts.msg).appendTo("body");
	        win.css(_opts.bodyCss);
	        if (_opts.color) win.css({ "color": _opts.color });
	        if (_opts.fontBold) win.css({ "font-weight": "bold" });
	        win.window(_opts);
	        win.window("open");
	        return win;
	    },
		showWindow: function (_op, width, height, title, color)
		{
			var _options = {};
			if (typeof (_op) == "string") _options = { msg: _op };
			else _options = _op;

			if (!isNaN(width)) _options.width = width;
			if (!isNaN(height)) _options.height = height;
			if (title) _options.title = title;
			if (color) _options.color = color;

			var _opts = $.extend({
				width: 720,
				height: 100,
				msg: "",
				title: "消息提示",
				color: 'red',
				fontBold: false,
			    modal: true,
				timeout: 4000,
				collapsible: false,
				minimizable: false,
				maximizable: false,
				shadow: false,
				draggable: true,
				resizable: true,
				closed: false,
				bodyCss: { "font-size": "40px", "line-height": "60px", "font-family": "微软雅黑", "text-align":"center" }
			}, _options || {});
			var win = null;
			if (_opts.msg.length > 17 && _opts.height == 100) {
			    var linecount = Math.ceil(_opts.msg.length / 17);
			    _opts.height = 100 + (linecount * 50);
			    _opts.bodyCss = { "font-size": "40px", "line-height": "60px", "font-family": "微软雅黑", "text-align": "left" };
			}
			var len = _opts.msg.split("<br />").length;
			if (_opts.height > 150 && len > 1) {
			    if (len > 10) len = 10;
			    _opts.height = 30 + (45 * len);
			    _opts.bodyCss = { "font-size": "40px", "line-height": "45px", "font-family": "微软雅黑", "text-align": "left" };
			}
			if (typeof (_opts.msg) == "string") win = $("<div class=\"messager-body\"></div>").html(_opts.msg).appendTo("body");
			else win = $("<div class=\"messager-body\"></div>").append(_opts.msg).appendTo("body");
			win.css(_opts.bodyCss);
			if (_opts.color) win.css({ "color": _opts.color });
			if (_opts.fontBold) win.css({ "font-weight": "bold" });
			win.window(_opts);
			win.window("open");
			return win;
		},
		showWin: function (_op, width, height, title, color) {
		    var _options = {};
		    if (typeof (_op) == "string") _options = { msg: _op };
		    else _options = _op;

		    if (!isNaN(width)) _options.width = width;
		    if (!isNaN(height)) _options.height = height;
		    if (title) _options.title = title;
		    if (color) _options.color = color;

		    var _opts = $.extend({
		        width: 360,
		        height: 120,
		        msg: "",
		        title: "消息提示",
		        color: 'red',
		        fontBold: true,
		        modal: true,
		        timeout: 4000,
		        collapsible: false,
		        minimizable: false,
		        maximizable: false,
		        shadow: false,
		        draggable: true,
		        resizable: true,
		        closed: false,
		        bodyCss: { "font-size": "14px", "line-height": "30px", "word-break": "break-all", "word-wrap":"break-word" }
		    }, _options || {});
		    var win = null;
		    if (typeof (_opts.msg) == "string") win = $("<div class=\"messager-body\"></div>").html(_opts.msg).appendTo("body");
		    else win = $("<div class=\"messager-body\"></div>").append(_opts.msg).appendTo("body");
		    win.css(_opts.bodyCss);
		    if (_opts.color) win.css({ "color": _opts.color });
		    if (_opts.fontBold) win.css({ "font-weight": "bold" });
		    win.window(_opts);
		    win.window("open");
		    return win;
		},
		showConfirm: function (_op, width, height, onConfirm, title, modal, color)
		{
			var _options = {};
			if (typeof (_op) == "string") _options = { msg: _op };
			else _options = _op;

			if (!isNaN(width)) _options.width = width;
			if (!isNaN(height)) _options.height = height;
			if (title) _options.title = title;
			if (color) _options.color = color;
			if (typeof (onConfirm) == "function") _options.onConfirm = onConfirm;
			if (modal) _options.modal = !!modal;

			var _opts = $.extend({
				width: 500,
				height: 260,
				msg: "",
				title: "提示",
				color: 'black',
				fontBold: false,
				timeout: 4000,
				collapsible: false,
				minimizable: false,
				maximizable: false,
				shadow: false,
				draggable: true,
				resizable: true,
				closed: true,
				onConfirm: function (e) { },
				bodyCss: { 'position': 'relative' },
				contentCss: {}
			}, _options || {});
			var win = null;
			var html = '<div class="content" style="top:0px; bottom:44px; left:0px; right:0px; position:absolute;\
           overflow:auto; font-size:14px; padding: 0px; background: #fff;">\
        </div>\
        <div class="bottomregion" style="bottom: 0px; left: 0px; right: 0px; position: absolute; border-top: 1px solid #dadee5;\
          background-color: #f6f6f6; text-align: right; height: 30px; padding-top: 8px; padding-right: 10px;\
          padding-bottom: 5px;">\
          <div class="leftregion" style="float: left; height: 24px; width: auto; margin-top: 5px; margin-left: 5px;">\
          </div>\
          <div style="float: right; height: 24px; margin-top: 2px; margin-right: 20px;">\
            <input type="button" value="确定" class="button confirm" style="width: 80px;">&nbsp;&nbsp;\
            <input type="button" value="关闭" class="button closebtn" style="width: 80px;">\
          </div>\
        </div>';
			win = $("<div class=\"messager-body\"></div>").html(html).appendTo("body").css(_opts.bodyCss);
			win.find(".content").html(_opts.msg);
			win.find(".confirm").unbind().click(function (e)
			{
				_opts.onConfirm(e);
			});
			win.find(".closebtn").click(function (e)
			{
				win.close();
			});
			if (_opts.color) win.css({ "color": _opts.color });
			if (_opts.fontBold) win.css({ "font-weight": "bold" });

			win.window(_opts);
			win.window("open");
			win.setTitle = function (title)
			{
				win.window("windowPanel").panel("setTitle", title);
			}
			win.setContent = function (content)
			{
				win.find(".content").html(content);
			}
			win.appendContent = function (content)
			{
				win.find(".content").append(content);
			}
			win.setContentCss = function (css)
			{
				win.find(".content").css(css);
			}
			win.setOnConfirm = function (callback)
			{
				win.find(".confirm").unbind().click(function (e)
				{
					callback(e);
				});
			}
			win.setLeftContent = function (content)
			{
				win.find(".leftregion").html(content);
			}
			return win;
		},
		showAlert: function (_op, width, height, onConfirm, title, color)
		{
			var _options = {};
			if (typeof (_op) == "string") _options = { msg: _op };
			else _options = _op;

			if (!isNaN(width)) _options.width = width;
			if (!isNaN(height)) _options.height = height;
			if (title) _options.title = title;
			if (color) _options.color = color;
			if (typeof (onConfirm) == "function") _options.onConfirm = onConfirm;

			var _opts = $.extend({
				width: 500,
				height: 260,
				msg: "",
				title: "提示",
				color: 'black',
				fontBold: false,
				timeout: 4000,
				collapsible: false,
				minimizable: false,
				maximizable: false,
				shadow: false,
				draggable: true,
				resizable: true,
				closed: true,
				onConfirm: function (e) { },
				bodyCss: { 'position': 'relative' },
        bodyStyle:{"padding":"0px"}
			}, _options || {});
			var win = null;
			var html = '<div class="content" style="top:0px; bottom:42px; left:0px; right:0px; position:absolute;\
           overflow:auto; font-size:14px; padding: 0px; background: #fff;">\
        </div>\
        <div style="bottom: 0px; left: 0px; right: 0px; position: absolute; border-top: 1px solid #dadee5;\
          background-color: #f6f6f6; text-align: right; height: 30px; padding-top: 8px; padding-right: 10px;\
          padding-bottom: 5px;">\
          <div style="float: left; height: 24px; width: auto; margin-top: 10px; margin-left: 2px;">\
          </div>\
          <div style="float: right; height: 24px; margin-top: 2px; margin-right: 20px;">\
            <input type="button" value="关闭" class="button close" style="width: 80px;">\
          </div>\
        </div>';
			win = $("<div class=\"messager-body\"></div>").html(html).appendTo("body").css(_opts.bodyCss);
			win.find(".content").html(_opts.msg);
			win.find(".confirm").unbind().click(function (e)
			{
				_opts.onConfirm(e);
			});
			win.find(".close").click(function (e)
			{
				win.close();
			});
			if (_opts.color) win.css({ "color": _opts.color });
			if (_opts.fontBold) win.css({ "font-weight": "bold" });

			win.window(_opts);
			win.window("open");
			win.setTitle = function (title)
			{
				win.window("windowPanel").panel("setTitle", title);
			}
			win.setContent = function (content)
			{
				win.find(".content").html(content);
			}
			win.setOnConfirm = function (callback)
			{
				win.find(".confirm").unbind().click(function (e)
				{
					callback(e);
				});
			}
			win.destroy = function (content)
			{
				_onBeforeClose(this);
			}
			return win;
		},
		show: function (_op, color)
		{
			var _options = {};
			if (typeof (_op) == "string") _options = { msg: _op };
			else _options = _op;

			if (color) _options.color = color;

			var _opts = $.extend({
				showType: "slide",
				showSpeed: 600,
				width: 300,
				height: 'auto',
				msg: "",
				title: "提示",
				timeout: 4000,
				color: 'blue',
				fontBold: true,
				draggable: false,
				resizable: false
			},
			_options || {});
			var win = null;
			if (typeof (_opts.msg) == "string") win = $("<div class=\"messager-body\"></div>").html(_opts.msg).appendTo("body");
			else win = $("<div class=\"messager-body\"></div>").append(_opts.msg).appendTo("body");
			if (_opts.color) win.css({ "color": _opts.color });
			if (_opts.fontBold) win.css({ "font-weight": "bold" });
			win.window({
				title: _opts.title,
				width: _opts.width,
				height: _opts.height,
				collapsible: false,
				minimizable: false,
				maximizable: false,
				shadow: false,
				draggable: _opts.draggable,
				resizable: _opts.resizable,
				closed: true,
				onBeforeOpen: function ()
				{
					_onBeforeOpen(this, _opts.showType, _opts.showSpeed, _opts.timeout);
					return false;
				},
				onBeforeClose: function ()
				{
					_onBeforeClose(this, _opts.showType, _opts.showSpeed);
					return false;
				}
			});
			var bottom = -document.body.scrollTop - document.documentElement.scrollTop;
			if (win.window("windowBody").css('position') == "fixed")
			{
			  bottom = 0;
			}
			win.window("windowBody").css({
				left: "",
				top: "",
				right: 0,
				zIndex: $.fn.window.defaults.zIndex++,
				bottom: bottom
			});
			win.window("open", {
				left: "",
				top: ""
			});
			return win;
		},
		alert: function (_title, msg, _icon, fn)
		{
			var _content = "<div>" + msg + "</div>";
			switch (_icon)
			{
				case "error":
					_content = "<div class=\"messager-icon messager-error\"></div>" + _content;
					break;
				case "info":
					_content = "<div class=\"messager-icon messager-info\"></div>" + _content;
					break;
				case "question":
					_content = "<div class=\"messager-icon messager-question\"></div>" + _content;
					break;
				case "warning":
					_content = "<div class=\"messager-icon messager-warning\"></div>" + _content;
					break;
			}
			_content += "<div style=\"clear:both;\"/>";
			var _eventList = {};
			_eventList[$.messager.defaults.ok] = function ()
			{
				win.dialog({
					closed: true
				});
				if (fn)
				{
					fn();
					return false;
				}
			};
			_eventList[$.messager.defaults.cancel] = function ()
			{
				win.window("close");
				if (fn)
				{
					fn(false);
					return false;
				}
			};
			var win = _createWindow(_title, _content, _eventList);
			return win;
		},
		confirm: function (_title, msg, fn)
		{
			var _content = "<div class=\"messager-icon messager-question\"></div>" + "<div style='font-size:14px;font-weight:bold;line-height:1.5;color:blue;'>" + msg + "</div>" + "<div style=\"clear:both;\"/>";
			var _eventList = {};
			_eventList[$.messager.defaults.ok] = function ()
			{
				win.window("close");
				if (fn)
				{
					fn(true);
					return false;
				}
			};
			_eventList[$.messager.defaults.cancel] = function ()
			{
				win.window("close");
				if (fn)
				{
					fn(false);
					return false;
				}
			};
			var win = _createWindow(_title, _content, _eventList);
			return win;
		},
		prompt: function (_title, msg, fn)
		{
			var _content = "<div class=\"messager-icon messager-question\"></div>" + "<div>" + msg + "</div>" + "<br/>" + "<input class=\"messager-input\" type=\"text\"/>" + "<div style=\"clear:both;\"/>";
			var _eventList = {};
			_eventList[$.messager.defaults.ok] = function ()
			{
				win.window("close");
				if (fn)
				{
					fn($(".messager-input", win).val());
					return false;
				}
			};
			_eventList[$.messager.defaults.cancel] = function ()
			{
				win.window("close");
				if (fn)
				{
					fn();
					return false;
				}
			};
			var win = _createWindow(_title, _content, _eventList);
			return win;
		},
		progress: function (_params)
		{
			var _opts = $.extend({
				title: "",
				msg: "",
				text: undefined,
				interval: 300
			},
			_params || {});
			var _barInfo = {
				bar: function ()
				{
					return $("body>div.messager-window").find("div.messager-p-bar");
				},
				close: function ()
				{
					var win = $("body>div.messager-window>div.messager-body");
					if (win.length)
					{
						if (win[0].timer)
						{
							clearInterval(win[0].timer);
						}
						win.window("close");
					}
				}
			};
			if (typeof _params == "string")
			{
				var _method = _barInfo[_params];
				return _method();
			}
			var _content = "<div class=\"messager-progress\"><div class=\"messager-p-msg\"></div><div class=\"messager-p-bar\"></div></div>";
			var win = _createWindow(_opts.title, _content, null);
			win.find("div.messager-p-msg").html(_opts.msg);
			var bar = win.find("div.messager-p-bar");
			bar.progressbar({
				text: _opts.text
			});
			win.window({
				closable: false
			});
			if (_opts.interval)
			{
				win[0].timer = setInterval(function ()
				{
					var v = bar.progressbar("getValue");
					v += 10;
					if (v > 100)
					{
						v = 0;
					}
					bar.progressbar("setValue", v);
				},
				_opts.interval);
			}
			return win;
		}
	};
	$.messager.defaults = {
		ok: "Ok",
		cancel: "Cancel"
	};
})(jQuery);
/**
 * jQuery.combo
 */
(function($) {
	function _resize(_target, _width) {
		var _opts = $.data(_target, "combo").options;
		var _combo = $.data(_target, "combo").combo;
		var _panel = $.data(_target, "combo").panel;
		if (_width) {
			_opts.width = _width;
		}
		//_combo.appendTo("body");
		if (isNaN(_opts.width)) {
			_opts.width = _combo.find(".combo-text").outerWidth();
		}
		if (!_opts.height) {
			_opts.height = _combo.find(".combo-text").outerHeight();
		}
		var _outerWidth = 0;
		if (_opts.hasDownArrow/* && !_opts.readonly*/) {
			_combo.find(".combo-arrow").height(_opts.height);
			//_combo.height(_opts.height);
			_outerWidth = _combo.find(".combo-arrow").outerWidth();
		}
		var _width = _opts.width - 2;
		if ($.support.boxModel == true) {
			_width -= _combo.outerWidth() - _combo.width();
		}
		//_combo.find(".combo-text").width(_width);
    if(_combo.find("input").css("width") && _opts.fixedWidth)
    {
      _combo.width(_width);
    }
		_panel.panel("resize", {
			width: (_opts.panelWidth ? _opts.panelWidth: _combo.width()+2),
			height: _opts.panelHeight
		});
		//_combo.insertAfter(_target);
	};
	function _displayArrow(_target) {
		var _opts = $.data(_target, "combo").options;
		var _combo = $.data(_target, "combo").combo;
		if (_opts.hasDownArrow && !_opts.readonly && _opts.hasBorder) {
			_combo.find(".combo-arrow").show();
			_combo.find("input").attr("readonly", false).removeClass("inpreadonly");
		} else {
			_combo.find(".combo-arrow").hide();
			_combo.find("input").attr("readonly", true).addClass("inpreadonly");
		}
		if(_opts.hasBorder)_combo.addClass("combo-border");
	};
	function _createCombo(_target, _opts) {
		var _me = $(_target);
		_target.initWidth=_me.outerWidth();
		if(_target.tagName=="SELECT")
		{
			_me.addClass("combo-f").hide();
			var _combo = $("<span class=\"combo\"></span>").insertAfter(_target);
			var _input = $("<input type=\"text\" class=\"combo-text\">").appendTo(_combo);
		}
		else if(_target.tagName=="INPUT")
		{
			var _combo = _me.wrap('<span class="combo"></span>').parent()/*.css({"height":_me.outerHeight()-2})*/;
			var _input = _me.addClass("combo-text").css({/*"width":_me.outerWidth(), */"border":"0px"});
		}
		else
		{
			var _combo = _me.wrap("<span class=\"combo\"></span>").parent();
			var _input = _me.addClass("combo-text")/*.css("width",_me.outerWidth())*/;
		}
		$("<span><span class=\"combo-arrow\"></span></span>").appendTo(_combo);
		//$("<input type=\"hidden\" class=\"combo-value\">").appendTo(_combo);
		var _panel = $("<div class=\"combo-panel\"></div>").appendTo("body");
		_panel.panel({
      panelMinWidth:_opts.panelMinWidth,
      panelMinHeight:_opts.panelMinHeight,
			doSize: false,
			closed: true,
			style: {
				position: "absolute",
				zIndex: 10
			},
			onOpen: function() {
				var _opts = $.data(_target, "combo").options;
				$(this).panel("resize");
				_opts.isHidden=false;
			},
			onClose:function()
			{
				var combodata=$.data(_target, "combo");
				if(combodata)
				{
					var _opts = $.data(_target, "combo").options;
					_opts.isHidden=true;
				}
			}
		});
		/*
		var _name = _me.attr("name");
		if (_name) {
			_combo.find("input.combo-value").attr("name", _name);
			_me.removeAttr("name").attr("comboName", _name);
		}*/
		_input.attr("autocomplete", "off");
		return {
			combo: _combo,
			panel: _panel
		};
	};
	function _destroy(_target) {
    _hidePanel(_target);
		var _combotext = $.data(_target, "combo").combo.find("input.combo-text");
		_combotext.validatebox("destroy");
		var _combodata=$.data(_target, "combo");
		if(_combodata)
		{
			_combodata.panel.panel("destroy");
			_combodata.combo.remove();
			$(_target).remove();
		}
	};
	function _bindEvent(_target) {
		var _data = $.data(_target, "combo");
		var _opts = _data.options;
		var _combo = $.data(_target, "combo").combo;
		var _panel = $.data(_target, "combo").panel;
		var _combotext = _combo.find(".combo-text");
		var _arrow = _combo.find(".combo-arrow");
		$(document)/*.unbind(".combo")*/.bind("mousedown.combo",
		function(e) {
			//$("div.combo-panel").panel("close");
			_hidePanel(_target);
		});
		_combo.unbind(".combo");
		_panel.unbind(".combo");
		_combotext.unbind(".combo");
		_arrow.unbind(".combo");
		if (!_opts.disabled && !_opts.readonly) {
			_combo.bind("mouseenter.combo", function(){
				_combo.find(".combo-arrow").show();
				_combo.addClass("combo-border");
			}).bind("mouseleave.combo", function(){
				if (!_panel.is(":visible") && !_opts.hasBorder)
				{
					_combo.find(".combo-arrow").hide();
					_combo.removeClass("combo-border");
				}
			});

			_panel.bind("mousedown.combo",
			function(e) {
				e.stopPropagation(); 
			}).bind("click.combo",
			function(e) {
				e.stopPropagation(); 
			});

			_combotext.bind("mousedown.combo",
			function(e) {
				e.stopPropagation();
			}).bind("keydown.combo",
			function(e) {
				switch (e.keyCode) {
				case 38:
					_opts.keyHandler.up.call(_target,e);
					break;
				case 40:
					_opts.keyHandler.down.call(_target,e);
					break;
				case 13:
					//e.preventDefault();
					_opts.keyHandler.enter.call(_target,e);
					//return false;
					break;
				case 9:
				case 27:
					_hidePanel(_target);
					break;
				default:
					if (_opts.editable) {
						if (_data.timer) {
							clearTimeout(_data.timer);
						}
						_data.timer = setTimeout(function() {
							var q = _combotext.val();
							if (_data.previousValue != q) {
								_data.previousValue = q;
								//_showPanel(_target);
								_opts.keyHandler.query.call(_target, _combotext.val());
								_validate(_target, true);
							}
						},
						_opts.delay);
					}
				}
			});

			$(_target).bind("click.combo focus.combo",
			function() {
				if (!_panel.is(":visible")) {
					$("div.combo-panel").panel("close");
					_showPanel(_target);
				}
				//_combotext.focus();
			});

			_arrow.bind("click.combo",
			function() {
				if (_panel.is(":visible")) {
					_hidePanel(_target);
				} else {
					$("div.combo-panel").panel("close");
					_showPanel(_target);
				}
				//_combotext.focus();
			}).bind("mouseenter.combo",
			function() {
				$(this).addClass("combo-arrow-hover");
			}).bind("mouseleave.combo",
			function() {
				$(this).removeClass("combo-arrow-hover");
			}).bind("mousedown.combo",
			function() {
				return false;
			});
		}
	};
	function _showPanel(_target) {
		var _opts = $.data(_target, "combo").options;
		var _combo = $.data(_target, "combo").combo;
		var _panel = $.data(_target, "combo").panel;
		if ($.fn.window) {
			_panel.panel("panel").css("z-index", $.fn.window.defaults.zIndex++);
		}
		_panel.panel("move", {
			left: _combo.offset().left,
			top: _getTop()
		});
		_panel.panel("open");
    _opts.isShowPanel=true;
		_opts.onShowPanel.call(_target); 
		(function() {
			if (_panel.is(":visible")) {
				_panel.panel("move", {
					left: _getLeft(),
					top: _getTop()
				});
				setTimeout(arguments.callee, 200);
			}
		})();
		function _getLeft() {
			var _left = _combo.offset().left;
			if (_left + _panel.outerWidth() > $(window).width() + $(document).scrollLeft()) {
				_left = $(window).width() + $(document).scrollLeft() - _panel.outerWidth();
			}
			if (_left < 0) {
				_left = 0;
			}
			return _left;
		};
		function _getTop() {
			var top = _combo.offset().top + _combo.outerHeight();
			if (top + _panel.outerHeight() > $(window).height() + $(document).scrollTop()) {
				top = _combo.offset().top - _panel.outerHeight();
			}
			if (top < $(document).scrollTop()) {
				top = _combo.offset().top + _combo.outerHeight();
			}
			return top;
		};
	};
	function _hidePanel(_target) {
		var combodata=$.data(_target, "combo");
		if(!combodata)return;

		var _opts = combodata.options;
		var _panel = combodata.panel;
		var _combo = combodata.combo;
		_panel.panel("close");
    _opts.isShowPanel=false;
		if(!_opts.hasBorder)
		{
			_combo.find(".combo-arrow").hide();
			_combo.removeClass("combo-border");
		}
		_opts.onHidePanel.call(_target);
	};
	function _validate(_target, _isValidate) {
		var _opts = $.data(_target, "combo").options;
		var _input = $.data(_target, "combo").combo.find("input.combo-text");
		_input.validatebox(_opts);
		if (_isValidate) {
			_input.validatebox("validate");
			_input.trigger("mouseleave");
		}
	};
	function _setDisabled(_target, _disabled) {
		var _opts = $.data(_target, "combo").options;
		var _combo = $.data(_target, "combo").combo;
		if (_disabled) {
			_opts.disabled = true;
			$(_target).attr("disabled", true);
			//_combo.find(".combo-value").attr("disabled", true);
			_combo.find(".combo-text").attr("disabled", true);
		} else {
			_opts.disabled = false;
			$(_target).removeAttr("disabled");
			//_combo.find(".combo-value").removeAttr("disabled");
			_combo.find(".combo-text").removeAttr("disabled");
		}
	};
	function _clear(_target) {
		var _opts = $.data(_target, "combo").options;
		var _combo = $.data(_target, "combo").combo;
		/*if (_opts.multiple) {
			_combo.find("input.combo-value").remove();
		} else {
			_combo.find("input.combo-value").val("");
		}*/
		$.data(_target, "combo").values=[];
		_combo.find("input.combo-text").val("");

	};
	function _getText(_target) {
		var _combo = $.data(_target, "combo").combo;
		var _text='';
		var _box=_combo.find(".combo-text");
		if(_box.length>0 && _box[0].tagName=="INPUT")_text=_combo.find(".combo-text").val();
		else _text= _combo.find(".combo-text").html();

		return _text;
	};
	function _setText(_target, _text) {
		var _combo = $.data(_target, "combo").combo;
		var _box=_combo.find(".combo-text");
		if(_box.length>0 && _box[0].tagName=="INPUT")_combo.find(".combo-text").val(_text);
		else _combo.find(".combo-text").html(_text);
		_validate(_target, true);
		$.data(_target, "combo").previousValue = _text;
	};
	function _getValues(_target) {
    if($.data(_target, "combo")==undefined)return undefined;

		var _values = $.data(_target, "combo").values;
		/*var _combo = $.data(_target, "combo").combo;
		_combo.find("input.combo-value").each(function() {
			_values.push($(this).val());
		});*/
		return _values;
	};
	function _setValues(_target, _values) {
		var _opts = $.data(_target, "combo").options;
		var _oldValues = _getValues(_target);
		var _combo = $.data(_target, "combo").combo;

		$.data(_target, "combo").values = _values;
		/*_combo.find("input.combo-value").remove();
		var _comboName = $(_target).attr("comboName");
		for (var i = 0; i < _values.length; i++) {
			var _hiddeninput = $("<input type=\"hidden\" class=\"combo-value\">").appendTo(_combo);
			if (_comboName) {
				_hiddeninput.attr("name", _comboName);
			}
			_hiddeninput.val(_values[i]);
		}*/
		var tmp = [];
		for (var i = 0; i < _oldValues.length; i++) {
			tmp[i] = _oldValues[i];
		}
		var aa = [];
		for (var i = 0; i < _values.length; i++) {
			for (var j = 0; j < tmp.length; j++) {
				if (_values[i] == tmp[j]) {
					aa.push(_values[i]);
					tmp.splice(j, 1);
					break;
				}
			}
		}
		if (aa.length != _values.length || _values.length != _oldValues.length) {
			if (_opts.multiple) {
				_opts.onChange.call(_target, _values, _oldValues);
			} else {
				_opts.onChange.call(_target, _values[0], _oldValues[0]);
			}
		}
	};
	function _getValue(_target) {
		var _values = _getValues(_target);
    if(_values==undefined)return undefined;

		return _values[0];
	};
	function _setValue(_target, _value) {
		_setValues(_target, [_value]);
	};
	function _setReadonly(_target, _isReadonly) {
		var _opts = $.data(_target, "combo").options;
		_opts.readonly = _isReadonly;
		_displayArrow(_target);
		_bindEvent(_target);
	};
	function _closeChangeEvent(_target) {
		var _opts = $.data(_target, "combo").options;
		var fn = _opts.onChange;
		_opts.onChange = function() {};
		if (_opts.multiple) {
			if (_opts.value) {
				if (typeof _opts.value == "object") {
					_setValues(_target, _opts.value);
				} else {
					_setValue(_target, _opts.value);
				}
			} else {
				_setValues(_target, []);
			}
		} else {
			_setValue(_target, _opts.value);
		}
		_setText(_target, _opts.text);
		_opts.onChange = fn;
	};
	$.fn.combo = function(_options, _param) {
		if (typeof _options == "string") {
			return $.fn.combo.methods[_options](this, _param);
		}
		_options = _options || {};
		return this.each(function() {
			var _data = $.data(this, "combo");
			if (_data) {
				$.extend(_data.options, _options);
			} else {
				var r = _createCombo(this, _options);
				_data = $.data(this, "combo", {
					options: $.extend({},
					$.fn.combo.defaults, $.fn.combo.parseOptions(this), _options),
					combo: r.combo,
					panel: r.panel,
					previousValue: null,
					values:[]
				});
				$(this).removeAttr("disabled");
			}
			_displayArrow(this);
			$("input.combo-text", _data.combo).attr("readonly", !_data.options.editable);
			_setDisabled(this, _data.options.disabled);
			_resize(this, this.initWidth);
			//_resize(this);
			_bindEvent(this);
			_validate(this);
			_closeChangeEvent(this);
		});
	};
	$.fn.combo.methods = {
		options: function(jq) {
			return $.data(jq[0], "combo").options;
		},
		setzIndex:function(jq, zindex)
		{
			var _panel = $.data(jq[0], "combo").panel;
			_panel.panel("panel").css("z-index", zindex);
		},
		combo: function(jq) {
			return $.data(jq[0], "combo").combo;
		},
		panel: function(jq) {
			return $.data(jq[0], "combo").panel;
		},
		textbox: function(jq) {
			return $.data(jq[0], "combo").combo.find("input.combo-text");
		},
		destroy: function(jq) {
			return jq.each(function() {
				_destroy(this);
			});
		},
		resize: function(jq, _width) {
			return jq.each(function() {
				_resize(this, _width);
			});
		},
		showPanel: function(jq) {
			return jq.each(function() {
				_showPanel(this);
			});
		},
		hidePanel: function(jq) {
			return jq.each(function() {
				_hidePanel(this);
			});
		},
		disable: function(jq) {
			return jq.each(function() {
				_setDisabled(this, true);
				_bindEvent(this);
			});
		},
		enable: function(jq) {
			return jq.each(function() {
				_setDisabled(this, false);
				_bindEvent(this);
			});
		},
		validate: function(jq) {
			return jq.each(function() {
				_validate(this, true);
			});
		},
		isValid: function(jq) {
			var _input = $.data(jq[0], "combo").combo.find("input.combo-text");
			return _input.validatebox("isValid");
		},
		clear: function(jq) {
			return jq.each(function() {
				_clear(this);
			});
		},
		getText: function(jq) {
			return _getText(jq[0]);
		},
		setText: function(jq, _text) {
			return jq.each(function() {
				_setText(this, _text);
			});
		},
		getValues: function(jq) {
			return _getValues(jq[0]);
		},
		setValues: function(jq, _values) {
			return jq.each(function() {
				_setValues(this, _values);
			});
		},
		getValue: function(jq) {
			return _getValue(jq[0]);
		},
		setValue: function(jq, _value) {
			return jq.each(function() {
				_setValue(this, _value);
			});
		},
		setReadonly: function(jq, _isReadonly) {
			return jq.each(function() {
				_setReadonly(this, _isReadonly);
			});
		},
    isShowPanel: function(jq)
    {
      var _opts=this.options(jq);
      return _opts.isShowPanel;
    }
	};
	$.fn.combo.parseOptions = function(_target) {
		var t = $(_target);
		return $.extend({},
		$.fn.validatebox.parseOptions(_target), {
			width: (parseInt(_target.style.width) || undefined),
			panelWidth: (parseInt(t.attr("panelWidth")) || undefined),
			panelHeight: (t.attr("panelHeight") == "auto" ? "auto": parseInt(t.attr("panelHeight")) || undefined),
			separator: (t.attr("separator") || undefined),
			multiple: (t.attr("multiple") ? (t.attr("multiple") == "true" || t.attr("multiple") == true) : undefined),
			editable: (t.attr("editable") ? t.attr("editable") == "true": undefined),
			disabled: (t.attr("disabled") ? true: undefined),
			hasDownArrow: (t.attr("hasDownArrow") ? t.attr("hasDownArrow") == "true": undefined),
			value: (t.val() || undefined),
			delay: (t.attr("delay") ? parseInt(t.attr("delay")) : undefined)
		});
	};
	$.fn.combo.defaults = $.extend({},
	$.fn.validatebox.defaults, {
		width: "auto",
    fixedWidth:false,
		panelWidth: null,
		panelHeight: 200,
		multiple: false,
		separator: ",",
		editable: false,
		disabled: false,
		hasDownArrow: true,
		hasBorder: true, //有边框
		readonly: false,
    isShowPanel: false, //是否打开下拉框
		value: "",
		text:'',
		delay: 200,
		isHidden:true,
		keyHandler: {
			up: function() {},
			down: function() {},
			enter: function() {},
			query: function(q) {}
		},
		onShowPanel: function() {},
		onHidePanel: function() {},
		onChange: function(_5c, _5d) {}
	});
})(jQuery);

(function ($)
{
	function _wrapTree(_target)
	{
		var me = $(_target);
		me.addClass("tree");
		return me;
	};
	function _parseData(_target)
	{
		var _data = [];
		_parse(_data, $(_target));
		function _parse(aa, _me)
		{
			_me.children("li").each(function ()
			{
				var _li = $(this);
				var _liOpts = $.extend({},
				$.parser.parseOptions(this, ["id", "iconCls", "state"]), {
					checked: (_li.attr("checked") ? true : undefined)
				});
				_liOpts.text = _li.children("span").html();
				if (!_liOpts.text)
				{
					_liOpts.text = _li.html();
				}
				var _b = _li.children("ul");
				if (_b.length)
				{
					_liOpts.children = [];
					_parse(_liOpts.children, _b);
				}
				aa.push(_liOpts);
			});
		};
		return _data;
	};
	function _bindEvent(_target)
	{
		var _opts = $.data(_target, "tree").options;
		$(_target).unbind().bind("mouseover",
		function (e)
		{
			var tt = $(e.target);
			var _treeNode = tt.closest("div.tree-node");
			if (!_treeNode.length)
			{
				return;
			}
			_treeNode.addClass("tree-node-hover");
			if (tt.hasClass("tree-hit"))
			{
				if (tt.hasClass("tree-expanded"))
				{
					tt.addClass("tree-expanded-hover");
				} else
				{
					tt.addClass("tree-collapsed-hover");
				}
			}
			e.stopPropagation();
		}).bind("mouseout",
		function (e)
		{
			var tt = $(e.target);
			var _treeNode = tt.closest("div.tree-node");
			if (!_treeNode.length)
			{
				return;
			}
			_treeNode.removeClass("tree-node-hover");
			if (tt.hasClass("tree-hit"))
			{
				if (tt.hasClass("tree-expanded"))
				{
					tt.removeClass("tree-expanded-hover");
				} else
				{
					tt.removeClass("tree-collapsed-hover");
				}
			}
			e.stopPropagation();
		}).bind("click",
		function (e)
		{
			var tt = $(e.target);
			var _treeNode = tt.closest("div.tree-node");
			if (!_treeNode.length)
			{
				return;
			}
			if (tt.hasClass("tree-hit"))
			{
				_toggle(_target, _treeNode[0]);
				return false;
			} else
			{
				if (tt.hasClass("tree-checkbox"))
				{
					_check(_target, _treeNode[0], !tt.hasClass("tree-checkbox1"));
					return false;
				} else
				{
					_select(_target, _treeNode[0]);
					_opts.onClick.call(_target, _getNode(_target, _treeNode[0]));
				}
			}
			e.stopPropagation();
		}).bind("dblclick",
		function (e)
		{
			var _12 = $(e.target).closest("div.tree-node");
			if (!_12.length)
			{
				return;
			}
			_select(_target, _12[0]);
			_opts.onDblClick.call(_target, _getNode(_target, _12[0]));
			e.stopPropagation();
		}).bind("contextmenu",
		function (e)
		{
			var _treeNode = $(e.target).closest("div.tree-node");
			if (!_treeNode.length)
			{
				return;
			}
			_opts.onContextMenu.call(_target, e, _getNode(_target, _treeNode[0]));
			e.stopPropagation();
		});
	};
	function _disableDnd(_target)
	{
		var _treeNode = $(_target).find("div.tree-node");
		_treeNode.draggable("disable");
		_treeNode.css("cursor", "pointer");
	};
	function _enableDnd(_target)
	{
		var _state = $.data(_target, "tree");
		var _opts = _state.options;
		var _tree = _state.tree;
		_state.disabledNodes = [];
		_tree.find("div.tree-node").draggable({
			disabled: false,
			revert: true,
			cursor: "pointer",
			proxy: function (_1d)
			{
				var p = $("<div class=\"tree-node-proxy\"></div>").appendTo("body");
				p.html("<span class=\"tree-dnd-icon tree-dnd-no\">&nbsp;</span>" + $(_1d).find(".tree-title").html());
				p.hide();
				return p;
			},
			deltaX: 15,
			deltaY: 15,
			onBeforeDrag: function (e)
			{
				if (_opts.onBeforeDrag.call(_target, _getNode(_target, this)) == false)
				{
					return false;
				}
				if ($(e.target).hasClass("tree-hit") || $(e.target).hasClass("tree-checkbox"))
				{
					return false;
				}
				if (e.which != 1)
				{
					return false;
				}
				$(this).next("ul").find("div.tree-node").droppable({
					accept: "no-accept"
				});
				var _1e = $(this).find("span.tree-indent");
				if (_1e.length)
				{
					e.data.offsetWidth -= _1e.length * _1e.width();
				}
			},
			onStartDrag: function ()
			{
				$(this).draggable("proxy").css({
					left: -10000,
					top: -10000
				});
				_opts.onStartDrag.call(_target, _getNode(_target, this));
				var _nodeOpts = _getNode(_target, this);
				if (_nodeOpts.id == undefined)
				{
					_nodeOpts.id = "easyui_tree_node_id_temp";
					_update(_target, _nodeOpts);
				}
				_state.draggingNodeId = _nodeOpts.id;
			},
			onDrag: function (e)
			{
				var x1 = e.pageX,
				y1 = e.pageY,
				x2 = e.data.startX,
				y2 = e.data.startY;
				var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
				if (d > 3)
				{
					$(this).draggable("proxy").show();
				}
				this.pageY = e.pageY;
			},
			onStopDrag: function ()
			{
				$(this).next("ul").find("div.tree-node").droppable({
					accept: "div.tree-node"
				});
				for (var i = 0; i < _state.disabledNodes.length; i++)
				{
					$(_state.disabledNodes[i]).droppable("enable");
				}
				_state.disabledNodes = [];
				var _nodeOpts = _find(_target, _state.draggingNodeId);
				if (_nodeOpts && _nodeOpts.id == "easyui_tree_node_id_temp")
				{
					_nodeOpts.id = "";
					_update(_target, _nodeOpts);
				}
				_opts.onStopDrag.call(_target, _nodeOpts);
			}
		}).droppable({
			accept: "div.tree-node",
			onDragEnter: function (e, _target)
			{
				if (_opts.onDragEnter.call(_target, this, _getNode(_target, _target)) == false)
				{
					_index(_target, false);
					$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
					$(this).droppable("disable");
					_state.disabledNodes.push(this);
				}
			},
			onDragOver: function (e, _opts)
			{
				if ($(this).droppable("options").disabled)
				{
					return;
				}
				var _24 = _opts.pageY;
				var top = $(this).offset().top;
				var _25 = top + $(this).outerHeight();
				_index(_opts, true);
				$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
				if (_24 > top + (_25 - top) / 2)
				{
					if (_25 - _24 < 5)
					{
						$(this).addClass("tree-node-bottom");
					} else
					{
						$(this).addClass("tree-node-append");
					}
				} else
				{
					if (_24 - top < 5)
					{
						$(this).addClass("tree-node-top");
					} else
					{
						$(this).addClass("tree-node-append");
					}
				}
				if (_opts.onDragOver.call(_target, this, _getNode(_target, _opts)) == false)
				{
					_index(_opts, false);
					$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
					$(this).droppable("disable");
					_state.disabledNodes.push(this);
				}
			},
			onDragLeave: function (e, _26)
			{
				_index(_26, false);
				$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
				_opts.onDragLeave.call(_target, this, _getNode(_target, _26));
			},
			onDrop: function (e, _27)
			{
				var _28 = this;
				var _29, _2a;
				if ($(this).hasClass("tree-node-append"))
				{
					_29 = _2b;
					_2a = "append";
				} else
				{
					_29 = _2c;
					_2a = $(this).hasClass("tree-node-top") ? "top" : "bottom";
				}
				if (_opts.onBeforeDrop.call(_target, _28, _getData(_target, _27), _2a) == false)
				{
					$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
					return;
				}
				_29(_27, _28, _2a);
				$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
			}
		});
		function _index(_2d, _2e)
		{
			var _2f = $(_2d).draggable("proxy").find("span.tree-dnd-icon");
			_2f.removeClass("tree-dnd-yes tree-dnd-no").addClass(_2e ? "tree-dnd-yes" : "tree-dnd-no");
		};
		function _2b(_30, _31)
		{
			if (_getNode(_target, _31).state == "closed")
			{
				_expand(_target, _31,
				function ()
				{
					_32();
				});
			} else
			{
				_32();
			}
			function _32()
			{
				var _33 = $(_target).tree("pop", _30);
				$(_target).tree("append", {
					parent: _31,
					data: [_33]
				});
				_opts.onDrop.call(_target, _31, _33, "append");
			};
		};
		function _2c(_34, _35, _36)
		{
			var _37 = {};
			if (_36 == "top")
			{
				_37.before = _35;
			} else
			{
				_37.after = _35;
			}
			var _38 = $(_target).tree("pop", _34);
			_37.data = _38;
			$(_target).tree("insert", _37);
			_opts.onDrop.call(_target, _35, _38, _36);
		};
	};
	function _check(_target, _node, _checked)
	{
		var _opts = $.data(_target, "tree").options;
		if (!_opts.checkbox)
		{
			return;
		}
		var _nodeOpts = _getNode(_target, _node);
		if (_opts.onBeforeCheck.call(_target, _nodeOpts, _checked) == false)
		{
			return;
		}
		var _jNode = $(_node);
		var ck = _jNode.find(".tree-checkbox");
		ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
		if (_checked)
		{
			ck.addClass("tree-checkbox1");
		} else
		{
			ck.addClass("tree-checkbox0");
		}
		if (_opts.cascadeCheck)
		{
			_setParentCheckbox(_jNode);
			_setCheckbox(_jNode);
		}
		_opts.onCheck.call(_target, _nodeOpts, _checked);
		function _setCheckbox(_jNode)
		{
			var _checkbox = _jNode.next().find(".tree-checkbox");
			_checkbox.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
			if (_jNode.find(".tree-checkbox").hasClass("tree-checkbox1"))
			{
				_checkbox.addClass("tree-checkbox1");
			} else
			{
				_checkbox.addClass("tree-checkbox0");
			}
		};
		function _setParentCheckbox(_jNode)
		{
			var _jParentNode = _getParent(_target, _jNode[0]);
			if (_jParentNode)
			{
				var ck = $(_jParentNode.target).find(".tree-checkbox");
				ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
				if (_46(_jNode))
				{
					ck.addClass("tree-checkbox1");
				} else
				{
					if (_47(_jNode))
					{
						ck.addClass("tree-checkbox0");
					} else
					{
						ck.addClass("tree-checkbox2");
					}
				}
				_setParentCheckbox($(_jParentNode.target));
			}
			function _46(n)
			{
				var ck = n.find(".tree-checkbox");
				if (ck.hasClass("tree-checkbox0") || ck.hasClass("tree-checkbox2"))
				{
					return false;
				}
				var b = true;
				n.parent().siblings().each(function ()
				{
					if (!$(this).children("div.tree-node").children(".tree-checkbox").hasClass("tree-checkbox1"))
					{
						b = false;
					}
				});
				return b;
			};
			function _47(n)
			{
				var ck = n.find(".tree-checkbox");
				if (ck.hasClass("tree-checkbox1") || ck.hasClass("tree-checkbox2"))
				{
					return false;
				}
				var b = true;
				n.parent().siblings().each(function ()
				{
					if (!$(this).children("div.tree-node").children(".tree-checkbox").hasClass("tree-checkbox0"))
					{
						b = false;
					}
				});
				return b;
			};
		};
	};
	function _createNodes(_target, _4a)
	{
		var _4b = $.data(_target, "tree").options;
		var _4c = $(_4a);
		if (_isLeaf(_target, _4a))
		{
			var ck = _4c.find(".tree-checkbox");
			if (ck.length)
			{
				if (ck.hasClass("tree-checkbox1"))
				{
					_check(_target, _4a, true);
				} else
				{
					_check(_target, _4a, false);
				}
			} else
			{
				if (_4b.onlyLeafCheck)
				{
					$("<span class=\"tree-checkbox tree-checkbox0\"></span>").insertBefore(_4c.find(".tree-title"));
				}
			}
		} else
		{
			var ck = _4c.find(".tree-checkbox");
			if (_4b.onlyLeafCheck)
			{
				ck.remove();
			} else
			{
				if (ck.hasClass("tree-checkbox1"))
				{
					_check(_target, _4a, true);
				} else
				{
					if (ck.hasClass("tree-checkbox2"))
					{
						var _4e = true;
						var _4f = true;
						var _50 = _getChildren(_target, _4a);
						for (var i = 0; i < _50.length; i++)
						{
							if (_50[i].checked)
							{
								_4f = false;
							} else
							{
								_4e = false;
							}
						}
						if (_4e)
						{
							_check(_target, _4a, true);
						}
						if (_4f)
						{
							_check(_target, _4a, false);
						}
					}
				}
			}
		}
	};
	function _loadData(_target, ul, _data, _isAppend)
	{
		var _opts = $.data(_target, "tree").options;
		_data = _opts.loadFilter.call(_target, _data, $(ul).prev("div.tree-node")[0]);
		if (!_isAppend)
		{
			$(ul).empty();
		}
		var _uncheckNode = [];
		var _checkNode = [];
		var _level = $(ul).prev("div.tree-node").find("span.tree-indent, span.tree-hit").length;
		_initNodes(ul, _data, _level);
		if (_opts.dnd)
		{
			_enableDnd(_target);
		} else
		{
			_disableDnd(_target);
		}
		if (_uncheckNode.length)
		{
			//_check(_target, _uncheckNode[0], false); /*by xtb 防止刚展开下拉框时清除原有数据*/
		}
		for (var i = 0; i < _checkNode.length; i++)
		{
			_check(_target, _checkNode[i], true);
		}
		setTimeout(function ()
		{
			_62(_target, _target);
		},
		0);
		var _currentNode = null;
		if (_target != ul)
		{
			var _5c = $(ul).prev();
			_currentNode = _getNode(_target, _5c[0]);
		}
		_opts.onLoadSuccess.call(_target, _currentNode, _data);
		function _initNodes(ul, __data, __level)
		{
			if(!__data)return;
			for (var i = 0; i < __data.length; i++)
			{
				var li = $("<li></li>").appendTo(ul);
				var _item = __data[i];
				if (_item.state != "open" && _item.state != "closed")
				{
					_item.state = "open";
				}
				var _nodeBox = $("<div class=\"tree-node\"></div>").appendTo(li);
				_nodeBox.attr("node-id", _item.id);
        var _nodeOpts=$.extend({}, _item, {
					id: _item.id,
					text: _item.text,
					iconCls: _item.iconCls,
					level:_level,
					attributes: _item.attributes,
					type: _item.type,
					code: _item.code,
					hasChild:!!_item.hasChild,
					hasFactChild:!!_item.hasFactChild
				});
				$.data(_nodeBox[0], "tree-node", _nodeOpts);
				$("<span class=\"tree-title\"></span>").html(_opts.formatter.call(_target, _item)).appendTo(_nodeBox);
				if (_opts.checkbox)
				{
					if (_opts.onlyLeafCheck)
					{
						if (_item.state == "open" && (!_item.children || !_item.children.length))
						{
							if (_item.checked)
							{
								$("<span class=\"tree-checkbox tree-checkbox1\"></span>").prependTo(_nodeBox);
							} else
							{
								$("<span class=\"tree-checkbox tree-checkbox0\"></span>").prependTo(_nodeBox);
							}
						}
					} else
					{
						if (_item.checked)
						{
							$("<span class=\"tree-checkbox tree-checkbox1\"></span>").prependTo(_nodeBox);
							_checkNode.push(_nodeBox[0]);
						} else
						{
							$("<span class=\"tree-checkbox tree-checkbox0\"></span>").prependTo(_nodeBox);
							if (__data == _data)
							{
								_uncheckNode.push(_nodeBox[0]);
							}
						}
					}
				}
				if (_item.children && _item.children.length)
				{
					var _61 = $("<ul></ul>").appendTo(li);
					if (_item.state == "open")
					{
						$("<span class=\"tree-icon tree-folder tree-folder-open\"></span>").addClass(_item.iconCls).prependTo(_nodeBox);
						$("<span class=\"tree-hit tree-expanded\"></span>").prependTo(_nodeBox);
					} else
					{
						$("<span class=\"tree-icon tree-folder\"></span>").addClass(_item.iconCls).prependTo(_nodeBox);
						$("<span class=\"tree-hit tree-collapsed\"></span>").prependTo(_nodeBox);
						_61.css("display", "none");
					}
					_initNodes(_61, _item.children, __level + 1);
				} else
				{
					if (_item.state == "closed")
					{
						$("<span class=\"tree-icon tree-folder\"></span>").addClass(_item.iconCls).prependTo(_nodeBox);
						$("<span class=\"tree-hit tree-collapsed\"></span>").prependTo(_nodeBox);
					} else
					{
						$("<span class=\"tree-icon tree-file\"></span>").addClass(_item.iconCls).prependTo(_nodeBox);
						$("<span class=\"tree-indent\"></span>").prependTo(_nodeBox);
					}
				}
				for (var j = 0; j < __level; j++)
				{
					$("<span class=\"tree-indent\"></span>").prependTo(_nodeBox);
				}
			}
		};
	};
	function _62(_target, ul, _64)
	{
		var _65 = $.data(_target, "tree").options;
		if (!_65.lines)
		{
			return;
		}
		if (!_64)
		{
			_64 = true;
			$(_target).find("span.tree-indent").removeClass("tree-line tree-join tree-joinbottom");
			$(_target).find("div.tree-node").removeClass("tree-node-last tree-root-first tree-root-one");
			var _66 = $(_target).tree("getRoots");
			if (_66.length > 1)
			{
				$(_66[0].target).addClass("tree-root-first");
			} else
			{
				if (_66.length == 1)
				{
					$(_66[0].target).addClass("tree-root-one");
				}
			}
		}
		$(ul).children("li").each(function ()
		{
			var _67 = $(this).children("div.tree-node");
			var ul = _67.next("ul");
			if (ul.length)
			{
				if ($(this).next().length)
				{
					_68(_67);
				}
				_62(_target, ul, _64);
			} else
			{
				_69(_67);
			}
		});
		var _6a = $(ul).children("li:last").children("div.tree-node").addClass("tree-node-last");
		_6a.children("span.tree-join").removeClass("tree-join").addClass("tree-joinbottom");
		function _69(_6b, _6c)
		{
			var _6d = _6b.find("span.tree-icon");
			_6d.prev("span.tree-indent").addClass("tree-join");
		};
		function _68(_6e)
		{
			var _6f = _6e.find("span.tree-indent, span.tree-hit").length;
			_6e.next().find("div.tree-node").each(function ()
			{
				$(this).children("span:eq(" + (_6f - 1) + ")").addClass("tree-line");
			});
		};
	};
	function _ajaxLoad(_target, ul, _param, _reloadCallBack)
	{
		var _opts = $.data(_target, "tree").options;
		_param = _param || {};
		var _nodeOpts = null;
		if (_target != ul)
		{
			var _prevNodes = $(ul).prev();
			_nodeOpts = _getNode(_target, _prevNodes[0]);
		}
		_opts.queryParams = $.extend(_opts.queryParams, _param);
		if (_opts.onBeforeLoad.call(_target, _nodeOpts, _opts.queryParams) == false)
		{
			return;
		}
		var _folder = $(ul).prev().children("span.tree-folder");
		_folder.addClass("tree-loading");
		var _result = _opts.loader.call(_target, _param,
		function (_data)
		{
			_folder.removeClass("tree-loading");
			_loadData(_target, ul, _data);
			if (_reloadCallBack)
			{
				_reloadCallBack();
			}
		},
		function ()
		{
			_folder.removeClass("tree-loading");
			_opts.onLoadError.apply(_target, arguments);
			if (_reloadCallBack)
			{
				_reloadCallBack();
			}
		});
		if (_result == false)
		{
			_folder.removeClass("tree-loading");
		}
	};
	function _expand(_target, _node, _expandCallBack)
	{
		var _opts = $.data(_target, "tree").options;
		var hit = $(_node).children("span.tree-hit");
		if (hit.length == 0)
		{
			return;
		}
		if (hit.hasClass("tree-expanded"))
		{
			return;
		}
		var _nodeOpts = _getNode(_target, _node);
		if (_opts.onBeforeExpand.call(_target, _nodeOpts) == false)
		{
			return;
		}
		hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
		hit.next().addClass("tree-folder-open");
		var ul = $(_node).next();
		if (ul.length)
		{
			if (_opts.animate)
			{
				ul.slideDown("normal",
				function ()
				{
					_opts.onExpand.call(_target, _nodeOpts);
					if (_expandCallBack)
					{
						_expandCallBack();
					}
				});
			} else
			{
				ul.css("display", "block");
				_opts.onExpand.call(_target, _nodeOpts);
				if (_expandCallBack)
				{
					_expandCallBack();
				}
			}
		} else
		{
			var _ul = $("<ul style=\"display:none\"></ul>").insertAfter(_node);
			_ajaxLoad(_target, _ul[0], {
				id: _nodeOpts.id
			},
			function ()
			{
				if (_ul.is(":empty"))
				{
					_ul.remove();
				}
				if (_opts.animate)
				{
					_ul.slideDown("normal",
					function ()
					{
						_opts.onExpand.call(_target, _nodeOpts);
						if (_expandCallBack)
						{
							_expandCallBack();
						}
					});
				} else
				{
					_ul.css("display", "block");
					_opts.onExpand.call(_target, _nodeOpts);
					if (_expandCallBack)
					{
						_expandCallBack();
					}
				}
			});
		}
	};
	function _collapse(_target, _node)
	{
		var _opts = $.data(_target, "tree").options;
		var hit = $(_node).children("span.tree-hit");
		if (hit.length == 0)
		{
			return;
		}
		if (hit.hasClass("tree-collapsed"))
		{
			return;
		}
		var _nodeOpts = _getNode(_target, _node);
		if (_opts.onBeforeCollapse.call(_target, _nodeOpts) == false)
		{
			return;
		}
		hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
		hit.next().removeClass("tree-folder-open");
		var ul = $(_node).next();
		if (_opts.animate)
		{
			ul.slideUp("normal",
			function ()
			{
				_opts.onCollapse.call(_target, _nodeOpts);
			});
		} else
		{
			ul.css("display", "none");
			_opts.onCollapse.call(_target, _nodeOpts);
		}
	};
	function _toggle(_target, _88)
	{
		var hit = $(_88).children("span.tree-hit");
		if (hit.length == 0)
		{
			return;
		}
		if (hit.hasClass("tree-expanded"))
		{
			_collapse(_target, _88);
		} else
		{
			_expand(_target, _88);
		}
	};
	function _expandAll(_target, _8b)
	{
		var _8c = _getChildren(_target, _8b);
		if (_8b)
		{
			_8c.unshift(_getNode(_target, _8b));
		}
		for (var i = 0; i < _8c.length; i++)
		{
			_expand(_target, _8c[i].target);
		}
	};
	function _expandTo(_8e, _8f)
	{
		var _90 = [];
		var p = _getParent(_8e, _8f);
		while (p)
		{
			_90.unshift(p);
			p = _getParent(_8e, p.target);
		}
		for (var i = 0; i < _90.length; i++)
		{
			_expand(_8e, _90[i].target);
		}
	};
	function _scrollTo(_target, _node)
	{
		var c = $(_target).parent();
		while (c[0].tagName != "BODY" && c.css("overflow-y") != "auto")
		{
			c = c.parent();
		}
		var n = $(_node);
		var _top = n.offset().top;
		if (c[0].tagName != "BODY")
		{
			var _96 = c.offset().top;
			if (_top < _96)
			{
				c.scrollTop(c.scrollTop() + _top - _96);
			} else
			{
				if (_top + n.outerHeight() > _96 + c.outerHeight() - 18)
				{
					c.scrollTop(c.scrollTop() + _top + n.outerHeight() - _96 - c.outerHeight() + 18);
				}
			}
		} else
		{
			c.scrollTop(_top);
		}
	};
	function _collapseAll(_target, _node)
	{
		var _children = _getChildren(_target, _node);
		if (_node)
		{
			_children.unshift(_getNode(_target, _node));
		}
		for (var i = 0; i < _children.length; i++)
		{
			_collapse(_target, _children[i].target);
		}
	};
	function _getRoot(_target)
	{
		var _roots = _getRoots(_target);
		if (_roots.length)
		{
			return _roots[0];
		} else
		{
			return null;
		}
	};
	function _getRoots(_target)
	{
		var _a0 = [];
		$(_target).children("li").each(function ()
		{
			var _a1 = $(this).children("div.tree-node");
			_a0.push(_getNode(_target, _a1[0]));
		});
		return _a0;
	};
	function _getChildren(_target, _node)
	{
		var _children = [];
		if (_node)
		{
			_getChildrens($(_node));
		} else
		{
			var _roots = _getRoots(_target);
			for (var i = 0; i < _roots.length; i++)
			{
				_children.push(_roots[i]);
				_getChildrens($(_roots[i].target));
			}
		}
		function _getChildrens(_jnode)
		{
			_jnode.next().find("div.tree-node").each(function ()
			{
				_children.push(_getNode(_target, this));
			});
		};
		return _children;
	};
	function _getParent(_target, _node)
	{
		var ul = $(_node).parent().parent();
		if (ul[0] == _target)
		{
			return null;
		} else
		{
			return _getNode(_target, ul.prev()[0]);
		}
	};
	function _getChecked(_target, _type)
	{
		_type = _type || "checked";
		if (!$.isArray(_type))
		{
			_type = [_type];
		}
		var _checkedNode = [];
		for (var i = 0; i < _type.length; i++)
		{
			var s = _type[i];
			if (s == "checked")
			{
				_checkedNode.push("span.tree-checkbox1");
			} else
			{
				if (s == "unchecked")
				{
					_checkedNode.push("span.tree-checkbox0");
				} else
				{
					if (s == "indeterminate")
					{
						_checkedNode.push("span.tree-checkbox2");
					}
				}
			}
		}
		var _ae = [];
		$(_target).find(_checkedNode.join(",")).each(function ()
		{
			var _af = $(this).parent();
			_ae.push(_getNode(_target, _af[0]));
		});
		return _ae;
	};
	function _getSelected(_target)
	{
		var _jselectedNode = $(_target).find("div.tree-node-selected");
		if (_jselectedNode.length)
		{
			return _getNode(_target, _jselectedNode[0]);
		} else
		{
			return null;
		}
	};
	function _append(_target, _param)
	{
		var _parent = $(_param.parent);
		var _data = _param.data;
		if (!_data)
		{
			return;
		}
		_data = $.isArray(_data) ? _data : [_data];
		if (!_data.length)
		{
			return;
		}
		var ul;
		if (_parent.length == 0)
		{
			ul = $(_target);
		} else
		{
			if (_isLeaf(_target, _parent[0]))
			{
				var _icon = _parent.find("span.tree-icon");
				_icon.removeClass("tree-file").addClass("tree-folder tree-folder-open");
				var hit = $("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_icon);
				if (hit.prev().length)
				{
					hit.prev().remove();
				}
			}
			ul = _parent.next();
			if (!ul.length)
			{
				ul = $("<ul></ul>").insertAfter(_parent);
			}
		}
		_loadData(_target, ul[0], _data, true);
		_createNodes(_target, ul.prev());
	};
	function _insert(_target, _param)
	{
		var _pos = _param.before || _param.after;
		var _parent = _getParent(_target, _pos);
		var _data = _param.data;
		if (!_data)
		{
			return;
		}
		_data = $.isArray(_data) ? _data : [_data];
		if (!_data.length)
		{
			return;
		}
		_append(_target, {
			parent: (_parent ? _parent.target : null),
			data: _data
		});
		var li = $();
		var _be = _parent ? $(_parent.target).next().children("li:last") : $(_target).children("li:last");
		for (var i = 0; i < _data.length; i++)
		{
			li = _be.add(li);
			_be = _be.prev();
		}
		if (_param.before)
		{
			li.insertBefore($(_pos).parent());
		} else
		{
			li.insertAfter($(_pos).parent());
		}
	};
	function _remove(_target, _node)
	{
		var _parent = _getParent(_target, _node);
		var _jnode = $(_node);
		var li = _jnode.parent();
		var ul = li.parent();
		li.remove();
		if (ul.children("li").length == 0)
		{
			var _jnode = ul.prev();
			_jnode.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
			_jnode.find(".tree-hit").remove();
			$("<span class=\"tree-indent\"></span>").prependTo(_jnode);
			if (ul[0] != _target)
			{
				ul.remove();
			}
		}
		if (_parent)
		{
			_createNodes(_target, _parent.target);
		}
		_62(_target, _target);
	};
	function _getData(_target, _node)
	{
		function _getChildren(aa, ul)
		{
			ul.children("li").each(function ()
			{
				var _children = $(this).children("div.tree-node");
				var _nodeOpts = _getNode(_target, _children[0]);
				var sub = $(this).children("ul");
				if (sub.length)
				{
					_nodeOpts.children = [];
					_getChildren(_nodeOpts.children, sub);
				}
				aa.push(_nodeOpts);
			});
		};
		if (_node)
		{
			var _nodeOpts = _getNode(_target, _node);
			_nodeOpts.children = [];
			_getChildren(_nodeOpts.children, $(_node).next());
			return _nodeOpts;
		} else
		{
			return null;
		}
	};
	function _update(_target, _param)
	{
		var _opts = $.data(_target, "tree").options;
		var _node = $(_param.target);
		var _nodeOpts = _getNode(_target, _param.target);
		if (_nodeOpts.iconCls)
		{
			_node.find(".tree-icon").removeClass(_nodeOpts.iconCls);
		}
		var _newNodeOpts = $.extend({},
		_nodeOpts, _param);
		$.data(_param.target, "tree-node", _newNodeOpts);
		_node.attr("node-id", _newNodeOpts.id);
		_node.find(".tree-title").html(_opts.formatter.call(_target, _newNodeOpts));
		if (_newNodeOpts.iconCls)
		{
			_node.find(".tree-icon").addClass(_newNodeOpts.iconCls);
		}
		if (_nodeOpts.checked != _newNodeOpts.checked)
		{
			_check(_target, _param.target, _newNodeOpts.checked);
		}
	};
	function _getNode(_target, _node)
	{
		var _nodeOpts = $.extend({},
		$.data(_node, "tree-node"), {
			target: _node,
			checked: $(_node).find(".tree-checkbox").hasClass("tree-checkbox1")
		});
		if (!_isLeaf(_target, _node))
		{
			_nodeOpts.state = $(_node).find(".tree-hit").hasClass("tree-expanded") ? "open" : "closed";
		}
		return _nodeOpts;
	};
	function _find(_target, id)
	{
		var _jnodes = $(_target).find("div.tree-node[node-id=\"" + id + "\"]");
		if (_jnodes.length)
		{
			return _getNode(_target, _jnodes[0]);
		} else
		{
			return null;
		}
	};
	function _select(_target, _node)
	{
		var _opts = $.data(_target, "tree").options;
		var _nodeOpts = _getNode(_target, _node);
		if (_opts.onBeforeSelect.call(_target, _nodeOpts) == false)
		{
			return;
		}
		$("div.tree-node-selected", _target).removeClass("tree-node-selected");
		$(_node).addClass("tree-node-selected");
		_opts.onSelect.call(_target, _nodeOpts);
	};
	function _isLeaf(_target, _node)
	{
		var _jnode = $(_node);
		var hit = _jnode.children("span.tree-hit");
		return hit.length == 0;
	};
	function _beginEdit(_target, _node)
	{
		var _opts = $.data(_target, "tree").options;
		var _nodeOpts = _getNode(_target, _node);
		if (_opts.onBeforeEdit.call(_target, _nodeOpts) == false)
		{
			return;
		}
		$(_node).css("position", "relative");
		var nt = $(_node).find(".tree-title");
		var _e5 = nt.outerWidth();
		nt.empty();
		var _treeEditor = $("<input class=\"tree-editor\">").appendTo(nt);
		_treeEditor.val(_nodeOpts.text).focus();
		_treeEditor.width(_e5 + 20);
		_treeEditor.height(document.compatMode == "CSS1Compat" ? (18 - (_treeEditor.outerHeight() - _treeEditor.height())) : 18);
		_treeEditor.bind("click",
		function (e)
		{
			return false;
		}).bind("mousedown",
		function (e)
		{
			e.stopPropagation();
		}).bind("mousemove",
		function (e)
		{
			e.stopPropagation();
		}).bind("keydown",
		function (e)
		{
			if (e.keyCode == 13)
			{
				_endEdit(_target, _node);
				return false;
			} else
			{
				if (e.keyCode == 27)
				{
					_cancelEdit(_target, _node);
					return false;
				}
			}
		}).bind("blur",
		function (e)
		{
			e.stopPropagation();
			_endEdit(_target, _node);
		});
	};
	function _endEdit(_target, _node)
	{
		var _opts = $.data(_target, "tree").options;
		$(_node).css("position", "");
		var _eb = $(_node).find("input.tree-editor");
		var val = _eb.val();
		_eb.remove();
		var _nodeOpts = _getNode(_target, _node);
		_nodeOpts.text = val;
		_update(_target, _nodeOpts);
		_opts.onAfterEdit.call(_target, _nodeOpts);
	};
	function _cancelEdit(_target, _node)
	{
		var _opts = $.data(_target, "tree").options;
		$(_node).css("position", "");
		$(_node).find("input.tree-editor").remove();
		var _f1 = _getNode(_target, _node);
		_update(_target, _f1);
		_opts.onCancelEdit.call(_target, _f1);
	};
	$.fn.tree = function (_options, _param)
	{
		if (typeof _options == "string")
		{
			return $.fn.tree.methods[_options](this, _param);
		}
		var _options = _options || {};
		var me = this.each(function ()
		{
			var _state = $.data(this, "tree");
			var _opts;
			if (_state)
			{
				_opts = $.extend(_state.options, _options);
				_state.options = _opts;
			} else
			{
				_opts = $.extend({},
				$.fn.tree.defaults, $.fn.tree.parseOptions(this), _options);
				$.data(this, "tree", {
					options: _opts,
					tree: _wrapTree(this)
				});
				var _data = _parseData(this);
				if (_data.length && !_opts.data)
				{
					_opts.data = _data;
				}
			}
			_bindEvent(this);
			if (_opts.lines)
			{
				$(this).addClass("tree-lines");
			}
			if (_opts.data)
			{
				_loadData(this, this, _opts.data);
			} else
			{
				if (_opts.dnd)
				{
					_enableDnd(this);
				} else
				{
					_disableDnd(this);
				}
			}
			_ajaxLoad(this, this);
		});

		$.each($.fn.tree.methods, function (name, body)
		{
			me[name] = function ()
			{
				var args = Array.prototype.slice.call(arguments);
				return body.apply($.fn.tree.methods, [me].concat(args));
			}
		});

		_options.me = me;
		return me;
	};
	$.fn.tree.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "tree").options;
		},
		loadData: function (jq, _param)
		{
			return jq.each(function ()
			{
				_loadData(this, this, _param);
			});
		},
		getNode: function (jq, _param)
		{
			return _getNode(jq[0], _param);
		},
		getData: function (jq, _param)
		{
			return _getData(jq[0], _param);
		},
		reload: function (jq, _param)
		{
			return jq.each(function ()
			{
				if (_param)
				{
					var _fb = $(_param);
					var hit = _fb.children("span.tree-hit");
					hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
					_fb.next().remove();
					_expand(this, _param);
				} else
				{
					$(this).empty();
					_ajaxLoad(this, this);
				}
			});
		},
		getRoot: function (jq)
		{
			return _getRoot(jq[0]);
		},
		getRoots: function (jq)
		{
			return _getRoots(jq[0]);
		},
		getParent: function (jq, _param)
		{
			return _getParent(jq[0], _param);
		},
		getChildren: function (jq, _param)
		{
			return _getChildren(jq[0], _param);
		},
		getChecked: function (jq, _param)
		{
			return _getChecked(jq[0], _param);
		},
		getSelected: function (jq)
		{
			return _getSelected(jq[0]);
		},
		isLeaf: function (jq, _param)
		{
			return _isLeaf(jq[0], _param);
		},
		find: function (jq, id)
		{
			return _find(jq[0], id);
		},
		select: function (jq, _param)
		{
			return jq.each(function ()
			{
				_select(this, _param);
			});
		},
		check: function (jq, _param)
		{
			return jq.each(function ()
			{
				_check(this, _param, true);
			});
		},
		uncheck: function (jq, _param)
		{
			return jq.each(function ()
			{
				_check(this, _param, false);
			});
		},
		collapse: function (jq, _param)
		{
			return jq.each(function ()
			{
				_collapse(this, _param);
			});
		},
		expand: function (jq, _param)
		{
			return jq.each(function ()
			{
				_expand(this, _param);
			});
		},
		collapseAll: function (jq, _param)
		{
			return jq.each(function ()
			{
				_collapseAll(this, _param);
			});
		},
		expandAll: function (jq, _param)
		{
			return jq.each(function ()
			{
				_expandAll(this, _param);
			});
		},
		expandTo: function (jq, _param)
		{
			return jq.each(function ()
			{
				_expandTo(this, _param);
			});
		},
		scrollTo: function (jq, _param)
		{
			return jq.each(function ()
			{
				_scrollTo(this, _param);
			});
		},
		toggle: function (jq, _param)
		{
			return jq.each(function ()
			{
				_toggle(this, _param);
			});
		},
		append: function (jq, _10a)
		{
			return jq.each(function ()
			{
				_append(this, _10a);
			});
		},
		insert: function (jq, _param)
		{
			return jq.each(function ()
			{
				_insert(this, _param);
			});
		},
		remove: function (jq, _param)
		{
			return jq.each(function ()
			{
				_remove(this, _param);
			});
		},
		pop: function (jq, _param)
		{
			var node = jq.tree("getData", _param);
			jq.tree("remove", _param);
			return node;
		},
		update: function (jq, _param)
		{
			return jq.each(function ()
			{
				_update(this, _param);
			});
		},
		enableDnd: function (jq)
		{
			return jq.each(function ()
			{
				_enableDnd(this);
			});
		},
		disableDnd: function (jq)
		{
			return jq.each(function ()
			{
				_disableDnd(this);
			});
		},
		beginEdit: function (jq, _param)
		{
			return jq.each(function ()
			{
				_beginEdit(this, _param);
			});
		},
		endEdit: function (jq, _param)
		{
			return jq.each(function ()
			{
				_endEdit(this, _param);
			});
		},
		cancelEdit: function (jq, _param)
		{
			return jq.each(function ()
			{
				_cancelEdit(this, _param);
			});
		}
	};
	$.fn.tree.parseOptions = function (_target)
	{
		var t = $(_target);
		return $.extend({},
		$.parser.parseOptions(_target, ["url", "method", {
			checkbox: "boolean",
			cascadeCheck: "boolean",
			onlyLeafCheck: "boolean"
		},
		{
			animate: "boolean",
			lines: "boolean",
			dnd: "boolean"
		}]));
	};
	$.fn.tree.defaults = {
		url: null,
		method: "post",
		animate: false,
		checkbox: false,
		cascadeCheck: true,
		onlyLeafCheck: false,
		lines: false,
		dnd: false,
		data: null,
		queryParams: {},
		attachParams: {}, //附带参数

		formatter: function (node)
		{
			return node.text;
		},
		loader: function (_target, _reloadCallBack, _errorCallBack)
		{
			var _opts = $(this).tree("options");
			if (!_opts.url)
			{
				return false;
			}
			var _param = JSON ? JSON.stringify(_opts.queryParams) : String.toSerialize(_opts.queryParams);
			var _param = { loadinfo: _param };
			_param = $.extend(_param, _opts.attachParams);
			$.ajax({
				type: _opts.method,
				url: _opts.url,
				data: _param,
				dataType: "json",
				success: function (_data)
				{
					_reloadCallBack(_data);
				},
				error: function ()
				{
					_errorCallBack.apply(this, arguments);
				}
			});
			/*
			$.ajax({
			type: _opts.method,
			url: _opts.url,
			data: _target,
			dataType: "json",
			success: function(data) {
			_reloadCallBack(data);
			},
			error: function() {
			_param.apply(this, arguments);
			}
			});*/
		},
		loadFilter: function (data, _116)
		{
			return data;
		},
		onBeforeLoad: function (node, _117) { },
		onLoadSuccess: function (node, data) { },
		onLoadError: function () { },
		onClick: function (node) { },
		onDblClick: function (node) { },
		onBeforeExpand: function (node) { },
		onExpand: function (node) { },
		onBeforeCollapse: function (node) { },
		onCollapse: function (node) { },
		onBeforeCheck: function (node, _118) { },
		onCheck: function (node, _119) { },
		onBeforeSelect: function (node) { },
		onSelect: function (node) { },
		onContextMenu: function (e, node) { },
		onBeforeDrag: function (node) { },
		onStartDrag: function (node) { },
		onStopDrag: function (node) { },
		onDragEnter: function (_11a, _11b) { },
		onDragOver: function (_11c, _11d) { },
		onDragLeave: function (_11e, _11f) { },
		onBeforeDrop: function (_120, _121, _122) { },
		onDrop: function (_123, _124, _125) { },
		onBeforeEdit: function (node) { },
		onAfterEdit: function (node) { },
		onCancelEdit: function (node) { }
	};
})(jQuery);

(function($) {
	function _scrollTop(_target, _value) {
		var _panel = $(_target).combo("panel");
		var _item = _panel.find("div.combobox-item[value='" + _value + "']");
		if (_item.length) {
			if (_item.position().top <= 0) {
				var h = _panel.scrollTop() + _item.position().top;
				_panel.scrollTop(h);
			} else {
				if (_item.position().top + _item.outerHeight() > _panel.height()) {
					var h = _panel.scrollTop() + _item.position().top + _item.outerHeight() - _panel.height();
					_panel.scrollTop(h + 30);
				}
			}
		}
	};
	function _keyup(_target) {
		var _panel = $(_target).combo("panel");
		var _values = $(_target).combo("getValues");
		var _item = _panel.find("div.combobox-item[value='" + _values.pop() + "']");
		if (_item.length) {
			var _itemVisible = _item.prev(":visible");
			if (_itemVisible.length) {
				_item = _itemVisible;
			}
		} else {
			_item = _panel.find("div.combobox-item:visible:last");
		}
		var _value = _item.attr("value");
		_select(_target, _value);
		_scrollTop(_target, _value);
	};
	function _keydown(_target) {
		var _opts = $.data(_target, "combobox").options;
		var _panel = $(_target).combo("panel");
		var _text = $(_target).combo("getText");
		var _item = _panel.find("div.combobox-item:contains('" + _text + "')");
		
		if(_opts.isHidden)
		{
			$(_target).combobox("showPanel");
			return;
		}
		if (_item.length) {
			var _itemVisible = _item.next(":visible");
			if (_itemVisible.length) {
				_item = _itemVisible;
			}
		} else {
			_item = _panel.find("div.combobox-item:visible:first");
		}
		var _value = _item.attr("value");
		_select(_target, _value);
		_scrollTop(_target, _value);
	};
	function _select(_target, _value) {
    if(_value===undefined)_value=null;//return; //by xtb 2013-10-13
		var _opts = $.data(_target, "combobox").options;
		var _boxData = $.data(_target, "combobox").data;
		if (_opts.multiple) {
			var _oldValues = $(_target).combo("getValues");
			if(_opts.fieldRelation)	//字段映射
      {
        var valueFieldRelation='';
        $.each(_opts.fieldRelation, function(i, item)
        {
          $.each(item, function(readField, writeField)
          {
            if(readField==_opts.valueField)
            {
              valueFieldRelation=writeField;
            }
          });
        });
        if(valueFieldRelation && _opts.relationer && _opts.relationer.getValue)
        {
          _oldValues=_opts.relationer.getValue(valueFieldRelation);
          if(_oldValues)
          {
            _oldValues = _oldValues.toString();
            _oldValues=_oldValues.split(',');
          }
        }
      }
			var _values=[];
      var exist=false;
      if($.isArray(_oldValues))
      {
        $.each(_oldValues, function(i,_value)
        {
          if(_value!=='')_values.push(_value);
        });
        for (var i = 0; i < _values.length; i++) {
          if (_values[i] == _value) {
            exist=true;
          }
        }
      }
      if(!exist)_values.push(_value);

      _setFieldRelation(_target, _values);
      _setValues(_target, _values);
		} else {
			if(_opts.fieldRelation && _opts.relationer)	//字段映射，主要用于多字段选择
			{
				var dataset = _opts.data;
				for (var i = 0; i < dataset.length; i++)
				{
					var dataitem=dataset[i];
					if (dataitem[_opts.valueField] == _value) 
					{
						$.each(dataitem, function(readField, readValue)
						{
							var writeField='';
							$.each(_opts.fieldRelation, function(i, item)
							{
								if(item[readField]){
									writeField=item[readField];
									return false;
								}
							});
							if(writeField)
							{
								var writeValue = dataitem[readField];
								if(readField==_opts.valueField)
								{
									_setValues(_target, [writeValue]);
								}
								if(_opts.relationer)
								{
									_opts.relationer.setValue(writeField, writeValue);
								}
							}
						});
						break;
					}
				}
			}
			else
			{
				_setValues(_target, [_value]);
        if(_opts.relationer)
        {
          _opts.relationer.setValue(_opts.relationer.fieldName, _value);
        }
			}
		}
		for (var i = 0; i < _boxData.length; i++) {
			if (_boxData[i][_opts.valueField] == _value) {
				_opts.onSelect.call(_target, _boxData[i]);
				return;
			}
		}
	};
	function _unselect(_target, _value) {
		var _opts = $.data(_target, "combobox").options;
		var _boxData = $.data(_target, "combobox").data;
		var _values = $(_target).combo("getValues");
    if(_opts.fieldRelation)	//字段映射
    {
      var valueFieldRelation='';
      $.each(_opts.fieldRelation, function(i, item)
      {
        $.each(item, function(readField, writeField)
        {
          if(readField==_opts.valueField)
          {
            valueFieldRelation=writeField;
          }
        });
      });
      if(valueFieldRelation && _opts.relationer && _opts.relationer.getValue)
      {
        _values=_opts.relationer.getValue(valueFieldRelation);
        if(_values)_values=_values.split(',');
      }
    }
		for (var i = 0; i < _values.length; i++) {
			if (_values[i] == _value) {
				_values.splice(i, 1);
				break;
			}
		}
    _setFieldRelation(_target, _values);
    _setValues(_target, _values);
		for (var i = 0; i < _boxData.length; i++) {
			if (_boxData[i][_opts.valueField] == _value) {
				_opts.onUnselect.call(_target, _boxData[i]);
				return;
			}
		}
	};
  function _setFieldRelation(_target, _values)
  {
		var _opts = $.data(_target, "combobox").options;
    if(_opts.fieldRelation)
    {
      $.each(_opts.fieldRelation, function(i, fieldItem)	//字段映射，主要用于多字段选择
      {
        var currentField, relationField;
        $.each(fieldItem, function(key, text) //关联字段原始字段名与映射字段名
        {
          currentField=key;
          relationField=text;
          return false;
        });

        var dataset = _opts.data;
        var _texts='';
        $.each(_values, function(i, _value)
        {
          var dataitem=dataset.find(_opts.valueField, _value);
          if(!dataitem)
          {
            _values=[];
            return false;
          }
          if(_texts)_texts+=',';
          var dataType = _opts.relationer.getDataType(relationField); //映射字段信息
          switch (dataType)
          {
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'Single':
            case 'Byte':
            case 'ByteArray':
            case 'Decimal':
            case 'Double':
              _texts+=dataitem[currentField];
              break;
            default:
              _texts+=dataitem[currentField];
              break;
          }
        });
        _opts.relationer.setValue(relationField, _texts);
      });
    }
    else
    {
      if(_opts.relationer)
      {
        _opts.relationer.setValue(_opts.relationer.fieldName, _values.toString());
      }
    }
  }
	function _setValues(_target, _values, _remainText) {
    if(!$.data(_target, "combobox"))return;
		var _opts = $.data(_target, "combobox").options;
		var _boxData = $.data(_target, "combobox").data;
		var _panel = $(_target).combo("panel");
		_panel.find("div.combobox-item-selected").removeClass("combobox-item-selected");
		_panel.find("span.tree-checkbox").removeClass("tree-checkbox1").addClass("tree-checkbox0");
		
    if(_opts.fieldRelation)	//字段映射
    {
      var valueFieldRelation='';
      $.each(_opts.fieldRelation, function(i, item)
      {
        $.each(item, function(readField, writeField)
        {//alert(readField + ', '+_opts.valueField);
          if(readField==_opts.valueField)
          {
            valueFieldRelation=writeField;
          }
        });
      });
      if(valueFieldRelation && _opts.relationer && _opts.relationer.getValue)
      {
        _values=_opts.relationer.getValue(valueFieldRelation);
        if(typeof _values=="number")_values=_values.toString();
        if(_values && typeof _values=="string")_values=_values.split(',');
      }
    }
    if(!_values)return;

    var vv = [], ss = [];
		for (var i = 0; i < _values.length; i++) {
			var v = _values[i];
			var s = v;
			for (var j = 0; j < _boxData.length; j++) {
				if (_boxData[j][_opts.valueField] == v) {
					s = _boxData[j][_opts.textField];
					break;
				}
			}
			vv.push(v);
			ss.push(s);
			_panel.find("div.combobox-item[value='" + v + "']").addClass("combobox-item-selected")
				.find("span.tree-checkbox").removeClass("tree-checkbox0").addClass("tree-checkbox1");
		}
		$(_target).combo("setValues", vv);

		if (!_remainText) {
			$(_target).combo("setText", ss.join(_opts.separator));
		}
	};
	function _getInitValues(_target) {
		var _opts = $.data(_target, "combobox").options;
		var _values = [];
		$(">option", _target).each(function() {
			var _item = {};
			_item[_opts.valueField] = $(this).attr("value") !== undefined ? $(this).attr("value") : $(this).html();
			_item[_opts.textField] = $(this).html();
			_item["selected"] = $(this).attr("selected");
			_values.push(_item);
		});
		return _values;
	};
	function _loadData(_target, _boxData, _remainText) {
		var _opts = $.data(_target, "combobox").options;
		var _panel = $(_target).combo("panel");
		$.data(_target, "combobox").data = _boxData;	//数据结构：[{},{}]
		var _values = $(_target).combobox("getValues");
    var _filterdata = _boxData;
    if(_opts.navbar)
    {
  		_panel.find('.combobox-nav-boby').empty();
      if(_opts.navbar.filterKey && _opts.navbar.filterValue!==null && _opts.navbar.filterValue!==undefined)
      {
        _filterdata = _boxData.findAll(_opts.navbar.filterKey, _opts.navbar.filterValue);
      }
    }
    else
    {
  		_panel.empty();
    }
		for (var i = 0; i < _filterdata.length; i++) {
			var v = _filterdata[i][_opts.valueField];
			var _text = _filterdata[i][_opts.textField];
      var _item = null;
      if(_opts.navbar)
      {
			  _item = $("<div class=\"combobox-item combobox-nav-item\"></div>").appendTo(_panel.find('.combobox-nav-boby'));
        if(_opts.navbar.itemWidth)
        {
          _item.css({width:_opts.navbar.itemWidth, overflow:'hidden'});
        }
      }
      else
      {
			  _item = $("<div class=\"combobox-item\"></div>").appendTo(_panel);
      }
			_item.attr("value", v);
			
			if (_opts.formatter) {
				_text=_opts.formatter.call(_target, _filterdata[i]);
			}
			if (_opts.checkbox) {
				_text='<SPAN class="tree-checkbox tree-checkbox0"></SPAN>' + _text;
			}
			_item.html(_text);

			if (_filterdata[i]["selected"]) { 
				(function() {
					for (var i = 0; i < _values.length; i++) {
						if (v == _values[i]) {
							return;
						}
					}
					_values.push(v);
				})();
			}
		}
		if (_opts.multiple) {
			_setValues(_target, _values, _remainText);
		} else {
			if (_values.length) {
				_setValues(_target, [_values[_values.length - 1]], _remainText);
			} else {
				_setValues(_target, [], _remainText);
			}
		}
		_opts.onLoadSuccess.call(_target, _filterdata);
		$(".combobox-item", _panel).hover(function() {
			$(this).addClass("combobox-item-hover");
		},
		function() {
			$(this).removeClass("combobox-item-hover");
		}).click(function(e) {
			var _item = $(this);
			if (_opts.multiple) {
				if (_item.hasClass("combobox-item-selected")) {
					_unselect(_target, _item.attr("value"));
				} else {
					_select(_target, _item.attr("value"));
				}
			} else {
				_select(_target, _item.attr("value"));
				$(_target).combo("hidePanel");
			}
			e.stopPropagation(); 
		});
	};
  function _filterData(_target, filterValue)
  {
		var _opts = $.data(_target, "combobox").options;
    _opts.navbar.filterValue = filterValue;
    var _data = $.data(_target, "combobox").data;
    _loadData(_target, _data);
  }
	function _reload(_target, url, _queryParams, _remainText) {
		var _opts = $.data(_target, "combobox").options;
		if (url) {
			_opts.url = url;
		}
		if (!_opts.url) {
			return;
		}
		_queryParams = _queryParams || {};
		$.ajax({
			type: _opts.method,
			url: _opts.url,
			dataType: "json",
			data: _queryParams,
			success: function(_data) {
				_loadData(_target, _data, _remainText);
			},
			error: function() {
				_opts.onLoadError.apply(this, arguments);
			}
		});
	};
	function _query(_target, q) {
		var _opts = $.data(_target, "combobox").options;
    var _boxData = $.data(_target, "combobox").data;
		if (_opts.multiple && !q) {
			_setValues(_target, [], true);
		} else {
      var d = _boxData.find(_opts.textField, q);
      var _text='';
      if(d)_text=_boxData[i][_opts.textField];
			_setValues(_target, [_text], true);
		}
		if (_opts.mode == "remote") {
			_reload(_target, null, {
				q: q
			},
			true);
		} else {
			var _panel = $(_target).combo("panel");
			_panel.find("div.combobox-item").hide();
			for (var i = 0; i < _boxData.length; i++) {
				if (_opts.filter.call(_target, q, _boxData[i])) {
					var v = _boxData[i][_opts.valueField];
					var s = _boxData[i][_opts.textField];
					var _item = _panel.find("div.combobox-item[value='" + v + "']");
					_item.show();
          /*var _text = s;
          var styleFont = q.toUpperCase();
          _text = _text.replace(eval('/'+styleFont+'/g'), '<span style="color:red;font-weight:bold;">'+styleFont+'</span>');
          var styleFont = q.toLowerCase();
          _text = _text.replace(eval('/'+styleFont+'/g'), '<span style="color:red;font-weight:bold;">'+styleFont+'</span>');
          _item.html(_text);*/
					if (s.toLowerCase() == q.toLowerCase()) {
						_setValues(_target, [v], true);
						//_item.addClass("combobox-item-selected");
            _select(_target, v);
					}
				}
			}
		}
	};
	function _initCombo(_target) {
		var _opts = $.data(_target, "combobox").options;
		//$(_target).addClass("combobox-f");
		$(_target).combo($.extend({},
		_opts, {
			onShowPanel: function() {
				var _panel = $(_target).combo("panel");
        _panel.find("div.combobox-item").show();
				_scrollTop(_target, $(_target).combobox("getValue"));
				_opts.isHidden=false;
        var _top = _panel.find('.combobox-nav-head').outerHeight();
        _panel.find('.combobox-nav-boby').css({top: _top});
				_opts.onShowPanel.call(_target);
			},
			onHidePanel:function()
			{
				_opts.isHidden=true;
				_opts.onHidePanel.call(_target);
			}
		}));
		var _panel = $(_target).combo("panel");
    if(_opts.navbar)
    {
      _panel.addClass('combobox-nav-panel');
      if(_opts.navbar.data && _opts.navbar.data.length)
      {
        var _header = $('<div class="combobox-nav-head"><ul></ul></div>').appendTo(_panel);
        $.each(_opts.navbar.data, function(i, item){
          var li=$('<li>'+item.Name+'</li>').appendTo(_header.find('ul'));
          li.attr('value', item.ID);
        });
        _header.find('ul li').click(function(){
          _header.find('ul li').removeClass('selected');
          $(this).addClass('selected');
    			var filterValue=$(this).attr("value");
          _filterData(_target, filterValue);
        });
        $('<div class="combobox-nav-boby"></div>').appendTo(_panel);
      }
      else
      {
        _panel.append('<div class="combobox-nav-boby combobox-nav-nohead"></div>');
      }
    }
	};
	$.fn.combobox = function(_options, _param) {
		if (typeof _options == "string") {
			var _method = $.fn.combobox.methods[_options];
			if (_method) {
				return _method(this, _param);
			} else {
				return this.combo(_options, _param);
			}
		}
		_options = _options || {};
		var jme=this;
		var me = this.each(function() {
			this.jme=jme;
			var _data = $.data(this, "combobox");
			if (_data) {
				$.extend(_data.options, _options);
				_initCombo(this);
			} else {
				_data = $.data(this, "combobox", {
					options: $.extend({},
					$.fn.combobox.defaults, $.fn.combobox.parseOptions(this), _options)
				});
				_initCombo(this);
				_loadData(this, _getInitValues(this));
			}
			if (_data.options.data) {
				_loadData(this, _data.options.data);
			}
      if(_data.options.value)
      {
        $(this).combo("setValues", [_data.options.value]);
        $(this).combo("setText", _data.options.text);
      }
			_reload(this);
		});

    $.each($.fn.combobox.methods, function (name, body)
    {
      me[name] = function () 
      {
        var args = Array.prototype.slice.call(arguments);
        return body.apply($.fn.combobox.methods, [me].concat(args)); 
      }
    });

    _options.me = me;
    return me;
	};
	$.fn.combobox.methods = {
		options: function(jq) {
			return $.data(jq[0], "combobox").options;
		},
		setzIndex:function(jq, zIndex)
		{
			var _panel = $.data(jq[0], "combo").panel;
			$.fn.window.defaults.zIndex = zIndex;
			_panel.panel("panel").css("z-index", zIndex);
		},
		getData: function(jq) {
			return $.data(jq[0], "combobox").data;
		},
		setValues: function(jq, _values) {
			return jq.each(function() {
				_setValues(this, _values);
			});
		},
		setValue: function(jq, _value) {
			return jq.each(function() {
				_setValues(this, [_value]);
			});
		},
		clear: function(jq) {
			return jq.each(function() {
				$(this).combo("clear");
				var _panel = $(this).combo("panel");
				_panel.find("div.combobox-item-selected").removeClass("combobox-item-selected");
        _panel.find("div.combobox-item").remove();
			});
		},
		loadData: function(jq, _boxData) {
			return jq.each(function() {
				_loadData(this, _boxData);
			});
		},
		reload: function(jq, url) {
			return jq.each(function() {
				_reload(this, url);
			});
		},
		select: function(jq, _value) {
			return jq.each(function() {
				_select(this, _value);
			});
		},
		unselect: function(jq, _value) {
			return jq.each(function() {
				_unselect(this, _value);
			});
		},
		translator: function(jq, _values)
		{
			var _opts = $.data(jq[0], "combobox").options;
			var _boxData = _opts.data;
			var _text = '';
      if(!_boxData || _values===null)return '';

      $.each(_values, function(i, _value){
        for (var i = 0; i < _boxData.length; i++)
        {
          if(_boxData[i][_opts.valueField]!=undefined && _value!=undefined && _boxData[i][_opts.valueField].toString()===_value.toString())
          {
            if(_text)_text+=",";
            _text+=_boxData[i][_opts.textField];
            break;
          }
        }
      });
      if(!_text)_text=_values.toString();

			return _text;
		},
		antitranslator: function(jq, _text)
		{
			var _opts = $.data(jq[0], "combobox").options;
			var _boxData = _opts.data;
			var _value = _text ;
			for (var i = 0; i < _boxData.length; i++)
			{
				if(_boxData[i][_opts.textField]==_text)
				{
					_value=_boxData[i][_opts.valueField];
					break;
				}
			}
			return _value;
		}
	};
	$.fn.combobox.parseOptions = function(_target) {
		var t = $(_target);
		return $.extend({},
		$.fn.combo.parseOptions(_target), {
			valueField: t.attr("valueField"),
			textField: t.attr("textField"),
			mode: t.attr("mode"),
			method: (t.attr("method") ? t.attr("method") : undefined),
			url: t.attr("url")
		});
	};
	$.fn.combobox.defaults = $.extend({},
	$.fn.combo.defaults, {
		valueField: "value",
		textField: "text",
		mode: "local",
		method: "post",
		url: null,
		data: null,
		fieldRelation: null,	//下拉框行数据字段名与写入字段名映射关系
		checkbox:false,	//显示选择框
		/**************************************
    关联数据行
		relationer={
			dataRow:[{字段名 :字段值},{字段名 :字段值}],
			setValue:function(fieldName, value){}
		}
    和其他组合控件数据关联操作器
		**************************************/
		relationer:null,
		keyHandler: {
			up: function() {
				_keyup(this);
			},
			down: function() {
				_keydown(this);
			},
			enter: function(e) {
				var _opts = $(this).combobox("options");
				if(_opts.isHidden)
				{
					window.event.keyCode=9;
				}
				else
				{
					var _values = $(this).combobox("getValues");
					$(this).combobox("setValues", _values);
					$(this).combobox("hidePanel");
				}
			},
			query: function(q) {
				_query(this, q);
			}
		},
		filter: function(q, row) {
			var _opts = $(this).combobox("options");
      var _text = row[_opts.textField];
      if(_text)_text=_text.toLowerCase();
      q=q.toLowerCase();
			return _text.indexOf(q) == 0;
		},
		formatter: function(row) {
			var _opts = $(this).combobox("options");
			return row[_opts.textField];
		},
		onLoadSuccess: function() {},
		onLoadError: function() {},
		onSelect: function(_record) {},
		onUnselect: function(_record) {}
	});
})(jQuery);

(function($) {
	function _createComboTree(_target) {
		var _opts = $.data(_target, "combotree").options;
		var _tree = $.data(_target, "combotree").tree;
		$(_target).addClass("combotree-f");
		$(_target).combo(_opts);
		var _panel = $(_target).combo("panel");
		if (!_tree) {
			_tree = $("<ul></ul>").appendTo(_panel);
			$.data(_target, "combotree").tree = _tree;
		}
		_tree.tree($.extend({},
		_opts, {
			checkbox: _opts.multiple,
			onLoadSuccess: function(_node, _data) {
				var _values = $(_target).combotree("getValues");
				if (_opts.multiple) {
					var _checked = _tree.tree("getChecked");
					for (var i = 0; i < _checked.length; i++) {
						var id = _checked[i].id; (function() {
							for (var i = 0; i < _values.length; i++) {
								if (id == _values[i]) {
									return;
								}
							}
							_values.push(id);
						})();
					}
				}
				//$(_target).combotree("setValues", _values);
				_opts.onLoadSuccess.call(this, _node, _data);
			},
			onClick: function(_node) {
        if (_opts.onBeforeClick.call(this, _node, _target) == false) {
          return;
        }
				_setClickValues(_target);
				$(_target).combo("hidePanel");
				_opts.onClick.call(this, _node, _target);
			},
			onCheck: function(_nodeOpts, _checked) {
				_setClickValues(_target);
				_opts.onCheck.call(this, _nodeOpts, _checked);
			}
		}));
	};
	function _setClickValues(_target) {
		var _opts = $.data(_target, "combotree").options;
		var _tree = $.data(_target, "combotree").tree;
		var vv = [],
		ss = [];
		if (_opts.multiple) {
			var _checked = _tree.tree("getChecked");
			for (var i = 0; i < _checked.length; i++) {
				vv.push(_checked[i].id);
				ss.push(_checked[i].text);
			}
      _setFieldRelation(_target, vv);
		} else {
			var _selected = _tree.tree("getSelected");
			if (_selected) {
				vv.push(_selected.id);
				ss.push(_selected.text);
			}
      var _values=new Object();
      _values[_opts.valueField]=_selected.id;
      _values[_opts.textField]=_selected.text;
      _values[_opts.attributes]=_selected.attributes;
			if(_opts.fieldRelation)	//字段映射，主要用于多字段选择
			{
        $.each(_opts.fieldRelation, function(i,item){
          $.each(item, function(name,text){
            _opts.relationer.setValue(text, _selected[name]);
          });
        });
      }
      else
      {
        _setValues(_target, vv);
      }
    }
		//$(_target).combo("setValues", vv).combo("setText", ss.join(_opts.separator));
	};
  function _setFieldRelation(_target, _values)
  {
		var _opts = $.data(_target, "combotree").options;
    if(_opts.fieldRelation)
    {
      $.each(_opts.fieldRelation, function(i, fieldItem)	//字段映射，主要用于多字段选择
      {
        var currentField, relationField;
        $.each(fieldItem, function(key, text) //关联字段原始字段名与映射字段名
        {
          currentField=key;
          relationField=text;
          return false;
        });

        var dataset = _opts.data;
        var _texts='';
        $.each(_values, function(i, _value)
        {
          var tree=$(_target).combotree('tree');
          var dataitem=tree.tree('find', _value);
          if(!dataitem)
          {
            _values=[];
            return false;
          }
          if(_texts)_texts+=',';
          var dataType = _opts.relationer.getDataType(relationField); //映射字段信息
          switch (dataType)
          {
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'Single':
            case 'Byte':
            case 'ByteArray':
            case 'Decimal':
            case 'Double':
              _texts+=dataitem[currentField];
              break;
            default:
              _texts+=dataitem[currentField];
              break;
          }
        });
        _opts.relationer.setValue(relationField, _texts);
      });
    }
    else
    {
      if(_opts.relationer)
      {
        _opts.relationer.setValue(_opts.relationer.fieldName, _values.toString());
      }
    }
  }
	function _setValues(_target, _values) {
		var _opts = $.data(_target, "combotree").options;
		var _tree = $.data(_target, "combotree").tree;
		$(_tree).find("span.tree-checkbox").addClass("tree-checkbox0").removeClass("tree-checkbox1 tree-checkbox2");
		var vv = [],
		ss = [];
		for (var i = 0; i < _values.length; i++) {
			var v = _values[i];
			var s = v;
			var _proxy = _tree.tree("find", v);
			if (_proxy) {
				s = _proxy.text;
				_tree.tree("check", _proxy.target);
				_tree.tree("select", _proxy.target);
			}
			vv.push(v);
			ss.push(s);
		}
		$(_target).combo("setValues", vv).combo("setText", ss.join(_opts.separator));
	};
	$.fn.combotree = function(_options, _param) {
		if (typeof _options == "string") {
			var _method = $.fn.combotree.methods[_options];
			if (_method) {
				return _method(this, _param);
			} else {
				return this.combo(_options, _param);
			}
		}
		_options = _options || {};
		var jme=this;
		return this.each(function() {
			this.jme=jme;
			var _state = $.data(this, "combotree");
			if (_state) {
				$.extend(_state.options, _options);
			} else {
				$.data(this, "combotree", {
					options: $.extend({},
					$.fn.combotree.defaults, $.fn.combotree.parseOptions(this), _options)
				});
			}
			_createComboTree(this);
		});
	};
	$.fn.combotree.methods = {
		options: function(jq) {
			return $.data(jq[0], "combotree").options;
		},
		tree: function(jq) {
			return $.data(jq[0], "combotree").tree;
		},
		loadData: function(jq, _data) {
			return jq.each(function() {
				var _opts = $.data(this, "combotree").options;
				_opts.data = _data;
				var _tree = $.data(this, "combotree").tree;
				_tree.tree("loadData", _data);
			});
		},
		reload: function(jq, url) {
			return jq.each(function() {
				var _20 = $.data(this, "combotree").options;
				var _target = $.data(this, "combotree").tree;
				if (url) {
					_20.url = url;
				}
				_target.tree({
					url: _20.url
				});
			});
		},
		setValues: function(jq, _values) {
			return jq.each(function() {
				_setValues(this, _values);
			});
		},
		setValue: function(jq, _value) {
			return jq.each(function() {
				_setValues(this, [_value]);
			});
		},
		clear: function(jq) {
			return jq.each(function() {
				var _24 = $.data(this, "combotree").tree;
				_24.find("div.tree-node-selected").removeClass("tree-node-selected");
				$(this).combo("clear");
			});
		}
	};
	$.fn.combotree.parseOptions = function(_opts) {
		return $.extend({},
		$.fn.combo.parseOptions(_opts), $.fn.tree.parseOptions(_opts));
	};
	$.fn.combotree.defaults = $.extend({},
	$.fn.combo.defaults, $.fn.tree.defaults, {
		editable: false,
    onBeforeClick : function(_node, _target){}
	});
})(jQuery);

(function ($)
{
	function _createdatebox(_target)
	{
		var _state = $.data(_target, "datebox");
		var _opts = _state.options;
		$(_target).addClass("datebox-f");
		$(_target).combo($.extend({},
		_opts, {
			onShowPanel: function ()
			{
				$(".timespinner-f:visible").focus();  //by 避免点击两次
				_state.calendar.calendar("resize");
				_opts.onShowPanel.call(_target);
			}
		}));
		$(_target).combo("textbox").parent().addClass("datebox");
		if (!_state.calendar)
		{
			_createDatePanel();
		}
		function _createDatePanel()
		{
			var _panel = $(_target).combo("panel");
			_state.calendar = $("<div></div>").appendTo(_panel).wrap("<div class=\"datebox-calendar-inner\"></div>");
			var _params = {
				fit: true,
				border: false,
				onSelect: function (_oValue)
				{
					var _value = _opts.formatter(_oValue);
					if (_opts.dataType == "month") _value = Globals.formatDate(_oValue, 'yyyy-MM');
					_setValue(_target, _value);
					$(_target).combo("hidePanel");
					_opts.onSelect.call(_target, _value);
				}
			};
			if (_opts.dataType)
			{
				_params.dataType = _opts.dataType;
			}
			_state.calendar.calendar(_params);
			_setValue(_target, _opts.value, _opts.text);
			var _btn = $("<div class=\"datebox-button\"></div>").appendTo(_panel);
			$("<a href=\"javascript:void(0)\" class=\"datebox-current\"></a>").html(_opts.currentText).appendTo(_btn);
			$("<a href=\"javascript:void(0)\" class=\"datebox-clear\"></a>").html(_opts.clearText).appendTo(_btn);
			$("<a href=\"javascript:void(0)\" class=\"datebox-close\"></a>").html(_opts.closeText).appendTo(_btn);
			_btn.find(".datebox-current,.datebox-close,.datebox-clear").hover(function ()
			{
				$(this).addClass("datebox-button-hover");
			},
			function ()
			{
				$(this).removeClass("datebox-button-hover");
			});
			_btn.find(".datebox-current").click(function ()
			{
				_state.calendar.calendar({
					year: new Date().getFullYear(),
					month: new Date().getMonth() + 1,
					current: new Date()
				});
			});
			_btn.find(".datebox-clear").click(function ()
			{
				$(_target).combo("setValue", null).combo("setText", '[无]');
				$(_target).combo("hidePanel");
			});
			_btn.find(".datebox-close").click(function ()
			{
				$(_target).combo("hidePanel");
			});
		};
	};
	function _query(_target, q)
	{
		_setValue(_target, q);
	};
	function _keyEnter(_target)
	{
		var _f = $.data(_target, "datebox").options;
		var c = $.data(_target, "datebox").calendar;
		var _value = _f.formatter(c.calendar("options").current);
		_setValue(_target, _value);
		$(_target).combo("hidePanel");
	};
	function _setValue(_target, _value, _text)
	{
		var _state = $.data(_target, "datebox");
		var _opts = _state.options;
		if (_text == undefined) _text = _value;
		$(_target).combo("setValue", _value).combo("setText", _text);
		_state.calendar.calendar("moveTo", _opts.parser(_value));
	};
	$.fn.datebox = function (_options, _param)
	{
		if (typeof _options == "string")
		{
			var _methods = $.fn.datebox.methods[_options];
			if (_methods)
			{
				return _methods(this, _param);
			} else
			{
				return this.combo(_options, _param);
			}
		}
		_options = _options || {};
		return this.each(function ()
		{
			var _state = $.data(this, "datebox");
			if (_state)
			{
				$.extend(_state.options, _options);
			} else
			{
				$.data(this, "datebox", {
					options: $.extend({},
					$.fn.datebox.defaults, $.fn.datebox.parseOptions(this), _options)
				});
			}
			_createdatebox(this);
		});
	};
	$.fn.datebox.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "datebox").options;
		},
		calendar: function (jq)
		{
			return $.data(jq[0], "datebox").calendar;
		},
		setValue: function (jq, _value)
		{
			return jq.each(function ()
			{
				_setValue(this, _value);
			});
		}
	};
	$.fn.datebox.parseOptions = function (_1a)
	{
		var t = $(_1a);
		return $.extend({},
		$.fn.combo.parseOptions(_1a), {});
	};
	$.fn.datebox.defaults = $.extend({},
	$.fn.combo.defaults, {
		value: null,
		text: '[无]',
		panelWidth: null,
		panelHeight: "auto",
		keyHandler: {
			up: function () { },
			down: function () { },
			enter: function ()
			{
				_keyEnter(this);
			},
			query: function (q)
			{
				_query(this, q);
			}
		},
		currentText: "Today",
		clearText: "清除",
		closeText: "Close",
		okText: "Ok",
		formatter: function (_1b)
		{
			var y = _1b.getFullYear();
			var m = _1b.getMonth() + 1;
			var d = _1b.getDate();
			return m + "/" + d + "/" + y;
		},
		parser: function (s)
		{
			var t = Date.parse(s);
			if (!isNaN(t))
			{
				return new Date(t);
			} else
			{
				return new Date();
			}
		},
		onSelect: function (_value) { }
	});
})(jQuery);
(function ($)
{
	function _1(_2)
	{
		var _3 = $("<span class=\"spinner\">" + "<span class=\"spinner-arrow\">" + "<span class=\"spinner-arrow-up\"></span>" + "<span class=\"spinner-arrow-down\"></span>" + "</span>" + "</span>").insertAfter(_2);
		$(_2).addClass("spinner-text spinner-f").prependTo(_3);
		return _3;
	};
	function _4(_5, _6)
	{
		var _7 = $.data(_5, "spinner").options;
		var _8 = $.data(_5, "spinner").spinner;
		if (_6)
		{
			_7.width = _6;
		}
		var _9 = $("<div style=\"display:none\"></div>").insertBefore(_8);
		_8.appendTo("body");
		if (isNaN(_7.width))
		{
			_7.width = $(_5).outerWidth();
		}
		var _a = _8.find(".spinner-arrow");
		_8._outerWidth(_7.width)._outerHeight(_7.height);
		$(_5)._outerWidth(_8.width() - _a.outerWidth());
		$(_5).css({
			height: _8.height() + "px",
			lineHeight: _8.height() + "px"
		});
		_a._outerHeight(_8.height());
		_a.find("span")._outerHeight(_a.height() / 2);
		_8.insertAfter(_9);
		_9.remove();
	};
	function _b(_c)
	{
		var _d = $.data(_c, "spinner").options;
		var _e = $.data(_c, "spinner").spinner;
		_e.find(".spinner-arrow-up,.spinner-arrow-down").unbind(".spinner");
		if (!_d.disabled)
		{
			_e.find(".spinner-arrow-up").bind("mouseenter.spinner",
			function ()
			{
				$(this).addClass("spinner-arrow-hover");
			}).bind("mouseleave.spinner",
			function ()
			{
				$(this).removeClass("spinner-arrow-hover");
			}).bind("click.spinner",
			function ()
			{
				_d.spin.call(_c, false);
				_d.onSpinUp.call(_c);
				$(_c).validatebox("validate");
			});
			_e.find(".spinner-arrow-down").bind("mouseenter.spinner",
			function ()
			{
				$(this).addClass("spinner-arrow-hover");
			}).bind("mouseleave.spinner",
			function ()
			{
				$(this).removeClass("spinner-arrow-hover");
			}).bind("click.spinner",
			function ()
			{
				_d.spin.call(_c, true);
				_d.onSpinDown.call(_c);
				$(_c).validatebox("validate");
			});
		}
	};
	function _f(_10, _11)
	{
		var _12 = $.data(_10, "spinner").options;
		if (_11)
		{
			_12.disabled = true;
			$(_10).attr("disabled", true);
		} else
		{
			_12.disabled = false;
			$(_10).removeAttr("disabled");
		}
	};
	$.fn.spinner = function (_13, _14)
	{
		if (typeof _13 == "string")
		{
			var _15 = $.fn.spinner.methods[_13];
			if (_15)
			{
				return _15(this, _14);
			} else
			{
				return this.validatebox(_13, _14);
			}
		}
		_13 = _13 || {};
		return this.each(function ()
		{
			var _16 = $.data(this, "spinner");
			if (_16)
			{
				$.extend(_16.options, _13);
			} else
			{
				_16 = $.data(this, "spinner", {
					options: $.extend({},
					$.fn.spinner.defaults, $.fn.spinner.parseOptions(this), _13),
					spinner: _1(this)
				});
				$(this).removeAttr("disabled");
			}
			_16.options.originalValue = _16.options.value;
			$(this).val(_16.options.value);
			$(this).attr("readonly", !_16.options.editable);
			_f(this, _16.options.disabled);
			_4(this);
			$(this).validatebox(_16.options);
			_b(this);
		});
	};
	$.fn.spinner.methods = {
		options: function (jq)
		{
			var _state = $.data(jq[0], "spinner").options;
			return $.extend(_state, {
				value: jq.val()
			});
		},
		destroy: function (jq)
		{
			return jq.each(function ()
			{
				var _proxy = $.data(this, "spinner").spinner;
				$(this).validatebox("destroy");
				_proxy.remove();
			});
		},
		resize: function (jq, _opts)
		{
			return jq.each(function ()
			{
				_4(this, _opts);
			});
		},
		enable: function (jq)
		{
			return jq.each(function ()
			{
				_f(this, false);
				_b(this);
			});
		},
		disable: function (jq)
		{
			return jq.each(function ()
			{
				_f(this, true);
				_b(this);
			});
		},
		getValue: function (jq)
		{
			return jq.val();
		},
		setValue: function (jq, _1a)
		{
			return jq.each(function ()
			{
				var _1b = $.data(this, "spinner").options;
				_1b.value = _1a;
				$(this).val(_1a);
			});
		},
		clear: function (jq)
		{
			return jq.each(function ()
			{
				var _1c = $.data(this, "spinner").options;
				_1c.value = "";
				$(this).val("");
			});
		},
		reset: function (jq)
		{
			return jq.each(function ()
			{
				var _1d = $(this).spinner("options");
				$(this).spinner("setValue", _1d.originalValue);
			});
		}
	};
	$.fn.spinner.parseOptions = function (_1e)
	{
		var t = $(_1e);
		return $.extend({},
		$.fn.validatebox.parseOptions(_1e), $.parser.parseOptions(_1e, ["width", "height", "min", "max", {
			increment: "number",
			editable: "boolean"
		}]), {
			value: (t.val() || undefined),
			disabled: (t.attr("disabled") ? true : undefined)
		});
	};
	$.fn.spinner.defaults = $.extend({},
	$.fn.validatebox.defaults, {
		width: "auto",
		height: 22,
		deltaX: 19,
		value: "",
		min: null,
		max: null,
		increment: 1,
		editable: true,
		disabled: false,
		spin: function (_1f) { },
		onSpinUp: function () { },
		onSpinDown: function () { }
	});
})(jQuery);
(function ($)
{
	function _createMenu(_target)
	{
		var _opts = $.data(_target, "menu").options;
		$(_target).appendTo("body");
		$(_target).addClass("menu-top");
		var _menuArray = [];
		_getMenuArray($(_target));
		var _handler = null;
		for (var i = 0; i < _menuArray.length; i++)
		{
			var _menu = _menuArray[i];
			_createMenuItem(_menu);
			_menu.children("div.menu-item").each(function ()
			{
				_bindEvent(_target, $(this));
			});
			_menu.children("div.menu-box").unbind(".menu").bind("click.menu", function (e)
			{
				e.stopPropagation();
			});
			_menu.bind("mouseenter",
			function ()
			{
				_opts.isMouseover = true;
				_opts.onMouseEnter.call(_target, _menu);
				if (_handler)
				{
					clearTimeout(_handler);
					_handler = null;
				}
			}).bind("mouseleave",
			function ()
			{
				_opts.isMouseover = false;
				_opts.onMouseLeave.call(_target, _menu);
				if (_opts.isMenuShow)
				{
					return;
				}
				_handler = setTimeout(function ()
				{
					_hide(_target);
				},
				100);
			});
		}
		function _getMenuArray(_jme)
		{
			_menuArray.push(_jme);
			_jme.find(">div").not(".menu-box").each(function ()
			{
				var _menuItem = $(this);
				var _submenu = _menuItem.find(">div");
				if (_submenu.length)
				{
					_submenu.insertAfter(_target);
					_menuItem[0].submenu = _submenu;
					_getMenuArray(_submenu);
				}
			});
		};
		function _createMenuItem(_menu)
		{
			_menu.addClass("menu").find(">div").not(".menu-box").each(function ()
			{
				var _menuItem = $(this);
				if (_menuItem.hasClass("menu-sep"))
				{
					_menuItem.html("&nbsp;");
				} else if (_menuItem.hasClass("menu-box"))
				{
				} else
				{
					var _d = _menuItem.addClass("menu-item").html();
					_menuItem.empty().append($("<div class=\"menu-text\"></div>").html(_d));
					var _e = _menuItem.attr("iconCls") || _menuItem.attr("icon");
					if (_e)
					{
						$("<div class=\"menu-icon\"></div>").addClass(_e).appendTo(_menuItem);
					}
					if (_menuItem[0].submenu)
					{
						$("<div class=\"menu-rightarrow\"></div>").appendTo(_menuItem);
					}
					/*if ($.support.boxModel == true)
					{
						var _f = _menuItem.height();
						_menuItem.height(_f - (_menuItem.outerHeight() - _menuItem.height()));
					}*/
				}
			});
			_menu.hide();
		};
	};
	function _bindEvent(_target, _itemEl)
	{
		_itemEl.unbind(".menu");
		_itemEl.bind("mousedown.menu",
		function ()
		{
			return false;
		}).bind("click.menu",
		function ()
		{
			if ($(this).hasClass("menu-item-disabled"))
			{
				return;
			}
			if (!this.submenu)
			{
				_hide(_target);
				var _href = $(this).attr("href");
				if (_href)
				{
					location.href = _href;
				}
			}
			var _item = $(_target).menu("getItem", this);
			$.data(_target, "menu").options.onClick.call(_target, _item);
		}).bind("mouseenter.menu",
		function (e)
		{
			_itemEl.siblings().each(function ()
			{
				if (this.submenu)
				{
					_hideMenu(this.submenu);
				}
				$(this).removeClass("menu-active");
			});
			_itemEl.addClass("menu-active");
			if ($(this).hasClass("menu-item-disabled"))
			{
				_itemEl.addClass("menu-active-disabled");
				return;
			}
			var _submenu = _itemEl[0].submenu;
			if (_submenu)
			{
				var _left = _itemEl.offset().left + _itemEl.outerWidth() - 2;
				if (_left + _submenu.outerWidth() + 5 > $(window).width() + $(document).scrollLeft())
				{
					_left = _itemEl.offset().left - _submenu.outerWidth() + 2;
				}
				var top = _itemEl.offset().top - 3;
				if (top + _submenu.outerHeight() > $(window).height() + $(document).scrollTop())
				{
					top = $(window).height() + $(document).scrollTop() - _submenu.outerHeight() - 5;
				}
				_showMenu(_submenu, {
					left: _left,
					top: top
				});
			}
		}).bind("mouseleave.menu",
		function (e)
		{
			_itemEl.removeClass("menu-active menu-active-disabled");
			var _submenu = _itemEl[0].submenu;
			if (_submenu)
			{
				if (e.pageX >= parseInt(_submenu.css("left")))
				{
					_itemEl.addClass("menu-active");
				} else
				{
					_hideMenu(_submenu);
				}
			} else
			{
				_itemEl.removeClass("menu-active");
			}
		});
	};
	function _hide(_target)
	{
    var _state=$.data(_target, "menu");
    if(!_state)return;
		var _opts = _state.options;
		_hideMenu($(_target));
		$(document).unbind(".menu");
		_opts.onHide.call(_target);
		return false;
	};
	function _show(_target, pos)
	{
		var _opts = $.data(_target, "menu").options;
		if (pos)
		{
			_opts.left = pos.left;
			_opts.top = pos.top;
			if (_opts.left + $(_target).outerWidth() > $(window).width() + $(document).scrollLeft())
			{
				_opts.left = $(window).width() + $(document).scrollLeft() - $(_target).outerWidth() - 5;
			}
			if (_opts.top + $(_target).outerHeight() > $(window).height() + $(document).scrollTop())
			{
				_opts.top -= $(_target).outerHeight();
			}
		}
		_showMenu($(_target), {
			left: _opts.left,
			top: _opts.top
		},
		function ()
		{
			$(document).unbind(".menu").bind("click.menu",
			function ()
			{
				_hide(_target);
				$(document).unbind(".menu");
				return false;
			});
			_opts.onShow.call(_target);
		});
	};
	function _showMenu(_jMenu, pos, _callBack)
	{
		if (!_jMenu)
		{
			return;
		}
		if (pos)
		{
			_jMenu.css(pos);
		}
		_jMenu.show(0,
		function ()
		{
			if (!_jMenu[0].shadow)
			{
				_jMenu[0].shadow = $("<div class=\"menu-shadow\"></div>").insertAfter(_jMenu);
			}
			window.setTimeout(function ()
			{
				_jMenu[0].shadow.css({
					display: "block",
					zIndex: $.fn.menu.defaults.zIndex - 10,
					left: _jMenu.css("left"),
					top: _jMenu.css("top"),
					width: _jMenu.outerWidth(),
					height: _jMenu.outerHeight()
				})
			}, 5);
			_jMenu.css("z-index", $.fn.menu.defaults.zIndex++);
			if (_callBack)
			{
				_callBack();
			}
		});
	};
	function _hideMenu(_submenu)
	{
		if (!_submenu)
		{
			return;
		}
		_hideShadow(_submenu);
		_submenu.find("div.menu-item").each(function ()
		{
			if (this.submenu)
			{
				_hideMenu(this.submenu);
			}
			$(this).removeClass("menu-active");
		});
		function _hideShadow(m)
		{
			m.stop(true, true);
			if (m[0].shadow)
			{
				m[0].shadow.hide();
			}
			m.hide();
		};
	};
	function _findItem(_target, _text)
	{
		var _fItem = null;
		var tmp = $("<div></div>");
		function _getItem(_jme)
		{
			_jme.children("div.menu-item").each(function ()
			{
				var _item = $(_target).menu("getItem", this);
				var s = tmp.empty().html(_item.text).text();
				if (_text == $.trim(s))
				{
					_fItem = _item;
				} else
				{
					if (this.submenu && !_fItem)
					{
						_getItem(this.submenu);
					}
				}
			});
		};
		_getItem($(_target));
		tmp.remove();
		return _fItem;
	};
	function _enableItem(_target, _itemEl, _isEnable)
	{
		var t = $(_itemEl);
		if (_isEnable)
		{
			t.addClass("menu-item-disabled");
			if (_itemEl.onclick)
			{
				_itemEl.onclick1 = _itemEl.onclick;
				_itemEl.onclick = null;
			}
		} else
		{
			t.removeClass("menu-item-disabled");
			if (_itemEl.onclick1)
			{
				_itemEl.onclick = _itemEl.onclick1;
				_itemEl.onclick1 = null;
			}
		}
	};
	function _appendItem(_target, _param)
	{
		var _jme = $(_target);
		if (_param.parent)
		{
			_jme = _param.parent.submenu;
		}
		var _itemEl = $("<div class=\"menu-item\"></div>").appendTo(_jme);
		$("<div class=\"menu-text\"></div>").html(_param.text).appendTo(_itemEl);
		if (_param.iconCls)
		{
			$("<div class=\"menu-icon\"></div>").addClass(_param.iconCls).appendTo(_itemEl);
		}
		if (_param.id)
		{
			_itemEl.attr("id", _param.id);
		}
		if (_param.href)
		{
			_itemEl.attr("href", _param.href);
		}
		if (_param.onclick)
		{
			if (typeof _param.onclick == "string")
			{
				_itemEl.attr("onclick", _param.onclick);
			} else
			{
				_itemEl[0].onclick = eval(_param.onclick);
			}
		}
		if (_param.handler)
		{
			_itemEl[0].onclick = eval(_param.handler);
		}
		_bindEvent(_target, _itemEl);
	};
	function _removeItem(_target, _itemEl)
	{
		function _remove(el)
		{
			if (el.submenu)
			{
				el.submenu.children("div.menu-item").each(function ()
				{
					_remove(this);
				});
				var _shadow = el.submenu[0].shadow;
				if (_shadow)
				{
					_shadow.remove();
				}
				el.submenu.remove();
			}
			$(el).remove();
		};
		_remove(_itemEl);
	};
	function _destroy(_target)
	{
		$(_target).children("div.menu-item").each(function ()
		{
			_removeItem(_target, this);
		});
		if (_target.shadow)
		{
			_target.shadow.remove();
		}
		$(_target).remove();
	};
	function _loadData(_target, ul, _data, _isAppend)
	{
		var _opts = $.data(_target, "menu").options;
		if (!_isAppend)
		{
			$(ul).empty();
		}
		var _checkItem = [];
		var _level = $(ul).prev("div.tree-node").find("span.tree-indent, span.tree-hit").length;
		_initNodes(ul, _data, _level);
		_bindEvent(_target);
		if (_opts.dnd)
		{
			_enableDnd(_target);
		} else
		{
			_disableDnd(_target);
		}
		for (var i = 0; i < _checkItem.length; i++)
		{
			_check(_target, _checkItem[i], true);
		}
		var _nodeOpts = null;
		if (_target != ul)
		{
			var _privUL = $(ul).prev();
			_nodeOpts = _getNode(_target, _privUL[0]);
		}
		_opts.onLoadSuccess.call(_target, _nodeOpts, _data);
		function _initNodes(ul, _data, _level)
		{
			if(!_data)return;
			for (var i = 0; i < _data.length; i++)
			{
				var li = $("<li></li>").appendTo(ul);
				var _item = _data[i];
				if (_item.state != "open" && _item.state != "closed")
				{
					_item.state = "open";
				}
				var _nodeBox = $("<div class=\"tree-node\"></div>").appendTo(li);
				_nodeBox.attr("node-id", _item.id);
				$.data(_nodeBox[0], "tree-node", {
					id: _item.id,
					text: _item.text,
					iconCls: _item.iconCls,
					level: _level,
					attributes: _item.attributes,
					hasChild: !!_item.hasChild
				});
				$("<span class=\"tree-title\"></span>").html(_item.text).appendTo(_nodeBox);
				if (_opts.checkbox)
				{
					if (_opts.onlyLeafCheck)
					{
						if (_item.state == "open" && (!_item.children || !_item.children.length))
						{
							if (_item.checked)
							{
								$("<span class=\"tree-checkbox tree-checkbox1\"></span>").prependTo(_nodeBox);
							} else
							{
								$("<span class=\"tree-checkbox tree-checkbox0\"></span>").prependTo(_nodeBox);
							}
						}
					} else
					{
						if (_item.checked)
						{
							$("<span class=\"tree-checkbox tree-checkbox1\"></span>").prependTo(_nodeBox);
							_checkItem.push(_nodeBox[0]);
						} else
						{
							$("<span class=\"tree-checkbox tree-checkbox0\"></span>").prependTo(_nodeBox);
						}
					}
				}
				if (_item.children && _item.children.length)
				{
					var _ul = $("<ul></ul>").appendTo(li);
					if (_item.state == "open")
					{
						$("<span class=\"tree-icon tree-folder tree-folder-open\"></span>").addClass(_item.iconCls).prependTo(_nodeBox);
						$("<span class=\"tree-hit tree-expanded\"></span>").prependTo(_nodeBox);
					} else
					{
						$("<span class=\"tree-icon tree-folder\"></span>").addClass(_item.iconCls).prependTo(_nodeBox);
						$("<span class=\"tree-hit tree-collapsed\"></span>").prependTo(_nodeBox);
						_ul.css("display", "none");
					}
					_initNodes(_ul, _item.children, _level + 1);
				} else
				{
					if (_item.state == "closed")
					{
						if (_item.hasChild)
						{
							$("<span class=\"tree-icon tree-folder\"></span>").addClass(_item.iconCls).prependTo(_nodeBox);
							$("<span class=\"tree-hit tree-collapsed\"></span>").prependTo(_nodeBox);
						}
						else
						{
							$("<span class=\"tree-icon tree-file\"></span>").addClass(_item.iconCls).prependTo(_nodeBox);
							$("<span class=\"tree-indent\"></span>").prependTo(_nodeBox);
						}
					} else
					{
						$("<span class=\"tree-icon tree-file\"></span>").addClass(_item.iconCls).prependTo(_nodeBox);
						$("<span class=\"tree-indent\"></span>").prependTo(_nodeBox);
					}
				}
				for (var j = 0; j < _level; j++)
				{
					$("<span class=\"tree-indent\"></span>").prependTo(_nodeBox);
				}
			}
		};
	};
	function _ajaxLoad(_target, ul, _param, _reloadCallBack)
	{
		var _opts = $.data(_target, "tree").options;
		_param = _param || {};
		var _nodeOpts = null;
		if (_target != ul)
		{
			var _prevNodes = $(ul).prev();
			_nodeOpts = _getNode(_target, _prevNodes[0]);
		}
		_opts.queryParams = $.extend(_opts.queryParams, _param);
		if (_opts.onBeforeLoad.call(_target, _nodeOpts, _opts.queryParams) == false)
		{
			return;
		}
		if (!_opts.url)
		{
			return;
		}
		var _folder = $(ul).prev().children("span.tree-folder");
		_folder.addClass("tree-loading");
		var _param = String.toSerialize(_opts.queryParams);
		var _param = { loadinfo: _param };
		$.ajax({
			type: _opts.method,
			url: _opts.url,
			data: _param,
			dataType: "json",
			success: function (_data)
			{
				_folder.removeClass("tree-loading");
				_loadData(_target, ul, _data, true);
				if (_reloadCallBack)
				{
					_reloadCallBack();
				}
			},
			error: function ()
			{
				_folder.removeClass("tree-loading");
				_opts.onLoadError.apply(_target, arguments);
				if (_reloadCallBack)
				{
					_reloadCallBack();
				}
			}
		});
	};
	$.fn.menu = function (_options, _param)
	{
		if (typeof _options == "string")
		{
			return $.fn.menu.methods[_options](this, _param);
		}
		_options = _options || {};
		var me = this.each(function ()
		{
			var _state = $.data(this, "menu");
			var _opts = null;
			if (_state)
			{
				_opts = $.extend(_state.options, _options);
			} else
			{
				_opts = {
					options: $.extend({}, $.fn.menu.defaults, _options)
				};
				_state = $.data(this, "menu", _opts);
				_createMenu(this);
			}
			$(this).css({
				left: _state.options.left,
				top: _state.options.top
			});
			if (_opts.url)
			{
				//_ajaxLoad(this, this);
			}
		});

		/*
		$.each($.fn.columnmenu.methods, function (name, body)
		{
		me[name]=function(_param){return body(me, _param);}
		});
		*/
		_options.me = me;
		return me;
	};
	$.fn.menu.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "menu").options;
		},
		show: function (jq, pos)
		{
			return jq.each(function ()
			{
				_show(this, pos);
			});
		},
		hide: function (jq)
		{
			return jq.each(function ()
			{
				_hide(this);
			});
		},
		destroy: function (jq)
		{
			return jq.each(function ()
			{
				_destroy(this);
			});
		},
		setText: function (jq, _param)
		{
			return jq.each(function ()
			{
				$(_param.target).children("div.menu-text").html(_param.text);
			});
		},
		setIcon: function (jq, _param)
		{
			return jq.each(function ()
			{
				var _itemEl = $(this).menu("getItem", _param.target);
				if (_itemEl.iconCls)
				{
					$(_itemEl.target).children("div.menu-icon").removeClass(_itemEl.iconCls).addClass(_param.iconCls);
				} else
				{
					$("<div class=\"menu-icon\"></div>").addClass(_param.iconCls).appendTo(_param.target);
				}
			});
		},
		getItem: function (jq, _itemEl)
		{
			var _item = {
				target: _itemEl,
				id: $(_itemEl).attr("id"),
				text: $.trim($(_itemEl).children("div.menu-text").html()),
				disabled: $(_itemEl).hasClass("menu-item-disabled"),
				href: $(_itemEl).attr("href"),
				url: $(_itemEl).attr("url"),
				onclick: _itemEl.onclick
			};
			var _icon = $(_itemEl).children("div.menu-icon");
			if (_icon.length)
			{
				var cc = [];
				var aa = _icon.attr("class").split(" ");
				for (var i = 0; i < aa.length; i++)
				{
					if (aa[i] != "menu-icon")
					{
						cc.push(aa[i]);
					}
				}
				_item.iconCls = cc.join(" ");
			}
			return _item;
		},
		findItem: function (jq, _text)
		{
			return _findItem(jq[0], _text);
		},
		appendItem: function (jq, _param)
		{
			return jq.each(function ()
			{
				_appendItem(this, _param);
			});
		},
		removeItem: function (jq, _itemEl)
		{
			return jq.each(function ()
			{
				_removeItem(this, _itemEl);
			});
		},
		enableItem: function (jq, _itemEl)
		{
			return jq.each(function ()
			{
				_enableItem(this, _itemEl, false);
			});
		},
		disableItem: function (jq, _itemEl)
		{
			return jq.each(function ()
			{
				_enableItem(this, _itemEl, true);
			});
		}
	};
	$.fn.menu.defaults = {
		url: null,
		method: "post",
		zIndex: 110000,
		left: 0,
		top: 0,
		isMenuShow: false,
		isMouseover: false,  //是否鼠标悬停在菜单中
		onShow: function () { },
		onHide: function () { },
		onClick: function (_49) { },
		queryParams: {},
		onMouseEnter: function (_menu) { },  //鼠标进入菜单
		onMouseLeave: function () { },  //鼠标离开菜单
		onBeforeLoad: function (_nodeOpts, _param) { },
		onLoadSuccess: function (node, param) { },
		onLoadError: function () { }
	};
})(jQuery);
/**
* tabs - jQuery EasyUI
* 
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact us: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* Dependencies:
* 	 panel
*   linkbutton
* 
*/
(function ($)
{
	/**
	* set the tabs scrollers to show or not,
	* dependent on the tabs count and width
	*/
	function setScrollers(container)
	{
		var opts = $.data(container, 'tabs').options;
		if (opts.tabPosition == 'left' || opts.tabPosition == 'right')
		{
			return
		}
		var header = $(container).children('div.tabs-header');
		var tool = header.children('div.tabs-tool');
		var sLeft = header.children('div.tabs-scroller-left');
		var sRight = header.children('div.tabs-scroller-right');
		var wrap = header.children('div.tabs-wrap'); // set the tool height
		var tHeight = header.outerHeight();
		if (opts.plain)
		{
			tHeight -= tHeight - header.height();
		}
		tool._outerHeight(tHeight);
		var tabsWidth = 0;
		$('ul.tabs li', header).each(function ()
		{
			tabsWidth += $(this).outerWidth(true);
		});
		var cWidth = header.width() - tool._outerWidth();
		if (tabsWidth > cWidth)
		{
			sLeft.add(sRight).show()._outerHeight(tHeight);
			if (opts.toolPosition == 'left')
			{
				tool.css({
					left: sLeft.outerWidth(),
					right: ''
				});
				wrap.css({
					marginLeft: sLeft.outerWidth() + tool._outerWidth(),
					marginRight: sRight._outerWidth(),
					width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
				});
			} else
			{
				tool.css({
					left: '',
					right: sRight.outerWidth()
				});
				wrap.css({
					marginLeft: sLeft.outerWidth(),
					marginRight: sRight.outerWidth() + tool._outerWidth(),
					width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
				});
			}
		} else
		{
			sLeft.add(sRight).hide();
			if (opts.toolPosition == 'left')
			{
				tool.css({
					left: 0,
					right: ''
				});
				wrap.css({
					marginLeft: tool._outerWidth(),
					marginRight: 0,
					width: cWidth
				});
			} else
			{
				tool.css({
					left: '',
					right: 0
				});
				wrap.css({
					marginLeft: 0,
					marginRight: tool._outerWidth(),
					width: cWidth
				});
			}
		}
	}
	function addTools(container)
	{
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		if (opts.tools)
		{
			if (typeof opts.tools == 'string')
			{
				$(opts.tools).addClass('tabs-tool').appendTo(header);
				$(opts.tools).show();
			} else
			{
				header.children('div.tabs-tool').remove();
				var tools = $('<div class="tabs-tool"><table cellspacing="0" cellpadding="0" style="height:100%"><tr></tr></table></div>').appendTo(header);
				var tr = tools.find('tr');
				for (var i = 0; i < opts.tools.length; i++)
				{
					var td = $('<td></td>').appendTo(tr);
					var tool = $('<a href="javascript:void(0);"></a>').appendTo(td);
					tool[0].onclick = eval(opts.tools[i].handler ||
					function () { });
					tool.linkbutton($.extend({},
					opts.tools[i], {
						plain: true
					}));
				}
			}
		} else
		{
			header.children('div.tabs-tool').remove();
		}
    //初始化参数中Tab
    if($.isArray(opts.tabItems))
    {
      $.each(opts.tabItems, function(i, item){
        if(!item.url)item.url=item.title;
        addTab(container, item);
      });
    }
	}
	function setSize(container)
	{
		var state = $.data(container, 'tabs');
		var opts = state.options;
		var cc = $(container);
		opts.fit ? $.extend(opts, cc._fit()) : cc._fit(false);
		cc.width(opts.width).height(opts.height);
		var header = $(container).children('div.tabs-header');
		var panels = $(container).children('div.tabs-panels');
		var wrap = header.find('div.tabs-wrap');
		var ul = wrap.find('.tabs');
    if(opts.autoSize) //by xtb 2013-09-15
    {
      for (var i = 0; i < state.tabs.length; i++)
      {
        var p_opts = state.tabs[i].panel('options');
        var p_t = p_opts.tab.find('a.tabs-inner');
        var width = parseInt(p_opts.tabWidth || opts.tabWidth) || undefined;
        if (width)
        {
          p_t._outerWidth(width);
        } else
        {
          p_t.css('width', '');
        }
        p_t._outerHeight(opts.tabHeight);
        p_t.css('lineHeight', p_t.height() + 'px');
      }
    }
		if (opts.tabPosition == 'left' || opts.tabPosition == 'right')
		{
			header._outerWidth(opts.headerWidth);
			panels._outerWidth(cc.width() - opts.headerWidth);
			header.add(panels)._outerHeight(opts.height);
			wrap._outerWidth(header.width());
			ul._outerWidth(wrap.width()).css('height', '');
		} else
		{
			header._outerWidth(opts.width).css('height', '');
			ul._outerHeight(opts.tabHeight).css('width', '');
			setScrollers(container);
			var height = opts.height;
			if (!isNaN(height))
			{
				panels._outerHeight(height - header.outerHeight());
			} else
			{
				panels.height('auto');
			}
			var width = opts.width;
			if (!isNaN(width))
			{
				panels._outerWidth(width);
			} else
			{
				panels.width('auto');
			}
		}
	}
	/**
	* set selected tab panel size
	*/
	function setSelectedSize(container)
	{
		var opts = $.data(container, 'tabs').options;
		var tab = getSelectedTab(container);
		if (tab)
		{
			var panels = $(container).children('div.tabs-panels');
			var width = opts.width == 'auto' ? 'auto' : panels.width();
			var height = opts.height == 'auto' ? 'auto' : panels.height();
			tab.panel('resize', {
				width: width,
				height: height
			});
		}
	}
	/**
	* wrap the tabs header and body
	*/
	function wrapTabs(container)
	{
		var _opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		var cc = $(container);
		cc.addClass('tabs-container');
		var pp = $('<div class="tabs-panels"></div>').insertBefore(cc);
		cc.children('div').each(function ()
		{
			pp[0].appendChild(this);
		});
		cc[0].appendChild(pp[0]); //		cc.wrapInner('<div class="tabs-panels"/>');
		$('<div class="tabs-header">' + 
      '<div class="tabs-scroller-left"></div>' + 
      '<div class="tabs-scroller-right"></div>' +
      '<div class="tabs-wrap">' + 
        '<ul class="tabs"></ul>' + 
      '</div>' + 
      '</div>').prependTo(container).find(".tabs").css("padding-left", _opts.paddingLeft);
		cc.children('div.tabs-panels').children('div').each(function (i)
		{
			var opts = $.extend({},
			$.parser.parseOptions(this), {
				selected: ($(this).attr('selected') ? true : undefined)
			});
			var pp = $(this);
			tabs.push(pp);
			createTab(container, pp, opts);
		});
		cc.children('div.tabs-header').find('.tabs-scroller-left, .tabs-scroller-right').hover(function ()
		{
			$(this).addClass('tabs-scroller-over');
		},
		function ()
		{
			$(this).removeClass('tabs-scroller-over');
		});
		cc.bind('_resize',
		function (e, force)
		{
			var opts = $.data(container, 'tabs').options;
			if (opts.fit == true || force)
			{
				setSize(container);
				setSelectedSize(container);
			}
			return false;
		});
	}
	function bindEvents(container)
	{
		var opts = $.data(container, 'tabs').options;
		$(container).children('div.tabs-header').unbind().bind('click',
		function (e)
		{
			if ($(e.target).hasClass('tabs-scroller-left'))
			{
				$(container).tabs('scrollBy', -opts.scrollIncrement);
			} else if ($(e.target).hasClass('tabs-scroller-right'))
			{
				$(container).tabs('scrollBy', opts.scrollIncrement);
			} else
			{
				var li = $(e.target).closest('li');
				if (li.hasClass('tabs-disabled'))
				{
					return;
				}
				var a = $(e.target).closest('a.tabs-close');
				if (a.length)
				{
					closeTab(container, getLiIndex(li));
				} else if (li.length)
				{
          var index=getLiIndex(li);
					selectTab(container, index);

          var panel = getTab(container, index); // get the panel to be activated
          var url = panel.panel('options').url; // the panel url
      		opts.onTabClick.call(container, url, getTabIndex(container, panel), opts);
				}
			}
		}).bind('contextmenu',
		function (e)
		{
			var li = $(e.target).closest('li');
			if (li.hasClass('tabs-disabled'))
			{
				return;
			}
			if (li.length)
			{
				opts.onContextMenu.call(container, e, li.find('span.tabs-title').html(), getLiIndex(li));
			}
		});
		function getLiIndex(li)
		{
			var index = 0;
			li.parent().children('li').each(function (i)
			{
				if (li[0] == this)
				{
					index = i;
					return false;
				}
			});
			return index;
		}
	}
	function setProperties(container)
	{
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		var panels = $(container).children('div.tabs-panels');
		header.removeClass('tabs-header-top tabs-header-bottom tabs-header-left tabs-header-right');
		panels.removeClass('tabs-panels-top tabs-panels-bottom tabs-panels-left tabs-panels-right');
		if (opts.tabPosition == 'top')
		{
			header.insertBefore(panels);
		} else if (opts.tabPosition == 'bottom')
		{
			header.insertAfter(panels);
			header.addClass('tabs-header-bottom');
			panels.addClass('tabs-panels-top');
		} else if (opts.tabPosition == 'left')
		{
			header.addClass('tabs-header-left');
			panels.addClass('tabs-panels-right');
		} else if (opts.tabPosition == 'right')
		{
			header.addClass('tabs-header-right');
			panels.addClass('tabs-panels-left');
		}
		if (opts.plain == true)
		{
			header.addClass('tabs-header-plain');
		} else
		{
			header.removeClass('tabs-header-plain');
		}
		if (opts.border == true)
		{
			header.removeClass('tabs-header-noborder');
			panels.removeClass('tabs-panels-noborder');
		} else
		{
			header.addClass('tabs-header-noborder');
			panels.addClass('tabs-panels-noborder');
		}
	}
	function createTab(container, pp, options)
	{
		var state = $.data(container, 'tabs');
		options = options || {}; // create panel
    if(!options.url)options.url=options.title;
		pp.panel($.extend({},
		options, {
			border: false,
			noheader: true,
			closed: true,
			doSize: false,
			iconCls: (options.icon ? options.icon : undefined),
			onLoad: function ()
			{
				if (options.onLoad)
				{
					options.onLoad.call(this, arguments);
				}
				state.options.onLoad.call(container, $(this));
			}
		}));
		var opts = pp.panel('options');
		var tabs = $(container).children('div.tabs-header').find('ul.tabs');
    /*if(options.position!==undefined)
    {
      var currentTab=tabs.find("li").eq(options.position);
      if(currentTab.length>0)
      {
        opts.tab = $('<li></li>').insertBefore(currentTab);
      }
      else
      {
        opts.tab = $('<li></li>').appendTo(tabs); // set the tab object in panel options
      }
    }
    else
    {
  		opts.tab = $('<li></li>').appendTo(tabs); // set the tab object in panel options
    }*/
    opts.tab = $('<li></li>').appendTo(tabs); // set the tab object in panel options
		opts.tab.append('<a href="javascript:void(0)" class="tabs-inner">' 
      + '<span class="tabs-title"></span>' 
      + '<span class="tabs-icon"></span>' 
      + '</a>');
		$(container).tabs('update', {
			tab: pp,
			options: opts
		});
	}
	function addTab(container, options)
	{
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		if (options.selected == undefined) options.selected = true;
		var pp = $('<div></div>').appendTo($(container).children('div.tabs-panels'));
		tabs.push(pp);
		createTab(container, pp, options);
		opts.onAdd.call(container, options.url, tabs.length - 1); //		setScrollers(container);
		setSize(container);
		if (options.selected)
		{
			selectTab(container, tabs.length - 1); // select the added tab panel
		}
	}
	/**
	* update tab panel, param has following properties:
	* tab: the tab panel to be updated
	* options: the tab panel options
	*/
	function updateTab(container, param)
	{
		var selectHis = $.data(container, 'tabs').selectHis;
		var pp = param.tab; // the tab panel
		var oldUrl = pp.panel('options').url;
		pp.panel($.extend({},
		param.options, {
			iconCls: (param.options.icon ? param.options.icon : undefined)
		}));
		var opts = pp.panel('options'); // get the tab panel options
		var tab = opts.tab;
		var s_title = tab.find('span.tabs-title');
		var s_icon = tab.find('span.tabs-icon');
		s_title.html(opts.title);
		s_icon.attr('class', 'tabs-icon');
		tab.find('a.tabs-close').remove();
		if (opts.closable)
		{
			s_title.addClass('tabs-closable');
			$('<a href="javascript:void(0)" class="tabs-close"></a>').appendTo(tab);
		} else
		{
			s_title.removeClass('tabs-closable');
		}
		if (opts.iconCls)
		{
			s_title.addClass('tabs-with-icon');
			s_icon.addClass(opts.iconCls);
		} else
		{
			s_title.removeClass('tabs-with-icon');
		}
		if (oldUrl != opts.url)
		{
			for (var i = 0; i < selectHis.length; i++)
			{
				if (selectHis[i] == oldUrl)
				{
					selectHis[i] = opts.url;
				}
			}
		}
		tab.find('span.tabs-p-tool').remove();
		if (opts.tools)
		{
			var p_tool = $('<span class="tabs-p-tool"></span>').insertAfter(tab.find('a.tabs-inner'));
			if ($.isArray(opts.tools))
			{
				for (var i = 0; i < opts.tools.length; i++)
				{
					var t = $('<a href="javascript:void(0)"></a>').appendTo(p_tool);
					t.addClass(opts.tools[i].iconCls);
					if (opts.tools[i].handler)
					{
						t.bind('click', {
							handler: opts.tools[i].handler
						},
						function (e)
						{
							if ($(this).parents('li').hasClass('tabs-disabled'))
							{
								return;
							}
							e.data.handler.call(this);
						});
					}
				}
			} else
			{
				$(opts.tools).children().appendTo(p_tool);
			}
			var pr = p_tool.children().length * 12;
			if (opts.closable)
			{
				pr += 8;
			} else
			{
				pr -= 3;
				p_tool.css('right', '5px');
			}
			s_title.css('padding-right', pr + 'px');
		} //		setProperties(container);
		//		setScrollers(container);
		setSize(container);
		$.data(container, 'tabs').options.onUpdate.call(container, opts.url, getTabIndex(container, pp));
	}
	/**
	* close a tab with specified index or url
	*/
	function closeTab(container, which)
	{
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		var selectHis = $.data(container, 'tabs').selectHis;
		if (!exists(container, which)) return;
		var tab = getTab(container, which);
		var url = tab.panel('options').url;
		var index = getTabIndex(container, tab);
		if (opts.onBeforeClose.call(container, url, index) == false) return;
		var tab = getTab(container, which, true);
		tab.panel('options').tab.remove();
		tab.panel('destroy');
		opts.onClose.call(container, url, index); //		setScrollers(container);
		setSize(container); // remove the select history item
		for (var i = 0; i < selectHis.length; i++)
		{
			if (selectHis[i] == url)
			{
				selectHis.splice(i, 1);
				i--;
			}
		} // select the nearest tab panel
		var hisUrl = selectHis.pop();
		if (hisUrl)
		{
			selectTab(container, hisUrl);
		} else if (tabs.length)
		{
			selectTab(container, 0);
		}
	}
  function _closeAll(container)
  {
		var state = $.data(container, 'tabs');
    var length = state.tabs.length;
    for (var i = 0; i < length; i++)
    {
      var p_opts = state.tabs[0].panel('options');
      closeTab(container, p_opts.url);
    }
  }
	/**
	* get the specified tab panel
	*/
	function getTab(container, which, removeit)
	{
		var tabs = $.data(container, 'tabs').tabs;
		if (typeof which == 'number')
		{
			if (which < 0 || which >= tabs.length)
			{
				return null;
			} else
			{
				var tab = tabs[which];
				if (removeit)
				{
					tabs.splice(which, 1);
				}
				return tab;
			}
		}
		for (var i = 0; i < tabs.length; i++)
		{
			var tab = tabs[i];
			if (tab.panel('options').url == which)
			{
				if (removeit)
				{
					tabs.splice(i, 1);
				}
				return tab;
			}
		}
		return null;
	}
	function getTabIndex(container, tab)
	{
		var tabs = $.data(container, 'tabs').tabs;
		for (var i = 0; i < tabs.length; i++)
		{
			if (tabs[i][0] == $(tab)[0])
			{
				return i;
			}
		}
		return -1;
	}
	function getSelectedTab(container)
	{
		var tabs = $.data(container, 'tabs').tabs;
		for (var i = 0; i < tabs.length; i++)
		{
			var tab = tabs[i];
			if (tab.panel('options').closed == false)
			{
				return tab;
			}
		}
		return null;
	}
	/**
	* do first select action, if no tab is setted the first tab will be selected.
	*/
	function doFirstSelect(container)
	{
		var tabs = $.data(container, 'tabs').tabs;
		for (var i = 0; i < tabs.length; i++)
		{
			if (tabs[i].panel('options').selected)
			{
				selectTab(container, i);
				return;
			}
		}
		if (tabs.length)
		{
			selectTab(container, 0);
		}
	}
	function selectTab(container, which)
	{
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		var selectHis = $.data(container, 'tabs').selectHis;
		if (tabs.length == 0) return;
		var panel = getTab(container, which); // get the panel to be activated
		if (!panel) return;
		var selected = getSelectedTab(container);
		if (selected)
		{
			selected.panel('close');
			selected.panel('options').tab.removeClass('tabs-selected');
		}
		panel.panel('open');
		var url = panel.panel('options').url; // the panel url
		selectHis.push(url); // push select history
		var tab = panel.panel('options').tab; // get the tab object
		tab.addClass('tabs-selected'); // scroll the tab to center position if required.
		var wrap = $(container).find('>div.tabs-header>div.tabs-wrap');
		var left = tab.position().left;
		var right = left + tab.outerWidth();
		if (left < 0 || right > wrap.width())
		{
			var deltaX = left - (wrap.width() - tab.width()) / 2;
			$(container).tabs('scrollBy', deltaX);
		} else
		{
			$(container).tabs('scrollBy', 0);
		}
		setSelectedSize(container);
		opts.onSelect.call(container, url, getTabIndex(container, panel), opts);
	}
	function exists(container, which)
	{
		return getTab(container, which) != null;
	}
  function _getSelectedOption(_target)
  {
    var _tab=getSelectedTab(_target);
    if(!_tab)return null;
    var panelOpts = _tab.panel("options");
    return panelOpts;
  };
  function _getTabOption(_target, _url)
  {
    var _tab=getTab(_target, _url);
    if(!_tab)return null;
    var panelOpts = _tab.panel("options");
    return panelOpts;
  };
	$.fn.tabs = function (options, param)
	{
		if (typeof options == 'string')
		{
			return $.fn.tabs.methods[options](this, param);
		}
		options = options || {};
		var me = this.each(function ()
		{
			var state = $.data(this, 'tabs');
			var opts;
			if (state)
			{
				opts = $.extend(state.options, options);
				state.options = opts;
			} else
			{
				$.data(this, 'tabs', {
					options: $.extend({}, $.fn.tabs.defaults, $.fn.tabs.parseOptions(this), options),
					tabs: [],
					selectHis: []
				});
				wrapTabs(this);
			}
			addTools(this);
			setProperties(this);
			setSize(this);
			bindEvents(this);
			doFirstSelect(this);
		});

    $.each($.fn.tabs.methods, function (name, body)
    {
      me[name] = function () 
      {
        var args = Array.prototype.slice.call(arguments);
        return body.apply($.fn.tabs.methods, [me].concat(args)); 
      }
    });

    options.me = me;
    return me;
	};
	$.fn.tabs.methods = {
		options: function (jq)
		{
			return $.data(jq[0], 'tabs').options;
		},
		tabs: function (jq)
		{
			return $.data(jq[0], 'tabs').tabs;
		},
		resize: function (jq)
		{
			return jq.each(function ()
			{
				setSize(this);
				setSelectedSize(this);
			});
		},
		add: function (jq, options)
		{
			return jq.each(function ()
			{
				addTab(this, options);
			});
		},
		close: function (jq, which)
		{
			return jq.each(function ()
			{
				closeTab(this, which);
			});
		},
		closeAll: function (jq)
		{
			return jq.each(function ()
			{
				_closeAll(this);
			});
		},
		getTab: function (jq, which)
		{
			return getTab(jq[0], which);
		},
		getTabIndex: function (jq, tab)
		{
			return getTabIndex(jq[0], tab);
		},
		getSelectedIndex: function (jq)
		{
      var tab = getSelectedTab(jq[0]);
			return getTabIndex(jq[0], tab);
		},
		getSelected: function (jq)
		{
			return getSelectedTab(jq[0]);
		},
		select: function (jq, which)
		{
			return jq.each(function ()
			{
				selectTab(this, which);
			});
		},
		exists: function (jq, which)
		{
			return exists(jq[0], which);
		},
		update: function (jq, options)
		{
			return jq.each(function ()
			{
				updateTab(this, options);
			});
		},
		enableTab: function (jq, which)
		{
			return jq.each(function ()
			{
				$(this).tabs('getTab', which).panel('options').tab.removeClass('tabs-disabled');
			});
		},
		disableTab: function (jq, which)
		{
			return jq.each(function ()
			{
				$(this).tabs('getTab', which).panel('options').tab.addClass('tabs-disabled');
			});
		},
		scrollBy: function (jq, deltaX)
		{ // scroll the tab header by the specified amount of pixels
			return jq.each(function ()
			{
				var opts = $(this).tabs('options');
				var wrap = $(this).find('>div.tabs-header>div.tabs-wrap');
				var pos = Math.min(wrap._scrollLeft() + deltaX, getMaxScrollWidth());
				wrap.animate({
					scrollLeft: pos
				},
				opts.scrollDuration);
				function getMaxScrollWidth()
				{
					var w = 0;
					var ul = wrap.children('ul');
					ul.children('li').each(function ()
					{
						w += $(this).outerWidth(true);
					});
					return w - wrap.width() + (ul.outerWidth() - ul.width());
				}
			});
		},
    getSelectedOption: function (jq)
    {
      return _getSelectedOption(jq[0]);
    },
    getTabOption: function (jq, _url)
    {
      return _getTabOption(jq[0], _url);
    }
	};
	$.fn.tabs.parseOptions = function (target)
	{
		return $.extend({},
		$.parser.parseOptions(target, ['width', 'height', 'tools', 'toolPosition', 'tabPosition', 'onSelect', {
			fit: 'boolean',
			border: 'boolean',
			plain: 'boolean',
			autoSize: 'boolean',  //by xtb
			headerWidth: 'number',
			tabWidth: 'number',
			tabHeight: 'number'
		}]));
	};
	$.fn.tabs.defaults = {
    autoSize:true,
		width: 'auto',
		height: 'auto',
		headerWidth: 150,
		// the tab header width, it is valid only when tabPosition set to 'left' or 'right' 
		tabWidth: 'auto',
		// the tab width
		tabHeight: 27,
		// the tab height
		plain: false,
		fit: false,
		border: true,
		tools: null,
		toolPosition: 'right',
		// left,right
		tabPosition: 'top',
		// possible values: top,bottom
		scrollIncrement: 100,
		scrollDuration: 400,
    tabItems:[], //tab项集合
    paddingLeft:"4px",
		onLoad: function (panel) { },
		onTabClick: function (url, index, opts) { },
		onSelect: function (url, index, opts) { },
		onBeforeClose: function (url, index) { },
		onClose: function (url, index) { },
		onAdd: function (url, index) { },
		onUpdate: function (url, index) { },
		onContextMenu: function (e, url, index) { }
	};
})(jQuery);
(function ($)
{
	function _1(_2)
	{
		var _3 = $.data(_2, "menubutton").options;
		var _4 = $(_2);
		_4.removeClass(_3.cls.btn1 + " " + _3.cls.btn2).addClass("m-btn");
		_4.linkbutton($.extend({}, _3, { text: _3.text + "<span class=\"" + _3.cls.arrow + "\">&nbsp;</span>" }));
		if (_3.menu)
		{
			$(_3.menu).menu();
			var _5 = $(_3.menu).menu("options");
			var _6 = _5.onShow;
			var _7 = _5.onHide;
			$.extend(_5, { onShow: function ()
			{
				var _8 = $(this).menu("options");
				var _9 = $(_8.alignTo);
				var _a = _9.menubutton("options");
				_9.addClass((_a.plain == true) ? _a.cls.btn2 : _a.cls.btn1);
				_6.call(this);
			}, onHide: function ()
			{
				var _b = $(this).menu("options");
				var _c = $(_b.alignTo);
				var _d = _c.menubutton("options");
				_c.removeClass((_d.plain == true) ? _d.cls.btn2 : _d.cls.btn1);
				_7.call(this);
			} 
			});
		}
		_e(_2, _3.disabled);
	};
	function _e(_f, _10)
	{
		var _11 = $.data(_f, "menubutton").options;
		_11.disabled = _10;
		var btn = $(_f);
		var t = btn.find("." + _11.cls.trigger);
		if (!t.length)
		{
			t = btn;
		}
		t.unbind(".menubutton");
		if (_10)
		{
			btn.linkbutton("disable");
		} else
		{
			btn.linkbutton("enable");
			var _12 = null;
			t.bind("click.menubutton", function ()
			{
				_13(_f);
				return false;
			}).bind("mouseenter.menubutton", function ()
			{
				_12 = setTimeout(function ()
				{
					_13(_f);
				}, _11.duration);
				return false;
			}).bind("mouseleave.menubutton", function ()
			{
				if (_12)
				{
					clearTimeout(_12);
				}
			});
		}
	};
	function _13(_14)
	{
		var _15 = $.data(_14, "menubutton").options;
		if (_15.disabled || !_15.menu)
		{
			return;
		}
		$("body>div.menu-top").menu("hide");
		var btn = $(_14);
		var mm = $(_15.menu);
		if (mm.length)
		{
			mm.menu("options").alignTo = btn;
			mm.menu("show", { alignTo: btn });
		}
		btn.blur();
	};
	$.fn.menubutton = function (_16, _state)
	{
		if (typeof _16 == "string")
		{
			var _proxy = $.fn.menubutton.methods[_16];
			if (_proxy)
			{
				return _proxy(this, _state);
			} else
			{
				return this.linkbutton(_16, _state);
			}
		}
		_16 = _16 || {};
		return this.each(function ()
		{
			var _opts = $.data(this, "menubutton");
			if (_opts)
			{
				$.extend(_opts.options, _16);
			} else
			{
				$.data(this, "menubutton", { options: $.extend({}, $.fn.menubutton.defaults, $.fn.menubutton.parseOptions(this), _16) });
				$(this).removeAttr("disabled");
			}
			_1(this);
		});
	};
	$.fn.menubutton.methods = { options: function (jq)
	{
		var _1a = jq.linkbutton("options");
		var _1b = $.data(jq[0], "menubutton").options;
		_1b.toggle = _1a.toggle;
		_1b.selected = _1a.selected;
		return _1b;
	}, enable: function (jq)
	{
		return jq.each(function ()
		{
			_e(this, false);
		});
	}, disable: function (jq)
	{
		return jq.each(function ()
		{
			_e(this, true);
		});
	}, destroy: function (jq)
	{
		return jq.each(function ()
		{
			var _1c = $(this).menubutton("options");
			if (_1c.menu)
			{
				$(_1c.menu).menu("destroy");
			}
			$(this).remove();
		});
	} 
	};
	$.fn.menubutton.parseOptions = function (_1d)
	{
		var t = $(_1d);
		return $.extend({}, $.fn.linkbutton.parseOptions(_1d), $.parser.parseOptions(_1d, ["menu", { plain: "boolean", duration: "number"}]));
	};
	$.fn.menubutton.defaults = $.extend({}, $.fn.linkbutton.defaults, { plain: true, menu: null, duration: 100, cls: { btn1: "m-btn-active", btn2: "m-btn-plain-active", arrow: "m-btn-downarrow", trigger: "m-btn"} });
})(jQuery);

(function ($)
{
	var _1 = false;
	function _2(_3)
	{
		var _4 = $.data(_3, "layout");
		var _5 = _4.options;
		var _6 = _4.panels;
		var cc = $(_3);
		if (_3.tagName == "BODY")
		{
			cc._fit();
		} else
		{
			_5.fit ? cc.css(cc._fit()) : cc._fit(false);
		}
		function _7(pp)
		{
			var _8 = pp.panel("options");
			return Math.min(Math.max(_8.height, _8.minHeight), _8.maxHeight);
		};
		function _9(pp)
		{
			var _a = pp.panel("options");
			return Math.min(Math.max(_a.width, _a.minWidth), _a.maxWidth);
		};
		var _b = {
			top: 0,
			left: 0,
			width: cc.width(),
			height: cc.height()
		};
		function _c(pp)
		{
			if (!pp.length)
			{
				return;
			}
			var _d = _7(pp);
			pp.panel("resize", {
				width: cc.width(),
				height: _d,
				left: 0,
				top: 0
			});
			_b.top += _d;
			_b.height -= _d;
		};
		if (_14(_6.expandNorth))
		{
			_c(_6.expandNorth);
		} else
		{
			_c(_6.north);
		}
		function _e(pp)
		{
			if (!pp.length)
			{
				return;
			}
			var _f = _7(pp);
			pp.panel("resize", {
				width: cc.width(),
				height: _f,
				left: 0,
				top: cc.height() - _f
			});
			_b.height -= _f;
		};
		if (_14(_6.expandSouth))
		{
			_e(_6.expandSouth);
		} else
		{
			_e(_6.south);
		}
		function _10(pp)
		{
			if (!pp.length)
			{
				return;
			}
			var _11 = _9(pp);
			pp.panel("resize", {
				width: _11,
				height: _b.height,
				left: cc.width() - _11,
				top: _b.top
			});
			_b.width -= _11;
		};
		if (_14(_6.expandEast))
		{
			_10(_6.expandEast);
		} else
		{
			_10(_6.east);
		}
		function _12(pp)
		{
			if (!pp.length)
			{
				return;
			}
			var _13 = _9(pp);
			pp.panel("resize", {
				width: _13,
				height: _b.height,
				left: 0,
				top: _b.top
			});
			_b.left += _13;
			_b.width -= _13;
		};
		if (_14(_6.expandWest))
		{
			_12(_6.expandWest);
		} else
		{
			_12(_6.west);
		}
		_6.center.panel("resize", _b);
	};
	function _15(_16)
	{
		var cc = $(_16);
		cc.addClass("layout");
		function _state(cc)
		{
			cc.children("div").each(function ()
			{
				var _proxy = $.fn.layout.parsePanelOptions(this);
				if ("north,south,east,west,center".indexOf(_proxy.region) >= 0)
				{
					_1b(_16, _proxy, this);
				}
			});
		};
		cc.children("form").length ? _state(cc.children("form")) : _state(cc);
		cc.append("<div class=\"layout-split-proxy-h\"></div><div class=\"layout-split-proxy-v\"></div>");
		cc.bind("_resize",
		function (e, _opts)
		{
			var _1a = $.data(_16, "layout").options;
			if (_1a.fit == true || _opts)
			{
				_2(_16);
			}
			return false;
		});
	};
	function _1b(_1c, _1d, el)
	{
		_1d.region = _1d.region || "center";
		var _1e = $.data(_1c, "layout").panels;
		var cc = $(_1c);
		var dir = _1d.region;
		if (_1e[dir].length)
		{
			return;
		}
		var pp = $(el);
		if (!pp.length)
		{
			pp = $("<div></div>").appendTo(cc);
		}
		var _1f = $.extend({},
		$.fn.layout.paneldefaults, {
			width: (pp.length ? parseInt(pp[0].style.width) || pp.outerWidth() : "auto"),
			height: (pp.length ? parseInt(pp[0].style.height) || pp.outerHeight() : "auto"),
			doSize: false,
			collapsible: true,
			cls: ("layout-panel layout-panel-" + dir),
			bodyCls: "layout-body",
			onOpen: function ()
			{
				var _20 = $(this).panel("header").children("div.panel-tool");
				_20.children("a.panel-tool-collapse").hide();
				var _target = {
					north: "up",
					south: "down",
					east: "right",
					west: "left"
				};
				if (!_target[dir])
				{
					return;
				}
				var _index = "layout-button-" + _target[dir];
				var t = _20.children("a." + _index);
				if (!t.length)
				{
					t = $("<a href=\"javascript:void(0)\"></a>").addClass(_index).appendTo(_20);
					t.bind("click", {
						dir: dir
					},
					function (e)
					{
						_2f(_1c, e.data.dir);
						return false;
					});
				}
				$(this).panel("options").collapsible ? t.show() : t.hide();
			}
		},
		_1d);
		pp.panel(_1f);
		_1e[dir] = pp;
		if (pp.panel("options").split)
		{
			var _opts = pp.panel("panel");
			_opts.addClass("layout-split-" + dir);
			var _24 = "";
			if (dir == "north")
			{
				_24 = "s";
			}
			if (dir == "south")
			{
				_24 = "n";
			}
			if (dir == "east")
			{
				_24 = "w";
			}
			if (dir == "west")
			{
				_24 = "e";
			}
			_opts.resizable($.extend({},
			{
				handles: _24,
				onStartResize: function (e)
				{
					_1 = true;
					if (dir == "north" || dir == "south")
					{
						var _25 = $(">div.layout-split-proxy-v", _1c);
					} else
					{
						var _25 = $(">div.layout-split-proxy-h", _1c);
					}
					var top = 0,
					_26 = 0,
					_27 = 0,
					_28 = 0;
					var pos = {
						display: "block"
					};
					if (dir == "north")
					{
						pos.top = parseInt(_opts.css("top")) + _opts.outerHeight() - _25.height();
						pos.left = parseInt(_opts.css("left"));
						pos.width = _opts.outerWidth();
						pos.height = _25.height();
					} else
					{
						if (dir == "south")
						{
							pos.top = parseInt(_opts.css("top"));
							pos.left = parseInt(_opts.css("left"));
							pos.width = _opts.outerWidth();
							pos.height = _25.height();
						} else
						{
							if (dir == "east")
							{
								pos.top = parseInt(_opts.css("top")) || 0;
								pos.left = parseInt(_opts.css("left")) || 0;
								pos.width = _25.width();
								pos.height = _opts.outerHeight();
							} else
							{
								if (dir == "west")
								{
									pos.top = parseInt(_opts.css("top")) || 0;
									pos.left = _opts.outerWidth() - _25.width();
									pos.width = _25.width();
									pos.height = _opts.outerHeight();
								}
							}
						}
					}
					_25.css(pos);
					$("<div class=\"layout-mask\"></div>").css({
						left: 0,
						top: 0,
						width: cc.width(),
						height: cc.height()
					}).appendTo(cc);
				},
				onResize: function (e)
				{
					if (dir == "north" || dir == "south")
					{
						var _29 = $(">div.layout-split-proxy-v", _1c);
						_29.css("top", e.pageY - $(_1c).offset().top - _29.height() / 2);
					} else
					{
						var _29 = $(">div.layout-split-proxy-h", _1c);
						_29.css("left", e.pageX - $(_1c).offset().left - _29.width() / 2);
					}
					return false;
				},
				onStopResize: function (e)
				{
					cc.children("div.layout-split-proxy-v,div.layout-split-proxy-h").hide();
					pp.panel("resize", e.data);
					_2(_1c);
					_1 = false;
					cc.find(">div.layout-mask").remove();
				}
			},
			_1d));
		}
	};
	function _2a(_2b, _2c)
	{
		var _2d = $.data(_2b, "layout").panels;
		if (_2d[_2c].length)
		{
			_2d[_2c].panel("destroy");
			_2d[_2c] = $();
			var _2e = "expand" + _2c.substring(0, 1).toUpperCase() + _2c.substring(1);
			if (_2d[_2e])
			{
				_2d[_2e].panel("destroy");
				_2d[_2e] = undefined;
			}
		}
	};
	function _2f(_30, _31, _32)
	{
		if (_32 == undefined)
		{
			_32 = "normal";
		}
		var _33 = $.data(_30, "layout").panels;
		var p = _33[_31];
		if (p.panel("options").onBeforeCollapse.call(p) == false)
		{
			return;
		}
		var _34 = "expand" + _31.substring(0, 1).toUpperCase() + _31.substring(1);
		if (!_33[_34])
		{
			_33[_34] = _35(_31);
			_33[_34].panel("panel").bind("click",
			function ()
			{
				var _36 = _37();
				p.panel("expand", false).panel("open").panel("resize", _36.collapse);
				p.panel("panel").animate(_36.expand,
				function ()
				{
					$(this).unbind(".layout").bind("mouseleave.layout", {
						region: _31
					},
					function (e)
					{
						if (_1 == true)
						{
							return;
						}
						_2f(_30, e.data.region);
					});
				});
				return false;
			});
		}
		var _38 = _37();
		if (!_14(_33[_34]))
		{
			_33.center.panel("resize", _38.resizeC);
		}
		p.panel("panel").animate(_38.collapse, _32,
		function ()
		{
			p.panel("collapse", false).panel("close");
			_33[_34].panel("open").panel("resize", _38.expandP);
			$(this).unbind(".layout");
		});
		function _35(dir)
		{
			var _39;
			if (dir == "east")
			{
				_39 = "layout-button-left";
			} else
			{
				if (dir == "west")
				{
					_39 = "layout-button-right";
				} else
				{
					if (dir == "north")
					{
						_39 = "layout-button-down";
					} else
					{
						if (dir == "south")
						{
							_39 = "layout-button-up";
						}
					}
				}
			}
			var _3a = $.extend({},
			$.fn.layout.paneldefaults, {
				cls: "layout-expand",
				title: "&nbsp;",
				closed: true,
				doSize: false,
				tools: [{
					iconCls: _39,
					handler: function ()
					{
						_3e(_30, _31);
						return false;
					}
				}]
			});
			var p = $("<div></div>").appendTo(_30).panel(_3a);
			p.panel("panel").hover(function ()
			{
				$(this).addClass("layout-expand-over");
			},
			function ()
			{
				$(this).removeClass("layout-expand-over");
			});
			return p;
		};
		function _37()
		{
			var cc = $(_30);
			var _3b = _33.center.panel("options");
			if (_31 == "east")
			{
				var _3c = _33["east"].panel("options");
				return {
					resizeC: {
						width: _3b.width + _3c.width - 28
					},
					expand: {
						left: cc.width() - _3c.width
					},
					expandP: {
						top: _3b.top,
						left: cc.width() - 28,
						width: 28,
						height: _3b.height
					},
					collapse: {
						left: cc.width(),
						top: _3b.top,
						height: _3b.height
					}
				};
			} else
			{
				if (_31 == "west")
				{
					var _3d = _33["west"].panel("options");
					return {
						resizeC: {
							width: _3b.width + _3d.width - 28,
							left: 28
						},
						expand: {
							left: 0
						},
						expandP: {
							left: 0,
							top: _3b.top,
							width: 28,
							height: _3b.height
						},
						collapse: {
							left: -_3d.width,
							top: _3b.top,
							height: _3b.height
						}
					};
				} else
				{
					if (_31 == "north")
					{
						var hh = cc.height() - 28;
						if (_14(_33.expandSouth))
						{
							hh -= _33.expandSouth.panel("options").height;
						} else
						{
							if (_14(_33.south))
							{
								hh -= _33.south.panel("options").height;
							}
						}
						_33.east.panel("resize", {
							top: 28,
							height: hh
						});
						_33.west.panel("resize", {
							top: 28,
							height: hh
						});
						if (_14(_33.expandEast))
						{
							_33.expandEast.panel("resize", {
								top: 28,
								height: hh
							});
						}
						if (_14(_33.expandWest))
						{
							_33.expandWest.panel("resize", {
								top: 28,
								height: hh
							});
						}
						return {
							resizeC: {
								top: 28,
								height: hh
							},
							expand: {
								top: 0
							},
							expandP: {
								top: 0,
								left: 0,
								width: cc.width(),
								height: 28
							},
							collapse: {
								top: -_33["north"].panel("options").height,
								width: cc.width()
							}
						};
					} else
					{
						if (_31 == "south")
						{
							var hh = cc.height() - 28;
							if (_14(_33.expandNorth))
							{
								hh -= _33.expandNorth.panel("options").height;
							} else
							{
								if (_14(_33.north))
								{
									hh -= _33.north.panel("options").height;
								}
							}
							_33.east.panel("resize", {
								height: hh
							});
							_33.west.panel("resize", {
								height: hh
							});
							if (_14(_33.expandEast))
							{
								_33.expandEast.panel("resize", {
									height: hh
								});
							}
							if (_14(_33.expandWest))
							{
								_33.expandWest.panel("resize", {
									height: hh
								});
							}
							return {
								resizeC: {
									height: hh
								},
								expand: {
									top: cc.height() - _33["south"].panel("options").height
								},
								expandP: {
									top: cc.height() - 28,
									left: 0,
									width: cc.width(),
									height: 28
								},
								collapse: {
									top: cc.height(),
									width: cc.width()
								}
							};
						}
					}
				}
			}
		};
	};
	function _3e(_3f, _40)
	{
		var _41 = $.data(_3f, "layout").panels;
		var _42 = _43();
		var p = _41[_40];
		if (p.panel("options").onBeforeExpand.call(p) == false)
		{
			return;
		}
		var _44 = "expand" + _40.substring(0, 1).toUpperCase() + _40.substring(1);
		_41[_44].panel("close");
		p.panel("panel").stop(true, true);
		p.panel("expand", false).panel("open").panel("resize", _42.collapse);
		p.panel("panel").animate(_42.expand,
		function ()
		{
			_2(_3f);
		});
		function _43()
		{
			var cc = $(_3f);
			var _45 = _41.center.panel("options");
			if (_40 == "east" && _41.expandEast)
			{
				return {
					collapse: {
						left: cc.width(),
						top: _45.top,
						height: _45.height
					},
					expand: {
						left: cc.width() - _41["east"].panel("options").width
					}
				};
			} else
			{
				if (_40 == "west" && _41.expandWest)
				{
					return {
						collapse: {
							left: -_41["west"].panel("options").width,
							top: _45.top,
							height: _45.height
						},
						expand: {
							left: 0
						}
					};
				} else
				{
					if (_40 == "north" && _41.expandNorth)
					{
						return {
							collapse: {
								top: -_41["north"].panel("options").height,
								width: cc.width()
							},
							expand: {
								top: 0
							}
						};
					} else
					{
						if (_40 == "south" && _41.expandSouth)
						{
							return {
								collapse: {
									top: cc.height(),
									width: cc.width()
								},
								expand: {
									top: cc.height() - _41["south"].panel("options").height
								}
							};
						}
					}
				}
			}
		};
	};
	function _14(pp)
	{
		if (!pp)
		{
			return false;
		}
		if (pp.length)
		{
			return pp.panel("panel").is(":visible");
		} else
		{
			return false;
		}
	};
	function _46(_47)
	{
		var _48 = $.data(_47, "layout").panels;
		if (_48.east.length && _48.east.panel("options").collapsed)
		{
			_2f(_47, "east", 0);
		}
		if (_48.west.length && _48.west.panel("options").collapsed)
		{
			_2f(_47, "west", 0);
		}
		if (_48.north.length && _48.north.panel("options").collapsed)
		{
			_2f(_47, "north", 0);
		}
		if (_48.south.length && _48.south.panel("options").collapsed)
		{
			_2f(_47, "south", 0);
		}
	};
	$.fn.layout = function (_49, _4a)
	{
		if (typeof _49 == "string")
		{
			return $.fn.layout.methods[_49](this, _4a);
		}
		_49 = _49 || {};
		return this.each(function ()
		{
			var _4b = $.data(this, "layout");
			if (_4b)
			{
				$.extend(_4b.options, _49);
			} else
			{
				var _4c = $.extend({},
				$.fn.layout.defaults, $.fn.layout.parseOptions(this), _49);
				$.data(this, "layout", {
					options: _4c,
					panels: {
						center: $(),
						north: $(),
						south: $(),
						east: $(),
						west: $()
					}
				});
				_15(this);
			}
			_2(this);
			_46(this);
		});
	};
	$.fn.layout.methods = {
		resize: function (jq)
		{
			return jq.each(function ()
			{
				_2(this);
			});
		},
		panel: function (jq, _4d)
		{
			return $.data(jq[0], "layout").panels[_4d];
		},
		collapse: function (jq, _4e)
		{
			return jq.each(function ()
			{
				_2f(this, _4e);
			});
		},
		expand: function (jq, _4f)
		{
			return jq.each(function ()
			{
				_3e(this, _4f);
			});
		},
		add: function (jq, _50)
		{
			return jq.each(function ()
			{
				_1b(this, _50);
				_2(this);
				if ($(this).layout("panel", _50.region).panel("options").collapsed)
				{
					_2f(this, _50.region, 0);
				}
			});
		},
		remove: function (jq, _51)
		{
			return jq.each(function ()
			{
				_2a(this, _51);
				_2(this);
			});
		}
	};
	$.fn.layout.parseOptions = function (_52)
	{
		return $.extend({},
		$.parser.parseOptions(_52, [{
			fit: "boolean"
		}]));
	};
	$.fn.layout.defaults = {
		fit: false
	};
	$.fn.layout.parsePanelOptions = function (_53)
	{
		var t = $(_53);
		return $.extend({},
		$.fn.panel.parseOptions(_53), $.parser.parseOptions(_53, ["region", {
			split: "boolean",
			minWidth: "number",
			minHeight: "number",
			maxWidth: "number",
			maxHeight: "number"
		}]));
	};
	$.fn.layout.paneldefaults = $.extend({},
	$.fn.panel.defaults, {
		region: null,
		split: false,
		minWidth: 10,
		minHeight: 10,
		maxWidth: 10000,
		maxHeight: 10000
	});
})(jQuery);
/**
 * jQuery EasyUI 1.2.4
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 */
(function($) {
	var _resizing = false;
	function _resize(_target) {
		var _opts = $.data(_target, "fixedpanel").options;
		var _panels = $.data(_target, "fixedpanel").panels;
		var cc = $(_target);
		if (_opts.fit == true) {
			var p = cc.parent();
			cc.width(p.width()).height(p.height());
		}
		var _position = {
			top: 0,
			left: 0,
			width: cc.width(),
			height: $('body').height()-2
		};
		function _expandNorth(pp) {
			if (!pp || pp.length == 0) {
				return;
			}
			pp.panel("resize", {
				width: cc.width(),
				height: pp.panel("options").height,
				left: 0,
				top: 0
			});
			_position.top += pp.panel("options").height;
			_position.height -= pp.panel("options").height;
		};
		if (_panelVisible(_panels.expandNorth)) {
			_expandNorth(_panels.expandNorth);
		} else {
			_expandNorth(_panels.north);
		}
		function _expandSouth(pp) {
			if (!pp || pp.length == 0) {
				return;
			}
			pp.panel("resize", {
				width: cc.width(),
				height: pp.panel("options").height,
				left: 0,
				top: cc.height() - pp.panel("options").height
			});
			_position.height -= pp.panel("options").height;
		};
		if (_panelVisible(_panels.expandSouth)) {
			_expandSouth(_panels.expandSouth);
		} else {
			_expandSouth(_panels.south);
		}
		function _expandEast(pp) {
			if (!pp || pp.length == 0) {
				return;
			}
			pp.panel("resize", {
				width: pp.panel("options").width,
				height: _position.height,
				left: cc.width() - pp.panel("options").width,
				top: _position.top
			});
			_position.width -= pp.panel("options").width;
		};
		if (_panelVisible(_panels.expandEast)) {
			_expandEast(_panels.expandEast);
		} else {
			_expandEast(_panels.east);
		}
		function _expandWest(pp) {
			if (!pp || pp.length == 0) {
				return;
			}
			pp.panel("resize", {
				width: pp.panel("options").width,
				height: _position.height,
				left: 0,
				top: _position.top
			});
			_position.left += pp.panel("options").width;
			_position.width -= pp.panel("options").width;
			$("body").css({"margin-left":cc.parent().outerWidth()+1});
		};
		if (_panelVisible(_panels.expandWest)) {
			_expandWest(_panels.expandWest);
		} else {
			_expandWest(_panels.west);
		}
	};
	function _getPanels(_container, _options) {
		var cc = $(_container);
		var body=$("body").css("text-align", "left");
		$("body>div.frame").css("margin-left", "0px");

		function _createPanel(_dir) {
			var pp = cc.addClass("fixedpanel-body");
			if(pp.length==0)return;

			var _toolCls = null;
			if (_dir == "north") {
				_toolCls = "fixedpanel-button-up";
			} else if (_dir == "south") {
				_toolCls = "fixedpanel-button-down";
			} else if (_dir == "east") {
				_toolCls = "fixedpanel-button-right";
			} else if (_dir == "west") {
				_toolCls = "fixedpanel-button-left";
			}
			var cls = "fixedpanel-panel fixedpanel-panel-" + _dir;
			if (_options.split) {
				cls += " fixedpanel-split-" + _dir;
			}
			pp.panel({
				cls: cls,
				doSize: false,
				border: _options.border,
				width: (pp.length ? parseInt(cc[0].style.width) || cc.outerWidth() : "auto"),
				height: (pp.length ? parseInt(cc[0].style.height) || cc.outerHeight() : "auto"),
				tools: [{
					iconCls: _toolCls,
					handler: function() {
						_collapsePanel(_container, _dir);
					}
				}]
			}).parent().find(".panel-header").css({"border-top":"0px","border-left":"0px"});
			pp.css({"border-bottom":"0px","border-left":"0px"}).show();
			if (_options.split) {
				var _panel = pp.panel("panel");
				var _handles = "";
				if (_dir == "north") {
					_handles = "s";
				}
				if (_dir == "south") {
					_handles = "n";
				}
				if (_dir == "east") {
					_handles = "w";
				}
				if (_dir == "west") {
					_handles = "e";
				}
				_panel.resizable({
					handles: _handles,
					onStartResize: function(e) {
						_resizing = true;
						if (_dir == "north" || _dir == "south") {
							var _proxy = $(">div.fixedpanel-split-proxy-v", body);
						} else {
							var _proxy = $(">div.fixedpanel-split-proxy-h", body);
						}
						var pos = {
							display: "block"
						};
						if (_dir == "north") {
							pos.top = parseInt(_panel.css("top")) + _panel.outerHeight() - _proxy.height();
							pos.left = parseInt(_panel.css("left"));
							pos.width = _panel.outerWidth();
							pos.height = _proxy.height();
						} else if (_dir == "south") {
							pos.top = parseInt(_panel.css("top"));
							pos.left = parseInt(_panel.css("left"));
							pos.width = _panel.outerWidth();
							pos.height = _proxy.height();
						} else if (_dir == "east") {
							pos.top = parseInt(_panel.css("top")) || 0;
							pos.left = parseInt(_panel.css("left")) || 0;
							pos.width = _proxy.width();
							pos.height = _panel.outerHeight();
						} else if (_dir == "west") {
							pos.top = parseInt(_panel.css("top")) || 0;
							pos.left = _panel.outerWidth() - _proxy.width();
							pos.width = _proxy.width();
							pos.height = _panel.outerHeight();
						}
						_proxy.css(pos);
						$("<div class=\"fixedpanel-mask\"></div>").css({
							left: 0,
							top: 0,
							width: body.outerWidth(),
							height: body.outerHeight()
						}).appendTo(body);
					},
					onResize: function(e) {
						if (_dir == "north" || _dir == "south") {
							var _splitProxy = $(">div.fixedpanel-split-proxy-v", body);
							_splitProxy.css("top", e.pageY - $(_container).offset().top - _splitProxy.height() / 2);
						} else {
							var _splitProxy = $(">div.fixedpanel-split-proxy-h", body);
							_splitProxy.css("left", e.pageX - $(_container).offset().left - _splitProxy.width() / 2);
						}
						return false;
					},
					onStopResize: function() {
						$(">div.fixedpanel-split-proxy-v", body).css("display", "none");
						$(">div.fixedpanel-split-proxy-h", body).css("display", "none");
						var _panelOpts = pp.panel("options");
						_panelOpts.width = _panel.outerWidth();
						_panelOpts.height = _panel.outerHeight();
						_panelOpts.left = _panel.css("left");
						_panelOpts.top = _panel.css("top");
						pp.panel("resize");
						_resize(_container);
						_resizing = false;
						body.find(">div.fixedpanel-mask").remove();
					}
				});
			}
			return pp;
		};
		$("<div class=\"fixedpanel-split-proxy-h\"></div>").appendTo(body);
		$("<div class=\"fixedpanel-split-proxy-v\"></div>").appendTo(body);
		var _panels = {
			//center: _createPanel("center")
		};
		//_panels.north = _createPanel("north");
		//_panels.south = _createPanel("south");
		//_panels.east = _createPanel("east");
		if(_options.direction=='west')
		{
			_panels.west = _createPanel("west");
		}
		$(_container).bind("_resize",
		function(e, _1a) {
			var _opts = $.data(_container, "fixedpanel").options;
			if (_opts.fit == true || _1a) {
				_resize(_container);
			}
			return false;
		});
		return _panels;
	};
	function _collapsePanel(_container, _region) {
		var _panels = $.data(_container, "fixedpanel").panels;
		var cc = $(_container);
		function _createExpandPanel(dir) {
			var _icon;
			if (dir == "east") {
				_icon = "fixedpanel-button-left";
			} else if (dir == "west") {
				_icon = "fixedpanel-button-right";
			} else if (dir == "north") {
				_icon = "fixedpanel-button-down";
			} else if (dir == "south") {
				_icon = "fixedpanel-button-up";
			}
			var p = $("<div></div>").appendTo("body").panel({
				cls: "fixedpanel-expand",
				title: "&nbsp;",
				closed: true,
				doSize: false,
				tools: [{
					iconCls: _icon,
					handler: function() {
						_expandPanel(_container, _region);
					}
				}]
			});
			p.panel("panel").hover(function() {
				$(this).addClass("fixedpanel-expand-over");
			},
			function() {
				$(this).removeClass("fixedpanel-expand-over");
			});
			return p;
		};
		if (_region == "east") {
			if (_panels.east.panel("options").onBeforeCollapse.call(_panels.east) == false) {
				return;
			}
			_panels.center.panel("resize", {
				width: _panels.center.panel("options").width + _panels.east.panel("options").width - 28
			});
			_panels.east.panel("panel").animate({
				left: cc.width()
			},
			function() {
				_panels.east.panel("close");
				_panels.expandEast.panel("open").panel("resize", {
					top: _panels.east.panel("options").top,
					left: cc.width() - 28,
					width: 28,
					height: _panels.east.panel("options").height
				});
				_panels.east.panel("options").onCollapse.call(_panels.east);
			});
			if (!_panels.expandEast) {
				_panels.expandEast = _createExpandPanel("east");
				_panels.expandEast.panel("panel").click(function() {
					_panels.east.panel("open").panel("resize", {
						left: cc.width()
					});
					_panels.east.panel("panel").animate({
						left: cc.width() - _panels.east.panel("options").width
					});
					return false;
				});
			}
		} else if (_region == "west") {
			if (_panels.west.panel("options").onBeforeCollapse.call(_panels.west) == false) {
				return;
			}
			_panels.west.panel("panel").animate({
				left: -_panels.west.panel("options").width
			},
			function() {
				_panels.west.panel("close");
				_panels.expandWest.panel("open").panel("resize", {
					top: _panels.west.panel("options").top,
					left: 0,
					width: 28,
					height: _panels.west.panel("options").height
				});
				$("body").css({"margin-left":28+1});
				_panels.west.panel("options").onCollapse.call(_panels.west);
			});
			if (!_panels.expandWest) {
				_panels.expandWest = _createExpandPanel("west");
				_panels.expandWest.panel("panel").click(function() {
					_panels.west.panel("open").panel("resize", {
						left: -_panels.west.panel("options").width
					});
					_panels.west.panel("panel").animate({
						left: 0
					});
					return false;
				});
			}
		} else if (_region == "north") {
			if (_panels.north.panel("options").onBeforeCollapse.call(_panels.north) == false) {
				return;
			}
			var hh = cc.height() - 28;
			if (_panelVisible(_panels.expandSouth)) {
				hh -= _panels.expandSouth.panel("options").height;
			} else {
				if (_panelVisible(_panels.south)) {
					hh -= _panels.south.panel("options").height;
				}
			}
			_panels.center.panel("resize", {
				top: 28,
				height: hh
			});
			_panels.east.panel("resize", {
				top: 28,
				height: hh
			});
			_panels.west.panel("resize", {
				top: 28,
				height: hh
			});
			if (_panelVisible(_panels.expandEast)) {
				_panels.expandEast.panel("resize", {
					top: 28,
					height: hh
				});
			}
			if (_panelVisible(_panels.expandWest)) {
				_panels.expandWest.panel("resize", {
					top: 28,
					height: hh
				});
			}
			_panels.north.panel("panel").animate({
				top: -_panels.north.panel("options").height
			},
			function() {
				_panels.north.panel("close");
				_panels.expandNorth.panel("open").panel("resize", {
					top: 0,
					left: 0,
					width: cc.width(),
					height: 28
				});
				_panels.north.panel("options").onCollapse.call(_panels.north);
			});
			if (!_panels.expandNorth) {
				_panels.expandNorth = _createExpandPanel("north");
				_panels.expandNorth.panel("panel").click(function() {
					_panels.north.panel("open").panel("resize", {
						top: -_panels.north.panel("options").height
					});
					_panels.north.panel("panel").animate({
						top: 0
					});
					return false;
				});
			}
		} else if (_region == "south") {
			if (_panels.south.panel("options").onBeforeCollapse.call(_panels.south) == false) {
				return;
			}
			var hh = cc.height() - 28;
			if (_panelVisible(_panels.expandNorth)) {
				hh -= _panels.expandNorth.panel("options").height;
			} else {
				if (_panelVisible(_panels.north)) {
					hh -= _panels.north.panel("options").height;
				}
			}
			_panels.center.panel("resize", {
				height: hh
			});
			_panels.east.panel("resize", {
				height: hh
			});
			_panels.west.panel("resize", {
				height: hh
			});
			if (_panelVisible(_panels.expandEast)) {
				_panels.expandEast.panel("resize", {
					height: hh
				});
			}
			if (_panelVisible(_panels.expandWest)) {
				_panels.expandWest.panel("resize", {
					height: hh
				});
			}
			_panels.south.panel("panel").animate({
				top: cc.height()
			},
			function() {
				_panels.south.panel("close");
				_panels.expandSouth.panel("open").panel("resize", {
					top: cc.height() - 28,
					left: 0,
					width: cc.width(),
					height: 28
				});
				_panels.south.panel("options").onCollapse.call(_panels.south);
			});
			if (!_panels.expandSouth) {
				_panels.expandSouth = _createExpandPanel("south");
				_panels.expandSouth.panel("panel").click(function() {
					_panels.south.panel("open").panel("resize", {
						top: cc.height()
					});
					_panels.south.panel("panel").animate({
						top: cc.height() - _panels.south.panel("options").height
					});
					return false;
				});
			}
		}
	};
	function _expandPanel(_container, _region) {
		var _panels = $.data(_container, "fixedpanel").panels;
		var cc = $(_container);
		if (_region == "east" && _panels.expandEast) {
			if (_panels.east.panel("options").onBeforeExpand.call(_panels.east) == false) {
				return;
			}
			_panels.expandEast.panel("close");
			_panels.east.panel("panel").stop(true, true);
			_panels.east.panel("open").panel("resize", {
				left: cc.width()
			});
			_panels.east.panel("panel").animate({
				left: cc.width() - _panels.east.panel("options").width
			},
			function() {
				_resize(_container);
				_panels.east.panel("options").onExpand.call(_panels.east);
			});
		} else {
			if (_region == "west" && _panels.expandWest) {
				if (_panels.west.panel("options").onBeforeExpand.call(_panels.west) == false) {
					return;
				}
				_panels.expandWest.panel("close");
				_panels.west.panel("panel").stop(true, true);
				_panels.west.panel("open").panel("resize", {
					left: -_panels.west.panel("options").width
				});
				_panels.west.panel("panel").animate({
					left: 0
				},
				function() {
					_resize(_container);
					_panels.west.panel("options").onExpand.call(_panels.west);
				});
			} else {
				if (_region == "north" && _panels.expandNorth) {
					if (_panels.north.panel("options").onBeforeExpand.call(_panels.north) == false) {
						return;
					}
					_panels.expandNorth.panel("close");
					_panels.north.panel("panel").stop(true, true);
					_panels.north.panel("open").panel("resize", {
						top: -_panels.north.panel("options").height
					});
					_panels.north.panel("panel").animate({
						top: 0
					},
					function() {
						_resize(_container);
						_panels.north.panel("options").onExpand.call(_panels.north);
					});
				} else {
					if (_region == "south" && _panels.expandSouth) {
						if (_panels.south.panel("options").onBeforeExpand.call(_panels.south) == false) {
							return;
						}
						_panels.expandSouth.panel("close");
						_panels.south.panel("panel").stop(true, true);
						_panels.south.panel("open").panel("resize", {
							top: cc.height()
						});
						_panels.south.panel("panel").animate({
							top: cc.height() - _panels.south.panel("options").height
						},
						function() {
							_resize(_container);
							_panels.south.panel("options").onExpand.call(_panels.south);
						});
					}
				}
			}
		}
	};
	function _bindEvents(_container) {
		var _panels = $.data(_container, "fixedpanel").panels;
		var cc = $(_container);
		if (_panels.east && _panels.east.length) {
			_panels.east.panel("panel").bind("mouseover", "east", _collapsePanel);
		}
		if (_panels.west && _panels.west.length) {
			_panels.west.panel("panel").bind("mouseover", "west", _collapsePanel);
		}
		if (_panels.north && _panels.north.length) {
			_panels.north.panel("panel").bind("mouseover", "north", _collapsePanel);
		}
		if (_panels.south && _panels.south.length) {
			_panels.south.panel("panel").bind("mouseover", "south", _collapsePanel);
		}
		function _collapsePanel(e) {
			if (_resizing == true) {
				return;
			}
			if (e.data != "east" && _panelVisible(_panels.east) && _panelVisible(_panels.expandEast)) {
				_panels.east.panel("panel").animate({
					left: cc.width()
				},
				function() {
					_panels.east.panel("close");
				});
			}
			if (e.data != "west" && _panelVisible(_panels.west) && _panelVisible(_panels.expandWest)) {
				_panels.west.panel("panel").animate({
					left: -_panels.west.panel("options").width
				},
				function() {
					_panels.west.panel("close");
				});
			}
			if (e.data != "north" && _panelVisible(_panels.north) && _panelVisible(_panels.expandNorth)) {
				_panels.north.panel("panel").animate({
					top: -_panels.north.panel("options").height
				},
				function() {
					_panels.north.panel("close");
				});
			}
			if (e.data != "south" && _panelVisible(_panels.south) && _panelVisible(_panels.expandSouth)) {
				_panels.south.panel("panel").animate({
					top: cc.height()
				},
				function() {
					_panels.south.panel("close");
				});
			}
			return false;
		};
	};
	function _panelVisible(pp) {
		if (!pp) {
			return false;
		}
		if (pp.length) {
			return pp.panel("panel").is(":visible");
		} else {
			return false;
		}
	};
	$.fn.fixedpanel = function(methodName, options) {
		if (typeof methodName == "string") {
			return $.fn.fixedpanel.methods[methodName](this, options);
		}
		return this.each(function() {
			var _fixedpanelData = $.data(this, "fixedpanel");
			if (!_fixedpanelData) {
				var _options = $.extend({},
				$.fn.fixedpanel.defaults, 
				{
					fit: $(this).attr("fit") == "true"
				});
				$.data(this, "fixedpanel", {
					options: _options,
					panels: _getPanels(this, _options)
				});
				_bindEvents(this);
			}
			_resize(this);
		});
	};
	$.fn.fixedpanel.methods = {
		resize: function(jq) {
			return jq.each(function() {
				_resize(this);
			});
		},
		panel: function(jq, _region) {
			return $.data(jq[0], "fixedpanel").panels[_region];
		},
		collapse: function(jq, _region) {
			return jq.each(function() {
				_collapsePanel(this, _region);
			});
		},
		expand: function(jq, _region) {
			return jq.each(function() {
				_expandPanel(this, _region);
			});
		}
	};
	$.fn.fixedpanel.defaults = {
		direction: 'west',
		width: 160,
		split:true,
		border:true
	};
})(jQuery);
(function ($)
{
	function _1(_2, _3)
	{
		_3 = _3 || {};
		var _4 = {};
		if (_3.onSubmit)
		{
			if (_3.onSubmit.call(_2, _4) == false)
			{
				return;
			}
		}
		var _5 = $(_2);
		if (_3.url)
		{
			_5.attr("action", _3.url);
		}
		var _6 = "easyui_frame_" + (new Date().getTime());
		var _7 = $("<iframe id=" + _6 + " name=" + _6 + "></iframe>").attr("src", window.ActiveXObject ? "javascript:false" : "about:blank").css({ position: "absolute", top: -1000, left: -1000 });
		var t = _5.attr("target"), a = _5.attr("action");
		_5.attr("target", _6);
		var _8 = $();
		try
		{
			_7.appendTo("body");
			_7.bind("load", cb);
			for (var n in _4)
			{
				var f = $("<input type=\"hidden\" name=\"" + n + "\">").val(_4[n]).appendTo(_5);
				_8 = _8.add(f);
			}
			_5[0].submit();
		}
		finally
		{
			_5.attr("action", a);
			t ? _5.attr("target", t) : _5.removeAttr("target");
			_8.remove();
		}
		var _9 = 10;
		function cb()
		{
			_7.unbind();
			var _a = $("#" + _6).contents().find("body");
			var _b = _a.html();
			if (_b == "")
			{
				if (--_9)
				{
					setTimeout(cb, 100);
					return;
				}
				return;
			}
			var ta = _a.find(">textarea");
			if (ta.length)
			{
				_b = ta.val();
			} else
			{
				var _c = _a.find(">pre");
				if (_c.length)
				{
					_b = _c.html();
				}
			}
			if (_3.success)
			{
				_3.success(_b);
			}
			setTimeout(function ()
			{
				_7.unbind();
				_7.remove();
			}, 100);
		};
	};
	function _d(_e, _f)
	{
		if (!$.data(_e, "form"))
		{
			$.data(_e, "form", { options: $.extend({}, $.fn.form.defaults) });
		}
		var _10 = $.data(_e, "form").options;
		if (typeof _f == "string")
		{
			var _11 = {};
			if (_10.onBeforeLoad.call(_e, _11) == false)
			{
				return;
			}
			$.ajax({ url: _f, data: _11, dataType: "json", success: function (_12)
			{
				_13(_12);
			}, error: function ()
			{
				_10.onLoadError.apply(_e, arguments);
			} 
			});
		} else
		{
			_13(_f);
		}
		function _13(_14)
		{
			var _15 = $(_e);
			for (var _16 in _14)
			{
				var val = _14[_16];
				var rr = _state(_16, val);
				if (!rr.length)
				{
					var f = _15.find("input[numberboxName=\"" + _16 + "\"]");
					if (f.length)
					{
						f.numberbox("setValue", val);
					} else
					{
						$("input[name=\"" + _16 + "\"]", _15).val(val);
						$("textarea[name=\"" + _16 + "\"]", _15).val(val);
						$("select[name=\"" + _16 + "\"]", _15).val(val);
					}
				}
				_proxy(_16, val);
			}
			_10.onLoadSuccess.call(_e, _14);
			_20(_e);
		};
		function _state(_opts, val)
		{
			var rr = $(_e).find("input[name=\"" + _opts + "\"][type=radio], input[name=\"" + _opts + "\"][type=checkbox]");
			rr._propAttr("checked", false);
			rr.each(function ()
			{
				var f = $(this);
				if (f.val() == String(val) || $.inArray(f.val(), val) >= 0)
				{
					f._propAttr("checked", true);
				}
			});
			return rr;
		};
		function _proxy(_1a, val)
		{
			var _1b = $(_e);
			var cc = ["combobox", "combotree", "combogrid", "datetimebox", "datebox", "combo"];
			var c = _1b.find("[comboName=\"" + _1a + "\"]");
			if (c.length)
			{
				for (var i = 0; i < cc.length; i++)
				{
					var _1c = cc[i];
					if (c.hasClass(_1c + "-f"))
					{
						if (c[_1c]("options").multiple)
						{
							c[_1c]("setValues", val);
						} else
						{
							c[_1c]("setValue", val);
						}
						return;
					}
				}
			}
		};
	};
	function _1d(_1e)
	{
		$("input,select,textarea", _1e).each(function ()
		{
			var t = this.type, tag = this.tagName.toLowerCase();
			if (t == "text" || t == "hidden" || t == "password" || tag == "textarea")
			{
				this.value = "";
			} else
			{
				if (t == "file")
				{
					var _1f = $(this);
					_1f.after(_1f.clone().val(""));
					_1f.remove();
				} else
				{
					if (t == "checkbox" || t == "radio")
					{
						this.checked = false;
					} else
					{
						if (tag == "select")
						{
							this.selectedIndex = -1;
						}
					}
				}
			}
		});
		if ($.fn.combo)
		{
			$(".combo-f", _1e).combo("clear");
		}
		if ($.fn.combobox)
		{
			$(".combobox-f", _1e).combobox("clear");
		}
		if ($.fn.combotree)
		{
			$(".combotree-f", _1e).combotree("clear");
		}
		if ($.fn.combogrid)
		{
			$(".combogrid-f", _1e).combogrid("clear");
		}
		_20(_1e);
	};
	function _target(_index)
	{
		_index.reset();
		var t = $(_index);
		if ($.fn.combo)
		{
			t.find(".combo-f").combo("reset");
		}
		if ($.fn.combobox)
		{
			t.find(".combobox-f").combobox("reset");
		}
		if ($.fn.combotree)
		{
			t.find(".combotree-f").combotree("reset");
		}
		if ($.fn.combogrid)
		{
			t.find(".combogrid-f").combogrid("reset");
		}
		if ($.fn.datebox)
		{
			t.find(".datebox-f").datebox("reset");
		}
		if ($.fn.datetimebox)
		{
			t.find(".datetimebox-f").datetimebox("reset");
		}
		if ($.fn.spinner)
		{
			t.find(".spinner-f").spinner("reset");
		}
		if ($.fn.timespinner)
		{
			t.find(".timespinner-f").timespinner("reset");
		}
		if ($.fn.numberbox)
		{
			t.find(".numberbox-f").numberbox("reset");
		}
		if ($.fn.numberspinner)
		{
			t.find(".numberspinner-f").numberspinner("reset");
		}
		_20(_index);
	};
	function _opts(_24)
	{
		var _25 = $.data(_24, "form").options;
		var _26 = $(_24);
		_26.unbind(".form").bind("submit.form", function ()
		{
			setTimeout(function ()
			{
				_1(_24, _25);
			}, 0);
			return false;
		});
	};
	function _20(_27)
	{
		if ($.fn.validatebox)
		{
			var t = $(_27);
			t.find(".validatebox-text:not(:disabled)").validatebox("validate");
			var _28 = t.find(".validatebox-invalid");
			_28.filter(":not(:disabled):first").focus();
			return _28.length == 0;
		}
		return true;
	};
	function _29(_2a, _2b)
	{
		$(_2a).find(".validatebox-text:not(:disabled)").validatebox(_2b ? "disableValidation" : "enableValidation");
	};
	$.fn.form = function (_2c, _2d)
	{
		if (typeof _2c == "string")
		{
			return $.fn.form.methods[_2c](this, _2d);
		}
		_2c = _2c || {};
		return this.each(function ()
		{
			if (!$.data(this, "form"))
			{
				$.data(this, "form", { options: $.extend({}, $.fn.form.defaults, _2c) });
			}
			_opts(this);
		});
	};
	$.fn.form.methods = { submit: function (jq, _2e)
	{
		return jq.each(function ()
		{
			_1(this, $.extend({}, $.fn.form.defaults, _2e || {}));
		});
	}, load: function (jq, _2f)
	{
		return jq.each(function ()
		{
			_d(this, _2f);
		});
	}, clear: function (jq)
	{
		return jq.each(function ()
		{
			_1d(this);
		});
	}, reset: function (jq)
	{
		return jq.each(function ()
		{
			_target(this);
		});
	}, validate: function (jq)
	{
		return _20(jq[0]);
	}, disableValidation: function (jq)
	{
		return jq.each(function ()
		{
			_29(this, true);
		});
	}, enableValidation: function (jq)
	{
		return jq.each(function ()
		{
			_29(this, false);
		});
	} 
	};
	$.fn.form.defaults = { url: null, onSubmit: function (_30)
	{
		return $(this).form("validate");
	}, success: function (_31)
	{
	}, onBeforeLoad: function (_32)
	{
	}, onLoadSuccess: function (_33)
	{
	}, onLoadError: function ()
	{
	} 
	};
})(jQuery);

(function ($)
{
	function _1(_2)
	{
		var _3 = $.data(_2, "splitbutton").options;
		$(_2).menubutton(_3);
	};
	$.fn.splitbutton = function (_4, _5)
	{
		if (typeof _4 == "string")
		{
			var _6 = $.fn.splitbutton.methods[_4];
			if (_6)
			{
				return _6(this, _5);
			} else
			{
				return this.menubutton(_4, _5);
			}
		}
		_4 = _4 || {};
		return this.each(function ()
		{
			var _7 = $.data(this, "splitbutton");
			if (_7)
			{
				$.extend(_7.options, _4);
			} else
			{
				$.data(this, "splitbutton", {
					options: $.extend({},
					$.fn.splitbutton.defaults, $.fn.splitbutton.parseOptions(this), _4)
				});
				$(this).removeAttr("disabled");
			}
			_1(this);
		});
	};
	$.fn.splitbutton.methods = {
		options: function (jq)
		{
			var _8 = jq.menubutton("options");
			var _9 = $.data(jq[0], "splitbutton").options;
			$.extend(_9, {
				disabled: _8.disabled,
				toggle: _8.toggle,
				selected: _8.selected
			});
			return _9;
		}
	};
	$.fn.splitbutton.parseOptions = function (_a)
	{
		var t = $(_a);
		return $.extend({},
		$.fn.linkbutton.parseOptions(_a), $.parser.parseOptions(_a, ["menu", {
			plain: "boolean",
			duration: "number"
		}]));
	};
	$.fn.splitbutton.defaults = $.extend({},
	$.fn.linkbutton.defaults, {
		plain: true,
		menu: null,
		duration: 100,
		cls: {
			btn1: "s-btn-active",
			btn2: "s-btn-plain-active",
			arrow: "s-btn-downarrow",
			trigger: "s-btn-downarrow"
		}
	});
})(jQuery);
(function ($)
{
	function _1(_2)
	{
		var _3 = $.data(_2, "accordion");
		var _4 = _3.options;
		var _5 = _3.panels;
		var cc = $(_2);
		_4.fit ? $.extend(_4, cc._fit()) : cc._fit(false);
		if (_4.width > 0)
		{
			cc._outerWidth(_4.width);
		}
		var _6 = "auto";
		if (_4.height > 0)
		{
			cc._outerHeight(_4.height);
			var _7 = _5.length ? _5[0].panel("header").css("height", "")._outerHeight() : "auto";
			var _6 = cc.height() - (_5.length - 1) * _7;
		}
		for (var i = 0; i < _5.length; i++)
		{
			var _8 = _5[i];
			_8.panel("header")._outerHeight(_7);
			_8.panel("resize", {
				width: cc.width(),
				height: _6
			});
		}
	};
	function _9(_a)
	{
		var _b = $.data(_a, "accordion").panels;
		for (var i = 0; i < _b.length; i++)
		{
			var _c = _b[i];
			if (_c.panel("options").collapsed == false)
			{
				return _c;
			}
		}
		return null;
	};
	function _d(_e, _f)
	{
		var _10 = $.data(_e, "accordion").panels;
		for (var i = 0; i < _10.length; i++)
		{
			if (_10[i][0] == $(_f)[0])
			{
				return i;
			}
		}
		return -1;
	};
	function _11(_12, _13, _14)
	{
		var _15 = $.data(_12, "accordion").panels;
		if (typeof _13 == "number")
		{
			if (_13 < 0 || _13 >= _15.length)
			{
				return null;
			} else
			{
				var _16 = _15[_13];
				if (_14)
				{
					_15.splice(_13, 1);
				}
				return _16;
			}
		}
		for (var i = 0; i < _15.length; i++)
		{
			var _16 = _15[i];
			if (_16.panel("options").title == _13)
			{
				if (_14)
				{
					_15.splice(i, 1);
				}
				return _16;
			}
		}
		return null;
	};
	function _state(_proxy)
	{
		var _opts = $.data(_proxy, "accordion").options;
		var cc = $(_proxy);
		if (_opts.border)
		{
			cc.removeClass("accordion-noborder");
		} else
		{
			cc.addClass("accordion-noborder");
		}
	};
	function _1a(_1b)
	{
		var cc = $(_1b);
		cc.addClass("accordion");
		var _1c = [];
		cc.children("div").each(function ()
		{
			var _1d = $.extend({},
			$.parser.parseOptions(this), {
				selected: ($(this).attr("selected") ? true : undefined)
			});
			var pp = $(this);
			_1c.push(pp);
			_20(_1b, pp, _1d);
		});
		cc.bind("_resize",
		function (e, _1e)
		{
			var _1f = $.data(_1b, "accordion").options;
			if (_1f.fit == true || _1e)
			{
				_1(_1b);
			}
			return false;
		});
		return {
			accordion: cc,
			panels: _1c
		};
	};
	function _20(_target, pp, _index)
	{
		pp.panel($.extend({},
		_index, {
			collapsible: false,
			minimizable: false,
			maximizable: false,
			closable: false,
			doSize: false,
			collapsed: true,
			headerCls: "accordion-header",
			bodyCls: "accordion-body",
			onBeforeExpand: function ()
			{
				if (_index.onBeforeExpand)
				{
					if (_index.onBeforeExpand.call(this) == false)
					{
						return false;
					}
				}
				var _opts = _9(_target);
				if (_opts)
				{
					var _24 = $(_opts).panel("header");
					_24.removeClass("accordion-header-selected");
					_24.find(".accordion-collapse").triggerHandler("click");
				}
				var _24 = pp.panel("header");
				_24.addClass("accordion-header-selected");
				_24.find(".accordion-collapse").removeClass("accordion-expand");
			},
			onExpand: function ()
			{
				if (_index.onExpand)
				{
					_index.onExpand.call(this);
				}
				var _25 = $.data(_target, "accordion").options;
				_25.onSelect.call(_target, pp.panel("options").title, _d(_target, this));
			},
			onBeforeCollapse: function ()
			{
				if (_index.onBeforeCollapse)
				{
					if (_index.onBeforeCollapse.call(this) == false)
					{
						return false;
					}
				}
				var _26 = pp.panel("header");
				_26.removeClass("accordion-header-selected");
				_26.find(".accordion-collapse").addClass("accordion-expand");
			}
		}));
		var _27 = pp.panel("header");
		var t = $("<a class=\"accordion-collapse accordion-expand\" href=\"javascript:void(0)\"></a>").appendTo(_27.children("div.panel-tool"));
		t.bind("click",
		function (e)
		{
			var _28 = $.data(_target, "accordion").options.animate;
			_35(_target);
			if (pp.panel("options").collapsed)
			{
				pp.panel("expand", _28);
			} else
			{
				pp.panel("collapse", _28);
			}
			return false;
		});
		_27.click(function ()
		{
			$(this).find(".accordion-collapse").triggerHandler("click");
			return false;
		});
	};
	function _29(_2a, _2b)
	{
		var _2c = _11(_2a, _2b);
		if (!_2c)
		{
			return;
		}
		var _2d = _9(_2a);
		if (_2d && _2d[0] == _2c[0])
		{
			return;
		}
		_2c.panel("header").triggerHandler("click");
	};
	function _2e(_2f)
	{
		var _30 = $.data(_2f, "accordion").panels;
		for (var i = 0; i < _30.length; i++)
		{
			if (_30[i].panel("options").selected)
			{
				_31(i);
				return;
			}
		}
		if (_30.length)
		{
			_31(0);
		}
		function _31(_32)
		{
			var _33 = $.data(_2f, "accordion").options;
			var _34 = _33.animate;
			_33.animate = false;
			_29(_2f, _32);
			_33.animate = _34;
		};
	};
	function _35(_36)
	{
		var _37 = $.data(_36, "accordion").panels;
		for (var i = 0; i < _37.length; i++)
		{
			_37[i].stop(true, true);
		}
	};
	function add(_38, _39)
	{
		var _3a = $.data(_38, "accordion");
		var _3b = _3a.options;
		var _3c = _3a.panels;
		if (_39.selected == undefined)
		{
			_39.selected = true;
		}
		_35(_38);
		var pp = $("<div></div>").appendTo(_38);
		_3c.push(pp);
		_20(_38, pp, _39);
		_1(_38);
		_3b.onAdd.call(_38, _39.title, _3c.length - 1);
		if (_39.selected)
		{
			_29(_38, _3c.length - 1);
		}
	};
	function _3d(_3e, _3f)
	{
		var _40 = $.data(_3e, "accordion");
		var _41 = _40.options;
		var _42 = _40.panels;
		_35(_3e);
		var _43 = _11(_3e, _3f);
		var _44 = _43.panel("options").title;
		var _45 = _d(_3e, _43);
		if (_41.onBeforeRemove.call(_3e, _44, _45) == false)
		{
			return;
		}
		var _43 = _11(_3e, _3f, true);
		if (_43)
		{
			_43.panel("destroy");
			if (_42.length)
			{
				_1(_3e);
				var _46 = _9(_3e);
				if (!_46)
				{
					_29(_3e, 0);
				}
			}
		}
		_41.onRemove.call(_3e, _44, _45);
	};
	$.fn.accordion = function (_47, _48)
	{
		if (typeof _47 == "string")
		{
			return $.fn.accordion.methods[_47](this, _48);
		}
		_47 = _47 || {};
		return this.each(function ()
		{
			var _49 = $.data(this, "accordion");
			var _4a;
			if (_49)
			{
				_4a = $.extend(_49.options, _47);
				_49.opts = _4a;
			} else
			{
				_4a = $.extend({},
				$.fn.accordion.defaults, $.fn.accordion.parseOptions(this), _47);
				var r = _1a(this);
				$.data(this, "accordion", {
					options: _4a,
					accordion: r.accordion,
					panels: r.panels
				});
			}
			_state(this);
			_1(this);
			_2e(this);
		});
	};
	$.fn.accordion.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "accordion").options;
		},
		panels: function (jq)
		{
			return $.data(jq[0], "accordion").panels;
		},
		resize: function (jq)
		{
			return jq.each(function ()
			{
				_1(this);
			});
		},
		getSelected: function (jq)
		{
			return _9(jq[0]);
		},
		getPanel: function (jq, _4b)
		{
			return _11(jq[0], _4b);
		},
		getPanelIndex: function (jq, _4c)
		{
			return _d(jq[0], _4c);
		},
		select: function (jq, _4d)
		{
			return jq.each(function ()
			{
				_29(this, _4d);
			});
		},
		add: function (jq, _4e)
		{
			return jq.each(function ()
			{
				add(this, _4e);
			});
		},
		remove: function (jq, _4f)
		{
			return jq.each(function ()
			{
				_3d(this, _4f);
			});
		}
	};
	$.fn.accordion.parseOptions = function (_50)
	{
		var t = $(_50);
		return $.extend({},
		$.parser.parseOptions(_50, ["width", "height", {
			fit: "boolean",
			border: "boolean",
			animate: "boolean"
		}]));
	};
	$.fn.accordion.defaults = {
		width: "auto",
		height: "auto",
		fit: false,
		border: true,
		animate: true,
		onSelect: function (_51, _52) { },
		onAdd: function (_53, _54) { },
		onBeforeRemove: function (_55, _56) { },
		onRemove: function (_57, _58) { }
	};
})(jQuery);
/**
 * jQuery EasyUI 1.2.4
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 */
(function($) {
	function _resize(_target) {
		var _opts = $.data(_target, "calendar").options;
		var t = $(_target);
		if (_opts.fit == true) {
			var p = t.parent();
			_opts.width = p.width();
			_opts.height = p.height();
		}
		var _header = t.find(".calendar-header");
		if ($.support.boxModel == true) {
			t.width(_opts.width - (t.outerWidth() - t.width()));
			t.height(_opts.height - (t.outerHeight() - t.height()));
		} else {
			t.width(_opts.width);
			t.height(_opts.height);
		}
		var _body = t.find(".calendar-body");
		var _height = t.height() - _header.outerHeight();
		if ($.support.boxModel == true) {
			_body.height(_height - (_body.outerHeight() - _body.height()));
		} else {
			_body.height(_height);
		}
    if(_opts.dataType=="month")
    {
      _ShowCalMenu(_target);
    }
	};
	function _bindEvent(_target) {
		$(_target).addClass("calendar").wrapInner("<div class=\"calendar-header\">" 
      + "<div class=\"calendar-prevmonth\"></div>" 
      + "<div class=\"calendar-nextmonth\"></div>" 
      + "<div class=\"calendar-prevyear\"></div>" 
      + "<div class=\"calendar-nextyear\"></div>" 
      + "<div class=\"calendar-title\">" 
      + "<span>Aprial 2010</span>" 
      + "</div>" 
      + "</div>" 
      + "<div class=\"calendar-body\">" 
      + "<div class=\"calendar-menu\">" 
      + "<div class=\"calendar-menu-year-inner\">" 
      + "<span class=\"calendar-menu-prev\"></span>" 
      + "<span><input class=\"calendar-menu-year\" type=\"text\"></input></span>" 
      + "<span class=\"calendar-menu-next\"></span>" 
      + "</div>" 
      + "<div class=\"calendar-menu-month-inner\">" 
      + "</div>" 
      + "</div>" 
      + "</div>");
		$(_target).find(".calendar-title span").hover(function() {
			$(this).addClass("calendar-menu-hover");
		},
		function() {
			$(this).removeClass("calendar-menu-hover");
		}).click(function() {
			var _menu = $(_target).find(".calendar-menu");
			if (_menu.is(":visible")) {
				_menu.hide();
			} else {
				_ShowCalMenu(_target);
			}
		});
		$(".calendar-prevmonth,.calendar-nextmonth,.calendar-prevyear,.calendar-nextyear", _target).hover(function() {
			$(this).addClass("calendar-nav-hover");
		},
		function() {
			$(this).removeClass("calendar-nav-hover");
		});
		$(_target).find(".calendar-nextmonth").click(function() {
			_changeMonth(_target, 1);
		});
		$(_target).find(".calendar-prevmonth").click(function() {
			_changeMonth(_target, -1);
		});
		$(_target).find(".calendar-nextyear").click(function() {
			_changeYear(_target, 1);
		});
		$(_target).find(".calendar-prevyear").click(function() {
			_changeYear(_target, -1);
		});
		$(_target).bind("_resize",
		function() {
			var _a = $.data(_target, "calendar").options;
			if (_a.fit == true) {
				_resize(_target);
			}
			return false;
		});
	};
	function _changeMonth(_target, _monthCount) {
		var _opts = $.data(_target, "calendar").options;
		_opts.month += _monthCount;
		if (_opts.month > 12) {
			_opts.year++;
			_opts.month = 1;
		} else {
			if (_opts.month < 1) {
				_opts.year--;
				_opts.month = 12;
			}
		}
		_createCalendar(_target);
		var _10 = $(_target).find(".calendar-menu-month-inner");
		_10.find("td.calendar-selected").removeClass("calendar-selected");
		_10.find("td:eq(" + (_opts.month - 1) + ")").addClass("calendar-selected");
	};
	function _changeYear(_target, _yearCount) {
		var _opts = $.data(_target, "calendar").options;
		_opts.year += _yearCount;
		_createCalendar(_target);
		var _menuYear = $(_target).find(".calendar-menu-year");
		_menuYear.val(_opts.year);
	};
	function _ShowCalMenu(_target) {
		var _opts = $.data(_target, "calendar").options;
		$(_target).find(".calendar-menu").show();
		if ($(_target).find(".calendar-menu-month-inner").is(":empty")) {
			$(_target).find(".calendar-menu-month-inner").empty();
			var t = $("<table></table>").appendTo($(_target).find(".calendar-menu-month-inner"));
			var idx = 0;
			for (var i = 0; i < 3; i++) {
				var tr = $("<tr></tr>").appendTo(t);
				for (var j = 0; j < 4; j++) {
					$("<td class=\"calendar-menu-month\"></td>").html(_opts.months[idx++]).attr("abbr", idx).appendTo(tr);
				}
			}
			$(_target).find(".calendar-menu-prev,.calendar-menu-next").hover(function() {
				$(this).addClass("calendar-menu-hover");
			},
			function() {
				$(this).removeClass("calendar-menu-hover");
			});
			$(_target).find(".calendar-menu-next").click(function() {
				var y = $(_target).find(".calendar-menu-year");
				if (!isNaN(y.val())) {
					y.val(parseInt(y.val()) + 1);
				}
			});
			$(_target).find(".calendar-menu-prev").click(function() {
				var y = $(_target).find(".calendar-menu-year");
				if (!isNaN(y.val())) {
					y.val(parseInt(y.val() - 1));
				}
			});
			$(_target).find(".calendar-menu-year").keypress(function(e) {
				if (e.keyCode == 13) {
					_selectMenu();
				}
			});
			$(_target).find(".calendar-menu-month").hover(function() {
				$(this).addClass("calendar-menu-hover");
			},
			function() {
				$(this).removeClass("calendar-menu-hover");
			}).click(function() {
				var _1a = $(_target).find(".calendar-menu");
				_1a.find(".calendar-selected").removeClass("calendar-selected");
				$(this).addClass("calendar-selected");
				_selectMenu();
			});
		}
		function _selectMenu() {
			var _menu = $(_target).find(".calendar-menu");
			var _yearVal = _menu.find(".calendar-menu-year").val();
			var _abbr = _menu.find(".calendar-selected").attr("abbr");
			if (!isNaN(_yearVal)) {
				_opts.year = parseInt(_yearVal);
				_opts.month = parseInt(_abbr);
				_createCalendar(_target);
			}
			_menu.hide();
      if(_opts.dataType=="month")
      {
        _opts.current = new Date(_opts.year, _opts.month - 1, 1);
        _opts.onSelect.call(_target, _opts.current);
      }
		};
		var _body = $(_target).find(".calendar-body");
		var _menu = $(_target).find(".calendar-menu");
		var _menuYearInner = _menu.find(".calendar-menu-year-inner");
		var _menuMonthInner = _menu.find(".calendar-menu-month-inner");
		_menuYearInner.find("input").val(_opts.year).focus();
		_menuMonthInner.find("td.calendar-selected").removeClass("calendar-selected");
		_menuMonthInner.find("td:eq(" + (_opts.month - 1) + ")").addClass("calendar-selected");
		if ($.support.boxModel == true) {
			_menu.width(_body.outerWidth() - (_menu.outerWidth() - _menu.width()));
			_menu.height(_body.outerHeight() - (_menu.outerHeight() - _menu.height()));
			_menuMonthInner.height(_menu.height() - (_menuMonthInner.outerHeight() - _menuMonthInner.height()) - _menuYearInner.outerHeight());
		} else {
			_menu.width(_body.outerWidth());
			_menu.height(_body.outerHeight());
			_menuMonthInner.height(_menu.height() - _menuYearInner.outerHeight());
		}
	};
	function _createWeekDate(_year, _month) {
		var _dateList = [];
		var _lastDay = new Date(_year, _month, 0).getDate();
		for (var i = 1; i <= _lastDay; i++) {
			_dateList.push([_year, _month, i]);
		}
		var _weekDateList = [], _weekDate = [];
		while (_dateList.length > 0) {
			var _date = _dateList.shift();
			_weekDate.push(_date);
			if (new Date(_date[0], _date[1] - 1, _date[2]).getDay() == 6) {
				_weekDateList.push(_weekDate);
				_weekDate = [];
			}
		}
		if (_weekDate.length) {
			_weekDateList.push(_weekDate);
		}
		var _firstWeekDate = _weekDateList[0];
		if (_firstWeekDate.length < 7) {
			while (_firstWeekDate.length < 7) {
				var _firstWeekDate_Date = _firstWeekDate[0];
				var _date = new Date(_firstWeekDate_Date[0], _firstWeekDate_Date[1] - 1, _firstWeekDate_Date[2] - 1);
				_firstWeekDate.unshift([_date.getFullYear(), _date.getMonth() + 1, _date.getDate()]);
			}
		} else {
			var _firstWeekDate_Date = _firstWeekDate[0];
			var _weekDate = [];
			for (var i = 1; i <= 7; i++) {
				var _date = new Date(_firstWeekDate_Date[0], _firstWeekDate_Date[1] - 1, _firstWeekDate_Date[2] - i);
				_weekDate.unshift([_date.getFullYear(), _date.getMonth() + 1, _date.getDate()]);
			}
			_weekDateList.unshift(_weekDate);
		}
		var _lastWeekDate = _weekDateList[_weekDateList.length - 1];
		while (_lastWeekDate.length < 7) {
			var _lastWeekDate_Date = _lastWeekDate[_lastWeekDate.length - 1];
			var _date = new Date(_lastWeekDate_Date[0], _lastWeekDate_Date[1] - 1, _lastWeekDate_Date[2] + 1);
			_lastWeekDate.push([_date.getFullYear(), _date.getMonth() + 1, _date.getDate()]);
		}
		if (_weekDateList.length < 6) {
			var _lastWeekDate_Date = _lastWeekDate[_lastWeekDate.length - 1];
			var _weekDate = [];
			for (var i = 1; i <= 7; i++) {
				var _date = new Date(_lastWeekDate_Date[0], _lastWeekDate_Date[1] - 1, _lastWeekDate_Date[2] + i);
				_weekDate.push([_date.getFullYear(), _date.getMonth() + 1, _date.getDate()]);
			}
			_weekDateList.push(_weekDate);
		}
		return _weekDateList;
	};
	function _createCalendar(_target) {
		var _opts = $.data(_target, "calendar").options;
		$(_target).find(".calendar-title span").html(_opts.months[_opts.month - 1] + " " + _opts.year);
		var _body = $(_target).find("div.calendar-body");
		_body.find(">table").remove();
		var t = $("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><thead></thead><tbody></tbody></table>").prependTo(_body);
    if(_opts.dataType=="month")
    {
      t.hide();
    }
		var tr = $("<tr></tr>").appendTo(t.find("thead"));
		for (var i = 0; i < _opts.weeks.length; i++) {
			tr.append("<th>" + _opts.weeks[i] + "</th>");
		}
		var _weekDateList = _createWeekDate(_opts.year, _opts.month);
		for (var i = 0; i < _weekDateList.length; i++) {
			var _createWeek = _weekDateList[i];
			var tr = $("<tr></tr>").appendTo(t.find("tbody"));
			for (var j = 0; j < _createWeek.length; j++) {
				var day = _createWeek[j];
				$("<td class=\"calendar-day calendar-other-month\"></td>").attr("abbr", day[0] + "," + day[1] + "," + day[2]).html(day[2]).appendTo(tr);
			}
		}
		t.find("td[abbr^=\"" + _opts.year + "," + _opts.month + "\"]").removeClass("calendar-other-month");
		var now = new Date();
		var _nowAbbr = now.getFullYear() + "," + (now.getMonth() + 1) + "," + now.getDate();
		t.find("td[abbr=\"" + _nowAbbr + "\"]").addClass("calendar-today");
		if (_opts.current) {
			t.find(".calendar-selected").removeClass("calendar-selected");
			var _abbr = _opts.current.getFullYear() + "," + (_opts.current.getMonth() + 1) + "," + _opts.current.getDate();
			t.find("td[abbr=\"" + _abbr + "\"]").addClass("calendar-selected");
		}
		t.find("tr").find("td:first").addClass("calendar-sunday");
		t.find("tr").find("td:last").addClass("calendar-saturday");
		t.find("td").hover(function() {
			$(this).addClass("calendar-hover");
		},
		function() {
			$(this).removeClass("calendar-hover");
		}).unbind(".calendar")
    .bind("click.clendar", function() 
    {
			t.find(".calendar-selected").removeClass("calendar-selected");
			$(this).addClass("calendar-selected");
			var _abbrArray = $(this).attr("abbr").split(",");
			_opts.current = new Date(_abbrArray[0], parseInt(_abbrArray[1]) - 1, _abbrArray[2]);
			_opts.onSelect.call(_target, _opts.current);
		});
	};
	$.fn.calendar = function(_options, _param) {
		if (typeof _options == "string") {
			return $.fn.calendar.methods[_options](this, _param);
		}
		_options = _options || {};
		return this.each(function() {
			var _state = $.data(this, "calendar");
			if (_state) {
				$.extend(_state.options, _options);
			} else {
				_state = $.data(this, "calendar", {
					options: $.extend({},
					$.fn.calendar.defaults, $.fn.calendar.parseOptions(this), _options)
				});
				_bindEvent(this);
			}
			if (_state.options.border == false) {
				$(this).addClass("calendar-noborder");
			}
			_resize(this);
			_createCalendar(this);
			$(this).find("div.calendar-menu").hide();
		});
	};
	$.fn.calendar.methods = {
		options: function(jq) {
			return $.data(jq[0], "calendar").options;
		},
		resize: function(jq) {
			return jq.each(function() {
				_resize(this);
			});
		},
		moveTo: function(jq, _date) {
			return jq.each(function() {
				$(this).calendar({
					year: _date.getFullYear(),
					month: _date.getMonth() + 1,
					current: _date
				});
			});
		}
	};
	$.fn.calendar.parseOptions = function(_3a) {
		var t = $(_3a);
		return {
			width: (parseInt(_3a.style.width) || undefined),
			height: (parseInt(_3a.style.height) || undefined),
			fit: (t.attr("fit") ? t.attr("fit") == "true": undefined),
			border: (t.attr("border") ? t.attr("border") == "true": undefined)
		};
	};
	$.fn.calendar.defaults = {
		width: 180,
		height: 180,
		fit: false,
		border: true,
    dataType: 'date', //数据类型：date,month
		weeks: ["S", "M", "T", "W", "T", "F", "S"],
		months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1,
		current: new Date(),
		onSelect: function(_3b) {}
	};
})(jQuery);
(function ($)
{
	function _1(_2)
	{
		$(_2).hide();
		var _3 = $("<span class=\"searchbox\"></span>").insertAfter(_2);
		var _4 = $("<input type=\"text\" class=\"searchbox-text\">").appendTo(_3);
		$("<span><span class=\"searchbox-button\"></span></span>").appendTo(_3);
		var _5 = $(_2).attr("name");
		if (_5)
		{
			_4.attr("name", _5);
			$(_2).removeAttr("name").attr("searchboxName", _5);
		}
		return _3;
	};
	function _6(_7, _8)
	{
		var _9 = $.data(_7, "searchbox").options;
		var sb = $.data(_7, "searchbox").searchbox;
		if (_8)
		{
			_9.width = _8;
		}
		sb.appendTo("body");
		if (isNaN(_9.width))
		{
			_9.width = sb._outerWidth();
		}
		var _a = sb.find("span.searchbox-button");
		var _b = sb.find("a.searchbox-menu");
		var _c = sb.find("input.searchbox-text");
		sb._outerWidth(_9.width)._outerHeight(_9.height);
		_c._outerWidth(sb.width() - _b._outerWidth() - _a._outerWidth());
		_c.css({
			height: sb.height() + "px",
			lineHeight: sb.height() + "px"
		});
		_b._outerHeight(sb.height());
		_a._outerHeight(sb.height());
		var _d = _b.find("span.l-btn-left");
		_d._outerHeight(sb.height());
		_d.find("span.l-btn-text,span.m-btn-downarrow").css({
			height: _d.height() + "px",
			lineHeight: _d.height() + "px"
		});
		sb.insertAfter(_7);
	};
	function _e(_f)
	{
		var _10 = $.data(_f, "searchbox");
		var _11 = _10.options;
		if (_11.menu)
		{
			_10.menu = $(_11.menu).menu({
				onClick: function (_12)
				{
					_13(_12);
				}
			});
			var _14 = _10.menu.children("div.menu-item:first");
			_10.menu.children("div.menu-item").each(function ()
			{
				var _15 = $.extend({},
				$.parser.parseOptions(this), {
					selected: ($(this).attr("selected") ? true : undefined)
				});
				if (_15.selected)
				{
					_14 = $(this);
					return false;
				}
			});
			_14.triggerHandler("click");
		} else
		{
			_10.searchbox.find("a.searchbox-menu").remove();
			_10.menu = null;
		}
		function _13(_16)
		{
			_10.searchbox.find("a.searchbox-menu").remove();
			var mb = $("<a class=\"searchbox-menu\" href=\"javascript:void(0)\"></a>").html(_16.text);
			mb.prependTo(_10.searchbox).menubutton({
				menu: _10.menu,
				iconCls: _16.iconCls
			});
			_10.searchbox.find("input.searchbox-text").attr("name", $(_16.target).attr("name") || _16.text);
			_6(_f);
		};
	};
	function _state(_proxy)
	{
		var _opts = $.data(_proxy, "searchbox");
		var _1a = _opts.options;
		var _1b = _opts.searchbox.find("input.searchbox-text");
		var _1c = _opts.searchbox.find(".searchbox-button");
		_1b.unbind(".searchbox").bind("blur.searchbox",
		function (e)
		{
			_1a.value = $(this).val();
			if (_1a.value == "")
			{
				$(this).val(_1a.prompt);
				$(this).addClass("searchbox-prompt");
			} else
			{
				$(this).removeClass("searchbox-prompt");
			}
		}).bind("focus.searchbox",
		function (e)
		{
			if ($(this).val() != _1a.value)
			{
				$(this).val(_1a.value);
			}
			$(this).removeClass("searchbox-prompt");
		}).bind("keydown.searchbox",
		function (e)
		{
			if (e.keyCode == 13)
			{
				e.preventDefault();
				var _1d = $.fn.prop ? _1b.prop("name") : _1b.attr("name");
				_1a.value = $(this).val();
				_1a.searcher.call(_proxy, _1a.value, _1d);
				return false;
			}
		});
		_1c.unbind(".searchbox").bind("click.searchbox",
		function ()
		{
			var _1e = $.fn.prop ? _1b.prop("name") : _1b.attr("name");
			_1a.searcher.call(_proxy, _1a.value, _1e);
		}).bind("mouseenter.searchbox",
		function ()
		{
			$(this).addClass("searchbox-button-hover");
		}).bind("mouseleave.searchbox",
		function ()
		{
			$(this).removeClass("searchbox-button-hover");
		});
	};
	function _1f(_20)
	{
		var _target = $.data(_20, "searchbox");
		var _index = _target.options;
		var _opts = _target.searchbox.find("input.searchbox-text");
		if (_index.value == "")
		{
			_opts.val(_index.prompt);
			_opts.addClass("searchbox-prompt");
		} else
		{
			_opts.val(_index.value);
			_opts.removeClass("searchbox-prompt");
		}
	};
	$.fn.searchbox = function (_24, _25)
	{
		if (typeof _24 == "string")
		{
			return $.fn.searchbox.methods[_24](this, _25);
		}
		_24 = _24 || {};
		return this.each(function ()
		{
			var _26 = $.data(this, "searchbox");
			if (_26)
			{
				$.extend(_26.options, _24);
			} else
			{
				_26 = $.data(this, "searchbox", {
					options: $.extend({},
					$.fn.searchbox.defaults, $.fn.searchbox.parseOptions(this), _24),
					searchbox: _1(this)
				});
			}
			_e(this);
			_1f(this);
			_state(this);
			_6(this);
		});
	};
	$.fn.searchbox.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "searchbox").options;
		},
		menu: function (jq)
		{
			return $.data(jq[0], "searchbox").menu;
		},
		textbox: function (jq)
		{
			return $.data(jq[0], "searchbox").searchbox.find("input.searchbox-text");
		},
		getValue: function (jq)
		{
			return $.data(jq[0], "searchbox").options.value;
		},
		setValue: function (jq, _27)
		{
			return jq.each(function ()
			{
				$(this).searchbox("options").value = _27;
				$(this).searchbox("textbox").val(_27);
				$(this).searchbox("textbox").blur();
			});
		},
		getName: function (jq)
		{
			return $.data(jq[0], "searchbox").searchbox.find("input.searchbox-text").attr("name");
		},
		selectName: function (jq, _28)
		{
			return jq.each(function ()
			{
				var _29 = $.data(this, "searchbox").menu;
				if (_29)
				{
					_29.children("div.menu-item[name=\"" + _28 + "\"]").triggerHandler("click");
				}
			});
		},
		destroy: function (jq)
		{
			return jq.each(function ()
			{
				var _2a = $(this).searchbox("menu");
				if (_2a)
				{
					_2a.menu("destroy");
				}
				$.data(this, "searchbox").searchbox.remove();
				$(this).remove();
			});
		},
		resize: function (jq, _2b)
		{
			return jq.each(function ()
			{
				_6(this, _2b);
			});
		}
	};
	$.fn.searchbox.parseOptions = function (_2c)
	{
		var t = $(_2c);
		return $.extend({},
		$.parser.parseOptions(_2c, ["width", "height", "prompt", "menu"]), {
			value: t.val(),
			searcher: (t.attr("searcher") ? eval(t.attr("searcher")) : undefined)
		});
	};
	$.fn.searchbox.defaults = {
		width: "auto",
		height: 22,
		prompt: "",
		value: "",
		menu: null,
		searcher: function (_2d, _2e) { }
	};
})(jQuery);

(function ($)
{
	function _1(_2)
	{
		$(_2).addClass("numberspinner-f");
		var _3 = $.data(_2, "numberspinner").options;
		$(_2).spinner(_3).numberbox(_3);
	};
	function _4(_5, _6)
	{
		var _7 = $.data(_5, "numberspinner").options;
		var v = parseFloat($(_5).numberbox("getValue") || _7.value) || 0;
		if (_6 == true)
		{
			v -= _7.increment;
		} else
		{
			v += _7.increment;
		}
		$(_5).numberbox("setValue", v);
	};
	$.fn.numberspinner = function (_8, _9)
	{
		if (typeof _8 == "string")
		{
			var _a = $.fn.numberspinner.methods[_8];
			if (_a)
			{
				return _a(this, _9);
			} else
			{
				return this.spinner(_8, _9);
			}
		}
		_8 = _8 || {};
		return this.each(function ()
		{
			var _b = $.data(this, "numberspinner");
			if (_b)
			{
				$.extend(_b.options, _8);
			} else
			{
				$.data(this, "numberspinner", {
					options: $.extend({},
					$.fn.numberspinner.defaults, $.fn.numberspinner.parseOptions(this), _8)
				});
			}
			_1(this);
		});
	};
	$.fn.numberspinner.methods = {
		options: function (jq)
		{
			var _c = $.data(jq[0], "numberspinner").options;
			return $.extend(_c, {
				value: jq.numberbox("getValue"),
				originalValue: jq.numberbox("options").originalValue
			});
		},
		setValue: function (jq, _d)
		{
			return jq.each(function ()
			{
				$(this).numberbox("setValue", _d);
			});
		},
		getValue: function (jq)
		{
			return jq.numberbox("getValue");
		},
		clear: function (jq)
		{
			return jq.each(function ()
			{
				$(this).spinner("clear");
				$(this).numberbox("clear");
			});
		},
		reset: function (jq)
		{
			return jq.each(function ()
			{
				var _e = $(this).numberspinner("options");
				$(this).numberspinner("setValue", _e.originalValue);
			});
		}
	};
	$.fn.numberspinner.parseOptions = function (_f)
	{
		return $.extend({},
		$.fn.spinner.parseOptions(_f), $.fn.numberbox.parseOptions(_f), {});
	};
	$.fn.numberspinner.defaults = $.extend({},
	$.fn.spinner.defaults, $.fn.numberbox.defaults, {
		spin: function (_10)
		{
			_4(this, _10);
		}
	});
})(jQuery);
(function ($)
{
	function _1(_2)
	{
		var _3 = $.data(_2, "timespinner").options;
		$(_2).addClass("timespinner-f");
		$(_2).spinner(_3);
		$(_2).unbind(".timespinner");
		$(_2).bind("click.timespinner",
		function ()
		{
			var _4 = 0;
			if (this.selectionStart != null)
			{
				_4 = this.selectionStart;
			} else
			{
				if (this.createTextRange)
				{
					var _5 = _2.createTextRange();
					var s = document.selection.createRange();
					s.setEndPoint("StartToStart", _5);
					_4 = s.text.length;
				}
			}
			if (_4 >= 0 && _4 <= 2)
			{
				_3.highlight = 0;
			} else
			{
				if (_4 >= 3 && _4 <= 5)
				{
					_3.highlight = 1;
				} else
				{
					if (_4 >= 6 && _4 <= 8)
					{
						_3.highlight = 2;
					}
				}
			}
			_7(_2);
		}).bind("blur.timespinner",
		function ()
		{
			_6(_2);
		});
	};
	function _7(_8)
	{
		var _9 = $.data(_8, "timespinner").options;
		var _a = 0,
		_b = 0;
		if (_9.highlight == 0)
		{
			_a = 0;
			_b = 2;
		} else
		{
			if (_9.highlight == 1)
			{
				_a = 3;
				_b = 5;
			} else
			{
				if (_9.highlight == 2)
				{
					_a = 6;
					_b = 8;
				}
			}
		}
		if (_8.selectionStart != null)
		{
			_8.setSelectionRange(_a, _b);
		} else
		{
			if (_8.createTextRange)
			{
				var _c = _8.createTextRange();
				_c.collapse();
				_c.moveEnd("character", _b);
				_c.moveStart("character", _a);
				_c.select();
			}
		}
		$(_8).focus();
	};
	function _d(_e, _f)
	{
		var _10 = $.data(_e, "timespinner").options;
		if (!_f)
		{
			return null;
		}
		var vv = _f.split(_10.separator);
		for (var i = 0; i < vv.length; i++)
		{
			if (isNaN(vv[i]))
			{
				return null;
			}
		}
		while (vv.length < 3)
		{
			vv.push(0);
		}
		return new Date(1900, 0, 0, vv[0], vv[1], vv[2]);
	};
	function _6(_11)
	{
		var _12 = $.data(_11, "timespinner").options;
		var _13 = $(_11).val();
		var _14 = _d(_11, _13);
		if (!_14)
		{
			_12.value = "";
			$(_11).val("");
			return;
		}
		var _15 = _d(_11, _12.min);
		var _16 = _d(_11, _12.max);
		if (_15 && _15 > _14)
		{
			_14 = _15;
		}
		if (_16 && _16 < _14)
		{
			_14 = _16;
		}
		var tt = [_state(_14.getHours()), _state(_14.getMinutes())];
		if (_12.showSeconds)
		{
			tt.push(_state(_14.getSeconds()));
		}
		var val = tt.join(_12.separator);
		_12.value = val;
		$(_11).val(val);
		function _state(_proxy)
		{
			return (_proxy < 10 ? "0" : "") + _proxy;
		};
	};
	function _opts(_1a, _1b)
	{
		var _1c = $.data(_1a, "timespinner").options;
		var val = $(_1a).val();
		if (val == "")
		{
			val = [0, 0, 0].join(_1c.separator);
		}
		var vv = val.split(_1c.separator);
		for (var i = 0; i < vv.length; i++)
		{
			vv[i] = parseInt(vv[i], 10);
		}
		if (_1b == true)
		{
			vv[_1c.highlight] -= _1c.increment;
		} else
		{
			vv[_1c.highlight] += _1c.increment;
		}
		$(_1a).val(vv.join(_1c.separator));
		_6(_1a);
		_7(_1a);
	};
	$.fn.timespinner = function (_1d, _1e)
	{
		if (typeof _1d == "string")
		{
			var _1f = $.fn.timespinner.methods[_1d];
			if (_1f)
			{
				return _1f(this, _1e);
			} else
			{
				return this.spinner(_1d, _1e);
			}
		}
		_1d = _1d || {};
		return this.each(function ()
		{
			var _20 = $.data(this, "timespinner");
			if (_20)
			{
				$.extend(_20.options, _1d);
			} else
			{
				$.data(this, "timespinner", {
					options: $.extend({},
					$.fn.timespinner.defaults, $.fn.timespinner.parseOptions(this), _1d)
				});
				_1(this);
			}
		});
	};
	$.fn.timespinner.methods = {
		options: function (jq)
		{
			var _target = $.data(jq[0], "timespinner").options;
			return $.extend(_target, {
				value: jq.val(),
				originalValue: jq.spinner("options").originalValue
			});
		},
		setValue: function (jq, _index)
		{
			return jq.each(function ()
			{
				$(this).val(_index);
				_6(this);
			});
		},
		getHours: function (jq)
		{
			var _opts = $.data(jq[0], "timespinner").options;
			var vv = jq.val().split(_opts.separator);
			return parseInt(vv[0], 10);
		},
		getMinutes: function (jq)
		{
			var _24 = $.data(jq[0], "timespinner").options;
			var vv = jq.val().split(_24.separator);
			return parseInt(vv[1], 10);
		},
		getSeconds: function (jq)
		{
			var _25 = $.data(jq[0], "timespinner").options;
			var vv = jq.val().split(_25.separator);
			return parseInt(vv[2], 10) || 0;
		}
	};
	$.fn.timespinner.parseOptions = function (_26)
	{
		return $.extend({},
		$.fn.spinner.parseOptions(_26), $.parser.parseOptions(_26, ["separator", {
			showSeconds: "boolean",
			highlight: "number"
		}]));
	};
	$.fn.timespinner.defaults = $.extend({},
	$.fn.spinner.defaults, {
		separator: ":",
		showSeconds: false,
		highlight: 0,
		spin: function (_27)
		{
			_opts(this, _27);
		}
	});
})(jQuery);
/**
 * jQuery.datetimebox
 */
(function($) {
	function _createBox(_target) {
		var _state = $.data(_target, "datetimebox");
		var _opts = _state.options;
		$(_target).datebox($.extend({},
		_opts, {
			onShowPanel: function() {
				var _currentValue = $(_target).datetimebox("getValue");
				_setValue(_target, _currentValue, true);
				_opts.onShowPanel.call(_target);
			}
		}));
		$(_target).removeClass("datebox-f").addClass("datetimebox-f");
		$(_target).datebox("calendar").calendar({
			onSelect: function(_date) {
				_enter(_target);
			}
		});
		var _panel = $(_target).datebox("panel");
		if (!_state.spinner) {
			var p = $("<div style=\"padding:2px\"><input style=\"width:80px\"></div>").insertAfter(_panel.children("div.datebox-calendar-inner"));
			_state.spinner = p.children("input");
			_state.spinner.timespinner({
				showSeconds: true
			}).bind("mousedown",
			function(e) {
				e.stopPropagation();
			});
			_setValue(_target, _opts.value);
			var _dateboxButton = _panel.children("div.datebox-button");
			var ok = $("<a href=\"javascript:void(0)\" class=\"datebox-ok\"></a>").html(_opts.okText).appendTo(_dateboxButton);
			ok.hover(function() {
				$(this).addClass("datebox-button-hover");
			},
			function() {
				$(this).removeClass("datebox-button-hover");
			}).click(function() {
				_enter(_target);
			});
		}
	};
	function _getDateObject(_b) {
		var c = $(_b).datetimebox("calendar");
		var t = $(_b).datetimebox("spinner");
		var _c = c.calendar("options").current;
		return new Date(_c.getFullYear(), _c.getMonth(), _c.getDate(), t.timespinner("getHours"), t.timespinner("getMinutes"), t.timespinner("getSeconds"));
	};
	function _query(_target, q) {
		_setValue(_target, q, true);
	};
	function _enter(_target) {
		var _opts = $.data(_target, "datetimebox").options;
		var _datetime = _getDateObject(_target);
		_setValue(_target, _opts.formatter(_datetime));
    _opts.onSelect.call(_target, _datetime);
		$(_target).combo("hidePanel");
	};
	function _setValue(_target, _value, _isText) {
		var _opts = $.data(_target, "datetimebox").options;
		$(_target).combo("setValue", _value);
		if (!_isText) {
			if (_value) {
				var _datetime = _opts.parser(_value);
				$(_target).combo("setValue", _opts.formatter(_datetime));
				$(_target).combo("setText", _opts.formatter(_datetime));
			} else {
				$(_target).combo("setText", _value);
			}
		}
		var _datetime = _opts.parser(_value);
		$(_target).datetimebox("calendar").calendar("moveTo", _opts.parser(_value));
		$(_target).datetimebox("spinner").timespinner("setValue", _proxy(_datetime));
		function _proxy(_opts) {
			function _1a(_1b) {
				return (_1b < 10 ? "0": "") + _1b;
			};
			var tt = [_1a(_opts.getHours()), _1a(_opts.getMinutes())];
			if (_opts.showSeconds) {
				tt.push(_1a(_opts.getSeconds()));
			}
			return tt.join($(_target).datetimebox("spinner").timespinner("options").separator);
		};
	};
	$.fn.datetimebox = function(_options, _param) {
		if (typeof _options == "string") {
			var _method = $.fn.datetimebox.methods[_options];
			if (_method) {
				return _method(this, _param);
			} else {
				return this.datebox(_options, _param);
			}
		}
		_options = _options || {};
		var jme=this;
		return this.each(function() {
			this.jme=jme;
			var _1f = $.data(this, "datetimebox");
			if (_1f) {
				$.extend(_1f.options, _options);
			} else {
				$.data(this, "datetimebox", {
					options: $.extend({},
					$.fn.datetimebox.defaults, $.fn.datetimebox.parseOptions(this), _options)
				});
			}
			_createBox(this);
		});
	};
	$.fn.datetimebox.methods = {
		options: function(jq) {
			return $.data(jq[0], "datetimebox").options;
		},
		spinner: function(jq) {
			return $.data(jq[0], "datetimebox").spinner;
		},
		setValue: function(jq, _value) {
			return jq.each(function() {
				_setValue(this, _value);
			});
		}
	};
	$.fn.datetimebox.parseOptions = function(_target1) {
		var t = $(_target1);
		return $.extend({},
		$.fn.datebox.parseOptions(_target1), {});
	};
	$.fn.datetimebox.defaults = $.extend({},
	$.fn.datebox.defaults, {
		showSeconds: true,
		keyHandler: {
			up: function() {},
			down: function() {},
			enter: function() {
				_enter(this);
			},
			query: function(q) {
				_query(this, q);
			}
		},
		formatter: function(_target2) {
			var h = _target2.getHours();
			var M = _target2.getMinutes();
			var s = _target2.getSeconds();
			function _target3(_target4) {
				return (_target4 < 10 ? "0": "") + _target4;
			};
			return $.fn.datebox.defaults.formatter(_target2) + " " + _target3(h) + ":" + _target3(M) + ":" + _target3(s);
		},
		parser: function(s) {
      if(s!=null && typeof s =='object')return s;
			if ($.trim(s) == "") {
				return new Date();
			}
			var dt = s.split(" ");
			var d = $.fn.datebox.defaults.parser(dt[0]);
		  var tt = dt[1] ? dt[1].split(":") : ["00", "00", "00"];
			var _target5 = parseInt(tt[0], 10);
			var _target6 = parseInt(tt[1], 10);
			var _target7 = parseInt(tt[2], 10);
			return new Date(d.getFullYear(), d.getMonth(), d.getDate(), _target5, _target6, _target7);
		}
	});
})(jQuery);
/**
 * parser - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */

(function($){
	$.parser = {
		auto: true,
		onComplete: function(context){},
		plugins:['draggable','droppable','resizable','pagination','tooltipRattan',
		         'linkbutton','menu','menubutton','splitbutton','progressbar',
				 'tree','combobox','combotree','combogrid','numberbox','validatebox','searchbox',
				 'numberspinner','timespinner','calendar','datebox','datetimebox','slider',
				 'layout','panel','datagrid','propertygrid','treegrid','tabs','accordion','window','dialog'
		],
		parse: function(context){
			var aa = [];
			for(var i=0; i<$.parser.plugins.length; i++){
				var name = $.parser.plugins[i];
				var r = $('.easyui-' + name, context);
				if (r.length){
					if (r[name]){
						r[name]();
					} else {
						aa.push({name:name,jq:r});
					}
				}
			}
			if (aa.length && window.easyloader){
				var names = [];
				for(var i=0; i<aa.length; i++){
					names.push(aa[i].name);
				}
				easyloader.load(names, function(){
					for(var i=0; i<aa.length; i++){
						var name = aa[i].name;
						var jq = aa[i].jq;
						jq[name]();
					}
					$.parser.onComplete.call($.parser, context);
				});
			} else {
				$.parser.onComplete.call($.parser, context);
			}
		},
		
		/**
		 * parse options, including standard 'data-options' attribute.
		 * 
		 * calling examples:
		 * $.parser.parseOptions(target);
		 * $.parser.parseOptions(target, ['id','title','width',{fit:'boolean',border:'boolean'},{min:'number'}]);
		 */
		parseOptions: function(target, properties){
			var t = $(target);
			var options = {};
			
			var s = $.trim(t.attr('data-options'));
			if (s){
//				var first = s.substring(0,1);
//				var last = s.substring(s.length-1,1);
//				if (first != '{') s = '{' + s;
//				if (last != '}') s = s + '}';
				if (s.substring(0, 1) != '{'){
					s = '{' + s + '}';
				}
				options = (new Function('return ' + s))();
			}
				
			if (properties){
				var opts = {};
				for(var i=0; i<properties.length; i++){
					var pp = properties[i];
					if (typeof pp == 'string'){
						if (pp == 'width' || pp == 'height' || pp == 'left' || pp == 'top'){
              if(target.style[pp] && target.style[pp].indexOf('%')>=0)
              {
                opts[pp] = target.style[pp];
              }
              else
              {
                opts[pp] = parseInt(target.style[pp]) || undefined;
              }
						} else {
							opts[pp] = t.attr(pp);
						}
					} else {
						for(var name in pp){
							var type = pp[name];
							if (type == 'boolean'){
								opts[name] = t.attr(name) ? (t.attr(name) == 'true') : undefined;
							} else if (type == 'number'){
								opts[name] = t.attr(name)=='0' ? 0 : parseFloat(t.attr(name)) || undefined;
							}
						}
					}
				}
				$.extend(options, opts);
			}
			return options;
		}
	};
	$(function(){
		var d = $('<div style="position:absolute;top:-1000px;width:100px;height:100px;padding:5px"></div>').appendTo('body');
		$._boxModel = parseInt(d.width()) == 100;
		d.remove();
		
		if (window.easyloader && !window.easyloader.isdebug && $.parser.auto){
			$.parser.parse();
		}
	});
	
	/**
	 * extend plugin to set box model width
	 */
	$.fn._outerWidth = function(width){
		if (width == undefined){
			if (this[0] == window){
				return this.width() || document.body.clientWidth;
			}
			return this.outerWidth()||0;
		}
		return this.each(function(){
			if ($._boxModel){
				$(this).width(width - ($(this).outerWidth() - $(this).width()));
			} else {
				$(this).width(width);
			}
		});
	};
	
	/**
	 * extend plugin to set box model height
	 */
	$.fn._outerHeight = function(height){
		if (height == undefined){
			if (this[0] == window){
				return this.height() || document.body.clientHeight;
			}
			return this.outerHeight()||0;
		}
		return this.each(function(){
			if ($._boxModel){
				$(this).height(height - ($(this).outerHeight() - $(this).height()));
			} else {
				$(this).height(height);
			}
		});
	};
	
	$.fn._scrollLeft = function(left){
		if (left == undefined){
			return this.scrollLeft();
		} else {
			return this.each(function(){$(this).scrollLeft(left)});
		}
	}
	
	$.fn._propAttr = $.fn.prop || $.fn.attr;
	
	/**
	 * set or unset the fit property of parent container, return the width and height of parent container
	 */
	$.fn._fit = function(fit){
		fit = fit == undefined ? true : fit;
		var t = this[0];
		var p = (t.tagName == 'BODY' ? t : this.parent()[0]);
		var fcount = p.fcount || 0;
		if (fit){
			if (!t.fitted){
				t.fitted = true;
				p.fcount = fcount + 1;
				$(p).addClass('panel-noscroll');
				if (p.tagName == 'BODY'){
					$('html').addClass('panel-fit');
				}
			}
		} else {
			if (t.fitted){
				t.fitted = false;
				p.fcount = fcount - 1;
				if (p.fcount == 0){
					$(p).removeClass('panel-noscroll');
					if (p.tagName == 'BODY'){
						$('html').removeClass('panel-fit');
					}
				}
			}
		}
		return {
			width: $(p).width(),
			height: $(p).height()
		}
	}
	
})(jQuery);

/**
 * support for mobile devices
 */
(function($){
	var longTouchTimer = null;
	var dblTouchTimer = null;
	var isDblClick = false;
	
	function onTouchStart(e){
		if (e.touches.length != 1){return}
		if (!isDblClick){
			isDblClick = true;
			dblClickTimer = setTimeout(function(){
				isDblClick = false;
			}, 500);
		} else {
			clearTimeout(dblClickTimer);
			isDblClick = false;
			fire(e, 'dblclick');
//			e.preventDefault();
		}
		longTouchTimer = setTimeout(function(){
			fire(e, 'contextmenu', 3);
		}, 1000);
		fire(e, 'mousedown');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	function onTouchMove(e){
		if (e.touches.length != 1){return}
		if (longTouchTimer){
			clearTimeout(longTouchTimer);
		}
		fire(e, 'mousemove');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	function onTouchEnd(e){
//		if (e.touches.length > 0){return}
		if (longTouchTimer){
			clearTimeout(longTouchTimer);
		}
		fire(e, 'mouseup');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	
	function fire(e, name, which){
		var event = new $.Event(name);
		event.pageX = e.changedTouches[0].pageX;
		event.pageY = e.changedTouches[0].pageY;
		event.which = which || 1;
		$(e.target).trigger(event);
	}
	
	if (document.addEventListener){
		document.addEventListener("touchstart", onTouchStart, true);
		document.addEventListener("touchmove", onTouchMove, true);
		document.addEventListener("touchend", onTouchEnd, true);
	}
})(jQuery);

/**
 * jQuery EasyUI 1.2.4
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 */
(function($) {
	function _createQuicksearch(_target) {
		var _opts = $.data(_target, "quicksearch").options;
		$(_target).empty();
		$(_target).addClass("l-btn");
		if (_opts.id) {
			$(_target).attr("id", _opts.id);
		} else {
			$.fn.removeProp ? $(_target).removeProp("id") : $(_target).removeAttr("id");
		}
		var _target = $(_target).html('<div class="quickseach-box quickseach-label">' + _opts.label + '</div><div class="quickseach-box"><input style="width: 112px" id="' + _opts.id + '_keyword" class="quickseach-texteditor"/></div><div class="quickseach-box"><button id="' + _opts.id + '_button"	class="quickseach-button">' + _opts.buttontext + '</button></div>');
		$('#' + _opts.id + '_keyword').bind("keyup.quicksearch", {
			options: _opts
		},
		function(e) {
			if (e.keyCode == 13) {
				_opts.handler(e);
			}
		});
		$('#' + _opts.id + '_button').bind("click.quicksearch", {
			options: _opts
		},
		_opts.handler);
		$(_target).hover(function() {
			$(this).addClass("quickseach-hover")
		},
		function() {
			$(this).removeClass("quickseach-hover")
		});
	};
	$.fn.quicksearch = function(_options, _param) {
		if (typeof _options == "string") {
			return $.fn.quicksearch.methods[_options](this, _param);
		}
		_options = _options || {};
		return this.each(function() {
			var _b = $.data(this, "quicksearch");
			if (_b) {
				$.extend(_b.options, _options);
			} else {
				$.data(this, "quicksearch", {
					options: $.extend({},
					$.fn.quicksearch.defaults, $.fn.quicksearch.parseOptions(this), _options)
				});
				$(this).removeAttr("disabled");
			}
			_createQuicksearch(this);
		});
	};
	$.fn.quicksearch.methods = {
		options: function(jq) {
			return $.data(jq[0], "quicksearch").options;
		},
		getValue: function(jq) {
			var _value = '';
			var _opts = $.data(jq[0], "quicksearch").options;
			_value = $('' + _opts.id + '_keyword').val();
			return _value;
		}
	};
	$.fn.quicksearch.parseOptions = function(_target) {
		var t = $(_target);
		return {
			id: t.attr("id"),
			disabled: (t.attr("disabled") ? true: undefined),
			plain: (t.attr("plain") ? t.attr("plain") == "true": undefined),
			label: (t.attr("label") ? true: undefined),
			buttontext: (t.attr("buttontext") ? true: undefined)
		};
	};
	$.fn.quicksearch.defaults = {
		id: null,
		gridID: null,
		buttontype: 'quicksearch',
		disabled: false,
		label: "",
		buttontext: "",
		handler: function(e) {
			var where = '';
			var searchOpts = e.data.options;
			var opts = $("#" + searchOpts.gridID).datagrid("options");
			var keys = opts.QueryKeys ? opts.QueryKeys.split(',') : '';
			var keyValue = $('#'+searchOpts.id+'_keyword').val();
			if (!keyValue) {
				where = '1=1';
			} else {
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					if (key) {
						if (where) where += ' or ';
						where += key + ' Like \'%' + keyValue + '%\'';
					}
				}
			}
			if (where) {
				$("#" + searchOpts.gridID).datagrid("load", {
					where: where
				});
			}
		}
	};
})(jQuery);
/**
* Extend To supersearch.js
* autor: xietianbao
* date: 2011-08-25
*/
(function ($)
{
  function _createGrid(_target)
  {
    var _opts = $.data(_target, "supersearch").options;
    var _searchColumnList = _opts.searchColumnList;

    var html = '', htmlscope = '';
    var tr = '';
    var index = 0;
    $.each(_searchColumnList, function (i, row)
    {
      if (row.IsSearchColumn == 2) return true;

      switch (row.DataType)
      {
        case "Byte":
        case "Decimal":
        case "Double":
        case "Int16":
        case "Int32":
        case "Int64":
        case "Single":
        case "Date":
        case "DateTime":
          if (!row.DropDown_Id)
          {
            if (row.SearchType == 2)//精确查询
            {
              tr += '<td class="caption">' + row.ColumnComment + '</td><td class="inpbox"><input type="text" fieldname="' + row.ColumnName + '" id="s_' + row.ColumnName + '" />';
              break;
            }
            else
            {
              htmlscope += '<tr><td class="caption">' + row.ColumnComment + '</td><td class="inpbox" colspan="3"><input type="text" fieldname="' + row.ColumnName + '" id="s_' + row.ColumnName + '_From" />';
              htmlscope += '&nbsp;&nbsp;～&nbsp;&nbsp;<input type="text" fieldname="' + row.ColumnName + '" id="s_' + row.ColumnName + '_To" /></td></tr>';
              return true;
            }
          }
        default:
          tr += '<td class="caption">' + row.ColumnComment + '</td><td class="inpbox"><input type="text" fieldname="' + row.ColumnName + '" id="s_' + row.ColumnName + '" />';
          break;
      }
      index++;
      if (index % 2 == 0)
      {
        index = 0;
        html += '<tr>' + tr + '</tr>';
        tr = '';
      }
    });
    if (index % 2 == 1)
    {
      tr = tr.replace(/class="inpbox"/gi, 'class="inpbox" colspan="3"');
      html += '<tr>' + tr + '</tr>';
    }
    html += htmlscope;
    html = '<table id="searchBox" cellspacing=0 border=1 class="searchtable">' + html + '</table>';
    $(".content", _target).html(html);

    //绑定字段下拉框，约定格式
    $.each(_searchColumnList, function (i, row)
    {
      if (row.IsSearchColumn == 2) return true;

      if (row.DropDown_Id > 0)
      {
        var _inp = $("#s_" + row.ColumnName, _target)[0];
        var comboboxOpts = window['combobox' + row.DropDown_Id];
        var combogridOpts = window['combogrid' + row.DropDown_Id];
        if (comboboxOpts) //普通下拉框
        {
          var com = $.extend({}, comboboxOpts);
          com.required = false;
          com.relationer = {	//下拉框关联数据行
            dataRow: _opts.resultData,
            fieldName: row.ColumnName,  //下拉框关联字段
            fieldRelation: com.fieldRelation,
            setValue: function (fieldName, value)
            {
              _changeSearchValue(_target, fieldName, value);
              $("#s_" + fieldName).val(value);
            },
            getDataType: function (fieldName)
            {
              var _searchColInfo = _getSearchColumnInfo(_target, fieldName);
              return _searchColInfo ? _searchColInfo.DataType : null;
            }
          }
          com.multiple = true;
          com.checkbox = true;
          //com.onChange = function (newValue, oldValue)
          //{
          //  _changeSearchValue(_target, row.ColumnName, _inp.value);
          //}
          $("#s_" + row.ColumnName).combobox(com).css("border", "0px solid #a1c3ed");
        }
        else if (combogridOpts) //表格下拉框
        {
          var com = $.extend({}, combogridOpts);
          com.required = false;
          com.relationer = {	//下拉框关联数据行
            dataRow: _opts.resultData,
            fieldName: row.ColumnName,  //下拉框关联字段
            fieldRelation: com.fieldRelation,
            setValue: function (fieldName, value)
            {
              _opts.resultData[fieldName] = value;
              $("#s_" + fieldName).val(value);
              _changeSearchValue(_target, row.ColumnName, value);
            },
            getDataType: function (fieldName)
            {
              var _searchColInfo = _getSearchColumnInfo(_target, fieldName);
              return _searchColInfo ? _searchColInfo.DataType : null;
            }
          }
          $("#s_" + row.ColumnName).combogrid(com).css("border", "0px solid #a1c3ed");
        }
      }
      else
      {
        switch (row.DataType)
        {
          case "Byte":
          case "Decimal":
          case "Double":
          case "Int16":
          case "Int32":
          case "Int64":
          case "Single":
            if (row.SearchType == 2)//精确查询
            {
              $("#s_" + row.ColumnName, _target).numberbox();
            }
            else
            {
              $("#s_" + row.ColumnName + "_From", _target).numberbox();
              $("#s_" + row.ColumnName + "_To", _target).numberbox();
            }
            break;
          case "Date":
          case "DateTime":
            if (row.SearchType == 2)//精确查询
            {
              $("#s_" + row.ColumnName).datebox(
							{
							  onChange: function (newValue, oldValue)
							  {
							    var _inp = $("#s_" + row.ColumnName, _target);
							    _changeSearchValue(_target, row.ColumnName, _inp.val());
							  }
							}).css({ border: "0px solid #a1c3ed" });
            }
            else
            {
              $("#s_" + row.ColumnName + "_From", _target).datebox(
							{
                fixedWidth:true,
							  onChange: function (newValue, oldValue)
							  {
							    _changeSearchValue(_target, row.ColumnName + "_From", newValue);
							  }
							}).css({ border: "0px solid #a1c3ed" });
              $("#s_" + row.ColumnName + "_To", _target).datebox(
							{
                fixedWidth:true,
							  onChange: function (newValue, oldValue)
							  {
							    _changeSearchValue(_target, row.ColumnName + "_To", newValue);
							  }
							}).css({ border: "0px solid #a1c3ed" });
            }
            break;
        }
      }
    });
  };

  function _bindEvent(_target)
  {
    var _data = $.data(_target, "supersearch");
    var _opts = _data.options;
    var _gridHandler = _opts.gridHandler; //关联表格

    //输入框事件
    $(".content input", _target).bind("focus", function ()
    {
      if ($(this).hasClass("combo-text"))
      {
        $(this).parent().addClass("inp-focus");
        $(this).select();
      }
      else
      {
        $(this).addClass("inp-focus").select();
      }
    }).bind("blur", function ()
    {
      if ($(this).hasClass("combo-text"))
      {
        $(this).parent().removeClass("inp-focus");
      }
      else
      {
        $(this).removeClass("inp-focus");
      }
    }).keydown(function (e)
    {
      if (e.keyCode == 13) window.event.keyCode = 9;
    }).keyup(function (e)
    {
      _changeSearchValue(_target, $(this).attr("fieldname"), this.value);
    });

    //查询按钮事件
    $(".btnsearch", _target).click(function (e)
    {
      var where = $(_target).supersearch('getQuery');
			var outerWhere=_opts.onBeforeSearchLoad.call(_target);
			if(outerWhere)
			{
				if(where)where+=" And ";
				where += outerWhere;
			}
      if(_opts.type=='outlook')
      {
        _gridHandler.outlook('load', { where: where }); //表格重新加载数据
      }
      else
      {
        _gridHandler.datagrid('load', { where: where }); //表格重新加载数据
      }
      $(_target).window('close');
    });

    //重置按钮事件
    $(".btnreset", _target).click(function (e)
    {
      _opts.resultData = {}; //查询结果清空
      $(".content input", _target).each(function (i, item)
      {
        item.value = '';
        var _fieldName = this.id.replace(/s_/gi, '');
        _opts.resultData[_fieldName] = null;
        if ($(this).hasClass("datebox-f"))
        {
          $(this).datebox("clear");
        }
        else if ($(this).hasClass("combo-text"))
        {
          $(this).combobox("clear");
        }
      });
    });
  };

  function _changeSearchValue(_target, _input, _value)
  {
    var _state = $.data(_target, "supersearch");
    var _opts = _state.options;
    var _resultData = _opts.resultData;
    var _fieldName = _input;//_input.id.replace(/s_/gi, '');

    var _jinput = $(_input);
    if (_jinput.not(".datebox-f").hasClass("combo-text"))
    {
      //var _dataRow = null;
      //var _boxopts = _jinput.combobox("options");
      //var _dataRows = _jinput.combobox("getData");
      _value = _jinput.combobox("getValues");
    }
    _resultData[_fieldName] = _value;
    _opts.onAfterSearchChange(_fieldName, _resultData, _value);
  }

  function _getQuery(_target)
  {
    var _opts = $.data(_target, "supersearch").options;
    var _resultData = _opts.resultData;
    var _where = '';
    $.each(_resultData, function (fieldName, value)
    {
      if (value == null || value == '') return true;

      var _searchColInfo = _getSearchColumnInfo(_target, fieldName);
      if (!_searchColInfo || _searchColInfo.SearchType == 0) return true;
      var searchValue = '';
      switch (_searchColInfo.DataType)
      {
        case 'Int16':
        case 'Int32':
        case 'Int64':
        case 'Decimal':
        case 'Double':
        case 'Single':
        case 'Byte':
        case 'ByteArray':
					if(value && (_searchColInfo.SearchType == 1 || _searchColInfo.SearchType == 2))  //数组
					{
            searchValue =  fieldName + " in(" + value + ")";
					}
          else
          {
            if (fieldName.indexOf("_From") > 0)
            {
              searchValue = fieldName.replace(/_From/g, '') + '>=' + value;
            }
            else if (fieldName.indexOf("_To") > 0)
            {
              searchValue = fieldName.replace(/_To/g, '') + '<=' + value;
            }
            else
            {
              searchValue = fieldName + '=' + value;
            }
          }
          break;
        case 'Date':
        case 'DateTime':
          if (_searchColInfo.SearchType == 2)//精确查询
          {
            searchValue = fieldName + "='" + value + "'";
          }
          else
          {
            if (fieldName.indexOf("_From") > 0)
            {
              searchValue = fieldName.replace(/_From/g, '') + ">='" + value + "'";
            }
            else if (fieldName.indexOf("_To") > 0)
            {
              searchValue = fieldName.replace(/_To/g, '') + "<='" + value + " 23:59:59'";
            }
            else
            {
              searchValue = fieldName + "='" + value + "'";
            }
          }
          break;
        default:
					if(value.indexOf(",")>0 && (_searchColInfo.SearchType == 1 || _searchColInfo.SearchType == 2))
					{
					  value = value.replace(/,/gi, "','");
					  value = "'" + value + "'";
            searchValue =  fieldName + " in(" + value + ")";
					}
          else
          {
            if (_searchColInfo.SearchType == 1)	//模糊查询
            {
              searchValue = fieldName + " like '%" + value + "%'";
            }
            else if (_searchColInfo.SearchType == 2)	//精确查询
            {
              searchValue = fieldName + "='" + value + "'";
            }
          }
          break;
      }
      if (searchValue)
      {
        if (_where) _where += ' and ';
        _where += searchValue;
      }
    });

    return _where;
  }

  //通过字段名查找字段属性对象
  function _getSearchColumnInfo(_target, _fieldname)
  {
    var _data = $.data(_target, "supersearch");
    var _opts = _data.options;
    var _columns = _opts.searchColumnList;

    _fieldname = _fieldname.replace(/_From/g, '').replace(/_To/g, '');
    for (var i = 0; i < _columns.length; i++)
    {
      var _fname = _columns[i].ColumnName;
      if (_fname == _fieldname) return _columns[i];
    }
    return null;
  }

  function _loadGrid(_target)
  {
    var _state = $.data(_target, "supersearch");
    var _opts = _state.options;

    $.ajax({
      type: "post",
      url: _opts.loadurl,
      data: _opts.queryParams,
      cache: true,
      dataType: "json",
      beforeSend: function (XMLHttpRequest)
      {
        $(_target).window('open');
        $(".content", _target).html('<img src="/content/images/loading_16x16.gif" style="vertical-align:middle;"/>正在加载查询页面，请稍等...');
      },
      success: function (searchColumnList, status)
      {
        if (!searchColumnList)
        {
          alert("数据不存在！");
          return;
        }
        _opts.searchColumnList = searchColumnList;
        _createGrid(_target);
        _bindEvent(_target);
				_opts.onAfterSearchLoad.call(searchColumnList);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown)
      {
        var msg = "服务器出错,错误内容：" + XMLHttpRequest.responseText;
        $("#msgregion").html(msg);
        $("#msgregion").css({ color: "red" });
        $("#messagewin").window('open');
      },
      complete: function (XMLHttpRequest, textStatus)
      {
        _target.isInitLoadData = true;
      }
    });
  }

  $.fn.supersearch = function (_options, _param)
  {
    if (typeof _options == "string")
    {
      return $.fn.supersearch.methods[_options](this, _param);
    }
    _options = _options || {};
    return this.each(function ()
    {
      var _state = $.data(this, "supersearch");
      var _opts;
      if (_state)
      {
        _opts = $.extend(_state.options, _options);
        _state.options = _opts;
      } else
      {
        _opts = $.extend({},
        $.fn.supersearch.defaults, $.fn.supersearch.parseOptions(this), _options);
        $.data(this, "supersearch", {
          options: _opts,
          dataRow: {}
        });
      }
      if (_opts.isInitLoadData)
      {
        _opts.isInitLoadData = false;
        _loadGrid(this);
      }
      else
      {
        $(this).window("open");
      }
    });
  };

  $.fn.supersearch.methods = {
    options: function (jq)
    {
      return $.data(jq[0], "supersearch").options;
    },
    getQuery: function (jq)
    {
      return _getQuery(jq[0]);
    }
  }

  $.fn.supersearch.parseOptions = function (_target)
  {
    var t = $(_target);
    return $.extend({},
    {
      isInitLoadData: (t.attr("isInitLoadData") ? t.attr("isInitLoadData") == "true" : undefined)
    });
  };

  $.fn.supersearch.defaults = $.extend({},
	{
	  loadurl: '/sys/data/search',
	  queryParams: { tableView: Globals.tableView() },
	  loadMsg: "正在处理，请稍等 ...",
	  isInitLoadData: true,
	  /*查询框结构数据，例：
	  [{
	  ColumnID = exp.ColumnID,
	  ColumnComment = exp.ColumnComment,
	  ColumnName = exp.ColumnName,
	  DropDown_Id = exp.DropDown_Id,
	  IsSearchColumn = exp.IsSearchColumn,
	  SearchType = exp.SearchType,
	  OrderNo = exp.OrderNo,
	  DataType = exp.DataType,
	  }]*/
	  searchColumnList: [],
	  /*查询结果数据，例：
	  {字段名 :字段值,字段名 :字段值}*/
	  resultData: {},
	  gridHandler: null, //关联数据表格handler
	  columns: [],
	  onRowContextMenu: function (e, _rowIndex, _rowData) { },
	  onBeforeSearchChange: function (_fieldName, _masterData, _value) { },
	  onAfterSearchChange: function (_fieldName, _masterData, _value) { },
	  onBeforeSearchLoad: function () { },
	  onAfterSearchLoad: function (_data){}
	});

})(jQuery);

//jQuery.dagagrid.js
(function($) {
	var _rowIdPrefix = 0;
	function _arrayFind(_array, _row, _like) {
		for (var i = 0, _length = _array.length; i < _length; i++) {
      var _exist=(_array[i] == _row);
      if(_like && typeof _array[i]=="string")_exist=_array[i].indexOf(_row)>=0;
			if (_exist) {
				return i;
			}
		}
		return - 1;
	};
	function _arrayRemove(_array, _idField, id) {
    if(!_array)return;
		if (typeof _idField == "string") {
			for (var i = 0, _length = _array.length; i < _length; i++) {
				if (_array[i][_idField] == id) {
					_array.splice(i, 1);
					return;
				}
			}
		} else {
			var _item = _arrayFind(_array, _idField);
			if (_item != -1) {
				_array.splice(_item, 1);
			}
		}
	};
	function _arrayInsertNew(_array, _idField, r) {
		for (var i = 0, _length = _array.length; i < _length; i++) {
      if (_array.indexOf(r)>=0)return;
			/*if (_array[i][_idField] == r[_idField]) {
				return;
			}*/
		}
		_array.push(r);
	};
	function _ssAction(_header) {
		var cc = _header || $("head");
		var _ssState = $.data(cc[0], "ss");
		if (!_ssState) {
			_ssState = $.data(cc[0], "ss", {
				cache: {},
				dirty: []
			});
		}
		return {
			add: function(_c) {
				var ss = ["<style type=\"text/css\">"];
				for (var i = 0; i < _c.length; i++) {
					_ssState.cache[_c[i][0]] = {
						width: _c[i][1]
					};
				}
				var _d = 0;
				for (var s in _ssState.cache) {
					var _e = _ssState.cache[s];
					_e.index = _d++;
					ss.push(s + "{width:" + _e.width + "}");
				}
				ss.push("</style>");
				$(ss.join("\n")).appendTo(cc);
				setTimeout(function() {
					cc.children("style:not(:last)").remove();
				},
				0);
			},
			getRule: function(_index) {
				var _style = cc.children("style:last")[0];
				var _styleSheet = _style.styleSheet ? _style.styleSheet: (_style.sheet || document.styleSheets[document.styleSheets.length - 1]);
				var _cssRules = _styleSheet.cssRules || _styleSheet.rules;
				return _cssRules[_index];
			},
			set: function(_cssName, _width) {
				var _css = _ssState.cache[_cssName];
				if (_css) {
					_css.width = _width;
					var _cssRule = this.getRule(_css.index);
					if (_cssRule) {
						_cssRule.style["width"] = _width;
					}
				}
			},
			remove: function(_cssName) {
				var tmp = [];
				for (var s in _ssState.cache) {
					if (s.indexOf(_cssName) == -1) {
						tmp.push([s, _ssState.cache[s].width]);
					}
				}
				_ssState.cache = {};
				this.add(tmp);
			},
			dirty: function(_css) {
				if (_css) {
				  _ssState.dirty.push(_css);
				}
			},
			clean: function() {
				for (var i = 0; i < _ssState.dirty.length; i++) {
					this.remove(_ssState.dirty[i]);
				}
				_ssState.dirty = [];
			}
		};
	};
	function _resize(_target, _param) {
		var _opts = $.data(_target, "datagrid").options;
		var _panel = $.data(_target, "datagrid").panel;
		if (_param) {
			if (_param.width) {
				_opts.width = _param.width;
			}
			if (_param.height) {
				_opts.height = _param.height;
			}
		}
		if (_opts.fit == true) {
			var p = _panel.panel("panel").parent();
			_opts.width = p.width();
			_opts.height = p.height();
		}
		_panel.panel("resize", {
			width: _opts.width,
			height: _opts.height
		});
	};
	function _setBodyHeight(_target) {
		var _opts = $.data(_target, "datagrid").options;
		var dc = $.data(_target, "datagrid").dc;
		var _panel = $.data(_target, "datagrid").panel;
		var _panelWidth = _panel.width();
		var _panelHeight = _panel.height();
		var _view = dc.view;
		var _view1 = dc.view1;
		var _view2 = dc.view2;
		var _header1 = _view1.children("div.datagrid-header");
		var _header2 = _view2.children("div.datagrid-header");
		var _headerTable1 = _header1.find("table");
		var _headerTable2 = _header2.find("table");
		_view.width(_panelWidth);
		var _headerInner2 = _header1.children("div.datagrid-header-inner").show();
		_view1.width(_headerInner2.find("table").width());
		if (!_opts.showHeader) {
			_headerInner2.hide();
		}
		_view2.width(_panelWidth - _view1._outerWidth());
		_view1.children("div.datagrid-header,div.datagrid-body,div.datagrid-footer").width(_view1.width());
		_view2.children("div.datagrid-header,div.datagrid-body,div.datagrid-footer").width(_view2.width());
		var hh;
		_header1.css("height", "");
		_header2.css("height", "");
		_headerTable1.css("height", "");
		_headerTable2.css("height", "");
		hh = Math.max(_headerTable1.height(), _headerTable2.height());
		_headerTable1.height(hh);
		_headerTable2.height(hh);
		_header1.add(_header2)._outerHeight(hh);
		if (_opts.height != "auto") {
      var _bodyHeight = _panelHeight - _view2.children("div.datagrid-header").outerHeight(true) -
      _view2.children("div.datagrid-footer").outerHeight(true) - 
      _panel.children("div.datagrid-toolbar:visible").outerHeight(true) -
      _panel.children("div.datagrid-tabbar:visible").outerHeight(true) -
      _panel.children("div.datagrid-navbar").outerHeight(true) - 
      _panel.children("div.datagrid-tipbar").outerHeight(true);
      // - _panel.children("div.datagrid-pager").outerHeight(true);

      /*
      var _bodyHeight = _panelHeight - _view2.children("div.datagrid-header")._outerHeight() - _view2.children("div.datagrid-footer")._outerHeight() 
        - _panel.children("div.datagrid-toolbar")._outerHeight();*/
			_panel.children("div.datagrid-pager").each(function() {
				_bodyHeight -= $(this)._outerHeight();
			});
			dc.body1.add(dc.body2).children("table.datagrid-btable-frozen").css({
				position: "absolute",
				top: dc.header2._outerHeight()
			});
			var _outerHeight = dc.body2.children("table.datagrid-btable-frozen")._outerHeight();
			_view1.add(_view2).children("div.datagrid-body").css({
				marginTop: _outerHeight,
				height: (_bodyHeight - _outerHeight)
			});
		}
		_view.height(_view2.height());
	};
	function _fixRowHeight(_target, _index, _isInit) {
		var _rows = $.data(_target, "datagrid").data.rows;
		var _opts = $.data(_target, "datagrid").options;
		var dc = $.data(_target, "datagrid").dc;
    var _panel = $.data(_target, "datagrid").panel;
		if (!dc.body1.is(":empty") && (!_opts.nowrap || _opts.autoRowHeight || _isInit)) {
			if (_index != undefined) {
				var tr1 = _opts.finder.getTr(_target, _index, "body", 1);
				var tr2 = _opts.finder.getTr(_target, _index, "body", 2);
				_setMaxHeight(tr1, tr2);
			} else {
				var tr1 = _opts.finder.getTr(_target, 0, "allbody", 1);
				var tr2 = _opts.finder.getTr(_target, 0, "allbody", 2);
				_setMaxHeight(tr1, tr2);
				if (_opts.showFooter) {
					var tr1 = _opts.finder.getTr(_target, 0, "allfooter", 1);
					var tr2 = _opts.finder.getTr(_target, 0, "allfooter", 2);
					_setMaxHeight(tr1, tr2);
				}
			}
		}
		_setBodyHeight(_target);
		if (_opts.height == "auto") {
			var _bodyParent = dc.body1.parent();
			var _body2 = dc.body2;
			var _bodyWithHeight = _getBodyWithHeight(_body2);
			var _bodyHeight = _bodyWithHeight.height;
			if (_bodyWithHeight.width > _body2.width()) {
				_bodyHeight += 18;
			}
			if (_opts.minHeight && _bodyHeight < _opts.minHeight)
			{
			  _bodyHeight = _opts.minHeight;
			}
			if (_opts.maxHeight && _bodyHeight > _opts.maxHeight)
      {
         _bodyHeight = _opts.maxHeight;
      }
			_bodyParent.height(_bodyHeight);
			_body2.height(_bodyHeight);
			dc.view.height(dc.view2.height());
		}
    else if (_opts.height == "100%")
    {
      var _panelHeight = _panel.parent().parent().height();
      $(_target).datagrid('resize', { height: _panelHeight });
    }
		dc.body2.triggerHandler("scroll");
		function _setMaxHeight(tr1, tr2) {
			for (var i = 0; i < tr2.length; i++) {
				var tr1 = $(tr1[i]);
				var tr2 = $(tr2[i]);
				tr1.css("height", "");
				tr2.css("height", "");
				var _maxHeight = Math.max(tr1.height(), tr2.height());
				tr1.css("height", _maxHeight);
				tr2.css("height", _maxHeight);
			}
		};
		function _getBodyWithHeight(cc) {
			var _width = 0;
			var _height = 0;
			$(cc).children().each(function() {
				var c = $(this);
				if (c.is(":visible")) {
					_height += c._outerHeight();
					if (_width < c._outerWidth()) {
						_width = c._outerWidth();
					}
				}
			});
			return {
				width: _width,
				height: _height
			};
		};
	};
	function _freezeRow(_target, _index) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		var dc = _state.dc;
		if (!dc.body2.children("table.datagrid-btable-frozen").length) {
			dc.body1.add(dc.body2).prepend("<table class=\"datagrid-btable datagrid-btable-frozen\" cellspacing=\"0\" cellpadding=\"0\"></table>");
		}
		_44(true);
		_44(false);
		_setBodyHeight(_target);
		function _44(_45) {
			var _46 = _45 ? 1 : 2;
			var tr = _opts.finder.getTr(_target, _index, "body", _46); (_45 ? dc.body1: dc.body2).children("table.datagrid-btable-frozen").append(tr);
		};
	};
	function _wrapGrid(_target, _rownumbers) {
		function _getColumns() {
			var _4b = [];
			var _4c = [];
			$(_target).children("thead").each(function() {
				var opt = $.parser.parseOptions(this, [{
					frozen: "boolean"
				}]);
				$(this).find("tr").each(function() {
					var _4d = [];
					$(this).find("th").each(function() {
						var th = $(this);
						var col = $.extend({},
						$.parser.parseOptions(this, ["field", "align", "halign", "order", {
							sortable: "boolean",
							checkbox: "boolean",
							resizable: "boolean",
							fixed: "boolean"
						},
						{
							rowspan: "number",
							colspan: "number",
							width: "number"
						}]), {
							title: (th.html() || undefined),
							hidden: (th.attr("hidden") ? true: undefined),
							formatter: (th.attr("formatter") ? eval(th.attr("formatter")) : undefined),
							styler: (th.attr("styler") ? eval(th.attr("styler")) : undefined),
							sorter: (th.attr("sorter") ? eval(th.attr("sorter")) : undefined)
						});
						if (th.attr("editor")) {
							var s = $.trim(th.attr("editor"));
							if (s.substr(0, 1) == "{") {
								col.editor = eval("(" + s + ")");
							} else {
								col.editor = s;
							}
						}
						_4d.push(col);
					});
					opt.frozen ? _4b.push(_4d) : _4c.push(_4d);
				});
			});
			return [_4b, _4c];
		};
		var _panel = $(
      '<div class="datagrid-wrap">' + 
        '<div class="datagrid-view">' + 
          '<div id="'+_target.id+'_frozenView" class="datagrid-view1">' + 
            '<div id="'+_target.id+'_frozenHeader" class="datagrid-header">' + 
              '<div id="'+_target.id+'_frozenHeaderInner" class="datagrid-header-inner"></div>' + 
            '</div>' + 
            '<div id="'+_target.id+'_frozenBody" class="datagrid-body">' + 
              '<div id="'+_target.id+'_frozenBody" class="datagrid-body-inner"></div>' + 
            '</div>' + 
            '<div id="'+_target.id+'_frozenFooter" class="datagrid-footer">' + 
              '<div id="'+_target.id+'_frozenFooterInner" class="datagrid-footer-inner"></div>' + 
            '</div>' + 
          '</div>' + 
          '<div id="'+_target.id+'_mainView" class="datagrid-view2">' + 
            '<div id="'+_target.id+'_mainHeader" class="datagrid-header">' + 
              '<div id="'+_target.id+'_mainHeaderInner" class="datagrid-header-inner"></div>' + 
            '</div>' + 
            '<div id="'+_target.id+'_mainBody" class="datagrid-body"></div>' + 
            '<div id="'+_target.id+'_mainFooter" class="datagrid-footer">' + 
              '<div id="'+_target.id+'_mainFooterInner" class="datagrid-footer-inner"></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>' + 
      '</div>').insertAfter(_target);
		_panel.panel({
			doSize: false
		});
		_panel.panel("panel").addClass("datagrid").bind("_resize",
		function(e, _param) {
			var _opts = $.data(_target, "datagrid").options;
			if (_opts.fit == true || _param) {
				_resize(_target);
				setTimeout(function() {
					if ($.data(_target, "datagrid")) {
						_fixColumnSize(_target);
					}
				},
				0);
			}
			return false;
		});
		$(_target).hide().appendTo(_panel.children("div.datagrid-view"));
		var cc = _getColumns();
		var _view = _panel.children("div.datagrid-view");
		var _view1 = _view.children("div.datagrid-view1");
		var _view2 = _view.children("div.datagrid-view2");
		var _viewEx = _panel.closest("div.datagrid-view");
		if (!_viewEx.length) {
			_viewEx = _view;
		}
		var ss = _ssAction(_viewEx);
		return {
			panel: _panel,
			frozenColumns: cc[0],
			columns: cc[1],
			dc: {
				view: _view,
				view1: _view1,
				view2: _view2,
				header1: _view1.children("div.datagrid-header").children("div.datagrid-header-inner"),
				header2: _view2.children("div.datagrid-header").children("div.datagrid-header-inner"),
				body1: _view1.children("div.datagrid-body").children("div.datagrid-body-inner"),
				body2: _view2.children("div.datagrid-body"),
				footer1: _view1.children("div.datagrid-footer").children("div.datagrid-footer-inner"),
				footer2: _view2.children("div.datagrid-footer").children("div.datagrid-footer-inner")
			},
			ss: ss
		};
	};
	function _createGrid(_target) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		var dc = _state.dc;
		var _panel = _state.panel;
		_panel.panel($.extend({},
		_opts, {
			id: null,
			doSize: false,
			onResize: function(_width, _height) {
				setTimeout(function() {
					if ($.data(_target, "datagrid")) {
						_setBodyHeight(_target);
						_fitColumns(_target);
						_opts.onResize.call(_panel, _width, _height);
					}
				},
				0);
			},
			onExpand: function() {
				_fixRowHeight(_target);
				_opts.onExpand.call(_panel);
			}
		}));
		_state.rowIdPrefix = "datagrid-row-r" + (++_rowIdPrefix);
		_state.cellClassPrefix = "datagrid-cell-c" + _rowIdPrefix;
		_createHeaderTable(dc.header1, _opts.frozenColumns, true);
		_createHeaderTable(dc.header2, _opts.columns, false);
		_ssInit();
		dc.header1.add(dc.header2).css("display", _opts.showHeader ? "block": "none");
		dc.footer1.add(dc.footer2).css("display", _opts.showFooter ? "block": "none");
    if (_opts.tipbar)
    {
			_tipbarer.init(_target);
    } else
    {
      $("div.datagrid-tipbar", _panel).remove();
    }
    if (_opts.navbar)
    {
			_navbarer.init(_target);
    } else
    {
      $("div.datagrid-navbar", _panel).remove();
    }
    if (_opts.tabbar)
    {
			_opts.tabbarer.target=_target;
      _opts.tabbarer.init();
    } else
    {
      $("div.datagrid-toolbar", _panel).remove();
    }
    if (_opts.toolbar)
    {
			_opts.toolbarer.target=_target;
      _opts.toolbarer.init();
    } else
    {
      $("div.datagrid-toolbar", _panel).remove();
    }
		$("div.datagrid-pager", _panel).remove();
		if (_opts.pagination) {
			var _60 = $("<div class=\"datagrid-pager\"></div>");
			if (_opts.pagePosition == "bottom") {
				_60.appendTo(_panel);
			} else {
				if (_opts.pagePosition == "top") {
					_60.addClass("datagrid-pager-top").prependTo(_panel);
				} else {
					var _61 = $("<div class=\"datagrid-pager datagrid-pager-top\"></div>").prependTo(_panel);
					_60.appendTo(_panel);
					_60 = _60.add(_61);
				}
			}
			_60.pagination({
				total: 0,
				pageNumber: _opts.pageNumber,
				pageSize: _opts.pageSize,
				pageList: _opts.pageList,
				onSelectPage: function(_62, _63) {
					_opts.pageNumber = _62;
					_opts.pageSize = _63;
					_60.pagination("refresh", {
						pageNumber: _62,
						pageSize: _63
					});
					_load(_target);
				}
			});
			_opts.pageSize = _60.pagination("options").pageSize;
		}
		function _createHeaderTable(_headerInner, _columns, _frozen) {
			if (!_columns) {
				return;
			}
			$(_headerInner).show();
			$(_headerInner).empty();
			var _sortNameArray = [];
			var _sortOrderArray = [];
			if (_opts.sortName) {
				_sortNameArray = _opts.sortName.split(",");
				_sortOrderArray = _opts.sortOrder.split(",");
			}
			var t = $("<table class=\"datagrid-htable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>").appendTo(_headerInner);
			for (var i = 0; i < _columns.length; i++) {
				var tr = $("<tr class=\"datagrid-header-row\"></tr>").appendTo($("tbody", t));
				var _column = _columns[i];
				for (var j = 0; j < _column.length; j++) {
					var col = _column[j];
          if(typeof col.formatter=="string")
          {
            col.formatter=eval(col.formatter);
          }
					var _columnAttr = "";
					if (col.rowspan) {
						_columnAttr += "rowspan=\"" + col.rowspan + "\" ";
					}
					if (col.colspan) {
						_columnAttr += "colspan=\"" + col.colspan + "\" ";
					}
					var td = $("<td " + _columnAttr + "></td>").appendTo(tr);
					if (col.checkbox) {
						td.attr("field", col.field);
						$("<div class=\"datagrid-header-check\"></div>").html("<input type=\"checkbox\"/>").appendTo(td);
					} else {
						if (col.field) {
							td.attr("field", col.field);
							td.append("<div class=\"datagrid-cell\"><span></span><span class=\"datagrid-sort-icon\"></span></div>");
							$("span", td).html(col.title);
							var _sort=$("span.datagrid-sort-icon", td).html("&nbsp;");
              if(col.ColumnWarning)
              {
  							$("<span class=\"datagrid-help-icon\"></span>").insertBefore(_sort)
                  .tooltipRattan({
                  position: 'bottom',
                  content: '<span style="color:#fff">'+col.ColumnWarning+'</span>',
                  onShow: function() {
                    var _tip=$(this);
                    _tip.tooltipRattan('tip').css({
                      backgroundColor: '#666',
                      borderColor: '#666',
                      width:"220px"
                    }).unbind().bind('mouseenter',
                    function() {
                      _tip.tooltipRattan('show');
                    }).bind('mouseleave',
                    function() {
                      _tip.tooltipRattan('hide');
                    });
                  },
                  onPosition: function(){
                    $(this).tooltipRattan('tip').css('left', $(this).offset().left-15);
                    $(this).tooltipRattan('arrow').css('left', 20);
                  }
                }).click(function(){return false;});
              }
							var _cell = td.find("div.datagrid-cell");
							var pos = _arrayFind(_sortNameArray, col.field, true);
							if (pos >= 0) {
                var _sortOrder = _arrayFind(_sortNameArray, "desc", true)?"desc":"asc"; //by xtb
								_cell.addClass("datagrid-sort-" + _sortOrder);
							}
							if (col.resizable == false) {
								_cell.attr("resizable", "false");
							}
							if (col.width) {
								_cell._outerWidth(col.width);
								col.boxWidth = parseInt(_cell[0].style.width);
							} else {
								col.auto = true;
							}
							_cell.css("text-align", (col.halign || col.align || ""));
							col.cellClass = _state.cellClassPrefix + "-" + col.field.replace(/[\.|\s]/g, "-");

              if (_opts.isShowColumMenu && $("#columnmenuid").length > 0)
              {
                $('<div class="datagrid-columnm-searchtip"></div>').appendTo(_cell);
                var _colmenu = $('<div class="datagrid-columnmenu"></div>').appendTo(_cell);
                var _cm = _colmenu.columnmenu({ gridhandler: _target });
                td[0].jcolumnmenu = _cm;
              }
            } else {
							$("<div class=\"datagrid-cell-group\"></div>").html(col.title).appendTo(td);
						}
					}
					if (col.hidden) {
						td.hide();
					}
				}
			}
			if (_frozen && _opts.rownumbers) {
				var td = $("<td rowspan=\"" + _opts.frozenColumns.length + "\"><div class=\"datagrid-header-rownumber\"></div></td>");
				if ($("tr", t).length == 0) {
					td.wrap("<tr class=\"datagrid-header-row\"></tr>").parent().appendTo($("tbody", t));
				} else {
					td.prependTo($("tr:first", t));
				}
			}
		};
		function _ssInit() {
			var _cellClassList = [];
			var _fields = _getColumnFields(_target, true).concat(_getColumnFields(_target));
			for (var i = 0; i < _fields.length; i++) {
				var col = _getColumnOption(_target, _fields[i]);
				if (col && !col.checkbox) {
					_cellClassList.push(["." + col.cellClass, col.boxWidth ? col.boxWidth + "px": "auto"]);
				}
			}
			_state.ss.add(_cellClassList);
			_state.ss.dirty(_state.cellSelectorPrefix);
			_state.cellSelectorPrefix = "." + _state.cellClassPrefix;
		};
    _fixRowHeight(_target);
	};
	function _bindHeaderEvent(_target) {
		var _state = $.data(_target, "datagrid");
		var _panel = _state.panel;
		var _opts = _state.options;
		var dc = _state.dc;
		var _headers = dc.header1.add(dc.header2);
    $(document).bind("click.datagrid", function(e)
    {	//点击datagrid空白区域，结束编辑
			if (_opts.editable)
      {
        _endEdit(_target, _opts.currentRowInfo.index, false);
      }
		});

    _panel.children("div.datagrid-view").unbind(".datagrid").bind("keydown.datagrid",
		function (e)
		{
		  var _index = _opts.currentRowInfo.index;
		  if (e.keyCode == 38)	//up key
		  {
		    _setCurrentRow(_target, _index - 1, e);
		    return false;
		  }
		  else if (e.keyCode == 40)	//down key
		  {
		    _setCurrentRow(_target, _index + 1, e);
		    return false;
		  }
		  if (e.keyCode == 37)	//left key
		  {
        if($(e.target).getCursorPosition()==0 && !$(e.target).isSelected())
		    {
          _setCurrentRow(_target, _index, e, "left");
          return false;
        }
		  }
		  if (e.keyCode == 39)	//right key
		  {
        if(($(e.target).getSelectionStart()==$(e.target).val().length) && !$(e.target).isSelected())
		    {
          _setCurrentRow(_target, _index, e, "right");
          return false;
        }
		  }
		});

    _headers.find("div.datagrid-header-rownumber").parent().unbind(".datagrid").bind("click.datagrid",
    function ()
    {
      _showTableProperties(_target, this);
    });
    _headers.find("input[type=checkbox]").unbind(".datagrid").bind("click.datagrid",
		function(e) {
			if (_opts.singleSelect && _opts.selectOnCheck) {
				return false;
			}
			if ($(this).is(":checked")) {
				_checkAll(_target);
			} else {
				_clearChecked(_target);
			}
			e.stopPropagation();
		});
		var _cells = _headers.find("div.datagrid-cell");
		_cells.closest("td").unbind(".datagrid").bind("mouseenter.datagrid",
		function() {
			if (_state.resizing) {
				return;
			}
      $(this).siblings().each(function ()
      {
        $(this).removeClass("datagrid-header-over");
        $(".datagrid-columnmenu", this).removeClass("datagrid-columnmenu-over");
        if (this.jcolumnmenu) this.jcolumnmenu.columnmenu("hideMenu");
      });

      $(this).addClass("datagrid-header-over");
      $(".datagrid-columnmenu", this).addClass("datagrid-columnmenu-over");
		}).bind("mouseleave.datagrid",
		function() {
      if (!this.isExpendMenu)
      {
        $(this).removeClass("datagrid-header-over");
        $(".datagrid-columnmenu", this).removeClass("datagrid-columnmenu-over");
      }
		}).bind("contextmenu.datagrid",
		function(e) {
			var _77 = $(this).attr("field");
			_opts.onHeaderContextMenu.call(_target, e, _77);
		});
		_cells.unbind(".datagrid").bind("click.datagrid",
		function(e) {
			var p1 = $(this).offset().left + 5;
			var p2 = $(this).offset().left + $(this)._outerWidth() - 5;
			if (e.pageX < p2 && e.pageX > p1) {
				var _field = $(this).parent().attr("field");
				var col = _getColumnOption(_target, _field);
				if (!col.sortable || _state.resizing) {
					return;
				}
				var _sortNameArray = [];
				var _sortOrderArray = [];
				if (_opts.sortName) {
					_sortNameArray = _opts.sortName.split(",");
					_sortOrderArray = _opts.sortOrder.split(",");
				}
				var pos = _arrayFind(_sortNameArray, _field, true);
				var _order = col.order || "desc";
				if (pos >= 0) {
					$(this).removeClass("datagrid-sort-asc datagrid-sort-desc");
					var _currentOrder = _sortOrderArray[pos] == "asc" ? "desc": "asc";
					if (_opts.multiSort && _currentOrder == _order) {
						_sortNameArray.splice(pos, 1);
						_sortOrderArray.splice(pos, 1);
					} else {
            if(_currentOrder == _order)
            {
              //_sortNameArray.splice(pos, 1);
              //_sortOrderArray.splice(pos, 1);
              var _sortNames=_opts.defaultSortName.split(" ");
              _sortOrderArray[pos] = _sortNames.length==2?_sortNames[1]:'asc';
              _sortNameArray[pos] = _sortNames[0] + " " + _sortOrderArray[pos]; //by xtb
            }
            else
            {
              _sortNameArray[pos] = _field + ' ' + _currentOrder; //by xtb
              _sortOrderArray[pos] = _currentOrder;
              $(this).addClass("datagrid-sort-" + _currentOrder);
            }
					}
				} else {
					if (_opts.multiSort) {
						_sortNameArray.push(_field + ' ' + _order); //by xtb
						_sortOrderArray.push(_order);
					} else {
						_sortNameArray = [_field + ' ' + _order]; //by xtb
						_sortOrderArray = [_order];
						_cells.removeClass("datagrid-sort-asc datagrid-sort-desc");
					}
					$(this).addClass("datagrid-sort-" + _order);
				}
				_opts.sortName = _sortNameArray.join(",");
				_opts.sortOrder = _sortOrderArray.join(",");
				if (_opts.remoteSort) {
					_load(_target);
				} else {
					var _data = $.data(_target, "datagrid").data;
					_loadData(_target, _data);
				}
				_opts.onSortColumn.call(_target, _opts.sortName, _opts.sortOrder);
			}
		}).bind("dblclick.datagrid",
		function(e) {
			var p1 = $(this).offset().left + 5;
			var p2 = $(this).offset().left + $(this)._outerWidth() - 5;
			var _isResize = _opts.resizeHandle == "right" ? (e.pageX > p2) : (_opts.resizeHandle == "left" ? (e.pageX < p1) : (e.pageX < p1 || e.pageX > p2));
			if (_isResize) {
				var _field = $(this).parent().attr("field");
				var col = _getColumnOption(_target, _field);
				if (col.resizable == false) {
					return;
				}
				$(_target).datagrid("autoSizeColumn", _field);
				col.auto = false;
			}
		});
		var _resizeHandle = _opts.resizeHandle == "right" ? "e": (_opts.resizeHandle == "left" ? "w": "e,w");
		_cells.each(function() {
			$(this).resizable({
				handles: _resizeHandle,
				disabled: ($(this).attr("resizable") ? $(this).attr("resizable") == "false": false),
				minWidth: 25,
				onStartResize: function(e) {
					_state.resizing = true;
					_headers.css("cursor", $("body").css("cursor"));
					if (!_state.proxy) {
						_state.proxy = $("<div class=\"datagrid-resize-proxy\"></div>").appendTo(dc.view);
					}
					_state.proxy.css({
						left: e.pageX - $(_panel).offset().left - 1,
						display: "none"
					});
					setTimeout(function() {
						if (_state.proxy) {
							_state.proxy.show();
						}
					},
					500);
				},
				onResize: function(e) {
					_state.proxy.css({
						left: e.pageX - $(_panel).offset().left - 1,
						display: "block"
					});
					return false;
				},
				onStopResize: function(e) {
					_headers.css("cursor", "");
					$(this).css("height", "");
					var _field = $(this).parent().attr("field");
					var col = _getColumnOption(_target, _field);
					col.width = $(this)._outerWidth();
					col.boxWidth = parseInt(this.style.width);
					col.auto = undefined;
					_fixColumnSize(_target, _field);
					_state.proxy.remove();
					_state.proxy = null;
					if ($(this).parents("div:first.datagrid-header").parent().hasClass("datagrid-view1")) {
						_setBodyHeight(_target);
					}
					_fitColumns(_target);
					_opts.onResizeColumn.call(_target, _field, col.width);
					setTimeout(function() {
						_state.resizing = false;
					},
					0);
				}
			});
		});
		dc.body1.add(dc.body2).unbind().bind("mouseover",
		function(e) {
			if (_state.resizing) {
				return;
			}
			var tr = $(e.target).closest("tr.datagrid-row");
			if (!_getTRCount(tr)) {
				return;
			}
			var _rowIndex = _getRowIndexByTR(tr);
			_highlightRow(_target, _rowIndex);

      var row = _opts.finder.getRow(_target, _rowIndex);
			var tt = $(e.target);
      var td = tt.closest("td[field]", tr);
      if (td.length) {
        var _field = td.attr("field");
        _opts.onMouseover.call(_target, _rowIndex, _field, row[_field], tr, td, row);
      }

      e.stopPropagation();
		}).bind("mouseout",
		function(e) {
			var tr = $(e.target).closest("tr.datagrid-row");
			if (!_getTRCount(tr)) {
				return;
			}
			var _rowIndex = _getRowIndexByTR(tr);
			_opts.finder.getTr(_target, _rowIndex).removeClass("datagrid-row-over");

      var row = _opts.finder.getRow(_target, _rowIndex);
			var tt = $(e.target);
      var td = tt.closest("td[field]", tr);
      if (td.length) {
        var _field = td.attr("field");
        _opts.onMouseover.call(_target, _rowIndex, _field, row[_field], tr, td, row);
      }

      e.stopPropagation();
		}).bind("click",  //body click
		function(e) {
			var tt = $(e.target);
			var tr = tt.closest("tr.datagrid-row");
			if (!_getTRCount(tr)) {
				return;
			}
			var _rowIndex = _getRowIndexByTR(tr);
			if (tt.parent().hasClass("datagrid-cell-check")) {
				if (_opts.singleSelect && _opts.selectOnCheck) {  //勾选时，选中行
					if (!_opts.checkOnSelect) {
						_clearChecked(_target, true);
					}
					_checkRow(_target, _rowIndex);
				} else {
					if (tt.is(":checked")) {
						_checkRow(_target, _rowIndex);
					} else {
						_uncheckRow(_target, _rowIndex);
					}
				}
			} else {
				var row = _opts.finder.getRow(_target, _rowIndex);
				var td = tt.closest("td[field]", tr);
				if (td.length) {
					var _field = td.attr("field");
					_opts.onClickCell.call(_target, _rowIndex, _field, row[_field], tr, td, row);
				}
        if(_opts.singleCurrent)
        {
          _setCurrentRow(_target, _rowIndex, e);
        }
        else
        {
          if (_opts.singleSelect == true) {
            _selectRow(_target, _rowIndex);
          } else {
            if (tr.hasClass("datagrid-row-selected")) {
              _unselectRow(_target, _rowIndex);
            } else {
              _selectRow(_target, _rowIndex);
            }
          }
				}
				_opts.onClickRow.call(_target, _rowIndex, row, e);
			}
      $("#columnmenuid").menu("hide");/*隐藏菜单*/
			e.stopPropagation();
		}).bind("dblclick",
		function(e) {
			var tt = $(e.target);
			var tr = tt.closest("tr.datagrid-row");
			if (!_getTRCount(tr)) {
				return;
			}
			var _rowIndex = _getRowIndexByTR(tr);
			var row = _opts.finder.getRow(_target, _rowIndex);
			var td = tt.closest("td[field]", tr);
			if (td.length) {
				var _field = td.attr("field");
				_opts.onDblClickCell.call(_target, _rowIndex, _field, row[_field]);
			}
			_opts.onDblClickRow.call(_target, _rowIndex, row);
			e.stopPropagation();
		}).bind("contextmenu",
		function(e) {
			var tr = $(e.target).closest("tr.datagrid-row");
			if (!_getTRCount(tr)) {
				return;
			}
			var _rowIndex = _getRowIndexByTR(tr);
			var row = _opts.finder.getRow(_target, _rowIndex);
			_opts.onRowContextMenu.call(_target, e, _rowIndex, row);
			e.stopPropagation();
		});
		dc.body2.bind("scroll",
		function() {
			var b1 = dc.view1.children("div.datagrid-body");
			b1.scrollTop($(this).scrollTop());
			var _first1 = dc.body1.children(":first");
			var _first2 = dc.body2.children(":first");
			if (_first1.length && _first2.length) {
				var _first1_top = _first1.offset().top;
				var _first2_top = _first2.offset().top;
				if (_first1_top != _first2_top) {
					b1.scrollTop(b1.scrollTop() + _first1_top - _first2_top);
				}
			}
			dc.view2.children("div.datagrid-header,div.datagrid-footer")._scrollLeft($(this)._scrollLeft());
			dc.body2.children("table.datagrid-btable-frozen").css("left", -$(this)._scrollLeft());
		});
		function _getRowIndexByTR(tr) {
			if (tr.attr("datagrid-tr-index")) {
				return parseInt(tr.attr("datagrid-tr-index"));
			} else {
				return parseInt(tr.attr("node-id"));
			}
		};
		function _getTRCount(tr) {
			return tr.length && tr.parent().length;
		};
	};
	function _fitColumns(_target) {
		var _state = $.data(_target, "datagrid").options;
		var dc = $.data(_target, "datagrid").dc;
		dc.body2.css("overflow-x", _state.fitColumns ? "hidden": "");
		if (!_state.fitColumns) {
			return;
		}
		var _header = dc.view2.children("div.datagrid-header");
		var _view2Width = 0;
		var _currentCol;
		var _fields = _getColumnFields(_target, false);
		for (var i = 0; i < _fields.length; i++) {
			var col = _getColumnOption(_target, _fields[i]);
			if (_colResizable(col)) {
				_view2Width += col.width;
				_currentCol = col;
			}
		}
		var _headerInner = _header.children("div.datagrid-header-inner").show();
		var _validWidth = _header.width() - _header.find("table").width() - _state.scrollbarSize;
		var _ratio = _validWidth / _view2Width;
		if (!_state.showHeader) {
			_headerInner.hide();
		}
		for (var i = 0; i < _fields.length; i++) {
			var col = _getColumnOption(_target, _fields[i]);
			if (_colResizable(col)) {
				var _width = Math.floor(col.width * _ratio);
				_setColumnWidth(col, _width);
				_validWidth -= _width;
			}
		}
		if (_validWidth && _currentCol) {
			_setColumnWidth(_currentCol, _validWidth);
		}
		_fixColumnSize(_target);
		function _setColumnWidth(col, _width) {
			col.width += _width;
			col.boxWidth += _width;
			_header.find("td[field=\"" + col.field + "\"] div.datagrid-cell").width(col.boxWidth);
		};
		function _colResizable(col) {
			if (!col.hidden && !col.checkbox && !col.auto && !col.fixed) {
				return true;
			}
		};
	};
	function _autoSizeColumn(_target, _field) {
		var _opts = $.data(_target, "datagrid").options;
		var dc = $.data(_target, "datagrid").dc;
		if (_field) {
			_resize(_field);
			if (_opts.fitColumns) {
				_setBodyHeight(_target);
				_fitColumns(_target);
			}
		} else {
			var _isResized = false;
			var _fields = _getColumnFields(_target, true).concat(_getColumnFields(_target, false));
			for (var i = 0; i < _fields.length; i++) {
				var _field = _fields[i];
				var col = _getColumnOption(_target, _field);
				if (col.auto) {
					_resize(_field);
					_isResized = true;
				}
			}
			if (_isResized && _opts.fitColumns) {
				_setBodyHeight(_target);
				_fitColumns(_target);
			}
		}
		function _resize(_field) {
			var _headerCell = dc.view.find("div.datagrid-header td[field=\"" + _field + "\"] div.datagrid-cell");
			_headerCell.css("width", "");
			var col = $(_target).datagrid("getColumnOption", _field);
			col.width = undefined;
			col.boxWidth = undefined;
			col.auto = true;
			$(_target).datagrid("fixColumnSize", _field);
			var _headerCellOuterWidth = Math.max(_headerCell._outerWidth(), _getMinWidth("allbody"), _getMinWidth("allfooter"));
			_headerCell._outerWidth(_headerCellOuterWidth);
			col.width = _headerCellOuterWidth;
			col.boxWidth = parseInt(_headerCell[0].style.width);
			$(_target).datagrid("fixColumnSize", _field);

			_opts.onResizeColumn.call(_target, _field, col.width);
			function _getMinWidth(_index) {
				var _minWidth = 0;
				_opts.finder.getTr(_target, 0, _index).find("td[field=\"" + _field + "\"] div.datagrid-cell").each(function() {
					var w = $(this)._outerWidth();
					if (_minWidth < w) {
						_minWidth = w;
					}
				});
				return _minWidth;
			};
		};
	};
	function _fixColumnSize(_target, _field) {
		var _state = $.data(_target, "datagrid");
		var _aa = _state.options;
		var dc = _state.dc;
		var _ab = dc.view.find("table.datagrid-btable,table.datagrid-ftable");
		_ab.css("table-layout", "fixed");
		if (_field) {
			fix(_field);
		} else {
			var ff = _getColumnFields(_target, true).concat(_getColumnFields(_target, false));
			for (var i = 0; i < ff.length; i++) {
				fix(ff[i]);
			}
		}
		_ab.css("table-layout", "auto");
		_setmergeCellWidth(_target);
		setTimeout(function() {
			_fixRowHeight(_target);
			_initEditorWidth(_target);
		},
		0);
		function fix(_ad) {
			var col = _getColumnOption(_target, _ad);
			if (!col.checkbox) {
				_state.ss.set("." + col.cellClass, col.boxWidth ? col.boxWidth + "px": "auto");
			}
		};
	};
	function _setmergeCellWidth(_target) {
		var dc = $.data(_target, "datagrid").dc;
		dc.body1.add(dc.body2).find("td.datagrid-td-merged").each(function() {
			var td = $(this);
			var _af = td.attr("colspan") || 1;
			var _width = _getColumnOption(_target, td.attr("field")).width;
			for (var i = 1; i < _af; i++) {
				td = td.next();
				_width += _getColumnOption(_target, td.attr("field")).width + 1;
			}
			$(this).children("div.datagrid-cell")._outerWidth(_width);
		});
	};
	function _initEditorWidth(_target) {
		var dc = $.data(_target, "datagrid").dc;
		dc.view.find("div.datagrid-editable").each(function() {
			var _cell = $(this);
			var _field = _cell.parent().attr("field");
			var col = $(_target).datagrid("getColumnOption", _field);
			_cell._outerWidth(col.width);
			var ed = $.data(this, "datagrid.editor");

      if (ed.actions.resize) {
				ed.actions.resize(ed.target, _cell.width());
			}
		});
	};
	function _getColumnOption(_target, _field) {
		function _getColInfo(_columns) {
			if (_columns) {
				for (var i = 0; i < _columns.length; i++) {
					var cc = _columns[i];
					for (var j = 0; j < cc.length; j++) {
						var c = cc[j];
						if (c.field == _field) {
							return c;
						}
					}
				}
			}
			return null;
		};
		var _opts = $.data(_target, "datagrid").options;
		var col = _getColInfo(_opts.columns);
		if (!col) {
			col = _getColInfo(_opts.frozenColumns);
		}
		return col;
	};
	function _getColumnFields(_target, _frozen) {
		var _opts = $.data(_target, "datagrid").options;
		var _columns = (_frozen == true) ? (_opts.frozenColumns || [[]]) : _opts.columns;
		if (_columns.length == 0) {
			return [];
		}
		var _fields = [];
		function _bf(_c0) {
			var c = 0;
			var i = 0;
			while (true) {
				if (_fields[i] == undefined) {
					if (c == _c0) {
						return i;
					}
					c++;
				}
				i++;
			}
		};
		function _c1(r) {
			var ff = [];
			var c = 0;
			for (var i = 0; i < _columns[r].length; i++) {
				var col = _columns[r][i];
				if (col.field) {
					ff.push([c, col.field]);
				}
				c += parseInt(col.colspan || "1");
			}
			for (var i = 0; i < ff.length; i++) {
				ff[i][0] = _bf(ff[i][0]);
			}
			for (var i = 0; i < ff.length; i++) {
				var f = ff[i];
				_fields[f[0]] = f[1];
			}
		};
		for (var i = 0; i < _columns.length; i++) {
			_c1(i);
		}
		return _fields;
	};
	function _loadData(_target, _data) {
	  _clearChecked(_target, false);
	  var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		var dc = _state.dc;
		_data = _opts.loadFilter.call(_target, _data);
		_data.total = parseInt(_data.total);
		_state.data = _data;
		if (_data.footer) {
			_state.footer = _data.footer;
		}
    else
    {
			_state.footer = [{}];
			var _fields = _getColumnFields(_target, true).concat(_getColumnFields(_target));
			for (var i = 0; i < _fields.length; i++) {
        var _field = _fields[i];
				var _fieldInfo = _getColumnOption(_target, _field);
        if(!_fieldInfo || !_fieldInfo.isSum)continue;

				var _sumValue = _reCalFieldSum(_target, _field);
        _state.footer[0][_field]=_sumValue;
			}
    }
		if (!_opts.remoteSort && _opts.sortName) {
			var _sortNames = _opts.sortName.split(",");
			var _sortOrders = _opts.sortOrder.split(",");
			_data.rows.sort(function(r1, r2) {
				var r = 0;
				for (var i = 0; i < _sortNames.length; i++) {
          var sortName=_sortNames[i].split(" ");

					var sn = sortName[0];//_sortNames[i];
					var so = sortName[1];//_sortOrders[i];
					var col = _getColumnOption(_target, sn);
					if(!col)return;
					var _c9 = col.sorter ||
					function(a, b) {
						return a == b ? 0 : (a > b ? 1 : -1);
					};
					r = _c9(r1[sn], r2[sn]) * (so == "asc" ? 1 : -1);
					if (r != 0) {
						return r;
					}
				}
				return r;
			});
		}
		if (_opts.view.onBeforeRender) {
			_opts.view.onBeforeRender.call(_opts.view, _target, _data.rows);
		}
		_opts.view.render.call(_opts.view, _target, dc.body2, false);
		_opts.view.render.call(_opts.view, _target, dc.body1, true);
		if (_opts.showFooter) {
			_opts.view.renderFooter.call(_opts.view, _target, dc.footer2, false);
			_opts.view.renderFooter.call(_opts.view, _target, dc.footer1, true);
		}
		if (_opts.view.onAfterRender) {
			_opts.view.onAfterRender.call(_opts.view, _target);
		}
		_state.ss.clean();
		_opts.onLoadSuccess.call(_target, _data);
		var _ca = $(_target).datagrid("getPager");
		if (_ca.length) {
			var _cb = _ca.pagination("options");
			if (_cb.total != _data.total) {
				_ca.pagination("refresh", {
					total: _data.total
				});
				if (_opts.pageNumber != _cb.pageNumber) {
					_opts.pageNumber = _cb.pageNumber;
					_load(_target);
				}
			}
		}
		_fixRowHeight(_target);
		dc.body2.triggerHandler("scroll");
    var _newSelectRows=[];
		_setSelectRows();
		$(_target).datagrid("autoSizeColumn");
		function _setSelectRows() {
			if (_opts.idField) {
				for (var i = 0; i < _data.rows.length; i++) {
					var row = _data.rows[i];
					if (_isSelected(_state.selectedRows, row)) {
            _newSelectRows.push(row);
						_opts.finder.getTr(_target, i).addClass("datagrid-row-selected");
					}
					if (_isSelected(_state.checkedRows, row)) {
						_opts.finder.getTr(_target, i).find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked", true);
					}
				}
			}
			function _isSelected(_array, r) {
				for (var i = 0; i < _array.length; i++) {
					if (_array[i][_opts.idField] == r[_opts.idField]) {
						_array[i] = r;
						return true;
					}
				}
				return false;
			};
		};
    $.data(_target, "datagrid").selectedRows=_newSelectRows;
    return _data;
	};
	function _getRowIndex(_target, row) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		var _insertedRows = _state.insertedRows;
		var _selectedRows = _state.selectedRows;
		var _rows = _state.data.rows;

    if (typeof row == "object") {
			return _arrayFind(_rows, row);
		} else {
			for (var i = 0; i < _rows.length; i++) {
				if (_rows[i][_opts.idField] == row) {
					return i;
				}
			}
			return - 1;
		}
	};
	function _getTrIndex(_target, row) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		var dc = _state.dc;
		var _rows = _state.data.rows;
    var _rowIndex = _getRowIndex(_target, row);
    var tr = dc.body2.find("tr[datagrid-row-index="+_rowIndex+"]");
    var _trIndex = tr.attr('datagrid-tr-index');
    return _trIndex;
	};
	function _getSelections(_target) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		var _data = _state.data;
		if (_opts.idField) {
			return _state.selectedRows;
		} else {
			var _dataSelected = [];
			_opts.finder.getTr(_target, "", "selected", 2).each(function() {
				var _rowIndex = parseInt($(this).attr("datagrid-tr-index"));
				_dataSelected.push(_data.rows[_rowIndex]);
			});
			return _dataSelected;
		}
	};
	function _getChecked(_target) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		if (_opts.idField) {
			return _state.checkedRows;
		} else {
			var _dataChecked = [];
			_opts.finder.getTr(_target, "", "checked").each(function() {
				_dataChecked.push(_opts.finder.getRow(_target, $(this)));
			});
			return _dataChecked;
		}
	};
	function _scrollTo(_target, _index) {
		var _state = $.data(_target, "datagrid");
		var dc = _state.dc;
		var _opts = _state.options;
		var tr = _opts.finder.getTr(_target, _index);
		if (tr.length) {
			if (tr.closest("table").hasClass("datagrid-btable-frozen")) {
				return;
			}
			var _e4 = dc.view2.children("div.datagrid-header")._outerHeight();
			var _e5 = dc.body2;
			var _e6 = _e5.outerHeight(true) - _e5.outerHeight();
			var top = tr.position().top - _e4 - _e6;
			if (top < 0) {
				_e5.scrollTop(_e5.scrollTop() + top);
			} else {
				if (top + tr._outerHeight() > _e5.height() - 18) {
					_e5.scrollTop(_e5.scrollTop() + top + tr._outerHeight() - _e5.height() + 18);
				}
			}
		}
	};
	function _highlightRow(_target, _index) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		_opts.finder.getTr(_target, _state.highlightIndex).removeClass("datagrid-row-over");
		_opts.finder.getTr(_target, _index).addClass("datagrid-row-over");
		_state.highlightIndex = _index;
	};
  function _setCurrentRow(_target, _param, _event, _action)
  {
    var _panel = $.data(_target, "datagrid").panel;
    var _opts = $.data(_target, "datagrid").options;
    var _data = $.data(_target, "datagrid").data;
    var _gridView = _panel.children("div.datagrid-view");
    var _gridView1 = _gridView.children("div.datagrid-view1");
    var _td = null;
    if(_event&&_event.target)
    {
			var tt = $(_event.target);
      _td = tt.closest("td[field]", tr);
    }
    var _field=_td?_td.attr('field'):'';
    if(_action=="left" && _field)
    {
      var _fieldtemp='';
      var _cols = _getColumnFields(_target, true).concat(_getColumnFields(_target, false));
      $.each(_cols, function(i, fieldname){
        var colInfo=_getColumnOption(_target, fieldname);
        if(!colInfo.readonly && !!colInfo.editor && colInfo.field!=_field)
        {
          _fieldtemp=colInfo.field;
        }
        if(colInfo.field==_field && _fieldtemp)
        {
          _field=_fieldtemp;
          return false;
        }
      });
    }
    if(_action=="right" && _field)
    {
      var _indextemp=-1;
      var _cols = _getColumnFields(_target, true).concat(_getColumnFields(_target, false));
      $.each(_cols, function(i, fieldname){
        var colInfo=_getColumnOption(_target, fieldname);
        if(colInfo.field==_field)
        {
          _indextemp=i;
        }
        if(_indextemp>-1 && i>_indextemp && !colInfo.readonly && colInfo.editor)
        {
          _field=colInfo.field;
          return false;
        }
      });
    }

    var _index=-1;
    if(typeof _param =='number')
    {
      _index=_param;
    }
    else
    {
      _index = _data.rows.indexOf(_param);
    }
    if (_index < 0) return;
    if (_index >= _data.rows.length) return;

    _gridView1.find("tr[datagrid-tr-index=" + _opts.currentRowInfo.index + "] .datagrid-cell-rownumber").removeClass("datagrid-cell-rownumber-current");
    var tr = $("div.datagrid-body tr[datagrid-tr-index=" + _opts.currentRowInfo.index + "]", _panel);
    tr.removeClass("datagrid-row-current");

    _gridView1.find("tr[datagrid-tr-index=" + _index + "] .datagrid-cell-rownumber").addClass("datagrid-cell-rownumber-current");
    var tr = $("div.datagrid-body tr[datagrid-tr-index=" + _index + "]", _panel);
    tr.addClass("datagrid-row-current")/*.each(function(){this.scrollIntoView(false);})*/;
    var relationRow = tr.data('relationRow');
    var rowIndex = _data.rows.indexOf(relationRow);

    var _oldIndex=_opts.currentRowInfo.index;
    _opts.currentRowInfo.fieldName = _field;
    _opts.currentRowInfo.index = _index;
    _opts.currentRowInfo.rowIndex = rowIndex;
    _opts.currentRowInfo.row = _data.rows[_index];
    _opts.currentRowInfo.tr = tr;
    _opts.currentRowInfo.td = _td;
    var col = _getColumnOption(_target, _field);
    if (_opts.editable && col && !col.readonly)
    {
      _opts.me.endEdit(_oldIndex);
      _opts.me.beginEdit(_index);
    }

    _opts.onCurrent.call(_target, _index, _data.rows[_index]);
    return _index;
  };
	function _selectRow(_target, _index, _ef) {
		var _state = $.data(_target, "datagrid");
		var dc = _state.dc;
		var _opts = _state.options;
		var _selectedRows = _state.selectedRows;
		if (_opts.singleSelect) {
			_clearSelections(_target);
			_selectedRows.splice(0, _selectedRows.length);
		}
		if (!_ef && _opts.checkOnSelect) {
			_checkRow(_target, _index, true);
		}
		var row = _opts.finder.getRow(_target, _index);
		if (_opts.idField) {
			_arrayInsertNew(_selectedRows, _opts.idField, row);
		}
		_opts.finder.getTr(_target, _index).addClass("datagrid-row-selected");
		_opts.onSelect.call(_target, _index, row);
		_scrollTo(_target, _index);
	};
	function _unselectRow(_target, _index, _f8) {
		var _state = $.data(_target, "datagrid");
		var dc = _state.dc;
		var _opts = _state.options;
		var _selectedRows = $.data(_target, "datagrid").selectedRows;
		if (!_f8 && _opts.checkOnSelect) {
			_uncheckRow(_target, _index, true);
		}
		_opts.finder.getTr(_target, _index).removeClass("datagrid-row-selected");
		var row = _opts.finder.getRow(_target, _index);
		if (_opts.idField) {
			_arrayRemove(_selectedRows, _opts.idField, row[_opts.idField]);
		}
		_opts.onUnselect.call(_target, _index, row);
	};
	function _selectAll(_target, _isKeepCheck) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		var rows = _state.data.rows;
		var _selectedRows = $.data(_target, "datagrid").selectedRows;
		if (!_isKeepCheck && _opts.checkOnSelect) {
			_checkAll(_target, true);
		}
		_opts.finder.getTr(_target, "", "allbody").addClass("datagrid-row-selected");
		if (_opts.idField) {
			for (var _i = 0; _i < rows.length; _i++) {
				_arrayInsertNew(_selectedRows, _opts.idField, rows[_i]);
			}
		}
		_opts.onSelectAll.call(_target, rows);
	};
	function _clearSelections(_target, _isKeepChecked) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		var rows = _state.data.rows;
		var _selectedRows = $.data(_target, "datagrid").selectedRows;
		if (!_isKeepChecked/* && _opts.checkOnSelect*/) {
			_clearChecked(_target, true);
		}
		_opts.finder.getTr(_target, "", "selected").removeClass("datagrid-row-selected");
		if (_opts.idField) {
			for (var _109 = 0; _109 < rows.length; _109++) {
				_arrayRemove(_selectedRows, _opts.idField, rows[_109][_opts.idField]);
			}
		}
		_opts.onUnselectAll.call(_target, rows);
	};
	function _checkRow(_target, _index, _10c) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		if (!_10c && _opts.selectOnCheck) {
			_selectRow(_target, _index, true);
		}
		var ck = _opts.finder.getTr(_target, _index).find("div.datagrid-cell-check input[type=checkbox]");
		ck._propAttr("checked", true);
		ck = _opts.finder.getTr(_target, "", "checked");
		if (ck.length == _state.data.rows.length) {
			var dc = _state.dc;
			var _headers = dc.header1.add(dc.header2);
			_headers.find("input[type=checkbox]")._propAttr("checked", true);
		}
		var row = _opts.finder.getRow(_target, _index);
		if (_opts.idField) {
			_arrayInsertNew(_state.checkedRows, _opts.idField, row);
		}
		_opts.onCheck.call(_target, _index, row);
	};
	function _uncheckRow(_target, _index, _111) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		if (!_111 && _opts.selectOnCheck) {
			_unselectRow(_target, _index, true);
		}
		var ck = _opts.finder.getTr(_target, _index).find("div.datagrid-cell-check input[type=checkbox]");
		ck._propAttr("checked", false);
		var dc = _state.dc;
		var _113 = dc.header1.add(dc.header2);
		_113.find("input[type=checkbox]")._propAttr("checked", false);
		var row = _opts.finder.getRow(_target, _index);
		if (_opts.idField) {
			_arrayRemove(_opts.checkedRows, _opts.idField, row[_opts.idField]);
		}
		_opts.onUncheck.call(_target, _index, row);
	};
	function _checkAll(_target, _115) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		var rows = _state.data.rows;
		if (!_115 && _opts.selectOnCheck) {
			_selectAll(_target, true);
		}
		var dc = _state.dc;
		var hck = dc.header1.add(dc.header2).find("input[type=checkbox]");
		var bck = _opts.finder.getTr(_target, "", "allbody").find("div.datagrid-cell-check input[type=checkbox]");
		hck.add(bck)._propAttr("checked", true);
		if (_opts.idField) {
			for (var i = 0; i < rows.length; i++) {
				_arrayInsertNew(_state.checkedRows, _opts.idField, rows[i]);
			}
		}
		_opts.onCheckAll.call(_target, rows);
	};
	function _clearChecked(_target, _118) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		var rows = _state.data.rows;
		if (!_118 && _opts.selectOnCheck) {
			_clearSelections(_target, true);
		}
		var dc = _state.dc;
		var hck = dc.header1.add(dc.header2).find("input[type=checkbox]");
		var bck = _opts.finder.getTr(_target, "", "allbody").find("div.datagrid-cell-check input[type=checkbox]");
		hck.add(bck)._propAttr("checked", false);
		if (_opts.idField) {
			for (var i = 0; i < rows.length; i++) {
				_arrayRemove(_state.checkedRows, _opts.idField, rows[i][_opts.idField]);
			}
		}
		_opts.onUncheckAll.call(_target, rows);
	};
	function _beginEdit(_target, _index) {
		var _opts = $.data(_target, "datagrid").options;
		var tr = _opts.finder.getTr(_target, _index);
		var row = _opts.finder.getRow(_target, _index);
    var _colInfo = _getColumnOption(_target, _opts.currentRowInfo.fieldName);
    if (_colInfo && _colInfo.readonly)
    {
      return;
    }
		if (tr.hasClass("datagrid-row-editing")) {
			return;
		}
		if (_opts.onBeforeEdit.call(_target, _index, row) == false) {
			return;
		}

    _opts.currentRowInfo.rowBefore=$.extend({}, row); //备份修改前数据
    tr.addClass("datagrid-row-editing");
		_initEditor(_target, _index);
		_initEditorWidth(_target);
		tr.find("div.datagrid-editable").each(function() {
			var _field = $(this).parent().attr("field");
			var ed = $.data(this, "datagrid.editor");
			ed.actions.setValue(ed.target, row[_field]);
      if (_field == _opts.currentRowInfo.fieldName)
      {
        if ($(ed.target).hasClass("combo-text"))
        {
          $(ed.target).combobox("showPanel");
        }
        else if ($(ed.target).find('span').hasClass("datebox"))
        {
          $(ed.target).find('input').datebox("showPanel");
        }
        else
        {
          window.setTimeout(function ()
          {
            ed.target.focus();
            ed.target.select();
          }, 100);
        }
      }
		});
		_validateRow(_target, _index);
	};
	function _endEdit(_target, _index, _isCancel) {
    var _state = $.data(_target, "datagrid");
    if(!_state)return;
		var _opts = $.data(_target, "datagrid").options;
		var _updatedRows = $.data(_target, "datagrid").updatedRows;
		var _insertedRows = $.data(_target, "datagrid").insertedRows;
		var tr = _opts.finder.getTr(_target, _index);
		var row = _opts.finder.getRow(_target, _index);
		if (!tr.hasClass("datagrid-row-editing")) {
			return;
		}
		if (!_isCancel) {
			if (!_validateRow(_target, _index)) {
				return;
			}
			var _isChange = false;
			var _changeValues = {};
			tr.find("div.datagrid-editable").each(function() {
				var _field = $(this).parent().attr("field");
        var _colInfo = _getColumnOption(_target, _field);
				var ed = $.data(this, "datagrid.editor");
				var _value = ed.actions.getValue(ed.target);
        switch (_colInfo.datatype)
        {
          case 'Int16':
          case 'Int32':
          case 'Int64':
          case 'Single':
          case 'Byte':
          case 'ByteArray':
            _value = parseInt(_value);
            break;
          case 'Decimal':
          case 'Double':
            _value = parseFloat(_value);
            break;
        }
        if(_value!=_value)_value=null;
				if (row[_field] != _value) {
          _fieldSum(_target, _field, row[_field], _value);
					row[_field] = _value;
					_isChange = true;
					_changeValues[_field] = _value;
				}
			});
      $.each(_opts.currentRowInfo.rowBefore, function(_field, _value)
      {
        if (row[_field] != _value)
        {
          _isChange = true;
          _changeValues[_field] = row[_field];
          //_fieldSum(_target, _field, _value, row[_field]);
        }
      });
			if (_isChange) {
				if (_arrayFind(_insertedRows, row) == -1) {
					if (_arrayFind(_updatedRows, row) == -1) {
						_updatedRows.push(row);
					}
				}
			}
		}
		tr.removeClass("datagrid-row-editing");
		_editorDestroy(_target, _index);
		$(_target).datagrid("refreshRow", _index);
		if (!_isCancel) {
			_opts.onAfterEdit.call(_target, _index, row, _changeValues);
		} else {
			_opts.onCancelEdit.call(_target, _index, row);
		}
	};
	function _getEditors(_target, _index) {
		var _opts = $.data(_target, "datagrid").options;
		var tr = _opts.finder.getTr(_target, _index);
		var _editor = [];
		tr.children("td").each(function() {
			var cell = $(this).find("div.datagrid-editable");
			if (cell.length) {
				var ed = $.data(cell[0], "datagrid.editor");
				_editor.push(ed);
			}
		});
		return _editor;
	};
	function _getEditor(_target, _param) {
		var _editors = _getEditors(_target, _param.index != undefined ? _param.index: _param.id);
		for (var i = 0; i < _editors.length; i++) {
			if (_editors[i].field == _param.field) {
				return _editors[i];
			}
		}
		return null;
	};
	function _initEditor(_target, _index) {
		var _opts = $.data(_target, "datagrid").options;
		var tr = _opts.finder.getTr(_target, _index);
    var _selector="td";//整行编辑
    if(_opts.singleCellEditor)
    {
      _selector='td[field="' + _opts.currentRowInfo.fieldName + '"]';
    }
		tr.children(_selector).each(function(i) {
			var cell = $(this).find("div.datagrid-cell");
			var _field = $(this).attr("field");
			var col = _getColumnOption(_target, _field);
			if (col && col.editor) {
				var _editor, _editorOpts;
				if (typeof col.editor == "string") {
					_editor = col.editor;
				} else {
					_editor = col.editor.type;
					_editorOpts = col.editor.options;
				}
				var _editActions = _opts.editors[_editor];
				if (_editActions) {
					var _cellHtml = cell.html();
					var _width = cell._outerWidth();
					cell.addClass("datagrid-editable");
					cell._outerWidth(_width);
					cell.html("<table border=\"0\" cellspacing=\"0\" cellpadding=\"1\"><tr><td></td></tr></table>");
					cell.children("table").bind("click dblclick contextmenu",
					function(e) {
						e.stopPropagation();
					});
					$.data(cell[0], "datagrid.editor", {
						actions: _editActions,
						target: _editActions.init(cell.find("td"), _editorOpts, _target),
						field: _field,
						type: _editor,
						oldHtml: _cellHtml
					});
          cell.find("input").focus(function ()
          {
            _opts.currentRowInfo.fieldName = _field;
          });
				}
			}
		});
		_fixRowHeight(_target, _index, true);
	};
	function _editorDestroy(_target, _index) {
		var _opts = $.data(_target, "datagrid").options;
		var tr = _opts.finder.getTr(_target, _index);
		tr.children("td").each(function() {
			var cell = $(this).find("div.datagrid-editable");
			if (cell.length) {
				var ed = $.data(cell[0], "datagrid.editor");
				if (ed.actions.destroy) {
					ed.actions.destroy(ed.target);
				}
				cell.html(ed.oldHtml);
				$.removeData(cell[0], "datagrid.editor");
				cell.removeClass("datagrid-editable");
				cell.css("width", "");
			}
		});
	};
	function _validateRow(_target, _index) {
		var tr = $.data(_target, "datagrid").options.finder.getTr(_target, _index);
		if (!tr.hasClass("datagrid-row-editing")) {
			return true;
		}
		var vbox = tr.find(".validatebox-text");
		vbox.validatebox("validate");
		vbox.trigger("mouseleave");
		var _13f = tr.find(".validatebox-invalid");
		return _13f.length == 0;
	};
	function _getChanges(_target, _type) {
		var _insertedRows = $.data(_target, "datagrid").insertedRows;
		var _deletedRows = $.data(_target, "datagrid").deletedRows;
		var _updatedRows = $.data(_target, "datagrid").updatedRows;
		if (!_type) {
			var rows = [];
			rows = rows.concat(_insertedRows);
			rows = rows.concat(_deletedRows);
			rows = rows.concat(_updatedRows);
			return rows;
		} else {
			if (_type == "inserted") {
				return _insertedRows;
			} else {
				if (_type == "deleted") {
					return _deletedRows;
				} else {
					if (_type == "updated") {
						return _updatedRows;
					}
				}
			}
		}
		return [];
	};
	function _deleteRow(_target, _trIndex) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		var data = _state.data;
		var _insertedRows = _state.insertedRows;
		var _deletedRows = _state.deletedRows;
    var tr=_opts.finder.getTr(_target, _trIndex);
    var _rowIndex = tr.attr('datagrid-row-index');
		$(_target).datagrid("cancelEdit", _trIndex);
		var row = data.rows[_rowIndex];
		if (_arrayFind(_insertedRows, row) >= 0) {
			_arrayRemove(_insertedRows, row);
		} else {
			_deletedRows.push(row);
		}
		_arrayRemove(_state.selectedRows, _opts.idField, data.rows[_rowIndex][_opts.idField]);
		_arrayRemove(_state.checkedRows, _opts.idField, data.rows[_rowIndex][_opts.idField]);
		_opts.view.deleteRow.call(_opts.view, _target, _trIndex);
    //求和
    for (var _fieldName in row)
    {
      var col = $(_target).datagrid("getColumnOption", _fieldName);
      if (col)
      {
        _fieldSum(_target, _fieldName, row[_fieldName], 0);
      }
    }
		if (_opts.height == "auto") {
			_fixRowHeight(_target);
		}
		$(_target).datagrid("getPager").pagination("refresh", {
			total: data.total
		});
	};
	function _insertRow(_target, _param) {
		var data = $.data(_target, "datagrid").data;
		var view = $.data(_target, "datagrid").options.view;
		var _insertedRows = $.data(_target, "datagrid").insertedRows;
		view.insertRow.call(view, _target, _param.index, _param.row);
		_insertedRows.push(_param.row);
		$(_target).datagrid("getPager").pagination("refresh", {
			total: data.total
		});
	};
	function _appendRow(_target, _newRow) {
    var _opts = $.data(_target, "datagrid").options;
    var view = $.data(_target, "datagrid").options.view;
    var _insertedRows = $.data(_target, "datagrid").insertedRows;
    var _gridData = $.data(_target, "datagrid").data;
    function generateNewRow()
    {
      var _newrow = {};
      var columns = _opts.frozenColumns[0];
      for (var i = 0; columns && i < columns.length; i++)
      {
        var _cols = columns[i];
        _newrow[_cols.field] = null;
      }
      var columns = _opts.columns[0];
      for (var i = 0; i < columns.length; i++)
      {
        var _colinfo = columns[i];
        _newrow[_colinfo.field] = (_colinfo.defaultValue!=undefined)?_colinfo.defaultValue : null;
      }
      return _newrow;
    }

    var row = generateNewRow();
    if (_newRow != undefined)
    {
      $.extend(row, _newRow);
    }
    _insertedRows.push(row);
    view.insertRow.call(view, _target, null, row);
		if(_opts.onAfterAppendRow){
      _opts.onAfterAppendRow.call(_target, row);
    }

    return row;

    /*
    var data = $.data(_target, "datagrid").data;
		var view = $.data(_target, "datagrid").options.view;
		var _insertedRows = $.data(_target, "datagrid").insertedRows;
		view.insertRow.call(view, _target, null, row);
		_insertedRows.push(row);
		$(_target).datagrid("getPager").pagination("refresh", {
			total: data.total
		});*/
	};
	function _initRowsData(_target) {
		var _state = $.data(_target, "datagrid");
		var data = _state.data;
		var rows = data.rows;
		var _originalRows = [];
		for (var i = 0; i < rows.length; i++) {
			_originalRows.push($.extend({},
			rows[i]));
		}
		_state.originalRows = _originalRows;
		_state.updatedRows = [];
		_state.insertedRows = [];
		_state.deletedRows = [];
	};
	function _acceptChanges(_target) {
		var data = $.data(_target, "datagrid").data;
		var ok = true;
		for (var i = 0,
		len = data.rows.length; i < len; i++) {
			if (_validateRow(_target, i)) {
				_endEdit(_target, i, false);
			} else {
				ok = false;
			}
		}
		if (ok) {
			_initRowsData(_target);
		}
	};
	function _rejectChanges(_target) {
		var _state = $.data(_target, "datagrid");
		var _opts = _state.options;
		var _originalRows = _state.originalRows;
		var _insertedRows = _state.insertedRows;
		var _deletedRows = _state.deletedRows;
		var _selectedRows = _state.selectedRows;
		var _checkedRows = _state.checkedRows;
		var data = _state.data;
		function _getIDs(_array) {
			var ids = [];
			for (var i = 0; i < _array.length; i++) {
				ids.push(_array[i][_opts.idField]);
			}
			return ids;
		};
		function _doCheckOrSelect(ids, _rowType) {
			for (var i = 0; i < ids.length; i++) {
				var _index = _getRowIndex(_target, ids[i]);
				if (_index >= 0) { (_rowType == "s" ? _selectRow: _checkRow)(_target, _index, true);
				}
			}
		};
		for (var i = 0; i < data.rows.length; i++) {
			_endEdit(_target, i, true);
		}
		var _selectIDs = _getIDs(_selectedRows);
		var _checkedIDs = _getIDs(_checkedRows);
		_selectedRows.splice(0, _selectedRows.length);
		_checkedRows.splice(0, _checkedRows.length);
		data.total += _deletedRows.length - _insertedRows.length;
		data.rows = _originalRows;
		_loadData(_target, data);
		_doCheckOrSelect(_selectIDs, "s");
		_doCheckOrSelect(_checkedIDs, "c");
		_initRowsData(_target);
	};
	function _load(_target, _param) {
    /*
    var _opts = $.data(_target, "datagrid").options;
		if (_param) {
			_opts.queryParams = _param;
		}
		var _params = $.extend({},
		_opts.queryParams);
		if (_opts.pagination) {
			$.extend(_params, {
				page: _opts.pageNumber,
				rows: _opts.pageSize
			});
		}
		if (_opts.sortName) {
			$.extend(_params, {
				sort: _opts.sortName,
				order: _opts.sortOrder
			});
		}
		if (_opts.onBeforeLoad.call(_target, _params) == false) {
			return;
		}
		$(_target).datagrid("loading");
		setTimeout(function() {_ajaxLoad();}, 0);
    */

    var _panel = $.data(_target, "datagrid").panel;
    var _opts = $.data(_target, "datagrid").options;
    if (!_opts.url)
    {
      return;
    }
    var _queryParams = $.extend({}, _opts.queryParams, _param);
    $.extend(_queryParams, {
      pageNo: _opts.pageNumber,
      pageSize: _opts.pageSize
    });
    if (_opts.defaultSortName || _opts.sortName)
    {
      var sortName=_opts.sortName?_opts.sortName:_opts.defaultSortName;
      $.extend(_queryParams, {
        sortname: sortName,
        sortorder: ''//_opts.sortOrder //by xtb
      });
    }
   /* var _sumColumnNames='';
    $.each(_opts.columns[0], function(i, fieldInfo)
    {
      if(fieldInfo.isSum)
      {
        if(_sumColumnNames)_sumColumnNames+=",";
        _sumColumnNames+=fieldInfo.field;
      }
    });*/
   // _queryParams.sumColumnNames=_sumColumnNames;
    _opts.queryParams = _queryParams;

    if (_opts.onBeforeLoad.call(_target, _opts.queryParams) == false)
    {
      return;
    }
    $(_target).datagrid("loading");

    var _params = $.extend({}, _opts.queryParams);
    if (_opts.defaultQuery)
    {
      _params.where += (_params.where ? ' And ' : '') + _opts.defaultQuery;
    }
    /*_params = String.toSerialize(_params);
    _params = { loadinfo: _params };*/
    _params = $.extend(_params, _opts.attachParams);

    setTimeout(function () { _ajaxLoad(); }, 0);
    function _ajaxLoad() {
			var _loadResult = _opts.loader.call(_target, _params,
			function(data) {
				setTimeout(function() {$(_target).datagrid("loaded");}, 0);
				_loadData(_target, data);
				setTimeout(function() {_initRowsData(_target);}, 0);
			},
			function() {
				setTimeout(function() {$(_target).datagrid("loaded");}, 0);
				_opts.onLoadError.apply(_target, arguments);
			});
			if (_loadResult == false) {
				$(_target).datagrid("loaded");
			}
		};
	};
	function _mergeCells(_target, _param) {
		var _opts = $.data(_target, "datagrid").options;
		_param.rowspan = _param.rowspan || 1;
		_param.colspan = _param.colspan || 1;
		if (_param.rowspan == 1 && _param.colspan == 1) {
			return;
		}
		var tr = _opts.finder.getTr(_target, (_param.index != undefined ? _param.index: _param.id));
		if (!tr.length) {
			return;
		}
		var row = _opts.finder.getRow(_target, tr);
		var _170 = row[_param.field];
		var td = tr.find("td[field=\"" + _param.field + "\"]");
		td.attr("rowspan", _param.rowspan).attr("colspan", _param.colspan);
		td.addClass("datagrid-td-merged");
		for (var i = 1; i < _param.colspan; i++) {
			td = td.next();
			td.hide();
			row[td.attr("field")] = _170;
		}
		for (var i = 1; i < _param.rowspan; i++) {
			tr = tr.next();
			if (!tr.length) {
				break;
			}
			var row = _opts.finder.getRow(_target, tr);
			var td = tr.find("td[field=\"" + _param.field + "\"]").hide();
			row[td.attr("field")] = _170;
			for (var j = 1; j < _param.colspan; j++) {
				td = td.next();
				td.hide();
				row[td.attr("field")] = _170;
			}
		}
		_setmergeCellWidth(_target);
	};
	function _autoMergeCells(_target, _param) {
		var dc = $.data(_target, "datagrid").dc;
		var _opts = $.data(_target, "datagrid").options;
		_param = _param || 1;
    var tds = $(dc.body2).find("tbody td:nth-child(" + _param + ")");
    
    var current_td = tds.eq(0);
    var k = 1;
    tds.each(function(index, element) {
      if ($(this).text() == current_td.text() && index != 0) {
        k++;
        $(this).remove();
        current_td.attr("rowspan", k);
        current_td.addClass("datagrid-td-merged");
      } else {
        current_td = $(this);
        k = 1;
      }
    });
		_setmergeCellWidth(_target);
	};

  /*****************************************************
  * 新增函数
  ******************************************************/
  function _fieldSum(_target, _fieldName, _oldValue, _newValue)
  {
    if(_oldValue==undefined)_oldValue=null;
    if(_newValue==undefined)_newValue=null;
    var _opts = $.data(_target, "datagrid").options;
    var _colOpts = _getColumnOption(_target, _fieldName);
    if(!_colOpts || !_colOpts.isSum)return null;

    var _footerRowData=$.data(_target, "datagrid").footer;
    var _sumValue=0;
    if(_footerRowData && _footerRowData.length>0)
    {
      var _footerValue=parseFloat(_footerRowData[0][_fieldName]);
      if(_footerValue!=_footerValue)_footerValue=null;
      _sumValue=(_newValue-_oldValue)+parseFloat(_footerValue);
      _footerRowData[0][_fieldName]=_sumValue;
      _opts.me.reloadFooter();
    }
    return _sumValue;
  }
  function _getFieldSum(_target, _fieldName)
  {
    var _opts = $.data(_target, "datagrid").options;
    var _index = _getColumnOption(_target, _fieldName);
    if(!_index || !_index.isSum)return null;

    var _footerRowData=$.data(_target, "datagrid").footer;
    var _sumValue=0;
    if(_footerRowData && _footerRowData.length>0)
    {
      _sumValue=parseFloat(_footerRowData[0][_fieldName]);
    }
    return _sumValue;
  }

  function _reCalFieldSum(_target, _fieldName)
  {
    var _opts = $.data(_target, "datagrid").options;
    var _fieldInfo = _getColumnOption(_target, _fieldName);
    if(!_fieldInfo || !_fieldInfo.isSum)return null;

    var _rows = $.data(_target, "datagrid").data.rows;
    var _sumValue=0;
    $.each(_rows, function(i, row){
        _sumValue +=parseFloat(row[_fieldName]);
    });
    return _sumValue;
  }

  function _setReadOnly(_target, _isreadonly)
  {
    var _opts = $.data(_target, "datagrid").options;
    if(_isreadonly)
    {
      _opts.editable=false;
    }
    else
    {
      _opts.editable=true;
    }
  }

  function _setFieldReadOnly(_target, _fieldname, _isreadonly)
  {
    var colInfo = _getColumnOption(_target, _fieldname);
    if(colInfo)colInfo.readonly = _isreadonly;
  }

  function _setHideToolBar(_target, _isHide)
  {
    var _opts = $.data(_target, "datagrid").options;
    if(_isHide)
    {
      $('#' + _target.id + '_toolbar').hide();
    }
    else
    {
      $('#' + _target.id + '_toolbar').show();
    }
    _setBodyHeight(_target);
  }
  function _clear(_target)
  {
    var _opts = $.data(_target, "datagrid").options;
    var data = $.data(_target, "datagrid").data;
    data.rows = [];
    $.data(_target, "datagrid").originalRows = [];
    $.data(_target, "datagrid").updatedRows = [];
    $.data(_target, "datagrid").insertedRows = [];
    $.data(_target, "datagrid").deletedRows = [];
    _loadData(_target, []);

    if(_opts.showFooter)
    {
      var _footerData=[];
      var _footerRow={};
      $.each(_opts.columns[0], function(i, colitem)
      {
        if(colitem.isSum)
        {
          _footerRow[colitem.field]=0;
        }
      });
      _footerData.push(_footerRow);
      $(_target).datagrid("reloadFooter", _footerData);
    }
  };

  function _showTableProperties(_target, _td)
  {
    if (_target.properityWin)
    {
      _target.properityWin.window("open");
      return;
    }
    var offset = $(_td).offset();
    var _opts = $.data(_target, "datagrid").options;
    var _properityWin = $.messager.showWin({
      title: '字段属性',
      left: offset.left + $(_td).width() - $(window).scrollLeft(),
      top: offset.top + $(_td).height() - $(window).scrollTop(),
      width: 460,
      height: 400,
      timeout: 5000,
      color: '',
      showType: 'slide',
      bodyStyle: { 'padding': '0px' },
      onResize: function(width, height)
      {
        var panelBody=$(this).window("body");
        if(_target.propDataGrid)_target.propDataGrid.resize({width:panelBody.width(), height:panelBody.height()});
      }
    });
    var propDataGrid = $('<div class="tableproperties"></div>').appendTo(_properityWin).datagrid({
      width: "100%",
      height: "100%",
      border: false,
      title: "",
      isShowColumMenu: false,
      toolbar: null,
      navbar: null,
      striped: true,
      remoteSort:false,
      columns: [[
				{ field: 'fieldname', datatype: 'String', title: '字段名', width: 120, resizable: true, sortable: true },
				{ field: 'remark', datatype: 'String', title: '字段说明', width: 100, resizable: true, sortable: true },
				{ field: 'datatype', datatype: 'String', title: '字段类型', width: 60, resizable: true, sortable: true },
				{ field: 'width', datatype: 'String', title: '宽度', width: 50, resizable: true, sortable: true },
				{ field: 'editor', datatype: 'String', title: '编辑器', width: 80, resizable: true, sortable: true }
			]]
    });
    propDataGrid.loading();
    window.setTimeout(function ()
    {
      $.each(_opts.columns[0], function (i, col)
      {
        var editor='';
        if(col.editor)
        {
          editor=col.editor;
          if(typeof col.editor=="object")
          {
            editor=col.editor.type;
          }
        }
        propDataGrid.datagrid('appendRow', { fieldname: col.field, remark: col.title, datatype: col.datatype, width: col.width, editor: editor });
      });
      _properityWin.resize();
      propDataGrid.loaded();
    }, 0);
    _target.properityWin = _properityWin;
    _target.propDataGrid = propDataGrid;
  }
  //param={sortName:fieldname, sortOrder:'asc', columnmenu:_jme}
  function _orderBy(_target, param)
  {
    var _opts = $.data(_target, "datagrid").options;
    var _panel = $.data(_target, "datagrid").panel;
    var _header = _panel.find("div.datagrid-header");
    var _celldiv = param.columnmenu.parent();

    _opts.sortName = param.sortName;
    _opts.sortOrder = param.sortOrder;

    var c = "datagrid-sort-desc";
    if (param.sortOrder == 'asc')
    {
      c = "datagrid-sort-asc";
    }
    _header.find("div.datagrid-cell").removeClass("datagrid-sort-asc datagrid-sort-desc");
    _celldiv.addClass(c);
    if (_opts.remoteSort)
    {
      _load(_target);
    } else
    {
      var _data = $.data(_target, "datagrid").data;
      _loadData(_target, _data);
    }
    if (_opts.onSortColumn)
    {
      _opts.onSortColumn.call(_target, _opts.sortName, _opts.sortOrder);
    }
  }

  function _resizeColumnWidth(_target, _param)
  {
    var _opts = $.data(_target, "datagrid").options;
		var dc = $.data(_target, "datagrid").dc;
    var col = _getColumnOption(_target, _param.fieldname);
    col.width = _param.width;
    col.auto = false;

    var _headerCell = dc.view.find("div.datagrid-header td[field=\"" + _param.fieldname + "\"] div.datagrid-cell");
    _headerCell._outerWidth(col.width);
    col.boxWidth = parseInt(_headerCell[0].style.width);

    _fixColumnSize(_target, _param.fieldname);
    _fitColumns(_target);
  };

  function _loadInsertData(_target, _data)
  {
    _data=_loadData(_target, _data);
    var _insertedRows = $.data(_target, "datagrid").insertedRows;
    $.each(_data.rows, function(i, row){
      _insertedRows.push(row);
    });
  };

  function _save(_target, _param)
  {
    var _state = $.data(_target, "datagrid");
    var _opts = _state.options;

    var _queryParams = $.extend({}, _opts.queryParams, _param);
    $.extend(_queryParams, {
      pageindex: _opts.pageNumber,
      pagesize: _opts.pageSize
    });
    if (_opts.sortName)
    {
      $.extend(_queryParams, {
        sortname: _opts.sortName,
        sortorder: _opts.sortOrder
      });
    }
    _opts.queryParams = _queryParams;

    if (_opts.onBeforeSave.call(_target, _opts.queryParams) == false)
    {
      return;
    }

    var _params = $.extend({}, _opts.queryParams);
    if (_opts.defaultQuery)
    {
      _params.where += (_params.where ? ' And ' : '') + _opts.defaultQuery;
    }
    _params = String.toSerialize(_params);
    _opts.queryParams["loadInfo"] = _params;
		
		_endEdit(_target, _opts.currentRowInfo.index, false);
		var updatedRow = _getChanges(_target, 'updated');
		var insertedRow = _getChanges(_target, 'inserted');
		var deletedRow = _getChanges(_target, 'deleted');

		for (var i = 0; i < updatedRow.length; i++)
		{
			updatedRow[i]["RecordAction"] = "Update";
		}
		for (var i = 0; i < insertedRow.length; i++)
		{
			insertedRow[i][_opts.idField] = 0;
			insertedRow[i]["RecordAction"] = "Insert";
		}
		for (var i = 0; i < deletedRow.length; i++)
		{
			deletedRow[i]["RecordAction"] = "Delete";
		}
		var rows=updatedRow.concat(insertedRow).concat(deletedRow);

    var _data = String.toSerialize(rows);
    _opts.queryParams["dataList"] = _data;

    $.ajax({
      type: "post",
      url: _opts.saveurl,
      data: _opts.queryParams,
      cache: false,
      dataType: "json",
      beforeSend: function (XMLHttpRequest)
      {
				$(_target).datagrid("loading");
      },
      success: function (data, textStatus)
      {
        //_parserData(_target, data);
        _opts.onAfterSaveSuccess.call(_target, data, textStatus);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown)
      {
        var msg = "保存出错，错误信息：" + XMLHttpRequest.responseText;
        $.messager.showWin({msg:msg, color:'red'});
      },
      complete: function (XMLHttpRequest, textStatus)
      {
        $(_target).datagrid("loaded");
      }
    });
  };

  function _findRecord(_target, _param)
  {
    var _opts = $.data(_target, "datagrid").options;
    var _data = $.data(_target, "datagrid").data;
    var _index = -1;
    var _row = _data.rows.find(_param);

    if (_row)
    {
      _setCurrentRow(_target, _row);
    }
    return _row;
  };

  function _renderFilter(_target, _param)
  {
    var _opts = $.data(_target, "datagrid").options;
    var _data = $.data(_target, "datagrid").data;
		var _insertedRows = $.data(_target, "datagrid").insertedRows;
    var filterRows = _data.rows;
    var renderWhere = _opts.onBeforeRenderFilter.call(_target, _data.rows);
   
    if(renderWhere)
    {
      filterRows = _data.rows.findAll(renderWhere);
      //var t = _insertedRows.findAll(renderWhere);
      //if(t &&t.length)filterRows.push(t);
    }

    return filterRows;
  };

  $.fn.datagrid = function(_options, _param) 
  {
		if (typeof _options == "string") {
			return $.fn.datagrid.methods[_options](this, _param);
		}
		_options = _options || {};
		var me = this.each(function() {
			var _state = $.data(this, "datagrid");
			var _opts;
			if (_state) {
				_opts = $.extend(_state.options, _options);
				_state.options = _opts;
			} else {
				_opts = $.extend({},
				$.extend({},
				$.fn.datagrid.defaults, {
					queryParams: {}
				}), $.fn.datagrid.parseOptions(this), _options, {
         currentRowInfo: {
            index: -1,
            row: null,	// 数据行
            fieldName: null,
            tr: null,
            td: null,
            rowBefore: null, //修改前数据备份数据
            id: null
          }
        });
				$(this).css("width", "").css("height", "");
				var _wrapResult = _wrapGrid(this, _opts.rownumbers);
				if (!_opts.columns) {
					_opts.columns = _wrapResult.columns;
				}
				if (!_opts.frozenColumns) {
					_opts.frozenColumns = _wrapResult.frozenColumns;
				}
				_opts.columns = $.extend(true, [], _opts.columns);
				_opts.frozenColumns = $.extend(true, [], _opts.frozenColumns);
				_opts.view = $.extend({},
				_opts.view);
				$.data(this, "datagrid", {
					options: _opts,
					panel: _wrapResult.panel,
					dc: _wrapResult.dc,
					ss: _wrapResult.ss,
					selectedRows: [],
					checkedRows: [],
					data: {
						total: 0,
						rows: []
					},
					originalRows: [],
					updatedRows: [],
					insertedRows: [],
					deletedRows: []
				});
			}
			_createGrid(this);
			if (!_opts.data) {
				_opts.data = $.fn.datagrid.parseData(this);
			}
      _loadData(this, _opts.data);
      _initRowsData(this);
			_resize(this);
      if (_opts.isInitLoadData && _opts.url)
      {
        _opts.isInitLoadData = false;
        _load(this);
      }
			_bindHeaderEvent(this);
      _options = _opts;
		});

    $.each($.fn.datagrid.methods, function (name, body)
    {
      me[name] = function () 
      {
        var args = Array.prototype.slice.call(arguments);
        return body.apply($.fn.datagrid.methods, [me].concat(args)); 
      }
    });

    _options.me = me;
    return me;
	};
	$.fn.datagrid.methods = {
		options: function(jq) {
			var _opts = $.data(jq[0], "datagrid").options;
			var _optsPanel = $.data(jq[0], "datagrid").panel.panel("options");
			var _opts = $.extend(_opts, {
				width: _optsPanel.width,
				height: _optsPanel.height,
				closed: _optsPanel.closed,
				collapsed: _optsPanel.collapsed,
				minimized: _optsPanel.minimized,
				maximized: _optsPanel.maximized
			});
			return _opts;
		},
		getPanel: function(jq) {
			return $.data(jq[0], "datagrid").panel;
		},
		getPager: function(jq) {
			return $.data(jq[0], "datagrid").panel.children("div.datagrid-pager");
		},
		getColumnFields: function(jq, _frozen) {
			return _getColumnFields(jq[0], _frozen);
		},
		getColumnOption: function(jq, _field) {
			return _getColumnOption(jq[0], _field);
		},
		resize: function(jq, _param) {
			return jq.each(function() {
				_resize(this, _param);
			});
		},
		load: function(jq, _param) {
			return jq.each(function() {
				var _opts = $(this).datagrid("options");
				_opts.pageNumber = 1;
				var _pager = $(this).datagrid("getPager");
				_pager.pagination("refresh", {
					pageNumber: 1
				});
				_load(this, _param);
			});
		},
		reload: function(jq, _param) {
			return jq.each(function() {
        _initRowsData(this);
				_load(this, _param);
			});
		},
		reloadFooter: function(jq, _footer) {
			return jq.each(function() {
				var _opts = $.data(this, "datagrid").options;
				var dc = $.data(this, "datagrid").dc;
				if (_footer) {
					$.data(this, "datagrid").footer = _footer;
				}
				if (_opts.showFooter) {
					_opts.view.renderFooter.call(_opts.view, this, dc.footer2, false);
					_opts.view.renderFooter.call(_opts.view, this, dc.footer1, true);
					if (_opts.view.onAfterRender) {
						_opts.view.onAfterRender.call(_opts.view, this);
					}
					$(this).datagrid("fixRowHeight");
				}
			});
		},
		loading: function(jq) {
			return jq.each(function() {
				var _opts = $.data(this, "datagrid").options;
				$(this).datagrid("getPager").pagination("loading");
				if (_opts.loadMsg) {
					var _1c3 = $(this).datagrid("getPanel");
					if (!_1c3.children("div.datagrid-mask").length) {
						$("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(_1c3);
						var msg = $("<div class=\"datagrid-mask-msg\" style=\"display:block;left:50%\"></div>").html(_opts.loadMsg).appendTo(_1c3);
						msg.css("marginLeft", -msg.outerWidth() / 2);
					}
				}
			});
		},
		loaded: function(jq) {
			return jq.each(function() {
				$(this).datagrid("getPager").pagination("loaded");
				var _panel = $(this).datagrid("getPanel");
				_panel.children("div.datagrid-mask-msg").remove();
				_panel.children("div.datagrid-mask").remove();
			});
		},
		fitColumns: function(jq) {
			return jq.each(function() {
				_fitColumns(this);
			});
		},
		fixColumnSize: function(jq, _field) {
			return jq.each(function() {
				_fixColumnSize(this, _field);
			});
		},
		fixRowHeight: function(jq, _index) {
			return jq.each(function() {
				_fixRowHeight(this, _index);
			});
		},
		freezeRow: function(jq, _index) {
			return jq.each(function() {
				_freezeRow(this, _index);
			});
		},
		autoSizeColumn: function(jq, _field) {
			return jq.each(function() {
				_autoSizeColumn(this, _field);
			});
		},
		loadData: function(jq, data) {
			return jq.each(function() {
				_loadData(this, data);
				_initRowsData(this);
			});
		},
		getData: function(jq) {
			return $.data(jq[0], "datagrid").data;
		},
		getRows: function(jq) {
			return $.data(jq[0], "datagrid").data.rows;
		},
		getFooterRows: function(jq) {
			return $.data(jq[0], "datagrid").footer;
		},
		getRowIndex: function(jq, id) {
			return _getRowIndex(jq[0], id);
		},
		getTrIndex: function(jq, id) {
			return _getTrIndex(jq[0], id);
		},
		getChecked: function(jq) {
			return _getChecked(jq[0]);
		},
		getSelected: function(jq) {
			var rows = _getSelections(jq[0]);
			return rows.length > 0 ? rows[0] : null;
		},
		getSelections: function(jq) {
			return _getSelections(jq[0]);
		},
		clearSelections: function(jq) {
			return jq.each(function() {
				var _selectedRows = $.data(this, "datagrid").selectedRows;
				_selectedRows.splice(0, _selectedRows.length);
				_clearSelections(this);
			});
		},
    clear: function (jq)
    {
      return jq.each(function ()
      {
        _clear(this);
      });
    },
		clearChecked: function(jq) {
			return jq.each(function() {
				var _checkedRows = $.data(this, "datagrid").checkedRows;
				_checkedRows.splice(0, _checkedRows.length);
				_clearChecked(this);
			});
		},
		scrollTo: function(jq, _index) {
			return jq.each(function() {
				_scrollTo(this, _index);
			});
		},
		highlightRow: function(jq, _index) {
			return jq.each(function() {
				_highlightRow(this, _index);
				_scrollTo(this, _index);
			});
		},
		selectAll: function(jq) {
			return jq.each(function() {
				_selectAll(this);
			});
		},
		unselectAll: function(jq) {
			return jq.each(function() {
				_clearSelections(this);
			});
		},
		selectRow: function(jq, _index) {
			return jq.each(function() {
				_selectRow(this, _index);
			});
		},
		selectRecord: function(jq, id) {
			return jq.each(function() {
				var _opts = $.data(this, "datagrid").options;
				if (_opts.idField) {
					var _rowIndex = _getRowIndex(this, id);
					if (_rowIndex >= 0) {
						$(this).datagrid("selectRow", _rowIndex);
					}
				}
			});
		},
		unselectRow: function(jq, _index) {
			return jq.each(function() {
				_unselectRow(this, _index);
			});
		},
		checkRow: function(jq, _index) {
			return jq.each(function() {
				_checkRow(this, _index);
			});
		},
		uncheckRow: function(jq, _index) {
			return jq.each(function() {
				_uncheckRow(this, _index);
			});
		},
		checkAll: function(jq) {
			return jq.each(function() {
				_checkAll(this);
			});
		},
		uncheckAll: function(jq) {
			return jq.each(function() {
				_clearChecked(this);
			});
		},
		beginEdit: function(jq, _index) {
			return jq.each(function() {
				_beginEdit(this, _index);
			});
		},
		endEdit: function(jq, _index) {
			return jq.each(function() {
				_endEdit(this, _index, false);
			});
		},
		cancelEdit: function(jq, _index) {
			return jq.each(function() {
				_endEdit(this, _index, true);
			});
		},
		getEditors: function(jq, _index) {
			return _getEditors(jq[0], _index);
		},
		getEditor: function(jq, _param) {
			return _getEditor(jq[0], _param);
		},
		refreshRow: function(jq, _index) {
			return jq.each(function() {
				var _opts = $.data(this, "datagrid").options;
				_opts.view.refreshRow.call(_opts.view, this, _index);
			});
		},
		refresh: function(jq) {
			return jq.each(function() {
				var _state = $.data(this, "datagrid");
        _initRowsData(this);
				_loadData(this, _state.data);
			});
		},
		validateRow: function(jq, _index) {
			return _validateRow(jq[0], _index);
		},
		updateRow: function(jq, _param) {
      window.isModify=true;
      var _p=[];
      if(arguments.length==2)
      {
        _p=_p.concat(_param.index, _param.row);
      }
      else
      {
        var args = Array.prototype.slice.call(arguments);
        _p=_p.concat(args.slice(1));
      }
			return jq.each(function() {
        var _opts = $.data(this, "datagrid").options;
        _p.insert(0,this);
        _opts.view.updateRow.apply(_opts.view, _p);
			});
		},
		appendRow: function(jq, row) {
			return _appendRow(jq[0], row);
		},
		insertRow: function(jq, _param) {
			return jq.each(function() {
				_insertRow(this, _param);
			});
		},
		deleteRow: function(jq, _index) {
			return jq.each(function() {
				_deleteRow(this, _index);
			});
		},
		getChanges: function(jq, _type) {
			return _getChanges(jq[0], _type);
		},
		acceptChanges: function(jq) {
			return jq.each(function() {
				_acceptChanges(this);
			});
		},
		rejectChanges: function(jq) {
			return jq.each(function() {
				_rejectChanges(this);
			});
		},
		mergeCells: function(jq, _param) {
			return jq.each(function() {
				_mergeCells(this, _param);
			});
		},
		autoMergeCells: function(jq, _param) {
			return jq.each(function() {
				_autoMergeCells(this, _param);
			});
		},
		showColumn: function(jq, _field) {
			return jq.each(function() {
				var _panel = $(this).datagrid("getPanel");
				_panel.find("td[field=\"" + _field + "\"]").show();
				$(this).datagrid("getColumnOption", _field).hidden = false;
				$(this).datagrid("fitColumns");
			});
		},
		hideColumn: function(jq, _field) {
			return jq.each(function() {
				var _1e1 = $(this).datagrid("getPanel");
				_1e1.find("td[field=\"" + _field + "\"]").hide();
				$(this).datagrid("getColumnOption", _field).hidden = true;
				$(this).datagrid("fitColumns");
			});
		},
    insertToolBar: function (jq, _options)	//插入按钮
    {
      return jq.each(function ()
      {
        var _opts = $.data(this, "datagrid").options;
        _opts.toolbarer.insertToolBar(this, _options);
      });
    },
    orderBy: function (jq, _param)
    {
      return jq.each(function ()
      {
        _orderBy(this, _param);
      });
    },
    //获得所有查询条件
    getWhere: function (jq)
    {
      var _where='';
      var _navWhere = _navbarer.getWhere(jq[0]);
      var _tabWhere = _tabbarer.getWhere(jq[0]);
      var _quickWhere = this.getQuickWhere(jq);
      var _columnMenuWhere = this.getColumnMenuWhere(jq);
      _where=_navWhere;
      if(_tabWhere)
      {
        if(_where)_where+=" And ";
        _where+=_tabWhere;
      }
      if(_quickWhere)
      {
        if(_where)_where+=" And ";
        _where+=_quickWhere;
      }
      if(_columnMenuWhere)
      {
        if(_where)_where+=" And ";
        _where+=_columnMenuWhere;
      }
      return _where;
    },
    //获得quickSearch条件
    getQuickWhere: function (jq)
    {
      var _where='';
      var _target=jq[0];
      var _opts = $.data(_target, "datagrid").options;
      var keys = _opts.QueryKeys?_opts.QueryKeys.split(','):'';
      var keyValue = $.trim($('#' + _target.id + '_quicksearch_keyword').val());
      if(keyValue)
      {
          for(var i=0; i<keys.length;i++)
          {
            var key = keys[i];
            if(key)
            {
              if(_where)_where+=' or ';
              _where+=key+' Like \'%'+keyValue+'%\'';
            }
          }
      }
      if(_where)_where="("+_where+")";
      return _where;
    },
    //获得ColumnMenu条件
    getColumnMenuWhere: function (jq)
    {
      var _target=jq[0];
      var _panel = $.data(_target, "datagrid").panel;
      var _opts = $.data(_target, "datagrid").options;
      var _header = _panel.find("div.datagrid-header");
			var td=_header.find("td:has(div[class='datagrid-columnm-searchtip show'])").not(":hidden").first();
			if(!td.length)return '';

      var jcolumnmenu = td[0].jcolumnmenu;
      var _where=jcolumnmenu.getWhere();

      return _where;
    },
    //获得Navs条件
    getNavsWhere: function (jq)
    {
      return _navbarer.getWhere(jq[0]);
    },
    //获得Tab条件
    getTabsWhere: function (jq)
    {
      return _tabbarer.getWhere(jq[0]);
    },
    //获得导航栏所有属性集合
    getNavItems: function (jq)
    {
      return _navbarer.getNavItems(jq[0]);
    },
    //获得字段求和值
    getFieldSum: function (jq, _fieldName)
    {
      return _getFieldSum(jq[0], _fieldName);
    },
    //重新计算字段求和值
    reCalFieldSum: function (jq, _fieldName)
    {
      return _reCalFieldSum(jq[0], _fieldName);
    },
    //设为只读
    setReadOnly: function (jq, _isreadonly)
    {
      return _setReadOnly(jq[0], _isreadonly);
    },
    //字段设为只读
    setFieldReadOnly: function (jq, _fieldname, _isreadonly)
    {
      return _setFieldReadOnly(jq[0], _fieldname, _isreadonly);
    },
    //隐藏工具栏
    setHideToolBar: function (jq, _isHide)
    {
      return _setHideToolBar(jq[0], _isHide);
    },
    //设定列宽
    resizeColumnWidth: function (jq, _param)
    {
      return jq.each(function ()
      {
        _resizeColumnWidth(this, _param);
      });
    },
		save: function (jq, _param)
		{
			_save(jq[0], _param);
		},
    loadInsertData: function (jq, data)
    {
      return jq.each(function ()
      {
        _loadInsertData(this, data);
      });
    },
    setCurrentRow: function (jq, _param)	//设为当前行
    {
        return _setCurrentRow(jq[0], _param);
    },
    findRecord: function (jq, _param)
    {
      return _findRecord(jq[0], _param);
    },
    renderFilter: function (jq, _param) //显示数据过滤
    {
      return _renderFilter(jq[0], _param);
    }
	};
	$.fn.datagrid.parseOptions = function(_target) {
		var t = $(_target);
		return $.extend({},
		$.fn.panel.parseOptions(_target), $.parser.parseOptions(_target, ["url", "toolbar", "idField", "sortName", "sortOrder", "pagePosition", "resizeHandle", {
			fitColumns: "boolean",
			autoRowHeight: "boolean",
			striped: "boolean",
			nowrap: "boolean"
		},
		{
			rownumbers: "boolean",
			singleSelect: "boolean",
			checkOnSelect: "boolean",
			selectOnCheck: "boolean"
		},
		{
			pagination: "boolean",
			pageSize: "number",
			pageNumber: "number"
		},
		{
			multiSort: "boolean",
			remoteSort: "boolean",
			showHeader: "boolean",
			showFooter: "boolean"
		},
		{
			scrollbarSize: "number"
		}]), {
			pageList: (t.attr("pageList") ? eval(t.attr("pageList")) : undefined),
			loadMsg: (t.attr("loadMsg") != undefined ? t.attr("loadMsg") : undefined),
			rowStyler: (t.attr("rowStyler") ? eval(t.attr("rowStyler")) : undefined)
		});
	};
	$.fn.datagrid.parseData = function(_target) {
    var _state = $.data(_target, "datagrid");
    var _opts = _state.options;
		var t = $(_target);
		var data = {
			total: 0,
			rows: []
		};
    if(_opts.showFooter)
    {
      var _footerData=[];
      var _footerRow={};
      $.each(_opts.columns[0], function(i, colitem)
      {
        if(colitem.isSum)
        {
          _footerRow[colitem.field]=0;
        }
      });
      _footerData.push(_footerRow);
      data.footer=_footerData;
    }
		var _cols = t.datagrid("getColumnFields", true).concat(t.datagrid("getColumnFields", false));
		t.find("tbody tr").each(function() {
			data.total++;
			var row = {};
			$.extend(row, $.parser.parseOptions(this, ["iconCls", "state"]));
			for (var i = 0; i < _cols.length; i++) {
				row[_cols[i]] = $(this).find("td:eq(" + i + ")").html();
			}
			data.rows.push(row);
		});
		return data;
	};
	var _editors = {
		text: {
      target: null,
			init: function(_container, _param) {
				var _input = $("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_container);
				this.target=_input;
				return _input;
			},
			getValue: function(_target) {
				return $(_target).val();
			},
			setValue: function(_target, _param) {
				$(_target).val(_param);
			},
			resize: function(_target, _param) {
				$(_target)._outerWidth(_param)._outerHeight(22);
			}
		},
		textarea: {
			init: function(_container, _param) {
        _container.closest("div").css({"position":"relative", "overflow":"visible"});
        _container.closest("table").css({"position":"absolute", "top": "-10px", "overflow":"auto"});
				var _input = $("<textarea class=\"datagrid-editable-input\"></textarea>").appendTo(_container).height(90);
        _input.closest("table").width(300);
				return _input;
			},
			getValue: function(_target) {
				return $(_target).val();
			},
			setValue: function(_target, _param) {
				$(_target).val(_param);
			},
			resize: function(_target, _param) {
				$(_target)._outerWidth(300);
			}
		},
		checkbox: {
			init: function(_186, _187) {
				var _188 = $("<input type=\"checkbox\">").appendTo(_186);
				_188.val(_187.on);
				_188.attr("offval", _187.off);
				return _188;
			},
			getValue: function(_189) {
				if ($(_189).is(":checked")) {
					return $(_189).val();
				} else {
					return $(_189).attr("offval");
				}
			},
			setValue: function(_18a, _18b) {
				var _18c = false;
				if ($(_18a).val() == _18b) {
					_18c = true;
				}
				$(_18a)._propAttr("checked", _18c);
			}
		},
		numberbox: {
			target: null,
			init: function (_container, _param)
			{
				var _input = $("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_container);
				_input.numberbox(_param);
				this.target = _input;
				return _input;
			},
			destroy: function(_190) {
				$(_190).numberbox("destroy");
			},
			getValue: function(_191) {
				$(_191).blur();
				return $(_191).numberbox("getValue");
			},
			setValue: function(_192, _193) {
				$(_192).numberbox("setValue", _193);
			},
			resize: function(_194, _195) {
				$(_194)._outerWidth(_195)._outerHeight(22);
			}
		},
		validatebox: {
			init: function(_196, _197) {
				var _198 = $("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_196);
				_198.validatebox(_197);
				return _198;
			},
			destroy: function(_199) {
				$(_199).validatebox("destroy");
			},
			getValue: function(_19a) {
				return $(_19a).val();
			},
			setValue: function(_19b, _19c) {
				$(_19b).val(_19c);
			},
			resize: function(_19d, _19e) {
				$(_19d)._outerWidth(_19e)._outerHeight(22);
			}
		},
		datebox: {
			init: function(_target, _param) {
				var _1a1 = $("<input type=\"text\">").appendTo(_target);
				_1a1.datebox(_param);
				return _1a1;
			},
			destroy: function(_target) {
				$(_target).datebox("destroy");
			},
			getValue: function(_target) {
				return $(_target).datebox("getValue");
			},
			setValue: function(_target, _value) {
        if(_value)_value=Globals.formatDate(_value, 'yyyy-MM-dd');
				$(_target).datebox("setValue", _value);
			},
			resize: function(_1a6, _1a7) {
				$(_1a6).datebox("resize", _1a7);
			}
		},
		datetimebox: {
			init: function(_target, _opts) {
				var _1a1 = $("<input type=\"text\">").appendTo(_target);
				_1a1.datetimebox(_opts);
				return _target;
			},
			destroy: function(_target) {
				$(_target).find('input').datetimebox("destroy");
			},
			getValue: function(_target) {
				return $(_target).find('input').datetimebox("getValue");
			},
			setValue: function(_target, _value) {
				$(_target).find('input').datetimebox("setValue", _value);
			},
			resize: function(_target, _params) {
				$(_target).find('input').datetimebox("resize", _params);
			}
		},
		combobox: {
			target: null,
			init: function(_container, _options, _target) {
				var _opts = $.data(_target, "datagrid").options;
				if(_options.fieldRelation)
				{
					_options.relationer = {	//多列数据操作器
						dataRow: _opts.currentRowInfo.row,
						setValue: function (fieldName, value)
						{
							_opts.currentRowInfo.row[fieldName] = value;
							var td = _opts.currentRowInfo.tr.children("td[field='" + fieldName + "']");
							if(td.find(".datagrid-editable").length<=0)
							{
								_opts.currentRowInfo.tr.children("td[field='" + fieldName + "']").children().html(value);
							}
							else
							{
								var _editor=_getEditor(_target, {index: _opts.currentRowInfo.index, field: fieldName});
								_editor.actions.setValue(_editor.target, value);
							}
						}
					}
				}

				var _input = $("<input type=\"text\">").appendTo(_container);
				_input.combobox(_options || {});
				this.target=_input;
				return _input;
			},
			destroy: function(_target) {
				$(_target).combobox("destroy");
			},
			getValue: function(_target) {
				var _opts = $(_target).combobox("options");
				if (_opts.multiple) {
					return $(_target).combobox("getValues").join(_opts.separator);
				} else {
					return $(_target).combobox("getValue");
				}
			},
			setValue: function(_target, _param) {
				var _opts = $(_target).combobox("options");
				if (_opts.multiple) {
					if (_param) {
						$(_target).combobox("setValues", _param.split(_opts.separator));
					} else {
						$(_target).combobox("clear");
					}
				} else {
					$(_target).combobox("setValue", _param);
				}
			},
			resize: function(_target, _param) {
				$(_target).combobox("resize", _param);
			}
		},
    combogrid: {
			target: null,
      init: function (_container, _options, _target)
      {
				var _opts = $.data(_target, "datagrid").options;
				if(_options.fieldRelation)
				{
					_options.relationer = {	//多列数据操作器
						tr: _opts.currentRowInfo.tr,
						dataRow: _opts.currentRowInfo.row,
						setValue: function (fieldName, value)
						{
              var _opts = $.data(_target, "datagrid").options;
							_opts.currentRowInfo.row[fieldName] = value;
							var td = _opts.currentRowInfo.tr.children("td[field='" + fieldName + "']");
							if(td.find(".datagrid-editable").length<=0)
							{
								_opts.currentRowInfo.tr.children("td[field='" + fieldName + "']").children().html(value);
							}
							else
							{
								var _editor=_getEditor(_target, {index: _opts.currentRowInfo.index, field: fieldName});
								_editor.actions.setValue(_editor.target, value);
							}
						}
					}
				}

				var _input = $("<input type=\"text\">").appendTo(_container);
        _input.combogrid(_options || {});
				this.target=_input;
        return _input;
      },
      destroy: function (_target)
      {
        $(_target).combogrid("destroy");
      },
      getValue: function (_target)
      {
        return $(_target).combogrid("getValue");
      },
      setValue: function (_target, _param)
      {
        $(_target).combogrid("setValue", _param);
      },
      resize: function (_target, _param)
      {
        $(_target).combogrid("resize", _param);
      }
    },
		combotree: {
			target: null,
			init: function(_container, _options, _target) {
				var _opts = $.data(_target, "datagrid").options;
				if(_options.fieldRelation)
				{
					_options.relationer = {	//多列数据操作器
						tr: _opts.currentRowInfo.tr,
						dataRow: _opts.currentRowInfo.row,
						setValue: function (fieldName, value)
						{
              var _opts = $.data(_target, "datagrid").options;
							_opts.currentRowInfo.row[fieldName] = value;
							var td = _opts.currentRowInfo.tr.children("td[field='" + fieldName + "']");
							if(td.find(".datagrid-editable").length<=0)
							{
								_opts.currentRowInfo.tr.children("td[field='" + fieldName + "']").children().html(value);
							}
							else
							{
								var _editor=_getEditor(_target, {index: _opts.currentRowInfo.index, field: fieldName});
								_editor.actions.setValue(_editor.target, value);
							}
						}
					}
				}

				var _input = $("<input type=\"text\">").appendTo(_container);
				_input.combotree(_options);
				return _input;
			},
			destroy: function(_target) {
				$(_target).combotree("destroy");
			},
			getValue: function(_target) {
				return $(_target).combotree("getValue");
			},
			setValue: function(_target, _param) {
				$(_target).combotree("setValue", _param);
			},
			resize: function(_target, _param) {
				$(_target).combotree("resize", _param);
			}
		}
	};
	var _view = {
		render: function(_target, _container, _frozen) {
			var _state = $.data(_target, "datagrid");
			var _opts = _state.options;
			var rows = _state.data.rows;
			var _fields = $(_target).datagrid("getColumnFields", _frozen);
			if (_frozen) {
				if (! (_opts.rownumbers || (_opts.frozenColumns && _opts.frozenColumns.length))) {
					return;
				}
			}
			var _dataTable = ["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
      var _renderRows = _renderFilter(_target);
			for (var i = 0; i < _renderRows.length; i++) {
				var css = _opts.rowStyler ? _opts.rowStyler.call(_target, i, _renderRows[i]) : "";
				var _classValue = "";
				var _styleValue = "";
				if (typeof css == "string") {
					_styleValue = css;
				} else {
					if (css) {
						_classValue = css["class"] || "";
						_styleValue = css["style"] || "";
					}
				}
				var cls = "class=\"datagrid-row " + (i % 2 && _opts.striped ? "datagrid-row-alt ": " ") + _classValue + "\"";
				var _rowStyler = _styleValue ? "style=\"" + _styleValue + "\"": "";
				var _rowId = _state.rowIdPrefix + "-" + (_frozen ? 1 : 2) + "-" + i;
        var _rowIndex = _getRowIndex(_target, _renderRows[i]);

				_dataTable.push("<tr id=\"" + _rowId + "\" datagrid-tr-index=\"" + i + "\" datagrid-row-index=\"" + _rowIndex + "\" " + cls + " " + _rowStyler + ">");
				_dataTable.push(this.renderRow.call(this, _target, _fields, _frozen, i, _renderRows[i]));
				_dataTable.push("</tr>");
			}
			_dataTable.push("</tbody></table>");
			$(_container).html(_dataTable.join(""));
      $('table>tbody>tr', _container).each(function(i, tr){
        $(this).data('relationRow', _renderRows[i]);
      });
		},
		renderFooter: function(_target, _container, _frozen) {
			var _opts = $.data(_target, "datagrid").options;
			var rows = $.data(_target, "datagrid").footer || [];
			var _fields = $(_target).datagrid("getColumnFields", _frozen);
			var _footerDataTable = ["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
			for (var i = 0; i < rows.length; i++) {
				_footerDataTable.push("<tr class=\"datagrid-row\" datagrid-tr-index=\"" + i + "\" datagrid-row-index=\"" + i + "\">");
				_footerDataTable.push(this.renderRow.call(this, _target, _fields, _frozen, i, rows[i], true));
				_footerDataTable.push("</tr>");
			}
			_footerDataTable.push("</tbody></table>");
			$(_container).html(_footerDataTable.join(""));
		},
		renderRow: function(_target, _fields, _frozen, _rowIndex, _rowData, _isFooter) {
			var _opts = $.data(_target, "datagrid").options;
			var cc = [];
			if (_frozen && _opts.rownumbers) {
				var _rowNumber = _rowIndex + 1;
				if (_opts.pagination) {
					_rowNumber += (_opts.pageNumber - 1) * _opts.pageSize;
				}
				cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">" + _rowNumber + "</div></td>");
			}
			for (var i = 0; i < _fields.length; i++) {
				var _field = _fields[i];
				var col = $(_target).datagrid("getColumnOption", _field);
				if (col) {
					var _ccData = _rowData[_field];
          _ccData = typeof(_ccData)=="string"?_ccData.replace(/</ig, '&lt;').replace(/>/ig, '&gt;'):_ccData;//by xtb
					var css = col.styler ? (col.styler(_ccData, _rowData, _rowIndex, _isFooter) || "") : "";
					var _classValue = "";
					var _styleValue = "";
					if (typeof css == "string") {
						_styleValue = css;
					} else {
						if (cc) {
							_classValue = css["class"] || "";
							_styleValue = css["style"] || "";
						}
					}
					var cls = _classValue ? "class=\"" + _classValue + "\"": "";
					var _stylerResult = col.hidden ? "style=\"display:none;" + _styleValue + "\"": (_styleValue ? "style=\"" + _styleValue + "\"": "");
					cc.push("<td field=\"" + _field + "\" " + cls + " " + _stylerResult + ">");
					if (col.checkbox) {
						var _stylerResult = "";
					} else {
						var _stylerResult = _styleValue;
						if (col.align) {
							_stylerResult += ";text-align:" + col.align + ";";
						}
						if (!_opts.nowrap) {
							_stylerResult += ";white-space:normal;height:auto;";
						} else {
							if (_opts.autoRowHeight) {
								_stylerResult += ";height:auto;";
							}
						}
					}
					var attr = col.attributer ? (col.attributer(_ccData, _rowData, _rowIndex, _isFooter) || "") : "";
					cc.push("<div style=\"" + _stylerResult + "\" " + attr);
					cc.push(col.checkbox ? "class=\"datagrid-cell-check\"": "class=\"datagrid-cell " + col.cellClass + "\"");
					cc.push(">");
					if (col.checkbox) {
						cc.push("<input type=\"checkbox\" name=\"" + _field + "\" value=\"" + (_ccData != undefined ? _ccData: "") + "\">");
					} else {
						if(col.formatStyle)
						{
							switch (col.datatype)
							{
								case 'Int16':
								case 'Int32':
								case 'Int64':
								case 'Decimal':
								case 'Double':
								case 'Single':
								case 'Byte':
								case 'ByteArray':
									_ccData = Globals.formatNumber(_ccData, col.formatStyle);
									break;
								case 'Date':
								case 'Time':
								case 'DateTime':
									_ccData = Globals.formatDate(_ccData, col.formatStyle);
									break;
							}
						}
            if (col.formatter)
            {
              _ccData = col.formatter(_ccData, _rowData, _rowIndex, _isFooter);
            }
            if ($.isFunction(col.onRefresh))
            {
              _ccData = col.onRefresh(_ccData, _rowData, _rowIndex, _isFooter);
            }
            cc.push(_ccData);
            /*
						if (col.formatter) {
							cc.push(col.formatter(_ccData, _rowData, _rowIndex));
						} else {
							cc.push(_ccData);
						}*/
					}
					cc.push("</div>");
					cc.push("</td>");
				}
			}
			return cc.join("");
		},
		refreshRow: function(_target, _index) {
			var _opts = $.data(_target, "datagrid").options;
      var newRow = {};
      var _fields = $(_target).datagrid("getColumnFields", true).concat($(_target).datagrid("getColumnFields", false));
      for (var i = 0; i < _fields.length; i++)
      {
        newRow[_fields[i]] = undefined;
      }
      //var rows = $(_target).datagrid("getRows");
      //$.extend(row, rows[_index]);
      var _currentRow = _opts.finder.getRow(_target, _index);
      $.extend(newRow, _currentRow);
      this.updateRow.call(this, _target, _index, newRow);
		},
		updateRow: function(_target, _index, _rowData) {
			var _opts = $.data(_target, "datagrid").options;
      var _selectedRows = $.data(_target, "datagrid").selectedRows;
      var _updatedRows = $.data(_target, "datagrid").updatedRows;
      var _insertedRows = $.data(_target, "datagrid").insertedRows;
			var dc = $.data(_target, "datagrid").dc;
			var rows = $(_target).datagrid("getRows");
      var _currentRow = _opts.finder.getRow(_target, _index);
      //重新求和
      for (var _fieldName in _rowData)
      {
        var _colOpts = $(_target).datagrid("getColumnOption", _fieldName);
        if (_colOpts && _colOpts.isSum)
        {
          _fieldSum(_target, _fieldName, _currentRow[_fieldName], _rowData[_fieldName]);
          _currentRow[_fieldName] = _rowData[_fieldName];
        }
      }
      $.extend(_currentRow, _rowData);
			var css = _opts.rowStyler ? _opts.rowStyler.call(_target, _index, _currentRow) : "";
			var _classValue = "";
			var _styleValue = "";
			if (typeof css == "string") {
				_styleValue = css;
			} else {
				if (css) {
					_classValue = css["class"] || "";
					_styleValue = css["style"] || "";
				}
			}
			var _classValue = "datagrid-row " + (_index % 2 && _opts.striped ? "datagrid-row-alt ": " ") + _classValue;
			function _checkedCell(_frozen) {
				var _fields = $(_target).datagrid("getColumnFields", _frozen);
				var tr = _opts.finder.getTr(_target, _index, "body", (_frozen ? 1 : 2));
				var _isChecked = tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
				tr.html(this.renderRow.call(this, _target, _fields, _frozen, _index, _currentRow));
				tr.attr("style", _styleValue).attr("class", _classValue);
        if(_index==_opts.currentRowInfo.index)
        {
          tr.addClass("datagrid-row-current");
          if(_frozen)
          {
            tr.find(".datagrid-cell-rownumber").addClass("datagrid-cell-rownumber-current");
          }
        }
        if(_frozen)
        {
          dc.view1.find("tr[datagrid-tr-index=" + _index + "] .datagrid-cell-rownumber");
        }
				if (_isChecked) {
					tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked", true);
				}
        if(_selectedRows.indexOf(_currentRow)>=0)
        {
          tr.addClass("datagrid-row-selected");
        }
			};
			_checkedCell.call(this, true);
			_checkedCell.call(this, false);
      if (_insertedRows.indexOf(_currentRow) == -1)
      {
        if (_updatedRows.indexOf(_currentRow) == -1)
        {
          _updatedRows.push(_currentRow);
        }
      }
			$(_target).datagrid("reloadFooter");
			$(_target).datagrid("fixRowHeight", _index);
		},
		insertRow: function(_target, _index, row) {
			var _state = $.data(_target, "datagrid");
			var _opts = _state.options;
			var dc = _state.dc;
			var data = _state.data;

			if (_index == undefined || _index == null) {
				_index = dc.body2.find('tr').length;
			}
			if (_index > dc.body2.find('tr').length) {
				_index = dc.body2.find('tr').length;
			}
      //求和
      for (var _fieldName in row)
      {
        var col = $(_target).datagrid("getColumnOption", _fieldName);
        if (col)
        {
          _fieldSum(_target, _fieldName, 0, row[_fieldName]);
        }
      }
			function _resetRowAlt(_frozen) {
				var _viewtype = _frozen ? 1 : 2;
				for (var i = dc.body2.find('tr').length - 1; i >= _index; i--) {
					var tr = _opts.finder.getTr(_target, i, "body", _viewtype);
					tr.attr("datagrid-tr-index", i + 1);
					tr.attr("datagrid-row-index", i + 1);
					tr.attr("id", _state.rowIdPrefix + "-" + _viewtype + "-" + (i + 1));
					if (_frozen && _opts.rownumbers) {
						var _rowNumber = i + 2;
						if (_opts.pagination) {
							_rowNumber += (_opts.pageNumber - 1) * _opts.pageSize;
						}
						tr.find("div.datagrid-cell-rownumber").html(_rowNumber);
					}
					if (_opts.striped) {
						tr.removeClass("datagrid-row-alt").addClass((i + 1) % 2 ? "datagrid-row-alt": "");
					}
				}
			};
			function _inertTR(_frozen) {
				var _viewtype = _frozen ? 1 : 2;
				var _fields = $(_target).datagrid("getColumnFields", _frozen);
				var _rowId = _state.rowIdPrefix + "-" + _viewtype + "-" + _index;
        var _rowIndex = data.rows.length;
				var tr = "<tr id=\"" + _rowId + "\" class=\"datagrid-row\" datagrid-tr-index=\"" + _index + "\" datagrid-row-index=\"" + _rowIndex + "\"></tr>";
				if (_index >= dc.body2.find('tr').length) {
					if (data.rows.length) {
						var lastTr = _opts.finder.getTr(_target, "", "last", _viewtype);
            if(lastTr && lastTr.length)
            {
              $(tr).insertAfter(lastTr).data('relationRow', row);
            }
            else
            {
              var cc = _frozen ? dc.body1: dc.body2;
              $(tr).appendTo(cc.find('tbody')).data('relationRow', row);
            }
					} else {
						var cc = _frozen ? dc.body1: dc.body2;
						cc.html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>" + tr + "</tbody></table>").find('tr').data('relationRow', row);
					}
				} else {
					_opts.finder.getTr(_target, _index + 1, "body", _viewtype).before(tr);
				}
			};
			_resetRowAlt.call(this, true);
			_resetRowAlt.call(this, false);
			_inertTR.call(this, true);
			_inertTR.call(this, false);
			data.total += 1;
      var _rowIndex = data.rows.length;
			data.rows.splice(_rowIndex, 0, row);
			this.refreshRow.call(this, _target, _index);
		},
		deleteRow: function(_target, _trIndex) {
			var _state = $.data(_target, "datagrid");
			var _opts = _state.options;
			var data = _state.data;
      _trIndex=parseInt(_trIndex);
			function _resetRowAlt(_frozen) {
				var _viewtype = _frozen ? 1 : 2;
        var trCount = (_frozen == 1 ? _state.dc.body1: _state.dc.body2).find("tr.datagrid-row").length;
				for (var i = _trIndex + 1; i <= trCount; i++) {
					var tr = _opts.finder.getTr(_target, i, "body", _viewtype);
          var _rowIndex = tr.attr('datagrid-row-index');
					tr.attr("datagrid-tr-index", i - 1);
					tr.attr("datagrid-row-index", _rowIndex - 1);
					tr.attr("id", _state.rowIdPrefix + "-" + _viewtype + "-" + (i - 1));
					if (_frozen && _opts.rownumbers) {
						var _rowNumber = i;
						if (_opts.pagination) {
							_rowNumber += (_opts.pageNumber - 1) * _opts.pageSize;
						}
						tr.find("div.datagrid-cell-rownumber").html(_rowNumber);
					}
					if (_opts.striped) {
						tr.removeClass("datagrid-row-alt").addClass((i - 1) % 2 ? "datagrid-row-alt": "");
					}
				}
			};
			var tr=_opts.finder.getTr(_target, _trIndex);
      var _rowIndex = tr.attr('datagrid-row-index');
      tr.remove();
			_resetRowAlt.call(this, true);
			_resetRowAlt.call(this, false);
			data.total -= 1;
			data.rows.splice(_rowIndex, 1);
		},
		onBeforeRender: function(_target, rows) {},
		onAfterRender: function(_target) {
			var _opts = $.data(_target, "datagrid").options;
      if (_opts.showFooter)
      {
        var _footer = $(_target).datagrid("getPanel").find("div.datagrid-footer");
        _footer.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility", "hidden");
        /*var _footer=$(_target).datagrid("getPanel").find(".datagrid-footer td.datagrid-td-rownumber");
        if(_footer.siblings().length>0)
        {
          _footer.siblings().first().remove();
          _footer.attr("colspan", 2).children().html('合计：');
          _footer.find(".datagrid-cell-rownumber").width(53);
        }
        else
        {
          var _footer = $(_target).datagrid("getPanel").find("div.datagrid-footer");
          _footer.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility", "hidden");
          var _footer=$('#'+_target.id+'_mainFooterInner').find(".datagrid-cell").first().html('合计：').css('text-align', 'right');
        }*/
      }
		}
	};

	var _tipbarer = {
		target: null,
		//全局
		init: function(_target){
			this.target=_target;
			var _opts = $.data(_target, "datagrid").options;
			var _panel = $.data(_target, "datagrid").panel;

			if (typeof _opts.navbar == "string")
      {
        $(_opts.navbar).addClass("datagrid-tipbar").prependTo(_panel);
        $(_opts.navbar).show();
      } else
      {
        $("div.datagrid-tipbar", _panel).remove();
        var tb = $('<div id="' + _target.id + '_navbar" class="datagrid-tipbar"></div>').prependTo(_panel);
        tb.append(_opts.tipbar);
      }
		},
		clear: function(_fieldName, _params){},
		reload: function(_fieldName, _params){}
	};
	var _navbarer = {
		target: null,
		_navbarClick: function(_itemgroup){
			var _opts = $.data(this.target, "datagrid").options;
			if (_opts.onNavbarClick)
			{
				var dataItems = this.getNavItems();
				var fieldName = _itemgroup.attr("fieldName");
				var currentItem = null;
				$.each(dataItems, function (i, item)
				{
					if (item.fieldName == fieldName)
					{
						currentItem = item;
						return false;
					}
				});
				_opts.onNavbarClick.call(this.target, dataItems, currentItem);
			}
		},
		_itemClick: function(the){	//plain项单击事件
			var _opts = $.data(this.target, "datagrid").options;
			var me = $(the);
      if(_opts.onNavbarClickBefore()===false)
      {
        return;
      }

			if (me.attr("code") == '-1')
			{
				me.parent().find(".navbar-item").not(the).removeClass("navbar-item-select");
			}
			else
			{
				if (me.parent().attr("singleMode") == "false")
				{
					me.parent().find(".navbar-item").removeClass("navbar-item-select");
				}
				me.parent().find(".navbar-item-all").removeClass("navbar-item-select");
			}

			if (me.hasClass("navbar-item-select"))
			{
				me.removeClass("navbar-item-select");
			}
			else
			{
				me.addClass("navbar-item-select");
			}
			var _itemGroup=me.parent();
			this._navbarClick(_itemGroup);
		},
		_createItemGroup: function(_params, _itemGroup){
			var _opts = $.data(this.target, "datagrid").options;
			var tb=$('#' + this.target.id + '_navbar');
			var the=this;

			if (_params == "-")
			{
				$("<div class=\"datagrid-btn-separator\"></div>").appendTo(tb);
			} else
			{
				var singleMode = _params.singleMode ? _params.singleMode : false;
				var searchType = _params.searchType ? _params.searchType : '=';
				var dataType = _params.dataType ? _params.dataType : 'int';
				var itemgroup = _itemGroup?_itemGroup:$('<div class="navbar-itemgroup"></div>').appendTo(tb);
				
				itemgroup.attr("fieldName", _params.fieldName)
					.attr("singleMode", singleMode)
					.attr("searchType", searchType)
					.attr("dataType", dataType)
					.data("groupParam", _params);

				if (_params.displayMode == "combotree")	//树状下拉框
				{
					$('<div class="navbar-item-title">' + _params.text + ':</div>').appendTo(itemgroup);
					var click = _params.dataParams.onClick;
					_params.dataParams.onClick = function (_node, _combotree)
					{
						if (_node.id == -1) $(_combotree).removeClass("navbar-item-select");
						else $(_combotree).addClass("navbar-item-select").css({ "border": "0px" });
						the._navbarClick(itemgroup);	//this为下拉框对象
						if (click) click.call(this, _node, _combotree);
					};
					$('<div class="navbar-item-dropdown dropdowntree">全部</div>').appendTo(itemgroup)
						.css({ "width": _params.dataParams.comboWidth }).combotree(_params.dataParams);
				}
				else if (_params.displayMode == "combobox")	//普通下拉框
				{
					$('<div class="navbar-item-title">' + _params.text + ':</div>').appendTo(itemgroup);
					var _onSelect = _params.dataParams.onSelect;
					_params.dataParams.onSelect = function (_record)
					{
						if (_record.ID == -1) $(this).removeClass("navbar-item-select");
						else $(this).addClass("navbar-item-select").css({ "border": "0px" });
						the._navbarClick(itemgroup);	//this为下拉框对象
						if (_onSelect) _onSelect.call(this, _record);
					};
					$('<div class="navbar-item-dropdown dropdownnormal">全部</div>').appendTo(itemgroup)
						.css({ "width": _params.dataParams.comboWidth }).combobox(_params.dataParams);
				}
				else	//plain模式
				{
					$('<div class="navbar-item-title">' + _params.text + ':</div>').appendTo(itemgroup);
					if (_params.isShowDefault)
					{
            var select=(_params.value==-1)?select=" navbar-item-select":"";
						$('<div class="navbar-item navbar-item-value navbar-item-all'+select+'">全部</div>').appendTo(itemgroup).attr("value", '-1');
					}
					$.each(_params.dataParams, function (i, item)
					{
            var select=(item.ID==_params.value)?select=" navbar-item-select":"";
						$('<div class="navbar-item navbar-item-value'+select+'">' + item.Name + '</div>').appendTo(itemgroup).attr("value", item.ID);
					});

					var _the=this;
					itemgroup.find(".navbar-item").bind("mouseenter.datagrid", function ()
					{
						$(this).addClass("navbar-item-over");
					}).bind("mouseleave.datagrid", function ()
					{
						$(this).removeClass("navbar-item-over");
					}).unbind(".datagrid").bind("click.datagrid", function ()
					{
						_the._itemClick(this);
					});
				}
			}
		},

		//全局
		init: function(_target){
			this.target=_target;
			var _opts = $.data(_target, "datagrid").options;
			var _panel = $.data(_target, "datagrid").panel;

			if (typeof _opts.navbar == "string")
      {
        $(_opts.navbar).addClass("datagrid-navbar").prependTo(_panel);
        $(_opts.navbar).show();
      } else
      {
        $("div.datagrid-navbar", _panel).remove();
        var tb = $('<div id="' + _target.id + '_navbar" class="datagrid-navbar"></div>').prependTo(_panel);
        for (var i = 0; i < _opts.navbar.length; i++)
        {
          var _params = _opts.navbar[i];
					this._createItemGroup(_params);
        }
      }
		},
		clear: function(_fieldName, _params){},
		reload: function(_fieldName, _params){},

		//组操作
		addGroup: function(_params){},
		removeGroup: function(_fieldName){},
		insertGroup: function(_params){},
		findGroup: function(_fieldName){
			var _opts = $.data(this.target, "datagrid").options;
			var _itemGroup=$('#' + this.target.id + '_navbar').find("div.navbar-itemgroup[fieldName='"+_fieldName+"']");
			return _itemGroup;
		},
		reloadGroup: function(_params){
			var _opts = $.data(this.target, "datagrid").options;

			var _itemGroup=this.findGroup(_params.fieldName);
			if(_itemGroup.length<=0)return;

			_itemGroup.unbind(".datagrid").html('');
			this._createItemGroup(_params, _itemGroup);
		},
		
		//组中的项
		addItem: function(_fieldName, _params){},
		removeItem: function(_fieldName){},
		insertItem: function(_index, _params){},
		findItem: function(_fieldName, _value){
			var _opts = $.data(this.target, "datagrid").options;
      var item =$('#' + this.target.id + '_navbar').find(".navbar-itemgroup>div.navbar-item[value="+_value+"]");
      return item;
    },
		selectItem: function(_fieldName, _value){
      var item=this.findItem(_fieldName, _value);
      this._itemClick(item);
      return item;
    },

		clearSelected: function(_fieldName, _value){
			var _opts = $.data(this.target, "datagrid").options;
      var item =null;
      if(_value)
      {
        item=$('#' + this.target.id + '_navbar').find(".navbar-itemgroup[fieldName="+_fieldName+"]").find(".navbar-item[fieldName="+_value+"]").removeClass("navbar-item-select");
      }
      else
      {
        item=$('#' + this.target.id + '_navbar').find(".navbar-itemgroup[fieldName="+_fieldName+"]").find(".navbar-item-select").removeClass("navbar-item-select");
      }
      return item;
    },

    //获得查询条件
    getWhere: function ()
    {
      var _target=this.target;
      if(!_target)return '';
      var _opts = $.data(_target, "datagrid").options;
      var where = '';
      $('#' + _target.id + '_navbar').find(".navbar-itemgroup").each(function (i, itemgroup)
      {
        var fieldName = $(itemgroup).attr("fieldName");
        var singleMode = $(itemgroup).attr("singleMode");
        var searchType = $(itemgroup).attr("searchType");
        var dataType = $(itemgroup).attr("dataType");
        var groupParam = $(itemgroup).data("groupParam");

        //下拉框数据
        $(itemgroup).find(".navbar-item-dropdown").each(function (i, item)
        {
          var value = '-1';
          if($(item).hasClass("dropdowntree"))
          {
            value=$(item).combotree('getValue');
          }
          else
          {
            value=$(item).combobox('getValue');
          }
          if (value == "-1") return;
          
          if (searchType.indexOf('like') >= 0)
          {
            if (where) where += " And ";
            where += searchType.replace(/\{value\}/gi, value);
          }
          else
          {
            if (where) where += " And ";
            where += fieldName + ((dataType == 'string') ? "='" + value + "'" : "=" + value);
          }
        });
        //普通选择数据
        var values = '', texts='';
        $(itemgroup).find(".navbar-item-select").not(".navbar-item-dropdown").each(function (i, item)
        {
          var value = $(item).attr("value");
          var text = $(item).text();
          if (value == "-1") return;

          if (values)
          {
            values += ",";
            text += ",";
          }
          values += dataType == 'string' ? "'" + value + "'" : value;
          texts += text;
        });
        if (values)
        {
          if(typeof groupParam.getWhere == "function")
          {
            var w = groupParam.getWhere(fieldName, values);
            if(w)
            {
              if (where) where += " And ";
              where += w;
            }
          }
          else
          {
            if (where) where += " And ";
            where += fieldName + " in(" + values + ")";
          }
        }
      });
      return where;
    },
    getNavItems: function ()
    {
      var _target=this.target;
      var _opts = $.data(_target, "datagrid").options;
      var dataItems = [];
      $('#' + _target.id + '_navbar').find(".navbar-itemgroup").each(function (i, itemgroup)
      {
        var dataitem = {
          fieldName: null, 	//查询字段名
          dataType: null, 	//数据类型
          singleMode: null, //查询模式
          searchType: null, //查询类别
          itemgroup: null, 	//查询分组DOM元素
          values: null,			//选中值
          texts: null				//选中值
        };

        var fieldName = $(itemgroup).attr("fieldName");
        var singleMode = $(itemgroup).attr("singleMode");
        var searchType = $(itemgroup).attr("searchType");
        var dataType = $(itemgroup).attr("dataType");

        dataitem.fieldName = fieldName;
        dataitem.singleMode = singleMode;
        dataitem.searchType = searchType;
        dataitem.dataType = dataType;
        dataitem.itemgroup = itemgroup;
        //下拉框数据
        $(itemgroup).find(".navbar-item-dropdown").each(function (i, item)
        {
          var value = '', text='';
          if($(item).hasClass("dropdowntree"))	//tree下拉框
          {
            value=$(item).combotree('getValue');
            text=$(item).combotree('getText');
          }
          else	//普通下拉框
          {
            value=$(item).combobox('getValue');
            text=$(item).combobox('getText');
          }
          dataitem.values = value;
          dataitem.texts = text;
          dataItems.push(dataitem);
        });

        var normalSelectItems=$(itemgroup).find(".navbar-item-select").not(".navbar-item-dropdown");
        if(normalSelectItems.length>0)	//普通选择数据
        {
          var values = '', texts='';
          normalSelectItems.each(function (i, item)
          {
            var value = $(item).attr("value");
            if (values) values += ",";
            values += value;

            var text = $(item).text();
            if (texts) texts += ",";
            texts += text;
          });
          dataitem.values = values;
          dataitem.texts = texts;
          dataItems.push(dataitem);
        }
      });

      return dataItems;
    }
	};
	var _tabbarer = {
		target: null,
    init: function(){
			var _opts = $.data(this.target, "datagrid").options;
      var _panel = $.data(this.target, "datagrid").panel;
      if (typeof _opts.tabbar == "string")
      {
        $(_opts.tabbar).addClass("datagrid-tabbar").prependTo(_panel);
        $(_opts.tabbar).show();
      } else
      {
        $("div.datagrid-tabbar", _panel).remove();
        var tb = $('<div id="' + this.target.id + '_tabbar" class="datagrid-tabbar"></div>').prependTo(_panel);
        var _width=0;
        for (var i = 0; i < _opts.tabbar.length; i++)
        {
          var btn = _opts.tabbar[i];
          if(i==_opts.tabbar.length-1)
          {
            var w=_panel.innerWidth() - _width;
            btn.width=w;
          }
          _width += $('<div id="' + this.target.id + '_tabbar_' + btn.id + '"></div>').appendTo(tb).tabs(btn).width();
        }
      }
    },
		inserttabbar: function (_options)
		{
			var _opts = $.data(this.target, "datagrid").options;
			var tbChild = $('#' + this.target.id + '_tabbar').children();

			for (var i = 0; i < _options.length; i++)
			{
				var _btn = _options[i];
				var _node = tbChild.eq(_btn.position);
				if (!_node || _node.length <= 0) _node = tbChild.last();

				if (_btn.id == "-")
				{
					$("<div class=\"datagrid-btn-separator\"></div>").insertBefore(_node);
				}
				else
				{
          var _linkbutton = tbChild.find("#"+_btn.id);
          if(_linkbutton.length==0)_linkbutton=$("<a href=\"javascript:void(0)\"></a>");
					_linkbutton[0].onclick = eval(_btn.handler || function () { });
					_linkbutton.css("float", "left").insertBefore(_node).linkbutton($.extend({}, _btn, {plain: true}));
				}
			}
		}, 
		getButton: function(_buttonId)
		{
			var _opts = $.data(this.target, "datagrid").options;
			var tbChild = $('#' + this.target.id + '_tabbar').children("#"+_buttonId);
      return tbChild;
		},
		setButtonText: function(_buttonId, _buttonText)
		{
			$("#"+_buttonId + " .l-btn-text").text(_buttonText);
		},
    //获得查询条件
    getWhere: function ()
    {
      if(!this.target)return '';

      var _target=this.target;
      var _opts = $.data(_target, "datagrid").options;
      var where = '';
      $('#' + _target.id + '_tabbar .tabs-container').each(function (i, _element)
      {
        var _selectedTab = $(_element).tabs("getSelected");
        var _tabOpts=_selectedTab.panel("options");
        var _searchType=_tabOpts.searchType;
        var _fieldName=_tabOpts.fieldName;
        var _value=_tabOpts.value;
        var _dataType=_tabOpts.dataType;
        if(_value===-1)return true;

        if (_searchType.indexOf('like') >= 0)
        {
          if (where) where += " And ";
          where += _searchType.replace(/\{value\}/gi, _value);
        }
        else
        {
          if (where) where += " And ";
          where += _fieldName + ((_dataType == 'string') ? "='" + _value+ "'" : "=" + _value);
        }
      });
      return where;
    }
	}
	var _toolbarer = {
		target: null,
    init: function(){
			var _opts = $.data(this.target, "datagrid").options;
      var _panel = $.data(this.target, "datagrid").panel;
      if (typeof _opts.toolbar == "string")
      {
        $(_opts.toolbar).addClass("datagrid-toolbar").prependTo(_panel);
        $(_opts.toolbar).show();
      } else
      {
        $("div.datagrid-toolbar", _panel).remove();
        var tb = $('<div id="' + this.target.id + '_toolbar" class="datagrid-toolbar"><table cellspacing="0" cellpadding="0"><tr></tr></table></div>').prependTo(_panel);
        var tr = tb.find("tr");
        for (var i = 0; i < _opts.toolbar.length; i++) {
          var _btnOpts = _opts.toolbar[i];
          if (_btnOpts == "-") {
            $('<td><div class="datagrid-btn-separator"></div></td>').appendTo(tr);
          } 
          else if (_btnOpts.buttontype == "quicksearch")
          {
            _btnOpts.id=this.target.id+"_"+_btnOpts.id;
            var _td=$('<td></td>').appendTo(tr);
            var _quicksearch = $('<div class="quickseach"></div>').appendTo(_td).quicksearch($.extend({gridID:this.target.id}, _btnOpts));
          } else
          {
            var td = $("<td></td>").appendTo(tr);
            var _btn = $('<a href="javascript:void(0);" gridID="'+this.target.id+'"></a>').appendTo(td);
            _btn[0].onclick = eval(_btnOpts.handler || function() {});
            _btn.linkbutton($.extend({}, _btnOpts, {plain: true}));
          }
        }
        /*
        $("div.datagrid-toolbar", _panel).remove();
        var tb = $('<div id="' + this.target.id + '_toolbar" class="datagrid-toolbar"></div>').prependTo(_panel);
        for (var i = 0; i < _opts.toolbar.length; i++)
        {
          var _btnOpts = _opts.toolbar[i];
          if (_btnOpts == "-" || _btnOpts.id == "-")
          {
            $("<div class=\"datagrid-_btnOpts-separator\"></div>").appendTo(tb);
          } else if (_btnOpts.buttontype == "quicksearch")
          {
            _btnOpts.id=this.target.id+"_"+_btnOpts.id;
            var _quicksearch = $('<div class="quickseach"></div>');
            _quicksearch.css("float", "left").appendTo(tb).quicksearch($.extend({gridID:this.target.id}, _btnOpts));
          } else
          {
            var _linkbutton = $('<a href="javascript:void(0)" gridID="'+this.target.id+'"></a>');
            _linkbutton.css("float", "left").appendTo(tb).linkbutton($.extend({},
            _btnOpts, {
              plain: true,
              onclick: eval(_btnOpts.handler || function () { })
            }));
          }
        }*/
      }
    },
		insertToolBar: function (_target, _options)
		{
      this.target=_target;
			var _opts = $.data(this.target, "datagrid").options;
			var tbChild = $('#' + this.target.id + '_toolbar').find("td");
			var tooltr = $('#' + this.target.id + '_toolbar').find("table tr");

			for (var i = 0; i < _options.length; i++)
			{
				var _btnOpts = _options[i];
				var _node = tbChild.eq(_btnOpts.position);
				if (!_node || _node.length <= 0) _node = tbChild.last();

				if (_btnOpts.id == "-")
				{
          if(_node.length>0)
          {
  					$("<td><div class=\"datagrid-btn-separator\"></div></td>").insertBefore(_node);
          }
          else
          {
  					$("<td><div class=\"datagrid-btn-separator\"></div></td>").appendTo(tooltr);
          }
				}
				else
				{
          var _linkbutton = tbChild.find("#"+_btnOpts.id);
          var _td=null;
          if(_linkbutton.length==0)
          {
            _td=(_node.length>0)?$('<td></td>').insertBefore(_node):$('<td></td>').appendTo(tooltr);
            var _btn = $('<a href="javascript:void(0);"></a>').appendTo(_td);
            _btn[0].onclick = eval(_btnOpts.handler || function() {});
            _btn.linkbutton($.extend({}, _btnOpts, {plain: true}));
          }
          else
          {
            _td=_linkbutton.parent();
					  _linkbutton[0].onclick = eval(_btnOpts.handler || function () { });
            _td.insertBefore(_node);
          }
				}
			}
		}, 
		hideToolBar: function (id)
		{
		  var tbChild = $('#' + this.target.id + '_toolbar').find("#" + id);
		  tbChild.hide();
		},
		disabledToolBar: function (_options)
		{
		  var tbChild = $('#' + this.target.id + '_toolbar').find("#" + _options.id);
		  tbChild.linkbutton("setDisabled", _options.disabled);
		},
		getButton: function (_buttonId)
		{
			var _opts = $.data(this.target, "datagrid").options;
			var tbChild = $('#' + this.target.id + '_toolbar').children("#"+_buttonId);
      return tbChild;
		},
		setButtonText: function(_buttonId, _buttonText)
		{
			$("#"+_buttonId + " .l-btn-text").text(_buttonText);
		}
	}
	$.fn.datagrid.defaults = $.extend({},
	$.fn.panel.defaults, {
		frozenColumns: undefined,
		columns: undefined,
		fitColumns: false,
		resizeHandle: "right",
		autoRowHeight: true,
    tabbar: null,
    navbar: null,
		toolbar: null,
		tipbarer: _tipbarer,	//提示栏栏操作方法
		navbarer: _navbarer,	//导航栏操作方法
		tabbarer: _tabbarer,	//tab栏操作方法
		toolbarer: _toolbarer,	//按钮栏操作方法
		striped: false,
		method: "post",
		nowrap: true,
		idField: null,
		url: null,
		data: null,
		loadMsg: "Processing, please wait ...",
		rownumbers: false,
		singleSelect: false,  //勾选可多选
		singleCurrent: true,  //只有一行为当前行
		selectOnCheck: true,  //勾选时，选中行
		checkOnSelect: false,  //选中行时，勾选上
		pagination: false,
		pagePosition: "bottom",
		pageNumber: 1,
		pageSize: 10,
		pageList: [10, 20, 30, 40, 50],
		queryParams: {},
		defaultSortName: null,
		sortName: null,
		sortOrder: "asc",
		multiSort: false,
		remoteSort: true,
		showHeader: true,
		showFooter: false,
		scrollbarSize: 18,
    isInitLoadData:true,

		rowStyler: function(_220, _221) {},
		loader: function(_target, _params, _callback) {
			var _opts = $(this).datagrid("options");
			if (!_opts.url) {
				return false;
			}
			$.ajax({
				type: _opts.method,
				url: _opts.url,
				data: _target,
				dataType: "json",
				success: function(data) {
					_params(data);
				},
				error: function() {
					_callback.apply(this, arguments);
				}
			});
		},
		loadFilter: function(data) {
      var _target=this;
      var _opts = $.data(this, "datagrid").options;
      if(!data)data=[];
      function changeDataType(rows)
      {
        //转换日期格式
        for (var i = 0; i < rows.length; i++)
        {
          var row = rows[i];
          $.each(row, function(_name, _value)
          {
            if (typeof (_value) == "string" && _value.indexOf("/Date(") == 0)
            {
              if(_value.indexOf('-62135596800000')>=0)
              {
                row[_name]=null;
              }
              else
              {
                _value = _value.replace(/\//g, "").replace("Date", "new Date");
                row[_name] = Globals.formatDate(_value, "yyyy-MM-dd HH:mm:ss");
              }
            }
          });

          var _cols = _opts.columns[0];
          for (var j = 0; j < _cols.length; j++)
          {
            var col = _cols[j];
            var _value = row[col.field];
            switch (col.datatype)
            {
              case 'Int16':
              case 'Int32':
              case 'Int64':
              case 'Single':
              case 'Byte':
              case 'ByteArray':
                row[col.field] = _value?parseInt(_value):_value;
                break;
              case 'Decimal':
              case 'Double':
                row[col.field] = _value?parseFloat(_value):_value;
                break;
            }
          }
        }
      }

      function checkTotal(_data)  /*校验合计行*/
      {
        if(!$.isArray(_data.rows) || !_data.rows.length)return _data;

        var isExist=false;
        var firstRow = _data.rows[0];
        for(var name in firstRow)
        {
          if(firstRow[name]=="合计")
          {
            isExist=true;
            break;
          }
        }
        if(isExist)
        {
          var firstRow = _data.rows.shift();
          _data.footer=[];
          _data.footer.push(firstRow);
        }
        else
        {
          var lastRow = _data.rows[_data.rows.length - 1];
          for(var name in lastRow)
          {
            if(lastRow[name]=="合计")
            {
              isExist=true;
              break;
            }
          }
          if(isExist)
          {
            var lastRow = _data.rows.pop();
            _data.footer=[];
            _data.footer.push(lastRow);
          }
        }
      }

      var dataInfo = {};
      if (typeof data.length == "number" && typeof data.splice == "function")
      {
        changeDataType(data);
        dataInfo = {
          total: data.length,
          rows: data
        };
      }
      else
      {
        changeDataType(data.rows);
        dataInfo = data;
      }
      checkTotal(dataInfo);
      return dataInfo;
		},
		editors: _editors,
    singleCellEditor:true, //单个单元格编辑
    minHeight: 150,
    maxHeight: 550,
    finder: {
			getTr: function(_target, _index, type, _frozen) { //_frozen:1=view1, other=view2
				type = type || "body";
				_frozen = _frozen || 0;
				var _state = $.data(_target, "datagrid");
				var dc = _state.dc;
				var _opts = _state.options;
				if (_frozen == 0) {
					var tr1 = _opts.finder.getTr(_target, _index, type, 1);
					var tr2 = _opts.finder.getTr(_target, _index, type, 2);
					return tr1.add(tr2);
				} else {
					if (type == "body") {
						var tr = $("#" + _state.rowIdPrefix + "-" + _frozen + "-" + _index);
						if (!tr.length) {
							tr = (_frozen == 1 ? dc.body1: dc.body2).find(">table>tbody>tr[datagrid-tr-index=" + _index + "]");
						}
						return tr;
					} else {
						if (type == "footer") {
							return (_frozen == 1 ? dc.footer1: dc.footer2).find(">table>tbody>tr[datagrid-tr-index=" + _index + "]");
						} else {
							if (type == "selected") {
								return (_frozen == 1 ? dc.body1: dc.body2).find(">table>tbody>tr.datagrid-row-selected");
							} else {
								if (type == "highlight") {
									return (_frozen == 1 ? dc.body1: dc.body2).find(">table>tbody>tr.datagrid-row-over");
								} else {
									if (type == "checked") {
										return (_frozen == 1 ? dc.body1: dc.body2).find(">table>tbody>tr.datagrid-row:has(div.datagrid-cell-check input:checked)");
									} else {
										if (type == "last") {
											return (_frozen == 1 ? dc.body1: dc.body2).find(">table>tbody>tr[datagrid-tr-index]:last");
										} else {
											if (type == "allbody") {
												return (_frozen == 1 ? dc.body1: dc.body2).find(">table>tbody>tr[datagrid-tr-index]");
											} else {
												if (type == "allfooter") {
													return (_frozen == 1 ? dc.footer1: dc.footer2).find(">table>tbody>tr[datagrid-tr-index]");
												}
											}
										}
									}
								}
							}
						}
					}
				}
			},
			getRow: function(_target, p) {
				var _index = (typeof p == "object") ? p.attr("datagrid-tr-index") : p;
        var tr = this.getTr(_target, _index);
        return tr.data('relationRow');
				//return $.data(_target, "datagrid").data.rows[parseInt(_index)];
			}
		},
		view: _view,
		onBeforeLoad: function(_param) {},
    onLoadSuccess: function (_data) { }, //加载成功，_data={total:0, rows:[]}
		onLoadError: function() {},
		onClickRow: function(_22c, _22d) {},
		onDblClickRow: function(_22e, _22f) {},
		onClickCell: function(_target, _rowIndex, _field, _value, tr, td, row) {},
		onMouseover: function(_target, _rowIndex, _field, _value, tr, td, row) {},
		onMouseout: function(_target, _rowIndex, _field, _value, tr, td, row) {},
		onDblClickCell: function(_233, _234, _235) {},
		onSortColumn: function(sort, _236) {},
		onResizeColumn: function(_237, _238) {},
    onCurrent: function (_rowIndex, _rowData) { }, //当前行事件
		onSelect: function(_239, _23a) {},
		onUnselect: function(_23b, _23c) {},
		onSelectAll: function(rows) {},
		onUnselectAll: function(rows) {},
		onCheck: function(_23d, _23e) {},
		onUncheck: function(_23f, _240) {},
		onCheckAll: function(rows) {},
		onUncheckAll: function(rows) {},
		onBeforeEdit: function(_241, _242) {},
		onAfterEdit: function(_243, _244, _245) {},
		onCancelEdit: function(_246, _247) {},
		onHeaderContextMenu: function(e, _248) {},
		onRowContextMenu: function(e, _249, _24a) {},

    onBeforeRenderFilter:function(data){return '';},  //数据显示过滤器
    onCurrent: function (_rowIndex, _rowData) { }, //当前行事件
    onNavbarClickBefore: function (dataItems, currentItem) {return true;}, //导航栏点击前事件
    onNavbarClick: function (dataItems, currentItem) { }, //导航栏点击事件
    onBeforeSave: function (_param) {return true;},	//保存前
		onAfterSaveSuccess: function (data, textStatus) { } //保存成功
	});
})(jQuery);

(function($) {
	function _createCombo(_target) {
		var _opts = $.data(_target, "combogrid").options;
		var _grid = $.data(_target, "combogrid").grid;
		$(_target).addClass("combogrid-f");
		$(_target).combo(_opts);
		var _panel = $(_target).combo("panel");
		if (!_grid) {
      var id="combogrid_"+_target.id;
      if(!_target.id)
      {
        id="combogrid_"+(++$.fn.window.defaults.zIndex);
      }
			_grid = $("<table id='" + id + "'></table>").appendTo(_panel);
			$.data(_target, "combogrid").grid = _grid;
		}
		_grid.datagrid($.extend({},
		_opts, {
			border: false,
			fit: true,
			singleSelect: (!_opts.multiple),
			onLoadSuccess: function(_6) {
				var _remainText = $.data(_target, "combogrid").remainText;
				var _values = $(_target).combo("getValues");
				_setValues(_target, _values, _remainText);
				_opts.onLoadSuccess.apply(_target, arguments);
			},
			onClickRow: _onClickRow,
			onSelect: function(_a, _b) {
				_onSelect();
				_opts.onSelect.call(this, _a, _b);
			},
			onUnselect: function(_d, _e) {
				_onSelect();
				_opts.onUnselect.call(this, _d, _e);
			},
			onSelectAll: function(_f) {
				_onSelect();
				_opts.onSelectAll.call(this, _f);
			},
			onUnselectAll: function(_10) {
				if (_opts.multiple) {
					_onSelect();
				}
				_opts.onUnselectAll.call(this, _10);
			}
		}));
    if(_opts.isReload)
    {
      $('.quickseach-button', _panel).click();
    }
    else
    {
      _grid.datagrid("loadData", _opts.data);
    }
		
    function _onClickRow(_index, row) {
			$.data(_target, "combogrid").remainText = false;
			_onSelect();
			if (!_opts.multiple) {
				$(_target).combo("hidePanel");
			}
			_opts.onClickRow.call(this, _index, row, _target);
		};
		function _onSelect() {
			var _remainText = $.data(_target, "combogrid").remainText;
			var _opts = _grid.datagrid("options");
			var _selections = [_opts.currentRowInfo.row];//_grid.datagrid("getSelections");
			var vv = [],
			ss = [];
			for (var i = 0; i < _selections.length; i++) {
				vv.push(_selections[i][_opts.idField]);
				ss.push(_selections[i][_opts.textField]);
			}
			if (_opts.multiple) {
				$(_target).combo("setValues", vv);
			} else {
        if(_opts.fieldRelation)	//字段映射，主要用于多字段选择
        {
          for (var i = 0; i < _selections.length; i++)
          {
            var dataitem=_selections[i];
            $.each(dataitem, function(readField, readValue)
            {
              var writeField='';
              $.each(_opts.fieldRelation, function(i, item)
              {
                if(item[readField]){
                  writeField=item[readField];
                  return false;
                }
              });
              if(writeField)
              {
                var writeValue = dataitem[readField];
                if(readField==_opts.valueField)
                {
                  _setValues(_target, [writeValue]);
                }
                if(_opts.relationer)
                {
                  _opts.relationer.setValue(writeField, writeValue);
                }
              }
            });
          }
        }
        else
        {
          $(_target).combo("setValues", (vv.length ? vv: [""]));
          if(_opts.relationer)
          {
            _opts.relationer.setValue(_opts.relationer.fieldName, _value);
          }
        }
			}
			if (!_remainText) {
				$(_target).combo("setText", ss.join(_opts.separator));
			}
		};
	};
	function _keyHandler(_target, _keyType) {
		var _opts = $.data(_target, "combogrid").options;
		var _grid = $.data(_target, "combogrid").grid;
		var _gridRowsLength = _grid.datagrid("getRows").length;
		$.data(_target, "combogrid").remainText = false;
		var _rowIndex;
		var _selections = _grid.datagrid("getSelections");
		if (_selections.length) {
			_rowIndex = _grid.datagrid("getRowIndex", _selections[_selections.length - 1][_opts.idField]);
			_rowIndex += _keyType;
			if (_rowIndex < 0) {
				_rowIndex = 0;
			}
			if (_rowIndex >= _gridRowsLength) {
				_rowIndex = _gridRowsLength - 1;
			}
		} else {
			if (_keyType > 0) {
				_rowIndex = 0;
			} else {
				if (_keyType < 0) {
					_rowIndex = _gridRowsLength - 1;
				} else {
					_rowIndex = -1;
				}
			}
		}
		if (_rowIndex >= 0) {
			_grid.datagrid("clearSelections");
			_grid.datagrid("selectRow", _rowIndex);
		}
	};
	function _setValues(_target, _values, _text) {
		var _opts = $.data(_target, "combogrid").options;
		var _grid = $.data(_target, "combogrid").grid;
		var _gridRows = _grid.datagrid("getRows");
		var ss = [];
		for (var i = 0; i < _values.length; i++) {
			var _rowIndex = _grid.datagrid("getRowIndex", _values[i]);
			if (_rowIndex >= 0) {
				_grid.datagrid("selectRow", _rowIndex);
				ss.push(_gridRows[_rowIndex][_opts.textField]);
			} else {
				ss.push(_values[i]);
			}
		}
		if ($(_target).combo("getValues").join(",") == _values.join(",")) {
			return;
		}
		$(_target).combo("setValues", _values);
		if (!_text) {
			$(_target).combo("setText", ss.join(_opts.separator));
		}
	};
	function _keyQuery(_target, q) {
		var _opts = $.data(_target, "combogrid").options;
		var _grid = $.data(_target, "combogrid").grid;
		$.data(_target, "combogrid").remainText = true;
		if (_opts.multiple && !q) {
			_setValues(_target, [], true);
		} else {
			_setValues(_target, [q], true);
		}
		if (_opts.mode == "remote") {
			_grid.datagrid("clearSelections");
			_grid.datagrid("load", {
				q: q
			});
		} else {
			if (!q) {
				return;
			}
			var _gridRows = _grid.datagrid("getRows");
			for (var i = 0; i < _gridRows.length; i++) {
				if (_opts.filter.call(_target, q, _gridRows[i])) {
					_grid.datagrid("clearSelections");
					_grid.datagrid("selectRow", i);
					return;
				}
			}
		}
	};
	$.fn.combogrid = function(_options, _param) {
		if (typeof _options == "string") {
			var _method = $.fn.combogrid.methods[_options];
			if (_method) {
				return _method(this, _param);
			} else {
				return $.fn.combo.methods[_options](this, _param);
			}
		}
		_options = _options || {};
		var jme=this;
		return this.each(function() {
			this.jme=jme;
			var _data = $.data(this, "combogrid");
			if (_data) {
				$.extend(_data.options, _options);
			} else {
				_data = $.data(this, "combogrid", {
					options: $.extend({},
					$.fn.combogrid.defaults, $.fn.combogrid.parseOptions(this), _options)
				});
			}
			_createCombo(this);
		});
	};
	$.fn.combogrid.methods = {
		options: function(jq) {
			return $.data(jq[0], "combogrid").options;
		},
		grid: function(jq) {
			return $.data(jq[0], "combogrid").grid;
		},
		setValues: function(jq, _values) {
			return jq.each(function() {
				_setValues(this, _values);
			});
		},
		setValue: function(jq, _value) {
			return jq.each(function() {
				_setValues(this, [_value]);
			});
		},
		clear: function(jq) {
			return jq.each(function() {
				$(this).combogrid("grid").datagrid("clearSelections");
				$(this).combo("clear");
			});
		}
	};
	$.fn.combogrid.parseOptions = function(_element) {
		var t = $(_element);
		return $.extend({},
		$.fn.combo.parseOptions(_element), $.fn.datagrid.parseOptions(_element), {
			idField: (t.attr("idField") || undefined),
			textField: (t.attr("textField") || undefined),
			mode: t.attr("mode")
		});
	};
	$.fn.combogrid.defaults = $.extend({},
	$.fn.combo.defaults, $.fn.datagrid.defaults, {
		loadMsg: null,
		idField: null,
		textField: null,
    height: null,
		mode: "local",
		/**************************************
    关联数据行
		relationer={
			dataRow:[{字段名 :字段值},{字段名 :字段值}],
			setValue:function(fieldName, value){}
		}
    和其他组合控件数据关联操作器
		**************************************/
		relationer:null,
		keyHandler: {
			up: function() {
				_keyHandler(this, -1);
			},
			down: function() {
				_keyHandler(this, 1);
			},
			enter: function() {
				_keyHandler(this, 0);
				$(this).combo("hidePanel");
			},
			query: function(q) {
				_keyQuery(this, q);
			}
		},
		filter: function(q, row) {
			var _gridOpts = $(this).combogrid("options");
			return row[_gridOpts.textField].indexOf(q) == 0;
		}
	});
})(jQuery);

(function ($)
{
	function _createDataGrid(_target)
	{
		var _state = $.data(_target, "treegrid");
		var _opts = _state.options;
		$(_target).datagrid($.extend({},
		_opts, {
			url: null,
			data: null,
			loader: function ()
			{
				return false;
			},
			onBeforeLoad: function ()
			{
				return false;
			},
			onLoadSuccess: function () { },
			onResizeColumn: function (_5, _6)
			{
				_fixRowHeight(_target);
				_opts.onResizeColumn.call(_target, _5, _6);
			},
			onSortColumn: function (_7, _8)
			{
				_opts.sortName = _7;
				_opts.sortOrder = _8;
				if (_opts.remoteSort)
				{
					_ajaxLoad(_target);
				} else
				{
					var _9 = $(_target).treegrid("getData");
					_loadData(_target, 0, _9);
				}
				_opts.onSortColumn.call(_target, _7, _8);
			},
			onBeforeEdit: function (_a, _b)
			{
				if (_opts.onBeforeEdit.call(_target, _b) == false)
				{
					return false;
				}
			},
			onAfterEdit: function (_c, _d, _e)
			{
				_opts.onAfterEdit.call(_target, _d, _e);
			},
			onCancelEdit: function (_f, row)
			{
				_opts.onCancelEdit.call(_target, row);
			},
			onSelect: function (_index, row)
			{
				_opts.onSelect.call(_target, _index, row);
			},
			onUnselect: function (_index, row)
			{
				_opts.onUnselect.call(_target, _index, row);
			},
			onSelectAll: function ()
			{
				_opts.onSelectAll.call(_target, $.data(_target, "treegrid").data);
			},
			onUnselectAll: function ()
			{
				_opts.onUnselectAll.call(_target, $.data(_target, "treegrid").data);
			},
			onCheck: function (_12)
			{
				_opts.onCheck.call(_target, _find(_target, _12));
			},
			onUncheck: function (_13)
			{
				_opts.onUncheck.call(_target, _find(_target, _13));
			},
			onCheckAll: function ()
			{
				_opts.onCheckAll.call(_target, $.data(_target, "treegrid").data);
			},
			onUncheckAll: function ()
			{
				_opts.onUncheckAll.call(_target, $.data(_target, "treegrid").data);
			},
			onClickRow: function (_rowIndex, row, e)
			{
				_opts.onClickRow.call(_target, _find(_target, _rowIndex), row, e);
			},
			onDblClickRow: function (_15)
			{
				_opts.onDblClickRow.call(_target, _find(_target, _15));
			},
			onClickCell: function (_16, _state)
			{
				_opts.onClickCell.call(_target, _state, _find(_target, _16));
			},
			onDblClickCell: function (_proxy, _opts)
			{
				_opts.onDblClickCell.call(_target, _opts, _find(_target, _proxy));
			},
			onRowContextMenu: function (e, _1a)
			{
				_opts.onContextMenu.call(_target, e, _find(_target, _1a));
			}
		}));
		if (!_opts.columns)
		{
			var _1b = $.data(_target, "datagrid").options;
			_opts.columns = _1b.columns;
			_opts.frozenColumns = _1b.frozenColumns;
		}
		_state.dc = $.data(_target, "datagrid").dc;
		if (_opts.pagination)
		{
			var _1c = $(_target).datagrid("getPager");
			_1c.pagination({
				pageNumber: _opts.pageNumber,
				pageSize: _opts.pageSize,
				pageList: _opts.pageList,
				onSelectPage: function (_1d, _1e)
				{
					_opts.pageNumber = _1d;
					_opts.pageSize = _1e;
					_ajaxLoad(_target);
				}
			});
			_opts.pageSize = _1c.pagination("options").pageSize;
		}
	};
	function _fixRowHeight(_target, _index)
	{
		var _opts = $.data(_target, "datagrid").options;
		var dc = $.data(_target, "datagrid").dc;
		if (!dc.body1.is(":empty") && (!_opts.nowrap || _opts.autoRowHeight))
		{
			if (_index != undefined)
			{
				var _24 = _getChildren(_target, _index);
				for (var i = 0; i < _24.length; i++)
				{
					_26(_24[i][_opts.idField]);
				}
			}
		}
		$(_target).datagrid("fixRowHeight", _index);
		function _26(_27)
		{
			var tr1 = _opts.finder.getTr(_target, _27, "body", 1);
			var tr2 = _opts.finder.getTr(_target, _27, "body", 2);
			tr1.css("height", "");
			tr2.css("height", "");
			var _28 = Math.max(tr1.height(), tr2.height());
			tr1.css("height", _28);
			tr2.css("height", _28);
		};
	};
	function _setHintNumber(_target)
	{
		var dc = $.data(_target, "datagrid").dc;
		var _opts = $.data(_target, "treegrid").options;
		if (!_opts.rownumbers)
		{
			return;
		}
		dc.body1.find("div.datagrid-cell-rownumber").each(function (i)
		{
			$(this).html(i + 1);
		});
	};
	function _bindEvent(_target)
	{
		var dc = $.data(_target, "datagrid").dc;
		var _body = dc.body1.add(dc.body2);
		var _clickhandler = ($.data(_body[0], "events") || $._data(_body[0], "events")).click[0].handler;
		dc.body1.add(dc.body2).bind("mouseover",
		function (e)
		{
			var tt = $(e.target);
			var tr = tt.closest("tr.datagrid-row");
			if (!tr.length)
			{
				return;
			}
			if (tt.hasClass("tree-hit"))
			{
				tt.hasClass("tree-expanded") ? tt.addClass("tree-expanded-hover") : tt.addClass("tree-collapsed-hover");
			}
			e.stopPropagation();
		}).bind("mouseout",
		function (e)
		{
			var tt = $(e.target);
			var tr = tt.closest("tr.datagrid-row");
			if (!tr.length)
			{
				return;
			}
			if (tt.hasClass("tree-hit"))
			{
				tt.hasClass("tree-expanded") ? tt.removeClass("tree-expanded-hover") : tt.removeClass("tree-collapsed-hover");
			}
			e.stopPropagation();
		}).unbind("click").bind("click",
		function (e)
		{
			var tt = $(e.target);
			var tr = tt.closest("tr.datagrid-row");
			if (!tr.length)
			{
				return;
			}
			if (tt.hasClass("tree-hit"))
			{
				_toggle(_target, tr.attr("node-id"));
			} else
			{
				_clickhandler(e);
			}
			e.stopPropagation();
		});
	};
	function _31(_32, _33)
	{
		var _34 = $.data(_32, "treegrid").options;
		var tr1 = _34.finder.getTr(_32, _33, "body", 1);
		var tr2 = _34.finder.getTr(_32, _33, "body", 2);
		var _35 = $(_32).datagrid("getColumnFields", true).length + (_34.rownumbers ? 1 : 0);
		var _36 = $(_32).datagrid("getColumnFields", false).length;
		_37(tr1, _35);
		_37(tr2, _36);
		function _37(tr, _38)
		{
			$("<tr class=\"treegrid-tr-tree\">" + "<td style=\"border:0px\" colspan=\"" + _38 + "\">" + "<div></div>" + "</td>" + "</tr>").insertAfter(tr);
		};
	};
	function _loadData(_target, _id, _data, _isClear)
	{
		var _state = $.data(_target, "treegrid");
		var _opts = _state.options;
		var dc = _state.dc;
		_data = _opts.loadFilter.call(_target, _data, _id);
		var _row = _find(_target, _id);
		if (_row)
		{
			var _tr1 = _opts.finder.getTr(_target, _id, "body", 1);
			var _tr2 = _opts.finder.getTr(_target, _id, "body", 2);
			var cc1 = _tr1.next("tr.treegrid-tr-tree").children("td").children("div");
			var cc2 = _tr2.next("tr.treegrid-tr-tree").children("td").children("div");
			if (!_isClear)
			{
				_row.children = [];
			}
		} else
		{
			var cc1 = dc.body1;
			var cc2 = dc.body2;
			if (!_isClear)
			{
				_state.data = [];
			}
		}
		if (!_isClear)
		{
			cc1.empty();
			cc2.empty();
		}
		if (_opts.view.onBeforeRender)
		{
			_opts.view.onBeforeRender.call(_opts.view, _target, _id, _data);
		}
		_opts.view.render.call(_opts.view, _target, cc1, true);
		_opts.view.render.call(_opts.view, _target, cc2, false);
		if (_opts.showFooter)
		{
			_opts.view.renderFooter.call(_opts.view, _target, dc.footer1, true);
			_opts.view.renderFooter.call(_opts.view, _target, dc.footer2, false);
		}
		if (_opts.view.onAfterRender)
		{
			_opts.view.onAfterRender.call(_opts.view, _target);
		}
		_opts.onLoadSuccess.call(_target, _row, _data);
		if (!_id && _opts.pagination)
		{
			var _44 = $.data(_target, "treegrid").total;
			var _45 = $(_target).datagrid("getPager");
			if (_45.pagination("options").total != _44)
			{
				_45.pagination({
					total: _44
				});
			}
		}
    $.each(_data.rows, function(i, row){
      var _id = row[_opts.idField];
  		_fixRowHeight(_target, _id);
    });
		_setHintNumber(_target);
		$(_target).treegrid("autoSizeColumn");
	};
	function _ajaxLoad(_target, _id, _queryParams, _isClear, _reloadCallBack)
	{
		var _opts = $.data(_target, "treegrid").options;
		var _body = $(_target).datagrid("getPanel").find("div.datagrid-body");
		var _queryParams = $.extend({}, _opts.queryParams);
		if (_opts.pagination) {
			$.extend(_queryParams, {
				pageIndex: _opts.pageNumber,
				pageSize: _opts.pageSize
			});
		}
		if (_opts.sortName) {
			$.extend(_queryParams, {
				sortName: _opts.sortName,
				sortOrder: _opts.sortOrder
			});
		}
		var row = _find(_target, _id);
		if (_opts.onBeforeLoad.call(_target, row, _queryParams) == false) {
			return;
		}
		if (_queryParams) {
			_opts.queryParams = _queryParams;
		}
		if (!_opts.url) {
			return;
		}
		var _nodeFolder = _body.find("tr[node-id=\"" + _id + "\"] span.tree-folder");
		_nodeFolder.addClass("tree-loading");

		var _params = String.toSerialize(_queryParams);
		var _params={loadinfo:_params};
    _params = $.extend(_params, _opts.attachParams);

    $(_target).treegrid("loading");
		var _result = _opts.loader.call(_target, _params,
		function (_data)
		{
			_nodeFolder.removeClass("tree-loading");
			$(_target).treegrid("loaded");
			_loadData(_target, _id, _data, _isClear);
			if (_reloadCallBack)
			{
				_reloadCallBack();
			}
		},
		function ()
		{
			_nodeFolder.removeClass("tree-loading");
			$(_target).treegrid("loaded");
			_opts.onLoadError.apply(_target, arguments);
			if (_reloadCallBack)
			{
				_reloadCallBack();
			}
		});
		if (_result == false)
		{
			_nodeFolder.removeClass("tree-loading");
			$(_target).treegrid("loaded");
		}
	};
	function _getRoot(_52)
	{
		var _53 = _getRoots(_52);
		if (_53.length)
		{
			return _53[0];
		} else
		{
			return null;
		}
	};
	function _getRoots(_55)
	{
		return $.data(_55, "treegrid").data;
	};
	function _getParent(_57, _58)
	{
		var row = _find(_57, _58);
		if (row._parentId)
		{
			return _find(_57, row._parentId);
		} else
		{
			return null;
		}
	};
	function _getChildren(_target, _5a)
	{
		var _opts = $.data(_target, "treegrid").options;
		var _body2 = $(_target).datagrid("getPanel").find("div.datagrid-view2 div.datagrid-body");
		var _5d = [];
		if (_5a)
		{
			_5e(_5a);
		} else
		{
			var _5f = _getRoots(_target);
			for (var i = 0; i < _5f.length; i++)
			{
				_5d.push(_5f[i]);
				_5e(_5f[i][_opts.idField]);
			}
		}
		function _5e(_60)
		{
			var _61 = _find(_target, _60);
			if (_61 && _61.children)
			{
				for (var i = 0,
				len = _61.children.length; i < len; i++)
				{
					var _62 = _61.children[i];
					_5d.push(_62);
					_5e(_62[_opts.idField]);
				}
			}
		};
		return _5d;
	};
	function _getSelected(_64)
	{
		var _65 = _getSelections(_64);
		if (_65.length)
		{
			return _65[0];
		} else
		{
			return null;
		}
	};
	function _getSelections(_67)
	{
		var _68 = [];
		var _69 = $(_67).datagrid("getPanel");
		_69.find("div.datagrid-view2 div.datagrid-body tr.datagrid-row-selected").each(function ()
		{
			var id = $(this).attr("node-id");
			_68.push(_find(_67, id));
		});
		return _68;
	};
	function _getLevel(_6b, _6c)
	{
		if (!_6c)
		{
			return 0;
		}
		var _6d = $.data(_6b, "treegrid").options;
		var _6e = $(_6b).datagrid("getPanel").children("div.datagrid-view");
		var _6f = _6e.find("div.datagrid-body tr[node-id=\"" + _6c + "\"]").children("td[field=\"" + _6d.treeField + "\"]");
		return _6f.find("span.tree-indent,span.tree-hit").length;
	};
	function _find(_target, _id)
	{
		var _opts = $.data(_target, "treegrid").options;
		var _data = $.data(_target, "treegrid").data;
		var cc = [_data];
		while (cc.length)
		{
			var c = cc.shift();
			for (var i = 0; i < c.length; i++)
			{
				var _row = c[i];
				if (_row[_opts.idField] == _id)
				{
					return _row;
				} else
				{
					if (_row["children"])
					{
						cc.push(_row["children"]);
					}
				}
			}
		}
		return null;
	};
	function _collapse(_target, _id)
	{
		var _opts = $.data(_target, "treegrid").options;
		var row = _find(_target, _id);
		var tr = _opts.finder.getTr(_target, _id);
		var hit = tr.find("span.tree-hit");
		if (hit.length == 0)
		{
			return;
		}
		if (hit.hasClass("tree-collapsed"))
		{
			return;
		}
		if (_opts.onBeforeCollapse.call(_target, row) == false)
		{
			return;
		}
		hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
		hit.next().removeClass("tree-folder-open");
		row.state = "closed";
		tr = tr.next("tr.treegrid-tr-tree");
		var cc = tr.children("td").children("div");
		if (_opts.animate)
		{
			cc.slideUp("normal",
			function ()
			{
				$(_target).treegrid("autoSizeColumn");
				_fixRowHeight(_target, _id);
				_opts.onCollapse.call(_target, row);
			});
		} else
		{
			cc.hide();
			$(_target).treegrid("autoSizeColumn");
			_fixRowHeight(_target, _id);
			_opts.onCollapse.call(_target, row);
		}
	};
	function _expand(_target, _id)
	{
		var _opts = $.data(_target, "treegrid").options;
		var tr = _opts.finder.getTr(_target, _id);
		var hit = tr.find("span.tree-hit");
		var row = _find(_target, _id);
		if (hit.length == 0)
		{
			return;
		}
		if (hit.hasClass("tree-expanded"))
		{
			return;
		}
		if (_opts.onBeforeExpand.call(_target, row) == false)
		{
			return;
		}
		hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
		hit.next().addClass("tree-folder-open");
		var _nextTree = tr.next("tr.treegrid-tr-tree");
		if (_nextTree.length)
		{
			var cc = _nextTree.children("td").children("div");
			_7e(cc);
		} else
		{
			_31(_target, row[_opts.idField]);
			var _nextTree = tr.next("tr.treegrid-tr-tree");
			var cc = _nextTree.children("td").children("div");
			cc.hide();
			var _7f = $.extend({},
			_opts.queryParams || {});
			_7f.id = row[_opts.idField];
			_ajaxLoad(_target, row[_opts.idField], _7f, true,
			function ()
			{
				if (cc.is(":empty"))
				{
					_nextTree.remove();
				} else
				{
					_7e(cc);
				}
			});
		}
		function _7e(cc)
		{
			row.state = "open";
			if (_opts.animate)
			{
				cc.slideDown("normal",
				function ()
				{
					$(_target).treegrid("autoSizeColumn");
					_fixRowHeight(_target, _id);
					_opts.onExpand.call(_target, row);
				});
			} else
			{
				cc.show();
				$(_target).treegrid("autoSizeColumn");
				_fixRowHeight(_target, _id);
				_opts.onExpand.call(_target, row);
			}
		};
	};
	function _toggle(_target, _81)
	{
		var _82 = $.data(_target, "treegrid").options;
		var tr = _82.finder.getTr(_target, _81);
		var hit = tr.find("span.tree-hit");
		if (hit.hasClass("tree-expanded"))
		{
			_collapse(_target, _81);
		} else
		{
			_expand(_target, _81);
		}
	};
	function _collapseAll(_target, _85)
	{
		var _86 = $.data(_target, "treegrid").options;
		var _87 = _getChildren(_target, _85);
		if (_85)
		{
			_87.unshift(_find(_target, _85));
		}
		for (var i = 0; i < _87.length; i++)
		{
			_collapse(_target, _87[i][_86.idField]);
		}
	};
	function _expandAll(_target, _8a)
	{
		var _8b = $.data(_target, "treegrid").options;
		var _8c = _getChildren(_target, _8a);
		if (_8a)
		{
			_8c.unshift(_find(_target, _8a));
		}
		for (var i = 0; i < _8c.length; i++)
		{
			_expand(_target, _8c[i][_8b.idField]);
		}
	};
	function _expandTo(_target, _8f)
	{
		var _90 = $.data(_target, "treegrid").options;
		var ids = [];
		var p = _getParent(_target, _8f);
		while (p)
		{
			var id = p[_90.idField];
			ids.unshift(id);
			p = _getParent(_target, id);
		}
		for (var i = 0; i < ids.length; i++)
		{
			_expand(_target, ids[i]);
		}
	};
	function _91(_target, _93)
	{
		var _94 = $.data(_target, "treegrid").options;
		if (_93.parent)
		{
			var tr = _94.finder.getTr(_target, _93.parent);
			if (tr.next("tr.treegrid-tr-tree").length == 0)
			{
				_31(_target, _93.parent);
			}
			var _95 = tr.children("td[field=\"" + _94.treeField + "\"]").children("div.datagrid-cell");
			var _96 = _95.children("span.tree-icon");
			if (_96.hasClass("tree-file"))
			{
				_96.removeClass("tree-file").addClass("tree-folder tree-folder-open");
				var hit = $("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_96);
				if (hit.prev().length)
				{
					hit.prev().remove();
				}
			}
		}
		_loadData(_target, _93.parent, _93.data, true);
	};
	function _insert(_target, _99)
	{
		var ref = _99.before || _99.after;
		var _9a = $.data(_target, "treegrid").options;
		var _9b = _getParent(_target, ref);
		_91(_target, {
			parent: (_9b ? _9b[_9a.idField] : null),
			data: [_99.data]
		});
		_9c(true);
		_9c(false);
		_setHintNumber(_target);
		function _9c(_9d)
		{
			var _9e = _9d ? 1 : 2;
			var tr = _9a.finder.getTr(_target, _99.data[_9a.idField], "body", _9e);
			var _9f = tr.closest("table.datagrid-btable");
			tr = tr.parent().children();
			var _a0 = _9a.finder.getTr(_target, ref, "body", _9e);
			if (_99.before)
			{
				tr.insertBefore(_a0);
			} else
			{
				var sub = _a0.next("tr.treegrid-tr-tree");
				tr.insertAfter(sub.length ? sub : _a0);
			}
			_9f.remove();
		};
	};
	function _remove(_target, _a3)
	{
		var _a4 = $.data(_target, "treegrid").options;
		var tr = _a4.finder.getTr(_target, _a3);
		tr.next("tr.treegrid-tr-tree").remove();
		tr.remove();
		var _a5 = del(_a3);
		if (_a5)
		{
			if (_a5.children.length == 0)
			{
				tr = _a4.finder.getTr(_target, _a5[_a4.idField]);
				tr.next("tr.treegrid-tr-tree").remove();
				var _a6 = tr.children("td[field=\"" + _a4.treeField + "\"]").children("div.datagrid-cell");
				_a6.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
				_a6.find(".tree-hit").remove();
				$("<span class=\"tree-indent\"></span>").prependTo(_a6);
			}
		}
		_setHintNumber(_target);
		function del(id)
		{
			var cc;
			var _a7 = _getParent(_target, _a3);
			if (_a7)
			{
				cc = _a7.children;
			} else
			{
				cc = $(_target).treegrid("getData");
			}
			for (var i = 0; i < cc.length; i++)
			{
				if (cc[i][_a4.idField] == id)
				{
					cc.splice(i, 1);
					break;
				}
			}
			return _a7;
		};
	};
	$.fn.treegrid = function (_options, _param)
	{
		if (typeof _options == "string")
		{
			var _method = $.fn.treegrid.methods[_options];
			if (_method)
			{
				return _method(this, _param);
			} else
			{
				return this.datagrid(_options, _param);
			}
		}
		_options = _options || {};
		var me=this.each(function ()
		{
			var _state = $.data(this, "treegrid");
      var _opts;
			if (_state)
			{
				_opts=$.extend(_state.options, _options);
			} else
			{
        _opts=$.extend({},
					$.fn.treegrid.defaults, $.fn.treegrid.parseOptions(this), _options, {
           currentRowInfo: {
              index: -1,
              row: null,	// 数据行
              fieldName: null,
              tr: null,
              td: null,
              rowBefore: null, //修改前数据备份数据
              id: null
            }
          });
				_state = $.data(this, "treegrid", {
					options: _opts,
					data: []
				});
			}
			_createDataGrid(this);
			if (_state.options.data)
			{
				$(this).treegrid("loadData", _state.options.data);
			}
      if (_opts.isInitLoadData && _opts.url)
      {
        _opts.isInitLoadData = false;
        _ajaxLoad(this);
      }
			_bindEvent(this);
		});

    $.each($.fn.datagrid.methods, function (name, body)
    {
      me[name] = function () 
      {
        var args = Array.prototype.slice.call(arguments);
        return body.apply($.fn.datagrid.methods, [me].concat(args)); 
      }
    });

    $.each($.fn.treegrid.methods, function (name, body)
    {
      me[name] = function () 
      {
        var args = Array.prototype.slice.call(arguments);
        return body.apply($.fn.treegrid.methods, [me].concat(args)); 
      }
    });

    _options.me = me;
    return me;
	};
	$.fn.treegrid.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "treegrid").options;
		},
		resize: function (jq, _ac)
		{
			return jq.each(function ()
			{
				$(this).datagrid("resize", _ac);
			});
		},
		fixRowHeight: function (jq, _ad)
		{
			return jq.each(function ()
			{
				_fixRowHeight(this, _ad);
			});
		},
		loadData: function (jq, _ae)
		{
			return jq.each(function ()
			{
				_loadData(this, _ae.parent, _ae);
			});
		},
		load: function (jq, _af)
		{
			return jq.each(function ()
			{
				$(this).treegrid("options").pageNumber = 1;
				$(this).treegrid("getPager").pagination({
					pageNumber: 1
				});
				$(this).treegrid("reload", _af);
			});
		},
		reload: function (jq, id)
		{
			return jq.each(function ()
			{
				var _opts = $(this).treegrid("options");
				var _b1 = {};
				if (typeof id == "object")
				{
					_b1 = id;
				} else
				{
					_b1 = $.extend({},
					_opts.queryParams);
					_b1.id = id;
				}
				if (_b1.id)
				{
					var _b2 = $(this).treegrid("find", _b1.id);
					if (_b2.children)
					{
						_b2.children.splice(0, _b2.children.length);
					}
					_opts.queryParams = _b1;
					var tr = _opts.finder.getTr(this, _b1.id);
					tr.next("tr.treegrid-tr-tree").remove();
					tr.find("span.tree-hit").removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
					_expand(this, _b1.id);
				} else
				{
					_ajaxLoad(this, null, _b1);
				}
			});
		},
		reloadFooter: function (jq, _b3)
		{
			return jq.each(function ()
			{
				var _b4 = $.data(this, "treegrid").options;
				var dc = $.data(this, "datagrid").dc;
				if (_b3)
				{
					$.data(this, "treegrid").footer = _b3;
				}
				if (_b4.showFooter)
				{
					_b4.view.renderFooter.call(_b4.view, this, dc.footer1, true);
					_b4.view.renderFooter.call(_b4.view, this, dc.footer2, false);
					if (_b4.view.onAfterRender)
					{
						_b4.view.onAfterRender.call(_b4.view, this);
					}
					$(this).treegrid("fixRowHeight");
				}
			});
		},
		getData: function (jq)
		{
			return $.data(jq[0], "treegrid").data;
		},
		getFooterRows: function (jq)
		{
			return $.data(jq[0], "treegrid").footer;
		},
		getRoot: function (jq)
		{
			return _getRoot(jq[0]);
		},
		getRoots: function (jq)
		{
			return _getRoots(jq[0]);
		},
		getParent: function (jq, id)
		{
			return _getParent(jq[0], id);
		},
		getChildren: function (jq, id)
		{
			return _getChildren(jq[0], id);
		},
		getSelected: function (jq)
		{
			return _getSelected(jq[0]);
		},
		getSelections: function (jq)
		{
			return _getSelections(jq[0]);
		},
		getLevel: function (jq, id)
		{
			return _getLevel(jq[0], id);
		},
		find: function (jq, id)
		{
			return _find(jq[0], id);
		},
		isLeaf: function (jq, id)
		{
			var _opts = $.data(jq[0], "treegrid").options;
			var tr = _opts.finder.getTr(jq[0], id);
			var hit = tr.find("span.tree-hit");
			return hit.length == 0;
		},
		select: function (jq, id)
		{
			return jq.each(function ()
			{
				$(this).datagrid("selectRow", id);
			});
		},
		unselect: function (jq, id)
		{
			return jq.each(function ()
			{
				$(this).datagrid("unselectRow", id);
			});
		},
		collapse: function (jq, id)
		{
			return jq.each(function ()
			{
				_collapse(this, id);
			});
		},
		expand: function (jq, id)
		{
			return jq.each(function ()
			{
				_expand(this, id);
			});
		},
		toggle: function (jq, id)
		{
			return jq.each(function ()
			{
				_toggle(this, id);
			});
		},
		collapseAll: function (jq, id)
		{
			return jq.each(function ()
			{
				_collapseAll(this, id);
			});
		},
		expandAll: function (jq, id)
		{
			return jq.each(function ()
			{
				_expandAll(this, id);
			});
		},
		expandTo: function (jq, id)
		{
			return jq.each(function ()
			{
				_expandTo(this, id);
			});
		},
		append: function (jq, _b6)
		{
			return jq.each(function ()
			{
				_91(this, _b6);
			});
		},
		insert: function (jq, _b7)
		{
			return jq.each(function ()
			{
				_insert(this, _b7);
			});
		},
		remove: function (jq, id)
		{
			return jq.each(function ()
			{
				_remove(this, id);
			});
		},
		pop: function (jq, id)
		{
			var row = jq.treegrid("find", id);
			jq.treegrid("remove", id);
			return row;
		},
		refresh: function (jq, id)
		{
			return jq.each(function ()
			{
				var _opts = $.data(this, "treegrid").options;
				_opts.view.refreshRow.call(_opts.view, this, id);
			});
		},
		update: function (jq, _b9)
		{
			return jq.each(function ()
			{
				var _opts = $.data(this, "treegrid").options;
				_opts.view.updateRow.call(_opts.view, this, _b9.id, _b9.row);
			});
		},
		beginEdit: function (jq, id)
		{
			return jq.each(function ()
			{
				$(this).datagrid("beginEdit", id);
				$(this).treegrid("fixRowHeight", id);
			});
		},
		endEdit: function (jq, id)
		{
			return jq.each(function ()
			{
				$(this).datagrid("endEdit", id);
			});
		},
		cancelEdit: function (jq, id)
		{
			return jq.each(function ()
			{
				$(this).datagrid("cancelEdit", id);
			});
		}
	};
	$.fn.treegrid.parseOptions = function (_bb)
	{
		return $.extend({},
		$.fn.datagrid.parseOptions(_bb), $.parser.parseOptions(_bb, ["treeField", {
			animate: "boolean"
		}]));
	};
	var _bc = $.extend({},
	$.fn.datagrid.defaults.view, {
		render: function (_target, _be, _bf)
		{
			var _opts = $.data(_target, "treegrid").options;
			var _c1 = $(_target).datagrid("getColumnFields", _bf);
			var _rowIdPrefix = $.data(_target, "datagrid").rowIdPrefix;
			if (_bf)
			{
				if (!(_opts.rownumbers || (_opts.frozenColumns && _opts.frozenColumns.length)))
				{
					return;
				}
			}
			var _c3 = 0;
			var _c4 = this;
			var _c5 = _c6(_bf, this.treeLevel, this.treeNodes);
			$(_be).append(_c5.join(""));
			function _c6(_c7, _c8, _c9)
			{
				var _ca = ["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
				for (var i = 0; i < _c9.length; i++)
				{
					var row = _c9[i];
					if (row.state != "open" && row.state != "closed")
					{
						row.state = "open";
					}
					var css = _opts.rowStyler ? _opts.rowStyler.call(_target, row) : "";
					var _cb = "";
					var _cc = "";
					if (typeof css == "string")
					{
						_cc = css;
					} else
					{
						if (css)
						{
							_cb = css["class"] || "";
							_cc = css["style"] || "";
						}
					}
					var cls = "class=\"datagrid-row " + (_c3++ % 2 && _opts.striped ? "datagrid-row-alt " : " ") + _cb + "\"";
					var _cd = _cc ? "style=\"" + _cc + "\"" : "";
					var _ce = _rowIdPrefix + "-" + (_c7 ? 1 : 2) + "-" + row[_opts.idField];
					_ca.push("<tr id=\"" + _ce + "\" node-id=\"" + row[_opts.idField] + "\" " + cls + " " + _cd + ">");
					_ca = _ca.concat(_c4.renderRow.call(_c4, _target, _c1, _c7, _c8, row));
					_ca.push("</tr>");
					if (row.children && row.children.length)
					{
						var tt = _c6(_c7, _c8 + 1, row.children);
						var v = row.state == "closed" ? "none" : "block";
						_ca.push("<tr class=\"treegrid-tr-tree\"><td style=\"border:0px\" colspan=" + (_c1.length + (_opts.rownumbers ? 1 : 0)) + "><div style=\"display:" + v + "\">");
						_ca = _ca.concat(tt);
						_ca.push("</div></td></tr>");
					}
				}
				_ca.push("</tbody></table>");
				return _ca;
			};
		},
		renderFooter: function (_target, _d0, _d1)
		{
			var _d2 = $.data(_target, "treegrid").options;
			var _d3 = $.data(_target, "treegrid").footer || [];
			var _d4 = $(_target).datagrid("getColumnFields", _d1);
			var _d5 = ["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
			for (var i = 0; i < _d3.length; i++)
			{
				var row = _d3[i];
				row[_d2.idField] = row[_d2.idField] || ("foot-row-id" + i);
				_d5.push("<tr class=\"datagrid-row\" node-id=\"" + row[_d2.idField] + "\">");
				_d5.push(this.renderRow.call(this, _target, _d4, _d1, 0, row));
				_d5.push("</tr>");
			}
			_d5.push("</tbody></table>");
			$(_d0).html(_d5.join(""));
		},
		renderRow: function (_target, _fields, _frozen, _rowIndex, row)
		{
			var _opts = $.data(_target, "treegrid").options;
			var cc = [];
			if (_frozen && _opts.rownumbers)
			{
				cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">0</div></td>");
			}
			for (var i = 0; i < _fields.length; i++)
			{
				var _db = _fields[i];
				var col = $(_target).datagrid("getColumnOption", _db);
				if (col)
				{
					var css = col.styler ? (col.styler(row[_db], row) || "") : "";
					var _dc = "";
					var _dd = "";
					if (typeof css == "string")
					{
						_dd = css;
					} else
					{
						if (cc)
						{
							_dc = css["class"] || "";
							_dd = css["style"] || "";
						}
					}
					var cls = _dc ? "class=\"" + _dc + "\"" : "";
					var _de = col.hidden ? "style=\"display:none;" + _dd + "\"" : (_dd ? "style=\"" + _dd + "\"" : "");
					cc.push("<td field=\"" + _db + "\" " + cls + " " + _de + ">");
					if (col.checkbox)
					{
						var _de = "";
					} else
					{
						var _de = _dd;
						if (col.align)
						{
							_de += ";text-align:" + col.align + ";";
						}
						if (!_opts.nowrap)
						{
							_de += ";white-space:normal;height:auto;";
						} else
						{
							if (_opts.autoRowHeight)
							{
								_de += ";height:auto;";
							}
						}
					}
					cc.push("<div style=\"" + _de + "\" ");
					if (col.checkbox)
					{
						cc.push("class=\"datagrid-cell-check ");
					} else
					{
						cc.push("class=\"datagrid-cell " + col.cellClass);
					}
					cc.push("\">");
					if (col.checkbox)
					{
						if (row.checked)
						{
							cc.push("<input type=\"checkbox\" checked=\"checked\"");
						} else
						{
							cc.push("<input type=\"checkbox\"");
						}
						cc.push(" name=\"" + _db + "\" value=\"" + (row[_db] != undefined ? row[_db] : "") + "\"/>");
					} else
					{
						var val = null;
						if (col.formatter)
						{
							val = col.formatter(row[_db], row);
						} else
						{
							val = row[_db];
						}
						if (_db == _opts.treeField)
						{
							for (var j = 0; j < _rowIndex; j++)
							{
								cc.push("<span class=\"tree-indent\"></span>");
							}
							if (row.state == "closed")
							{
								cc.push("<span class=\"tree-hit tree-collapsed\"></span>");
								cc.push("<span class=\"tree-icon tree-folder " + (row.iconCls ? row.iconCls : "") + "\"></span>");
							} else
							{
								if (row.children && row.children.length)
								{
									cc.push("<span class=\"tree-hit tree-expanded\"></span>");
									cc.push("<span class=\"tree-icon tree-folder tree-folder-open " + (row.iconCls ? row.iconCls : "") + "\"></span>");
								} else
								{
									cc.push("<span class=\"tree-indent\"></span>");
									cc.push("<span class=\"tree-icon tree-file " + (row.iconCls ? row.iconCls : "") + "\"></span>");
								}
							}
							cc.push("<span class=\"tree-title\">" + val + "</span>");
						} else
						{
							cc.push(val);
						}
					}
					cc.push("</div>");
					cc.push("</td>");
				}
			}
			return cc.join("");
		},
		refreshRow: function (_df, id)
		{
			this.updateRow.call(this, _df, id, {});
		},
		updateRow: function (_e0, id, row)
		{
			var _e1 = $.data(_e0, "treegrid").options;
			var _e2 = $(_e0).treegrid("find", id);
			$.extend(_e2, row);
			var _e3 = $(_e0).treegrid("getLevel", id) - 1;
			var _e4 = _e1.rowStyler ? _e1.rowStyler.call(_e0, _e2) : "";
			function _e5(_e6)
			{
				var _e7 = $(_e0).treegrid("getColumnFields", _e6);
				var tr = _e1.finder.getTr(_e0, id, "body", (_e6 ? 1 : 2));
				var _e8 = tr.find("div.datagrid-cell-rownumber").html();
				var _e9 = tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
				tr.html(this.renderRow(_e0, _e7, _e6, _e3, _e2));
				tr.attr("style", _e4 || "");
				tr.find("div.datagrid-cell-rownumber").html(_e8);
				if (_e9)
				{
					tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked", true);
				}
			};
			_e5.call(this, true);
			_e5.call(this, false);
			$(_e0).treegrid("fixRowHeight", id);
		},
		onBeforeRender: function (_ea, _eb, _ec)
		{
			if ($.isArray(_eb))
			{
				_ec = {
					total: _eb.length,
					rows: _eb
				};
				_eb = null;
			}
			if (!_ec)
			{
				return false;
			}
			var _ed = $.data(_ea, "treegrid");
			var _ee = _ed.options;
			if (_ec.length == undefined)
			{
				if (_ec.footer)
				{
					_ed.footer = _ec.footer;
				}
				if (_ec.total)
				{
					_ed.total = _ec.total;
				}
				_ec = this.transfer(_ea, _eb, _ec.rows);
			} else
			{
				function _ef(_f0, _f1)
				{
					for (var i = 0; i < _f0.length; i++)
					{
						var row = _f0[i];
						row._parentId = _f1;
						if (row.children && row.children.length)
						{
							_ef(row.children, row[_ee.idField]);
						}
					}
				};
				_ef(_ec, _eb);
			}
			var _f2 = _find(_ea, _eb);
			if (_f2)
			{
				if (_f2.children)
				{
					_f2.children = _f2.children.concat(_ec);
				} else
				{
					_f2.children = _ec;
				}
			} else
			{
				_ed.data = _ed.data.concat(_ec);
			}
			this.sort(_ea, _ec);
			this.treeNodes = _ec;
			this.treeLevel = $(_ea).treegrid("getLevel", _eb);
		},
		sort: function (_f3, _f4)
		{
			var _f5 = $.data(_f3, "treegrid").options;
			if (!_f5.remoteSort && _f5.sortName)
			{
				var _f6 = _f5.sortName.split(",");
				var _f7 = _f5.sortOrder.split(",");
				_f8(_f4);
			}
			function _f8(_f9)
			{
				_f9.sort(function (r1, r2)
				{
					var r = 0;
					for (var i = 0; i < _f6.length; i++)
					{
						var sn = _f6[i];
						var so = _f7[i];
						var col = $(_f3).treegrid("getColumnOption", sn);
						var _fa = col.sorter ||
						function (a, b)
						{
							return a == b ? 0 : (a > b ? 1 : -1);
						};
						r = _fa(r1[sn], r2[sn]) * (so == "asc" ? 1 : -1);
						if (r != 0)
						{
							return r;
						}
					}
					return r;
				});
				for (var i = 0; i < _f9.length; i++)
				{
					var _fb = _f9[i].children;
					if (_fb && _fb.length)
					{
						_f8(_fb);
					}
				}
			};
		},
		transfer: function (_fc, _fd, _fe)
		{
			var _ff = $.data(_fc, "treegrid").options;
			var rows = [];
			for (var i = 0; i < _fe.length; i++)
			{
				rows.push(_fe[i]);
			}
			var _100 = [];
			for (var i = 0; i < rows.length; i++)
			{
				var row = rows[i];
				if (!_fd)
				{
					if (!row._parentId)
					{
						_100.push(row);
						rows.splice(i, 1);
						i--;
					}
				} else
				{
					if (row._parentId == _fd)
					{
						_100.push(row);
						rows.splice(i, 1);
						i--;
					}
				}
			}
			var toDo = [];
			for (var i = 0; i < _100.length; i++)
			{
				toDo.push(_100[i]);
			}
			while (toDo.length)
			{
				var node = toDo.shift();
				for (var i = 0; i < rows.length; i++)
				{
					var row = rows[i];
					if (row._parentId == node[_ff.idField])
					{
						if (node.children)
						{
							node.children.push(row);
						} else
						{
							node.children = [row];
						}
						toDo.push(row);
						rows.splice(i, 1);
						i--;
					}
				}
			}
			return _100;
		}
	});
	$.fn.treegrid.defaults = $.extend({},
	$.fn.datagrid.defaults, {
		treeField: null,
		animate: false,
		singleSelect: false,
		view: _bc,
		loader: function (_queryParams, _successCallback, _errorCallback)
		{
			var opts = $(this).treegrid("options");
			if (!opts.url)
			{
				return false;
			}
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: _queryParams,
				dataType: "json",
				success: function (data)
				{
					_successCallback(data);
				},
				error: function ()
				{
					_errorCallback.apply(this, arguments);
				}
			});
		},
		loadFilter: function(data, id) {
      var _opts = $.data(this, "treegrid").options;
      function changeDateTime(rows)
      {
        //转换日期格式
        for (var i = 0; i < rows.length; i++)
        {
          var row = rows[i];
          var _cols = _opts.columns[0];
          for (var j = 0; j < _cols.length; j++)
          {
            var col = _cols[j];
            var _value = row[col.field];
            if (typeof (_value) == "string" && _value.indexOf("/Date(") == 0)
            {
              _value = _value.replace(/\//g, "").replace("Date", "new Date");
              row[col.field] = Globals.formatDate(_value, "yyyy-MM-dd HH:mm:ss");
            }
            else
            {
              switch (col.datatype)
              {
                case 'Int16':
                case 'Int32':
                case 'Int64':
                case 'Single':
                case 'Byte':
                case 'ByteArray':
                  row[col.field] = _value?parseInt(_value):_value;
                  break;
                case 'Decimal':
                case 'Double':
                  row[col.field] = _value?parseFloat(_value):_value;
                  break;
              }
            }
          }
        }
      }

      if (typeof data.length == "number" && typeof data.splice == "function")
      {
        changeDateTime(data);
        return {
          total: data.length,
          rows: data
        };
      }
      else
      {
        changeDateTime(data.rows);
        $.data(this, "datagrid").data=data;
        return data;
      }
		},
		finder: {
			getTr: function (_target, id, type, _isFrozen)
			{
				type = type || "body";
				_isFrozen = _isFrozen || 0;
				var dc = $.data(_target, "datagrid").dc;
				if (_isFrozen == 0)
				{
					var opts = $.data(_target, "treegrid").options;
					var tr1 = opts.finder.getTr(_target, id, type, 1);
					var tr2 = opts.finder.getTr(_target, id, type, 2);
					return tr1.add(tr2);
				} else
				{
					if (type == "body")
					{
						var tr = $("#" + $.data(_target, "datagrid").rowIdPrefix + "-" + _isFrozen + "-" + id);
						if (!tr.length)
						{
							tr = (_isFrozen == 1 ? dc.body1 : dc.body2).find("tr[node-id=\"" + id + "\"]");
						}
						return tr;
					} else
					{
						if (type == "footer")
						{
							return (_isFrozen == 1 ? dc.footer1 : dc.footer2).find("tr[node-id=\"" + id + "\"]");
						} else
						{
							if (type == "selected")
							{
								return (_isFrozen == 1 ? dc.body1 : dc.body2).find("tr.datagrid-row-selected");
							} else
							{
								if (type == "highlight")
								{
									return (_isFrozen == 1 ? dc.body1 : dc.body2).find("tr.datagrid-row-over");
								} else
								{
									if (type == "checked")
									{
										return (_isFrozen == 1 ? dc.body1 : dc.body2).find("tr.datagrid-row:has(div.datagrid-cell-check input:checked)");
									} else
									{
										if (type == "last")
										{
											return (_isFrozen == 1 ? dc.body1 : dc.body2).find("tr:last[node-id]");
										} else
										{
											if (type == "allbody")
											{
												return (_isFrozen == 1 ? dc.body1 : dc.body2).find("tr[node-id]");
											} else
											{
												if (type == "allfooter")
												{
													return (_isFrozen == 1 ? dc.footer1 : dc.footer2).find("tr[node-id]");
												}
											}
										}
									}
								}
							}
						}
					}
				}
			},
			getRow: function (_107, p)
			{
				var id = (typeof p == "object") ? p.attr("node-id") : p;
				return $(_107).treegrid("find", id);
			}
		},
		onBeforeLoad: function (row, _108) { },
		onLoadSuccess: function (row, data) { },
		onLoadError: function () { },
		onBeforeCollapse: function (row) { },
		onCollapse: function (row) { },
		onBeforeExpand: function (row) { },
		onExpand: function (row) { },
		onClickRow: function (row) { },
		onDblClickRow: function (row) { },
		onClickCell: function (_109, row) { },
		onDblClickCell: function (_10a, row) { },
		onContextMenu: function (e, row) { },
		onBeforeEdit: function (row) { },
		onAfterEdit: function (row, _10b) { },
		onCancelEdit: function (row) { }
	});
})(jQuery);

(function ($)
{
	var _1;
	function _2(_3)
	{
		var _4 = $.data(_3, "propertygrid");
		var _5 = $.data(_3, "propertygrid").options;
		$(_3).datagrid($.extend({},
		_5, {
			cls: "propertygrid",
			view: (_5.showGroup ? _6 : undefined),
			onClickRow: function (_7, _8)
			{
				if (_1 != this)
				{
					_c(_1);
					_1 = this;
				}
				if (_5.editIndex != _7 && _8.editor)
				{
					var _9 = $(this).datagrid("getColumnOption", "value");
					_9.editor = _8.editor;
					_c(_1);
					$(this).datagrid("beginEdit", _7);
					$(this).datagrid("getEditors", _7)[0].target.focus();
					_5.editIndex = _7;
				}
				_5.onClickRow.call(_3, _7, _8);
			},
			loadFilter: function (_a)
			{
				_c(this);
				return _5.loadFilter.call(this, _a);
			},
			onLoadSuccess: function (_b)
			{
				$(_3).datagrid("getPanel").find("div.datagrid-group").attr("style", "");
				_5.onLoadSuccess.call(_3, _b);
			}
		}));
		$(document).unbind(".propertygrid").bind("mousedown.propertygrid",
		function (e)
		{
			var p = $(e.target).closest("div.datagrid-view,div.combo-panel");
			if (p.length)
			{
				return;
			}
			_c(_1);
			_1 = undefined;
		});
	};
	function _c(_d)
	{
		var t = $(_d);
		if (!t.length)
		{
			return;
		}
		var _e = $.data(_d, "propertygrid").options;
		var _f = _e.editIndex;
		if (_f == undefined)
		{
			return;
		}
		var ed = t.datagrid("getEditors", _f)[0];
		if (ed)
		{
			ed.target.blur();
			if (t.datagrid("validateRow", _f))
			{
				t.datagrid("endEdit", _f);
			} else
			{
				t.datagrid("cancelEdit", _f);
			}
		}
		_e.editIndex = undefined;
	};
	$.fn.propertygrid = function (_10, _11)
	{
		if (typeof _10 == "string")
		{
			var _12 = $.fn.propertygrid.methods[_10];
			if (_12)
			{
				return _12(this, _11);
			} else
			{
				return this.datagrid(_10, _11);
			}
		}
		_10 = _10 || {};
		return this.each(function ()
		{
			var _13 = $.data(this, "propertygrid");
			if (_13)
			{
				$.extend(_13.options, _10);
			} else
			{
				var _14 = $.extend({},
				$.fn.propertygrid.defaults, $.fn.propertygrid.parseOptions(this), _10);
				_14.frozenColumns = $.extend(true, [], _14.frozenColumns);
				_14.columns = $.extend(true, [], _14.columns);
				$.data(this, "propertygrid", {
					options: _14
				});
			}
			_2(this);
		});
	};
	$.fn.propertygrid.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "propertygrid").options;
		}
	};
	$.fn.propertygrid.parseOptions = function (_15)
	{
		var t = $(_15);
		return $.extend({},
		$.fn.datagrid.parseOptions(_15), $.parser.parseOptions(_15, [{
			showGroup: "boolean"
		}]));
	};
	var _6 = $.extend({},
	$.fn.datagrid.defaults.view, {
		render: function (_16, _state, _proxy)
		{
			var _opts = $.data(_16, "datagrid");
			var _1a = _opts.options;
			var _1b = _opts.data.rows;
			var _1c = $(_16).datagrid("getColumnFields", _proxy);
			var _1d = [];
			var _1e = 0;
			var _1f = this.groups;
			for (var i = 0; i < _1f.length; i++)
			{
				var _20 = _1f[i];
				_1d.push("<div class=\"datagrid-group\" group-index=" + i + " style=\"height:25px;overflow:hidden;border-bottom:1px solid #ccc;\">");
				_1d.push("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"height:100%\"><tbody>");
				_1d.push("<tr>");
				_1d.push("<td style=\"border:0;\">");
				if (!_proxy)
				{
					_1d.push("<span style=\"color:#666;font-weight:bold;\">");
					_1d.push(_1a.groupFormatter.call(_16, _20.fvalue, _20.rows));
					_1d.push("</span>");
				}
				_1d.push("</td>");
				_1d.push("</tr>");
				_1d.push("</tbody></table>");
				_1d.push("</div>");
				_1d.push("<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>");
				for (var j = 0; j < _20.rows.length; j++)
				{
					var cls = (_1e % 2 && _1a.striped) ? "class=\"datagrid-row datagrid-row-alt\"" : "class=\"datagrid-row\"";
					var _target = _1a.rowStyler ? _1a.rowStyler.call(_16, _1e, _20.rows[j]) : "";
					var _index = _target ? "style=\"" + _target + "\"" : "";
					var _opts = _opts.rowIdPrefix + "-" + (_proxy ? 1 : 2) + "-" + _1e;
					_1d.push("<tr id=\"" + _opts + "\" datagrid-row-index=\"" + _1e + "\" " + cls + " " + _index + ">");
					_1d.push(this.renderRow.call(this, _16, _1c, _proxy, _1e, _20.rows[j]));
					_1d.push("</tr>");
					_1e++;
				}
				_1d.push("</tbody></table>");
			}
			$(_state).html(_1d.join(""));
		},
		onAfterRender: function (_24)
		{
			var _25 = $.data(_24, "datagrid").options;
			var dc = $.data(_24, "datagrid").dc;
			var _26 = dc.view;
			var _27 = dc.view1;
			var _28 = dc.view2;
			$.fn.datagrid.defaults.view.onAfterRender.call(this, _24);
			if (_25.rownumbers || _25.frozenColumns.length)
			{
				var _29 = _27.find("div.datagrid-group");
			} else
			{
				var _29 = _28.find("div.datagrid-group");
			}
			$("<td style=\"border:0;text-align:center;width:25px\"><span class=\"datagrid-row-expander datagrid-row-collapse\" style=\"display:inline-block;width:16px;height:16px;cursor:pointer\">&nbsp;</span></td>").insertBefore(_29.find("td"));
			_26.find("div.datagrid-group").each(function ()
			{
				var _2a = $(this).attr("group-index");
				$(this).find("span.datagrid-row-expander").bind("click", {
					groupIndex: _2a
				},
				function (e)
				{
					if ($(this).hasClass("datagrid-row-collapse"))
					{
						$(_24).datagrid("collapseGroup", e.data.groupIndex);
					} else
					{
						$(_24).datagrid("expandGroup", e.data.groupIndex);
					}
				});
			});
		},
		onBeforeRender: function (_2b, _2c)
		{
			var _2d = $.data(_2b, "datagrid").options;
			var _2e = [];
			for (var i = 0; i < _2c.length; i++)
			{
				var row = _2c[i];
				var _2f = _30(row[_2d.groupField]);
				if (!_2f)
				{
					_2f = {
						fvalue: row[_2d.groupField],
						rows: [row],
						startRow: i
					};
					_2e.push(_2f);
				} else
				{
					_2f.rows.push(row);
				}
			}
			function _30(_31)
			{
				for (var i = 0; i < _2e.length; i++)
				{
					var _32 = _2e[i];
					if (_32.fvalue == _31)
					{
						return _32;
					}
				}
				return null;
			};
			this.groups = _2e;
			var _33 = [];
			for (var i = 0; i < _2e.length; i++)
			{
				var _2f = _2e[i];
				for (var j = 0; j < _2f.rows.length; j++)
				{
					_33.push(_2f.rows[j]);
				}
			}
			$.data(_2b, "datagrid").data.rows = _33;
		}
	});
	$.extend($.fn.datagrid.methods, {
		expandGroup: function (jq, _34)
		{
			return jq.each(function ()
			{
				var _35 = $.data(this, "datagrid").dc.view;
				if (_34 != undefined)
				{
					var _36 = _35.find("div.datagrid-group[group-index=\"" + _34 + "\"]");
				} else
				{
					var _36 = _35.find("div.datagrid-group");
				}
				var _37 = _36.find("span.datagrid-row-expander");
				if (_37.hasClass("datagrid-row-expand"))
				{
					_37.removeClass("datagrid-row-expand").addClass("datagrid-row-collapse");
					_36.next("table").show();
				}
				$(this).datagrid("fixRowHeight");
			});
		},
		collapseGroup: function (jq, _38)
		{
			return jq.each(function ()
			{
				var _39 = $.data(this, "datagrid").dc.view;
				if (_38 != undefined)
				{
					var _3a = _39.find("div.datagrid-group[group-index=\"" + _38 + "\"]");
				} else
				{
					var _3a = _39.find("div.datagrid-group");
				}
				var _3b = _3a.find("span.datagrid-row-expander");
				if (_3b.hasClass("datagrid-row-collapse"))
				{
					_3b.removeClass("datagrid-row-collapse").addClass("datagrid-row-expand");
					_3a.next("table").hide();
				}
				$(this).datagrid("fixRowHeight");
			});
		}
	});
	$.fn.propertygrid.defaults = $.extend({},
	$.fn.datagrid.defaults, {
		singleSelect: true,
		remoteSort: false,
		fitColumns: true,
		loadMsg: "",
		frozenColumns: [[{
			field: "f",
			width: 16,
			resizable: false
		}]],
		columns: [[{
			field: "name",
			title: "Name",
			width: 100,
			sortable: true
		},
		{
			field: "value",
			title: "Value",
			width: 100,
			resizable: false
		}]],
		showGroup: false,
		groupField: "group",
		groupFormatter: function (_3c, _3d)
		{
			return _3c;
		}
	});
})(jQuery);
/**
* jQuery EasyUI 1.2.4
* Extend To superselector.js
* autor: xietianbao
* date: 2012-02-24
*/

(function ($)
{
  function _bindEvent(_target)
  {
    var _state = $.data(_target, "superselector");
    var _opts = _state.options;
    var _editor = _state.editor;

    $("form input,form textarea", _target).bind("focus", function ()
    {
      if ($(this).hasClass("inpreadonly")) return;

      if ($(this).hasClass("combo-text"))
      {
        $(this).parent().addClass("inp-focus");
        $(this).select();
      }
      else
      {
        $(this).addClass("inp-focus").select();
      }
    }).bind("blur", function ()
    {
      if ($(this).hasClass("combo-text"))
      {
        $(this).parent().removeClass("inp-focus");
      }
      else
      {
        $(this).removeClass("inp-focus");
      }
    }).keydown(function (e)
    {
      if (e.keyCode == 13) window.event.keyCode = 9;
    }).bind("change", function (e)
    {
      _setValue(_target, this.id, this.value);
    });
  };

  //通过字段名查找字段属性对象
  function _findField(_target, _fieldName)
  {
    var _state = $.data(_target, "superselector");
    var _opts = _state.options;
    var _columns = _opts.columns;

    for (var i = 0; i < _columns.length; i++)
    {
      var _fname = _columns[i].field;
      if (_fname == _fieldName) return _columns[i];
    }
    return null;
  }

  //设置值
  function _setValue(_target, _fieldName, _newValue)
  {
    var _state = $.data(_target, "superselector");
    var _opts = _state.options;

    var _colInfo = _findField(_target, _fieldName);
		var _oldValue = _state.dataRecord[_fieldName];	//改变前值

    //设置数值
    if (_colInfo && "Int32,Int64,Byte".indexOf(_colInfo.dataType) >= 0)
    {
      if (_newValue === '') _newValue = null;
      if (_colInfo && _colInfo.nullable == 0 && _newValue == null)		//不能为空
      {
        _state.dataRecord[_fieldName] = 0;
      }
      else
      {
        _state.dataRecord[_fieldName] = _newValue==null?_newValue:parseInt(_newValue);
      }
    }
    else if (_colInfo && "Decimal,Double,Single".indexOf(_colInfo.dataType) >= 0)
    {
      if (_newValue === '') _newValue = null;
      if (_colInfo && _colInfo.nullable == 0 && _newValue == null)		//不能为空
      {
        _state.dataRecord[_fieldName] = 0;
      }
      else
      {
        _state.dataRecord[_fieldName] = _newValue==null?_newValue:parseFloat(_newValue);
      }
    }
    else if (_colInfo && "String".indexOf(_colInfo.dataType) >= 0 && _newValue == null)
    {
      _state.dataRecord[_fieldName] = '';
    }
    else if (_colInfo && "DateTime".indexOf(_colInfo.dataType) >= 0)
    {
      _state.dataRecord[_fieldName] = _newValue;
    }
    else
    {
      _state.dataRecord[_fieldName] = _newValue;
    }

    var _input=$("#" + _fieldName)[0];
    if (_input && _input.jme && _input.jme.hasClass("datetimebox-f"))
    {
      _input.jme.datetimebox("setValue", _newValue);
    }
    else if (_input && _input.jme && _input.jme.hasClass("combogrid-f"))
    {
      _input.jme.combogrid("setValue", _newValue);
    }
    else if (_input && _input.jme && _input.jme.hasClass("combo-text") 
      && !_input.jme.hasClass("combotree-f"))
    {
      var _opts = _input.jme.combobox("options");
      var text = _input.jme.combobox("translator", _newValue);
      _input.jme.combobox("setValue", _newValue);
      _input.jme.combobox("setText", text);
    }
    else
    {
      $("#" + _fieldName).val(_newValue);
    }

    //校验数据有效性
    if ($("#" + _fieldName).hasClass("validatebox-text") && _colInfo && _colInfo.validatebox)
    {
      $("#" + _fieldName).validatebox("validate");
    }
  }

  //转换特殊数值
  function _transferData(_target)
  {
    var _state = $.data(_target, "superselector");
    var _opts = _state.options;
    var _masterCurrentRow = _state.dataRecord;
    var _columns = _opts.columns;

    for (var _fieldName in _masterCurrentRow)
    {
      var col = _findField(_target, _fieldName);
      var _value = _masterCurrentRow[_fieldName];
      if (typeof (_value) == "string" && _value.indexOf("/Date(") == 0)
      {
        _value = _value.replace(/\//g, "").replace("Date", "new Date");
        _state.dataRecord[_fieldName] = Globals.formatDate(_value, "yyyy-MM-dd HH:mm:ss");
      }
    }
  }

  function _initEditor(_target)
  {
    var _state = $.data(_target, "superselector");
    var _opts = _state.options;
    var _editor = _state.editor;

    $("form input,form textarea", _target).each(function ()
    {
      var _value = _state.dataRecord[this.id];
      if (_value == null) _value = '';
      if (this.jme && this.jme.hasClass("combo-text"))
      {
        var _opts = this.jme.combobox("options");
        var text = this.jme.combobox("translator", _value);
        this.jme.combobox("setValue", _value);
        this.jme.combobox("setText", text);
      }
      else
      {
        this.value = _value;
      }
    });
  }

  //解析数据
  function _parserData(_target, _jsondata)
  {
    var _state = $.data(_target, "superselector");
    _state.dataRecord = _jsondata;
    _transferData(_target);
    _initEditor(_target);
  }

  function _checkValid(_target)
  {
    var _state = $.data(_target, "superselector");
    var _opts = _state.options;
    var _editor = _state.editor;
    var _masterDataRow = _state.dataRecord;

    var invalidbox = $("form input.validatebox-invalid", _target);

    invalidbox.each(function ()
    {
      $(this).validatebox("validate");
      var col = _findField(_target, this.id);
      var msg = "【" + col.title + "】数据验证不通过，请正确填写！";
      $("#msgregion").html(msg).css({ color: "red" });
      var me = this;
      $("#messagewin").window(
			{
			  onClose: function ()
			  {
			    me.focus();
			    $("#messagewin").window({ onClose: function () { } });
			  }
			});
      $("#messagewin").window('open');

      return false;
    });
    if (invalidbox.length > 0)
    {
      return false;
    }

    return true;
  }

  function _wrapGrid(_target)
  {
    return {
      toolbarpanel: null,
      editor: $(_target)
    };
  };

  function _createGrid(_target)
  {
    var _state = $.data(_target, "superselector");
    var _opts = _state.options;
    var _editor = $.data(_target, "superselector").editor;

    for (var i = 0; i < _opts.columns.length; i++)
    {
      var col = _opts.columns[i];
      //是否只读
      if (col.readonly)
      {
        $("#" + col.field).attr("readonly", col.readonly);
        $("#" + col.field).addClass("inpreadonly");
      }
      //下拉框
      if (col.combobox)
      {
        var _comparams=$.extend({}, col.combobox);
        _comparams.readonly = col.readonly;
        _comparams.required = false;
        if(_comparams.fieldRelation)
        {
          _comparams.relationer = {	//下拉框关联数据行
            dataRow: _state.dataRecord,
            setValue: function (fieldName, _newValue)
            {
              _setValue(_target, fieldName, _newValue);
            }
          }
        }
        else
        {
          _comparams.onChange=function(_newValue, _oldValue)
          {
            _setValue(_target, this.id, _newValue);
          }
        }
        $("#" + col.field).combobox(_comparams);
      }
      else if (col.combogrid)  //表格下拉框
      {
        var _comparams=$.extend({}, col.combogrid);
        _comparams.readonly = col.readonly;
        _comparams.relationer = {	//下拉框关联数据行
          dataRow: _state.dataRecord,
          fieldName: col.field,  //下拉框关联字段
          dataType: col.dataType,
          fieldRelation: col.combogrid.fieldRelation,
          setValue: function (fieldName, _newValue)
          {
            _setValue(_target, fieldName, _newValue);
          }
        }
        $("#" + col.field).combogrid(_comparams);
      }
      else if (col.combotree)  //树下拉框
      {
        var _comparams=$.extend({}, col.combotree);
        _comparams.readonly = col.readonly;
        _comparams.relationer = {	//下拉框关联数据行
          dataRow: _state.dataRecord,
          fieldName: col.field,  //下拉框关联字段
          dataType: col.dataType,
          fieldRelation: col.combotree.fieldRelation,
          setValue: function (fieldName, _newValue)
          {
            _state.dataRecord[fieldName] = _newValue;
            $("#" + fieldName).val(_newValue);
          }
        }
        $("#" + col.field).combotree(_comparams);
      }
			else if(col.dataType=="DateTime")	//日期时间
			{
        $("#" + col.field).datetimebox({   
					showSeconds:true,
					readonly:col.readonly,        
          onChange:function(_newValue, _oldValue)
          {
            _state.dataRecord[this.id] = _newValue;
            $("#" + fieldName).val(_newValue);
          }
				});
			}
			else if(col.dataType=="Date")	//日期
			{
        $("#" + col.field).datebox({
          onChange:function(_newValue, _oldValue)
          {
            _setValue(_target, this.id, _newValue);
          }
        }); 
			}
			else
			{
				//是否只读
				if (col.readonly)
				{
					$("#" + col.field).attr("readonly", col.readonly);
					$("#" + col.field).addClass("inpreadonly").attr("readonly", "true");
				}
        else if (col.validatebox)  //验证有效性
        {
          $("#" + col.field).validatebox(col.validatebox);
        }
        else if (col && "Int32,Int64,Byte".indexOf(col.dataType) >= 0)
        {
          $("#" + col.field).numberbox({precision:0});
        }
        else if (col && "Decimal,Double,Single".indexOf(col.dataType) >= 0)
        {
          $("#" + col.field).numberbox({precision:2});
        }
			}

      //验证有效性
      if (col.validatebox)
      {
        $("#" + col.field).validatebox(col.validatebox);
      }
    }
  };

  function _getQuery(_target)
  {
    var dataRecord = $.data(_target, "superselector").dataRecord;

    var _state = $.data(_target, "superselector");
    var _opts = _state.options;
    var _columns = _opts.columns;
    var _where = '';

    for (var i = 0; i < _columns.length; i++)
    {
      var col = _columns[i];
      //if (!col.searchType) continue;

      var fieldName = col.field;
      var value = dataRecord[fieldName];
      if (value === undefined || value===null || value==='' || col.searchType==0) continue;

      if (_where) _where += ' and '
      switch (col.dataType)
      {
        case 'Int16':
        case 'Int32':
        case 'Int64':
        case 'Decimal':
        case 'Double':
        case 'Single':
        case 'Byte':
        case 'ByteArray':
          _where += fieldName + "=" + value;
          break;
        case 'DateTime':
          if (col.searchType == 2)//精确查询
          {
            _where += fieldName + "='" + value + "'";
          }
          break;
        default:
          if (col.searchType == 2)	//精确查询
          {
            _where += fieldName + "='" + value + "'";
          }
          else//模糊查询
          {
            if (value.indexOf("=") >= 0 || value.indexOf("<") >= 0 || value.indexOf(">") >= 0)
            {
              _where += fieldName + " " + value;
            }
            else if(col.editType=="TextArea")
            {
              value=value.replace(/\r/gi,'').replace(/\n/gi,",").replace(/，/gi, '').replace(/ /gi, '');
              var valueList = value.split(",");
              var inValue='';
              $.each(valueList, function(i, item)
              {
                if(item=='')return true;

                if(inValue)inValue+=",";
                inValue+="'"+item+"'";
              });
              if(inValue.indexOf(',')==-1)
              {
                _where += fieldName + " like '%" + inValue.replace(/'/gi, '') + "%'";
              }
              else
              {
                _where += fieldName + " in(" + inValue + ")";
              }
            }
            else
            {
              _where += fieldName + " like '%" + value + "%'";
            }
          }          
          break;
      }
    }
    return _where;
  }

  function _reset(_target)
  {
    $("form input,form textarea", _target).each(function ()
    {
      this.value = '';
    });
    $.data(_target, "superselector").dataRecord = {};
  }

  $.fn.superselector = function (_options, _param)
  {
    if (typeof _options == "string")
    {
      return $.fn.superselector.methods[_options](this, _param);
    }
    _options = _options || {};
    var me = this.each(function ()
    {
      var _state = $.data(this, "superselector");
      var _opts;
      if (_state)
      {
        _opts = $.extend(_state.options, _options);
        _state.options = _opts;
      } else
      {
        _opts = $.extend({},
        $.fn.superselector.defaults, $.fn.superselector.parseOptions(this), _options);
        var _wrapResult = _wrapGrid(this);
        $.data(this, "superselector", {
          options: _opts,
          toolbarpanel: _wrapResult.toolbarpanel,
          editor: _wrapResult.editor,
          /*主表结构数据
          {字段名 :字段值,字段名 :字段值}*/
          dataRecord: {}
        });
      }
      _createGrid(this);
      _bindEvent(this);
    });

    $.each($.fn.superselector.methods, function (name, body)
    {
      me[name] = function (_param) { return body(me, _param); }
    });
    return me;
  };

  $.fn.superselector.methods = {
    options: function (jq)
    {
      return $.data(jq[0], "superselector").options;
    },
    getMasterRecord: function (jq)
    {
      return $.data(jq[0], "superselector").dataRecord;
    },
    setValue: function (jq, params)
    {
      return jq.each(function ()
      {
        var _colInfo=_findField(this, params.fieldName);
        if(_colInfo)
        {
          _setValue(this, params.fieldName, params.value);
        }
      });
    },
    getValue: function (jq, params)
    {
      return $.data(jq[0], "superselector").dataRecord[params];
    },
    getQuery: function (jq)
    {
      return _getQuery(jq[0]);
    },
    reset: function (jq)
    {
      _reset(jq[0]);
    },
    setReadOnly: function (jq, params)
    {
      return jq.each(function ()
      {
        var _state = $.data(this, "superselector");
        var _opts = _state.options;
        if(params.readOnly)
        {
          if ($("#" + params.fieldName).hasClass("combo-text"))
          {
            $("#" + params.fieldName).combobox("setReadonly", true);
          }
          else
          {
            $("#" + params.fieldName).addClass("inpreadonly").attr("readonly", true);
          }
        }
        else
        {
          if ($("#" + params.fieldName).hasClass("combo-text"))
          {
            $("#" + params.fieldName).combobox("setReadonly", false);
          }
          else
          {
            $("#" + params.fieldName).removeClass("inpreadonly").removeAttr("readonly");
          }
        }
      });
    }
  }

  $.fn.superselector.parseOptions = function (_target)
  {
    return {};
  };

  $.fn.superselector.defaults = $.extend({},
	{
	  initParams: {},
	  queryParams: {},
	  loadMsg: "正在处理，请稍等 ...",
	  idField: null,
	  idValue: null,
	  tableView: null,
	  subTableViewList: [],

	  columns: []
	});
})(jQuery);
(function ($)
{
	function _initTooltip(_target)
	{
		$(_target).addClass("tooltipRattan-f");
	};
	function _bindEvent(_target)
	{
		var _opts = $.data(_target, "tooltipRattan").options;
		$(_target).unbind(".tooltipRattan").bind(_opts.showEvent + ".tooltipRattan",
		function (e)
		{
			_show(_target, e);
		}).bind(_opts.hideEvent + ".tooltipRattan",
		function (e)
		{
			_hide(_target, e);
		}).bind("mousemove.tooltipRattan",
		function (e)
		{
			if (_opts.trackMouse)
			{
				_opts.trackMouseX = e.pageX;
				_opts.trackMouseY = e.pageY;
				_reposition(_target);
			}
		});
	};
	function _clearTimer(_target)
	{
		var _state = $.data(_target, "tooltipRattan");
		if (_state.showTimer)
		{
			clearTimeout(_state.showTimer);
			_state.showTimer = null;
		}
		if (_state.hideTimer)
		{
			clearTimeout(_state.hideTimer);
			_state.hideTimer = null;
		}
	};
	function _reposition(_target)
	{
		var _state = $.data(_target, "tooltipRattan");
		if (!_state || !_state.tip)
		{
			return;
		}
		var _opts = _state.options;
		var _tip = _state.tip;
		if (_opts.trackMouse)
		{
			t = $();
			var _left = _opts.trackMouseX + _opts.deltaX;
			var _top = _opts.trackMouseY + _opts.deltaY;
		} else
		{
			var t = $(_target);
			var _left = t.offset().left + _opts.deltaX;
			var _top = t.offset().top + _opts.deltaY;
		}
		switch (_opts.position)
		{
			case "right":
				_left += t._outerWidth() + 12 + (_opts.trackMouse ? 12 : 0);
				_top -= (_tip._outerHeight() - t._outerHeight()) / 2;
				break;
			case "left":
				_left -= _tip._outerWidth() + 12 + (_opts.trackMouse ? 12 : 0);
				_top -= (_tip._outerHeight() - t._outerHeight()) / 2;
				break;
			case "top":
				_left -= (_tip._outerWidth() - t._outerWidth()) / 2;
				_top -= _tip._outerHeight() + 12 + (_opts.trackMouse ? 12 : 0);
				break;
			case "bottom":
				_left -= (_tip._outerWidth() - t._outerWidth()) / 2 - (_opts.trackMouse ? 7 : 0);
				_top += t._outerHeight() + 6 + (_opts.trackMouse ? 22 : 0);
				break;
		}
		_tip.css({
			left: _left,
			top: _top,
			zIndex: (_opts.zIndex != undefined ? _opts.zIndex : ($.fn.window ? $.fn.window.defaults.zIndex++ : ""))
		});
		_opts.onPosition.call(_target, _left, _top);
	};
	function _show(_target, e)
	{
		var _state = $.data(_target, "tooltipRattan");
		var _opts = _state.options;
		var tip = _state.tip;
		if (!tip)
		{
			tip = $("<div tabindex=\"-1\" class=\"tooltipRattan\">" + 
        "<div class=\"tooltipRattan-content\"></div>" + 
        "<div class=\"tooltipRattan-arrow-outer\"></div>" + 
        "<div class=\"tooltipRattan-arrow\"></div>" + 
        "</div>").appendTo("body");
			_state.tip = tip;
			_update(_target);
		}
		tip.removeClass("tooltipRattan-top tooltipRattan-bottom tooltipRattan-left tooltipRattan-right").addClass("tooltipRattan-" + _opts.position);
		_clearTimer(_target);
		_state.showTimer = setTimeout(function ()
		{
			tip.show();
			_opts.onShow.call(_target, e);
			_reposition(_target);
			var _arrowOuter = tip.children(".tooltipRattan-arrow-outer");
			var _arrow = tip.children(".tooltipRattan-arrow");
			var bc = "border-" + _opts.position + "-color";
			_arrowOuter.add(_arrow).css({
				borderTopColor: "",
				borderBottomColor: "",
				borderLeftColor: "",
				borderRightColor: ""
			});
			_arrowOuter.css(bc, tip.css(bc));
			_arrow.css(bc, tip.css("backgroundColor"));
		},
		_opts.showDelay);
	};
	function _hide(_target, e)
	{
		var _state = $.data(_target, "tooltipRattan");
		if (_state && _state.tip)
		{
			_clearTimer(_target);
			_state.hideTimer = setTimeout(function ()
			{
				_state.tip.hide();
				_state.options.onHide.call(_target, e);
			},
			_state.options.hideDelay);
		}
	};
	function _update(_target, _content)
	{
		var _state = $.data(_target, "tooltipRattan");
		var _opts = _state.options;
		if (_content)
		{
			_opts.content = _content;
		}
		if (!_state.tip)
		{
			return;
		}
		var cc = typeof _opts.content == "function" ? _opts.content.call(_target) : _opts.content;
		_state.tip.children(".tooltipRattan-content").html(cc);
		_opts.onUpdate.call(_target, cc);
	};
	function _destroy(_target)
	{
		var _state = $.data(_target, "tooltipRattan");
		if (_state)
		{
			_clearTimer(_target);
			var _opts = _state.options;
			if (_state.tip)
			{
				_state.tip.remove();
			}
			if (_opts._title)
			{
				$(_target).attr("title", _opts._title);
			}
			$.removeData(_target, "tooltipRattan");
			$(_target).unbind(".tooltipRattan").removeClass("tooltipRattan-f");
			_opts.onDestroy.call(_target);
		}
	};
	$.fn.tooltipRattan = function (_options, _param)
	{
		if (typeof _options == "string")
		{
			return $.fn.tooltipRattan.methods[_options](this, _param);
		}
		_options = _options || {};
		return this.each(function ()
		{
			var _state = $.data(this, "tooltipRattan");
			if (_state)
			{
				$.extend(_state.options, _options);
			} else
			{
				$.data(this, "tooltipRattan", {
					options: $.extend({},
					$.fn.tooltipRattan.defaults, $.fn.tooltipRattan.parseOptions(this), _options)
				});
				_initTooltip(this);
			}
			_bindEvent(this);
			_update(this);
		});
	};
	$.fn.tooltipRattan.methods = {
		options: function (jq)
		{
			return $.data(jq[0], "tooltipRattan").options;
		},
		tip: function (jq)
		{
			return $.data(jq[0], "tooltipRattan").tip;
		},
		arrow: function (jq)
		{
			return jq.tooltipRattan("tip").children(".tooltipRattan-arrow-outer,.tooltipRattan-arrow");
		},
		show: function (jq, e)
		{
			return jq.each(function ()
			{
				_show(this, e);
			});
		},
		hide: function (jq, e)
		{
			return jq.each(function ()
			{
				_hide(this, e);
			});
		},
		update: function (jq, _param)
		{
			return jq.each(function ()
			{
				_update(this, _param);
			});
		},
		reposition: function (jq)
		{
			return jq.each(function ()
			{
				_reposition(this);
			});
		},
		destroy: function (jq)
		{
			return jq.each(function ()
			{
				_destroy(this);
			});
		}
	};
	$.fn.tooltipRattan.parseOptions = function (_target)
	{
		var t = $(_target);
		var _opts = $.extend({},
		$.parser.parseOptions(_target, ["position", "showEvent", "hideEvent", "content", {
			deltaX: "number",
			deltaY: "number",
			showDelay: "number",
			hideDelay: "number"
		}]), {
			_title: t.attr("title")
		});
		t.attr("title", "");
		if (!_opts.content)
		{
			_opts.content = _opts._title;
		}
		return _opts;
	};
	$.fn.tooltipRattan.defaults = {
		position: "bottom",
		content: null,
		trackMouse: false,
		deltaX: 0,
		deltaY: 0,
		showEvent: "mouseenter",
		hideEvent: "mouseleave",
		showDelay: 200,
		hideDelay: 100,
		onShow: function (e) { },
		onHide: function (e) { },
		onUpdate: function (_28) { },
		onPosition: function (_29, top) { },
		onDestroy: function () { }
	};
})(jQuery);


