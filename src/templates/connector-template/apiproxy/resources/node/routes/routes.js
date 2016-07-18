var Entity = require('../libs/entity.js')
var apigee = require('apigee-access');

Routes = {};
module.exports = Routes;

Routes.get = function(req, res) {
    var params = {};
    entity.get(params, function(err, data) {

    });
};

Routes.put = function(req, res) {
    var params = {};
    entity.update(params, function(err, data) {

    });
};

Routes.post = function(req, res) {
    var params = {};
    entity.create(params, function(err, data) {

    });
};

Routes.delete = function(req, res) {
    var params = {};
    entity.delete(params, function(err, data) {

    });
};

Routes.search = function(req, res) {
    var params = {};
    entity.search(params, function(err, data) {

    });
};