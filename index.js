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
var voidPtr = ref.refType('void');

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

var LIBMTP_raw_device_struct = new StructType({
    'device_entry': LIBMTP_device_entry_struct,
    /**< The device entry for this raw device */
    'bus_location': 'uint32',
    /**< Location of the bus, if device available */
    'devnum': 'uint8' /**< Device number on the bus, if device available */
});

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

var LIBMTP_error_struct = new StructType({
  errornumber: 'int',
  error_text: charPtr
  // next: ref.refType(LIBMTP_error_struct)
});
LIBMTP_error_struct.defineProperty('next',
    ref.refType(LIBMTP_error_struct));

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
  filetype: 'int',
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
    'LIBMTP_Init': ['void', [] ],
    'LIBMTP_Set_Debug': ['void', ['int']],
    'LIBMTP_Detect_Raw_Devices': ['int', [LIBMTP_raw_device_structPtrPtr, intPtr]],
    'LIBMTP_Open_Raw_Device': [ ref.refType(LIBMTP_mtpdevice_struct), [LIBMTP_raw_device_structPtr]]
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

// LIBMTP_filetype_t
mtp.LIBMTP_FILETYPE_FOLDER = 0;
mtp.LIBMTP_FILETYPE_WAV = 1;
mtp.LIBMTP_FILETYPE_MP3 = 2;
mtp.LIBMTP_FILETYPE_WMA = 3;
mtp.LIBMTP_FILETYPE_OGG = 4;
mtp.LIBMTP_FILETYPE_AUDIBLE = 5;
mtp.LIBMTP_FILETYPE_MP4 = 6;
mtp.LIBMTP_FILETYPE_UNDEF_AUDIO = 7;
mtp.LIBMTP_FILETYPE_WMV = 8;
mtp.LIBMTP_FILETYPE_AVI = 9;
mtp.LIBMTP_FILETYPE_MPEG = 10;
mtp.LIBMTP_FILETYPE_ASF = 11;
mtp.LIBMTP_FILETYPE_QT = 12;
mtp.LIBMTP_FILETYPE_UNDEF_VIDEO = 13;
mtp.LIBMTP_FILETYPE_JPEG = 14;
mtp.LIBMTP_FILETYPE_JFIF = 15;
mtp.LIBMTP_FILETYPE_TIFF = 16;
mtp.LIBMTP_FILETYPE_BMP = 17;
mtp.LIBMTP_FILETYPE_GIF = 18;
mtp.LIBMTP_FILETYPE_PICT = 19;
mtp.LIBMTP_FILETYPE_PNG = 20;
mtp.LIBMTP_FILETYPE_VCALENDAR1 = 21;
mtp.LIBMTP_FILETYPE_VCALENDAR2 = 22;
mtp.LIBMTP_FILETYPE_VCARD2 = 23;
mtp.LIBMTP_FILETYPE_VCARD3 = 24;
mtp.LIBMTP_FILETYPE_WINDOWSIMAGEFORMAT = 25;
mtp.LIBMTP_FILETYPE_WINEXEC = 26;
mtp.LIBMTP_FILETYPE_TEXT = 27;
mtp.LIBMTP_FILETYPE_HTML = 28;
mtp.LIBMTP_FILETYPE_FIRMWARE = 29;
mtp.LIBMTP_FILETYPE_AAC = 30;
mtp.LIBMTP_FILETYPE_MEDIACARD = 31;
mtp.LIBMTP_FILETYPE_FLAC = 32;
mtp.LIBMTP_FILETYPE_MP2 = 33;
mtp.LIBMTP_FILETYPE_M4A = 34;
mtp.LIBMTP_FILETYPE_DOC = 35;
mtp.LIBMTP_FILETYPE_XML = 36;
mtp.LIBMTP_FILETYPE_XLS = 37;
mtp.LIBMTP_FILETYPE_PPT = 38;
mtp.LIBMTP_FILETYPE_MHT = 39;
mtp.LIBMTP_FILETYPE_JP2 = 40;
mtp.LIBMTP_FILETYPE_JPX = 41;
mtp.LIBMTP_FILETYPE_ALBUM = 42;
mtp.LIBMTP_FILETYPE_PLAYLIST = 43;
mtp.LIBMTP_FILETYPE_UNKNOWN = 44;

module.exports = mtp;