$(document).ready(function() {
    let selectedDates = {};
    const colors = {
        red: { name: "Red", count: 0 },
        blue: { name: "Blue", count: 0 },
        green: { name: "Green", count: 0 },
        orange: { name: "Orange", count: 0 },
        purple: { name: "Purple", count: 0 }
    };

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

    function updateStats() {
        let totalDays = parseInt($('#daysInMonth').val());
        let selectedCount = Object.keys(selectedDates).length;
        let unselectedCount = totalDays - selectedCount;

        $('#selectedCount').text(selectedCount);
        $('#unselectedCount').text(unselectedCount);

        // Reset color counts
        for (let color in colors) {
            colors[color].count = 0;
        }

        // Calculate color counts
        for (let date in selectedDates) {
            let color = selectedDates[date];
            colors[color].count++;
        }

        // Update color stats
        $('#colorStats').empty();
        for (let color in colors) {
            if (colors[color].count > 0) {
                $('#colorStats').append(`
                    <div class="color-stat">
                        <span style="background-color: ${color}; width: 20px; height: 20px; display: inline-block; border-radius: 50%;"></span>
                        ${colors[color].name}: ${colors[color].count}
                    </div>
                `);
            }
        }
    }

    $('#calendar').on('click', 'div', function() {
        let date = $(this).data('date');
        if (date) {
            let selectedColor = $('#colorPicker').val();
            if ($(this).hasClass('selected')) {
                let currentColor = selectedDates[date];
                colors[currentColor].count--;
                delete selectedDates[date];
                $(this).removeClass('selected').css('background-color', '');
            } else {
                selectedDates[date] = selectedColor;
                colors[selectedColor].count++;
                $(this).addClass('selected').css('background-color', selectedColor);
            }
            updateStats();
        }
    });

    $('#daysInMonth, #startDay').change(function() {
        let daysInMonth = parseInt($('#daysInMonth').val());
        let startDay = parseInt($('#startDay').val());
        selectedDates = {};
        generateCalendar(daysInMonth, startDay);
    });

    // Initialize calendar with default values
    generateCalendar(31, 0);
});