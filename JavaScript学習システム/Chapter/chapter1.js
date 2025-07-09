// lessonsオブジェクトの初期化（グローバルスコープに作成）
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter1: 変数
window.lessons.variables = {
    title: '変数',
    intro: `このレッスンでは、データを保存するための変数と定数の基本を学びます。サンプルでは名前や年齢を変数に入れて表示する方法を体験します。`,
    sampleIntro: `実際に変数を宣言し、値を代入して出力するコードを確認します。`,
    sampleCode: `// 変数の宣言と代入
let name = "太郎";
let age = 20;
const PI = 3.14159;

console.log("名前: " + name);
console.log("年齢: " + age);
console.log("円周率: " + PI);`,
    explanation: `
<p>変数は、データを格納するための容器のようなものです。JavaScriptでは以下の方法で変数を宣言できます：</p>
<ul>
    <li><strong>let</strong>: 再代入可能な変数を宣言します</li>
    <li><strong>const</strong>: 再代入不可能な定数を宣言します</li>
    <li><strong>var</strong>: 古い方法（現在はletとconstを推奨）</li>
</ul>
<p>変数名は意味のある名前を付けることが重要です。数字、文字、アンダースコア（_）、ドル記号（$）を使用できますが、数字から始めることはできません。</p>
    `,
    exercise: `次の条件で変数を宣言してください：
・あなたの名前を格納する変数 "myName"
・あなたの年齢を格納する変数 "myAge"  
・好きな色を格納する定数 "favoriteColor"
それぞれをconsole.logで出力してください。`,
    expectedOutput: `名前: 太郎
年齢: 20
好きな色: 青`,
    solution: `let myName = "あなたの名前";
let myAge = 20;
const favoriteColor = "青";

console.log("名前: " + myName);
console.log("年齢: " + myAge);
console.log("好きな色: " + favoriteColor);`
};