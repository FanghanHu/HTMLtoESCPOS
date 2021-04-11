/// <reference types="node" />
import { Browser, Page } from "puppeteer";
import Printer from "./printer";
export declare const getBrowser: () => Browser;
/**
 * start the internal chromium browser
 */
export declare const launchBrowser: () => Promise<void>;
/**
 * shut down the internal chromium browser
 */
export declare const closeBrowser: () => Promise<void>;
/**
 *
 * @param page Puppeteer page, the page to take screenshot on.
 * @param selector css selector, use an id to avoid confusion.
 * @param padding padding around the element, in pixels, default is 0, other element may show in the padding area.
 * @returns the image in a buffer.
 */
export declare const screenshotDomElement: (page: Page, selector: string, padding?: number) => Promise<Buffer>;
/**
 *
 * @param ip the ip address to connect to the printer
 * @param port port number, most printer have default port of 9100
 * @param options printer options, see https://www.npmjs.com/package/escpos for detail, or just print out "printer.escposPrinter" too see what options are available
 * @returns
 */
export declare const CreateNetworkPrinter: (ip: string, port?: number, options?: {}) => Printer;
/**
 * @param pid port id, for example '/dev/usb/lp0'
 * @param options printer options, see https://www.npmjs.com/package/escpos for detail, or just print out "printer.escposPrinter" too see what options are available
 * @returns
 */
export declare const CreateSerialPrinter: (pid: string, options?: {}) => Printer;
export declare const CreateUSBPrinter: (vid: number, pid: number, options?: {}) => Printer;
declare const htmltoescpos: {
    CreateNetworkPrinter: (ip: string, port?: number, options?: {}) => Printer;
    CreateSerialPrinter: (pid: string, options?: {}) => Printer;
    CreateUSBPrinter: (vid: number, pid: number, options?: {}) => Printer;
    screenshotDomElement: (page: Page, selector: string, padding?: number) => Promise<Buffer>;
    closeBrowser: () => Promise<void>;
    launchBrowser: () => Promise<void>;
};
export default htmltoescpos;
