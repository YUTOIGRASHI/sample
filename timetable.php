<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>時間割</title>
    <link rel="stylesheet" href="timetable.css">
</head>
<body>
    <div class="container mt-5">
        <div id="calendar" class="calendar"></div>

        <div class="scrollable">
            <table>
                <thead>
                    <tr class="table-center">
                        <th colspan="41" class="table-header" id="table-header">
                            進学個別指導 ATOM 南林間教室 <span id="current-date"></span> 座席表
                        </th>
                    </tr>
                    <tr>
                        <td>時限</td>
                        <th colspan="5">1限 09:50～11:10</th>
                        <th colspan="5">2限 11:20～12:40</th>
                        <th colspan="5">3限 12:50～14:10</th>
                        <th colspan="5">4限 14:20～15:40</th>
                        <th colspan="5">5限 15:50～17:10</th>
                        <th colspan="5">6限 17:20～18:40</th>
                        <th colspan="5">7限 18:50～20:10</th>
                        <th colspan="5">8限 20:20～21:40</th>
                    </tr>
                    <tr id="header-row">
                    </tr>
                </thead>
                <tbody id="tbody-content">
                </tbody>
            </table>
        </div>
        <button id="add-teacher-button">講師を追加</button> <!-- 追加ボタン -->
        <button id="save-button">保存</button>
    </div>
    <script src="timetable.js"></script>
    <script src="calendar.js"></script>
    <script src="save_button.js"></script>
</body>
</html>
