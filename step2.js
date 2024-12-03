const fs = require('fs');
const axios = require('axios');
const argv = process.argv;

function cat(path) {
	fs.readFile(path, "utf8", (err, data) => {
		if (err) {
			console.log(`Error reading ${path}:`, `\n ${err}`);
			process.exit(1);
		}
		console.log(data);
	});
}

async function webCat(url) {
  try {
    let resp = await axios.get(url);
    console.log(resp.data);
  } catch(err) {
    console.log(`Error fetching ${url}:`, `\n ${err}`);
    process.exit(1);
  }
}

let input = argv[2];

try {
  new URL(input);  // If this succeeds, it's a URL. Calls webCat.
  webCat(input);
} catch (err) {
  cat(input);  // If an error is thrown, it's not a valid URL. Calls cat.
}