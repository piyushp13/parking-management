const os = require('os');
const jsdom = require('jsdom');
const axios = require('axios');
const rptDesignLocation = process.env.RPTDESIGNLOCATION || '/u01/app/apache-tomcat-9.0.24/webapps/PixelPerfect/Reports';
const jarLocation = process.env.JARLOCATION || '/u01/jars';
let classLocation = process.env.CLASSLOCATION || '/u01/app/apache-tomcat-9.0.24/webapps/PixelPerfect/WEB-INF/classes/com/useready/tabe';


const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const https = require('https');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(`${__dirname}/dist/pixel-perfect-deployment`));

const options = {
  key: fs.readFileSync(__dirname + '/localhost-rsa-key.pem'),
  cert: fs.readFileSync(__dirname + '/localhost-rsa-cert.pem'),
  ca: fs.readFileSync(__dirname + '/localhost-rsa-chain.pem')
};

const server = https.createServer(options, app);
server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
}); 

app.use(cors());
app.use(express.static(`${__dirname}/dist/pixel-perfect-deployment`));

app.get('/extension', (req, res) => {
    const headers = req.headers;
    console.log('Headers: ', headers);
    let url = `https://sv2lxbiuat301.corp.equinix.com:8080/PixelPerfect/indextabe.html`;
    if ('referer' in headers) {
        console.log('Referer: ', headers['referer']);
        const referer = headers['referer'];
        if (referer.includes('eapuat')) {
            url = `https://sv2lxbiuat502.corp.equinix.com:8080/PixelPerfect/indextabe.html`;
        } else if (referer.includes('eapprod')) {
            url = `https://sv2lxbiuat502.corp.equinix.com:8080/PixelPerfect/indextabe.html`;
        }
    }
    axios.get(url)
    .then(response => {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        let html = response.data;
        const dom = new jsdom.JSDOM(html);
        let baseUrl = url.split("/");
        baseUrl.pop();
        baseUrl = baseUrl.join("/") + "/";
        const document = dom.window.document;
        const baseElement = document.createElement('base');
        baseElement.setAttribute('href', baseUrl);
        document.head.appendChild(baseElement);
        html = dom.serialize();
        res.end(html);
    }).catch(err => {
        console.log('Error: ', err);
        res.end('Error calling server for extension');
    });
    // res.redirect(url);
});

const { spawn } = require('child_process');

const socketIo = require('socket.io');
const io = socketIo(server);

const paramMap = {
    ip: 'i',
    rptDesign: 'r',
    jar: 'j',
    build: 'b',
    class: 'c',
    restartTomcat: 't',
    password: 'p',
    git: 'g',
    deployToUat: 'u'
};

const formCommand = (params) => {
    const scriptName = 'deploy.sh';
    let command = ['sh', scriptName];
    for (const param in params) {
        if (param in paramMap) {
            let value = params[param];
            if (typeof value === 'boolean') {
                value = value ? 1 : 0;
            }
            command.push(`-${paramMap[param]}`);
            command.push(`"${value}"`);
        }
    }
    return command;
};

const executeCommand = (params) => {
    console.log('Command received: ', params);
    io.emit('message', { message: 'Request received \n', type: `log` });
    const command = formCommand(params);
    if (params.rptDesignData) {
        io.emit('message', { message: `Started writing ${rptDesignLocation}/${params.rptDesignFile} \n`, type: `log` });
        let writeStream = fs.createWriteStream(`${rptDesignLocation}/${params.rptDesignFile}`, {
            encoding: 'utf8'
        });
        writeStream.write(Buffer.from(params.rptDesignData));
        writeStream.end(() => {
            const message = `Finished writing ${rptDesignLocation}/${params.rptDesignFile}\n`;
            console.log(message);
            io.emit('message', { message: message, type: `log` });
            writeStream.close();
        });
        writeStream.on('error', (error) => {
            console.log('Error writing file', error);
            io.emit('message', { message: error.toString(), type: `log` });
            writeStream.close();
        });
        writeStream.on("progress", (event) => {
            io.emit('message', { message: event.toString(), type: `log` });
        });
    }
    if (params.jarData) {
        io.emit('message', { message: `Started writing ${jarLocation}/${params.jarFile} \n`, type: `log` });
        let writeStream = fs.createWriteStream(`${jarLocation}/${params.jarFile}`, {
            encoding: 'utf8'
        });
        writeStream.write(Buffer.from(params.jarData));
        writeStream.end(() => {
            const message = `Finished writing ${jarLocation}/${params.jarFile}\n`;
            console.log(message);
            io.emit('message', { message: message, type: `log` });
            writeStream.close();
        });
        writeStream.on('error', (error) => {
            console.log('Error writing file', error);
            io.emit('message', { message: error.toString(), type: `log` });
            writeStream.close();
        });
    }
    if (params.classData) {
        if (paramMap.classFileLocation !== '') {
            classLocation = params.classFileLocation;
        }
        io.emit('message', { message: `Started writing ${classLocation}/${params.classFile} \n`, type: `log` });
        let writeStream = fs.createWriteStream(`${classLocation}/${params.classFile}`, {
            encoding: 'utf8'
        });
        writeStream.write(Buffer.from(params.classData));
        writeStream.end(() => {
            const message = `Finished writing ${classLocation}/${params.classFile}\n`;
            console.log(message);
            io.emit('message', { message: message, type: `log` });
            writeStream.close();
        });
        writeStream.on('error', (error) => {
            console.log('Error writing file', error);
            io.emit('message', { message: error.toString(), type: `log` });
            writeStream.close();
        });
    }
    try {
        // command = ['ls', '-lh'];
        const output = spawn(command[0], command.slice(1), {
            shell: true,
            cwd: __dirname
        });
        output.stdout.on('data', (data) => {
            console.log('Data: ', data.toString());
            io.emit('message', { message: data.toString(), type: `log` });
        });
        output.stderr.on('data', (data) => {
            io.emit('message', { message: data.toString(), type: `log` });
        });
        output.on('exit', (code) => {
            io.emit('message', { message: `Process exited with code ${code}`, type: `log` });
        });
        output.on('error', (error) => {
            console.log('Error executing', error);
            io.emit('message', { message: error.toString(), type: `log` });
        })
    } catch (error) {
        console.log('Failed executing command', error);
    }
    
};


io.on('connection', (socket) => {
    console.log('User connected');
    socket.emit('message', { message: 'Hello! ', type: 'text' });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    socket.on('message', (data) => {
        // data = JSON.parse(data);
        console.log("Data: ", data);
        if (data && data.type === 'command') {
            executeCommand(data.message);
        }
    });
});

