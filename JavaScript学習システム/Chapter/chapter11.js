// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter11: オブジェクト指向2
window.lessons.oop2 = {
    title: 'オブジェクト指向2',
    intro: `コンストラクタ関数やクラスを使ってオブジェクトを効率よく生成する方法を学習します。複数のインスタンスを作成して使う例を体験します。`,
    sampleIntro: `クラスとコンストラクタを利用して複数のオブジェクトを生成するコードです。`,
    sampleCode: `// コンストラクタ関数
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.greet = function() {
        return "こんにちは、" + this.name + "です。";
    };
}

// インスタンスの作成
let person1 = new Person("太郎", 25);
let person2 = new Person("花子", 30);

console.log(person1.greet());
console.log(person2.greet());

// クラス構文（ES6）
class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
    }
    
    speak() {
        return this.name + "が鳴いています。";
    }
}

let dog = new Animal("ポチ", "犬");
console.log(dog.speak());`,
    explanation: `
<p>オブジェクト指向プログラミングでは、同じ構造のオブジェクトを効率的に作成できます。</p>
<ul>
    <li><strong>コンストラクタ関数</strong>: オブジェクトを作成するためのテンプレート</li>
    <li><strong>new演算子</strong>: コンストラクタからインスタンスを作成</li>
    <li><strong>class</strong>: ES6で導入された新しいクラス構文</li>
    <li><strong>constructor</strong>: クラスの初期化メソッド</li>
    <li><strong>インスタンス</strong>: クラスから作成された個別のオブジェクト</li>
</ul>
<p>同じ型のオブジェクトを複数作成する際に便利です。</p>
    `,
    exercise: `Bookクラスを作成してください。以下の仕様に従ってください：
・プロパティ: title（タイトル）、author（著者）、pages（ページ数）、isRead（読了フラグ）
・メソッド: getInfo()（本の情報を返す）、markAsRead()（読了にする）、getStatus()（読了状況を返す）
複数の本のインスタンスを作成してテストしてください。`,
    expectedOutput: `「JavaScriptの教科書」著者: 田中太郎, 300ページ
状況: 未読
「JavaScriptの教科書」を読了にしました。
状況: 読了済み
「Web開発入門」著者: 山田花子, 250ページ
状況: 未読`,
    solution: `class Book {
    constructor(title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = false;
    }
    
    getInfo() {
        return "「" + this.title + "」著者: " + this.author + ", " + this.pages + "ページ";
    }
    
    markAsRead() {
        this.isRead = true;
        return "「" + this.title + "」を読了にしました。";
    }
    
    getStatus() {
        return this.isRead ? "読了済み" : "未読";
    }
}

// テスト
let book1 = new Book("JavaScriptの教科書", "田中太郎", 300);
let book2 = new Book("Web開発入門", "山田花子", 250);

console.log(book1.getInfo());
console.log("状況: " + book1.getStatus());
console.log(book1.markAsRead());
console.log("状況: " + book1.getStatus());

console.log(book2.getInfo());
console.log("状況: " + book2.getStatus());`
};