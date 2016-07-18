var config = require('./config.js');
var base_url = config.uri + '/' + config.org + '/' + config.app +'/';
var request = require('request');
var fs = require('fs');
var data = {} ;
function getAllCollections (){
    var options = {
        url: base_url,
        headers: {
            'Authorization': config.auth
        }
    };
	request( options , function (err, response , body) {
		if( !err && response.statusCode ==200){
			var b = JSON.parse(body);
			var collections = b.entities[0].metadata.collections;
			downLoadCollections(collections);
		}
	}) ; 
}

function downLoadCollections (collections) {
	for(var c in collections ){
		var name = c ;
		var count = collections[c].count ;
		if(name=='events') continue;
		console.log('Collection ' + name + ' has ' + count + ' entities');
		if(count > 0){
			var url = base_url + name + '?limit=' + count ;
			downloadCollection (url , name , count);
		}
	}
}


function downloadCollection (url, name, count ){
    var options = {
        url: url,
        headers: {
            'Authorization': config.auth
        }
    };

    request(options, function(err, response, body){
		if(!err && response.statusCode==200){
			var b = JSON.parse(body);
			
			if(b.count == count ){
				//all data collected
				copyToLocal(name, b.entities);
				console.log( name + ' = all done write to file');
				fs.writeFileSync('data/' + name + '.json' , JSON.stringify(data[name]));
				
			}else{
				//some more data to collect
				copyToLocal(name, b.entities);
				count = count - b.count ;
				var cursor = b.cursor ;
				var newurl = base_url + name +  '?limit=' + count ;
				downloadCollection(newurl, name, count);
			}
		}
	});
}

function copyToLocal(name, entitites){
	if(!data[name]){
		data[name] = [] ;
	}
	for(var i =0; i < entitites.length ; i ++ ){
		var e = entitites[i];
		delete e.uuid ;
		delete e.type  ;
		delete e.created ;
		delete e.modified ;
		delete e.metadata ;
		data[name].push(e);
	}
}

fs.mkdir('data',function(){
	getAllCollections () ;	
});

