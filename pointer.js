/*jslint node:true */
"use strict";

/**
 * Require
 */
var ref = require('ref');

/**
 * Pointers
 */

var pointer = {};

// Basic types
pointer.intPtr = ref.refType('int');
pointer.charPtr = ref.refType('char');
pointer.voidPtr = ref.refType('void');

pointer.int8Ptr = ref.refType('int8');
pointer.uint8Ptr = ref.refType('uint8');
pointer.int16Ptr = ref.refType('int16');
pointer.uint16Ptr = ref.refType('uint16');
pointer.int32Ptr = ref.refType('int32');
pointer.uint32Ptr = ref.refType('uint32');
pointer.int64Ptr = ref.refType('int64');
pointer.uint64Ptr = ref.refType('uint64');

module.exports = pointer;