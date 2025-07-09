// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter5: 基本構文2(while)
window.lessons.while = {
    title: '基本構文2(while)',
    intro: `while文とdo-while文による繰り返し処理を取り上げます。カウントアップしながら条件に応じて処理する例を見てみましょう。`,
    sampleIntro: `カウンタを使いながら繰り返し処理を行うコードです。`,
    sampleCode: `// while文の基本
let count = 1;

while (count <= 5) {
    console.log("カウント: " + count);
    count++;
}

// do-while文
let num = 1;
do {
    console.log("数値: " + num);
    num++;
} while (num <= 3);`,
    explanation: `
<p>while文は条件が真の間、繰り返し処理を実行します。</p>
<ul>
    <li><strong>while</strong>: 条件をチェックしてから実行</li>
    <li><strong>do-while</strong>: 最初に1回実行してから条件をチェック</li>
    <li><strong>無限ループ</strong>に注意：条件が常に真になると停止しません</li>
    <li><strong>break</strong>: ループを強制終了</li>
    <li><strong>continue</strong>: 現在の繰り返しをスキップ</li>
</ul>
<p>ループカウンタを忘れずに更新することが重要です。</p>
    `,
    exercise: `while文を使って以下の処理を行ってください：
・1から10まで数を数えて、偶数のみを出力する
・偶数の合計値も計算して最後に出力する`,
    expectedOutput: `偶数: 2
偶数: 4
偶数: 6
偶数: 8
偶数: 10
偶数の合計: 30`,
    solution: `let i = 1;
let sum = 0;

while (i <= 10) {
    if (i % 2 === 0) {
        console.log("偶数: " + i);
        sum += i;
    }
    i++;
}
console.log("偶数の合計: " + sum);`
};