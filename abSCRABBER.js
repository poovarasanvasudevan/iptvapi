const http = require('https');

var url = 'http://198.144.149.82:8080/NOTV/DTV/index.m3u8?token=GTR'


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
