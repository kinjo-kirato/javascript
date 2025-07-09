// lessonsオブジェクトの確認・初期化
if (typeof window.lessons === 'undefined') {
    window.lessons = {};
}

// Chapter13: 辞書
window.lessons.dictionary = {
    title: '辞書',
    intro: `オブジェクトを辞書のようにキーと値の組で扱う方法を紹介します。点数管理や在庫管理の例で活用法を見てみましょう。`,
    sampleIntro: `キーと値でデータを管理するオブジェクトの使い方をコードで確認します。`,
    sampleCode: `// オブジェクトを辞書として使用
let userScores = {
    "太郎": 85,
    "花子": 92,
    "次郎": 78
};

console.log("太郎の点数: " + userScores["太郎"]);
console.log("花子の点数: " + userScores.花子);

// キーの追加・更新
userScores["美咲"] = 88;
userScores["太郎"] = 90;

// キーの存在確認
if ("太郎" in userScores) {
    console.log("太郎のデータがあります");
}

// 全てのキーと値を取得
console.log("キー一覧: " + Object.keys(userScores));
console.log("値一覧: " + Object.values(userScores));

// Map オブジェクト
let scoreMap = new Map();
scoreMap.set("太郎", 85);
scoreMap.set("花子", 92);
console.log("Mapサイズ: " + scoreMap.size);`,
    explanation: `
<p>辞書（連想配列）はキーと値のペアでデータを管理する構造です。</p>
<ul>
    <li><strong>オブジェクト</strong>: 一般的な辞書の実装方法</li>
    <li><strong>Map</strong>: ES6で導入された専用の辞書オブジェクト</li>
    <li><strong>Object.keys()</strong>: すべてのキーを配列で取得</li>
    <li><strong>Object.values()</strong>: すべての値を配列で取得</li>
    <li><strong>Object.entries()</strong>: キーと値のペア配列を取得</li>
    <li><strong>in演算子</strong>: キーの存在確認</li>
</ul>
<p>データベースのような検索や集計処理に適しています。</p>
    `,
    exercise: `商品の在庫管理システムを辞書を使って作成してください：
・商品名をキー、在庫数を値とする辞書を作成
・商品の追加、在庫の更新、在庫の確認機能を実装
・在庫が10個以下の商品を警告として表示
・全商品の合計在庫数を計算
少なくとも5つの商品で実装してください。`,
    expectedOutput: `=== 在庫管理システム ===
りんごの在庫: 25個
メロンを7個追加しました
バナナの在庫を20個に更新しました
在庫警告（10個以下）:
⚠️ ぶどう: 5個
⚠️ メロン: 7個
総在庫数: 87個`,
    solution: `// 在庫管理辞書
let inventory = {
    "りんご": 25,
    "バナナ": 8,
    "オレンジ": 15,
    "ぶどう": 5,
    "いちご": 12
};

// 商品追加機能
function addProduct(name, quantity) {
    inventory[name] = quantity;
    console.log(name + "を" + quantity + "個追加しました");
}

// 在庫更新機能
function updateStock(name, quantity) {
    if (name in inventory) {
        inventory[name] = quantity;
        console.log(name + "の在庫を" + quantity + "個に更新しました");
    } else {
        console.log(name + "は存在しません");
    }
}

// 在庫確認機能
function checkStock(name) {
    if (name in inventory) {
        console.log(name + "の在庫: " + inventory[name] + "個");
    } else {
        console.log(name + "は存在しません");
    }
}

// 在庫が10個以下の商品を警告
function checkLowStock() {
    console.log("在庫警告（10個以下）:");
    for (let product in inventory) {
        if (inventory[product] <= 10) {
            console.log("⚠️ " + product + ": " + inventory[product] + "個");
        }
    }
}

// 合計在庫数を計算
function getTotalStock() {
    let total = 0;
    for (let product in inventory) {
        total += inventory[product];
    }
    return total;
}

// テスト実行
console.log("=== 在庫管理システム ===");
checkStock("りんご");
addProduct("メロン", 7);
updateStock("バナナ", 20);
checkLowStock();
console.log("総在庫数: " + getTotalStock() + "個");`
};