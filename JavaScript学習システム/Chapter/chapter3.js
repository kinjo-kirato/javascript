// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter3: 文字列
window.lessons.string = {
    title: '文字列',
    intro: `このレッスンでは、文字列を結合したり長さを調べたりする基本的な文字列操作を体験します。`,
    sampleIntro: `文字列を結合し長さを調べる簡単なコードを実行します。`,
    sampleCode: `// 文字列の操作
let str1 = "Hello";
let str2 = "World";
let combined = str1 + " " + str2;

console.log("結合: " + combined);
console.log("長さ: " + combined.length);
console.log("大文字: " + combined.toUpperCase());
console.log("小文字: " + combined.toLowerCase());
console.log("部分文字列: " + combined.substring(0, 5));`,
    explanation: `
<p>文字列は文字の集合です。JavaScriptでは様々な文字列操作メソッドが用意されています：</p>
<ul>
    <li><strong>length</strong>: 文字列の長さを取得</li>
    <li><strong>toUpperCase()</strong>: 大文字に変換</li>
    <li><strong>toLowerCase()</strong>: 小文字に変換</li>
    <li><strong>substring(start, end)</strong>: 部分文字列を取得</li>
    <li><strong>+演算子</strong>: 文字列を結合</li>
</ul>
<p>テンプレートリテラル（バッククォート記号）を使用すると、変数を埋め込むことができます。</p>
    `,
    exercise: `以下の処理を行うコードを書いてください：
・"JavaScript" と "Programming" を結合して "JavaScript Programming" を作成
・結合した文字列の長さを出力
・結合した文字列を全て大文字にして出力
・"JavaScript" の部分だけを抽出して出力`,
    expectedOutput: `結合: JavaScript Programming
長さ: 21
大文字: JAVASCRIPT PROGRAMMING
JavaScriptの部分: JavaScript`,
    solution: `let str1 = "JavaScript";
let str2 = "Programming";
let combined = str1 + " " + str2;

console.log("結合: " + combined);
console.log("長さ: " + combined.length);
console.log("大文字: " + combined.toUpperCase());
console.log("JavaScriptの部分: " + combined.substring(0, 10));`
};