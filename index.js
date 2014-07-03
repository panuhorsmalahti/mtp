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
    /**
     * LIBMTP_Init
     * @returns {void}
     */
    'LIBMTP_Init':
        ['void', []],
    /**
     * LIBMTP_Set_Debug
     * @param {int}
     * @returns {void}
     */
    'LIBMTP_Set_Debug':
        ['void', ['int']],
    /**
     * LIBMTP_Detect_Raw_Devices
     * @param {LIBMTP_raw_device_structPtrPtr}
     * @param {intPtr}
     * @returns {int}
     */
    'LIBMTP_Detect_Raw_Devices':
        ['int', [LIBMTP_raw_device_structPtrPtr, pointer.intPtr]],
    /**
     * LIBMTP_Open_Raw_Device
     * @param {LIBMTP_raw_device_structPtr}
     * @returns {LIBMTP_mtpdevice_structPtr}
     */
    'LIBMTP_Open_Raw_Device':
        [ref.refType(struct.LIBMTP_mtpdevice_struct), [LIBMTP_raw_device_structPtr]],
    /**
     * LIBMTP_Dump_Errorstack
     * @param {LIBMTP_mtpdevice_structPtr}
     * @returns {void}
     */
    'LIBMTP_Dump_Errorstack':
        ['void', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    /**
     * LIBMTP_Clear_Errorstack
     * @param {LIBMTP_mtpdevice_structPtr}
     * @returns {void}
     */
    'LIBMTP_Clear_Errorstack': 
        ['void', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    /**
     * LIBMTP_Dump_Device_Info'
     * @param {LIBMTP_mtpdevice_structPtr}
     * @returns {void}
     */
    'LIBMTP_Dump_Device_Info':
        ['void', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    /**
     * LIBMTP_Get_Friendlyname
     * @param {LIBMTP_mtpdevice_structPtr}
     * @returns {string}
     */
    'LIBMTP_Get_Friendlyname':
        ['string', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    /**
     * LIBMTP_Get_Manufacturername
     * @param {LIBMTP_mtpdevice_structPtr}
     * @returns {string}
     */
    'LIBMTP_Get_Manufacturername':
        ['string', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    /**
     * LIBMTP_Get_Modelname
     * @param {LIBMTP_mtpdevice_structPtr}
     * @returns {string}
     */
    'LIBMTP_Get_Modelname':
        ['string', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    /**
     * LIBMTP_Get_Serialnumber
     * @param {LIBMTP_mtpdevice_structPtr}
     * @returns {string}
     */
    'LIBMTP_Get_Serialnumber':
        ['string', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    /**
     * LIBMTP_Get_Deviceversion
     * @param {LIBMTP_mtpdevice_structPtr}
     * @returns {string}
     */
    'LIBMTP_Get_Deviceversion':
        ['string', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    /**
     * LIBMTP_Get_Syncpartner
     * @param {LIBMTP_mtpdevice_structPtr}
     * @returns {string}
     */
    'LIBMTP_Get_Syncpartner':
        ['string', [ref.refType(struct.LIBMTP_mtpdevice_struct)]],
    /**
     * LIBMTP_Get_Batterylevel
     * @param {LIBMTP_mtpdevice_structPtr}
     * @param {uint8Ptr}
     * @param {uint8Ptr}
     * @returns {int}
     */
    'LIBMTP_Get_Batterylevel':
        ['int', [ref.refType(struct.LIBMTP_mtpdevice_struct), pointer.uint8Ptr, pointer.uint8Ptr]],
    /**
     * LIBMTP_Get_Supported_Filetypes
     * @param {LIBMTP_mtpdevice_structPtr}
     * @param {uint16PtrPtr}
     * @param {uint16Ptr}
     * @returns {int}
     */
    'LIBMTP_Get_Supported_Filetypes':
        ['int', [ref.refType(struct.LIBMTP_mtpdevice_struct), pointer.uint16PtrPtr, pointer.uint16Ptr]],
    /**
     * LIBMTP_Get_Filetype_Description
     * @param {int}
     * @returns {string}
     */
    'LIBMTP_Get_Filetype_Description':
        ['string', [ 'int' ]],
    /**
     * LIBMTP_Get_Secure_Time
     * Crashes Samsung Galaxy S5.
     * @param {LIBMTP_mtpdevice_structPtr}
     * @param {stringPtr}
     * @returns {int}
     */
    'LIBMTP_Get_Secure_Time':
        ['int',[ref.refType(struct.LIBMTP_mtpdevice_struct), ref.refType('string') ]],
    /**
     * LIBMTP_Get_Device_Certificate
     * @param {LIBMTP_mtpdevice_structPtr}
     * @param {stringPtr}
     * @returns {int}
     */
    'LIBMTP_Get_Device_Certificate':
        ['int', [ref.refType(struct.LIBMTP_mtpdevice_struct), ref.refType('string')]],
    /**
     * LIBMTP_Release_Device
     * @param {LIBMTP_mtpdevice_structPtr}
     * @returns {void}
     */
    'LIBMTP_Release_Device':
        ['void', [ref.refType(struct.LIBMTP_mtpdevice_struct)]]
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