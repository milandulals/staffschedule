$(document).ready(function() {
    let selectedDates = JSON.parse(localStorage.getItem('selectedDates')) || {};
    let staffNames = JSON.parse(localStorage.getItem('staffNames')) || {
        red: "Staff 1",
        blue: "Staff 2",
        green: "Staff 3",
        orange: "Staff 4",
        purple: "Staff 5"
    };

    // Function to save selected dates and staff names to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('selectedDates', JSON.stringify(selectedDates));
        localStorage.setItem('staffNames', JSON.stringify(staffNames));
    }

    // Function to get next month's info
    function getNextMonthInfo() {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const nextMonthName = nextMonth.toLocaleString('default', { month: 'long' });
        const nextMonthDays = new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate();
        const nextMonthStartDay = nextMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

        return {
            name: nextMonthName,
            days: nextMonthDays,
            startDay: nextMonthStartDay
        };
    }

    // Function to update today's date and next month info
    function updateDateInfo() {
        const today = new Date();
        const todayDate = today.toLocaleDateString();
        const nextMonthInfo = getNextMonthInfo();

        $('#todayDate').text(todayDate);
        $('#nextMonthInfo').html(`
            <strong>Month:</strong> ${nextMonthInfo.name}<br>
            <strong>Days:</strong> ${nextMonthInfo.days}
        `);

        // Set default values for daysInMonth and startDay
        $('#daysInMonth').val(nextMonthInfo.days);
        $('#startDay').val(nextMonthInfo.startDay);

        // Generate calendar with default values
        generateCalendar(nextMonthInfo.days, nextMonthInfo.startDay);
    }

    // Function to generate the calendar
    function generateCalendar(daysInMonth, startDay) {
        $('#calendar').empty();
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Add day headers
        daysOfWeek.forEach(day => {
            $('#calendar').append(`<div class="day-header">${day}</div>`);
        });

        let date = 1;

        // Create empty cells for the days before the start day
        for (let i = 0; i < startDay; i++) {
            $('#calendar').append('<div></div>');
        }

        // Create cells for each day of the month
        for (let i = startDay; i < daysInMonth + startDay; i++) {
            let dayDiv = $('<div>').text(date).data('date', date);
            if (selectedDates[date]) {
                dayDiv.addClass('selected').css('background-color', selectedDates[date]);
            }
            if (i % 7 === 0) { // Sunday
                dayDiv.addClass('sunday');
            }
            $('#calendar').append(dayDiv);
            date++;
        }

        // Fill the remaining cells if any
        while ($('#calendar').children().length % 7 !== 0) {
            $('#calendar').append('<div></div>');
        }

        updateStats();
    }

    // Function to update statistics and color count cards
    function updateStats() {
        let totalDays = parseInt($('#daysInMonth').val());
        let selectedCount = Object.keys(selectedDates).length;
        let unselectedCount = totalDays - selectedCount;

        $('#selectedCount').text(selectedCount);
        $('#unselectedCount').text(unselectedCount);

        // Reset color counts
        const colors = {
            red: { name: staffNames.red, count: 0 },
            blue: { name: staffNames.blue, count: 0 },
            green: { name: staffNames.green, count: 0 },
            orange: { name: staffNames.orange, count: 0 },
            purple: { name: staffNames.purple, count: 0 }
        };

        // Calculate color counts
        for (let date in selectedDates) {
            let color = selectedDates[date];
            colors[color].count++;
        }

        // Update color count cards
        $('#colorCountCards').empty();
        for (let color in colors) {
            if (colors[color].count > 0) {
                $('#colorCountCards').append(`
                    <div class="col-md-2">
                        <div class="color-count-card">
                            <span style="background-color: ${color};"></span>
                            ${colors[color].name}: ${colors[color].count}
                        </div>
                    </div>
                `);
            }
        }

        // Update dropdown staff names
        $('#colorPicker').html(`
            <option value="red"><span class="color-indicator" style="background-color: red;"></span> ${staffNames.red}</option>
            <option value="blue"><span class="color-indicator" style="background-color: blue;"></span> ${staffNames.blue}</option>
            <option value="green"><span class="color-indicator" style="background-color: green;"></span> ${staffNames.green}</option>
            <option value="orange"><span class="color-indicator" style="background-color: orange;"></span> ${staffNames.orange}</option>
            <option value="purple"><span class="color-indicator" style="background-color: purple;"></span> ${staffNames.purple}</option>
        `);
    }

    // Event listener for date clicks
    $('#calendar').on('click', 'div', function() {
        let date = $(this).data('date');
        if (date) {
            let selectedColor = $('#colorPicker').val();
            if ($(this).hasClass('selected')) {
                let currentColor = selectedDates[date];
                delete selectedDates[date];
                $(this).removeClass('selected').css('background-color', '');
            } else {
                selectedDates[date] = selectedColor;
                $(this).addClass('selected').css('background-color', selectedColor);
            }
            updateStats();
            saveToLocalStorage();
        }
    });

    // Event listener for reset colors button
    $('#resetColors').on('click', function() {
        selectedDates = {};
        updateStats();
        saveToLocalStorage();
        generateCalendar($('#daysInMonth').val(), $('#startDay').val());
    });

    // Event listener for reset all button
    $('#resetAll').on('click', function() {
        selectedDates = {};
        staffNames = {
            red: "Staff 1",
            blue: "Staff 2",
            green: "Staff 3",
            orange: "Staff 4",
            purple: "Staff 5"
        };
        localStorage.removeItem('selectedDates');
        localStorage.removeItem('staffNames');
        updateStats();
        updateDateInfo(); // Reset to default next month values
        $('#staff1').val("Staff 1");
        $('#staff2').val("Staff 2");
        $('#staff3').val("Staff 3");
        $('#staff4').val("Staff 4");
        $('#staff5').val("Staff 5");
    });

    // Event listener for apply staff names button
    $('#applyStaffNames').on('click', function() {
        staffNames.red = $('#staff1').val();
        staffNames.blue = $('#staff2').val();
        staffNames.green = $('#staff3').val();
        staffNames.orange = $('#staff4').val();
        staffNames.purple = $('#staff5').val();
        saveToLocalStorage();
        updateStats();
    });

    // Event listener for daysInMonth and startDay changes
    $('#daysInMonth, #startDay').change(function() {
        let daysInMonth = parseInt($('#daysInMonth').val());
        let startDay = parseInt($('#startDay').val());
        generateCalendar(daysInMonth, startDay);
    });

    // Event listener for share button
    $('#shareButton').on('click', function() {
        // Capture the calendar and stats as an image
        html2canvas(document.querySelector(".container")).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Save or share the PDF
            pdf.save("Staff_Schedule.pdf");
        });
    });

    // Initialize calendar with default values
    updateDateInfo();
    $('#staff1').val(staffNames.red);
    $('#staff2').val(staffNames.blue);
    $('#staff3').val(staffNames.green);
    $('#staff4').val(staffNames.orange);
    $('#staff5').val(staffNames.purple);
});