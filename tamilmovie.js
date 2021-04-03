const fs = require('fs')
const path = require('path')

const SEPERATOR = "------"

fs.readFile(path.join(__dirname, 'extras', 'tamilmovies.txt'), 'utf8', function (err, data) {
  const splittedRadio = data.split(SEPERATOR)

  const fullChannel = [];
  splittedRadio.forEach((v, i) => {
    const singleChannel = v.split("\n");
    const dryed = singleChannel.filter(x => x !== "")

    if (dryed.length === 5) {

      const name = dryed[0].trim()

      fullChannel.push({
        "url": dryed[1],
        "title": name.charAt(0).toUpperCase() + name.slice(1),
        "logo": dryed[2],
        "description": dryed[3],
        "year": dryed[4]
      })
    }
  })


  console.log(fullChannel)
  fullChannel.sort((a, b) => {
    let fa = a.title.toLowerCase(),
      fb = b.title.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });

  const aData = {
    showLogo: true,
    language: "Tamil",
    movies: fullChannel
  }

  fs.writeFile(path.join(__dirname, 'api', 'tamilmovies.json'), JSON.stringify(aData), (a) => {
    console.log("DONE")
  })

});
