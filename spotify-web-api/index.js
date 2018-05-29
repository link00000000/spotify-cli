/* Modules */
const dotenv = require('dotenv'); dotenv.config()
const request = require('request-promise')
const JsonDB = require('node-json-db')

/* Global variables */
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI

const tokenHost = 'https://accounts.spotify.com'
const tokenPath = '/api/token'
const authorizePath = '/authorize'

const apiHost = 'https://api.spotify.com'

const db = new JsonDB('authorization', true, false)

/* Spotify Class */
function Spotify() {
    this.accessToken = null
    this.refreshToken = null
    this.expiry = null

    // Set access and refresh tokens
    this.setTokens = (tokens) => {
        this.accessToken = tokens['access_token']
        this.refreshToken = this.refreshToken || tokens['refresh_token']
        this.expiry = tokens['expiry'] || (new Date()).valueOf() + (tokens['expires_in'] * 1000)
        db.push('/spotify', tokens)
        db.push('/spotify/expiry', this.expiry)
    }

    // Update access tokens if expired
    this.updateAccessToken = async () => {
        
        // If access token is expired
        if((new Date()).valueOf() > this.expiry) {

            // Retrieve new access token using refresh token
            let tokens = await request({
                method: 'post',
                url: tokenHost + tokenPath,
                form: {
                    'grant_type': 'refresh_token',
                    'refresh_token': this.refreshToken
                },
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
                    'content-type': 'application/x-www-form-urlencoded'
                }
            })
            this.setTokens(JSON.parse(tokens))
        }
    }

    // Returns the current song being listened to
    this.getPlaybackInfo = async () => {
        await this.updateAccessToken()
        let res = await request({
            method: 'get',
            url: apiHost + '/v1/me/player',
            headers: {
                'Accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + this.accessToken
            }
        })
        res = JSON.parse(res)
        return {
            'song': res.item.name,
            'artist': res.item.artists[0].name,
            'progress': res.progress_ms,
            'duration': res.item.duration_ms,
            'isPlaying': res.is_playing
        }
    }

    
}

/* authorize fn */
Spotify.prototype.authorize = async (scopes) => {

    // Retrieve saved tokens
    try {
        let tokens = db.getData('/spotify')
        return tokens

    // Authorize with spotify if tokens are not saved
    } catch (e) {
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
    return JSON.parse(tokens)
    }

}

module.exports = Spotify