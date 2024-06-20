require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const userRoutes = require('./src/routes/userRoutes');


const artCategoryRouter = require('./src/routes/art-categories.routes');
const userRouter = require('./src/routes/artist-request.routes');
const dashboardRouter = require('./src/routes/dashboard.router');
const userManagementRouter = require('./src/routes/user-management.routes');

const artworkRouter = require('./src/routes/artwork-routes');
const artistNetworkRouter = require('./src/routes/network.router');

const artistPageRouter = require('./src/routes/artist-page.routes');
const forYouRouter = require('./src/routes/foryou.routes');
const cartRouter = require('./src/routes/cart.routes');
const categoriesRouter = require('./src/routes/category.routes');
const preferencesRouter = require('./src/routes/preferences.route');
const customerProfileGalleryRouter = require('./src/routes/customer-profile-gallery.routes');
const CustomerGalleryArtRouter = require('./src/routes/customer-gallery-arts.routes');
const followingArtistsListRouter = require('./src/routes/following-artists-list.routes');
const artistPortfolio = require('./src/routes/artist-portfolio.routes');
const artistPortfolioCreations = require('./src/routes/artist-portfolio-creations.routes');
const purchaseHistoryRouter = require('./src/routes/purchase-history.routes');
const searchArtRouter = require('./src/routes/search-art.routes');
const feedbackListRouter = require('./src/routes/feedback-list.routes');
const artRouter = require ('./src/routes/artRoutes');
const artistRouter = require('./src/routes/artistRoutes')
const artworkPreviewRouter = require('./src/routes/artwork-preview.routes');


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

app.use('/artwork', artworkRouter);
app.use('/artist-network', artistNetworkRouter);

app.use('/artist-page', artistPageRouter);
app.use('/for-you', forYouRouter);
app.use('/cart', cartRouter);
app.use('/categories', categoriesRouter);
app.use('/preferences', preferencesRouter);


app.use('/art',artRouter);
app.use ('/artist',artistRouter);
app.use('/artwork-preview', artworkPreviewRouter);

app.use('/customer-profile-gallery', customerProfileGalleryRouter);
app.use('/customer-gallery-arts', CustomerGalleryArtRouter);
app.use('/following-artists-list', followingArtistsListRouter);
app.use('/artist-portfolio', artistPortfolio);
app.use('/artist-portfolio-creations', artistPortfolioCreations);
app.use('/purchase-history', purchaseHistoryRouter);
app.use('/search-art', searchArtRouter);
app.use('/feedback-list', feedbackListRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})