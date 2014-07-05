/*jslint node:true */
'use strict';
var mtp = require('../index.js');
var ref = require('ref');

// Init
mtp.LIBMTP_Init();

// Set debug
// mtp.LIBMTP_Set_Debug(mtp.LIBMTP_DEBUG_PTP | mtp.LIBMTP_DEBUG_DATA);

// Read raw devices
var numrawdevices = ref.alloc('int'),
    rawdevices = ref.alloc(mtp.LIBMTP_raw_device_structPtr),
    rawdevice,
    err = mtp.LIBMTP_Detect_Raw_Devices(rawdevices, numrawdevices),
    device,
    i;
numrawdevices = numrawdevices.deref();

switch (err) {
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
        for (i = 0; i < numrawdevices; i++) {
            // Moving the buffer position to the device indexed by i in the array of raw_devices
            rawdevice = ref.reinterpret(rawdevices.deref(), numrawdevices * mtp.LIBMTP_raw_device_struct.size,
                        mtp.LIBMTP_raw_device_struct.size * i);
            // Type must be set after reinterpret
            rawdevice.type = mtp.LIBMTP_raw_device_struct;
            // Creating a device struct object from the rawdevice buffer
            device = new mtp.LIBMTP_raw_device_struct(rawdevice);
            if (device.device_entry.vendor || device.device_entry.product) {
                console.log(device.device_entry.vendor + ': ' +
                    device.device_entry.product + ' (' +
                    device.device_entry.vendor_id.toString(16) + ':' +
                    device.device_entry.product_id.toString(16) + ') bus ' +
                    device.bus_location + ', dev ' +
                    device.devnum);
            } else {
                console.log(device.device_entry.vendor_id.toString(16) + ':' +
                    device.device_entry.product_id.toString(16) + ' bus ' +
                    device.bus_location + ', dev ' +
                    device.devnum);
            }
        }

        console.log('Attempting to connect device(s)');

        for (i = 0; i < numrawdevices; i++) {
            (function() {
                console.log('Opening device ' + i);
                var files = ref.alloc(mtp.LIBMTP_file_struct),
                    friendlyname = ref.alloc('char'),
                    syncpartner = ref.alloc('char'),
                    sectime = ref.alloc('char'),
                    devcert = ref.alloc('char'),
                    filetypes = ref.alloc('uint16'),
                    filetypes_len,
                    maxbattlevel,
                    currbattlevel,
                    ret;

                // Open a connection to the device
                var openDevice = mtp.LIBMTP_Open_Raw_Device(rawdevice);

                if (!openDevice) {
                    console.error('Unable to open raw device');
                    return;
                }

                mtp.LIBMTP_Dump_Errorstack(openDevice);
                mtp.LIBMTP_Clear_Errorstack(openDevice);
                // Commented out to prevent too many lines printd to the standard output
                // mtp.LIBMTP_Dump_Device_Info(openDevice);

                console.log('MTP-specific device properties:');
                // The friendly name
                var friendlyname = mtp.LIBMTP_Get_Friendlyname(openDevice);
                if (!friendlyname) {
                    console.log('   Friendly name: (NULL)');
                } else {
                    console.log('   Friendly name: ' + friendlyname);
                }

                // Sync partner
                var syncpartner = mtp.LIBMTP_Get_Syncpartner(openDevice);
                if (!syncpartner) {
                    console.log('   Synchronization partner: (NULL)');
                } else {
                    console.log('   Synchronization partner: ' + friendlyname);
                }

                // Some battery info
                var maxbattlevel = ref.alloc('uint8'),
                    currbattlevel = ref.alloc('uint8'),
                    ret = mtp.LIBMTP_Get_Batterylevel(openDevice, maxbattlevel, currbattlevel);
                if (ret === 0) {
                    maxbattlevel = maxbattlevel.deref();
                    currbattlevel = currbattlevel.deref();
                    console.log('   Battery level ' + currbattlevel + ' of ' + maxbattlevel + ' (' +
                        (currbattlevel/maxbattlevel * 100) + '%)');
                } else {
                    // Silently ignore. Some devices does not support getting the
                    // battery level.
                    mtp.LIBMTP_Clear_Errorstack(openDevice);
                }

                // Print support file types
                var filetypes = ref.alloc(ref.refType('uint16')),
                    filetypes_len = ref.alloc('uint16');
                ret = mtp.LIBMTP_Get_Supported_Filetypes(openDevice, filetypes, filetypes_len);
                if (ret === 0) {
                    console.log("libmtp supported (playable) filetypes:");
                    var filetypes_all;
                    
                    for (var t = 0; t < filetypes_len.deref(); t++) {
                        // Reinterpet returns a new buffer pointing to the correct offset in the filetypes array
                        filetypes_all = ref.reinterpret(filetypes.deref(), filetypes_len.deref(), mtp.uint16Ptr.size * t);
                        // Type must be manually set after ref.reinterpret
                        filetypes_all.type = 'uint16';
                        console.log("   " + mtp.LIBMTP_Get_Filetype_Description(filetypes_all.deref()));
                    }
                } else {
                    LIBMTP_Dump_Errorstack(openDevice);
                    LIBMTP_Clear_Errorstack(openDevice);
                }

                // Secure time XML fragment
                // Known bug: segfaults on Galaxy S5, commented out
                /* var sectime = ref.alloc('string');
                ret = mtp.LIBMTP_Get_Secure_Time(openDevice, sectime);
                if (ret === 0 && sectime) {
                  console.log("Secure Time: " + sectime.deref());
                } else {
                  // Silently ignore - there may be devices not supporting secure time.
                  mtp.LIBMTP_Clear_Errorstack(openDevice);
                } */

                /*
                 * This code is currently disabled: all devices say that
                 * they support getting a device certificate but a lot of
                 * them obviously doesn't, instead they crash when you try
                 * to obtain it.
                 */
                /* var devcert = ref.alloc('string');
                ret = mtp.LIBMTP_Get_Device_Certificate(openDevice, devcert);
                if (ret === 0 && devcert) {
                  console.log("Device Certificate: " + devcert.deref());
                } else {
                  console.log("Unable to acquire device certificate, perhaps this device " +
                      "does not support this");
                  LIBMTP_Dump_Errorstack(openDevice);
                  LIBMTP_Clear_Errorstack(openDevice);
                } */

                // Try to get Media player device info XML file...
                var totalProgress = 0;
                var progressFunc = function (sent, total, data) {
                    if ((sent/total) - totalProgress > 0.20) {
                        console.log('Filelist progress ' + Math.round(sent/total * 100) + '%');
                        totalProgress = sent/total;
                    }
                    // if anything else than 0 is returned, the current transfer will be interrupted / cancelled.
                    return 0;
                };

                files = mtp.LIBMTP_Get_Filelisting_With_Callback(openDevice, progressFunc, null);
                while (files) {
                    var file = files.deref();
                    if (file.filename === 'WMPInfo.xml' ||
                        file.filename === 'WMPinfo.xml' ||
                        file.filename === 'default-capabilities.xml') {
                        if (file.item_id !== 0) {
                            
                        }
                    }
                    files = file.next;
                }

                // Release device
                mtp.LIBMTP_Release_Device(openDevice);
            })();
        }

        console.log("Ok.");
        break;
}