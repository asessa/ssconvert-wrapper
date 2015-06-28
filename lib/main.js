(function() {
	var cp = require('child_process');
	var fs = require('fs');

	var ssconvert_binary;
	var process;
	var processed = false;

	var paths = [
		'/usr/local/bin/ssconvert',
		'/usr/bin/ssconvert'
	];

	for (var i = 0, c = paths.length; i < c; i++) {
		try {
			if (fs.statSync(paths[i])) {
				ssconvert_binary = paths[i];
				break;
			}
		} catch (e) {
		}
	}

	if (!ssconvert_binary) throw new Error('ssconvert binary not found.');

	exports.typeToImporter = function(type) {
		switch (type) {
			case 'xls': return 'Gnumeric_Excel:excel';
			case 'xlsx': return 'Gnumeric_Excel:xlsx';
			case 'ods': return 'Gnumeric_OpenCalc:openoffice';
			case 'csv':
			case 'tsv':  return 'Gnumeric_stf:stf_csvtab';
		}
	}

	exports.typeToExporter = function(type) {
		switch (type) {
			case 'xls': return 'Gnumeric_Excel:excel_biff8';
			case 'xlsx': return 'Gnumeric_Excel:xlsx';
			case 'ods': return 'Gnumeric_OpenCalc:openoffice';
			case 'csv': return 'Gnumeric_stf:stf_csv';
			case 'html': return 'Gnumeric_html:html40';
		}
	}

	exports.convert = function(opts, callback) {
		if (typeof opts == 'undefined') return 'Invalid options.';

		if (!opts.input || !opts.output) return 'Invalid options.';

		var self = this;
		var args = [];
		self.processed = false;

		if (opts.inputType) {
			args.push('-I');
			args.push(self.typeToImporter(opts.inputType));
		}

		args.push(opts.input);

		if (opts.outputType) {
			args.push('-T');
			args.push(self.typeToExporter(opts.outputType));
		}

		args.push(opts.output);

		process = cp.spawn(ssconvert_binary, args);

		process.stdout.on('data', function (data) {
			if (self.processed) return;
			self.processed = true;
			callback && callback(false, data);
		});

		process.stderr.on('data', function (data) {
			if (self.processed) return;
			self.processed = true;
			callback && callback(false, false);
		});

		process.on('error', function(e) {
			if (self.processed) return;
			self.processed = true;
			callback && callback(e, false);
		});
	}
}).call(this);