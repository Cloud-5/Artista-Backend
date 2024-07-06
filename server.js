const express = require('express');
const bodyParser = require('body-parser');

//buddhi
const artworkPreviewRouter = require('./src/routes/artwork-preview.routes');

//gihan
const userRoutes = require('./src/routes/userRoutes');
const artRouter = require ('./src/routes/artRoutes');
const artistRouter = require('./src/routes/artistRoutes')

//kaumi
const artistPageRouter = require('./src/routes/artist-page.routes');
const forYouRouter = require('./src/routes/foryou.routes');
const cartRouter = require('./src/routes/cart.routes');
const categoriesRouter = require('./src/routes/category.routes');
const preferencesRouter = require('./src/routes/preferences.route');
const personalizeRouter = require('./src/routes/personalize.routes');
const cart2Router = require('./src/routes/cart2.routes');

//janani
const artistportfolioRouter = require('./src/routes/artist-portfolio.routes');
const artistportfoliocreationsRouter = require('./src/routes/artist-portfolio-creations.routes');
const customergalleryartsRouter = require('./src/routes/customer-gallery-arts.routes');
const customerprofilegalleryRouter = require('./src/routes/customer-profile-gallery.routes');
const feedbacklistRouter = require('./src/routes/feedback-list.routes');
const followingartistslistRouter = require('./src/routes/following-artists-list.routes');
const purchasehistoryRouter = require('./src/routes/purchase-history.routes');
const searchartsRouter = require('./src/routes/search-art.routes');
const editCustomerProfileRoutes = require('./src/routes/edit-customer-profile.routes');
const artCard = require('./src/routes/art-card.routes');

//dhanushka
const artistFollowersRouter = require('./src/routes/artist-followers');
const artistFeedbackRouter = require('./src/routes/artist-feedback.routes');
const artistEditRouter = require('./src/routes/artist-edit.routes');
const artworkRouter = require('./src/routes/artwork-routes');
const artistNetworkRouter = require('./src/routes/network.router');
const artistNewHomeRouter=require('./src/routes/artist-new-home.routes');


const {upload, deleteFromS3} = require('./src/middlewares/file-upload');

const {upload, deleteFromS3} = require('./src/middlewares/file-upload');

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

app.use('/artwork', artworkRouter);
app.use('/artist-network', artistNetworkRouter);
app.use('/artist-feedback', artistFeedbackRouter);


app.use('/artist-page', artistPageRouter);
app.use('/for-you', forYouRouter);
app.use('/cart', cartRouter);
app.use('/categories', categoriesRouter);
app.use('/preferences', preferencesRouter);
app.use('/personalize', personalizeRouter);
app.use('/cart2', cart2Router);


app.use('/artist-portfolio', artistportfolioRouter);
app.use('/artist-portfolio-creations', artistportfoliocreationsRouter);
app.use('/customer-gallery-arts', customergalleryartsRouter);
app.use('/customer-profile-gallery', customerprofilegalleryRouter);
app.use('/feedback-list', feedbacklistRouter);
app.use('/following-artists-list', followingartistslistRouter);
app.use('/purchase-history', purchasehistoryRouter);

app.use('/search-art', searchartsRouter);

app.use('/edit-customer-profile', editCustomerProfileRoutes);

app.use('/art',artRouter);
app.use ('/artist',artistRouter);
app.use('/artwork-preview', artworkPreviewRouter);
+
app.use('/art-card', artCard);

app.use('/artist-portfolio-creations', artistportfolioRouter);
app.use('/purchase-history', purchasehistoryRouter);
app.use('/search-art', searchartsRouter);
app.use('/feedback-list', feedbacklistRouter);

app.use('/artist-followers',artistFollowersRouter);
app.use('/artist-edit', artistEditRouter);
app.use('/artist-new-home',artistNewHomeRouter);


app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ image: req.file });
});

app.delete('/delete/:key', (req, res) => {
    const key = req.params.key;
    console.log('key', key)

    deleteFromS3(key, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to delete object from S3' });
        } else {
            res.status(200).json({ message: 'Object deleted successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})