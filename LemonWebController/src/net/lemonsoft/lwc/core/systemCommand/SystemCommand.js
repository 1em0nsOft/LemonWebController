/**
 * 浏览器对象
 * @constructor 调用Native创建一个浏览器对象
 */
function Browser() {
    var id = window.browser.create();

    /**
     * 获取浏览器ID
     * @returns {Object} 浏览器的id
     */
    this.getId = function () {
        return id;
    };

    /**
     * 显示这个浏览器
     */
    this.show = function () {
        Log.info("run show");
        try {
            window.browser.show(id);
        } catch (e) {
            Log.error("e.message" + e.message);
        }
        Log.info("run show over");
    };

    /**
     * 隐藏这个浏览器
     */
    this.hide = function () {
        Log.info("run hide");
        window.browser.hide(id);
        Log.info("run hide over");
    };

    /**
     * 关闭这个浏览器
     */
    this.close = function () {
        window.browser.close(id);
    };

    /**
     * 设置浏览器窗口的大小尺寸
     * @param width 浏览器的窗口宽度
     * @param height 浏览器的窗口高度
     */
    this.setSize = function (width, height) {
        window.browser.setSize(id, width, height);
    };

    /**
     * 设置浏览器窗口的位置
     * @param x 新位置的x坐标
     * @param y 新位置的y坐标
     */
    this.setPosition = function (x, y) {
        window.browser.setPosition(id, x, y);
    };

    /**
     * 在浏览器中执行指定的js代码
     * @param jsCode
     */
    this.executeJavaScript = function (jsCode) {
        return window.browser.executeJavaScript(id, jsCode);
    };

    this.operate = new BrowserOperate(this);
    this.dataGet = new BrowserDataGet(this);

}
function BrowserDataGet(browserObj) {
    var browser = browserObj;

    /**
     * 获取指定Dom元素的attribute参数值
     * @param domSelector 指定元素的选择器
     * @param attributeName 要获取的属性名
     * @returns {string} 获取到的属性值
     */
    this.getDomAttribute = function (domSelector , attributeName) {
        return browser.executeJavaScript("document.querySelector('" + domSelector + "').getAttribute('" + attributeName + "')");
    };

    /**
     * 获取指定Dom元素的属性值
     * @param domSelector
     * @param propertyName
     */
    this.getDomProperty = function (domSelector, propertyName) {
        return browser.executeJavaScript("document.querySelector('" + domSelector + "')." + propertyName);
    };

    /**
     * 获取指定元素的innerHTML
     * @param domSelector 要获取innerHTML的元素的选择器
     * @returns {string} 获取到的innerHTML
     */
    this.getInnerHTML = function (domSelector) {
        try {
            var result = this.getDomProperty(domSelector , "innerHTML");
            Log.success("根据脚本命令获取指定元素的innerHTML成功");
            return result;
        }catch (e){
            Log.warning("获取指定元素的innerHTML失败:" + e);
            return null;
        }
    };

    /**
     * 获取指定元素的outerHTML
     * @param domSelector 要获取outerHTML的元素的选择器
     * @returns {string} 获取到的outerHTML
     */
    this.getOuterHTML = function (domSelector) {
        try {
            var result = this.getDomProperty(domSelector , "outerHTML");
            Log.success("根据脚本命令获取指定元素的outerHTML成功");
            return result;
        }catch (e){
            Log.warning("获取指定元素的outerHTML失败:" + e);
            return null;
        }
    };

    /**
     * 获取指定元素的innerText
     * @param domSelector 要获取innerText的元素的选择器
     * @returns {string} 获取到的outerHTML
     */
    this.getInnerText = function (domSelector) {
        try {
            var result = this.getDomProperty(domSelector , "innerText");
            Log.success("根据脚本命令获取指定元素的innerText成功");
            return result;
        }catch (e){
            Log.warning("获取指定元素的innerText失败:" + e);
            return null;
        }
    };

    /**
     * 获取当前采集数据的界面的URL
     * AID: 2d
     *
     * @returns String URL字符串
     */
    this.getURL = function () {
        try {
            var result = this.executeJS("location.href");
            Log.success("根据脚本命令获取当前采集数据的界面的URL成功");
            return result;
        }catch (e){
            Log.warning("获取当前采集数据的界面的URL失败:" + e);
            return null;
        }
    };

    /**
     * 获取指定图片Dom元素的图片URL
     * AID: 2e
     *
     * @param domSelector 要获取图片URL的图片Dom元素的css选择器
     * @returns String 图片URL字符串
     */
    this.getImgDomURL = function (domSelector) {
        try {
            var result = this.getDomProperty(domSelector , "src");
            Log.success("根据脚本命令获取指定图片Dom元素的图片URL成功");
            return result;
        }catch (e){
            Log.warning("获取指定图片Dom元素的图片URL失败:" + e);
            return null;
        }
    };

    /**
     * 获取指定A标记的的链接URL
     * AID: 2f
     *
     * @param domSelector 要获取超链接URL的A标记的css选择器字符串
     * @returns String A标记的链接的URL字符串
     */
    this.getADomURL = function (domSelector) {
        try {
            var result = this.getDomProperty(domSelector, "href");
            Log.success("根据脚本命令获取指定A标记的的链接URL成功");
            return result;
        }catch (e){
            Log.warning("获取指定A标记的的链接URL失败:" + e);
            return null;
        }
    };

    /**
     * 获取指定节点的所有的子元素节点数组
     * @param domSelector 要获取的指定节点的css选择器字符串
     * @returns Array
     */
    this.getChildren = function (domSelector) {
        try {
            var result = this.getDomProperty(domSelector, "children");
            Log.success("根据脚本命令获取指定节点的所有的子元素节点数组成功");
            return result;
        }catch (e){
            Log.warning("获取指定节点的所有的子元素节点数组失败:" + e);
            return null;
        }
    };

    /**
     * 获取指定节点的所有的子元素节点数组中的元素数量
     * @param domSelector 要获取的指定节点的css选择器字符串
     * @returns {*}
     */
    this.getChildrenCount = function (domSelector) {
        try {
            var result = this.getDomProperty(domSelector, "children").length;
            Log.success("根据脚本命令获取指定节点的所有的子元素节点数组中的元素数量成功");
            return result;
        }catch (e){
            Log.warning("获取指定节点的所有的子元素节点数组中的元素数量失败:" + e);
            return null;
        }
    };

}
function BrowserOperate(browserObj) {
    var browser = browserObj;

    /**
     * 加载URL
     * @param url 要加载的URL
     */
    this.loadURL = function (url , successCallback , failedCallback) {
        window.browser.loadURL(browser.getId() , url , successCallback , failedCallback);
    };

    /**
     * 设置指定Dom元素的Attribute参数
     * @param domSelector 要设置Attribute参数的Dom元素的css选择器
     * @param attributeName 要设置的Attribute参数名
     * @param attributeValue 要设置的Attribute参数的值
     */
    this.setDomAttribute = function (domSelector , attributeName , attributeValue) {
        browser.executeJavaScript("document.querySelector('" + domSelector + "').setAttribute('" + attributeName + "' , '" + attributeValue +"')");
    };

    /**
     * 设置指定Dom元素的属性
     * @param domSelector 要设置的属性的Dom元素的css选择器
     * @param propertyName 要设置的属性名
     * @param propertyValue 要设置的属性值
     */
    this.setDomProperty = function (domSelector , propertyName , propertyValue) {
        browser.executeJavaScript("document.querySelector('" + domSelector + "')." + propertyName + " = " + "'" + propertyValue + "'");
    };

    /**
     * 触发指定Dom元素的指定函数
     * @param domSelector 要触发对应函数的Dom元素
     * @param functionName 要触发指定Dom元素的函数名称
     * @param attributes 要传入的参数列表,数组类型
     */
    this.invokeDomFunction = function (domSelector, functionName , attributes) {
        browser.executeJavaScript("document.querySelector('" + domSelector + "')." + functionName + "(" + attributes.join(",") + ")");
    };

    /**
     * 触发指定Dom元素的鼠标事件,如点击/鼠标悬浮等操作
     * @param domSelector 要触发鼠标事件的Dom元素
     * @param actionName 要触发的鼠标事件名称  ‘click’, ‘mousedown’, ‘mousemove’, ‘mouseout’, ‘mouseover’, ‘mouseup’.
     */
    this.invokeDomMouseAction = function (domSelector , actionName) {
        browser.executeJavaScript(String.format("window.eval(\"var event = document.createEvent('MouseEvents');event.initMouseEvent('%s',true,true,window,0,0,0,0,0,false,false,false,false,0,null);document.querySelector('%s').dispatchEvent(event);\")" , actionName , domSelector));
    };

    /**
     * 在指定的Input文本控件中填写值
     * AID: 1b
     *
     * @param domSelector 要填写值的文本输入控件的css选择器字符串
     * @param fillText 要填写的文本值
     */
    this.fillInputText = function(domSelector , fillText) {
        this.setDomAttribute(domSelector , "value" , fillText);
        Log.success("在指定的Input文本控件中填写值成功");
    };

    /**
     * 选择指定的下拉菜单的下拉项目
     * AID: 1c
     *
     * @param domSelector 要选择项目的css选择器字符串
     * @param selectedIndex 要让其选择的项目的索引
     */
    this.selectItem = function(domSelector , selectedIndex) {
        this.setDomProperty("selectedIndex" , selectedIndex);
        Log.success("选择指定的下拉菜单的下拉项目成功");
    };

    /**
     * 选中指定radio或checkbox
     * AID: 1d
     *
     * @param domSelector 要选择项目的css选择器字符串
     * @param checked 设置是选中还是取消选中,boolean值
     */
    this.checkedItem = function(domSelector , checked) {
        this.setDomProperty("checked" , checked ? "checked" : "");
        Log.success("选中指定radio或checkbox成功");
    };

    /**
     * 触发提交指定的表单
     * AID: 1e
     *
     * @param domSelector 要提交的表单的css选择器字符串
     */
    this.submitForm = function (domSelector) {
        this.invokeDomFunction(domSelector , "submit" , []);
        Log.success("触发提交指定的表单成功");
    };

    /**
     * 休眠指定的时间之后再继续执行
     * AID: 1f
     *
     * @param sleepInterval 休眠的时间,单位ms
     */
    this.sleep = function (sleepInterval) {
        Log.info("休眠" + sleepInterval + " 开始");
        Util.sleep(sleepInterval);
        Log.info("休眠" + sleepInterval + " 结束");
    };

    /**
     * 让当前页面滚动到指定的位置
     * AID: 1g
     *
     * @param x 让页面要滚动到的位置的x坐标
     * @param y 让页面要滚动到的位置的y坐标
     */
    this.scrollToPosition = function (x , y) {
        this.executeJS("window.scrollTo(" + x + " , " + y + ")");
        Log.success("让当前页面滚动到指定的位置成功");
    };

    /**
     * 点击指定的Dom元素
     * AID: 1h
     *
     * @param domSelector 要点击的Dom元素的css选择器字符串
     */
    this.clickDom = function (domSelector) {
        this.invokeDomMouseAction(domSelector , "click");
        Log.success("点击指定的Dom元素成功");
    };

    /**
     * 触发指定Dom元素的鼠标悬浮事件
     * AID: 1i
     *
     * @param domSelector 要触发hover事件的dom元素的css选择器字符串
     */
    this.mouseoverDom = function (domSelector) {
        this.invokeDomMouseAction(domSelector , "mouseover");
        Log.success("触发指定Dom元素的鼠标悬浮事件成功");
    };

}
/**
 * 通讯类 - 用于tty的命令与
 * @constructor
 */
function Communication() {
}

/**
 * 调用指定的通讯handler
 * @param name 通讯handler的名称
 * @param callbackData 通讯handler携带的数据
 * @returns {*} 原生代码返回的对象
 */
Communication.call = function (name, callbackData) {
    return window.communication.call(name , callbackData);
};


function DataCollection() {
}

/**
 * 将指定的键值对数据放入到数据收集池中
 * @param key 要存储的数据的键
 * @param value 要存储的数据的值
 */
DataCollection.put = function (key, value) {
    window.dataCollection.put(key , value);
};

/**
 * 将数据收集池中的指定数据取出
 * @param key 要取出的数据的键
 */
DataCollection.get = function (key) {
    return window.dataCollection.get(key);
};

/**
 * 将数据收集池中的指定的数据删除
 * @param key 要删除的数据的键
 */
DataCollection.remove = function (key) {
    return window.dataCollection.remove(key);
};

/**
 * 删除数据收集池中的所有数据
 */
DataCollection.removeAll = function () {
    window.dataCollection.removeAll();
};
/**
 * 日志类 - 包含各种记录日志的方法
 */
function Log() {
}

/**
 * 日志模型
 * @param content 日志的内容
 * @param type 日志的类型
 * @constructor
 */
function LogModel(content , type) {
    this.content = content;
    this.type = type;
    this.time = Math.round(new Date().getTime());
}

/**
 * 输出一个日志 - 所有的日志输出方法都调用此方法,再通过日志类型来决定输出的日志种类
 * @param typeIndex 日志的类型的索引
 * @param info 打印日志的具体信息
 */
Log.msg = function (typeIndex, info) {
    var classArr = ["logItemSuccess" , "logItemError" , "logItemInfo" , "logItemWarning"];
    var typeArr = ["success" , "error" , "info" , "warning"];
    try {
        window.log.addLog(JSON.stringify(new LogModel(info , typeArr[typeIndex])));
        var logElement = document.createElement("div");
        logElement.setAttribute("class", classArr[typeIndex]);
        logElement.innerText = "[LOG]" + info;
        document.getElementById("logList").appendChild(logElement);
    } catch (e){
        console.log("No GUI to log:" + info);
    }
};

/**
 * 打印成功的日志
 * @param info 要打印的日志内容
 */
Log.success = function (info) {
    this.msg(0 , info);
};

/**
 * 打印错误信息的日志
 * @param info 要打印的日志内容
 */
Log.error = function (info) {
    this.msg(1 , info);
};

/**
 * 打印普通的信息日志
 * @param info 要打印的日志内容
 */
Log.info = function (info) {
    this.msg(2 , info);
};

/**
 * 打印警告信息的日志
 * @param info 要打印的日志内容
 */
Log.warning = function (info) {
    this.msg(3 , info);
};
function Util() {
}

/**
 * 创建一个随机的UUID
 * @returns {string} 生成的UUID字符串
 */
Util.createUUID = function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
};

/**
 * 获取当前的系统时间戳
 * @returns {number} 当前的UNIX时间戳
 */
Util.getUnixTimeStamp = function () {
    return Math.round(new Date().getTime());
};

/**
 * 休眠(阻塞)指定的时间
 * @param timeInterval 要休眠(阻塞)的时间,单位ms
 */
Util.sleep = function (timeInterval) {
    var now = new Date();
    var exitTime = now.getTime() + timeInterval;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
};