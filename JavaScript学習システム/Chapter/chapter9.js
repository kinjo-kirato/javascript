// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter9: 関数
window.lessons.function = {
    title: '関数',
    intro: `関数を定義して処理をまとめる方法を学びます。引数や戻り値、アロー関数などの基礎を体験します。`,
    sampleIntro: `関数を宣言し呼び出す流れをコードで確認します。`,
    sampleCode: `// 関数の基本
function greet(name) {
    return "こんにちは、" + name + "さん！";
}

// 関数の呼び出し
let message = greet("太郎");
console.log(message);

// 複数の引数を持つ関数
function add(a, b) {
    return a + b;
}

console.log("5 + 3 = " + add(5, 3));

// アロー関数
const multiply = (x, y) => x * y;
console.log("4 × 6 = " + multiply(4, 6));`,
    explanation: `
<p>関数は処理をまとめて再利用可能にする仕組みです。</p>
<ul>
    <li><strong>function宣言</strong>: 基本的な関数の定義方法</li>
    <li><strong>引数（パラメータ）</strong>: 関数に渡す値</li>
    <li><strong>戻り値（return）</strong>: 関数が返す値</li>
    <li><strong>アロー関数</strong>: =>を使った短縮記法</li>
    <li><strong>スコープ</strong>: 変数の有効範囲</li>
</ul>
<p>関数を使うことで、コードの重複を避け、保守性を向上させることができます。</p>
    `,
    exercise: `以下の機能を持つ関数を作成してください：
・円の面積を計算する関数（引数：半径）
・長方形の面積を計算する関数（引数：縦、横）
・配列の平均値を計算する関数（引数：数値の配列）
それぞれの関数をテストして結果を出力してください。`,
    expectedOutput: `半径5の円の面積: 78.53981633974483
縦4横6の長方形の面積: 24
配列[1,2,3,4,5]の平均: 3`,
    solution: `// 円の面積を計算
function calculateCircleArea(radius) {
    return Math.PI * radius * radius;
}

// 長方形の面積を計算
function calculateRectangleArea(width, height) {
    return width * height;
}

// 配列の平均値を計算
function calculateAverage(numbers) {
    let sum = 0;
    for (let num of numbers) {
        sum += num;
    }
    return sum / numbers.length;
}

// テスト実行
console.log("半径5の円の面積: " + calculateCircleArea(5));
console.log("縦4横6の長方形の面積: " + calculateRectangleArea(4, 6));
console.log("配列[1,2,3,4,5]の平均: " + calculateAverage([1,2,3,4,5]));`
};