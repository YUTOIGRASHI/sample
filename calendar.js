document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar');
    if (!calendar) {
        console.error('Calendar element not found.');
        return;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    // カレンダーのヘッダー
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    daysOfWeek.forEach((day, index) => {
        const dayDiv = document.createElement('div');
        dayDiv.innerText = day;
        dayDiv.addEventListener('click', function() {
            // 曜日がクリックされたときに、その曜日のヘッダーを更新する
            updateTimetableHeader(year, month, null, index);
        });
        calendar.appendChild(dayDiv);
    });

    // 空白の日付セル
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        calendar.appendChild(emptyDiv);
    }

    // 日付セル
    for (let i = 1; i <= daysInMonth; i++) {
        const dateDiv = document.createElement('div');
        dateDiv.innerText = i;
        dateDiv.addEventListener('click', function() {
            updateTimetableHeader(year, month, i, null);
        });
        calendar.appendChild(dateDiv);
    }
});

function getDayOfWeek(year, month, day) {
    const date = new Date(year, month, day);
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    return daysOfWeek[date.getDay()];
}

function getDayOfWeekFromIndex(index) {
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    return daysOfWeek[index];
}