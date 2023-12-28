import * as time from 'dayjs';

import utc = require('dayjs/plugin/utc');

time.extend(utc);

export { time };
