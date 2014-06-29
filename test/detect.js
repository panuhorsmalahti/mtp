var mtp = require('../index.js');
var ref = require('ref');

// Init
mtp.LIBMTP_Init();

// Set debug
// mtp.LIBMTP_Set_Debug(mtp.LIBMTP_DEBUG_PTP | mtp.LIBMTP_DEBUG_DATA);

// Read raw devices
var numrawdevices = ref.alloc('int');
var rawdevices = ref.alloc(mtp.LIBMTP_raw_device_structPtr);

var err = mtp.LIBMTP_Detect_Raw_Devices(rawdevices, numrawdevices);
numrawdevices = numrawdevices.deref();
var device;
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
        for (var i = 0; i < numrawdevices; i++) {
            // Deferencing twice because it's a Ptr
            device = rawdevices.deref().deref();
            if (device.device_entry.vendor || device.device_entry.product) {
                console.log(device.device_entry.vendor.readCString(0) + ': ' +
                    device.device_entry.product.readCString(0) + ' (' +
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

        var openDevice = mtp.LIBMTP_Open_Raw_Device(rawdevices.deref());
        if (!openDevice) {
          console.error('Unable to open raw device');
        }

        break;
};