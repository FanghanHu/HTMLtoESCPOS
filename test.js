const app = require('./index');


test();

async function test() {
    let printer = new app.NetworkPrinter('192.168.0.151');
    await app.print(printer, 'https://www.google.com');
    await app.closeBrowser();
}