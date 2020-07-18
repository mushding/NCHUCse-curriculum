(async function(){
  var global_room = "821"
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
          var time_section = define_class_time(contents[0]["values"][i][4])
          add_to_schedule(contents[0]["values"][i], time_section, room)
        }
      };
      xhr.send();
    });
  }

  function fetch_other_db(room){
    initSqlJs().then(function(SQL){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'curriculum.db', true);
      xhr.responseType = 'arraybuffer';
    
      xhr.onload = e => {
        var uInt8Array = new Uint8Array(xhr.response);
        var db = new SQL.Database(uInt8Array);
        var contents = db.exec("SELECT * FROM regular_curriculum");
        for (i = 0; i < contents[0]["values"].length; i++){
          var time_section = define_class_time(contents[0]["values"][i][4])
          add_to_schedule(contents[0]["values"][i], time_section, room)
        }
      };
      xhr.send();
    });
  }
  
  function define_class_time(times){
    if (times[0] == times.slice(times.length - 1)){
      return [String(timestamps[times[0]]) + ":00", String(timestamps[times[0]] + 1) + ":00"]
    }
    return [String(timestamps[times[0]]) + ":00", String(timestamps[times.slice(times.length - 1)] + 1 + ":00")]
  }
  
  function add_to_schedule(data, time_section, room){
    if (data[5] == room){

      var ul = document.getElementById(weekname[data[3]]);
      var li = document.createElement("li");
      li.setAttribute("class", "cd-schedule__event");
      li.setAttribute("style", "");
      
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
  }

  selectClassroom = async function(room){
    var script = document.getElementById("main")
    script.remove()
    document.getElementById("monday").innerHTML = "";
    document.getElementById("tuesday").innerHTML = "";
    document.getElementById("wednesday").innerHTML = "";
    document.getElementById("thursday").innerHTML = "";
    document.getElementById("friday").innerHTML = "";
    await fetch_school_db(room)
    await fetch_other_db(room)
    await create_main_js()
  }
  
  create_main_js = function(){
    var script = document.createElement("script")
    script.src = "assets/js/main.js"
    script.id = "main"
    document.body.appendChild(script)
  }

  submitForm = function(){
    var form_name = document.getElementById("form-element-name").value
    var form_office = document.getElementById("form-element-office").value
    var form_week = document.getElementById("form-element-week").value
    var form_time = document.getElementById("form-element-time").value
    var form_classroom = document.getElementById("form-element-classroom").value
    
    if (!form_name || !form_office || !form_week || !form_time || !form_classroom){
      alert("所有欄位不能為空白")
      return
    }

    initSqlJs().then(function(SQL){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'curriculum.db', true);
      xhr.responseType = 'arraybuffer';
    
      xhr.onload = e => {
        var uInt8Array = new Uint8Array(xhr.response);
        var db = new SQL.Database(uInt8Array);
        db.run("INSERT INTO regular_curriculum VALUES(?, ?, ?, ?, ?)", [form_name, form_office, form_week, form_time, form_classroom])
        var contents = db.exec("SELECT * FROM regular_curriculum");
        console.log(contents)
        var binaryArray = db.export();
      };
      xhr.send();
    });

    // close popup
    document.getElementById("popup-1").classList.toggle("active");

    document.getElementById("form-element-name").value = ""
    document.getElementById("form-element-office").value = ""
    document.getElementById("form-element-week").value = ""
    document.getElementById("form-element-time").value = ""
    document.getElementById("form-element-classroom").value = ""
  }

  // main 
  await fetch_school_db(global_room)
  await fetch_other_db(global_room)
  await create_main_js()

}());