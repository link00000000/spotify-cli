/* Modules */
const fs = require('fs')
const exec = require('child_process').execSync
const path = require('path')
const Spotify = require('./spotify-web-api')
const JsonDB = require('node-json-db')

/* Global variables */
const SCOPES = [
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-modify-playback-state'
]

/* main fn */
let main = async () => {
    let tokens = await Spotify.authorize(SCOPES)
    await Spotify.setTokens(tokens)
}
main()