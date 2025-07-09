// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter12: リスト
window.lessons.list = {
    title: 'リスト',
    sampleCode: `// 配列（リスト）の高度な操作
let numbers = [1, 2, 3, 4, 5];

// map: 各要素を変換
let doubled = numbers.map(x => x * 2);
console.log("2倍: " + doubled);

// filter: 条件に合う要素を抽出
let evens = numbers.filter(x => x % 2 === 0);
console.log("偶数: " + evens);

// reduce: 要素を集約
let sum = numbers.reduce((acc, x) => acc + x, 0);
console.log("合計: " + sum);

// find: 条件に合う最初の要素
let found = numbers.find(x => x > 3);
console.log("3より大きい最初の数: " + found);`,
    explanation: `
<p>JavaScriptの配列には便利な高階関数が多数用意されています。</p>
<ul>
    <li><strong>map()</strong>: 各要素を変換して新しい配列を作成</li>
    <li><strong>filter()</strong>: 条件に合う要素だけを抽出</li>
    <li><strong>reduce()</strong>: 配列を単一の値に集約</li>
    <li><strong>find()</strong>: 条件に合う最初の要素を取得</li>
    <li><strong>forEach()</strong>: 各要素に対して処理を実行</li>
    <li><strong>some()</strong>: 条件に合う要素が1つでもあるかチェック</li>
</ul>
<p>これらのメソッドを組み合わせることで、複雑なデータ処理も簡潔に書けます。</p>
    `,
    exercise: `学生の成績データ（配列）を処理してください：
・学生データ: 名前、数学の点数、英語の点数を持つオブジェクトの配列
・平均点が80点以上の学生を抽出
・抽出した学生の名前だけの配列を作成
・全学生の数学の平均点を計算
少なくとも5人の学生データで実装してください。`,
    expectedOutput: `平均点80点以上の学生: 花子,美咲
数学の平均点: 82.6
花子さん: 平均90点
美咲さん: 平均86.5点`,
    solution: `let students = [
    {name: "太郎", math: 85, english: 78},
    {name: "花子", math: 92, english: 88},
    {name: "次郎", math: 76, english: 82},
    {name: "美咲", math: 88, english: 85},
    {name: "健太", math: 72, english: 75}
];

// 平均点が80点以上の学生を抽出
let topStudents = students.filter(student => {
    let average = (student.math + student.english) / 2;
    return average >= 80;
});

// 抽出した学生の名前だけの配列
let topStudentNames = topStudents.map(student => student.name);

// 全学生の数学の平均点
let mathAverage = students.reduce((sum, student) => sum + student.math, 0) / students.length;

console.log("平均点80点以上の学生: " + topStudentNames);
console.log("数学の平均点: " + mathAverage);

// 詳細表示
topStudents.forEach(student => {
    let avg = (student.math + student.english) / 2;
    console.log(student.name + "さん: 平均" + avg + "点");
});`
};