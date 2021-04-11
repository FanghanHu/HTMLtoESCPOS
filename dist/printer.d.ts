/// <reference types="node" />
import { EvaluateFn } from "puppeteer";
export declare type PrintImageOptions = {
    /**
     * how many lines of empty space should be kept before printing.
     */
    topFeed?: number;
    /**
     * how many lines of empty space should be kept after printing.
     */
    bottomFeed?: number;
    /**
     * should printer cut the paper after printing.
     */
    cut?: boolean;
    /**
     * Sends a pulse to the cash drawer in the specified pin.
     */
    cashdraw?: number;
    /**
     * Printer Buzzer (Beep sound).
     */
    beep?: Beep;
};
export declare type Beep = {
    /**
     * number of times buzzer should beep
     */
    count: number;
    /**
     * length of each beep sound in time * 100 miliseconds.
     */
    time: number;
};
export declare type PrintUrlOptions = {
    /**
     * width of the viewport when rendering the url
     */
    pageWidth?: number;
    /**
     * height of the viewport when rendering the url, may effect the layout, but the selected element will print regardless if fully fit within the viewport.
     */
    pageHeight?: number;
    /**
     * a condition that will be evaluated on the internal browser before the page is printed. it will be evaluated non-stop until it becomes true.
     */
    waitForFunction?: EvaluateFn<any>;
    /**
     * A css selector to determine with element to print, default is body.
     */
    selector?: string;
} & PrintImageOptions;
/**
 * you can use adapter and escpostPrinter field to issue custom commands as well, see https://github.com/song940/node-escpos for details
 */
export default class Printer {
    adapter: any;
    escposPrinter: any;
    constructor(adapter: any, options?: {});
    /**
     * print the given image, image should be a buffer or an url
     */
    printImage(image: Buffer | string, { topFeed, bottomFeed, cut, beep, cashdraw }?: PrintImageOptions): void;
    /**
     * send a beep sequence to the buzzer
     */
    beep: (options: Beep) => void;
    /**
     * open cashdraw on a specific pin
     */
    cashdraw: (pin: number) => void;
    /**
     * print the given url. <see cref="PrintImageOptions"/>
     * @param url the url to print
     * @param options
     * @see PrintUrlOptions
     * @see PrintImageOptions
     */
    printUrl: (url: string, { pageWidth: viewportWidth, pageHeight: viewportHeight, waitForFunction, selector, ...restOfOptions }?: PrintUrlOptions) => Promise<any>;
}
