const express = require('express');
const app = express()
const mongoose = require('mongoose');
const ProductItem = require('./models/productItem');

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs')

const dbUri = "mongodb+srv://supercode:supercode@cluster0.2kvja.mongodb.net/superDatabase?retryWrites=true&w=majority"

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("connected to db")
        app.listen(3131, () => {
            console.log("server listening at http://localhost:3131")
        })
        // .catch(err => console.log(err))
    })

app.get('/', (req, res) => {
    ProductItem.find()
        .then(result => {
            // console.log(result)
            res.render("index", { productsData: result })
        })
        .catch(err => console.log(err))
})

app.get("/add", (req, res) => {
    ProductItem.aggregate(
        [{ $sample: { size: 6 } }])
        .then(result => {
            console.log("random added")
            res.render('add', { random: result })
            // res.redirect("/")
        })
        .catch(err => console.log(err))
})

app.post("/add", (req, res) => {
    const newProduct = new ProductItem({
        "Product-name": req.body.name,
        "Product-picture-Link": req.body.url,
        Company: req.body.company,
        Price: req.body.price,
        Description: req.body.description
    })
    newProduct.save()
        .then(result => {
            console.log("saved to db")
            res.redirect("/")
        })
        .catch(err => console.log(err))
})

app.get('/details/:id', (req, res) => {
    console.log(req.params.id);

    ProductItem.findById(req.params.id)
        .then(result => {
            // res.render('details', { product: result })
            res.render('details', { product: result })
        })
        .catch(err => console.log(err))
})

app.get("/details/:id/delete", (req, res) => {
    ProductItem.findByIdAndDelete(req.params.id)
        .then(result => {
            res.redirect('/')
        })
        .catch(err => console.log(err))
})

// app.get("/edit", (req, res) => {
//     res.render("edit")
// })

app.post('/details/:id/edit', (req, res) => {
    //PLACEHOLDER text
    const updatedProduct = {
        "Product-name": req.body.name,
        "Product-picture-Link": req.body.url,
        Company: req.body.company,
        Price: req.body.price,
        Description: req.body.description
    }

    // example with EMPTY fields
    // const updatedProduct = { }
    // if (req.body.name !== "") updatedProduct["Product-name"] = req.body.name;
    // if (req.body.url !== "") updatedProduct["Product-picture-Link"] = req.body.url;
    // if (req.body.company !== "") updatedProduct["Company"] = req.body.company;
    // if (req.body.price !== "") updatedProduct["Price"] = req.body.price;
    // if (req.body.description !== "") updatedProduct["Description"] = req.body.description;


    ProductItem.findByIdAndUpdate(req.params.id, updatedProduct)
        .then(result => {
            res.redirect(`/details/${req.params.id}`)
        })
        .catch(err => console.log(err))
})

app.get("/weekly", (req, res) => {
    ProductItem.aggregate(
        [{ $sample: { size: 12 } }])
        .then(result => {
            console.log("random added")
            res.render('weekly', { random: result })
        })
        .catch(err => console.log(err))
})

app.get("/lessThen30", (req, res) => {
    ProductItem.find({ Price: { $lt: 30 } })
        .then(result => {
            res.render('lessThen30', { affordable: result })
        })
        .catch(err => console.log(err))
})