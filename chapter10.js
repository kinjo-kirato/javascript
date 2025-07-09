// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter10: オブジェクト指向1
window.lessons.oop1 = {
    title: 'オブジェクト指向1',
    sampleCode: `// オブジェクトの基本
let person = {
    name: "太郎",
    age: 25,
    city: "東京",
    greet: function() {
        return "私は" + this.name + "です。" + this.age + "歳です。";
    }
};

console.log("名前: " + person.name);
console.log("年齢: " + person.age);
console.log(person.greet());

// プロパティの追加・変更
person.job = "エンジニア";
person.age = 26;
console.log("職業: " + person.job);
console.log("新しい年齢: " + person.age);`,
    explanation: `
<p>オブジェクトは関連するデータと機能をまとめて管理する仕組みです。</p>
<ul>
    <li><strong>プロパティ</strong>: オブジェクトが持つデータ</li>
    <li><strong>メソッド</strong>: オブジェクトが持つ関数</li>
    <li><strong>this</strong>: オブジェクト自身を参照するキーワード</li>
    <li><strong>ドット記法</strong>: オブジェクト.プロパティ名でアクセス</li>
    <li><strong>ブラケット記法</strong>: オブジェクト["プロパティ名"]でアクセス</li>
</ul>
<p>オブジェクトを使うことで、関連する情報を整理して管理できます。</p>
    `,
    exercise: `車を表すオブジェクトを作成してください。以下のプロパティとメソッドを含めてください：
・プロパティ: brand（ブランド）、model（モデル）、year（年式）、color（色）
・メソッド: getInfo()（車の情報を文字列で返す）、start()（エンジンを始動するメッセージを返す）
オブジェクトを作成してすべてのメソッドをテストしてください。`,
    expectedOutput: `車の情報: 2023年式 Toyota Prius（白）
Toyota Priusのエンジンを始動しました！
ブランド: Toyota
年式: 2023`,
    solution: `let car = {
    brand: "Toyota",
    model: "Prius",
    year: 2023,
    color: "白",
    getInfo: function() {
        return this.year + "年式 " + this.brand + " " + this.model + "（" + this.color + "）";
    },
    start: function() {
        return this.brand + " " + this.model + "のエンジンを始動しました！";
    }
};

console.log("車の情報: " + car.getInfo());
console.log(car.start());
console.log("ブランド: " + car.brand);
console.log("年式: " + car.year);`
};