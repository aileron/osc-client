// Copyright 2015 Bubl Technology Inc.
//
// Licensed under the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>.
// This file may not be copied, modified, or distributed
// except according to those terms.

var Q = require('q');

// HTTP REQUEST
var makeHttpRequest = function(method, url, contentType, body) {
    'use strict';
    var deferred = Q.defer();

    fetch(url,{method: method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-XSRF-Protected': '1'
      },
      body: body
    }).then(function(res){

      deferred.resolve({ body: res.body(), response: res.res });

    });
    /*
      if(err) {
        deferred.reject({ error: err });
        return;
      }
    */

    return deferred.promise;
};

module.exports = makeHttpRequest;
