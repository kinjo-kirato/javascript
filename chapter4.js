// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter4: 基本構文1(if)
window.lessons.if = {
    title: '基本構文1(if)',
    sampleCode: `// if文の基本
let score = 85;

if (score >= 90) {
    console.log("優秀です！");
} else if (score >= 80) {
    console.log("良好です");
} else if (score >= 70) {
    console.log("普通です");
} else {
    console.log("頑張りましょう");
}

// 三項演算子
let result = score >= 80 ? "合格" : "不合格";
console.log("結果: " + result);`,
    explanation: `
<p>if文は条件によって処理を分岐させるための制御構文です。</p>
<ul>
    <li><strong>if</strong>: 条件が真の場合に実行</li>
    <li><strong>else if</strong>: 複数の条件を順番にチェック</li>
    <li><strong>else</strong>: どの条件にも該当しない場合に実行</li>
    <li><strong>三項演算子</strong>: 条件 ? 真の場合 : 偽の場合</li>
</ul>
<p>比較演算子：==（等しい）、!=（等しくない）、>（大きい）、<（小さい）、>=（以上）、<=（以下）</p>
    `,
    exercise: `年齢を表す変数を作成し、以下の条件で分岐するコードを書いてください：
・20歳未満: "未成年です"
・20歳以上65歳未満: "成人です"
・65歳以上: "高齢者です"
年齢は自由に設定してください。`,
    expectedOutput: `例: age = 25 の場合
成人です`,
    solution: `let age = 25;

if (age < 20) {
    console.log("未成年です");
} else if (age < 65) {
    console.log("成人です");
} else {
    console.log("高齢者です");
}`
};