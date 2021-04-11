"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var escpos = require("escpos");
var getPixels = require("get-pixels");
var _1 = require(".");
/**
 * you can use adapter and escpostPrinter field to issue custom commands as well, see https://github.com/song940/node-escpos for details
 */
var Printer = /** @class */ (function () {
    function Printer(adapter, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        /**
         * send a beep sequence to the buzzer
         */
        this.beep = function (options) {
            _this.escposPrinter.beep(options.count, options.time);
        };
        /**
         * open cashdraw on a specific pin
         */
        this.cashdraw = function (pin) {
            _this.escposPrinter.cashdraw(pin);
        };
        /**
         * print the given url. <see cref="PrintImageOptions"/>
         * @param url the url to print
         * @param options
         * @see PrintUrlOptions
         * @see PrintImageOptions
         */
        this.printUrl = function (url, _a) {
            if (_a === void 0) { _a = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                var page, screen_1, e_1;
                var _b = _a.pageWidth, viewportWidth = _b === void 0 ? 575 : _b, _c = _a.pageHeight, viewportHeight = _c === void 0 ? 600 : _c, waitForFunction = _a.waitForFunction, _d = _a.selector, selector = _d === void 0 ? 'body' : _d, restOfOptions = __rest(_a, ["pageWidth", "pageHeight", "waitForFunction", "selector"]);
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: 
                        //make sure the internal browser is open
                        return [4 /*yield*/, _1.launchBrowser()];
                        case 1:
                            //make sure the internal browser is open
                            _e.sent();
                            _e.label = 2;
                        case 2:
                            _e.trys.push([2, 9, 10, 11]);
                            return [4 /*yield*/, _1.getBrowser().newPage()];
                        case 3:
                            //open a new page
                            page = _e.sent();
                            //set viewport
                            return [4 /*yield*/, page.setViewport({ width: viewportWidth, height: viewportHeight })];
                        case 4:
                            //set viewport
                            _e.sent();
                            //go to the url
                            return [4 /*yield*/, page.goto(url)];
                        case 5:
                            //go to the url
                            _e.sent();
                            if (!waitForFunction) return [3 /*break*/, 7];
                            return [4 /*yield*/, page.waitForFunction(waitForFunction)];
                        case 6:
                            _e.sent();
                            _e.label = 7;
                        case 7: return [4 /*yield*/, _1.screenshotDomElement(page, selector)];
                        case 8:
                            screen_1 = _e.sent();
                            //print the screenshot
                            this.printImage(screen_1, __assign({}, restOfOptions));
                            return [3 /*break*/, 11];
                        case 9:
                            e_1 = _e.sent();
                            console.error(e_1.stack);
                            return [2 /*return*/, e_1];
                        case 10:
                            //make sure page is closed.
                            if (page) {
                                page.close();
                            }
                            return [7 /*endfinally*/];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        this.adapter = adapter;
        this.escposPrinter = new escpos.Printer(adapter, options);
    }
    /**
     * print the given image, image should be a buffer or an url
     */
    Printer.prototype.printImage = function (image, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.topFeed, topFeed = _c === void 0 ? 2 : _c, _d = _b.bottomFeed, bottomFeed = _d === void 0 ? 2 : _d, _e = _b.cut, cut = _e === void 0 ? true : _e, beep = _b.beep, cashdraw = _b.cashdraw, _f = _b.imageFormat, imageFormat = _f === void 0 ? "png" : _f;
        //translate the buffer or url into pixels
        getPixels(image, "image/" + imageFormat, function (err, pixels) {
            if (err) {
                console.error(err);
            }
            else {
                _this.adapter.open(function (adapterErr) {
                    if (adapterErr) {
                        console.error(adapterErr);
                    }
                    else {
                        //the printing process:
                        //feed top
                        if (topFeed)
                            _this.escposPrinter.feed(topFeed);
                        //print the given image in middle of the paper
                        _this.escposPrinter.align("ct").raster(new escpos.Image(pixels), null);
                        //feed bottom
                        if (bottomFeed)
                            _this.escposPrinter.feed(bottomFeed);
                        //cut paper
                        if (cut)
                            _this.escposPrinter.cut();
                        //use buzzer
                        if (beep)
                            _this.beep(beep);
                        //open connected cashdrawer
                        if (cashdraw)
                            _this.cashdraw(cashdraw);
                        //flush commands and close connection
                        _this.escposPrinter.close();
                    }
                });
            }
        });
    };
    return Printer;
}());
exports.default = Printer;
//# sourceMappingURL=printer.js.map