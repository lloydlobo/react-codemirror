(self.webpackChunk_uiw_react_codemirror=self.webpackChunk_uiw_react_codemirror||[]).push([[7343],{77343:function(e,t,n){!function(e){"use strict";e.defineMode("crystal",(function(e){function t(e,t){return new RegExp((t?"":"^")+"(?:"+e.join("|")+")"+(t?"$":"\\b"))}function n(e,t,n){return n.tokenize.push(e),e(t,n)}var r=/^(?:[-+/%|&^]|\*\*?|[<>]{2})/,a=/^(?:[=!]~|===|<=>|[<>=!]=?|[|&]{2}|~)/,u=/^(?:\[\][?=]?)/,i=/^(?:\.(?:\.{2})?|->|[?:])/,c=/^[a-z_\u009F-\uFFFF][a-zA-Z0-9_\u009F-\uFFFF]*/,o=/^[A-Z_\u009F-\uFFFF][a-zA-Z0-9_\u009F-\uFFFF]*/,s=t(["abstract","alias","as","asm","begin","break","case","class","def","do","else","elsif","end","ensure","enum","extend","for","fun","if","include","instance_sizeof","lib","macro","module","next","of","out","pointerof","private","protected","rescue","return","require","select","sizeof","struct","super","then","type","typeof","uninitialized","union","unless","until","when","while","with","yield","__DIR__","__END_LINE__","__FILE__","__LINE__"]),f=t(["true","false","nil","self"]),l=t(["def","fun","macro","class","module","struct","lib","enum","union","do","for"]),m=t(["if","unless","case","while","until","begin","then"]),h=["end","else","elsif","rescue","ensure"],p=t(h),d=["\\)","\\}","\\]"],k=new RegExp("^(?:"+d.join("|")+")$"),F={def:x,fun:x,macro:g,class:I,module:I,struct:I,lib:I,enum:I,union:I},_={"[":"]","{":"}","(":")","<":">"};function z(e,t){if(e.eatSpace())return null;if("\\"!=t.lastToken&&e.match("{%",!1))return n(w("%","%"),e,t);if("\\"!=t.lastToken&&e.match("{{",!1))return n(w("{","}"),e,t);if("#"==e.peek())return e.skipToEnd(),"comment";var h;if(e.match(c))return e.eat(/[?!]/),h=e.current(),e.eat(":")?"atom":"."==t.lastToken?"property":s.test(h)?(l.test(h)?"fun"==h&&t.blocks.indexOf("lib")>=0||"def"==h&&"abstract"==t.lastToken||(t.blocks.push(h),t.currentIndent+=1):"operator"!=t.lastStyle&&t.lastStyle||!m.test(h)?"end"==h&&(t.blocks.pop(),t.currentIndent-=1):(t.blocks.push(h),t.currentIndent+=1),F.hasOwnProperty(h)&&t.tokenize.push(F[h]),"keyword"):f.test(h)?"atom":"variable";if(e.eat("@"))return"["==e.peek()?n(b("[","]","meta"),e,t):(e.eat("@"),e.match(c)||e.match(o),"variable-2");if(e.match(o))return"tag";if(e.eat(":"))return e.eat('"')?n(y('"',"atom",!1),e,t):e.match(c)||e.match(o)||e.match(r)||e.match(a)||e.match(u)?"atom":(e.eat(":"),"operator");if(e.eat('"'))return n(y('"',"string",!0),e,t);if("%"==e.peek()){var p,d="string",k=!0;if(e.match("%r"))d="string-2",p=e.next();else if(e.match("%w"))k=!1,p=e.next();else if(e.match("%q"))k=!1,p=e.next();else if(p=e.match(/^%([^\w\s=])/))p=p[1];else{if(e.match(/^%[a-zA-Z_\u009F-\uFFFF][\w\u009F-\uFFFF]*/))return"meta";if(e.eat("%"))return"operator"}return _.hasOwnProperty(p)&&(p=_[p]),n(y(p,d,k),e,t)}return(h=e.match(/^<<-('?)([A-Z]\w*)\1/))?n(v(h[2],!h[1]),e,t):e.eat("'")?(e.match(/^(?:[^']|\\(?:[befnrtv0'"]|[0-7]{3}|u(?:[0-9a-fA-F]{4}|\{[0-9a-fA-F]{1,6}\})))/),e.eat("'"),"atom"):e.eat("0")?(e.eat("x")?e.match(/^[0-9a-fA-F_]+/):e.eat("o")?e.match(/^[0-7_]+/):e.eat("b")&&e.match(/^[01_]+/),"number"):e.eat(/^\d/)?(e.match(/^[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?/),"number"):e.match(r)?(e.eat("="),"operator"):e.match(a)||e.match(i)?"operator":(h=e.match(/[({[]/,!1))?n(b(h=h[0],_[h],null),e,t):e.eat("\\")?(e.next(),"meta"):(e.next(),null)}function b(e,t,n,r){return function(a,u){if(!r&&a.match(e))return u.tokenize[u.tokenize.length-1]=b(e,t,n,!0),u.currentIndent+=1,n;var i=z(a,u);return a.current()===t&&(u.tokenize.pop(),u.currentIndent-=1,i=n),i}}function w(e,t,n){return function(r,a){return!n&&r.match("{"+e)?(a.currentIndent+=1,a.tokenize[a.tokenize.length-1]=w(e,t,!0),"meta"):r.match(t+"}")?(a.currentIndent-=1,a.tokenize.pop(),"meta"):z(r,a)}}function g(e,t){if(e.eatSpace())return null;var n;if(n=e.match(c)){if("def"==n)return"keyword";e.eat(/[?!]/)}return t.tokenize.pop(),"def"}function x(e,t){return e.eatSpace()?null:(e.match(c)?e.eat(/[!?]/):e.match(r)||e.match(a)||e.match(u),t.tokenize.pop(),"def")}function I(e,t){return e.eatSpace()?null:(e.match(o),t.tokenize.pop(),"def")}function y(e,t,n){return function(r,a){for(var u=!1;r.peek();)if(u)r.next(),u=!1;else{if(r.match("{%",!1))return a.tokenize.push(w("%","%")),t;if(r.match("{{",!1))return a.tokenize.push(w("{","}")),t;if(n&&r.match("#{",!1))return a.tokenize.push(b("#{","}","meta")),t;var i=r.next();if(i==e)return a.tokenize.pop(),t;u=n&&"\\"==i}return t}}function v(e,t){return function(n,r){if(n.sol()&&(n.eatSpace(),n.match(e)))return r.tokenize.pop(),"string";for(var a=!1;n.peek();)if(a)n.next(),a=!1;else{if(n.match("{%",!1))return r.tokenize.push(w("%","%")),"string";if(n.match("{{",!1))return r.tokenize.push(w("{","}")),"string";if(t&&n.match("#{",!1))return r.tokenize.push(b("#{","}","meta")),"string";a=t&&"\\"==n.next()}return"string"}}return{startState:function(){return{tokenize:[z],currentIndent:0,lastToken:null,lastStyle:null,blocks:[]}},token:function(e,t){var n=t.tokenize[t.tokenize.length-1](e,t),r=e.current();return n&&"comment"!=n&&(t.lastToken=r,t.lastStyle=n),n},indent:function(t,n){return n=n.replace(/^\s*(?:\{%)?\s*|\s*(?:%\})?\s*$/g,""),p.test(n)||k.test(n)?e.indentUnit*(t.currentIndent-1):e.indentUnit*t.currentIndent},fold:"indent",electricInput:t(d.concat(h),!0),lineComment:"#"}})),e.defineMIME("text/x-crystal","crystal")}(n(2742))}}]);
//# sourceMappingURL=7343.72d84b1b.chunk.js.map