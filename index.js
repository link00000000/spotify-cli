var blessed = require('blessed');
require('./spotify-auth')().then((authCode) => {


    //
    // ──────────────────────────────────────────────────────── SCREEN DEFINITION ─────
    //
    var screen = blessed.screen({ smartCSR: true });
    screen.title = 'my window title';


    //
    // ───────────────────────────────────────────────────────────────────── MAIN ─────
    //
    var main = blessed.box({
        width: '80%',
        height: 1,
        top: '50%',
        left: '10%'
    })
    screen.append(main);


    //
    // ───────────────────────────────────────────────────────── PROGRESS ELEMENT ─────
    //
    var progress = blessed.progressbar({
        orientation: 'horizontal',
        pch: '―',
        filled: 100,
        name: 'progress',
        height: 1,
        style: { fg: 'green' }
    });
    main.append(progress);


    //
    // ────────────────────────────────────────────────────────────────── Context ─────
    //
    var contextBox = blessed.box({
        height: 1,
        top: 1
    })
    main.append(contextBox);

    // Button Box
    var btnBox = blessed.box({
        width: 3,
        height: 1,
        left: '50%'
    })
    contextBox.append(btnBox);

    // Previous Button
    var prevBtn = blessed.button({
        content: '⏪',
        width: 1,
        height: 1,
        left: -2
    })
    prevBtn.on('press', () => {

    })
    btnBox.append(prevBtn);

    // Play Button
    var playBtn = blessed.button({
        content: '⏸',
        width: 1,
        height: 1,
        left: 0
    })
    playBtn.on('press', () => {
        
    })
    btnBox.append(playBtn);

    // Next Button
    var nextBtn = blessed.button({
        content: '⏩',
        width: 1,
        height: 1,
        left: 2
    })
    nextBtn.on('press', () => {
        
    })
    btnBox.append(nextBtn);

    // Current Time
    var curTime = blessed.text({
        content: '0:00'
    })
    contextBox.append(curTime);

    // Total Time
    var totTime = blessed.text({
        content: '0:00  ',
        right: 0
    })
    contextBox.append(totTime);


    //
    // ──────────────────────────────────────────────────────────────── SONG INFO ─────
    //
    var infoBox = blessed.box({
        content: 'Song Info',
        left: 0,
        top: -3,
        height: 2
    })
    main.append(infoBox);

    var song = blessed.text({
        content: '{{SONG TITLE}}'
    })
    infoBox.append(song);

    var artist = blessed.text({
        content: '{{SONG ARTIST}} -- ' + authCode,
        top: 1
    })
    infoBox.append(artist);

    
    //
    // ──────────────────────────────────────────────────────────────────── UTILS ─────
    //
    screen.key(['C-c'], function(ch, key) {
        return process.exit(0);
    });

    screen.render();
});