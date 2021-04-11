"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUSBPrinter = exports.CreateSerialPrinter = exports.CreateNetworkPrinter = exports.screenshotDomElement = exports.closeBrowser = exports.launchBrowser = exports.getBrowser = void 0;
var puppeteer_1 = require("puppeteer");
var printer_1 = require("./printer");
var NetworkAdapter = require("escpos-network");
var SerialAdapter = require("escpos-serialport");
var USBAdapter = require("escpos-usb");
var browser;
var getBrowser = function () {
    return browser;
};
exports.getBrowser = getBrowser;
/**
 * start the internal chromium browser
 */
var launchBrowser = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!browser) return [3 /*break*/, 8];
                console.info('Launching Headless Chrome');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                if (!(process.platform === 'linux')) return [3 /*break*/, 3];
                return [4 /*yield*/, puppeteer_1.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })];
            case 2:
                //linux needs to install chromium separately as of 2019, the automatically installed chromium didn't work on raspberry pi.
                browser = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, puppeteer_1.launch()];
            case 4:
                browser = _a.sent();
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                e_1 = _a.sent();
                console.error("failed to launch puppeteer browser.");
                console.error(e_1);
                return [3 /*break*/, 7];
            case 7:
                console.info('Headless Chrome Launched');
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.launchBrowser = launchBrowser;
/**
 * shut down the internal chromium browser
 */
var closeBrowser = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!browser) return [3 /*break*/, 2];
                console.info("closing internal chromium browser.");
                return [4 /*yield*/, browser.close()];
            case 1:
                _a.sent();
                browser = null;
                console.info("Internal chromium browser closed.");
                return [3 /*break*/, 3];
            case 2:
                console.error("There is no active browser.");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.closeBrowser = closeBrowser;
/**
 *
 * @param page Puppeteer page, the page to take screenshot on.
 * @param selector css selector, use an id to avoid confusion.
 * @param padding padding around the element, in pixels, default is 0, other element may show in the padding area.
 * @returns the image in a buffer.
 */
var screenshotDomElement = function (page, selector, padding) {
    if (padding === void 0) { padding = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var rect;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selector)
                        throw "Please provide a selector.";
                    return [4 /*yield*/, page.evaluate(function (selector) {
                            var element = document.querySelector(selector);
                            if (!element)
                                return null;
                            var _a = element.getBoundingClientRect(), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                            return { left: x, top: y, width: width, height: height, id: element.id };
                        }, selector)];
                case 1:
                    rect = _a.sent();
                    if (!rect)
                        throw Error("Could not find element that matches selector: " + selector + ".");
                    //adjust viewport so the element adjust to the correct size
                    return [4 /*yield*/, page.setViewport({
                            width: rect.width + padding * 2,
                            height: rect.height + padding * 2
                        })];
                case 2:
                    //adjust viewport so the element adjust to the correct size
                    _a.sent();
                    return [4 /*yield*/, page.screenshot({
                            clip: {
                                x: rect.left - padding,
                                y: rect.top - padding,
                                width: rect.width + padding * 2,
                                height: rect.height + padding * 2
                            }
                        })];
                case 3: 
                //take the screenshot
                return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.screenshotDomElement = screenshotDomElement;
/**
 *
 * @param ip the ip address to connect to the printer
 * @param port port number, most printer have default port of 9100
 * @param options printer options, see https://www.npmjs.com/package/escpos for detail, or just print out "printer.escposPrinter" too see what options are available
 * @returns
 */
var CreateNetworkPrinter = function (ip, port, options) {
    if (port === void 0) { port = 9100; }
    if (options === void 0) { options = {}; }
    return new printer_1.default(new NetworkAdapter(ip, port), options);
};
exports.CreateNetworkPrinter = CreateNetworkPrinter;
/**
 * @param pid port id, for example '/dev/usb/lp0'
 * @param options printer options, see https://www.npmjs.com/package/escpos for detail, or just print out "printer.escposPrinter" too see what options are available
 * @returns
 */
var CreateSerialPrinter = function (pid, options) {
    if (options === void 0) { options = {}; }
    return new printer_1.default(new SerialAdapter(pid), options);
};
exports.CreateSerialPrinter = CreateSerialPrinter;
var CreateUSBPrinter = function (vid, pid, options) {
    if (options === void 0) { options = {}; }
    //TODO: implement a way to find printers with https://github.com/song940/node-escpos/blob/v3/packages/usb/README.md
    return new printer_1.default(new USBAdapter(vid, pid), options);
};
exports.CreateUSBPrinter = CreateUSBPrinter;
var htmltoescpos = {
    CreateNetworkPrinter: exports.CreateNetworkPrinter,
    CreateSerialPrinter: exports.CreateSerialPrinter,
    CreateUSBPrinter: exports.CreateUSBPrinter,
    screenshotDomElement: exports.screenshotDomElement,
    closeBrowser: exports.closeBrowser,
    launchBrowser: exports.launchBrowser
};
exports.default = htmltoescpos;
//# sourceMappingURL=index.js.map