$(document).ready(function() {
    let selectedDates = JSON.parse(localStorage.getItem('selectedDates')) || {};
    let staffNames = JSON.parse(localStorage.getItem('staffNames')) || {
        red: "Staff 1",
        blue: "Staff 2",
        green: "Staff 3",
        orange: "Staff 4",
        purple: "Staff 5"
    };
    let selectedStaff = localStorage.getItem('selectedStaff') || "red"; // Default to Staff 1

    // Function to save selected dates, staff names, and selected staff to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('selectedDates', JSON.stringify(selectedDates));
        localStorage.setItem('staffNames', JSON.stringify(staffNames));
        localStorage.setItem('selectedStaff', selectedStaff);
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
        const todayDate = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
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

        // Clear existing staff cards
        $('#countingSection').empty();

        // Add the Remaining card
        $('#countingSection').append(`
            <div class="col-md-4">
                <div class="card bg-secondary text-white">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-calendar"></i> Remaining</h5>
                        <p class="card-text"><span id="unselectedCount">${unselectedCount}</span> days</p>
                    </div>
                </div>
            </div>
        `);

        // Add dynamic staff cards
        for (let color in colors) {
            if (colors[color].count > 0) {
                $('#countingSection').append(`
                    <div class="col-md-4">
                        <div class="card bg-${color} text-white">
                            <div class="card-body">
                                <h5 class="card-title"><i class="bi bi-person"></i> ${colors[color].name}</h5>
                                <p class="card-text"><span id="${color}Count">${colors[color].count}</span> days</p>
                            </div>
                        </div>
                    </div>
                `);
            }
        }
    }

    // Event listener for date clicks
    $('#calendar').on('click', 'div', function() {
        let date = $(this).data('date');
        if (date) {
            if ($(this).hasClass('selected')) {
                delete selectedDates[date];
                $(this).removeClass('selected').css('background-color', '');
            } else {
                selectedDates[date] = selectedStaff;
                $(this).addClass('selected').css('background-color', selectedStaff);
            }
            updateStats();
            saveToLocalStorage();
        }
    });

    // Event listener for reset colors button
    $('#resetColors').on('click', function() {
        selectedDates = {};
        localStorage.removeItem('selectedDates');
        location.reload(); // Reload the page
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
        selectedStaff = "red"; // Reset to Staff 1
        localStorage.removeItem('selectedDates');
        localStorage.removeItem('staffNames');
        localStorage.removeItem('selectedStaff');
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

    // Event listener for staff selection change
    $('#colorPicker').change(function() {
        selectedStaff = $(this).val();
        saveToLocalStorage();
    });

    // Event listener for daysInMonth and startDay changes
    $('#daysInMonth, #startDay').change(function() {
        let daysInMonth = parseInt($('#daysInMonth').val());
        let startDay = parseInt($('#startDay').val());
        generateCalendar(daysInMonth, startDay);
    });

    // Event listener for share button
    $('#shareButton').on('click', function() {
        // Hide the settings section before capturing
        $('#settingsSection').hide();

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

            // Show the settings section again
            $('#settingsSection').show();
        });
    });

    // Initialize calendar with default values
    updateDateInfo();
    $('#staff1').val(staffNames.red);
    $('#staff2').val(staffNames.blue);
    $('#staff3').val(staffNames.green);
    $('#staff4').val(staffNames.orange);
    $('#staff5').val(staffNames.purple);
    $('#colorPicker').val(selectedStaff); // Set the selected staff in the dropdown
});