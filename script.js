async function startScreenCapture() {
    try {
        const constraints = {
            video: {
                cursor: "always"
            },
            audio: false
        };

        const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
        const video = document.createElement("video");
        video.srcObject = stream;
        video.style.display = "none";
        document.body.appendChild(video);

        await new Promise((resolve) => {
            video.onloadedmetadata = async () => {
                await video.play();
                resolve();
            };
        });

        console.log("Video playback started");

        if (document.pictureInPictureEnabled && !video.disablePictureInPicture) {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                }
                await video.requestPictureInPicture();
                console.log("Entered Picture-in-Picture mode");

                video.addEventListener("leavepictureinpicture", async () => {
                    console.log("PiP exited, restarting...");
                    setTimeout(async () => {
                        if (document.pictureInPictureEnabled) {
                            await video.requestPictureInPicture();
                        }
                    }, 500);
                });

            } catch (error) {
                console.error("Error entering Picture-in-Picture mode:", error);
            }
        } else {
            console.error("Picture-in-Picture is not supported in this browser.");
        }
    } catch (error) {
        console.error("Error capturing screen:", error);
    }
}

document.getElementById("captureEntireScreen").addEventListener("click", async () => {
    await startScreenCapture();
});
