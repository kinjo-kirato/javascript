// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter2: 文字
window.lessons.character = {
    title: '文字',
    usesPrompt: true, // この行を追加してprompt使用を明示
    sampleCode: `// 文字の入力と表示
let userInput = prompt("好きな文字を1文字入力してください:");
console.log("入力された文字: " + userInput);

// 文字の長さをチェック
if (userInput.length === 1) {
    console.log("正しく1文字が入力されました");
} else if (userInput.length > 1) {
    console.log("複数の文字が入力されました");
} else {
    console.log("何も入力されませんでした");
}

// 入力された文字の文字コードを表示
if (userInput.length > 0) {
    let code = userInput.charCodeAt(0);
    console.log("文字コード: " + code);
}`,
    explanation: `
<p>文字の入力と処理について学びます。JavaScriptでは、ユーザーからの文字入力を受け取り、様々な処理を行うことができます。</p>
<ul>
    <li><strong>prompt()</strong>: ユーザーから文字列を入力してもらう</li>
    <li><strong>length</strong>: 文字列の長さを取得</li>
    <li><strong>charCodeAt()</strong>: 文字を文字コード（ASCII/Unicode）に変換</li>
    <li><strong>条件分岐</strong>: 入力内容によって処理を変える</li>
</ul>
<p>ユーザーとのインタラクティブなプログラムを作成する基礎となります。</p>
    `,
    exercise: `ユーザーから文字を入力してもらい、以下の処理を行うプログラムを作成してください：
1. promptを使って「あなたの名前の最初の文字を入力してください」と表示
2. 入力された文字を表示
3. その文字が大文字か小文字かを判定して表示
4. 文字コードを表示`,
    expectedOutput: `入力された文字: A
この文字は大文字です
文字コード: 65

または小文字の場合：
入力された文字: a
この文字は小文字です
文字コード: 97`,
    solution: `let userChar = prompt("あなたの名前の最初の文字を入力してください:");
console.log("入力された文字: " + userChar);

if (userChar >= 'A' && userChar <= 'Z') {
    console.log("この文字は大文字です");
} else if (userChar >= 'a' && userChar <= 'z') {
    console.log("この文字は小文字です");
} else {
    console.log("アルファベット以外の文字です");
}

console.log("文字コード: " + userChar.charCodeAt(0));`
};