# ssconvert-wrapper
A small wrapper around ssconvert for node.js

### Install

```
npm install ssconvert-wrapper
```

### Usage

```
var ssconver = require('ssconvert-wrapper');

ssconvert.convert({
	input: 'filename.csv',
	inputType: 'csv',
	output: 'filename.xls',
	outputType: 'xls'
}, function(err, result) {
	console.log(err, result);
});
```

#### Options

input: input filename (full path)
inputType: (xls, xlsx, ods, csv, tsv)
output: output filename (full path)
outputType: (xls, xlsx, ods, csv, html)


