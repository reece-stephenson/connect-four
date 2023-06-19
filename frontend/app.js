const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname,'/public/')));

app.get('/',(req,res) => {
    res.sendFile('views/gameScreen.html', { root: __dirname });
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

