const express = require('express');
const cors = require('cors');
const app = express();
const FormData = require('form-data');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.filename || file.originalname)
    }
});
const upload = multer({storage});
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const baseUrl = 'http://3.6.121.146:9494';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/dist`));

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
}); 

async function base64_encode(file) {
    // read binary data
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (!err) {
                resolve(new Buffer.from(data).toString('base64'));
            } else {
                reject(null);
            }
        });
    });
}

app.get("/LicencePlateRegistration/register", (req, res) => {
    axios.get(baseUrl + req.url)
    .then(response => {
        res.end(JSON.stringify(response.data));
    }).catch(err => {
        console.log('Error: ', err);
        res.end('Error calling server');
    });
});

app.put("/LicencePlateRegistration/register", (req, res) => {
    axios.put(baseUrl + req.url, req.body, {'Content-Type': 'application/json'})
    .then(response => {
        res.end(JSON.stringify(response.data));
    }).catch(err => {
        console.log('Error: ', err);
        res.end('Error calling server');
    });
});

app.post("/LicencePlateRecognition/file/isregistered_v2", upload.single('image_file'), async (req, res) => {
    const request = req.body;
    request['base64ImageString'] = await base64_encode(`uploads/${req.file.originalname}`);
    axios({
        method: 'post',
        url: baseUrl + req.url.replace('file', 'base64'),
        data: request,
        headers: {'Content-Type': 'application/json'}
        })
    .then(response => {
        res.end(JSON.stringify(response.data));
    }).catch(err => {
        console.log('Error: ', err);
        res.end('Error calling server');
    });
});

app.delete("/LicencePlateRegistration/:licencePlateNumber", (req, res) => {
    axios.delete(baseUrl + req.url)
    .then(response => {
        res.end(JSON.stringify(response.data));
    }).catch(err => {
        console.log('Error: ', err);
        res.end('Error calling server');
    });
});
