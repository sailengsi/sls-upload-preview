!function(e,r,n){"object"==typeof exports?module.exports=r():"function"==typeof define&&define.amd?define(r):n[e]=r()}("SlsUploadPreview",function(){var e=function(){};return e.prototype={constructor:e,version:"1.0.0",debug:!0,lg:function(e,r){return this.debug&&console[r?r:"log"](e),this},isDom:function(e){return"object"==typeof HTMLElement?e instanceof HTMLElement:e&&"object"==typeof e&&1===e.nodeType&&"string"==typeof e.nodeName},toDom:function(e){return"string"==typeof e?document.querySelector(e):this.isDom(e)?e:null},config:function(e){return this.fileEle=this.toDom(e.fileEle),this.fn=e.fn&&e.fn.constructor===Function?e.fn:null,this.errorFn=e.errorFn&&e.errorFn.constructor===Function?e.errorFn:null,this},upPreview:function(e){if(!e||!e.fileEle)return this.lg("必须传入一个对象参数，并且包含fileEle属性。","error"),this;if(!this.toDom(e.fileEle))return this.lg("您传入的fileEle属性值不是一个选择器或者不是一个DOM对象。","error"),this;this.config(e);var r=this;this.fileEle.onchange=function(){var e=this.value,n=(document.body,{src:null,filter:null});if(picReg=/(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png){1}/,!picReg.test(e))return r.errorFn?r.errorFn("不支持的图片的格式。"):this.lg("不支持的图片的格式。","error"),!1;if("undefined"==typeof FileReader)r.errorFn?r.errorFn("您的浏览器不支持FileReader对象"):r.lg("您没有传错误回调函数。","error");else{var t=new FileReader,o=this.files[0];t.onload=function(){return function(){n.src=this.result,r.fn?r.fn(n):r.lg("您没有传成功回调函数。","error")}}(o),t.onerror=function(){r.errorFn?r.errorFn("文件读取数据出错。"):r.lg("您没有传错误回调函数。","error")},t.readAsDataURL(o)}}}},new e},this);