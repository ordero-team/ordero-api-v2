import * as time from 'dayjs';

import utc = require('dayjs/plugin/utc');
import timezone = require('dayjs/plugin/timezone');

time.extend(utc);
time.extend(timezone);

export { time };
