(function() {
    $(document).ready(function() {
        function onInit() {
            Array.prototype.extend = function(other) {
                var thisArray = this;
                other.map(x => thisArray.push(x));
            };

            $('#userInput').submit(function(e) {
                var startDate = moment($('#inputStartDate').val(), 'MM/DD/YYYY');
                var startingYear = startDate.format('YYYY');
                var days = [];
                e.preventDefault();
                days = generateCalendarArray(startDate);
                renderCalendar(days);
                requestAndFillHolidays(startingYear);
            });
        }

        function renderCalendar(days) {
            var calendar = $('#calendar');
            calendar.html('');
            for(var i=0;i<days.length;i++) {
                var newDay = $('<div/>', {
                    'class': days[i].classAttr,
                    'text': days[i].text,
                    'id': days[i].unixTime
                });
                calendar.append(newDay);
            }
        }

        function generateCalendarArray(startDate) {
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
                {text: 'Sun', classAttr: 'day title-day', unixTime: 0},
                {text: 'Mon', classAttr: 'day title-day', unixTime: 0},
                {text: 'Tue', classAttr: 'day title-day', unixTime: 0},
                {text: 'Wed', classAttr: 'day title-day', unixTime: 0},
                {text: 'Thu', classAttr: 'day title-day', unixTime: 0},
                {text: 'Fri', classAttr: 'day title-day', unixTime: 0},
                {text: 'Sat', classAttr: 'day title-day', unixTime: 0}
            ];
        }

        function generateMonthInformation(momentDate) {
            var result = {
                text: momentDate.format('MMMM YYYY'),
                classAttr: 'month-title',
                unixTime: 0
            }
            return result;
        }

        function generateEmptyDays(count) {
            var result = [];
            if(count != 7) {
                for(var i=0;i<count;i++) {
                    result.push({
                        text: '',
                        classAttr: 'day empty-day',
                        unixTime: 0
                    });
                }
            }
            return result;
        }

        function generateNormalDay(momentDate) {
            var result = {
                text: momentDate.format('D'),
                classAttr: 'day ' + (momentDate.format('E') == 6 || momentDate.format('E') == 7 ? 'weekend-day' : 'normal-day'),
                unixTime: momentDate.format('x')
            };
            return result;
        }

        function requestAndFillHolidays(startYear) {
            function processHolidaysSuccess(response) {
                var holidays = [];
                switch (response.status) {
                    case 200:
                        holidays = response.holidays;
                        for (holiday in holidays) {
                            var unixHoliday = moment(holiday, 'YYYY-MM-DD').format('x');
                            var elementExists = $('#'+unixHoliday);
                            if(elementExists.length > 0) {
                                elementExists.attr('class','day holiday-day');
                                elementExists.attr('title', holidays[holiday].map(x=>x.name+' | ').join('').slice(0, -3));
                                elementExists.tooltip();
                            }
                        }
                        break;
                    default:
                        console.log(response.error);
                        showError(response.error);
                }
            }
            function processHolidayserror(error, response) {
                //success
                console.log(error);
                showError('There was an error with the request');
            }

            function getSerializedData() {
                var queryData = 'key=de2833a0-c033-43c5-b8cb-82c78edc714b&country=' + $('#inputCountryCode').val() + '&year=2008';
                return queryData;
            }

            if (startYear == 2008) {
                var serializedFormData = getSerializedData();
                $.ajax({
                    method: 'GET',
                    url: 'https://holidayapi.com/v1/holidays?' + serializedFormData
                })
                .done(processHolidaysSuccess)
                .fail(processHolidayserror);
            }
        }


        function showError(text) {
            $('.error-form .messageText').first().html(text);
            $('.error-form').show('fast', function(){
                setTimeout(
                    function(){
                        $('.error-form').hide('slow');
                    },
                    3000
                );
            });
        }

        onInit();
    });
})();