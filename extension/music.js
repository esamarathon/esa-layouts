'use strict';
const nodecg = require('./util/nodecg-api-context').get();
const mpd = require('mpd');
var mpdConfig = nodecg.bundleConfig.mpd || {};
var volume = mpdConfig.volume || 10;
var currentVolume = volume;
var fadeInterval;
var connected = false;
if (!nodecg.bundleConfig.mpd.enable) {
    return;
}
// Stores song data to be displayed on layouts.
var songData = nodecg.Replicant('songData', { persistent: false });
// Set up connection to MPD server.
var client;
connect();
function connect() {
    client = mpd.connect({
        host: mpdConfig.address || 'localhost',
        port: mpdConfig.port || 6600
    });
    // Set up events.
    client.on('connect', onConnect);
    client.on('ready', onReady);
    client.on('end', onEnd);
    client.on('error', onError);
    client.on('system-player', onSystemPlayer);
}
var currentScene = nodecg.Replicant('currentOBSScene');
currentScene.on('change', (newVal, oldVal) => {
    newVal = newVal ? newVal.toLowerCase() : undefined;
    oldVal = oldVal ? oldVal.toLowerCase() : undefined;
    // Stop music
    if (oldVal && !oldVal.includes('intermission') && newVal.includes('intermission')) {
        fadeIn();
    }
    // Start music
    else if (oldVal && oldVal.includes('intermission') && !newVal.includes('intermission')) {
        fadeOut();
    }
});
// Listen for NodeCG messages from dashboard/layouts.
nodecg.listenFor('pausePlaySong', () => {
    if (songData.value.playing)
        fadeOut();
    else
        fadeIn();
});
nodecg.listenFor('skipSong', skipSong);
function onConnect() {
    connected = true;
    nodecg.log.info('MPD connection successful.');
}
function onReady() {
    client.sendCommand('status', (err, msg) => {
        var status = mpd.parseKeyValueMessage(msg);
        // If the current playlist has songs in it, we assume the MPD player is already set up correctly.
        if (status.playlistlength <= 0) {
            nodecg.log.info('Doing initial MPD configuration.');
            client.sendCommand('add /'); // Add all songs to play queue.
            client.sendCommand('repeat 1'); // Set player to repeat.
            shufflePlaylist(); // Shuffle the music.
            client.sendCommand('play'); // Play songs.
        }
        // Always set volume on connection just in case, but we need to wait a little for some reason (probably for playback to commence).
        setTimeout(setVolume, 2000);
        // Shuffle the playlist every 6 hours.
        // (We're only playing music in intermissions; doesn't need to be frequent).
        setInterval(shufflePlaylist, 21600000);
        updatePlaybackStatus();
        updateCurrentSong();
    });
}
function onEnd() {
    connected = false;
    nodecg.log.warn('MPD connection lost, retrying in 5 seconds.');
    setTimeout(connect, 5000);
}
function onError(err) {
    nodecg.log.warn('MPD connection error.', err);
    nodecg.log.debug('MPD connection error:', err);
}
// Update stuff when the player status changes.
function onSystemPlayer() {
    updatePlaybackStatus();
    updateCurrentSong();
}
// Used to update the replicant to say if there is a song playing or not.
function updatePlaybackStatus() {
    client.sendCommand('status', (err, msg) => {
        var status = mpd.parseKeyValueMessage(msg);
        if (status.state !== 'play') {
            songData.value.playing = false;
            songData.value.title = 'No Track Playing';
        }
        else
            songData.value.playing = true;
    });
}
// Used to update the replicant to include the title/artist.
function updateCurrentSong() {
    client.sendCommand('currentsong', (err, msg) => {
        var currentSong = mpd.parseKeyValueMessage(msg);
        var songTitle = currentSong.Title + ' - ' + currentSong.Artist;
        if (songTitle !== songData.value.title && songData.value.playing)
            songData.value.title = songTitle;
    });
}
// Can be used to pause/unpause music track.
function toggleSongPlayback() {
    var pause = songData.value.playing ? 1 : 0;
    client.sendCommand('pause ' + pause);
}
// Can be used to skip to the next song.
function skipSong() {
    client.sendCommand('next');
}
// Used to shuffle the currently playing list *correctly*.
// Actual shuffle is the same *every time* so let's add some randomness here!
function shufflePlaylist() {
    var random = Math.floor(Math.random() * Math.floor(20));
    for (var i = 0; i < random; i++)
        client.sendCommand('shuffle');
}
// Used to set the player volume to whatever the variable is set to.
function setVolume() {
    client.sendCommand('setvol ' + currentVolume);
}
// Used to fade out and pause the song.
function fadeOut() {
    if (!connected)
        return;
    clearInterval(fadeInterval);
    currentVolume = volume;
    setVolume();
    function loop() {
        currentVolume--;
        setVolume();
        if (currentVolume <= 0) {
            clearInterval(fadeInterval);
            client.sendCommand('pause 1');
        }
    }
    fadeInterval = setInterval(loop, 200);
}
// Used to unpause and fade in the song.
function fadeIn() {
    if (!connected)
        return;
    clearInterval(fadeInterval);
    currentVolume = 0;
    client.sendCommand('pause 0');
    setVolume();
    function loop() {
        currentVolume++;
        setVolume();
        if (currentVolume >= volume) {
            clearInterval(fadeInterval);
        }
    }
    fadeInterval = setInterval(loop, 200);
}
//# sourceMappingURL=music.js.map