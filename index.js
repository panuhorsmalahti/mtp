/*jslint node:true */
/*jslint nomen: true */
"use strict";

/**
 * Requires
 */
var ffi = require('ffi');
var ref = require('ref');
var struct = require('./struct');
var constants = require('./constants');

/**
 * Pointers
 */
// TODO: Move to a shared pointers module
var intPtr = ref.refType('int');
var charPtr = ref.refType('char');
var voidPtr = ref.refType('void');


var LIBMTP_raw_device_structPtr = ref.refType(struct.LIBMTP_raw_device_struct);
var LIBMTP_raw_device_structPtrPtr = ref.refType(LIBMTP_raw_device_structPtr);

/**
 * mtp definition
 */
var mtp = new ffi.Library('libmtp', {
    // 'Function name': [ 'return_type', [ 'param1', 'param2'] ]
    'LIBMTP_Init': ['void', []],
    'LIBMTP_Set_Debug': ['void', ['int']],
    'LIBMTP_Detect_Raw_Devices': ['int', [LIBMTP_raw_device_structPtrPtr, intPtr]],
    'LIBMTP_Open_Raw_Device': [ref.refType(struct.LIBMTP_mtpdevice_struct), [LIBMTP_raw_device_structPtr]]
});

// Apply structs
Object.keys(struct).forEach(function (structName) {
    mtp[structName] = struct[structName];
});

// Apply pointers
mtp.LIBMTP_raw_device_structPtr = LIBMTP_raw_device_structPtr;
mtp.LIBMTP_raw_device_structPtrPtr = LIBMTP_raw_device_structPtrPtr;

// Set constants
constants(mtp);

module.exports = mtp;