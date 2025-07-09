// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter6: 基本構文3(for)
window.lessons.for = {
    title: '基本構文3(for)',
    sampleCode: `// for文の基本
for (let i = 1; i <= 5; i++) {
    console.log("繰り返し " + i + " 回目");
}

// 配列のfor文
let fruits = ["りんご", "バナナ", "オレンジ"];
for (let i = 0; i < fruits.length; i++) {
    console.log((i + 1) + "番目: " + fruits[i]);
}

// for...of文
for (let fruit of fruits) {
    console.log("果物: " + fruit);
}`,
    explanation: `
<p>for文は繰り返し処理を行うための最も一般的な構文です。</p>
<ul>
    <li><strong>for (初期化; 条件; 増減)</strong>: 基本的なfor文</li>
    <li><strong>for...of</strong>: 配列の要素を順番に取得</li>
    <li><strong>for...in</strong>: オブジェクトのプロパティを取得</li>
    <li><strong>ネストしたfor文</strong>: for文の中にfor文を書くことも可能</li>
</ul>
<p>配列を扱う際は、インデックスが0から始まることに注意しましょう。</p>
    `,
    exercise: `for文を使って以下の処理を行ってください：
・1から100までの数で、3の倍数と5の倍数の場合に特別な出力をする
・3の倍数の場合は "Fizz"
・5の倍数の場合は "Buzz"  
・両方の倍数の場合は "FizzBuzz"
・それ以外はそのまま数値を出力
（最初の20個だけ出力してください）`,
    expectedOutput: `1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
16
17
Fizz
19
Buzz`,
    solution: `for (let i = 1; i <= 20; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
        console.log("FizzBuzz");
    } else if (i % 3 === 0) {
        console.log("Fizz");
    } else if (i % 5 === 0) {
        console.log("Buzz");
    } else {
        console.log(i);
    }
}`
};