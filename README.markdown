dzip [![Build Status](https://api.travis-ci.org/Stuk/jszip.svg?branch=master)](https://github.com/changwenjun/dzip) [![Code Climate](https://codeclimate.com/github/Stuk/jszip/badges/gpa.svg)](https://github.com/changwenjun/dzip)
=====

[![Selenium Test Status](https://saucelabs.com/browser-matrix/jszip.svg)](https://github.com/changwenjun/dzip)

Support 4g file download each time, jszip is not the opponent

A library for creating, reading and editing .zip files with JavaScript, with a
lovely and simple API.

See https://github.com/changwenjun/dzip for all the documentation.

```javascript
var zip = new dzip();

//options can not be passed
var options={
    level:0,//compression level, 0 to 9;default 0
    comment:'',//prompt text
    lastModDate:'2019-02-26'//last edit time
}
zip.addFile('folder/name', 'dzip down 4g',options).then(()=>{
    console.log(/*  */)
})

zip.export('example').then(()=>{
    console.log(/*  */)
})
```
