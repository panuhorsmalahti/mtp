/*jslint node:true */
"use strict";

/**
 * Require
 */
var ffi = require('ffi');
var ref = require('ref');
var struct = require('./struct');
var pointer = require('./pointer');
var constants = require('./constants');

var LIBMTP_raw_device_structPtr = ref.refType(struct.LIBMTP_raw_device_struct);
var LIBMTP_raw_device_structPtrPtr = ref.refType(LIBMTP_raw_device_structPtr);

/**
 * libmtp definition
 */
var mtp = new ffi.Library('libmtp', {
    // 'Function name': [ 'return_type', [ 'param1', 'param2'] ]
    'LIBMTP_Init': ['void', []],
    'LIBMTP_Set_Debug': ['void', ['int']],
    'LIBMTP_Detect_Raw_Devices': ['int', [LIBMTP_raw_device_structPtrPtr, pointer.intPtr]],
    'LIBMTP_Open_Raw_Device': [ref.refType(struct.LIBMTP_mtpdevice_struct), [LIBMTP_raw_device_structPtr]],
    'LIBMTP_Dump_Errorstack': ['void', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    'LIBMTP_Clear_Errorstack': ['void', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    'LIBMTP_Dump_Device_Info': ['void', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    'LIBMTP_Get_Friendlyname': [ 'string', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    'LIBMTP_Get_Manufacturername': [ 'string', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    'LIBMTP_Get_Modelname': [ 'string', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    'LIBMTP_Get_Serialnumber': [ 'string', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    'LIBMTP_Get_Deviceversion': [ 'string', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    'LIBMTP_Get_Syncpartner': [ 'string', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    'LIBMTP_Get_Batterylevel': [ 'int', [ref.refType(struct.LIBMTP_mtpdevice_struct), pointer.uint8Ptr, pointer.uint8Ptr]],
    'LIBMTP_Get_Supported_Filetypes': [ 'int', [ref.refType(struct.LIBMTP_mtpdevice_struct), pointer.uint16PtrPtr, pointer.uint16Ptr]],
    'LIBMTP_Get_Filetype_Description': [ 'string', [ 'int' ]],
    'LIBMTP_Get_Secure_Time': [ 'int', [ref.refType(struct.LIBMTP_mtpdevice_struct), ref.refType('string') ]],
    'LIBMTP_Get_Device_Certificate': [ 'int', [ref.refType(struct.LIBMTP_mtpdevice_struct), ref.refType('string')]]
});

// Set structs
Object.keys(struct).forEach(function (structName) {
    mtp[structName] = struct[structName];
});

// Set pointers
Object.keys(pointer).forEach(function (pointerName) {
    mtp[pointerName] = pointer[pointerName];
});
mtp.LIBMTP_raw_device_structPtr = LIBMTP_raw_device_structPtr;
mtp.LIBMTP_raw_device_structPtrPtr = LIBMTP_raw_device_structPtrPtr;

// Set constants
constants(mtp);

module.exports = mtp;