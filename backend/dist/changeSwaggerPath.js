const fs = require("fs");

const swaggerJson = fs.readFileSync("./dist/swaggerJson.json");
let data = JSON.parse(swaggerJson);

function checkMethod(path) {
  if (data.paths[path]["post"] !== undefined) return "post";
  else if (data.paths[path]["get"] !== undefined) return "get";
  else if (data.paths[path]["put"] !== undefined) return "put";
  else if (data.paths[path]["delete"] !== undefined) return "delete";
  else if (data.paths[path]["patch"] !== undefined) return "patch";
  else return null;
}

for (let path in data.paths) {
  const method = checkMethod(path);
  if (method) {
    data = JSON.parse(
      JSON.stringify(data).replace(path + '"', "/" + path + '"')
    );
  } else {
    console.log(path + " not found method");
  }
}

fs.writeFileSync(
  "./dist/swaggerJson.json",
  JSON.stringify(data),
  "utf-8",
  (err) => {
    if (err) throw err;
    console.log("Data added to file");
  }
);
