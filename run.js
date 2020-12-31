const http = require('https');
const fs = require('fs');
const path = require('path');

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


function createData(json) {
    console.log(json)
    fs.writeFileSync(path.join(__dirname, 'api', 'channel.json'), JSON.stringify(json));

    const category = []
    const country = []
    const language = []

    //byCategory
    const globalCategory = {}
    const globalCountry = {}
    const globalLanguage = {}
    json.forEach((item) => {
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


        if (item.country == null) {
            if (globalCountry.hasOwnProperty("nocountry")) {
                globalCountry['nocountry'].push(item)
            } else {
                globalCountry['nocountry'] = []
                globalCountry['nocountry'].push(item)
            }
        } else {
            if (globalCountry.hasOwnProperty(item.country.code + "!" + item.country.name)) {
                globalCountry[item.country.code + "!" + item.country.name].push(item)
            } else {
                globalCountry[item.country.code + "!" + item.country.name] = []
                globalCountry[item.country.code + "!" + item.country.name].push(item)
            }
        }


        if (item.language == null || item.language.length === 0) {
            if (globalLanguage.hasOwnProperty("nolanguage")) {
                globalLanguage['nolanguage'].push(item)
            } else {
                globalLanguage['nolanguage'] = []
                globalLanguage['nolanguage'].push(item)
            }
        } else {

            item.language.forEach((lang) => {
                if (globalLanguage.hasOwnProperty(lang.code + "!" + lang.name)) {
                    globalLanguage[lang.code + "!" + lang.name].push(item)
                } else {
                    globalLanguage[lang.code + "!" + lang.name] = []
                    globalLanguage[lang.code + "!" + lang.name].push(item)
                }
            })
        }
    })


    Object.keys(globalCategory).map(key => {
        category.push({name: key, code: key, count: globalCategory[key].length})
        fs.writeFileSync(path.join(__dirname, 'api', 'category', `${key}.json`), JSON.stringify(globalCategory[key]));
    })

    Object.keys(globalCountry).map(key => {
        country.push({code: key.split("!")[0], name: key.split("!")[1] || key.split("!")[0], count: globalCountry[key].length})
        fs.writeFileSync(path.join(__dirname, 'api', 'country', `${key.split("!")[0]}.json`), JSON.stringify(globalCountry[key]));
    })

    Object.keys(globalLanguage).map(key => {
        language.push({code: key.split("!")[0], name: key.split("!")[1] || key.split("!")[0], count: globalLanguage[key].length})
        fs.writeFileSync(path.join(__dirname, 'api', 'language', `${key.split("!")[0]}.json`), JSON.stringify(globalLanguage[key]));
    })

    fs.writeFileSync(path.join(__dirname, 'api', 'category.json'), JSON.stringify(category));
    fs.writeFileSync(path.join(__dirname, 'api', 'country.json'), JSON.stringify(country));
    fs.writeFileSync(path.join(__dirname, 'api', 'language.json'), JSON.stringify(language));
}