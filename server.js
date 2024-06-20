const express = require('express');
const bodyParser = require('body-parser');

//buddhi
const artworkPreviewRouter = require('./src/routes/artwork-preview.routes');

//gihan
const userRoutes = require('./src/routes/userRoutes');


const artistPageRouter = require('./src/routes/artist-page.routes');
const forYouRouter = require('./src/routes/foryou.routes');
const cartRouter = require('./src/routes/cart.routes');
const categoriesRouter = require('./src/routes/category.routes');
const preferencesRouter = require('./src/routes/preferences.route');
const personalizeRouter = require('./src/routes/personalize.routes');



const artRouter = require ('./src/routes/artRoutes');
const artistRouter = require('./src/routes/artistRoutes')

const editCustomerProfileRoutes = require('./src/routes/edit-customer-profile.routes');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/user', userRoutes);

app.use('/artist-page', artistPageRouter);
app.use('/for-you', forYouRouter);
app.use('/cart', cartRouter);
app.use('/categories', categoriesRouter);
app.use('/preferences', preferencesRouter);
app.use('/personalize', personalizeRouter);


app.use('/edit-customer-profile', editCustomerProfileRoutes);

app.use('/art',artRouter);
app.use ('/artist',artistRouter);

app.use('/artwork-preview', artworkPreviewRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})