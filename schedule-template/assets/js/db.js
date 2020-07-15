(function(){
  const weekname = {
    "1": "monday",
    "2": "tuesday",
    "3": "wednesday",
    "4": "thursday",
    "5": "friday",
  }
  const timestamps = {
    "1": "08:00",
    "2": "09:00",
    "3": "10:00",
    "4": "11:00",
    "5": "13:00",
    "6": "14:00",
    "7": "15:00",
    "8": "16:00",
    "9": "17:00",
  }
  
  window.addEventListener('load', function () {
    
    config = {
      locateFile: filename => `/assets/js/${filename}`
    }
    // The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
    // We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
    initSqlJs(config).then(function(SQL){
      var xhr = new XMLHttpRequest();
      // For example: https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite
      xhr.open('GET', 'curriculum.db', true);
      xhr.responseType = 'arraybuffer';
    
      xhr.onload = e => {
        var uInt8Array = new Uint8Array(xhr.response);
        var db = new SQL.Database(uInt8Array);
        var contents = db.exec("SELECT * FROM curriculum");
        for (i = 0; i < contents[0]["values"].length; i++){
          var time_section = define_class_time(contents[0]["values"][i][4])
          add_to_schedule(contents[0]["values"][i], time_section)
        }
      };
      xhr.send();
    });
  })
  
  function define_class_time(times){
    if (times[0] == times.slice(times.length - 1)){
      return [timestamps[times[0]], timestamps[String(Number(times[0]) + 1)]]
    }
    return [timestamps[times[0]], timestamps[String(Number(times.slice(times.length - 1)) + 1)]]
  }
  
  function add_to_schedule(data, time_section){
    if (data[5] == "242"){

      var ul = document.getElementById(weekname[data[3]]);
      var li = document.createElement("li");
      li.setAttribute("class", "cd-schedule__event");
      li.setAttribute("style", "");
      
      var a = document.createElement("a");
      a.setAttribute("data-start", time_section[0]);
      a.setAttribute("data-end", time_section[1]);
      // a.setAttribute("data-content", "event-abs-circuit");
      a.setAttribute("data-event", "event-1");
      
      var em = document.createElement("em");
      em.setAttribute("class", "cd-schedule__name");
      em.appendChild(document.createTextNode(data[1]));
      
      a.appendChild(em);
      li.appendChild(a);
      ul.appendChild(li);
    }
  }
}());