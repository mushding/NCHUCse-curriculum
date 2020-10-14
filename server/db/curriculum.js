import { Connection } from './index';

const select_website_curriculum = async () => {
    return new Promise ((resolve, reject) => {
        Connection.query('SELECT * FROM website_curriculum', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

const select_static_purpose = async () => {
    return new Promise((resolve, reject) => {
        Connection.query('SELECT * FROM static_purpose', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_temporary_purpose = async () => {
    return new Promise((resolve, reject) => {
        Connection.query('SELECT * FROM temporary_purpose', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

export default {
    select_website_curriculum,
    select_static_purpose,
    select_temporary_purpose
};