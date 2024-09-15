const fs = require("fs"); // fs stands for filesystem , By using the fs module here , We will get access to the functions for reading and
// writing data right into the file system

const http = require("http");

const url = require("url");

///////////////////// FILES ////////////////////////////////////////////////////////////////////////

// // Blocking synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8"); // Calling this readFileSync() function , It will read data from the "input.txt" file which
// // you have specified in the path and you are storing that readed data into a variable.

// console.log(textIn);

// const textOut = `This is what we know about avocado: ${textIn}.\n Created on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);

// console.log("File has been written to the output.txt file");

// // Non-Blocking Asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) {
//     return console.log("Error!");
//   }
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("File has been written successfully");
//       });
//     });
//   });
// });
// console.log("Reading the file....");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////// CREATING A WEB SERVER //////////////////////////////////////////////////////////////////////////

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data); // This will parse the data into object
// In the above dataObj , we have an array of all the objects that are in data.json

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true); // This parse() method is used to parse the variables out off the url , and the "true" tells
  // that we want to parse the query string(/product?id=0) into an object

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(""); // This line will be replaced by an array with five final HTML's
    // Each for one of the five cards
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id]; // here the dataObj is an array where we are retrieving the element at the position
    // that is coming from the query.id
    const output = replaceTemplate(tempProduct, product); // In this the product is coming from the above dataObj
    console.log(query);
    res.end(output);

    // API Page
  } else if (pathname === "/api") {
    // All Node.js scripts will get access to a variable name called "dirname" and this dirname always translates to the directory
    // in which the script that we are currently executing is located . The "." tells that where the script is running and __dirname is
    // where the current file is located.
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    // NOT FOUND page
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>The requested page could not be found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on port 8000");
});
