import { Pool } from './index';

String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

const select_website_curriculum = async (semester_year) => {
    return new Promise ((resolve, reject) => {
        Pool.query(`SELECT * FROM website_curriculum WHERE semester_year='${semester_year}'`, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_static_purpose = async (semester_year) => {
    return new Promise ((resolve, reject) => {
        Pool.query(`SELECT * FROM static_purpose WHERE semester_year='${semester_year}'`, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_temporary_purpose = async (semester_year) => {
    return new Promise ((resolve, reject) => {
        Pool.query(`SELECT * FROM temporary_purpose WHERE semester_year='${semester_year}' or semester_year='${String(Number(semester_year) - 1)}'`, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const select_temporary_purpose_by_week = async (semester_year) => {
    let today = new Date();
    let seven_days_later = new Date();
    seven_days_later.setDate(today.getDate() + 7);
    today = today.toISOString().split('T')[0];
    seven_days_later = seven_days_later.toISOString().split('T')[0];
    return new Promise ((resolve, reject) => {
        Pool.query(`SELECT * FROM temporary_purpose WHERE semester_year='${semester_year}' AND date >= '${today}' and date <= '${seven_days_later}'`, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const insert_website_curriculum = async (data) => {
    return new Promise((resolve, reject) => {
        let sql_str = "INSERT INTO website_curriculum(semester_year, semester_type, class_id, name, grade, week, start_time, end_time, classroom, teacher) SELECT '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}' FROM dual WHERE not exists (select * from website_curriculum where website_curriculum.semester_year = '{0}' and website_curriculum.semester_type = '{1}' and website_curriculum.class_id = '{2}');".format(data.semester_year, data.semester_type, data.class_id, data.name, data.grade, data.week, data.start_time, data.end_time, data.classroom, data.teacher);
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const insert_website_curriculum_manually = async (data) => {
    let week = new Date(data.startDate).getDay();
    // check if sunday
    if (week === 0)
        week = 7;

    let startTime = data.startDate.split("T")[1].slice(0, 5);
    let endTime = data.endDate.split("T")[1].slice(0, 5);
    return new Promise((resolve, reject) => {
        let title = data.title + "\n" + data.office;
        let sql_str = "INSERT INTO website_curriculum(semester_year, semester_type, class_id, name, grade, week, start_time, end_time, classroom, teacher) SELECT '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}' FROM dual WHERE not exists (select * from website_curriculum where website_curriculum.semester_year = '{0}' and website_curriculum.semester_type = '{1}' and website_curriculum.name = '{3}');".format(data.semester_year, data.semester_type, 0, title , '', week, startTime, endTime, data.classroom, '');
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const insert_static_purpose = async (data) => {
    let weekDate = new Date(data.startDate);
    let week = weekDate.getUTCDay();
    // check if sunday
    if (week === 0)
        week = 7;
    
    let startTime = data.startDate.split("T")[1].slice(0, 5);
    let endTime = data.endDate.split("T")[1].slice(0, 5);
    return new Promise((resolve, reject) => {
        let sql_str = "INSERT INTO static_purpose(semester_year, semester_type, name, office, week, start_time, end_time, classroom) SELECT '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}' FROM dual WHERE not exists (select * from static_purpose where static_purpose.classroom = '{6}' and static_purpose.week = '{7}' and static_purpose.start_time = '{8}' and static_purpose.end_time = '{9}');".format(data.semester_year, data.semester_type, data.title, data.office, week, startTime, endTime, data.classroom, data.classroom, week, startTime, endTime);
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const insert_temporary_purpose = async (data) => {
    let date = data.startDate.split("T")[0];
    let startDate = data.startDate.split("T")[1].slice(0, 5);
    let endDate = data.endDate.split("T")[1].slice(0, 5);
    let rRule = data.rRule ? data.rRule : '';
    let exDate = data.exDate ? data.exDate : '';
    return new Promise((resolve, reject) => {
        let sql_str = `INSERT INTO temporary_purpose(semester_year, semester_type, name, office, date, start_time, end_time, classroom, rRule, exDate) SELECT '${data.semester_year}','${data.semester_type}','${data.title}','${data.office}','${date}','${startDate}','${endDate}','${data.classroom}','${rRule}','${exDate}' FROM dual WHERE not exists (select * from temporary_purpose where temporary_purpose.classroom = '${data.classroom}' and temporary_purpose.date = '${date}' and temporary_purpose.start_time = '${startDate}' and temporary_purpose.end_time = '${endDate}');`
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const drop_website_curriculum = async (data) => {
    let id = data.id;
    return new Promise((resolve, reject) => {
        let sql_str = "DELETE FROM website_curriculum WHERE (`id` = '{0}');".format(id);
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

const drop_static_purpose = async (data) => {
    let id = data.id;
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

const drop_temporary_purpose = async (data) => {
    let id = data.id;
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

const update_website_curriculum = async (data) => {
    let weekDate = new Date(data.startDate);
    let week = weekDate.getUTCDay();

    // check if sunday
    if (week === 0)
        week = 7;
    
    let startTime = data.startDate.split("T")[1].slice(0, 5);
    let endTime = data.endDate.split("T")[1].slice(0, 5);

    data.title = data.title.split("\n")[0];
    let name = data.title + "\n" + data.office
    return new Promise((resolve, reject) => {
        let sql_str = `UPDATE website_curriculum SET semester_year='${data.semester_year}', semester_type='${data.semester_type}', name='${name}', week='${week}', start_time='${startTime}', end_time='${endTime}', classroom='${data.classroom}' WHERE id='${data.pkId}';`;
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

const update_static_purpose = async (data) => {
    let weekDate = new Date(data.startDate);
    let week = weekDate.getUTCDay();

    // check if sunday
    if (week === 0)
        week = 7;
    
    let startTime = data.startDate.split("T")[1].slice(0, 5);
    let endTime = data.endDate.split("T")[1].slice(0, 5);
    data.title = data.title.split("\n")[0];
    return new Promise((resolve, reject) => {
        let sql_str = `UPDATE static_purpose SET semester_year='${data.semester_year}', semester_type='${data.semester_type}', name='${data.title}', office='${data.office}', week='${week}', start_time='${startTime}', end_time='${endTime}', classroom='${data.classroom}' WHERE id='${data.pkId}';`;
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}
const update_temporary_purpose = async (data) => {
    let date = data.startDate.split("T")[0];
    let startDate = data.startDate.split("T")[1].slice(0, 5);
    let endDate = data.endDate.split("T")[1].slice(0, 5);
    data.title = data.title.split("\n")[0];
    return new Promise((resolve, reject) => {
        let sql_str = `UPDATE temporary_purpose SET semester_year='${data.semester_year}', semester_type='${data.semester_type}', name='${data.title}', office='${data.office}', date='${date}', start_time='${startDate}', end_time='${endDate}', classroom='${data.classroom}', rRule='${data.rRule}', exDate='${data.exDate}' WHERE id='${data.pkId}';`;
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}

// update start date DB
const update_curriculum_setting = async (data) => {
    return new Promise((resolve, reject) => {
        let sql_str = "UPDATE curriculum_setting SET semester_year='{0}', summer_date_month='{1}', summer_date_day='{2}', winter_date_month='{3}', winter_date_day='{4}';".format(data.semesterYear, data.summerDateMonth, data.summerDateDay, data.winterDateMonth, data.winterDateDay);
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log("change start date success");
            resolve(results);
        })
    }).catch(err => {
        console.log(err)
    })
}

// get start date DB
const select_curriculum_setting = async () => {
    return new Promise((resolve, reject) => {
        let sql_str = "select * from curriculum_setting";
        Pool.query(sql_str, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log("get start date success");
            resolve(results);
        })
    }).catch(err => {
        console.log(err)
    })
}

export default {
    select_website_curriculum,
    select_static_purpose,
    select_temporary_purpose,
    select_temporary_purpose_by_week,
    insert_website_curriculum,
    insert_website_curriculum_manually,
    insert_static_purpose,
    insert_temporary_purpose,
    drop_website_curriculum,
    drop_static_purpose,
    drop_temporary_purpose,
    update_curriculum_setting,
    select_curriculum_setting,
    update_website_curriculum,
    update_static_purpose,
    update_temporary_purpose
};