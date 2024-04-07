const express = require('express');

const bodyParser = require('body-parser');

const artCategoryRouter = require('./src/routes/art-categories.routes');
const userRouter = require('./src/routes/artist-request.routes');
const dashboardRouter = require('./src/routes/dashboard.router');
const userManagementRouter = require('./src/routes/user-management.routes');
const customerProfileGalleryRouter = require('./src/routes/customer-profile-gallery.routes');
const CustomerGalleryArtRouter = require('./src/routes/customer-gallery-arts.routes');
const followingArtistsListRouter = require('./src/routes/following-artists-list.routes');
const artistPortfolio = require('./src/routes/artist-portfolio.routes');
const artistPortfolioCreations = require('./src/routes/artist-portfolio-creations.routes');
const purchaseHistoryRouter = require('./src/routes/purchase-history.routes');
const searchArtRouter = require('./src/routes/search-art.routes');
const feedbackListRouter = require('./src/routes/feedback-list.routes');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/art-categories', artCategoryRouter);
app.use('/artist-request', userRouter);
app.use('/dashboard', dashboardRouter);
app.use('/user-management', userManagementRouter);

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