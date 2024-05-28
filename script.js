// script.js
function handleFiles(event) {
    const files = event.target.files;
    const metadataDiv = document.getElementById('metadata');
    metadataDiv.innerHTML = '';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.onload = function() {
                URL.revokeObjectURL(this.src);
                getExifData(file, function(exifData) {
                    const metadata = `
                        <p>Name: ${file.name}</p>
                        <p>Size: ${file.size} bytes</p>
                        <p>Dimensions: ${this.width} x ${this.height}</p>
                        <p>Creation Time: ${exifData.DateTimeOriginal}</p>
                        <p>GPS Coordinates: ${exifData.GPSLatitude}, ${exifData.GPSLongitude}</p>
                        <!-- Additional metadata can be accessed here -->
                    `;
                    metadataDiv.innerHTML += metadata;
                });
            };
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.preload = 'metadata';
            video.onloadedmetadata = function() {
                URL.revokeObjectURL(this.src);
                const metadata = `
                    <p>Name: ${file.name}</p>
                    <p>Size: ${file.size} bytes</p>
                    <p>Duration: ${this.duration.toFixed(2)} seconds</p>
                    <p>Dimensions: ${this.videoWidth} x ${this.videoHeight}</p>
                    <!-- Additional metadata can be accessed here -->
                `;
                metadataDiv.innerHTML += metadata;
            };
        }

        metadataDiv.appendChild(document.createElement('hr'));
    }
}

function getExifData(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const exif = EXIF.readFromBinaryFile(new BinaryFile(event.target.result));
        callback(exif);
    };
    reader.readAsBinaryString(file);
}
