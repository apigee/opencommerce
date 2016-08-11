var location = require('../libs/location.js')

routes = {};
module.exports = routes;

routes.searchNearBy = function (req, res) {
    var postal_code = req.query.postal_code;
    var city = req.query.city;

    var nearby ={};
    nearby.latitude = req.query.latitude;
    nearby.longitude = req.query.longitude;
    nearby.distance = req.query.radius;
    location.searchNearBy(postal_code, city, nearby, function (err, data) {
        if (err) {
            res.status(err.code || 500).send(
                JSON.stringify(err, undefined, 2));
        }
        else {
            res.send(data);
        }
    });
};

routes.searchNearByStore = function (req, res) {
    var storeId = req.params.storeId;
    location.searchNearByStore(storeId, function (err, data) {
        if (err)
        {
            res.status(err.code || 500).send(
                JSON.stringify(err, undefined, 2));
        }
        else
        {
            res.send(data);
        }
    });
};
