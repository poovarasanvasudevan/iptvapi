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


  fullChannel.sort((a, b) => {
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

  const aData = {
    showLogo: true,
    language: "Tamil",
    radio: fullChannel
  }

  fs.writeFile(path.join(__dirname, 'api', 'tamilradio.json'), JSON.stringify(aData), (a) => {
    console.log("DONE")
  })

});


fs.readFile(path.join(__dirname, 'extras', 'telegu.txt'), 'utf8', function (err, data) {
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
    language: "Telegu",
    radio: fullChannel
  }

  fs.writeFile(path.join(__dirname, 'api', 'teleguradio.json'), JSON.stringify(aData), (a) => {
    console.log("DONE")
  })

});

fs.readFile(path.join(__dirname, 'extras', 'malyalam.txt'), 'utf8', function (err, data) {
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
    language: "Malayalam",
    radio: fullChannel
  }

  fs.writeFile(path.join(__dirname, 'api', 'malyalamradio.json'), JSON.stringify(aData), (a) => {
    console.log("DONE")
  })

});


fs.readFile(path.join(__dirname, 'extras', 'kannada.txt'), 'utf8', function (err, data) {
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
    language: "Kannada",
    radio: fullChannel
  }

  fs.writeFile(path.join(__dirname, 'api', 'kannadaradio.json'), JSON.stringify(aData), (a) => {
    console.log("DONE")
  })

});

fs.readFile(path.join(__dirname, 'extras', 'bollywood.txt'), 'utf8', function (err, data) {
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
    language: "Bollywood",
    radio: fullChannel
  }

  fs.writeFile(path.join(__dirname, 'api', 'bollywoodradio.json'), JSON.stringify(aData), (a) => {
    console.log("DONE")
  })

});
