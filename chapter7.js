// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter7: 基本構文4(switch)
window.lessons.switch = {
    title: '基本構文4(switch)',
    sampleCode: `// switch文の基本
let dayOfWeek = 3;
let dayName;

switch (dayOfWeek) {
    case 1:
        dayName = "月曜日";
        break;
    case 2:
        dayName = "火曜日";
        break;
    case 3:
        dayName = "水曜日";
        break;
    case 4:
        dayName = "木曜日";
        break;
    case 5:
        dayName = "金曜日";
        break;
    case 6:
        dayName = "土曜日";
        break;
    case 7:
        dayName = "日曜日";
        break;
    default:
        dayName = "不正な値";
}

console.log("今日は" + dayName + "です");`,
    explanation: `
<p>switch文は、変数の値に応じて処理を分岐させる構文です。多くの条件分岐がある場合、if文よりも読みやすくなります。</p>
<ul>
    <li><strong>case</strong>: 特定の値の場合の処理を定義</li>
    <li><strong>break</strong>: case処理を終了（忘れると次のcaseも実行される）</li>
    <li><strong>default</strong>: どのcaseにも該当しない場合の処理</li>
    <li><strong>fall-through</strong>: breakを省略すると次のcaseも実行される</li>
</ul>
<p>文字列での比較も可能です。厳密等価（===）で比較されます。</p>
    `,
    exercise: `成績を表すアルファベット（A, B, C, D, F）を変数に設定し、switch文を使って以下の出力を行ってください：
・A: "優秀"
・B: "良好"  
・C: "普通"
・D: "要改善"
・F: "不合格"
・その他: "無効な成績"`,
    expectedOutput: `例: grade = "B" の場合
成績: B - 良好`,
    solution: `let grade = "B";
let result;

switch (grade) {
    case "A":
        result = "優秀";
        break;
    case "B":
        result = "良好";
        break;
    case "C":
        result = "普通";
        break;
    case "D":
        result = "要改善";
        break;
    case "F":
        result = "不合格";
        break;
    default:
        result = "無効な成績";
}

console.log("成績: " + grade + " - " + result);`
};