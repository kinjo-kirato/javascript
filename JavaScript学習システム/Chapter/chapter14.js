// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter14: ユーザー定義関数
window.lessons.userfunction = {
    title: 'ユーザー定義関数',
    intro: `引数に関数を渡す高階関数や再帰など、少し発展的な関数の使い方に触れます。`,
    sampleIntro: `再帰やコールバックを使った少し高度なコード例を紹介します。`,
    sampleCode: `// 高度な関数の使い方

// 高階関数：関数を引数として受け取る
function calculate(x, y, operation) {
    return operation(x, y);
}

let add = (a, b) => a + b;
let multiply = (a, b) => a * b;

console.log("5 + 3 = " + calculate(5, 3, add));
console.log("5 × 3 = " + calculate(5, 3, multiply));

// クロージャ：内部関数が外部変数を参照
function createCounter() {
    let count = 0;
    return function() {
        count++;
        return count;
    };
}

let counter = createCounter();
console.log("カウント: " + counter()); // 1
console.log("カウント: " + counter()); // 2

// 再帰関数：自分自身を呼び出す
function factorial(n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

console.log("5! = " + factorial(5));`,
    explanation: `
<p>JavaScriptでは関数を値として扱い、高度な機能を実装できます。</p>
<ul>
    <li><strong>高階関数</strong>: 関数を引数として受け取る、または関数を返す関数</li>
    <li><strong>クロージャ</strong>: 内部関数が外部スコープの変数にアクセスする仕組み</li>
    <li><strong>再帰関数</strong>: 自分自身を呼び出す関数</li>
    <li><strong>無名関数</strong>: 名前を持たない関数</li>
    <li><strong>即座実行関数</strong>: 定義と同時に実行される関数</li>
</ul>
<p>これらの概念を理解すると、より柔軟で再利用可能なコードが書けます。</p>
    `,
    exercise: `以下の機能を持つ関数群を作成してください：
・文字列処理ライブラリ: 文字列を変換する複数の関数を含む
・配列をソートする汎用関数: 比較関数を引数として受け取る
・フィボナッチ数列を計算する再帰関数
・簡単な電卓機能: 四則演算を関数として実装し、操作を選択できる仕組み`,
    expectedOutput: `=== 文字列処理ライブラリ ===
Hello world
tpircSavaJ
3
JavaScript
=== 配列ソート ===
昇順: 11,12,22,25,34,64,90
降順: 90,64,34,25,22,12,11
=== フィボナッチ数列 ===
F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13
F(8) = 21
F(9) = 34
F(10) = 55
=== 電卓機能 ===
10 + 5 = 15
10 - 5 = 5
10 × 5 = 50
10 ÷ 5 = 2`,
    solution: `// 文字列処理ライブラリ
const StringLib = {
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    reverse: function(str) {
        return str.split('').reverse().join('');
    },
    countWords: function(str) {
        return str.trim().split(/\s+/).length;
    },
    removeSpaces: function(str) {
        return str.replace(/\s/g, '');
    }
};

// 汎用ソート関数
function sortArray(arr, compareFunction) {
    return arr.slice().sort(compareFunction);
}

// 比較関数の例
const ascending = (a, b) => a - b;
const descending = (a, b) => b - a;

// フィボナッチ数列（再帰）
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 電卓機能
const Calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => b !== 0 ? a / b : "ゼロ除算エラー",
    
    calculate: function(a, b, operation) {
        const operations = {
            '+': this.add,
            '-': this.subtract,
            '*': this.multiply,
            '/': this.divide
        };
        return operations[operation] ? operations[operation](a, b) : "無効な演算子";
    }
};

// テスト実行
console.log("=== 文字列処理ライブラリ ===");
console.log(StringLib.capitalize("hello world"));
console.log(StringLib.reverse("JavaScript"));
console.log(StringLib.countWords("Hello beautiful world"));
console.log(StringLib.removeSpaces("J a v a S c r i p t"));

console.log("=== 配列ソート ===");
let numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("昇順: " + sortArray(numbers, ascending));
console.log("降順: " + sortArray(numbers, descending));

console.log("=== フィボナッチ数列 ===");
for (let i = 0; i <= 10; i++) {
    console.log("F(" + i + ") = " + fibonacci(i));
}

console.log("=== 電卓機能 ===");
console.log("10 + 5 = " + Calculator.calculate(10, 5, '+'));
console.log("10 - 5 = " + Calculator.calculate(10, 5, '-'));
console.log("10 × 5 = " + Calculator.calculate(10, 5, '*'));
console.log("10 ÷ 5 = " + Calculator.calculate(10, 5, '/'));`
};