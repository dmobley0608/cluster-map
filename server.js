const path = require('path');
const fs = require('fs');
const express = require("express");
const ejsMate = require("ejs-mate")
const reader = require('xlsx')
const multer = require('multer');
const { getCallTypeCounts, getOfficerCounts, getRepeatCases } = require('./utils/utils');
const upload = multer({ dest: path.join(__dirname, '/uploads') })


const app = express();
app.use(express.urlencoded({ extended: true }))


// Template Config
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "views"))
app.use("/static", express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    let animalCase = 0;
    let animalReport = 0;
    let animalCruelty = 0;
    let animalConfined = 0;
    let animalInTrap = 0;
    let animalAggressive = 0;
    let animalBite = 0;
    let animalInRoadway = 0;
    let animalInjured = 0;
    let animalTetheringHC = 0;
    let livestockInRoadway = 0;
    let snakeLaw = 0;
    let eviction = 0;
    let assistle = 0;
    let callPS = 0;
    let _1885 = 0;
    let _1887 = 0;
    let _1888 = 0;
    let _1889 = 0;
    let _1890 = 0;
    let _1898 = 0;
    fs.readdir(path.join(__dirname, '/uploads'), (err, files) => {
        if (err) { return }
        for (let file of files) {
            fs.unlink(path.join(__dirname, `/uploads/${file}`), (err) => {
                if (err) {
                    console.log(err.message)
                }
            })
        }
    })
    const cases = []
    const officers = {}
    const caseTypes = {}
    const repeatCases = {}

    res.render('index', {cases, officers, caseTypes , repeatCases  })
})

app.post("/", upload.single('cases'), (req, res) => {
    fs.readdir(path.join(__dirname, '/uploads'), (err, files) => {
        if (files.length > 1) {
            res.redirect("/")
        } else {

            //Animal Control    
            const file = reader.readFile(req.file.path)
            const sheets = file.SheetNames;
            const cases = []
            
            const xlCases = reader.utils.sheet_to_json(file.Sheets['Sheet1'])                     
            
            for (ac of xlCases) {
                    cases.push({
                    name: ac.Address,
                    properties: {
                        id: ac['Case Number'],
                        address: ac.Address,
                        date: ac['Response Date'],
                        officer: ac['Unit Name'],
                        problem: ac.Problem
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [ac.Longitude, ac.Latitude]
                    }
                })
            }
            const repeatCases = getRepeatCases(cases);            
            const caseTypes = getCallTypeCounts(cases);           
            const officers = getOfficerCounts(cases);


            res.render('index', { cases, officers, caseTypes, repeatCases    })

        }
    })
})

app.listen(3000, () => {
    console.log('Running on port 3000')
})