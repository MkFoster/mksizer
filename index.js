"use strict";

const util = require('util');
const fs = require('fs');
const path = require('path');
const validImageExtensions = ['.png', '.jpg', '.jpeg', '.tiff', '.tif', '.gif', '.webp'];

var validArgs = true;
var sourceDir, destinationDir;
var resizeDivisor = 1;
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

if ((typeof process.argv[4] != 'undefined') && (Number.isInteger(process.argv[4]))) {
    resizeDivisor = process.argv[4];
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
}

function filterImageExtensions(fileName) {
    return validImageExtensions.includes(path.extname(fileName).toLowerCase());
}

const readdir = util.promisify(fs.readdir);

readdir(sourceDir).then((listing) => {
    console.log(listing);
    var imageList = listing.filter(filterImageExtensions);
    
}).catch((err) => {
    console.log(err)
});

