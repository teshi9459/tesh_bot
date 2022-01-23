const Jimp = require("jimp");
const fs = require('fs');

const w = Jimp.measureText(Jimp.FONT_SANS_32_BLACK, 'Some string'); // width of text

Jimp.read('./media/bg.jpg')
.then(image => {
 Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {

  return image
  .resize(1000, Jimp.AUTO) // resize
  .print(
   font, // height of text
   w,
   300,
   'Some string'
  ) // prints 'Hello world!' on an image, middle and center-aligned, when x = 0 and y = 0
  .write('./media/out.jpg'); // save
 });
})
.catch(err => {
 console.error(err);
});