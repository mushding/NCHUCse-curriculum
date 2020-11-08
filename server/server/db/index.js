import * as mysql from 'mysql';
import config from '../config/index';

import curriculum from './curriculum';

export const Pool = mysql.createPool(config.mysql);

Pool.getConnection((err, connection) => {
    if (err) console.log(err);
})

export default {
    curriculum
}