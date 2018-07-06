const fs = require('fs');

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

fs.readdir(sourceDir, (err, listing) => {
    console.log(listing);
});