## HTMLtoESCPOS

This module renders html and allow it to be printed with an POS printer.

![results](https://github.com/FanghanHu/HTMLtoESCPOS/raw/master/readmeImages/Results.jpg)


## How it works:
This module uses [Puppeteer](https://developers.google.com/web/tools/puppeteer) to render html in a chromium browser in the background.
Then a screenshot is taken and printed as a png image using [ESCPOS](https://www.npmjs.com/package/escpos).

## example:
```
    const htmltoescpos = require('htmltoescpos');

    let printer = new htmltoescpos.NetworkPrinter('192.168.0.151');
    await htmltoescpos.print(printer, 'https://www.google.com');
    await htmltoescpos.closeBrowser();
```
