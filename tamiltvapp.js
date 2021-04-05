const json = require('./api/tamilapp2.json')
const path = require('path')
const fs = require('fs')


const tvC = []
const tempC = {}
json.channels.map(x => {
  if(tempC[x.category]) {
    tempC[x.category].push(x)
  } else {
    tempC[x.category] = []
    tempC[x.category].push(x)
  }
})

Object.keys(tempC).map(x => {
  tvC.push({
    label : x,
    count: tempC[x].length,
    channels: tempC[x]
  })
})


fs.writeFile(path.join(__dirname, 'api', 'tamiltvapp.json'), JSON.stringify(tvC), (a) => {
  console.log("DONE")
})
