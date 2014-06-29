"use strict";
/*jslint node:true */
/*jslint nomen: true */


/**
 * Requires
 */
var ffi = require('ffi');

var libmtp = new ffi.Library('libmtp', {
    'LIBMTP_Init': [ 'void', [ ] ]
});

module.exports = libmtp;