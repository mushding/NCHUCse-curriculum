import * as mysql from 'mysql';
import { mysql_config } from '../config/index';

import curriculum from './curriculum';

export const Pool = mysql.createPool(mysql_config);

Pool.getConnection((err, connection) => {
    if (err) console.log(err);
})

export default {
    curriculum
}