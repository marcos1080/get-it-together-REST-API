const FS = require('fs');
const Path = require('path');
const pathname = __dirname + '/schemas';

let files = FS.readdirSync(pathname);
let schemas = {};

files.forEach( file => {
    let contents = FS.readFileSync(Path.join(pathname, file), 'utf8');
    // console.log(Path.join(pathname, file));
    // console.log(contents);

    switch (file.replace('.schema', '')) {
        case 'users':
            schemas['000'] = contents;
            break;
        case 'banks':
            schemas['001'] = contents;
            break;
    }
});

// Organise schemas in order.
let sortedSchemas = {};
Object.keys(schemas).sort((a, b) => {
    return a.localeCompare(b);
}).forEach(key => {
    sortedSchemas[key] = schemas[key];
});

// Stitch into 1 string.
let schemaString = '';
for (let schema in sortedSchemas) {
    schemaString += sortedSchemas[schema] + '\n\n';
}

// console.log(Object.keys(schemas));
// console.log(Object.keys(sortedSchemas));
// console.log(schemaString);

module.exports = schemaString;