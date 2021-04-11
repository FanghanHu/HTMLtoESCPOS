import {Browser, launch, Page} from "puppeteer";
import Printer from "./printer";

const NetworkAdapter = require("escpos-network") ;
const SerialAdapter = require("escpos-serialport");
const USBAdapter = require("escpos-usb");

let browser:Browser;

export const getBrowser = ():Browser => {
    return browser;
}

/**
 * start the internal chromium browser
 */
export const launchBrowser = async () => {
    if(!browser) {
        console.info('Launching Headless Chrome');
        try{
            if(process.platform === 'linux') {
                //linux needs to install chromium separately as of 2019, the automatically installed chromium didn't work on raspberry pi.
                browser = await launch({executablePath: '/usr/bin/chromium-browser', args:['--no-sandbox']});
            } else {
                browser = await launch();
            }
        } catch (e) {
            console.error("failed to launch puppeteer browser.");
            console.error(e);
        }
        console.info('Headless Chrome Launched');
    }
}

/**
 * shut down the internal chromium browser
 */
export const closeBrowser = async () => {
    if(browser) {
        console.info("closing internal chromium browser.");
        await browser.close();
        browser = null;
        console.info("Internal chromium browser closed.");
    } else {
        console.error("There is no active browser.");
    }
}

/**
 * 
 * @param page Puppeteer page, the page to take screenshot on.
 * @param selector css selector, use an id to avoid confusion.
 * @param padding padding around the element, in pixels, default is 0, other element may show in the padding area.
 * @returns the image in a buffer.
 */
export const screenshotDomElement = async (page: Page, selector:string, padding:number = 0):Promise<Buffer> => {
    if(!selector) throw "Please provide a selector.";
    
    //get dimension of the selected element
    const rect = await page.evaluate(selector => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const {x, y, width, height} = element.getBoundingClientRect();
        return {left: x, top: y, width, height, id: element.id};
    }, selector);
    if (!rect) throw Error(`Could not find element that matches selector: ${selector}.`);

    //adjust viewport so the element adjust to the correct size
    await page.setViewport({
        width: rect.width + padding * 2,
        height: rect.height + padding * 2});

    //take the screenshot
    return await page.screenshot({
        clip: {
            x: rect.left - padding,
            y: rect.top - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2
        }
    });
}

/**
 * 
 * @param ip the ip address to connect to the printer
 * @param port port number, most printer have default port of 9100
 * @param options printer options, see https://www.npmjs.com/package/escpos for detail, or just print out "printer.escposPrinter" too see what options are available
 * @returns 
 */
export const CreateNetworkPrinter = (ip:string, port = 9100, options = {}):Printer => {
    return new Printer(new NetworkAdapter(ip, port), options);
};

/**
 * @param pid port id, for example '/dev/usb/lp0'
 * @param options printer options, see https://www.npmjs.com/package/escpos for detail, or just print out "printer.escposPrinter" too see what options are available
 * @returns 
 */
export const CreateSerialPrinter = (pid:string, options = {}):Printer => {
    return new Printer(new SerialAdapter(pid), options);
};

export const CreateUSBPrinter = (vid:number, pid:number, options = {}):Printer => {
    //TODO: implement a way to find printers with https://github.com/song940/node-escpos/blob/v3/packages/usb/README.md
    return new Printer(new USBAdapter(vid, pid), options);
}

const htmltoescpos = {
    CreateNetworkPrinter,
    CreateSerialPrinter,
    CreateUSBPrinter,
    screenshotDomElement,
    closeBrowser,
    launchBrowser
}

export default htmltoescpos;