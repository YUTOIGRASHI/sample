document.addEventListener('DOMContentLoaded', function () {
    const headerRow = document.getElementById('header-row');
    const tbodyContent = document.getElementById('tbody-content');
    const columns = ['座席', 'No', '学年', '生徒氏名', '科目'];

    function fetchTeachersByDate(date) {
        return fetch(`get_teachers_by_date.php?date=${date}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching teachers:', error);
                return { teachers: [], unavailablePeriods: {} };
            });
    }

    // ヘッダー行の生成
    function createHeaderRow() {
        // 講師名の列を追加
        let thTeacher = document.createElement('th');
        thTeacher.textContent = '講師';
        headerRow.appendChild(thTeacher);

        // その他の列を追加
        for (let i = 0; i < 8; i++) {
            columns.forEach(col => {
                let th = document.createElement('th');
                th.textContent = col;
                headerRow.appendChild(th);
            });
        }
    }

    createHeaderRow(); // ヘッダー行を生成

    // 講師の新しい行を追加する関数
    function addNewTeacherRow() {
        // 1行目に講師名を配置
        let tr1 = createTableRow(columns);
        let td1 = tr1.firstChild;
        td1.style.textAlign = 'center';
        td1.style.fontWeight = 'bold';
        td1.style.height = '40px'; // 高さ調整
        td1.textContent = '講師名'; // デフォルトテキスト（後で変更される）
        tbodyContent.appendChild(tr1);

        // 2行目にコード入力フィールドを配置
        let tr2 = createTableRow(columns);
        let td2 = tr2.firstChild;
        td2.style.textAlign = 'center';

        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'コードを入力';
        input.style.width = '80px'; // サイズ調整
        input.style.fontSize = '14px'; // フォントサイズ調整

        input.addEventListener('change', function () {
            fetchTeacherNameByCode(input.value, td1);
        });

        td2.appendChild(input);
        tbodyContent.appendChild(tr2);
    }

    function fetchTeacherNameByCode(code, cell) {
        fetch(`get_teacher_code.php?code=${code}`)
            .then(response => response.json())
            .then(data => {
                if (data.lastname) {
                    cell.textContent = data.lastname;
                } else {
                    alert('無効なコード');
                    cell.textContent = '講師名'; // クリアする
                }
            })
            .catch(error => {
                console.error('Error fetching teacher info by code:', error);
            });
    }

    let inputColumns = [];
    for (let i = 1; i <= 37; i += 5) { // 座席列のインデックスを1から開始
        inputColumns.push(i, i + 1); // 座席列とNo列を追加
    }

    function createTableRow(columns) {
        let tr = document.createElement('tr');

        for (let i = 0; i < columns.length * 8; i++) {
            let td = document.createElement('td');
            // 指定された列に `input` 要素を追加
            if (inputColumns.includes(i)) {
                let input = document.createElement('input');
                input.type = 'text';
                input.className = 'square-input'; // スタイルを適用

                // プレースホルダーを列の名前に設定
                if (i % 5 === 1) {
                    input.placeholder = '座席'; // 座席列のプレースホルダー
                } else if (i % 5 === 2) {
                    input.placeholder = 'No'; // No列のプレースホルダー
                    input.addEventListener('change', function () {
                        fetchStudentInfo(input.value, tr, i);
                    });
                } else {
                    input.placeholder = columns[(i - 2) % columns.length]; // 他の列のプレースホルダー
                }

                td.appendChild(input);
            } else {
                td.textContent = ''; // 他の列には空のテキスト
            }

            tr.appendChild(td);
        }

        return tr;
    }

    function fetchStudentInfo(no, row, index) {
        // 既に同じ `No` の内容をクリアする
        clearPreviousEntryIfNeeded(no, row.rowIndex);

        if (no.trim() === '') {
            // `No` が空の場合、対応するセルをクリア
            const gradeCell = row.cells[index + 1];
            const nameCell = row.cells[index + 2];
            const subjectCell = row.cells[index + 3];

            gradeCell.textContent = '';
            nameCell.textContent = '';
            subjectCell.innerHTML = ''; // ドロップダウンもクリア
            return; // 関数を終了
        }

        fetch(`get_student_info.php?no=${no}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // `grade` と `name` のセルを更新
                    const gradeCell = row.cells[index + 1];
                    const nameCell = row.cells[index + 2];
                    gradeCell.textContent = data.grade;
                    nameCell.textContent = data.name;

                    // `subject_class_time` のセルをドロップダウンに更新
                    const subjectCell = row.cells[index + 3];
                    const subjects = data.subject_class_time.split(',');
                    subjectCell.innerHTML = ''; // 既存の内容をクリア
                    let select = document.createElement('select');
                    select.title = '科目'; // title属性を追加
                    subjects.forEach(subject => {
                        let option = document.createElement('option');
                        // 曜日と時限（例：月1、火7）を削除
                        option.value = subject.replace(/[月火水木金土日]\d/, '').trim();
                        option.textContent = subject.replace(/[月火水木金土日]\d/, '').trim();
                        select.appendChild(option);
                    });
                    subjectCell.appendChild(select);
                }
            })
            .catch(error => {
                console.error('Error fetching student info:', error);
            });
    }

    function clearPreviousEntryIfNeeded(no, currentRowIndex) {
        const rows = document.querySelectorAll('#tbody-content tr');
        let noMap = new Map(); // `No` 値と行インデックスを記録するマップ

        // 行ごとに `No` の値を記録
        rows.forEach((row, rowIndex) => {
            const cell = row.querySelector('td:nth-child(2)'); // 2番目のセルを取得
            if (cell) {
                const input = cell.querySelector('input');
                if (input) {
                    const cellNo = input.value;
                    if (noMap.has(cellNo)) {
                        noMap.get(cellNo).push(rowIndex);
                    } else {
                        noMap.set(cellNo, [rowIndex]);
                    }
                }
            }
        });

        // 重複する `No` の行をクリア
        noMap.forEach((indexes, cellNo) => {
            if (indexes.length > 1) {
                indexes.forEach(index => {
                    if (index !== currentRowIndex) {
                        const row = rows[index];
                        const cells = row.querySelectorAll('td');
                        if (cells.length > 0) {
                            // `grade`、`name`、`subject` のセルをクリア
                            const gradeCell = cells[2];
                            const nameCell = cells[3];
                            const subjectCell = cells[4];

                            if (gradeCell) gradeCell.textContent = '';
                            if (nameCell) nameCell.textContent = '';
                            if (subjectCell) subjectCell.innerHTML = ''; // ドロップダウンもクリア
                        }
                    }
                });
            }
        });
    }

    function fetchTeacherByCode(code, rowIndex) {
        fetch(`get_teacher_by_code.php?code=${code}`)
            .then(response => response.json())
            .then(data => {
                if (data.lastname) {
                    const teacherCell = tbodyContent.rows[rowIndex - 1].cells[0];
                    teacherCell.textContent = data.lastname;
                }
            })
            .catch(error => {
                console.error('Error fetching teacher info by code:', error);
            });
    }

    window.updateTimetableHeader = function (year, month, day, dayIndex) {
        const dayOfWeek = dayIndex !== null ? getDayOfWeekFromIndex(dayIndex) : getDayOfWeek(year, month, day);
        const formattedDate = dayIndex !== null ? `${dayOfWeek}曜日` : `${month + 1}/${day}(${dayOfWeek})`;

        console.log(`Updating timetable header for date: ${formattedDate}`);
        console.log(`Day of Week: ${dayOfWeek}`); // 曜日の確認

        const timetableHeader = document.querySelector('.table-header');
        if (timetableHeader) {
            timetableHeader.innerText = `進学個別指導 ATOM 南林間教室 ${formattedDate} 座席表`;
        } else {
            console.error('Timetable header element not found.');
        }

        fetchTeachersByDate(dayOfWeek).then(data => {
            console.log('Data fetched:', data);

            // テーブルの内容をクリア
            while (tbodyContent.firstChild) {
                tbodyContent.removeChild(tbodyContent.firstChild);
            }

            const unavailablePeriods = data.unavailablePeriods;

            // unavailablePeriods の内容をコンソールに表示
            console.log('Unavailable Periods:', unavailablePeriods);

            // テーブルに講師の行を追加する
            Object.keys(unavailablePeriods).forEach(teacher => {
                if (unavailablePeriods[teacher].length < 8) {
                    // 最初の行
                    let tr1 = createTableRow(columns);
                    let td1 = tr1.firstChild;
                    td1.textContent = teacher;
                    td1.className = 'vertical-text';
                    tbodyContent.appendChild(tr1);

                    // 二行目
                    let tr2 = createTableRow(columns);
                    tbodyContent.appendChild(tr2);

                    // 講師コードを取得して二行目に表示
                    fetch(`get_teacher_code.php?teacherName=${teacher}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.code_number) {
                                let td2 = tr2.firstChild;
                                let input = document.createElement('input');
                                input.type = 'text';
                                input.className = 'horizontal-text-small';
                                input.placeholder = 'コードを入力'; // プレースホルダーを追加
                                input.value = data.code_number.slice(-5); // 下5桁を抽出
                                input.addEventListener('change', function () {
                                    fetchTeacherByCode(input.value, tr2.rowIndex);
                                });
                                td2.appendChild(input);
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching teacher code:', error);
                        });
                }
            });

            // 来られない講師の時限に基づいてセルをグレーに塗りつぶす
            Object.keys(unavailablePeriods).forEach(teacher => {
                let rowIndex = Array.from(tbodyContent.rows).findIndex(row => row.cells[0].textContent === teacher);
                console.log(`Teacher: ${teacher}, Row Index: ${rowIndex}`); // 行インデックスの確認

                if (rowIndex !== -1) {
                    let unavailableTimes = unavailablePeriods[teacher];
                    // 講師の2行目も含めて処理するために、2行をループする
                    unavailableTimes.forEach(period => {
                        if (period.startsWith(dayOfWeek)) {
                            // 時限番号を取得し、適切なセルを計算
                            let periodNumber = period.replace(dayOfWeek, '');
                            let periodIndex = parseInt(periodNumber, 10) - 1; // '7' の場合は 6
                            console.log(`Period: ${period}, Period Number: ${periodNumber}, Period Index: ${periodIndex}`); // 時限番号とインデックスの確認

                            if (periodIndex >= 0 && periodIndex < 8) {
                                // 対応するすべてのセル (座席、学年、生徒名、科目) の背景色をグレーに設定
                                for (let j = 0; j < 5; j++) {
                                    let cellIndexFirstRow = periodIndex * 5 + j + 1;
                                    let cellIndexSecondRow = periodIndex * 5 + j + 1;

                                    console.log(`First Row Cell Index: ${cellIndexFirstRow}, Second Row Cell Index: ${cellIndexSecondRow}`); // セルインデックスの確認

                                    if (tbodyContent.rows[rowIndex].cells[cellIndexFirstRow]) {
                                        tbodyContent.rows[rowIndex].cells[cellIndexFirstRow].style.backgroundColor = 'rgba(211, 211, 211, 0.6)'; // より薄いグレー
                                    } else {
                                        console.warn(`First row cell index ${cellIndexFirstRow} does not exist.`);
                                    }
                                    if (tbodyContent.rows[rowIndex + 1].cells[cellIndexSecondRow]) {
                                        tbodyContent.rows[rowIndex + 1].cells[cellIndexSecondRow].style.backgroundColor = 'rgba(211, 211, 211, 0.6)'; // より薄いグレー
                                    } else {
                                        console.warn(`Second row cell index ${cellIndexSecondRow} does not exist.`);
                                    }
                                }
                            }
                        }
                    });
                }
            });
        });
    };

    // ページを開いたときに今日の日付で講師を配置
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    console.log(`Today: ${year}-${month + 1}-${day}`); // 日付の確認
    updateTimetableHeader(year, month, day, null);

    // 講師追加ボタンのイベントリスナーを追加
    const addTeacherButton = document.getElementById('add-teacher-button');
    addTeacherButton.addEventListener('click', addNewTeacherRow);
});
