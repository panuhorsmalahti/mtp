mtp
=========

Node.js wrapper for libmtp. In early stages of development.

See [API documentation](https://rawgit.com/panuhorsmalahti/mtp/master/doc/index.html).

You can find examples in the [test/](https://github.com/panuhorsmalahti/mtp/tree/master/test) folder.

Asynchronous calls
==================

All functions can be called asynchronously by using the .async() method. See [async.js example](https://github.com/panuhorsmalahti/mtp/blob/master/test/async.js).

```
mtp.LIBMTP_Detect_Raw_Devices.async(rawdevices, numrawdevices, function (err, res) {

});
``` 