const files = require('glob').sync('./!(index).js', {
	cwd: __dirname
});

files.forEach(f => require(f));