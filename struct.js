/*jslint node:true */
"use strict";

/**
 * Require
 */
var ref = require('ref');
var StructType = require('ref-struct');
var pointer = require('./pointer');

/**
 * Structs
 */

// Set all struct types to the struct object
var struct = {};

/**
 * A data structure to hold MTP device entries.
 */
struct.LIBMTP_device_entry_struct = new StructType({
    vendor: 'string',
    /**< The vendor of this device */
    vendor_id: 'uint16',
    /**< Vendor ID for this device */
    product: 'string',
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
    StorageDescription: pointer.charPtr,
    /**< A volume identifier */
    VolumeIdentifier: pointer.charPtr
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
    error_text: pointer.charPtr
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
    name: pointer.charPtr,
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
    params: pointer.voidPtr,
    /**
     * USB device for this device, must be cast into
     * \c (PTP_USB*) before internal use.
     */
    usbinfo: pointer.voidPtr,
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
    cd: pointer.voidPtr,
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
    filename: pointer.charPtr,
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
    u8vals: pointer.uint8Ptr,
    i8max: 'int8',
    i8min: 'int8',
    i8step: 'int8',
    i8vals: pointer.int8Ptr,
    u16max: 'uint16',
    u16min: 'uint16',
    u16step: 'uint16',
    u16vals: pointer.uint16Ptr,
    i16max: 'int16',
    i16min: 'int16',
    i16step: 'int16',
    i16vals: pointer.int16Ptr,
    u32max: 'uint32',
    u32min: 'uint32',
    u32step: 'uint32',
    u32vals: pointer.uint32Ptr,
    i32max: 'int32',
    i32min: 'int32',
    i32step: 'int32',
    i32vals: pointer.int32Ptr,
    u64max: 'uint64',
    u64min: 'uint64',
    u64step: 'uint64',
    u64vals: pointer.uint64Ptr,
    i64max: 'int64',
    i64min: 'int64',
    i64step: 'int64',
    i64vals: pointer.int64Ptr,
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
    name: pointer.charPtr,
    /**< The tracks in this playlist */
    tracks: pointer.uint32Ptr,
    /**< The number of tracks in this playlist */
    no_tracks: 'uint32'
    /**< Next playlist or NULL if last playlist */
    // LIBMTP_playlist_t *next; 
});
struct.LIBMTP_playlist_struct.defineProperty('next',
    ref.refType(struct.LIBMTP_playlist_struct));

/**
 * MTP Album structure
 */
struct.LIBMTP_album_struct = new StructType({
    /**< Unique playlist ID */
    album_id: 'uint32',
    /**< ID of parent folder */
    parent_id: 'uint32',
    /**< ID of storage holding this album */
    storage_id: 'uint32',
    /**< Name of album */
    name: pointer.charPtr,
    /**< Name of album artist */
    artist: pointer.charPtr,
    /**< Name of recording composer */
    composer: pointer.charPtr,
    /**< Genre of album */
    genre: pointer.charPtr,
    /**< The tracks in this album */
    tracks: pointer.uint32Ptr,
    /**< The number of tracks in this album */
    no_tracks: 'uint32'
    /**< Next album or NULL if last album */
    // LIBMTP_album_t *next;
});
struct.LIBMTP_album_struct.defineProperty('next',
    ref.refType(struct.LIBMTP_album_struct));

/**
 * MTP Folder structure
 */
struct.LIBMTP_folder_struct = new StructType({
    /**< Unique folder ID */
    folder_id: 'uint32',
    /**< ID of parent folder */
    parent_id: 'uint32',
    /**< ID of storage holding this folder */
    storage_id: 'uint32',
    /**< Name of folder */
    name: pointer.charPtr
    /**< Next folder at same level or NULL if no more */
    // LIBMTP_folder_t *sibling; 
    /**< Child folder or NULL if no children */
    // LIBMTP_folder_t *child;
});
struct.LIBMTP_folder_struct.defineProperty('sibling',
    ref.refType(struct.LIBMTP_folder_struct));
struct.LIBMTP_folder_struct.defineProperty('child',
    ref.refType(struct.LIBMTP_folder_struct));

/**
 * LIBMTP Object RepresentativeSampleData Structure
 */
struct.LIBMTP_filesampledata_struct = new StructType({
    /**< Width of sample if it is an image */
    width: 'uint32',
    /**< Height of sample if it is an image */
    height: 'uint32',
    /**< Duration in milliseconds if it is audio */
    duration: 'uint32',
    /**< LIBMTP_filetype_t Filetype used for the sample */
    filetype: 'int',
    /**< Size of sample data in bytes */
    size: 'uint64',
    /**< Sample data */
    data: pointer.charPtr
});

module.exports = struct;