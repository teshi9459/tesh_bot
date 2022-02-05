module.exports = {
 getSteckiSmal: function (text) {
  const index = Math.ceil(text.length/4000);
  let out = [];
  for (let i = 0; i < index; i++) {
   try {
    out.push(text.slice(4000*i, 4000*(i+1)));
   } catch (e) {}
  }
  return out;
  //maximal 6 k zeichen (warnung und in 2 aufsplitten oder 2 felder dazu)
 },
 killSpace: function (text) {
  if (text[0] == ' ') {
   text = text.substring(1);
  }
  if (text[text.length-1] == ' ') {
   text = text.substring(0, text.length-1);
  }
  if (text[0] != ' ' && text[text.length-1] != ' ') {
   return text;
  } else {
   return this.killSpace(text);
  }
 },
 getShorts: function (typ, text) {
  let first,
  second;
  switch (typ) {
   case 'name':
    first = '**Ganzer Name:**';
    second = '**Alter:**';
    break;
   case 'age':
    first = '**Alter:**';
    second = '**Aussehen:**';
    break;
   case 'rang':
    first = '**Rang:**';
    second = '**Klasse:**';
    break;
   case 'gilde':
    first = '**Gilde:**';
    second = '**Rang:**';
    break;
  }
  try {
   text = text.replace(/\n/g, " ");
   text = text.split(first)[1];
   text = text.split(second)[0];
   text = this.killSpace(text);
  } catch (e) {
   console.error(e)
   text = "Error "+ typ;
  }
  return text;
 }
};