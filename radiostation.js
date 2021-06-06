const Parse = require('parse/node');
const path = require('path')
const fs = require('fs')


Parse.initialize("southRadios", "c291dGhyYWRpb3M");
Parse.serverURL = 'http://app.puradsi.com/config'

async function load() {
  const GameScore = Parse.Object.extend("Station");
  const query = new Parse.Query(GameScore);
  query.limit(600);
  const results = await query.find();

  const allstation = []
  for (let i = 0; i < results.length; i++) {
    const object = results[i];

    const obj = {
      id: object.id,
      genere: object.get("Genre"),
      priority: object.get("priority"),
      identifier: object.get("identifier"),
      name: object.get("name"),
      data: object.get("data"),
      stream: object.get("streamUrl"),
      subtitle: object.get("subTitle"),
      image: object.get("image") == null ? " " : object.get("image").url(),
    }
    allstation.push(obj)
  }

  fs.writeFile(path.join(__dirname, 'api', 'allradiostation.json'), JSON.stringify(allstation), (a) => {
    console.log("DONE")
  })




  const Podcast = Parse.Object.extend("podcast");
  const pq = new Parse.Query(Podcast);
  pq.limit(600);
  const pr = await pq.find();

  const allpodcast = []
  for (let i = 0; i < pr.length; i++) {
    const object = pr[i];

    const obj = {
      id: object.id,
      genere: object.get("Genre"),
      priority: object.get("priority"),
      name: object.get("name"),
      stream: object.get("streamUrl"),
      shareUrl: object.get("shareUrl"),
      subtitle: object.get("subTitle"),
      group: object.get("group"),
      image: object.get("image") == null ? " " : object.get("image").url(),
    }
    allpodcast.push(obj)
  }

  fs.writeFile(path.join(__dirname, 'api', 'allpodcast.json'), JSON.stringify(allpodcast), (a) => {
    console.log("DONE")
  })

}

load()

