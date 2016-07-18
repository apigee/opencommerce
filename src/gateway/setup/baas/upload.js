var config = require('./config.js');
var base_url = config.uri + '/' + config.org + '/' + config.app + '/';
var request = require('request');
var fs = require('fs');

var format = process.argv[2];

fs.readdir('./data', function (err, files) {

    for (var i in files) {
        var f = files[i];
        if ((format && format === 'data') && f.indexOf('.json') > 0) {
            var name = f.split('.json')[0];
            console.log('uploading data ' + name);
            uploadCollection(name, f);
        } else if ((format && format === 'query') && f.indexOf('.query') > 0) {
            var name = f.split('.query')[0];
            console.log('uploading query ' + name);
            if (name.toLowerCase() === 'post') {
                makePostRequests(name, f);
            }
        }
    }
});

function uploadCollection(name, path) {
    var url = base_url + name;

    var options = {
        url: url,
        headers: {
            'Authorization': config.auth
        }
    };

    fs.createReadStream('data/' + path).pipe(request.post(options, function (err, res, body) {

        if (!err && res.statusCode == 200) {
            console.log('upload complete for ' + name);
        } else {
            console.log(body);
        }
    }));
}

function makePostRequests(name, path) {

    var lineReader = require('line-reader');

    lineReader.eachLine('data/' + path, function (line, last) {
        console.log(line);
        var url = base_url + line;
        var options = {
            url: url,
            headers: {
                'Authorization': config.auth
            }
        };
        request.post(options, function (err, res, body) {

            if (!err && res.statusCode == 200) {
                console.log('upload complete for ' + line);
            } else {
                console.log(body);
            }
        });
    });
}

