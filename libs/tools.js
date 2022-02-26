const fs = require('fs');
module.exports = {
 /**
 * sortiert Arry
 * @param {arry} ary - Arry zu sortieren.
 * @param {boolean} options - if true log in the console.
 */
 sort: function (ary, options) {
  ary = ary.sort(function (a, b) {
   return a - b;
  });
  if (options === true)
   console.log("tools> sorted an arry");
  return ary;
 },
 invert: function (ary, options) {
  ary = ary.sort(function (a, b) {
   return b - a;
  });
  if (options === true)
   console.log("tools> sorted an arry inverted");
  return ary;
 },
 getJ: function (path, options) {
  const rawdata = fs.readFileSync(path,
   'utf8');
  if (options === true)
   console.log("tools> get JSON from " + path) + " | " + rawdata;
  return JSON.parse(rawdata);
 },
 setJ: function (path,
  obj, options) {
  this.path(path, options);
  const json = JSON.stringify(obj);
  fs.writeFileSync(path,
   json);
  if (options === true)
   console.log("tools> wrote Json to " + path)+ " | " + obj;
 },
 wait: function (ms, options) {
  var start = Date.now(),
  now = start;
  while (now - start < ms) {
   now = Date.now();
  }
  if (options === true)
   console.log(`tools> waited ${ms} ms`);
 },
 random: function (min, max, options) {
  const out = Math.floor(Math.random() * max) + min;
  if (options === true)
   console.log(`tools> generated random number from ${min} to ${max}`);
  return out;
 },
 path: function (path, options) {
  let folder = path.split('/');
  folder.pop();
  if (!fs.existsSync(path)) {
   for (var i = 2; i <= folder.length; i++) {
    let rest = "";
    for (var j = 0; j < i; j++) {
     rest = rest + folder[j] + "/";
    }
    if (!fs.existsSync(rest))
     fs.mkdirSync(rest);
   }
   if (options === true)
    console.log("tools> Path " + path + " now exists");
  } else {
   if (options === true)
    console.log("tools> Path " + path + " already exists");
  }
 },
 delPath: function (path, options) {
  fs.rmSync(path, {
   recursive: true
  });
  if (options === true)
   console.log(`tools> ${path} is deleted`);
 },
 popA: function (arr, value) {
  for (let i = 0; i < arr.length; i++) {
   if (arr[i] == value) {
    arr.splice(i, 1);
    i--;
   }
  }
  return arr;
 },
 getTime: function (time) {
 const date = new Date(time);
 const year = date.getFullYear(),
 month = date.getMonth(),
 day = date.getDate(),
 weekday = date.getDay(),
 hours = date.getHours(),
 minutes = date.getMinutes(),
 seconds = date.getSeconds();
 return [['year',
  year],
  ['month',
   month],
  ['day',
   day],
  ['weekday',
   weekday],
  ['hours',
   hours],
  ['minutes',
   minutes],
  ['seconds',
   seconds]];
},
getTimeV: function (value, time) {
 time = this.getTime(time);
 for (let i = 0; i < time.length; i++) {
  if (time[i][0] === value) return time[i][1];
 }
 return undefined;
}
};