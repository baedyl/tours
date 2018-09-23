const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ARpjSkl3xPy-GS7GoWGPOCK_tS3zyEDy8izogz_S-OGsB52yI5ISvPYSdkfXwFwy6APoL8X7Jc50T4Tj',
    'client_secret': 'EDhOctw7OuEKhLZ0svWnFYlcnNpTKlDsSJlidZNiFvSzMYGesQpeLLqvKnmie29XO2QrAG11Ga00bEMT'
});

// Load Models
require('../models/User');
require('../models/Tour');
const User = mongoose.model('users');
const Tour = mongoose.model('tours');

// tours Index
router.get('/', (req, res) => {
    Tour.find({})
        .then(tours => {
        res.render('tour/index', {
            tours: tours
        });
    });
});

// Show Single Tour
router.get('/show/:id', (req, res) => {
    Tour.findOne({
      _id: req.params.id
    })
    .then(tour => {
      res.render('tour/show', {
        tour: tour
      });
    })
    .catch((err) =>{
        console.log("CaughtCathchError", err)
    });
  });

// Add Tour Form
router.get('/add', (req, res) => {
    res.render('tour/add');
});

// Process Add Tour
router.post('/', (req, res) => {
    const numDays = Number(req.body.duration);
    var genDays = req.body.day_;
    console.log(genDays);
    var cpt = 0;
    var dayyys = [];
    for(var i = 0; i < genDays.length; i++){
        dayyys.push(genDays[i]);
    }

    const newTour = {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      days: dayyys
    }
  
    // Create Tour
    new Tour(newTour)
      .save()
      .then(tour => {
        res.redirect(`/tour/show/${tour.id}`);
      });
});


// Edit Tour Form
router.get('/edit/:id', (req, res) => {
    console.log("id : ", req.params.id);
    Tour.findOne({
        _id: req.params.id
    })
    .then(tour => {
        res.render('tour/edit', {
        tour: tour
        });
    })
    .catch((err) =>{
        console.log("CaughtCathchError", err);
    });
});

  
// Edit Form Process
router.put('/:id', (req, res) => {
    Tour.findOne({
        _id: req.params.id
    })
    .then(tour => {
        
        // New values
        tour.title = req.body.title;
        tour.description = req.body.description;
        tour.duration = req.body.duration;
        

        tour.save()
        .then(tour => {
            //res.redirect(`/tour/show/${tour.id}`);
            res.redirect('/tour/show/');
        })
        .catch((err) =>{
            console.log("CaughtCathchError", err)
        });
    })
    .catch((err) =>{
        console.log("CaughtCathchError", err)
    });
});
  
// Delete Tour
router.delete('/:id', (req, res) => {
Tour.remove({_id: req.params.id})
    .then(() => {
    res.redirect('/tour');
    });
});

/* Search Tour Form
router.get('/recherche', (req, res) => {
    res.render('tour/search');
});*/

// Partial Search Form Process
router.get("/recherche", function(req, res, next) {
    var searchWord = req.query.search;
    var data = [];

    Tour.find({
        title: {
            $regex: new RegExp(searchWord)
        }
    }, {
        _id: 0,
        __v: 0
    }, function(err, data){
        //res.json(data);
        res.render('tour/index',{
            tours : data
        });
    }).limit(10)
    
    
});


//
 
/*function pagelist(items) {
    result = "<html><body><ul>";
    items.forEach(function(item) {
        itemstring = "<li>" + item._id + "<ul><li>" + item.textScore +
        "</li><li>" + item.created + "</li><li>" + item.document +
        "</li></ul></li>";
        result = result + itemstring;
    });
    result = result + "</ul></body></html>";
    return result;
}*/

// Reservation Process
router.get('/booking', (req, res) => {
    res.render('tour/booking');
});
router.get('/success', (req, res) => {
    const payerID = req.query.PayerID;
    const paymentId = req.query.paymentId;

    var execute_payment_json = {
        "payer_id": payerID,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send("Success");
        }
    });
});
router.get('/cancel', (req, res) => res.send('Cancelled'));
router.get('/reserver',(req, res) => {
    res.render('tour/reserver');
});

router.post('/pay', (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:5000/tour/success",
            "cancel_url": "http://localhost:5000/tour/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "test tout",
                    "sku": "001",
                    "price": "25.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "25.00"
            },
            "description": "my first paypal transaction."
        }]
    };


    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

});

module.exports = router;