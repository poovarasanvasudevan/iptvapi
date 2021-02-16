const fs = require('fs')
const path = require('path')

const SEPERATOR = "====="

fs.readFile(path.join(__dirname, 'extras', 'tamil.txt'), 'utf8', function (err, data) {
  const splittedRadio = data.split(SEPERATOR)

  const fullChannel = [];
  splittedRadio.forEach((v, i) => {
    const singleChannel = v.split("\n");
    const dryed = singleChannel.filter(x => x !== "")

    if (dryed.length === 3) {

      const name = dryed[1].trim()

      fullChannel.push({
        "url": dryed[0],
        "name": name.charAt(0).toUpperCase() + name.slice(1),
        "logo": dryed[2]
      })
    }
  })

  const aData = {
    showLogo: true,
    radio: fullChannel
  }

  fs.writeFile(path.join(__dirname , 'api','tamilradio.json'), JSON.stringify(aData) , (a) => {
    console.log("DONE")
  })

});
