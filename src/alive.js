const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Alive!');
});

app.listen(port, () => {
  console.log(`Server is alive on port ${port}!`);
});
