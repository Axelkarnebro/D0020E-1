// NOTE: The code below in the comment block is for Node.js testing
/*
var Parser = require('../SysmlParser.js');
var GenericObject = require('../../Object Definitions/GenericObject.js');
var PackageObject = require('../../Object Definitions/Package.js');
var PartObject = require('../../Object Definitions/Part.js');

var fs = require('fs');
var filePath = require.resolve('../ParserTestCases/sysmlTest-1.sysml');
var fileContent = fs.readFileSync(filePath,'utf8');
*/


var SYSML_OBJECTS = [];
var TOP_LEVEL_OBJECTS = [];

/**
 * Prints the results of parsing some input
 * NOTE: At the moment only a depth of 3 levels of nestled objects are supported!
 * @param {} parseResult 
 */
function printParseResult(parseResult) {

    for (i = 0; i < parseResult.length; i++) {

        if (Array.isArray(parseResult[i].content)) {

            console.log("Level 0." + i + ":");
            console.log(parseResult[i]);
        }        

        for (j = 0; j < parseResult[i].content.length; j++) {

            if (Array.isArray(parseResult[i].content[j].content)) {

                console.log("Level 1." + j + ":");
                console.log(parseResult[i].content[j]);
            }
        }
    }
}


/**
 * Creates Object Definitions based on parser input
 * NOTE: At the moment only a depth of 3 levels of nestled objects are supported!
 * @param {*} parseResult 
 */
function createObjects(parseResult) {

    // Top-level objects
    for (i = 0; i < parseResult.length; i++) {

        if (parseResult[i] !== undefined) {
            switch (parseResult[i].type) {
                case 'PackageClass':
                    var packageObj = new Package(parseResult[i].name, parseResult[i].type, null, null, null);
                    SYSML_OBJECTS.push(packageObj);
                    TOP_LEVEL_OBJECTS.push(packageObj);
                    break;
                case 'PartClass':

                    if (parseResult[i].isDefinition) {
                        var partObj = new Part(parseResult[i].name, parseResult[i].type, true, null, null);
                        SYSML_OBJECTS.push(partObj);
                        TOP_LEVEL_OBJECTS.push(partObj);
                    }
                    else {
                        var partObj = new Part(parseResult[i].name, parseResult[i].type, false, null, null)
                        SYSML_OBJECTS.push(partObj);
                        TOP_LEVEL_OBJECTS.push(partObj);
                    }
                    break;
                default:
                    var genericObj = new GenericObject(parseResult[i].name, parseResult[i].type, null, null, null);
                    SYSML_OBJECTS.push(genericObj);
                    TOP_LEVEL_OBJECTS.push(genericObj);
                    break;
            }    
        }

        // Second-level objects
        for (j = 0; j < parseResult[i].contentLength; j++) {

            if (parseResult[i].content[j] !== undefined) {

                switch (parseResult[i].content[j].type) {
                    case 'PackageClass':
                        var packageObj = new Package(parseResult[i].content[j].name, parseResult[i].content[j].type, null, parseResult[i].name, null);
                        SYSML_OBJECTS.push(packageObj);
                        TOP_LEVEL_OBJECTS[i].addChild(packageObj);
                        break;
                    case 'PartClass':

                        if (parseResult[i].content[j].isDefinition) {
                            var partObj = new Part(parseResult[i].content[j].name, parseResult[i].content[j].type, true, parseResult[i].name, null);
                            SYSML_OBJECTS.push(partObj);
                            TOP_LEVEL_OBJECTS[i].addChild(partObj);
                        }
                        else {
                            var partObj = new Part(parseResult[i].content[j].name, parseResult[i].content[j].type, false, parseResult[i].name, parseResult[i].content[j].instanceOf);
                            SYSML_OBJECTS.push(partObj);
                            TOP_LEVEL_OBJECTS[i].addChild(partObj);
                        }
                        break;
                    default:
                        var genericObj = new GenericObject(parseResult[i].content[j].name, parseResult[i].content[j].type, null, parseResult[i].name, null);
                        SYSML_OBJECTS.push(genericObj);
                        TOP_LEVEL_OBJECTS[i].addChild(genericObj);
                        break;
                } 
            }

            // Third-level objects
            for (k = 0; k < parseResult[i].content[j].contentLength; k++) {                

                if (parseResult[i].content[j].content[k] !== undefined) {

                    switch (parseResult[i].content[j].content[k].type) {
                        case 'PackageClass':
                            var packageObj = new Package(parseResult[i].content[j].content[k].name, parseResult[i].content[j].content[k].type, null, parseResult[i].content[j].name, null);
                            SYSML_OBJECTS.push(packageObj);
                            TOP_LEVEL_OBJECTS[i].children[j].addChild(packageObj);
                            break;
                        case 'PartClass':
        
                            if (parseResult[i].content[j].content[k].isDefinition) {
                                var partObj = new Part(parseResult[i].content[j].content[k].name, parseResult[i].content[j].content[k].type, true, parseResult[i].content[j].name, null);
                                SYSML_OBJECTS.push(partObj);
                                TOP_LEVEL_OBJECTS[i].children[j].addChild(partObj);
                            }
                            else {
                                var partObj = new Part(parseResult[i].content[j].content[k].name, parseResult[i].content[j].content[k].type, false, parseResult[i].content[j].name, parseResult[i].content[j].content[k].instanceOf);
                                SYSML_OBJECTS.push(partObj);
                                TOP_LEVEL_OBJECTS[i].children[j].addChild(partObj);
                            }
                            break;
                        default:
                            var genericObj = new GenericObject(parseResult[i].content[j].content[k].name, parseResult[i].content[j].content[k].type, null, parseResult[i].content[j].name, null);
                            SYSML_OBJECTS.push(genericObj);
                            TOP_LEVEL_OBJECTS[i].children[j].addChild(genericObj);
                            break;
                    } 
                }                
            }
        }
    }
}

function printObjects(parseContent, lvl, pos) {

    console.log(lvl + "." + pos);
    console.log(parseContent);

    for (i = 0; i < parseContent.length; i++) {

        if (parseContent[i].children.length !== 0) {

            printObjects(parseContent[i].children, lvl+1)
        }
    }

    console.log(lvl);
}
