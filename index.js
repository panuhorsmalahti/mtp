"use strict";
/*jslint node:true */
/*jslint nomen: true */


/**
 * Requires
 */
var ffi = require("node-ffi");

var libmtp = new ffi.Library("./libmtp/src/libmtp.c", {

});