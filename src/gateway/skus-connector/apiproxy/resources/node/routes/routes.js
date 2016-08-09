var skus = require('../libs/skus.js')
var apigee = require('apigee-access');

Routes = {};
module.exports = Routes;

Routes.get = function(req, res)
{
    var parameters = {};
    //fetch the skuid from the querystring
    var skuid=req.params.skuid;
    var username=req.query.username;
    parameters.skuid=skuid;
    parameters.username=username;
    skus.get(parameters, function(err, data) {
        if(err===null){
            res.send(data);
        }
        else
        {
            res.status(err.code).send(JSON.stringify(err, undefined, 2));
        }

    });
};

