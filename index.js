"use strict";

/**
 * Test with "node index.js testimages output 8"
 */

const util = require('util');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const validImageExtensions = ['.png', '.jpg', '.jpeg', '.tiff', '.tif', '.gif', '.webp'];

let validArgs = true;
let sourceDir, destinationDir;
let resizeDivisor = 1;
if ((typeof process.argv[2] == 'undefined') || (process.argv[2] == null)) {
    validArgs = false;
} else {
    sourceDir = process.argv[2];
}

if ((typeof process.argv[3] == 'undefined') || (process.argv[3] == null)) {
    validArgs = false;
} else {
    destinationDir = process.argv[3];
}

if ((typeof process.argv[4] != 'undefined') && (Number.isInteger(Number(process.argv[4])))) {
    resizeDivisor = Number(process.argv[4]);
}

if (!validArgs) {
    console.log("Invalid parameters.\nUsage: node index.js sourceDir destinationDir [resizeDivisor]\n");
    process.exit();
}

/**
 * Manually promisify fs.readdir vs. using util.promisify(fs.readdir)
 * 
 * @param {string} sourceDir 
 */
/*
function fsReadDirPromise(sourceDir) {
    return new Promise(function(resolve, reject) {
        fs.readdir(sourceDir, (err, listing) => {
            if (err) {
                reject(err);
            } else {
                resolve(listing);
            }
        });
    });
}*/

function filterImageExtensions(fileName) {
    return validImageExtensions.includes(path.extname(fileName).toLowerCase());
}

function resize(file, destinationDir, resizeDivisor) {
    const image = sharp(sourceDir + '/' + file);
    image.metadata().then((metadata)=>{
        return image.resize(Math.round(metadata.width / resizeDivisor)).toFile(destinationDir + '/' + file);
    });
}

const readdir = util.promisify(fs.readdir);

readdir(sourceDir).then((listing) => {
    let imageList = listing.filter(filterImageExtensions);
    let resizePromises = [];
    for (let file of imageList) {
        resizePromises.push(resize(file, destinationDir, resizeDivisor));
    }
    Promise.all(resizePromises).then(()=>{
    }).then(()=>{
        console.log('Done!');
    });
}).catch((err) => {
    console.log(err)
});

