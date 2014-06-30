/*jslint node:true */
/*jslint nomen: true */
"use strict";

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
var voidPtr = ref.refType('void');

/**
 * Structs
 */

/**
 * A data structure to hold MTP device entries.
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

/**
 * A data structure to hold a raw MTP device connected
 * to the bus.
 */
var LIBMTP_raw_device_struct = new StructType({
    'device_entry': LIBMTP_device_entry_struct,
    /**< The device entry for this raw device */
    'bus_location': 'uint32',
    /**< Location of the bus, if device available */
    'devnum': 'uint8' /**< Device number on the bus, if device available */
});

/**
 * LIBMTP Device Storage structure
 */
var LIBMTP_devicestorage_struct = new StructType({
    /**< Unique ID for this storage */
    id: 'uint32',
    /**< Storage type */
    StorageType: 'uint16',
    /**< Filesystem type */
    FilesystemType: 'uint16',
    /**< Access capability */
    AccessCapability: 'uint16',
    /**< Maximum capability */
    MaxCapacity: 'uint64',
    /**< Free space in bytes */
    FreeSpaceInBytes: 'uint64',
    /**< Free space in objects */
    FreeSpaceInObjects: 'uint64',
    /**< A brief description of this storage */
    StorageDescription: charPtr,
    /**< A volume identifier */
    VolumeIdentifier: charPtr
    /**< Next storage, follow this link until NULL */
    // next: ref.refType(LIBMTP_devicestorage_struct),
    /**< Previous storage */
    // prev: ref.refType(LIBMTP_devicestorage_struct)
});
LIBMTP_devicestorage_struct.defineProperty('next',
    ref.refType(LIBMTP_devicestorage_struct));
LIBMTP_devicestorage_struct.defineProperty('prev',
    ref.refType(LIBMTP_devicestorage_struct));

/**
 * A data structure to hold errors from the library.
 */
var LIBMTP_error_struct = new StructType({
    errornumber: 'int',
    error_text: charPtr
    // next: ref.refType(LIBMTP_error_struct)
});
LIBMTP_error_struct.defineProperty('next',
    ref.refType(LIBMTP_error_struct));

/**
 * MTP device extension holder struct
 */
var LIBMTP_device_extension_struct = new StructType({
    /**
     * Name of extension e.g. "foo.com"
     */
    name: charPtr,
    /**
     * Major revision of extension
     */
    major: 'int',
    /**
     * Minor revision of extension
     */
    minor: 'int'
    /**
     * Pointer to the next extension or NULL if this is the
     * last extension.
     */
    // next: ref.refType(LIBMTP_device_extension_struct)
});
LIBMTP_device_extension_struct.defineProperty('next',
    ref.refType(LIBMTP_device_extension_struct));

/**
 * Main MTP device object struct
 */
var LIBMTP_mtpdevice_struct = new StructType({
    /**
     * Object bitsize, typically 32 or 64.
     */
    object_bitsize: 'uint8',
    /**
     * Parameters for this device, must be cast into
     * \c (PTPParams*) before internal use.
     */
    params: voidPtr,
    /**
     * USB device for this device, must be cast into
     * \c (PTP_USB*) before internal use.
     */
    usbinfo: voidPtr,
    /**
     * The storage for this device, do not use strings in here without
     * copying them first, and beware that this list may be rebuilt at
     * any time.
     * @see LIBMTP_Get_Storage()
     */
    storage: ref.refType(LIBMTP_devicestorage_struct),
    /**
     * The error stack. This shall be handled using the error getting
     * and clearing functions, not by dereferencing this list.
     */
    errorstack: ref.refType(LIBMTP_error_struct),
    /** The maximum battery level for this device */
    maximum_battery_level: 'uint8',
    /** Default music folder */
    default_music_folder: 'uint32',
    /** Default playlist folder */
    default_playlist_folder: 'uint32',
    /** Default picture folder */
    default_picture_folder: 'uint32',
    /** Default video folder */
    default_video_folder: 'uint32',
    /** Default organizer folder */
    default_organizer_folder: 'uint32',
    /** Default ZENcast folder (only Creative devices...) */
    default_zencast_folder: 'uint32',
    /** Default Album folder */
    default_album_folder: 'uint32',
    /** Default Text folder */
    default_text_folder: 'uint32',
    /** Per device iconv() converters, only used internally */
    cd: voidPtr,
    /** Extension list */
    extensions: ref.refType(LIBMTP_device_extension_struct),
    /** Whether the device uses caching, only used internally */
    cached: 'int'

    /** Pointer to next device in linked list; NULL if this is the last device */
    // next: ref.refType(LIBMTP_mtpdevice_struct)
});
LIBMTP_mtpdevice_struct.defineProperty('next',
    ref.refType(LIBMTP_mtpdevice_struct));

/**
 * MTP file struct
 */
var LIBMTP_file_struct = new StructType({
    /**< Unique item ID */
    item_id: 'uint32',
    /**< ID of parent folder */
    parent_id: 'uint32',
    /**< ID of storage holding this file */
    storage_id: 'uint32',
    /**< Filename of this file */
    filename: charPtr,
    /**< Size of file in bytes */
    filesize: 'uint64',
    /**< Date of last alteration of the file */
    modificationdate: 'long',
    /**< LIBMTP_filetype_t Filetype used for the current file */
    filetype: 'int'
    /**< Next file in list or NULL if last file */
    // LIBMTP_file_t *next;
});
LIBMTP_file_struct.defineProperty('next',
    ref.refType(LIBMTP_file_struct));

var LIBMTP_raw_device_structPtr = ref.refType(LIBMTP_raw_device_struct);
var LIBMTP_raw_device_structPtrPtr = ref.refType(LIBMTP_raw_device_structPtr);

/**
 * mtp definition
 */
var mtp = new ffi.Library('libmtp', {
    // 'Function name': [ 'return_type', [ 'param1', 'param2'] ]
    'LIBMTP_Init': ['void', []],
    'LIBMTP_Set_Debug': ['void', ['int']],
    'LIBMTP_Detect_Raw_Devices': ['int', [LIBMTP_raw_device_structPtrPtr, intPtr]],
    'LIBMTP_Open_Raw_Device': [ref.refType(LIBMTP_mtpdevice_struct), [LIBMTP_raw_device_structPtr]]
});

// Apply structs
mtp.LIBMTP_device_entry_struct = LIBMTP_device_entry_struct;
mtp.LIBMTP_raw_device_struct = LIBMTP_raw_device_struct;

// Apply pointers
mtp.LIBMTP_raw_device_structPtr = LIBMTP_raw_device_structPtr;
mtp.LIBMTP_raw_device_structPtrPtr = LIBMTP_raw_device_structPtrPtr;

// Constants
require('./constants')(mtp);

module.exports = mtp;