async function startScreenCapture() {
    try {
        const constraints = {
            video: {
                cursor: "always",
                mediaSource: "screen"
            },
            audio: false
        };

        const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
        const video = document.createElement('video');
        video.srcObject = stream;
        video.style.display = 'none';
        document.body.appendChild(video);

        video.onloadedmetadata = async () => {
            await video.play();
            console.log('Video playback started');

            if (document.pictureInPictureEnabled) {
                try {
                    await video.requestPictureInPicture();
                    console.log('Entered Picture-in-Picture mode');
                } catch (error) {
                    console.error('Error entering Picture-in-Picture mode:', error);
                }
            } else {
                console.error('Picture-in-Picture is not supported in this browser.');
            }
        };
    } catch (error) {
        console.error('Error capturing screen:', error);
    }
}

document.getElementById('captureEntireScreen').addEventListener('click', async () => {
    await startScreenCapture();
});
