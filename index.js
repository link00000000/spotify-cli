/* Modules */
const fs = require('fs')
const exec = require('child_process').execSync
const path = require('path')
const SpotifyApi = require('./spotify-web-api')
const blessed = require('blessed')

/* Global letiables */
const SCOPES = [
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-modify-playback-state'
]

/* main fn */
let main = async () => {
    let spotify = new SpotifyApi()
    let tokens = await spotify.authorize(SCOPES)
    await spotify.setTokens(tokens)

    /* Render player */
    let screen = blessed.screen({ smartCSR: true })
    screen.title = 'Spotify'

    // main container element
    let main = blessed.box({
        width: '80%',
        height: 1,
        top: '50%',
        left: '10%'
    })
    screen.append(main)

    // Progress bar element
    let progress = blessed.progressbar({
        orientation: 'horizontal',
        pch: '―',
        filled: 100,
        name: 'progress',
        height: 1,
        style: { fg: 'green' }
    })
    main.append(progress)

    // Context and media controls container element
    let contextBox = blessed.box({
        height: 1,
        top: 1
    })
    main.append(contextBox)

    // Button box container element
    let btnBox = blessed.box({
        width: 3,
        height: 1,
        left: '50%'
    })
    contextBox.append(btnBox)

    // Previous button element
    let prevBtn = blessed.button({
        content: '⏪',
        width: 1,
        height: 1,
        left: -2
    })
    prevBtn.on('press', () => {

    })
    btnBox.append(prevBtn)

    // Play button element
    let playBtn = blessed.button({
        content: '⏸',
        width: 1,
        height: 1,
        left: 0
    })
    playBtn.on('press', () => {
        
    })
    btnBox.append(playBtn)

    // Next button element
    let nextBtn = blessed.button({
        content: '⏩',
        width: 1,
        height: 1,
        left: 2
    })
    nextBtn.on('press', () => {
        
    })
    btnBox.append(nextBtn)

    // Current time element
    let curTime = blessed.text({
        content: '0:00'
    })
    contextBox.append(curTime)

    // Total time element
    let totTime = blessed.text({
        content: '0:00  ',
        right: 0
    })
    contextBox.append(totTime)


    // Song information container element
    let infoBox = blessed.box({
        content: 'Song Info',
        left: 0,
        top: -3,
        height: 2
    })
    main.append(infoBox)

    // Song title element
    let song = blessed.text({
        content: '{{SONG TITLE}}'
    })
    infoBox.append(song)

    // Artist name element
    let artist = blessed.text({
        content: '{{SONG ARTIST}}',
        top: 1
    })
    infoBox.append(artist)

    // Controls for quitting player
    screen.key(['C-c', 'q'], function(ch, key) {
        return process.exit(0)
    })

    // Polls player info
    setInterval(async () => { 
        let playbackInfo = await spotify.getPlaybackInfo()
        song.content = playbackInfo.song
        artist.content = playbackInfo.artist
        curTime.content = formatTimestamp(playbackInfo.progress)
        totTime.content = formatTimestamp(playbackInfo.duration) + '  '
        playBtn.content = playbackInfo.isPlaying ? '⏸' : '▶'
        progress.filled = Math.ceil((playbackInfo.progress / playbackInfo.duration) * 100)
        screen.render()
    }, 100)

}
main()

let formatTimestamp = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}