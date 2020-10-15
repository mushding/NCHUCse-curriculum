import { Connection } from './index';

const select_website_curriculum_classroom = async (classroom) => {
    return new Promise ((resolve, reject) => {
        Connection.query('SELECT * FROM website_curriculum WHERE classroom = ' + classroom, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_static_purpose_classroom = async (classroom) => {
    return new Promise((resolve, reject) => {
        Connection.query('SELECT * FROM static_purpose WHERE classroom = ' + classroom, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_temporary_purpose_classroom = async (classroom) => {
    return new Promise((resolve, reject) => {
        Connection.query('SELECT * FROM temporary_purpose WHERE classroom = ' + classroom, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

export default {
    select_website_curriculum_classroom,
    select_static_purpose_classroom,
    select_temporary_purpose_classroom
};