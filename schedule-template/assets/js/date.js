(function(){
    function get_month_date(day){
        var dd = String(day.getDate()).padStart(2, '0');
        var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 0!
        return [mm, dd]
    }
    
    var today = new Date();
    
    var day = today.getDay()
    var diff = today.getDate() - day + (day == 0 ? -6 : 1);
    var start_day = new Date(today.setDate(diff))
    var end_day = new Date(today.setDate(diff + 4))
    
    start = get_month_date(start_day)
    end = get_month_date(end_day)

    var day_string = start[0] + "/" + start[1] + " ~ " + end[0] + "/" + end[1]

    document.getElementById("text-date").innerHTML = day_string
}());