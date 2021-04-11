var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const escpos = require("escpos");
const getPixels = require("get-pixels");
import { getBrowser, launchBrowser, screenshotDomElement } from ".";
/**
 * you can use adapter and escpostPrinter field to issue custom commands as well, see https://github.com/song940/node-escpos for details
 */
export default class Printer {
    constructor(adapter, options = {}) {
        /**
         * send a beep sequence to the buzzer
         */
        this.beep = (options) => {
            this.escposPrinter.beep(options.count, options.time);
        };
        /**
         * open cashdraw on a specific pin
         */
        this.cashdraw = (pin) => {
            this.escposPrinter.cashdraw(pin);
        };
        /**
         * print the given url. <see cref="PrintImageOptions"/>
         * @param url the url to print
         * @param options
         * @see PrintUrlOptions
         * @see PrintImageOptions
         */
        this.printUrl = (url, _a = {}) => __awaiter(this, void 0, void 0, function* () {
            var { pageWidth: viewportWidth = 575, pageHeight: viewportHeight = 600, waitForFunction, selector = 'body' } = _a, restOfOptions = __rest(_a, ["pageWidth", "pageHeight", "waitForFunction", "selector"]);
            //make sure the internal browser is open
            yield launchBrowser();
            let page;
            try {
                //open a new page
                page = yield getBrowser().newPage();
                //set viewport
                yield page.setViewport({ width: viewportWidth, height: viewportHeight });
                //go to the url
                yield page.goto(url);
                //wait for the waitForFunction to become true
                if (waitForFunction)
                    yield page.waitForFunction(waitForFunction);
                //screenshot the selected element or the whole body
                const screen = yield screenshotDomElement(page, selector);
                //print the screenshot
                this.printImage(screen, Object.assign({}, restOfOptions));
            }
            catch (e) {
                console.error(e.stack);
                return e;
            }
            finally {
                //make sure page is closed.
                if (page) {
                    page.close();
                }
            }
        });
        this.adapter = adapter;
        this.escposPrinter = new escpos.Printer(adapter, options);
    }
    /**
     * print the given image, image should be a buffer or an url
     */
    printImage(image, { topFeed = 2, bottomFeed = 2, cut = true, beep, cashdraw, imageFormat = "png" } = {}) {
        //translate the buffer or url into pixels
        getPixels(image, "image/" + imageFormat, (err, pixels) => {
            if (err) {
                console.error(err);
            }
            else {
                this.adapter.open(adapterErr => {
                    if (adapterErr) {
                        console.error(adapterErr);
                    }
                    else {
                        //the printing process:
                        //feed top
                        if (topFeed)
                            this.escposPrinter.feed(topFeed);
                        //print the given image in middle of the paper
                        this.escposPrinter.align("ct").raster(new escpos.Image(pixels), null);
                        //feed bottom
                        if (bottomFeed)
                            this.escposPrinter.feed(bottomFeed);
                        //cut paper
                        if (cut)
                            this.escposPrinter.cut();
                        //use buzzer
                        if (beep)
                            this.beep(beep);
                        //open connected cashdrawer
                        if (cashdraw)
                            this.cashdraw(cashdraw);
                        //flush commands and close connection
                        this.escposPrinter.close();
                    }
                });
            }
        });
    }
}
//# sourceMappingURL=printer.js.map