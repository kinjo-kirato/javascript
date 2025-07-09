// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter8: 配列
window.lessons.array = {
    title: '配列',
    sampleCode: `// 配列の基本
let numbers = [1, 2, 3, 4, 5];
let fruits = ["りんご", "バナナ", "オレンジ"];

console.log("数値配列: " + numbers);
console.log("果物配列: " + fruits);
console.log("最初の果物: " + fruits[0]);
console.log("配列の長さ: " + fruits.length);

// 配列の操作
fruits.push("ぶどう");      // 末尾に追加
fruits.unshift("いちご");   // 先頭に追加
let removed = fruits.pop(); // 末尾を削除して取得
console.log("削除した要素: " + removed);
console.log("更新後の配列: " + fruits);`,
    explanation: `
<p>配列は複数の値を順序付きで格納するデータ構造です。</p>
<ul>
    <li><strong>インデックス</strong>: 0から始まる番号で要素にアクセス</li>
    <li><strong>length</strong>: 配列の要素数を取得</li>
    <li><strong>push()</strong>: 末尾に要素を追加</li>
    <li><strong>pop()</strong>: 末尾の要素を削除して取得</li>
    <li><strong>unshift()</strong>: 先頭に要素を追加</li>
    <li><strong>shift()</strong>: 先頭の要素を削除して取得</li>
</ul>
<p>配列には異なる型の値を混在させることができます。</p>
    `,
    exercise: `以下の処理を行う配列操作のコードを書いてください：
・空の配列を作成
・1から5までの数値を順番に追加
・配列の全要素を表示
・配列の要素の合計を計算して表示
・最大値を見つけて表示`,
    expectedOutput: `配列: 1,2,3,4,5
合計: 15
最大値: 5`,
    solution: `let numbers = [];

// 1から5まで追加
for (let i = 1; i <= 5; i++) {
    numbers.push(i);
}

console.log("配列: " + numbers);

// 合計を計算
let sum = 0;
for (let num of numbers) {
    sum += num;
}
console.log("合計: " + sum);

// 最大値を見つける
let max = numbers[0];
for (let num of numbers) {
    if (num > max) {
        max = num;
    }
}
console.log("最大値: " + max);`
};