const express = require('express');
const bodyParser = require('body-parser');
const dronesRoutes = require('../routes/dronesRoutes');
const manufacturersRoutes = require('../routes/manufacturersRoutes');
const discountsRoutes = require('../routes/discountsRoutes');
const usersRoutes = require('../routes/usersRoutes');
const shoppingCartRoutes = require('../routes/shoppingCartRoutes');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8081;

app.use(cors({
    origin: '*'
}));

app.use('/webpImg', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    setTimeout(() => next(), 100);
}, express.static(path.join(__dirname, '../../../public/webpImg'), { etag: false }));

app.use('/api/drones', dronesRoutes);

app.use('/api/manufacturers', manufacturersRoutes);

app.use('/api/discounts', discountsRoutes);

app.use('/api/users', usersRoutes);

app.use('/api/shoppingCart', shoppingCartRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('', (req, res) => {
    res.send('okic :) :)');
});