var mtp = require('../index.js');

// Init
mtp.LIBMTP_Init();

// Set debug
mtp.LIBMTP_Set_Debug(mtp.LIBMTP_DEBUG_PTP | mtp.LIBMTP_DEBUG_DATA);