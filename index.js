const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate.js');
// const slugify = require('slugify');//slugify inport from npm, npm i slugify

/////////////////////////////////
// FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR! 💥');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written 😁');
//       })
//     });
//   });
// });
// console.log('Will read file!');

/////////////////////////////////

// SERVER

const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	'utf-8'
);
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	'utf-8'
);
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);

//////////////////////////////////////////////////////
//using slugify
// const slugs = productData.map(el => slugify(el.productName, { lower: true }))
// console.log(slugs);

const server = http.createServer((req, res) => {
	const { query, pathname } = url.parse(req.url, true);

	// const pathname = req.url;

	//overview page
	if (pathname === '/' || pathname === '/overview') {
		res.writeHead(200, {
			'Content-type': 'text/html',
		});
		const cardsHtml = productData
			.map((el) => replaceTemplate(tempCard, el))
			.join('');
		// console.log(cardsHtml);
		const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
		res.end(output);
	}

	//product page
	else if (pathname === '/product') {
		const product = productData[query.id];
		res.writeHead(200, {
			'Content-type': 'text/html',
		});
		const output = replaceTemplate(tempProduct, product);
		res.end(output);
	}

	//api
	else if (pathname === '/api') {
		res.writeHead(200, {
			'Content-type': 'application/json',
		});
		res.end(data);
	}

	//not found
	else {
		res.writeHead(404, {
			'content-type': 'text/html',
		});
		res.end('<h1>page not found!</h1>');
	}
	// res.end("hello from the server");
});

server.listen(8000, '127.0.0.1', () => {
	console.log('server started');
});
