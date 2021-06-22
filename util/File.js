import { NormalizedImageData } from "./Image.js";

export async function requestFile(relativePath) {
    return new Promise(resolve => {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(this.responseText);
            }
        };

        xhttp.open("GET", relativePath, true);
        xhttp.send();
    });
}

export async function loadImageData(imageSource) {
    return new Promise(resolve => {
        const image = new Image();
        image.onload = function() {
            resolve(new NormalizedImageData(image));
        };
        image.src = imageSource;
    });
}