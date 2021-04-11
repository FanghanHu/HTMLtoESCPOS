## HTMLtoESCPOS

This module renders html and allow it to be printed with an POS printer.

![results](https://github.com/FanghanHu/HTMLtoESCPOS/raw/master/readmeImages/Results.jpg)


## How it works:
This module uses [Puppeteer](https://developers.google.com/web/tools/puppeteer) to render html in a chromium browser in the background.
Then a screenshot is taken and printed as a png image using [ESCPOS](https://www.npmjs.com/package/escpos).

## example:
```
    import { closeBrowser, CreateNetworkPrinter } from "htmltoescpos";

    const test = async () => {
        const printer = CreateNetworkPrinter("192.168.0.151");
        await printer.printUrl('https://www.google.com', {
            beep: {count: 2, time: 5}
        });
        await closeBrowser();
    }

    test();
```
