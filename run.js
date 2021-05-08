const http = require('https');
const fs = require('fs');
const path = require('path');
const request = require('request');
const tamil = require('./extras/tamil')
const tamil2 = require('./extras/tamil2')

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

  const xxx = []
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
    } else {
      xxx.push(item)
    }
  })
  fs.writeFileSync(path.join(__dirname, 'api', 'category', `xxxxx.json`), JSON.stringify(xxx));

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

    // if (key.split("!")[0] === 'tam') {
    //   var mjson = globalLanguage[key].map(mm => ({
    //     name: mm['name'],
    //     url: mm['url'],
    //     logo: mm['logo'],
    //     category: mm['category']
    //   }))
    //   var kj = tamil.concat(mjson);
    //
    //   kj.sort((a, b) => {
    //     let fa = a.name.toLowerCase(),
    //       fb = b.name.toLowerCase();
    //
    //     if (fa < fb) {
    //       return -1;
    //     }
    //     if (fa > fb) {
    //       return 1;
    //     }
    //     return 0;
    //   });
    //
    //   const config = {
    //     showLogo: true,
    //     channels: kj
    //   }
    //
    //   fs.writeFileSync(path.join(__dirname, 'api', `tamilapp.json`), JSON.stringify(config));
    //
    //   var mc = kj.concat(tamil2)
    //   var cs = {
    //     showLogo: true,
    //     channels: mc
    //   }
    //   fs.writeFileSync(path.join(__dirname, 'api', `tamilapp2.json`), JSON.stringify(cs));
    //
    //   var temp3 = {};
    //   mc.map(x => {
    //     if(temp3[x.category]) {
    //       temp3[x.category].push(x)
    //     } else {
    //       temp3[x.category] = []
    //       temp3[x.category].push(x)
    //     }
    //   })
    //
    //   Object.keys(temp3).map(key => {
    //     fs.writeFileSync(path.join(__dirname, 'api', 'tamilapp',`${key}.json`), JSON.stringify(temp3[key]));
    //   })
    //
    // }
  })


  country.sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
  category.sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
  language.sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });

  fs.writeFileSync(path.join(__dirname, 'api', 'category.json'), JSON.stringify(category));
  fs.writeFileSync(path.join(__dirname, 'api', 'country.json'), JSON.stringify(country));
  fs.writeFileSync(path.join(__dirname, 'api', 'language.json'), JSON.stringify(language));
  Object.keys(globalCountry).map(key => {

    fs.copyFile(path.join(__dirname, 'flag', `${key.split("!")[0]}_64.png`), path.join(__dirname, 'api', 'country', 'flags', `${key.split("!")[0]}.png`), () => {
    })
  });


  // let rawdata = fs.readFileSync(path.join(__dirname, 'api', 'language', 'ara.json'));
  // let arabiclanguage = JSON.parse(rawdata);
  //
  // var arabiccat = {};
  // arabiclanguage.forEach(d => {
  //   if (d.category === null) {
  //     if (arabiccat.hasOwnProperty("Other")) {
  //       arabiccat['Other'].push(d)
  //     } else {
  //       arabiccat['Other'] = []
  //       arabiccat['Other'].push(d)
  //     }
  //   } else {
  //     if (arabiccat.hasOwnProperty(d.category)) {
  //       arabiccat[d.category].push(d)
  //     } else {
  //       arabiccat[d.category] = []
  //       arabiccat[d.category].push(d)
  //     }
  //   }
  // })
  //
  //
  // var b = []
  // Object.keys(arabiccat).forEach(k => {
  //   fs.writeFileSync(path.join(__dirname, 'api', 'arabictv', `${k}.json`), JSON.stringify(arabiccat[k]));
  //   b.push({"file": `${k}.json`, 'title': k})
  // })
  //
  // fs.writeFileSync(path.join(__dirname, 'api', 'arabictv', 'index.json'), JSON.stringify(b));
  // fs.writeFileSync(path.join(__dirname, 'api', 'arabictv', 'full.json'), JSON.stringify(arabiclanguage));
  //

  let russianData = fs.readFileSync(path.join(__dirname, 'api', 'country', 'ru.json'));
  let russianLanguage = JSON.parse(russianData);

  var russianCategory = {};
  russianLanguage.forEach(d => {
    if (d.category === null) {
      if (russianCategory.hasOwnProperty("Other")) {
        russianCategory['Other'].push(d)
      } else {
        russianCategory['Other'] = []
        russianCategory['Other'].push(d)
      }
    } else {
      if (russianCategory.hasOwnProperty(d.category)) {
        russianCategory[d.category].push(d)
      } else {
        russianCategory[d.category] = []
        russianCategory[d.category].push(d)
      }
    }
  })


  var bc = []
  Object.keys(russianCategory).forEach(k => {
    fs.writeFileSync(path.join(__dirname, 'api', 'russiantv', `${k}.json`), JSON.stringify(remodelDuplicate(russianCategory[k])));
    bc.push({"file": `${k}.json`, 'title': k})
  })

  fs.writeFileSync(path.join(__dirname, 'api', 'russiantv', 'index.json'), JSON.stringify(bc));
  fs.writeFileSync(path.join(__dirname, 'api', 'russiantv', 'full.json'), JSON.stringify(remodelDuplicate(russianLanguage)));


  console.log("end all")
}


function remodelDuplicate(data) {
  var title = []
  data.forEach(d => {
    if (title.hasOwnProperty(d.name)) {
      title[d.name].push(d)
    } else {
      title[d.name] = []
      title[d.name].push(d)
    }
  })

  var fulldata = []
  Object.keys(title).forEach(x => {

    var category = []
    var stream = [];
    var logo = ""

    title[x].forEach(j => {
      if (j.category !=null && !category.includes(j.category)) {
        category.push(j.category)
      }
      stream.push(j.url)

      if (j.logo != null && j.logo !== "") {
        logo = j.logo
      }
    })

    fulldata.push({
      title: x,
      category: category,
      stream: stream,
      logo: logo
    })
  })
  return fulldata;
}
