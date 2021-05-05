const fs = require('fs')
const path = require('path')


let rawdata = fs.readFileSync(path.join(__dirname, 'api', 'arabictv1', 'egypt.json'));
let arabiclanguage = JSON.parse(rawdata);

var arabiccat = {};
arabiclanguage.forEach(d => {
  if (d.category === null) {
    if (arabiccat.hasOwnProperty("Other")) {
      arabiccat['Other'].push(d)
    } else {
      arabiccat['Other'] = []
      arabiccat['Other'].push(d)
    }
  } else {
    if (arabiccat.hasOwnProperty(d.category)) {
      arabiccat[d.category].push(d)
    } else {
      arabiccat[d.category] = []
      arabiccat[d.category].push(d)
    }
  }
})


var b = []
Object.keys(arabiccat).forEach(k => {
  fs.writeFileSync(path.join(__dirname, 'api', 'arabictv', `${k}.json`), JSON.stringify(arabiccat[k]));
  b.push({"file": `${k}.json`, 'title': k})
})

fs.writeFileSync(path.join(__dirname, 'api', 'arabictv', 'index.json'), JSON.stringify(b));
fs.writeFileSync(path.join(__dirname, 'api', 'arabictv', 'full.json'), JSON.stringify(arabiclanguage));
