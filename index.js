'use strict';
var chalk = require('chalk');
var table = require('text-table');
var logSymbols = require('log-symbols');
var stringLength = require('string-length');

function pluralize(str, count) {
	return str + (count === 1 ? '' : 's');
}

module.exports = {
	reporter: function (result, config, options) {
		var total = result.length;
		var headers = [];
		var prevfile;
		var errorCount = 0;
		var warningCount = 0;

		options = options || {};

		var lines = [];

		result.forEach(function (el, i) {
			var err = el.error;
			// E: Error, W: Warning, I: Info
			var isError = err.code && err.code[0] === 'E';

			var line = [
				'',
				chalk.magenta('line ' + err.line),
				chalk.magenta('col ' + err.character),
				isError ? chalk.red(err.reason) : chalk.yellow(err.reason)
			];

			if (el.file !== prevfile) {
				headers[lines.length] = el.file;
			}

			if (options.verbose) {
				line.push(chalk.gray('(' + err.code + ')'));
			}

			lines.push(line);

			/* Display offending source code */
			var code = err.evidence;
			code = code.replace(/^\s*|\s*$/g, '');
			code = code.substr(0, 80);
			/* Highlight terms quoted in reason */
			var oops = err.reason.match(/'.*?[^\\]'/g);
			if (oops) {
				/* RegEx-based highlighting, so escape terms as needed */
				var rx = new RegExp(oops
					.map(function (oop) {
						return oop.substr(1, oop.length - 2)
							.replace(/([\.\?\+\*\(\)\^\$\[\]\\])/g, '\\$1');
					})
					.join('|'), 'g');
				code = code.replace(rx, function (s) { return chalk.white(s); });
			}
			lines.push([' ', ' ', ' ', chalk.gray(code)]);

			if (isError) {
				errorCount++;
			} else {
				warningCount++;
			}

			prevfile = el.file;
		});

		var details = table(lines, { stringLength: stringLength })
			.split('\n')
			.map(function (el, i) {
				return headers[i] ? '\n' + chalk.underline(headers[i]) + '\n' + el : el;
			})
			;

		var summary = [];
		if (total > 0) {
			if (errorCount > 0) {
				summary.push([logSymbols.error, '', errorCount, pluralize('error', errorCount)]);
			}
			if (warningCount > 0) {
				summary.push([logSymbols.warning, '', warningCount, pluralize('warning', total)]);
			}
			summary.push([]);
		} else {
			summary.push([logSymbols.success, 'No problems']);
		}

		var report = [
			details.join('\n'),
			summary.map(function (line) { return '  ' + line.join(' '); }).join('  '),
			''
		].join('\n\n');

		console.log(report);
	}
};
