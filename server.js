require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const userRoutes = require('./src/routes/userRoutes');


const artCategoryRouter = require('./src/routes/art-categories.routes');
const userRouter = require('./src/routes/artist-request.routes');
const dashboardRouter = require('./src/routes/dashboard.router');
const userManagementRouter = require('./src/routes/user-management.routes');
const artistPageRouter = require('./src/routes/artist-page.routes');
const forYouRouter = require('./src/routes/foryou.routes');
const cartRouter = require('./src/routes/cart.routes');
const categoriesRouter = require('./src/routes/category.routes');
const preferencesRouter = require('./src/routes/preferences.route');
const personalizeRouter = require('./src/routes/personalize.routes');


const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/user', userRoutes);

app.use('/art-categories', artCategoryRouter);
app.use('/artist-request', userRouter);
app.use('/dashboard', dashboardRouter);
app.use('/user-management', userManagementRouter);

app.use('/artist-page', artistPageRouter);
app.use('/for-you', forYouRouter);
app.use('/cart', cartRouter);
app.use('/categories', categoriesRouter);
app.use('/preferences', preferencesRouter);
app.use('/personalize', personalizeRouter);




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})