import * as mysql from 'mysql';
import config from '../config/index';

import curriculum from './curriculum';

export const Connection = mysql.createConnection(config.mysql)

Connection.connect(err => {
    if (err) console.log(err);
})

export default {
    curriculum
}