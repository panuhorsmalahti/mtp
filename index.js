"use strict";
/*jslint node:true */
/*jslint nomen: true */


/**
 * Requires
 */
var ffi = require('ffi');

var libmtp = new ffi.Library('libmtp', {
    // 'Function name': [ 'return_type', [ 'param1', 'param2'] ]
    'LIBMTP_Init':      [ 'void', [ ] ],
    'LIBMTP_Set_Debug': [ 'void', [ 'int' ] ]
});

// Constants
libmtp.LIBMTP_DEBUG_NONE = 0x00;
libmtp.LIBMTP_DEBUG_PTP = 0x01;
libmtp.LIBMTP_DEBUG_PLST = 0x02;
libmtp.LIBMTP_DEBUG_USB = 0x04;
libmtp.LIBMTP_DEBUG_DATA = 0x08;
libmtp.LIBMTP_DEBUG_ALL = 0xFF;

module.exports = libmtp;