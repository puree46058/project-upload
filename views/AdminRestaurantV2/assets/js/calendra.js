function generateCalendar() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();

    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    var startDate = firstDay.getDay();

    var calendarBody = document.getElementById("calendar-body");
    calendarBody.innerHTML = "";

    var date = 1;
    for (var i = 0; i < 6; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < 7; j++) {
            var cell = document.createElement("td");
            if (i === 0 && j < startDate) {
                // Empty cells before the start date
                cell.innerHTML = "";
            } else if (date > lastDay.getDate()) {
                // Empty cells after the end date
                cell.innerHTML = "";
            } else {
                cell.innerHTML = date;
                if (date === today.getDate() && month === today.getMonth()) {
                    cell.classList.add("today");
                }
                // Add event classes or handle events as needed
            }
            row.appendChild(cell);
            date++;
        }
        calendarBody.appendChild(row);
    }
}

// Call the function to generate the initial calendar
generateCalendar();