(function(field, factory, context) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        context[field] = factory();
    }
})("SlsUploadPreview", function() {

    /**
     * SlsUploadPreview类，用原生javascript实现的上传图片预览
     * @class SlsUploadPreview
     * @constructor
     * @author 赛冷思
     */
    var SlsUploadPreview = function() {};

    SlsUploadPreview.prototype = {

        constructor: SlsUploadPreview,

        /**
         * 版本号
         * @property {String} version
         */
        version: "1.0.0",

        /**
         * 是否开启debug模式。true开启;false关闭
         * @property {Boolean} debug
         */
        debug: true,

        /*
         * 打印日志
         * @method lg
         * @param  {All} data [打印数据类型]
         * @return {Object}      [当前路由对象]
         */
        lg: function(data, type) {
            this.debug && console[type ? type : "log"](data);
            return this;
        },


        /**
         * 检测一个对象是否是DOM对象
         * 首先要对HTMLElement进行类型检查，因为即使在支持HTMLElement的浏览器中，类型却是有差别的，
         *     在Chrome,Opera中HTMLElement的类型为function，此时就不能用它来判断了
         * @method isDOM
         * @param  {[type]}  obj dom对象
         * @return {Boolean}     是返回true，不是返回false
         */
        isDom: function(obj) {
            return (typeof HTMLElement === 'object') ? obj instanceof HTMLElement : obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        },

        /**
         * 转换成DOM对象
         * @method toDOM    
         * @param  {Object or String} ele [对象或者字符串]
         * @return {Object}     [如果对象是DOM对象或者选择器，就返回DOM对象，否则返回null]
         */
        toDom: function(ele) {
            return (typeof ele === "string") ? document.querySelector(ele) : (this.isDom(ele) ? ele : null);
        },


        /**
         * 配置参数
         * @method config
         * @param  {Object} options [配置参数]
         * @param  {String or DOMObject} options.fileEle [选择器或者DOM对象]
         * @param  {Function} options.fn [操作成功的回调函数]
         * @param  {Function} options.errorFn [操作失败的回调函数]
         * @return {Object}     [SlsUploadPreview对象]
         */
        config: function(options) {
            this.fileEle = this.toDom(options.fileEle);

            this.fn = options.fn && options.fn.constructor === Function ? options.fn : null;
            this.errorFn = options.errorFn && options.errorFn.constructor === Function ? options.errorFn : null;

            return this;
        },


        /**
         * 初始化参数
         */
        upPreview: function(options) {
            if (!options || !options.fileEle) {
                this.lg("必须传入一个对象参数，并且包含fileEle属性。", "error");
                return this;
            };
            if (!this.toDom(options.fileEle)) {
                this.lg("您传入的fileEle属性值不是一个选择器或者不是一个DOM对象。", "error");
                return this;
            };

            this.config(options);

            var self = this;

            this.fileEle.onchange = function() {
                var _v = this.value,
                    _body = document.body,
                    fileData = {
                        src: null,
                        filter: null
                    };
                picReg = /(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png){1}/; //图片正则

                if (!picReg.test(_v)) { //简单的图片格式验证
                    self.errorFn ? self.errorFn("不支持的图片的格式。") : this.lg("不支持的图片的格式。", "error");
                    return false;
                }

                //不支持FileReader
                if (typeof FileReader == 'undefined') {
                    self.errorFn ? self.errorFn("您的浏览器不支持FileReader对象") : self.lg("您没有传错误回调函数。", "error");
                } else {
                    /*
                     * 调用FileReader 文件API的readAsDataURL，启动异步加载文件的数据，通过监听reade的onload事件，
                     * 等待数据加载完毕后，在回调函数onload事件中，通过reader的result属性即可获得图片文件的相关内容
                     * */
                    var reader = new FileReader(),
                        _file = this.files[0]; //读取被加载的文件对象

                    reader.onload = (function(file) { //监听load事件
                        return function() {
                            fileData["src"] = this.result;
                            self.fn ? self.fn(fileData) : self.lg("您没有传成功回调函数。", "error");
                        };
                    })(_file);

                    reader.onerror = function() { //监听文件读取的错误处理
                        self.errorFn ? self.errorFn("文件读取数据出错。") : self.lg("您没有传错误回调函数。", "error");
                    }
                    reader.readAsDataURL(_file); //读取文件内容···
                }
            }
        },
    };
    return new SlsUploadPreview();
}, this);