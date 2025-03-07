$(document).ready(function() {
    let selectedDates = [];

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
            if (selectedDates.includes(date)) {
                dayDiv.addClass('selected');
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
        let selectedCount = selectedDates.length;
        let unselectedCount = totalDays - selectedCount;

        $('#selectedCount').text(selectedCount);
        $('#unselectedCount').text(unselectedCount);
    }

    $('#calendar').on('click', 'div', function() {
        let date = $(this).data('date');
        if (date) {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                selectedDates = selectedDates.filter(d => d !== date);
            } else {
                $(this).addClass('selected');
                selectedDates.push(date);
            }
            updateStats();
        }
    });

    $('#daysInMonth, #startDay').change(function() {
        let daysInMonth = parseInt($('#daysInMonth').val());
        let startDay = parseInt($('#startDay').val());
        selectedDates = [];
        generateCalendar(daysInMonth, startDay);
    });

    // Initialize calendar with default values
    generateCalendar(31, 0);
});