const fs = require('fs');
const axios = require('axios');
const argv = process.argv;

function handleContent(output, data) {
  if (output) {
    fs.writeFile(output, data, 'utf8', (err) => {
      if (err) {
        console.error(`Couldn't write ${output}:`, `\n ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(data);
  }
}

function cat(path, output) {
	fs.readFile(path, 'utf8', (err, data) => {
		if (err) {
			console.log(`Error reading ${path}:`, `\n ${err}`);
			process.exit(1);
		}
		handleContent(output, data);
	});
}

async function webCat(url, output) {
  try {
    let resp = await axios.get(url);
    handleContent(output, resp.data);
  } catch(err) {
    console.log(`Error fetching ${url}:`, `\n ${err}`);
    process.exit(1);
  }
}

// Determines presence of output argument
let output = null;
let input;

if (argv[2] === '--out') {
  output = argv[3];
  input = argv[4];
} else {
  input = argv[2];
}

try {
  new URL(input);  // If this succeeds, it's a URL. Calls webCat.
  webCat(input, output);
} catch (err) {
  cat(input, output);  // If an error is thrown, it's not a valid URL. Calls cat.
}