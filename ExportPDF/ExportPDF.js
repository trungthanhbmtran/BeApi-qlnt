var express = require('express');
var router = express.Router();

const PDFDocument =  require('pdfkit');

router.get('/generatePDF', async function(req, res, next) {
var myDoc = new PDFDocument({bufferPages: true});

let buffers = [1,2,3,4,5];
myDoc.on('data', buffers.push.bind(buffers));
myDoc.on('end', () => {

    let pdfData = Buffer.concat(buffers);
    res.writeHead(200, {
    'Content-Length': Buffer.byteLength(pdfData),
    'Content-Type': 'application/pdf',
    'Content-disposition': 'attachment;filename=test.pdf',})
    .end(pdfData);

});

myDoc.font('Times-Roman')
     .fontSize(12)
     .text(`this is a test text`);
myDoc.end();
});

module.exports = router;