// script.js
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const playPauseButton = document.getElementById('playPause');
    const stopButton = document.getElementById('stop');
    const nextButton = document.getElementById('next');
    const previousButton = document.getElementById('previous');
    const songName = document.getElementById('songName');
    const status = document.getElementById('status');

    let isPlaying = false;
    let currentTrackIndex = 0;
    let tracks = [];

    // Fetch tracks from the Free Music Archive API
    async function fetchTracks() {
        try {
            const response = await fetch('https://freemusicarchive.org/api/track?limit=10');
            const data = await response.json();
            tracks = data.data; // Assume `data.data` is an array of track objects
            loadTrack(currentTrackIndex);
        } catch (error) {
            console.error('Error fetching tracks:', error);
        }
    }

    function loadTrack(index) {
        if (tracks.length === 0) return;
        const track = tracks[index];
        audio.src = track.file_url;
        songName.textContent = `Song Name: ${track.title}`;
        status.textContent = 'Status: Loaded';
    }

    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playPauseButton.textContent = 'Play';
            status.textContent = 'Status: Paused';
        } else {
            audio.play();
            playPauseButton.textContent = 'Pause';
            status.textContent = 'Status: Playing';
        }
        isPlaying = !isPlaying;
    });

    stopButton.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        playPauseButton.textContent = 'Play';
        status.textContent = 'Status: Stopped';
        isPlaying = false;
    });

    nextButton.addEventListener('click', () => {
        if (tracks.length === 0) return;
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) {
            audio.play();
        }
    });

    previousButton.addEventListener('click', () => {
        if (tracks.length === 0) return;
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) {
            audio.play();
        }
    });

    // Initialize the player
    fetchTracks();
});
