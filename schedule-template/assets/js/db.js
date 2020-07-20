(async function(){
  var global_room = "821"
  var global_date = new Date()
  var dd = String(global_date.getDate()).padStart(2, '0');
  var mm = String(global_date.getMonth() + 1).padStart(2, '0');
  var yyyy = global_date.getFullYear();
  var initSqlJs = window.initSqlJs;
  const weekname = {
    "1": "monday",
    "2": "tuesday",
    "3": "wednesday",
    "4": "thursday",
    "5": "friday",
  }
  const timestamps = {
    "1": 8,
    "2": 9,
    "3": 10,
    "4": 11,
    "5": 13,
    "6": 14,
    "7": 15,
    "8": 16,
    "9": 17,
    "10": 18,
    "11": 19,
    "12": 20,
    "13": 21,
    "14": 22,
  }
  function get_week(year, month, date) {
    const today = new Date(year, month - 1, date);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  
  function define_class_time(times){
    if (times[0] == times.slice(times.length - 1)){
      return [String(timestamps[times[0]]) + ":00", String(timestamps[times[0]] + 1) + ":00"]
    }
    return [String(timestamps[times[0]]) + ":00", String(timestamps[times.slice(times.length - 1)] + 1 + ":00")]
  }

  function get_month_date(day){
    var dd = String(day.getDate()).padStart(2, '0');
    var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 0!
    return [mm, dd]
  }

  function fetch_school_db(room){
    initSqlJs().then(function(SQL){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'curriculum.db', true);
      xhr.responseType = 'arraybuffer';
    
      xhr.onload = e => {
        var uInt8Array = new Uint8Array(xhr.response);
        var db = new SQL.Database(uInt8Array);
        var contents = db.exec("SELECT * FROM curriculum");
        for (i = 0; i < contents[0]["values"].length; i++){
          if (contents[0]["values"][i][5] == room){
            var time_section = define_class_time(contents[0]["values"][i][4])
            add_to_schedule(contents[0]["values"][i], time_section)
          }
        }
      };
      xhr.send();
    });
  }

  function fetch_static_db(room){
    initSqlJs().then(function(SQL){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'curriculum.db', true);
      xhr.responseType = 'arraybuffer';
    
      xhr.onload = e => {
        var uInt8Array = new Uint8Array(xhr.response);
        var db = new SQL.Database(uInt8Array);
        var contents = db.exec("SELECT * FROM static_purpose");
        for (i = 0; i < contents[0]["values"].length; i++){
          if (contents[0]["values"][i][5] == room){
            add_to_schedule_static(contents[0]["values"][i])
          }
        }
      };
      xhr.send();
    });
  }

  function fetch_temporary_db(yyyy, mm, dd, room){
    weeknum = get_week(yyyy, mm, dd)
    initSqlJs().then(function(SQL){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'curriculum.db', true);
      xhr.responseType = 'arraybuffer';
    
      xhr.onload = e => {
        var uInt8Array = new Uint8Array(xhr.response);
        var db = new SQL.Database(uInt8Array);
        var contents = db.exec("SELECT * FROM temporary_purpose WHERE weeknum == ?", [weeknum]);
        for (i = 0; i < contents[0]["values"].length; i++){
          if (contents[0]["values"][i][6] == room){
            add_to_schedule_temporary(contents[0]["values"][i])
          }
        }
      };
      xhr.send();
    });
  }
  
  function add_to_schedule(data, time_section){
    var ul = document.getElementById(weekname[data[3]]);
    var li = document.createElement("li");
    li.setAttribute("class", "cd-schedule__event");
    
    var a = document.createElement("a");
    a.setAttribute("data-start", time_section[0]);
    a.setAttribute("data-end", time_section[1]);
    a.setAttribute("data-content", "event-abs-circuit");
    a.setAttribute("data-event", "event-1");
    
    var em = document.createElement("em");
    em.setAttribute("class", "cd-schedule__name");
    em.appendChild(document.createTextNode(data[1]));
    em.appendChild(document.createElement("br"));
    em.appendChild(document.createTextNode(data[2]));
    em.appendChild(document.createElement("br"));
    em.appendChild(document.createTextNode(data[6]));

    a.appendChild(em);
    li.appendChild(a);
    ul.appendChild(li);
  }

  function add_to_schedule_static(data){
    var ul = document.getElementById(weekname[data[2]]);
    var li = document.createElement("li");
    li.setAttribute("class", "cd-schedule__event");
    
    var a = document.createElement("a");
    a.setAttribute("data-start", data[3]);
    a.setAttribute("data-end", data[4]);
    a.setAttribute("data-content", "event-abs-circuit");
    a.setAttribute("data-event", "event-3");
    
    var em = document.createElement("em");
    em.setAttribute("class", "cd-schedule__name");
    em.appendChild(document.createTextNode(data[0]));
    em.appendChild(document.createElement("br"));
    em.appendChild(document.createTextNode(data[1]));

    a.appendChild(em);
    li.appendChild(a);
    ul.appendChild(li);
  }

  function add_to_schedule_temporary(data){
    var ul = document.getElementById(weekname[data[3]]);
    var li = document.createElement("li");
    li.setAttribute("class", "cd-schedule__event");
    
    var a = document.createElement("a");
    a.setAttribute("data-start", data[4]);
    a.setAttribute("data-end", data[5]);
    a.setAttribute("data-content", "event-abs-circuit");
    a.setAttribute("data-event", "event-2");
    
    var em = document.createElement("em");
    em.setAttribute("class", "cd-schedule__name");
    em.appendChild(document.createTextNode(data[0]));
    em.appendChild(document.createElement("br"));
    em.appendChild(document.createTextNode(data[1]));

    a.appendChild(em);
    li.appendChild(a);
    ul.appendChild(li);
  }

  clear_schedual = function(){
    var script = document.getElementById("main")
    script.remove()
    document.getElementById("monday").innerHTML = "";
    document.getElementById("tuesday").innerHTML = "";
    document.getElementById("wednesday").innerHTML = "";
    document.getElementById("thursday").innerHTML = "";
    document.getElementById("friday").innerHTML = "";
  }
  
  selectClassroom = async function(room){
    global_room = room
    clear_schedual()

    await fetch_school_db(room)
    await fetch_static_db(room)
    await fetch_temporary_db(yyyy, mm, dd, room)
    await create_main_js()
  }
  
  create_main_js = function(){
    var script = document.createElement("script")
    script.src = "assets/js/main.js"
    script.id = "main"
    document.body.appendChild(script)
  }

  submitForm = async function(){
    var form_year = document.getElementById("form-element-year").value
    var form_month = document.getElementById("form-element-month").value
    var form_date = document.getElementById("form-element-date").value
    
    if (!form_month || !form_date || !form_year){
      alert("所有欄位不能為空白")
      return
    }

    yyyy = form_year
    mm = form_month
    dd = form_date
  
    var today = new Date(yyyy, mm - 1, dd);
    
    var day = today.getDay()
    var diff = today.getDate() - day + (day == 0 ? -6 : 1);
    var start_day = new Date(today.setDate(diff))
    var end_day = new Date(today.setDate(diff + 4))
    
    start = get_month_date(start_day)
    end = get_month_date(end_day)

    var day_string = start[0] + "/" + start[1] + " ~ " + end[0] + "/" + end[1]
    
    clear_schedual()
    await fetch_school_db(global_room)
    await fetch_static_db(global_room)
    await fetch_temporary_db(yyyy, mm, dd, global_room)
    await create_main_js()
    // close popup
    document.getElementById("popup-1").classList.toggle("active");
    // clear value
    document.getElementById("form-element-year").value = ""
    document.getElementById("form-element-month").value = ""
    document.getElementById("form-element-date").value = ""
    // change title
    document.getElementById("text-date").innerHTML = day_string
  }


  // main 
  await fetch_school_db(global_room)
  await fetch_static_db(global_room)
  await fetch_temporary_db(yyyy, mm, dd, global_room)
  await create_main_js()

}());