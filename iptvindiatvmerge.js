const fs = require('fs')
const path = require('path')


var fulljson = require('./api/country/in.json')

fulljson.forEach(x => {
  if (x['languages'] && x['languages'].length > 0) {
    var filename = x['languages'][0]['name'].toLowerCase()
    var stream = x['url']

    try {
      var languageJson = require(`./api/indiatv/${filename}.json`)
      languageJson.push({
        "url": "",
        "stream": stream,
        "title": x['name'],
        "logo": x['logo']
      })

      fs.writeFile(path.join(__dirname, 'api', 'indiatv', `${filename}.json`), JSON.stringify(languageJson), (a) => {
        console.log("DONE")
      })
    } catch (e) {
      console.log(e)
    }

  }
})
