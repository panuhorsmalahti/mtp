"use strict";
/*jslint node:true */
/*jslint nomen: true */

/**
 * Requires
 */
var ffi = require('ffi');
var ref = require('ref');
var StructType = require('ref-struct');

/**
 * Pointers
 */
var intPtr = ref.refType('int');
var charPtr = ref.refType('char');

/**
 * Structs
 */
var LIBMTP_device_entry_struct = new StructType({
    vendor: charPtr,
    /**< The vendor of this device */
    vendor_id: 'uint16',
    /**< Vendor ID for this device */
    product: charPtr,
    /**< The product name of this device */
    product_id: 'uint16',
    /**< Product ID for this device */
    device_flags: 'uint32' /**< Bugs, device specifics etc */
});

var LIBMTP_raw_device_struct = StructType({
    'device_entry': LIBMTP_device_entry_struct,
    /**< The device entry for this raw device */
        'bus_location': 'uint32',
    /**< Location of the bus, if device available */
        'devnum': 'uint8' /**< Device number on the bus, if device available */
});

var LIBMTP_raw_device_structPtr = ref.refType(LIBMTP_raw_device_struct);
var LIBMTP_raw_device_structPtrPtr = ref.refType(LIBMTP_raw_device_structPtr);

/**
 * mtp definition
 */
var mtp = new ffi.Library('libmtp', {
    // 'Function name': [ 'return_type', [ 'param1', 'param2'] ]
    'LIBMTP_Init': ['void', [ ]],
    'LIBMTP_Set_Debug': ['void', ['int']],
    'LIBMTP_Detect_Raw_Devices': ['int', [LIBMTP_raw_device_structPtrPtr, intPtr]]
});

// Apply structs
mtp.LIBMTP_device_entry_struct = LIBMTP_device_entry_struct;
mtp.LIBMTP_raw_device_struct = LIBMTP_raw_device_struct;

// Apply pointers
mtp.LIBMTP_raw_device_structPtr = LIBMTP_raw_device_structPtr;
mtp.LIBMTP_raw_device_structPtrPtr = LIBMTP_raw_device_structPtrPtr;

/**
 * Constants
 */

// LIBMTP_Set_Debug
mtp.LIBMTP_DEBUG_NONE = 0x00;
mtp.LIBMTP_DEBUG_PTP = 0x01;
mtp.LIBMTP_DEBUG_PLST = 0x02;
mtp.LIBMTP_DEBUG_USB = 0x04;
mtp.LIBMTP_DEBUG_DATA = 0x08;
mtp.LIBMTP_DEBUG_ALL = 0xFF;

// LIBMTP_error_number_t
mtp.LIBMTP_ERROR_NONE = 0;
mtp.LIBMTP_ERROR_GENERAL = 1;
mtp.LIBMTP_ERROR_PTP_LAYER = 2;
mtp.LIBMTP_ERROR_USB_LAYER = 3;
mtp.LIBMTP_ERROR_MEMORY_ALLOCATION = 4;
mtp.LIBMTP_ERROR_NO_DEVICE_ATTACHED = 5;
mtp.LIBMTP_ERROR_STORAGE_FULL = 6;
mtp.LIBMTP_ERROR_CONNECTING = 7;
mtp.LIBMTP_ERROR_CANCELLED = 8;

module.exports = mtp;