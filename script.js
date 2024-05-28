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
                        <p>Date Taken: ${exifData.DateTime}</p>
                        <p>GPS Coordinates: ${formatGps(exifData)}</p>
                        <!-- Additional metadata can be accessed here -->
                    `;
                    metadataDiv.innerHTML += metadata;
                });
            };
            metadataDiv.appendChild(img);
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

function formatGps(exifData) {
    if (!exifData || !exifData.GPSLatitude || !exifData.GPSLongitude) {
        return 'N/A';
    }
    
    const latRef = exifData.GPSLatitudeRef || 'N';
    const lonRef = exifData.GPSLongitudeRef || 'E';
    
    const lat = convertCoordinate(exifData.GPSLatitude, latRef);
    const lon = convertCoordinate(exifData.GPSLongitude, lonRef);
    
    return `${lat} ${latRef}, ${lon} ${lonRef}`;
}

function convertCoordinate(coord, ref) {
    const [degrees, minutes, seconds] = coord;
    let decimal = degrees + (minutes / 60) + (seconds / 3600);
    if (ref === 'S' || ref === 'W') {
        decimal = -decimal;
    }
    return decimal.toFixed(6);
}
