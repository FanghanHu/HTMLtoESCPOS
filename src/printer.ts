const escpos = require("escpos");
const getPixels = require("get-pixels");

import { EvaluateFn, Page } from "puppeteer";
import { getBrowser, launchBrowser, screenshotDomElement } from ".";

export type PrintImageOptions = {
	/**
	 * how many lines of empty space should be kept before printing.
	 */
	topFeed ?: number;

	/**
	 * how many lines of empty space should be kept after printing.
	 */
	bottomFeed ?: number;
	/**
	 * should printer cut the paper after printing.
	 */
	cut ?: boolean;

    /**
     * Sends a pulse to the cash drawer in the specified pin.
     */
    cashdraw ?: number;

    /**
     * Printer Buzzer (Beep sound).
     */
    beep ?: Beep;

	/**
	 * format of the image, png by default
	 */
	imageFormat ?: "png" | "jpeg" | "gif";
};

export type Beep = {
    /**
     * number of times buzzer should beep
     */
    count:number,

    /**
     * length of each beep sound in time * 100 miliseconds.
     */
    time:number
}

export type PrintUrlOptions = {
	/**
	 * width of the viewport when rendering the url
	 */
	pageWidth ?: number;

    /**
	 * height of the viewport when rendering the url, may effect the layout, but the selected element will print regardless if fully fit within the viewport.
	 */
    pageHeight ?: number;

    /**
     * a condition that will be evaluated on the internal browser before the page is printed. it will be evaluated non-stop until it becomes true.
     */
    waitForFunction ?: EvaluateFn<any>;

    /**
     * A css selector to determine with element to print, default is body.
     */
    selector ?: string; 
} & PrintImageOptions;

/**
 * you can use adapter and escpostPrinter field to issue custom commands as well, see https://github.com/song940/node-escpos for details
 */
export default class Printer {
	adapter;
	escposPrinter;

	constructor(adapter, options = {}) {
		this.adapter = adapter;
		this.escposPrinter = new escpos.Printer(adapter, options);
	}

	/**
	 * print the given image, image should be a buffer or an url
	 */
	printImage(
		image: Buffer | string,
		{ topFeed = 2, bottomFeed = 2, cut = true , beep, cashdraw, imageFormat = "png"}: PrintImageOptions = {}
	) {
		//translate the buffer or url into pixels
		getPixels(image, "image/" + imageFormat , (err, pixels) => {
			if (err) {
				console.error(err);
			} else {
				this.adapter.open(adapterErr => {
					if (adapterErr) {
						console.error(adapterErr);
					} else {
						//the printing process:
						//feed top
						if (topFeed) this.escposPrinter.feed(topFeed);
						//print the given image in middle of the paper
						this.escposPrinter.align("ct").raster(new escpos.Image(pixels), null);
						//feed bottom
						if (bottomFeed) this.escposPrinter.feed(bottomFeed);
						//cut paper
						if (cut) this.escposPrinter.cut();
						//use buzzer
						if (beep) this.beep(beep);
						//open connected cashdrawer
						if (cashdraw) this.cashdraw(cashdraw);
						//flush commands and close connection
						this.escposPrinter.close();
					}
				})
			}
		});
	}

    /**
     * send a beep sequence to the buzzer
     */
    beep = (options : Beep) => {
        this.escposPrinter.beep(options.count, options.time);
    }

    /**
     * open cashdraw on a specific pin
     */
    cashdraw = (pin : number) => {
        this.escposPrinter.cashdraw(pin);
    }

    /**
     * print the given url. <see cref="PrintImageOptions"/>
     * @param url the url to print
     * @param options 
     * @see PrintUrlOptions
     * @see PrintImageOptions
     */
	printUrl = async (
		url: string,
		{ pageWidth: viewportWidth = 575, pageHeight: viewportHeight = 600, waitForFunction, selector = 'body', ...restOfOptions } : PrintUrlOptions = {}
	) => {
		//make sure the internal browser is open
		await launchBrowser();

		let page: Page;
		try {
            //open a new page
			page = await getBrowser().newPage();

            //set viewport
            await page.setViewport({width: viewportWidth, height: viewportHeight});

            //go to the url
            await page.goto(url);

            //wait for the waitForFunction to become true
            if(waitForFunction) await page.waitForFunction(waitForFunction);

            //screenshot the selected element or the whole body
            const screen = await screenshotDomElement(page, selector);

            //print the screenshot
            this.printImage(screen, {...restOfOptions});
		} catch (e) {
			console.error(e.stack);
			return e;
		} finally {
            //make sure page is closed.
			if (page) {
				page.close();
			}
		}
	};
}
