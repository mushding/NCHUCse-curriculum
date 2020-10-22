import { Connection } from './index';

String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

const select_website_curriculum = async () => {
    return new Promise ((resolve, reject) => {
        Connection.query('SELECT * FROM website_curriculum', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_static_curriculum = async () => {
    return new Promise ((resolve, reject) => {
        Connection.query('SELECT * FROM static_purpose', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_temporary_curriculum = async () => {
    return new Promise ((resolve, reject) => {
        Connection.query('SELECT * FROM temporary_purpose', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

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

const insert_static_purpose_classroom = async (data) => {
    let week = new Date(data.startDate).getDay();
    // check if sunday
    if (week === 0)
        week = 7;
    
    let date = data.startDate.split("T")[0];
    let startDate = data.startDate.split("T")[1].slice(0, 5);
    let endDate = data.endDate.split("T")[1].slice(0, 5);
    return new Promise((resolve, reject) => {
        let sql_str = "INSERT INTO static_purpose(name, office, week, start_time, end_time, classroom) SELECT '{0}','{1}','{2}','{3}','{4}','{5}' FROM dual WHERE not exists (select * from static_purpose where static_purpose.classroom = '{6}' and static_purpose.week = '{7}' and static_purpose.start_time = '{8}' and static_purpose.end_time = '{9}');".format(data.title, data.office, week, startDate, endDate, data.classroom, data.classroom, week, startDate, endDate);
        Connection.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log("insert success");
        })
    })
}

const insert_temporary_purpose_classroom = async (data) => {
    let date = data.startDate.split("T")[0];
    let startDate = data.startDate.split("T")[1].slice(0, 5);
    let endDate = data.endDate.split("T")[1].slice(0, 5);
    return new Promise((resolve, reject) => {
        let sql_str = "INSERT INTO temporary_purpose(name, office, date, start_time, end_time, classroom) SELECT '{0}','{1}','{2}','{3}','{4}','{5}' FROM dual WHERE not exists (select * from temporary_purpose where temporary_purpose.classroom = '{6}' and temporary_purpose.date = '{7}' and temporary_purpose.start_time = '{8}' and temporary_purpose.end_time = '{9}');".format(data.title, data.office, date, startDate, endDate, data.classroom, data.classroom, date, startDate, endDate);
        Connection.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log("insert success");
        })
    })
}

const drop_static_purpose_classroom = async (id) => {
    return new Promise((resolve, reject) => {
        let sql_str = "DELETE FROM static_purpose WHERE (`id` = '{0}');".format(id);
        Connection.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log("drop success");
        })
    }).catch(err => {
        console.log(err)
    })
}

const drop_temporary_purpose_classroom = async (id) => {
    return new Promise((resolve, reject) => {
        let sql_str = "DELETE FROM temporary_purpose WHERE (`id` = '{0}');".format(id);
        Connection.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log("drop success");
        })
    }).catch(err => {
        console.log(err)
    })
}

export default {
    select_website_curriculum,
    select_static_curriculum,
    select_temporary_curriculum,
    select_website_curriculum_classroom,
    select_static_purpose_classroom,
    select_temporary_purpose_classroom,
    insert_static_purpose_classroom,
    insert_temporary_purpose_classroom
};