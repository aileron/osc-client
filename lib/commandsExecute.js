// Copyright 2015 Bubl Technology Inc.
//
// Licensed under the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>.
// This file may not be copied, modified, or distributed
// except according to those terms.

'use strict';

var Q = require('q');
var poll = require('./poll');
if (!fetch) {
var fetch = require('node-fetch');
}

// OSC COMMANDS EXECUTE
var commandsRequest = function(name, params, callback) {
    var commandsExecuteUrl = this.serverAddress + '/osc/commands/execute';

    fetch(commandsExecuteUrl,{method: 'POST',
      headers: {
        'X-XSRF-Protected': '1',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body:{name: name,parameters: params}
    })
    .then(function(res){ return res.json() })
    .then(callback);
};


var commandsExecute = function(name, params, statusCallback) {
    var deferred = Q.defer();
    var client = this;
    commandsRequest.apply(client, [name, params, function(err, res) {
        if(err) {
          deferred.reject({ error: err });
          return;
        }
        var timeStamp = Date.now();
        if (res.headers['content-type'] === 'application/json; charset=utf-8') {
            if (res.body.state !== 'inProgress') {
              deferred.resolve({ body: res.body, response: res.res });
            } else {
              var commandId = res.body.id;
              poll.commandStatus(client, commandId, deferred, timeStamp, statusCallback);
            }
        } else {
            deferred.resolve({ body: res.body, response: res.res });  // only for getImage command
        }
    }]);
    return deferred.promise;
};

module.exports = commandsExecute;
