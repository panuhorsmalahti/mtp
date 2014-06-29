"use strict";
/*jslint node:true */
/*jslint nomen: true */


/**
 * Requires
 */
var ffi = require('ffi');

var libmtp = new ffi.Library('./libmtp/src/libmtp.c', {
    'LIBMTP_Init': [ 'void', [ ] ]
});

module.exports = libmtp;