const app = require('express')();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  res.send('Hello, World!');
})

app.listen(7777)