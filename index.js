const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.set('view engine', 'ejs'); 

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get("/", async (req, res) => {
    let fuelSavings ='';
    res.render('index', {fuelSavings});
});

app.post("/calculate", async (req, res) => {
    let fuelSavings =[];
    async function calculate(){
        console.log('endpoint pinged');
        console.log(req.body.model);
        //res.render('index');
        let model = req.body.model;
        let miles = req.body.miles;
        let mpg = req.body.mpg;
        let fuel = req.body.fuel;
        //energy and gas prices based on avg on 10/22/23;
        let gasPrices = {
            'regular': 3.55,   // Example price for regular
            'midgrade': 4.021,  // Example price for midgrade
            'premium': 4.357,   // Example price for premium
            'diesel': 4.5,        // Example price for diesel
            "dont_know": 4.021   // Example for "I don't know"
        };

        let mpkWhVals = {
            'Model 3': 3.70,
            'Model Y': 3.57,
            'Model S': 3.57,
            'Model x': 3.03
        }

        let avgkWh = .1591;

        let galsUsed = miles/mpg;
        let price = gasPrices[fuel];
        let gasCost = galsUsed*price;
        console.log('gasCost:'+gasCost);

        let mpkWh = mpkWhVals[model];
        let kWhsUsed = miles/mpkWh;
        let energyCost =  kWhsUsed*avgkWh;
        console.log('energyCost:'+energyCost);

        let fuelSavingsnum = gasCost-energyCost;
        let roundedNumber = parseFloat(fuelSavingsnum.toFixed(2));
        fuelSavings.push('$ '+roundedNumber);
        console.log('fuelSavings:'+fuelSavings);
    };

    await calculate();
    console.log(fuelSavings[0]);
    res.json({ fuelSavings: fuelSavings[0] });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
       