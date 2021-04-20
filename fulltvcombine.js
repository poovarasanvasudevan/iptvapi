const path = require('path')
const fs = require('fs')


const dirName = path.join(__dirname, "api/indiatv");



async function foo() {
  var arr = [];
  const fileList = await fs.readdirSync(dirName)
  for (let i = 0; i < fileList.length; i++) {
    const filename = fileList[i];
    if (!filename.toLowerCase().endsWith(".json")) continue;
    const fullFilename = path.join(dirName, filename);
    if(filename !== 'index.json') {
      const data = await fs.readFileSync(fullFilename, {encoding: "utf-8"})
      const fileContent =  JSON.parse(data);
      fileContent.forEach(x => {
        x['language'] = filename.replace(".json","").toUpperCase()
        arr.push(x)
      })
    }
  }
  fs.writeFile(path.join(__dirname, 'api', 'indiatv','indiatv.json'), JSON.stringify(arr), (a) => {
    console.log("DONE")
  })
}

foo()
