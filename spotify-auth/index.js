var http = require('http');
var url = require('url');
var fs = require('fs');
var dotenv = require('dotenv'); dotenv.config();
var spotifyAPI = require('spotify-web-api-node');
var Promise = require('bluebird');

const scopes = 'streaming';
const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${process.env.REDIRECT_URI}`;
const spotify = new spotifyAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
})

var authCode = '';

module.exports = () => {

    return new Promise((resolve, reject) => {
        if(fs.existsSync('./auth_code.txt') && fs.readFileSync('./auth_code.txt').toString().trim() !== '') {

            authCode = fs.readFileSync('./auth_code.txt').toString().trim();
            resolve(authCode);
    
        } else {
    
            console.log('Visit this link to login:\n%s', authUrl);
    
            var httpServer = http.createServer((req, res) => {
                res.writeHead(200, { 'content-type': 'text/plain' });
                res.write('You may close this window');
                
                var queryString = url.parse(req.url).query;
                if(queryString) {
                    httpServer.close();
                    var query = new Object();
                    var queryString = queryString.split('&');
                    queryString.forEach(elem => {
                        query[elem.split('=')[0]] = elem.split('=')[1];
                    })
                    fs.writeFileSync('./auth_code.txt', query.code);
                    authCode = query.code;
                    resolve(authCode);
                }
    
                res.end();
            }).listen(37915);
    
        }
    })
    
}