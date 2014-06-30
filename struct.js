/*jslint node:true */
/*jslint nomen: true */
"use strict";

var ref = require('ref');
var StructType = require('ref-struct');

/**
 * Structs
 */

// Set all struct types to the struct object
var struct = {};

// Basic types
// TODO: Move to a shared pointers module
var intPtr = ref.refType('int');
var charPtr = ref.refType('char');
var voidPtr = ref.refType('void');

var int8Ptr = ref.refType('int8');
var uint8Ptr = ref.refType('uint8');
var int16Ptr = ref.refType('int16');
var uint16Ptr = ref.refType('uint16');
var int32Ptr = ref.refType('int32');
var uint32Ptr = ref.refType('uint32');
var int64Ptr = ref.refType('int64');
var uint64Ptr = ref.refType('uint64');

/**
 * A data structure to hold MTP device entries.
 */
struct.LIBMTP_device_entry_struct = new StructType({
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
struct.LIBMTP_raw_device_struct = new StructType({
    'device_entry': struct.LIBMTP_device_entry_struct,
    /**< The device entry for this raw device */
    'bus_location': 'uint32',
    /**< Location of the bus, if device available */
    'devnum': 'uint8' /**< Device number on the bus, if device available */
});

/**
 * LIBMTP Device Storage structure
 */
struct.LIBMTP_devicestorage_struct = new StructType({
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
struct.LIBMTP_devicestorage_struct.defineProperty('next',
    ref.refType(struct.LIBMTP_devicestorage_struct));
struct.LIBMTP_devicestorage_struct.defineProperty('prev',
    ref.refType(struct.LIBMTP_devicestorage_struct));

/**
 * A data structure to hold errors from the library.
 */
struct.LIBMTP_error_struct = new StructType({
    errornumber: 'int',
    error_text: charPtr
    // next: ref.refType(LIBMTP_error_struct)
});
struct.LIBMTP_error_struct.defineProperty('next',
    ref.refType(struct.LIBMTP_error_struct));

/**
 * MTP device extension holder struct
 */
struct.LIBMTP_device_extension_struct = new StructType({
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
struct.LIBMTP_device_extension_struct.defineProperty('next',
    ref.refType(struct.LIBMTP_device_extension_struct));

/**
 * Main MTP device object struct
 */
struct.LIBMTP_mtpdevice_struct = new StructType({
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
    storage: ref.refType(struct.LIBMTP_devicestorage_struct),
    /**
     * The error stack. This shall be handled using the error getting
     * and clearing functions, not by dereferencing this list.
     */
    errorstack: ref.refType(struct.LIBMTP_error_struct),
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
    extensions: ref.refType(struct.LIBMTP_device_extension_struct),
    /** Whether the device uses caching, only used internally */
    cached: 'int'

    /** Pointer to next device in linked list; NULL if this is the last device */
    // next: ref.refType(LIBMTP_mtpdevice_struct)
});
struct.LIBMTP_mtpdevice_struct.defineProperty('next',
    ref.refType(struct.LIBMTP_mtpdevice_struct));

/**
 * MTP file struct
 */
struct.LIBMTP_file_struct = new StructType({
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
struct.LIBMTP_file_struct.defineProperty('next',
    ref.refType(struct.LIBMTP_file_struct));

/**
 * A data structure to hold allowed ranges of values
 */
struct.LIBMTP_allowed_values_struct = new StructType({
    u8max: 'uint8',
    u8min: 'uint8',
    u8step: 'uint8',
    u8vals: uint8Ptr,
    i8max: 'int8',
    i8min: 'int8',
    i8step: 'int8',
    i8vals: int8Ptr,
    u16max: 'uint16',
    u16min: 'uint16',
    u16step: 'uint16',
    u16vals: uint16Ptr,
    i16max: 'int16',
    i16min: 'int16',
    i16step: 'int16',
    i16vals: int16Ptr,
    u32max: 'uint32',
    u32min: 'uint32',
    u32step: 'uint32',
    u32vals: uint32Ptr,
    i32max: 'int32',
    i32min: 'int32',
    i32step: 'int32',
    i32vals: int32Ptr,
    u64max: 'uint64',
    u64min: 'uint64',
    u64step: 'uint64',
    u64vals: uint64Ptr,
    i64max: 'int64',
    i64min: 'int64',
    i64step: 'int64',
    i64vals: int64Ptr,
    /**
    * Number of entries in the vals array
    */
    num_entries: 'int16',
    /**
    * The datatype specifying which of the above is used.
    * LIBMTP_datatype_t
    */
    datatype: 'int',
    /**
    * Non zero for range, 0 for enum
    */
    is_range: 'int'
});

/**
 * MTP Playlist structure
 */
struct.LIBMTP_playlist_struct = new StructType({
    /**< Unique playlist ID */
    playlist_id: 'uint32',
    /**< ID of parent folder */
    parent_id: 'uint32',
    /**< ID of storage holding this playlist */
    storage_id: 'uint32',
    /**< Name of playlist */
    name: charPtr,
    /**< The tracks in this playlist */
    tracks: uint32Ptr,
    /**< The number of tracks in this playlist */
    no_tracks: 'uint32'
    /**< Next playlist or NULL if last playlist */
    // LIBMTP_playlist_t *next; 
});
struct.LIBMTP_playlist_struct.defineProperty('next',
    ref.refType(struct.LIBMTP_playlist_struct));

module.exports = struct;