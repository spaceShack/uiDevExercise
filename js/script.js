(function() {
    $(document).ready(function() {
        function onInit() {
            Array.prototype.extend = function(other) {
                var thisArray = this;
                other.map(x => thisArray.push(x));
            };

            $('#userInput').submit(function(e) {
                var days = [];
                e.preventDefault();
                days = generateCalendarArray();
                renderCalendar(days);
            });
        }

        function renderCalendar(days) {
            var calendar = $('#calendar');
            calendar.html('');
            for(var i=0;i<days.length;i++) {
                var newDay = $('<div/>', {
                    'class': days[i].classAttr,
                    'text': days[i].text
                });
                calendar.append(newDay);
            }
        }

        function generateCalendarArray() {
            var startDate = moment($('#inputStartDate').val(), 'MM/DD/YYYY');
            var numberOfDays = $('#inputNumberDays').val();
            var days = [];
            var currentMonth = startDate.format('M');
            days.extend(generateLiteralDays());
            days.push(generateMonthInformation(startDate));
            days.extend(generateEmptyDays(startDate.format('E')));

            for(var i=numberOfDays; i > 0; i--) {
                days.push(generateNormalDay(startDate));
                startDate.add(1,'d');
                if(i > 1 && currentMonth != startDate.format('M')) {
                    currentMonth = startDate.format('M');
                    days.extend(generateEmptyDays(7-startDate.format('E')));
                    days.push(generateMonthInformation(startDate));
                    days.extend(generateEmptyDays(startDate.format('E')));
                }
            }
            days.extend(generateEmptyDays(7-startDate.format('E')));
            return days;
        }

        function generateLiteralDays() {
            return [
                {text: 'Sun', classAttr: 'day title-day'},
                {text: 'Mon', classAttr: 'day title-day'},
                {text: 'Tue', classAttr: 'day title-day'},
                {text: 'Wed', classAttr: 'day title-day'},
                {text: 'Thu', classAttr: 'day title-day'},
                {text: 'Fri', classAttr: 'day title-day'},
                {text: 'Sat', classAttr: 'day title-day'}
            ];
        }

        function generateMonthInformation(momentDate) {
            var result = {
                text: momentDate.format('MMMM YYYY'),
                classAttr: 'month-title'
            }
            return result;
        }

        function generateEmptyDays(count) {
            var result = [];
            if(count != 7) {
                for(var i=0;i<count;i++) {
                    result.push({
                        text: '',
                        classAttr: 'day empty-day'
                    });
                }
            }
            return result;
        }

        function generateNormalDay(momentDate) {
            var result = {
                text: momentDate.format('D'),
                classAttr: 'day ' + (momentDate.format('E') == 6 || momentDate.format('E') == 7 ? 'weekend-day' : 'normal-day')
            };
            return result;
        }

        onInit();
    });
})();