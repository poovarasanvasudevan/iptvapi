const M3U8FileParser = require('m3u8-file-parser');
const fs = require('fs');
const http = require('https');
const path = require('path')
const rpath = "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8"


http.get(rpath, (res) => {
  let body = "";

  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    try {
      createData(body)

    } catch (error) {
      console.error(error.message);
    }
  });
}).on("error", (error) => {
  console.error(error.message);
});


function createData(body) {
  const reader = new M3U8FileParser();
  reader.read(body);

  var countries = {};

  reader.getResult().segments.forEach(x => {
    var intf = x.inf;
    var url = x.url;

    if (countries.hasOwnProperty(intf.groupTitle)) {
      countries[intf.groupTitle].push({
        name: intf.title,
        logo: intf.tvgLogo,
        url: url,
        group: intf.groupTitle
      })
    } else {
      countries[intf.groupTitle] = []
      countries[intf.groupTitle].push({
        name: intf.title,
        logo: intf.tvgLogo,
        url: url,
        group: intf.groupTitle
      })
    }
  })


  const bc = [];
  Object.keys(countries).forEach((c) => {
    fs.writeFileSync(path.join(__dirname, 'api', 'worldtv', `${c}.json`), JSON.stringify(countries[c]));
    bc.push({"file": `${c}.json`, 'title': c, count: countries[c].length})
  })

  fs.writeFileSync(path.join(__dirname, 'api', 'worldtv', 'index.json'), JSON.stringify(bc));
  console.log(JSON.stringify(countries))
  reader.reset();
}


