var Peepub   = require('pe-epub-fs')(require('pe-epub'));
var epubJson = require('/Users/galbers/GitHub/mosaics/source/epub/romanmosaics.json'); // see examples/example.json for the specs
var myPeepub = new Peepub(epubJson);

myPeepub.create('/Users/galbers/GitHub/mosaics/source/assets/downloads/RomanMosaics_Belis.epub')
    .then(function(filePath){
        console.log(filePath); // the same path to your epub file!
    });
