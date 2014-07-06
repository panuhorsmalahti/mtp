// Async example
/*jslint node:true */
'use strict';
var mtp = require('../index.js');
var ref = require('ref');

// Init
mtp.LIBMTP_Init();

// Read raw devices
var numrawdevices = ref.alloc('int'),
    rawdevices = ref.alloc(mtp.LIBMTP_raw_device_structPtr),
    rawdevice,
    device;

mtp.LIBMTP_Detect_Raw_Devices.async(rawdevices, numrawdevices, function (err, res) {
    numrawdevices = numrawdevices.deref();

    switch (res) {
        case mtp.LIBMTP_ERROR_NO_DEVICE_ATTACHED:
            console.log('No raw devices found.');
            break;
        case mtp.LIBMTP_ERROR_CONNECTING:
            console.log('Detect: There has been an error connecting. Exiting.');
            break;
        case mtp.LIBMTP_ERROR_MEMORY_ALLOCATION:
            console.log('Detect: Encountered a Memory Allocation Error. Exiting.');
            break;
        case mtp.LIBMTP_ERROR_NONE:
            console.log('Found ' + numrawdevices + ' devices');
            break;
    }
});
