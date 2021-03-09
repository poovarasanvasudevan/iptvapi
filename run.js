const http = require('https');
const fs = require('fs');
const path = require('path');
const request = require('request');
const tamil = require('./extras/tamil')

const URL = "https://iptv-org.github.io/iptv/channels.json"


http.get(URL, (res) => {
  let body = "";

  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    try {
      let json = JSON.parse(body);
      createData(json)

    } catch (error) {
      console.error(error.message);
    }
  });
}).on("error", (error) => {
  console.error(error.message);
});

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    if (err == null) {
      request(url)
        .pipe(fs.createWriteStream(path))
        .on('close', callback)
    }
  })
}

function createData(json) {
  console.log("Data Got")
  fs.writeFileSync(path.join(__dirname, 'api', 'channel.json'), JSON.stringify(json));

  const category = []
  const country = []
  const language = []

  //byCategory
  const globalCategory = {}
  const globalCountry = {}
  const globalLanguage = {}
  json.forEach((item) => {
    if (item.category !== 'XXX') {
      if (item.category === null) {
        if (globalCategory.hasOwnProperty("nocategory")) {
          globalCategory['nocategory'].push(item)
        } else {
          globalCategory['nocategory'] = []
          globalCategory['nocategory'].push(item)
        }
      } else {
        if (globalCategory.hasOwnProperty(item.category)) {
          globalCategory[item.category].push(item)
        } else {
          globalCategory[item.category] = []
          globalCategory[item.category].push(item)
        }
      }


      if (item.countries == null || item.languages.length === 0) {
        if (globalCountry.hasOwnProperty("nocountry")) {
          globalCountry['nocountry'].push(item)
        } else {
          globalCountry['nocountry'] = []
          globalCountry['nocountry'].push(item)
        }
      } else {
        item.countries.forEach((country) => {
          if (globalCountry.hasOwnProperty(country.code + "!" + country.name)) {
            globalCountry[country.code + "!" + country.name].push(item)
          } else {
            globalCountry[country.code + "!" + country.name] = []
            globalCountry[country.code + "!" + country.name].push(item)
          }
        })
      }


      if (item.languages == null || item.languages.length === 0) {
        if (globalLanguage.hasOwnProperty("nolanguage")) {
          globalLanguage['nolanguage'].push(item)
        } else {
          globalLanguage['nolanguage'] = []
          globalLanguage['nolanguage'].push(item)
        }
      } else {

        item.languages.forEach((lang) => {
          if (globalLanguage.hasOwnProperty(lang.code + "!" + lang.name)) {
            globalLanguage[lang.code + "!" + lang.name].push(item)
          } else {
            globalLanguage[lang.code + "!" + lang.name] = []
            globalLanguage[lang.code + "!" + lang.name].push(item)
          }
        })
      }
    }
  })


  Object.keys(globalCategory).map(key => {
    category.push({name: key, code: key, count: globalCategory[key].length})
    fs.writeFileSync(path.join(__dirname, 'api', 'category', `${key}.json`), JSON.stringify(globalCategory[key]));
  })

  Object.keys(globalCountry).map(key => {
    country.push({
      code: key.split("!")[0],
      name: key.split("!")[1] || key.split("!")[0],
      count: globalCountry[key].length
    })

    const fJson = globalCountry[key]

    // const mpath = path.join(__dirname , 'extras','country',`${key.split("!")[0]}.json`)
    // if(fs.exists(mpath)) {
    //   let rawdata = fs.readFileSync(mpath);
    //   let raw = JSON.parse(rawdata);
    //   fJson.concat(raw)
    // }
    fs.writeFileSync(path.join(__dirname, 'api', 'country', `${key.split("!")[0]}.json`), JSON.stringify(fJson));
  })

  Object.keys(globalLanguage).map(key => {
    language.push({
      code: key.split("!")[0],
      name: key.split("!")[1] || key.split("!")[0],
      count: globalLanguage[key].length
    })
    fs.writeFileSync(path.join(__dirname, 'api', 'language', `${key.split("!")[0]}.json`), JSON.stringify(globalLanguage[key]));

    if (key.split("!")[0] === 'tam') {
      var mjson = globalLanguage[key].map(mm => ({
        name: mm['name'],
        url: mm['url'],
        logo: mm['logo'],
        category: mm['category']
      }))
      var kj = tamil.concat(mjson);

      const config = {
        showLogo: true,
        channels: kj
      }

      fs.writeFileSync(path.join(__dirname, 'api', `tamilapp.json`), JSON.stringify(config));
    }
  })


  fs.writeFileSync(path.join(__dirname, 'api', 'category.json'), JSON.stringify(category));
  fs.writeFileSync(path.join(__dirname, 'api', 'country.json'), JSON.stringify(country));
  fs.writeFileSync(path.join(__dirname, 'api', 'language.json'), JSON.stringify(language));
  Object.keys(globalCountry).map(key => {

    fs.copyFile(path.join(__dirname ,'flag',`${key.split("!")[0]}_64.png`) , path.join(__dirname ,'api','country','flags',`${key.split("!")[0]}.png`),() => {})
  });

  console.log("end all")
}
