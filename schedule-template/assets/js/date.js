(function(){
    function get_month_date(day){
        var dd = String(day.getDate()).padStart(2, '0');
        var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 0!
        return [mm, dd]
    }
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first))
    var lastday = new Date(curr.setDate(firstday.getDate()+6))
    
    start = get_month_date(firstday)
    end = get_month_date(lastday)

    var day_string = firstday.getFullYear() + "/" + start[0] + "/" + start[1] + " ~ " + lastday.getFullYear() + "/" + end[0] + "/" + end[1]

    document.getElementById("text-date").innerHTML = day_string

    const week = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

    for (var week_index = 0; week_index < week.length; week_index++){
        curr = new Date();
        first = curr.getDate() - curr.getDay() + 1;
        firstday = new Date(curr.setDate(first))
        date = get_month_date(new Date(firstday.setDate(firstday.getDate()+week_index)))
        document.getElementById("date-" + week[week_index]).innerHTML = date[0] + "/" + date[1]
    }
}());