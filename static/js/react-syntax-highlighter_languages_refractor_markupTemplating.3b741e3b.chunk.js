(this["webpackJsonpanchor-link-diagnostics"]=this["webpackJsonpanchor-link-diagnostics"]||[]).push([[81],{614:function(n,e,t){"use strict";function a(n){!function(n){function e(n,e){return"___"+n.toUpperCase()+e+"___"}Object.defineProperties(n.languages["markup-templating"]={},{buildPlaceholders:{value:function(t,a,o,r){if(t.language===a){var i=t.tokenStack=[];t.code=t.code.replace(o,(function(n){if("function"===typeof r&&!r(n))return n;for(var o,c=i.length;-1!==t.code.indexOf(o=e(a,c));)++c;return i[c]=n,o})),t.grammar=n.languages.markup}}},tokenizePlaceholders:{value:function(t,a){if(t.language===a&&t.tokenStack){t.grammar=n.languages[a];var o=0,r=Object.keys(t.tokenStack);!function i(c){for(var s=0;s<c.length&&!(o>=r.length);s++){var u=c[s];if("string"===typeof u||u.content&&"string"===typeof u.content){var p=r[o],g=t.tokenStack[p],l="string"===typeof u?u:u.content,f=e(a,p),k=l.indexOf(f);if(k>-1){++o;var h=l.substring(0,k),d=new n.Token(a,n.tokenize(g,t.grammar),"language-"+a,g),m=l.substring(k+f.length),y=[];h&&y.push.apply(y,i([h])),y.push(d),m&&y.push.apply(y,i([m])),"string"===typeof u?c.splice.apply(c,[s,1].concat(y)):u.content=y}}else u.content&&i(u.content)}return c}(t.tokens)}}}})}(n)}n.exports=a,a.displayName="markupTemplating",a.aliases=[]}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_refractor_markupTemplating.3b741e3b.chunk.js.map