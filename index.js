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

    // Fetch tracks from the Deezer API
    async function fetchTracks() {
        const url = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=eminem'; // Example query, you can modify it
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '2c7f83219dmsh45353fa5c20e10ep10a305jsn0b4b9bf52737',
                'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            tracks = data.data; // Assume `data.data` is an array of track objects
            if (tracks.length > 0) {
                loadTrack(currentTrackIndex);
            } else {
                status.textContent = 'No tracks found';
            }
        } catch (error) {
            console.error('Error fetching tracks:', error);
            status.textContent = 'Error fetching tracks';
        }
    }

    function loadTrack(index) {
        if (tracks.length === 0) {
            status.textContent = 'No tracks available';
            return;
        }
        const track = tracks[index];
        audio.src = track.preview; // Using the preview URL provided by Deezer API
        songName.textContent = `Song Name: ${track.title}`;
        status.textContent = 'Status: Loaded';
    }

    playPauseButton.addEventListener('click', () => {
        if (!audio.src) {
            status.textContent = 'No track loaded';
            return;
        }

        if (isPlaying) {
            audio.pause();
            playPauseButton.textContent = 'Play';
            status.textContent = 'Status: Paused';
        } else {
            audio.play().then(() => {
                playPauseButton.textContent = 'Pause';
                status.textContent = 'Status: Playing';
            }).catch(error => {
                console.error('Error playing audio:', error);
                status.textContent = 'Error playing audio';
            });
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
            audio.play().catch(error => console.error('Error playing audio:', error));
        }
    });

    previousButton.addEventListener('click', () => {
        if (tracks.length === 0) return;
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) {
            audio.play().catch(error => console.error('Error playing audio:', error));
        }
    });

    // Initialize the player by fetching tracks
    fetchTracks();
});
