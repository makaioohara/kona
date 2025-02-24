const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Alive!');
});

app.listen(port, () => {
  console.log(`Server is alive on port ${port}!`);
});
