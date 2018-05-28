/* Modules */
const dotenv = require('dotenv'); dotenv.config()
const request = require('request-promise')
const db = require('node-json-db')

/* Global variables */
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI

const tokenHost = 'https://accounts.spotify.com'
const tokenPath = '/api/token'
const authorizePath = '/authorize'

/* authorize fn */
async function authorize(scopes) {

    // Oauth authorization URI
    const authorizationUri = tokenHost + authorizePath + '?' +
        JSON.stringify({
            'client_id': CLIENT_ID,
            'response_type': 'code',
            'redirect_uri': encodeURIComponent(REDIRECT_URI),
            'scope': scopes.join('%20')
        })
            .replace(/{/g, '')
            .replace(/}/g, '')
            .replace(/"/g, '')
            .replace(/:/g, '=')
            .replace(/,/g, '&')
    console.log('Visit: ' + authorizationUri)

    // Oauth code
    let code = await new Promise(resolve => {
        let httpServer = require('http').createServer((req, res) => {
            req.url = require('url').parse(req.url, true)
            if(req.url.pathname === '/') {
                res.end('You may close this window')
                httpServer.close()
                resolve(req.url.query.code)
            }
        }).listen(37915)
    })

    // Oauth tokens
    let tokens = await request({
        method: 'post',
        url: tokenHost + tokenPath,
        form: {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI
        },
        headers: {
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
            'content-type': 'application/x-www-form-urlencoded'
        }
    })
    return tokens

}

/* saveTokens fn */


module.exports.authorize = authorize
module.exports.saveTokens = saveTokens
