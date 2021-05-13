var mysql = require('mysql');
var tvdata = require('./api/tamilapp2.json').channels
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'poosan',
  database: 'fmdb'
});

connection.connect();

tvdata.forEach(x => {
  connection.query('INSERT INTO tamiltv(name,url,logo,category) VALUES (?,?,?,?)', [x.name, x.url, x.logo, x.category], function (error, results, fields) {
    if (error) throw error;
  });
})
