import { Pool } from './index';

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
        Pool.query('SELECT * FROM website_curriculum', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_static_curriculum = async () => {
    return new Promise ((resolve, reject) => {
        Pool.query('SELECT * FROM static_purpose', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_temporary_curriculum = async () => {
    return new Promise ((resolve, reject) => {
        Pool.query('SELECT * FROM temporary_purpose', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_website_curriculum_classroom = async (classroom, semester_year, semester_type) => {
    return new Promise ((resolve, reject) => {
        Pool.query('SELECT * FROM website_curriculum WHERE classroom = ' + classroom + " and semester_year = " + semester_year, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_static_purpose_classroom = async (classroom, semester_year, semester_type) => {
    return new Promise((resolve, reject) => {
        Pool.query('SELECT * FROM static_purpose WHERE classroom = ' + classroom + " and semester_year = " + semester_year, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_temporary_purpose_classroom = async (classroom, semester_year, semester_type) => {
    return new Promise((resolve, reject) => {
        Pool.query('SELECT * FROM temporary_purpose WHERE classroom = ' + classroom + " and semester_year = " + semester_year, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const insert_website_curriculum = async (data) => {
    return new Promise((resolve, reject) => {
        let sql_str = "INSERT INTO website_curriculum(semester_year, semester_type, class_id, name, grade, week, time, classroom, teacher) SELECT '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}' FROM dual WHERE not exists (select * from website_curriculum where website_curriculum.semester_year = '{0}' and website_curriculum.semester_type = '{1}' and website_curriculum.class_id = '{2}');".format(data.semester_year, data.semester_type, data.class_id, data.name, data.grade, data.week, data.time, data.classroom, data.teacher);
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log("insert success");
            resolve(results);
        })
    })
}

const insert_static_purpose = async (data) => {
    let week = new Date(data.startDate).getDay();
    // check if sunday
    if (week === 0)
        week = 7;
    
    let date = data.startDate.split("T")[0];
    let startDate = data.startDate.split("T")[1].slice(0, 5);
    let endDate = data.endDate.split("T")[1].slice(0, 5);
    return new Promise((resolve, reject) => {
        let sql_str = "INSERT INTO static_purpose(semester_year, semester_type, name, office, week, start_time, end_time, classroom) SELECT '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}' FROM dual WHERE not exists (select * from static_purpose where static_purpose.classroom = '{6}' and static_purpose.week = '{7}' and static_purpose.start_time = '{8}' and static_purpose.end_time = '{9}');".format(data.semester_year, data.semester_type, data.title, data.office, week, startDate, endDate, data.classroom, data.classroom, week, startDate, endDate);
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log("insert success");
            resolve(results);
        })
    })
}

const insert_temporary_purpose = async (data) => {
    let date = data.startDate.split("T")[0];
    let startDate = data.startDate.split("T")[1].slice(0, 5);
    let endDate = data.endDate.split("T")[1].slice(0, 5);
    return new Promise((resolve, reject) => {
        let sql_str = "INSERT INTO temporary_purpose(semester_year, semester_type, name, office, date, start_time, end_time, classroom) SELECT '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}' FROM dual WHERE not exists (select * from temporary_purpose where temporary_purpose.classroom = '{6}' and temporary_purpose.date = '{7}' and temporary_purpose.start_time = '{8}' and temporary_purpose.end_time = '{9}');".format(data.semester_year, data.semester_type, data.title, data.office, date, startDate, endDate, data.classroom, data.classroom, date, startDate, endDate);
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log("insert success");
            resolve(results);
        })
    })
}

const drop_static_purpose = async (id) => {
    return new Promise((resolve, reject) => {
        let sql_str = "DELETE FROM static_purpose WHERE (`id` = '{0}');".format(id);
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log("drop success");
            resolve(results);
        })
    }).catch(err => {
        console.log(err)
    })
}

const drop_temporary_purpose = async (id) => {
    return new Promise((resolve, reject) => {
        let sql_str = "DELETE FROM temporary_purpose WHERE (`id` = '{0}');".format(id);
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log("drop success");
            resolve(results);
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
    insert_website_curriculum,
    insert_static_purpose,
    insert_temporary_purpose
};