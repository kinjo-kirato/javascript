// グローバル変数
let currentUser = null;
let currentLesson = null;
let currentSavedCodes = null;
let currentModal = null;

// IndexedDB データベース設定
let db = null;
const DB_NAME = 'JavaScriptLearningSystem';
const DB_VERSION = 1;

// 保存済みコード読み込み（グローバル関数）
function loadSavedCode(index) {
    console.log('loadSavedCode called with index:', index);
    console.log('currentSavedCodes:', currentSavedCodes);

    if (!currentSavedCodes || !currentSavedCodes[index]) {
        console.error('コードが見つかりません。index:', index, 'currentSavedCodes:', currentSavedCodes);
        alert('コードが見つかりません。');
        return;
    }

    const savedCode = currentSavedCodes[index];
    console.log('Loading code:', savedCode.code.substring(0, 50) + '...');

    document.getElementById('code-input').value = savedCode.code;
    closeSavedCodeModal();
    alert('コードを読み込みました！');
}

// 保存済みコード削除（グローバル関数）
function deleteSavedCode(index) {
    console.log('deleteSavedCode called with index:', index);

    if (!confirm('このコードを削除しますか？')) return;

    if (!currentUser || !db) {
        alert('ユーザー情報またはデータベースが見つかりません。');
        return;
    }

    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');

    const getUser = store.get(currentUser.id);
    getUser.onsuccess = () => {
        const user = getUser.result;
        if (user && user.savedCodes && user.savedCodes[index]) {
            console.log('削除前のコード数:', user.savedCodes.length);
            user.savedCodes.splice(index, 1);
            console.log('削除後のコード数:', user.savedCodes.length);

            const updateUser = store.put(user);
            updateUser.onsuccess = () => {
                console.log('データベース更新成功');
                // グローバル変数も更新
                currentSavedCodes = user.savedCodes;
                closeSavedCodeModal();
                alert('コードを削除しました。');
            };
            updateUser.onerror = (event) => {
                console.error('データベース更新エラー:', event);
                alert('削除に失敗しました。');
            };
        } else {
            console.error('ユーザーまたはコードが見つかりません');
            alert('削除対象が見つかりません。');
        }
    };

    getUser.onerror = (event) => {
        console.error('ユーザー取得エラー:', event);
        alert('ユーザー情報の取得に失敗しました。');
    };
}

// モーダル閉じる（グローバル関数）
function closeSavedCodeModal() {
    console.log('closeSavedCodeModal called');
    console.log('currentModal exists:', !!currentModal);

    // 既存のモーダルを全て削除（安全策）
    const existingModals = document.querySelectorAll('.saved-code-modal');
    console.log('既存のモーダル数:', existingModals.length);

    existingModals.forEach((modal, index) => {
        try {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
                console.log(`モーダル${index + 1}を削除しました`);
            }
        } catch (error) {
            console.error(`モーダル${index + 1}削除エラー:`, error);
        }
    });

    // グローバル変数をリセット
    currentModal = null;
    currentSavedCodes = null;

    console.log('モーダル削除処理完了');
}

// データベース初期化
function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject('データベースの初期化に失敗しました');
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            // ユーザーストア作成
            if (!db.objectStoreNames.contains('users')) {
                const userStore = db.createObjectStore('users', { keyPath: 'id' });
                userStore.createIndex('email', 'email', { unique: true });

                // デモユーザーを追加
                userStore.add({
                    id: 'student1',
                    name: '学生1',
                    email: 'student1@example.com',
                    password: 'pass123',
                    progress: {},
                    savedCodes: [],
                    createdAt: new Date().toISOString()
                });

                userStore.add({
                    id: 'student2',
                    name: '学生2',
                    email: 'student2@example.com',
                    password: 'pass456',
                    progress: {},
                    savedCodes: [],
                    createdAt: new Date().toISOString()
                });
            }
        };
    });
}

// ユーザー登録
function registerUser(userData) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');

        // ユーザーIDの重複チェック
        const checkId = store.get(userData.id);
        checkId.onsuccess = () => {
            if (checkId.result) {
                reject('このユーザーIDは既に使用されています');
                return;
            }

            // メールアドレスの重複チェック
            const emailIndex = store.index('email');
            const checkEmail = emailIndex.get(userData.email);
            checkEmail.onsuccess = () => {
                if (checkEmail.result) {
                    reject('このメールアドレスは既に使用されています');
                    return;
                }

                // ユーザー登録
                const addUser = store.add({
                    ...userData,
                    progress: {},
                    createdAt: new Date().toISOString()
                });

                addUser.onsuccess = () => resolve('ユーザー登録が完了しました');
                addUser.onerror = () => reject('ユーザー登録に失敗しました');
            };
        };
    });
}

// ユーザー認証
function authenticateUser(userId, password) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');

        const request = store.get(userId);
        request.onsuccess = () => {
            const user = request.result;
            if (user && user.password === password) {
                resolve(user);
            } else {
                reject('ユーザーIDまたはパスワードが正しくありません');
            }
        };

        request.onerror = () => {
            reject('認証処理でエラーが発生しました');
        };
    });
}

// 進捗保存
function saveProgress(userId, lessonKey) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');

        const getUser = store.get(userId);
        getUser.onsuccess = () => {
            const user = getUser.result;
            if (user) {
                user.progress[lessonKey] = true;
                user.lastUpdated = new Date().toISOString();

                const updateUser = store.put(user);
                updateUser.onsuccess = () => {
                    currentUser.progress = user.progress;
                    resolve('進捗が保存されました');
                };
                updateUser.onerror = () => reject('進捗保存に失敗しました');
            } else {
                reject('ユーザーが見つかりません');
            }
        };
    });
}

// レッスンデータ
const lessons = {
    variables: {
        title: '変数',
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
        solution: `let myName = "あなたの名前";
let myAge = 20;
const favoriteColor = "青";

console.log("名前: " + myName);
console.log("年齢: " + myAge);
console.log("好きな色: " + favoriteColor);`
    },
    character: {
        title: '文字',
        sampleCode: `// 文字の操作
let char = 'A';
let code = char.charCodeAt(0);
let fromCode = String.fromCharCode(65);

console.log("文字: " + char);
console.log("文字コード: " + code);
console.log("文字コード65から文字: " + fromCode);

// 文字の比較
console.log("'A' == 'A': " + ('A' == 'A'));
console.log("'A' < 'B': " + ('A' < 'B'));`,
        explanation: `
<p>JavaScriptでは、文字は文字列の一部として扱われます。1文字だけでも文字列として処理されます。</p>
<ul>
    <li><strong>charCodeAt()</strong>: 文字を文字コード（ASCII/Unicode）に変換</li>
    <li><strong>String.fromCharCode()</strong>: 文字コードから文字に変換</li>
    <li>文字の比較は辞書順で行われます</li>
</ul>
<p>シングルクォート（'）またはダブルクォート（"）で文字を囲みます。</p>
        `,
        exercise: `以下の処理を行うコードを書いてください：
・文字 'Z' の文字コードを求めて出力
・文字コード 97 から文字を求めて出力
・'a' と 'z' を比較した結果を出力`,
        solution: `let char = 'Z';
let code = char.charCodeAt(0);
let fromCode = String.fromCharCode(97);

console.log("文字Zの文字コード: " + code);
console.log("文字コード97の文字: " + fromCode);
console.log("'a' < 'z': " + ('a' < 'z'));`
    },
    string: {
        title: '文字列',
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
        solution: `let str1 = "JavaScript";
let str2 = "Programming";
let combined = str1 + " " + str2;

console.log("結合: " + combined);
console.log("長さ: " + combined.length);
console.log("大文字: " + combined.toUpperCase());
console.log("JavaScriptの部分: " + combined.substring(0, 10));`
    },
    if: {
        title: '基本構文1(if)',
        sampleCode: `// if文の基本
let score = 85;

if (score >= 90) {
    console.log("優秀です！");
} else if (score >= 80) {
    console.log("良好です");
} else if (score >= 70) {
    console.log("普通です");
} else {
    console.log("頑張りましょう");
}

// 三項演算子
let result = score >= 80 ? "合格" : "不合格";
console.log("結果: " + result);`,
        explanation: `
<p>if文は条件によって処理を分岐させるための制御構文です。</p>
<ul>
    <li><strong>if</strong>: 条件が真の場合に実行</li>
    <li><strong>else if</strong>: 複数の条件を順番にチェック</li>
    <li><strong>else</strong>: どの条件にも該当しない場合に実行</li>
    <li><strong>三項演算子</strong>: 条件 ? 真の場合 : 偽の場合</li>
</ul>
<p>比較演算子：==（等しい）、!=（等しくない）、>（大きい）、<（小さい）、>=（以上）、<=（以下）</p>
        `,
        exercise: `年齢を表す変数を作成し、以下の条件で分岐するコードを書いてください：
・20歳未満: "未成年です"
・20歳以上65歳未満: "成人です"
・65歳以上: "高齢者です"
年齢は自由に設定してください。`,
        solution: `let age = 25;

if (age < 20) {
    console.log("未成年です");
} else if (age < 65) {
    console.log("成人です");
} else {
    console.log("高齢者です");
}`
    },
    while: {
        title: '基本構文2(while)',
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
    },
    for: {
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
    },
    switch: {
        title: '基本構文4(switch)',
        sampleCode: `// switch文の基本
let dayOfWeek = 3;
let dayName;

switch (dayOfWeek) {
    case 1:
        dayName = "月曜日";
        break;
    case 2:
        dayName = "火曜日";
        break;
    case 3:
        dayName = "水曜日";
        break;
    case 4:
        dayName = "木曜日";
        break;
    case 5:
        dayName = "金曜日";
        break;
    case 6:
        dayName = "土曜日";
        break;
    case 7:
        dayName = "日曜日";
        break;
    default:
        dayName = "不正な値";
}

console.log("今日は" + dayName + "です");`,
        explanation: `
<p>switch文は、変数の値に応じて処理を分岐させる構文です。多くの条件分岐がある場合、if文よりも読みやすくなります。</p>
<ul>
    <li><strong>case</strong>: 特定の値の場合の処理を定義</li>
    <li><strong>break</strong>: case処理を終了（忘れると次のcaseも実行される）</li>
    <li><strong>default</strong>: どのcaseにも該当しない場合の処理</li>
    <li><strong>fall-through</strong>: breakを省略すると次のcaseも実行される</li>
</ul>
<p>文字列での比較も可能です。厳密等価（===）で比較されます。</p>
        `,
        exercise: `成績を表すアルファベット（A, B, C, D, F）を変数に設定し、switch文を使って以下の出力を行ってください：
・A: "優秀"
・B: "良好"  
・C: "普通"
・D: "要改善"
・F: "不合格"
・その他: "無効な成績"`,
        solution: `let grade = "B";
let result;

switch (grade) {
    case "A":
        result = "優秀";
        break;
    case "B":
        result = "良好";
        break;
    case "C":
        result = "普通";
        break;
    case "D":
        result = "要改善";
        break;
    case "F":
        result = "不合格";
        break;
    default:
        result = "無効な成績";
}

console.log("成績: " + grade + " - " + result);`
    },
    array: {
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
    },
    function: {
        title: '関数',
        sampleCode: `// 関数の基本
function greet(name) {
    return "こんにちは、" + name + "さん！";
}

// 関数の呼び出し
let message = greet("太郎");
console.log(message);

// 複数の引数を持つ関数
function add(a, b) {
    return a + b;
}

console.log("5 + 3 = " + add(5, 3));

// アロー関数
const multiply = (x, y) => x * y;
console.log("4 × 6 = " + multiply(4, 6));`,
        explanation: `
<p>関数は処理をまとめて再利用可能にする仕組みです。</p>
<ul>
    <li><strong>function宣言</strong>: 基本的な関数の定義方法</li>
    <li><strong>引数（パラメータ）</strong>: 関数に渡す値</li>
    <li><strong>戻り値（return）</strong>: 関数が返す値</li>
    <li><strong>アロー関数</strong>: =>を使った短縮記法</li>
    <li><strong>スコープ</strong>: 変数の有効範囲</li>
</ul>
<p>関数を使うことで、コードの重複を避け、保守性を向上させることができます。</p>
        `,
        exercise: `以下の機能を持つ関数を作成してください：
・円の面積を計算する関数（引数：半径）
・長方形の面積を計算する関数（引数：縦、横）
・配列の平均値を計算する関数（引数：数値の配列）
それぞれの関数をテストして結果を出力してください。`,
        solution: `// 円の面積を計算
function calculateCircleArea(radius) {
    return Math.PI * radius * radius;
}

// 長方形の面積を計算
function calculateRectangleArea(width, height) {
    return width * height;
}

// 配列の平均値を計算
function calculateAverage(numbers) {
    let sum = 0;
    for (let num of numbers) {
        sum += num;
    }
    return sum / numbers.length;
}

// テスト実行
console.log("半径5の円の面積: " + calculateCircleArea(5));
console.log("縦4横6の長方形の面積: " + calculateRectangleArea(4, 6));
console.log("配列[1,2,3,4,5]の平均: " + calculateAverage([1,2,3,4,5]));`
    },
    oop1: {
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
    },
    oop2: {
        title: 'オブジェクト指向2',
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
    },
    list: {
        title: 'リスト',
        sampleCode: `// 配列（リスト）の高度な操作
let numbers = [1, 2, 3, 4, 5];

// map: 各要素を変換
let doubled = numbers.map(x => x * 2);
console.log("2倍: " + doubled);

// filter: 条件に合う要素を抽出
let evens = numbers.filter(x => x % 2 === 0);
console.log("偶数: " + evens);

// reduce: 要素を集約
let sum = numbers.reduce((acc, x) => acc + x, 0);
console.log("合計: " + sum);

// find: 条件に合う最初の要素
let found = numbers.find(x => x > 3);
console.log("3より大きい最初の数: " + found);`,
        explanation: `
<p>JavaScriptの配列には便利な高階関数が多数用意されています。</p>
<ul>
    <li><strong>map()</strong>: 各要素を変換して新しい配列を作成</li>
    <li><strong>filter()</strong>: 条件に合う要素だけを抽出</li>
    <li><strong>reduce()</strong>: 配列を単一の値に集約</li>
    <li><strong>find()</strong>: 条件に合う最初の要素を取得</li>
    <li><strong>forEach()</strong>: 各要素に対して処理を実行</li>
    <li><strong>some()</strong>: 条件に合う要素が1つでもあるかチェック</li>
</ul>
<p>これらのメソッドを組み合わせることで、複雑なデータ処理も簡潔に書けます。</p>
        `,
        exercise: `学生の成績データ（配列）を処理してください：
・学生データ: 名前、数学の点数、英語の点数を持つオブジェクトの配列
・平均点が80点以上の学生を抽出
・抽出した学生の名前だけの配列を作成
・全学生の数学の平均点を計算
少なくとも5人の学生データで実装してください。`,
        solution: `let students = [
    {name: "太郎", math: 85, english: 78},
    {name: "花子", math: 92, english: 88},
    {name: "次郎", math: 76, english: 82},
    {name: "美咲", math: 88, english: 85},
    {name: "健太", math: 72, english: 75}
];

// 平均点が80点以上の学生を抽出
let topStudents = students.filter(student => {
    let average = (student.math + student.english) / 2;
    return average >= 80;
});

// 抽出した学生の名前だけの配列
let topStudentNames = topStudents.map(student => student.name);

// 全学生の数学の平均点
let mathAverage = students.reduce((sum, student) => sum + student.math, 0) / students.length;

console.log("平均点80点以上の学生: " + topStudentNames);
console.log("数学の平均点: " + mathAverage);

// 詳細表示
topStudents.forEach(student => {
    let avg = (student.math + student.english) / 2;
    console.log(student.name + "さん: 平均" + avg + "点");
});`
    },
    dictionary: {
        title: '辞書',
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
    },
    userfunction: {
        title: 'ユーザー定義関数',
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
    }
};

// ユーティリティ関数
function updateProgress() {
    if (!currentUser) return;

    const totalLessons = Object.keys(lessons).length;
    const completedCount = Object.keys(currentUser.progress).length;
    const percentage = Math.round((completedCount / totalLessons) * 100);

    document.getElementById('progress-fill').style.width = percentage + '%';
    document.getElementById('progress-text').textContent = `${completedCount}/${totalLessons} 完了`;
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('progress-percentage').textContent = percentage + '%';

    // カリキュラムリストの更新
    const listItems = document.querySelectorAll('#curriculum-list li');
    listItems.forEach(item => {
        const lessonKey = item.getAttribute('data-lesson');
        if (currentUser.progress[lessonKey]) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
    });
}

function showLesson(lessonKey) {
    // window.lessonsの存在確認
    if (!window.lessons || !window.lessons[lessonKey]) {
        console.error('Lesson not found:', lessonKey, 'Available lessons:', Object.keys(window.lessons || {}));
        return;
    }

    currentLesson = lessonKey;
    const lesson = window.lessons[lessonKey];

    console.log('=== showLesson Debug ===');
    console.log('lessonKey:', lessonKey);
    console.log('lesson object:', lesson);
    console.log('has expectedOutput:', !!lesson.expectedOutput);
    if (lesson.expectedOutput) {
        console.log('expectedOutput content:', lesson.expectedOutput.substring(0, 100) + '...');
    }

    // 画面切り替え
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('lesson-screen').classList.remove('hidden');

    // レッスン内容の表示
    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('sample-code').textContent = lesson.sampleCode;
    document.getElementById('explanation').innerHTML = lesson.explanation;
    document.getElementById('exercise-problem').textContent = lesson.exercise;

    // 出力例ボタンの存在確認
    const showButton = document.getElementById('show-expected');
    console.log('show-expected button element:', showButton);
    console.log('button exists:', !!showButton);

    if (!showButton) {
        console.error('出力例ボタンが見つかりません！');
        // ボタンが見つからない場合、強制的に作成
        createExpectedOutputButton();
        return;
    }

    // 出力例の処理
    const expectedOutputSection = document.getElementById('expected-output-section');
    const expectedOutput = document.getElementById('expected-output');

    console.log('Elements check:');
    console.log('- expectedOutputSection:', !!expectedOutputSection);
    console.log('- expectedOutput:', !!expectedOutput);
    console.log('- showButton:', !!showButton);

    if (lesson.expectedOutput) {
        // 出力例がある場合
        console.log('出力例があります。ボタンを表示設定中...');

        if (expectedOutput) {
            expectedOutput.textContent = lesson.expectedOutput;
        }
        if (expectedOutputSection) {
            expectedOutputSection.classList.add('hidden'); // 初期は非表示
        }

        // ボタンの設定
        showButton.textContent = '出力例を見る';
        showButton.classList.remove('btn-warning');
        showButton.classList.add('btn-info');
        showButton.disabled = false;
        showButton.style.display = 'inline-block';
        showButton.style.visibility = 'visible';
        showButton.style.opacity = '1';

        console.log('ボタン設定完了:');
        console.log('- display:', showButton.style.display);
        console.log('- visibility:', showButton.style.visibility);
        console.log('- disabled:', showButton.disabled);
        console.log('- textContent:', showButton.textContent);

    } else {
        // 出力例がない場合
        console.log('出力例がありません。ボタンを非表示にします。');
        if (expectedOutputSection) {
            expectedOutputSection.classList.add('hidden');
        }
        showButton.disabled = true;
        showButton.style.display = 'none';
        showButton.style.visibility = 'hidden';
    }

    // ステータスの更新
    const isCompleted = currentUser && currentUser.progress ? currentUser.progress[lessonKey] : false;
    const statusElement = document.getElementById('lesson-status');
    statusElement.textContent = isCompleted ? '完了済み' : '未完了';
    statusElement.className = isCompleted ? 'status-badge completed' : 'status-badge incomplete';

    // コード入力エリアのリセット
    const codeInput = document.getElementById('code-input');
    codeInput.value = '';
    document.getElementById('output').textContent = '';
    document.getElementById('output').className = 'output-display';

    // コードエディタのサイズをリセット
    if (codeInput) {
        autoResizeTextarea(codeInput);
    }

    // 前のレッスンの結果表示をクリア
    hideResultButtons();

    // カリキュラムのアクティブ状態更新
    document.querySelectorAll('#curriculum-list li').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-lesson="${lessonKey}"]`).classList.add('active');

    console.log('=== showLesson Debug End ===');
}

// 出力例ボタンが見つからない場合に強制作成する関数
function createExpectedOutputButton() {
    console.log('出力例ボタンを強制作成します');

    const editorActions = document.querySelector('.editor-actions');
    if (!editorActions) {
        console.error('editor-actionsが見つかりません');
        return;
    }

    // 既存のボタンをチェック
    let showButton = document.getElementById('show-expected');
    if (showButton) {
        console.log('ボタンは既に存在します');
        return;
    }

    // 新しいボタンを作成
    showButton = document.createElement('button');
    showButton.id = 'show-expected';
    showButton.className = 'btn-info';
    showButton.textContent = '出力例を見る';
    showButton.type = 'button';

    // リセットボタンの後に挿入
    const resetButton = document.getElementById('reset-code');
    if (resetButton && resetButton.nextSibling) {
        editorActions.insertBefore(showButton, resetButton.nextSibling);
    } else {
        editorActions.appendChild(showButton);
    }

    // イベントリスナーを追加
    showButton.addEventListener('click', showExpectedOutput);

    console.log('出力例ボタンを作成しました:', showButton);
}

// 結果ボタンを非表示にする関数
function hideResultButtons() {
    const resultSection = document.getElementById('result-section');
    const solutionSection = document.getElementById('solution-section');

    if (resultSection) {
        resultSection.remove();
    }
    if (solutionSection) {
        solutionSection.remove();
    }

    document.getElementById('complete-lesson').classList.add('hidden');
}

function runCode() {
    const code = document.getElementById('code-input').value;
    const outputElement = document.getElementById('output');

    if (!code.trim()) {
        outputElement.textContent = 'コードを入力してください。';
        outputElement.className = 'output-display error';
        return;
    }

    // console.logを横取りして出力を表示
    let output = '';
    const originalLog = console.log;
    console.log = function(...args) {
        output += args.join(' ') + '\n';
        originalLog.apply(console, args);
    };

    try {
        // evalを使用してコードを実行
        eval(code);
        const trimmedOutput = output.trim();
        outputElement.textContent = trimmedOutput || '実行完了（出力なし）';
        outputElement.className = 'output-display success';

        // 正解判定（prompt()を含むコードの場合は特別処理）
        if (currentLesson) {
            let isCorrect = false;

            // prompt()を使用するレッスンかチェック
            const lesson = window.lessons[currentLesson];
            if (lesson && (lesson.usesPrompt || code.includes('prompt'))) {
                console.log('Prompt-based code detected, skipping re-execution for answer check');
                // prompt()使用の場合は再実行せず、コード分析のみで判定
                isCorrect = checkLessonSpecificAnswer(currentLesson, code, trimmedOutput, '');
            } else {
                // 通常の正解判定
                isCorrect = checkAnswer(currentLesson, code, trimmedOutput);
            }

            showResult(isCorrect);
        }

    } catch (error) {
        outputElement.textContent = 'エラー: ' + error.message;
        outputElement.className = 'output-display error';
        hideResultButtons();
    } finally {
        // console.logを元に戻す
        console.log = originalLog;
    }
}

// 正解判定関数
function checkAnswer(lessonKey, userCode, userOutput) {
    if (!lessonKey || !window.lessons || !window.lessons[lessonKey]) return false;

    const lesson = window.lessons[lessonKey];

    // 期待される出力を取得
    let expectedOutput = '';
    const originalLog = console.log;
    console.log = function(...args) {
        expectedOutput += args.join(' ') + '\n';
    };

    try {
        // 安全にevalを実行
        eval(lesson.solution);
        expectedOutput = expectedOutput.trim();
    } catch (error) {
        console.log = originalLog;
        return false;
    }

    console.log = originalLog;

    // 出力の比較（空白や改行の違いを許容）
    const normalizeOutput = (str) => {
        if (!str) return '';
        return str.replace(/\s+/g, ' ').trim();
    };

    const userNormalized = normalizeOutput(userOutput);
    const expectedNormalized = normalizeOutput(expectedOutput);

    // 基本的な出力比較
    if (userNormalized === expectedNormalized) {
        return true;
    }

    // レッスン固有の判定ロジック
    return checkLessonSpecificAnswer(lessonKey, userCode, userOutput, expectedOutput);
}

// レッスン固有の正解判定
function checkLessonSpecificAnswer(lessonKey, userCode, userOutput, expectedOutput) {
    switch (lessonKey) {
        case 'variables':
            return userCode.includes('let myName') &&
                userCode.includes('let myAge') &&
                userCode.includes('const favoriteColor') &&
                userOutput.includes('名前:') &&
                userOutput.includes('年齢:') &&
                userOutput.includes('好きな色:');

        case 'character':
            console.log('Character lesson - checking specific requirements');
            // prompt()の使用が必須
            if (!userCode.includes('prompt')) {
                console.log('No prompt() found in user code');
                return false;
            }

            // 必要な要素がすべて含まれているかチェック
            const hasPrompt = userCode.includes('prompt');
            const hasCharCodeAt = userCode.includes('charCodeAt');
            const hasConsoleLog = userCode.includes('console.log');
            const hasUpperLowerCheck =
                (userCode.includes('A') && userCode.includes('Z')) ||
                (userCode.includes('a') && userCode.includes('z')) ||
                userCode.includes('大文字') || userCode.includes('小文字');

            // 出力内容のチェック
            const hasCorrectOutput =
                userOutput.includes('入力された文字:') &&
                userOutput.includes('文字コード:') &&
                (userOutput.includes('大文字') || userOutput.includes('小文字') ||
                    userOutput.includes('アルファベット以外'));

            console.log('Character lesson checks:', {
                hasPrompt,
                hasCharCodeAt,
                hasConsoleLog,
                hasUpperLowerCheck,
                hasCorrectOutput
            });

            return hasPrompt && hasCharCodeAt && hasConsoleLog &&
                hasUpperLowerCheck && hasCorrectOutput;

        case 'string':
            return userCode.includes('substring') || userCode.includes('slice') &&
                userOutput.includes('JavaScript Programming') &&
                userOutput.includes('21') && // 文字列の長さ
                userOutput.includes('JAVASCRIPT');

        case 'if':
            return (userCode.includes('if') && userCode.includes('else')) &&
                (userOutput.includes('未成年') || userOutput.includes('成人') || userOutput.includes('高齢者'));

        case 'while':
            return userCode.includes('while') &&
                userOutput.includes('2') && userOutput.includes('4') &&
                userOutput.includes('6') && userOutput.includes('8') &&
                userOutput.includes('10') && userOutput.includes('30'); // 偶数の合計

        case 'for':
            return userCode.includes('for') &&
                userOutput.includes('Fizz') &&
                userOutput.includes('Buzz') &&
                userOutput.includes('FizzBuzz');

        case 'switch':
            return userCode.includes('switch') &&
                userCode.includes('case') &&
                userCode.includes('break') &&
                (userOutput.includes('優秀') || userOutput.includes('良好') ||
                    userOutput.includes('普通') || userOutput.includes('要改善') ||
                    userOutput.includes('不合格'));

        case 'array':
            return userCode.includes('push') &&
                userOutput.includes('[1,2,3,4,5]') || userOutput.includes('1,2,3,4,5') &&
                userOutput.includes('15') && // 合計
                userOutput.includes('5'); // 最大値

        case 'function':
            return userCode.includes('function') &&
                userOutput.includes('78.5') && // 円の面積
                userOutput.includes('24') && // 長方形の面積 4×6
                userOutput.includes('3'); // 平均値

        case 'oop1':
            return userCode.includes('brand') && userCode.includes('model') &&
                userCode.includes('getInfo') && userCode.includes('start') &&
                userOutput.includes('Toyota') || userOutput.includes('車');

        case 'oop2':
            return userCode.includes('class') && userCode.includes('constructor') &&
                userOutput.includes('本') && userOutput.includes('読了');

        case 'list':
            return userCode.includes('filter') && userCode.includes('map') &&
                userOutput.includes('80') && // 平均点80点以上
                userOutput.includes('数学');

        case 'dictionary':
            return userCode.includes('inventory') || userCode.includes('在庫') &&
                userOutput.includes('警告') && userOutput.includes('合計');

        case 'userfunction':
            return userCode.includes('function') &&
                userOutput.includes('文字列') && userOutput.includes('ソート') &&
                userOutput.includes('フィボナッチ') && userOutput.includes('電卓');

        default:
            return false;
    }
}

// 結果表示関数
function showResult(isCorrect) {
    hideResultButtons();

    const resultDiv = document.createElement('div');
    resultDiv.id = 'result-section';
    resultDiv.className = 'result-section';

    if (isCorrect) {
        resultDiv.innerHTML = `
            <div class="result-message success">
                <h4>🎉 正解です！</h4>
                <p>素晴らしい！演習問題を正しく解くことができました。</p>
                <button id="complete-lesson-correct" class="btn-success">レッスン完了</button>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="result-message error">
                <h4>❌ 不正解です</h4>
                <p>もう一度チャレンジしてみてください。解答例を確認することもできます。</p>
                <div class="result-actions">
                    <button id="retry-button" class="btn-secondary">再挑戦</button>
                    <button id="show-solution" class="btn-primary">解答例を見る</button>
                </div>
            </div>
        `;
    }

    document.querySelector('.output-section').appendChild(resultDiv);

    // イベントリスナーを追加
    if (isCorrect) {
        document.getElementById('complete-lesson-correct').addEventListener('click', completeLesson);
    } else {
        document.getElementById('retry-button').addEventListener('click', hideResultButtons);
        document.getElementById('show-solution').addEventListener('click', showSolution);
    }
}

// 解答例表示関数
function showSolution() {
    const lesson = window.lessons[currentLesson];
    if (!lesson) return;

    console.log('Showing solution for lesson:', currentLesson);
    console.log('Solution code:', lesson.solution);

    const solutionDiv = document.createElement('div');
    solutionDiv.id = 'solution-section';
    solutionDiv.className = 'solution-section';
    solutionDiv.innerHTML = `
        <h4>💡 解答例</h4>
        <div class="code-block">
            <pre><code class="language-javascript">${lesson.solution}</code></pre>
        </div>
        <div class="solution-actions">
            <button id="copy-solution" class="btn-secondary">解答をコピー</button>
            <button id="try-solution" class="btn-primary">解答を試す</button>
            <button id="complete-with-solution" class="btn-success">解答を見てレッスン完了</button>
        </div>
    `;

    document.querySelector('.output-section').appendChild(solutionDiv);

    // イベントリスナーを追加
    document.getElementById('copy-solution').addEventListener('click', function() {
        navigator.clipboard.writeText(lesson.solution).then(function() {
            alert('解答例をクリップボードにコピーしました！');
        });
    });

    document.getElementById('try-solution').addEventListener('click', function() {
        const codeInput = document.getElementById('code-input');
        codeInput.value = lesson.solution;
        // テキストエリアのサイズを調整
        setTimeout(() => {
            autoResizeTextarea(codeInput);
        }, 0);
        runCode();
    });

    document.getElementById('complete-with-solution').addEventListener('click', completeLesson);

    // 解答例を見るボタンを無効化
    document.getElementById('show-solution').disabled = true;
    document.getElementById('show-solution').textContent = '解答例表示中';
}

function resetCode() {
    const codeInput = document.getElementById('code-input');
    codeInput.value = '';
    document.getElementById('output').textContent = '';
    document.getElementById('output').className = 'output-display';

    // テキストエリアのサイズをリセット
    if (codeInput) {
        autoResizeTextarea(codeInput);
    }

    hideResultButtons();
}

function completeLesson() {
    if (!currentUser || !currentLesson) return;

    // データベースに進捗を保存
    saveProgress(currentUser.id, currentLesson)
        .then(() => {
            // UI更新
            updateProgress();
            document.getElementById('lesson-status').textContent = '完了済み';
            document.getElementById('lesson-status').className = 'status-badge completed';
            document.getElementById('complete-lesson').classList.add('hidden');

            alert('レッスンを完了しました！お疲れ様でした。');
        })
        .catch(error => {
            console.error('進捗保存エラー:', error);
            alert('進捗の保存に失敗しました。もう一度お試しください。');
        });
}

// 出力例表示機能
function showExpectedOutput() {
    console.log('showExpectedOutput called');
    console.log('currentLesson:', currentLesson);

    if (!currentLesson || !window.lessons || !window.lessons[currentLesson]) {
        alert('レッスンが選択されていません。');
        return;
    }

    const lesson = window.lessons[currentLesson];
    console.log('lesson.expectedOutput exists:', !!lesson.expectedOutput);

    if (!lesson.expectedOutput) {
        alert('このレッスンには出力例がありません。');
        return;
    }

    const expectedOutputSection = document.getElementById('expected-output-section');
    const expectedOutput = document.getElementById('expected-output');
    const showButton = document.getElementById('show-expected');

    console.log('Elements found:', {
        section: !!expectedOutputSection,
        output: !!expectedOutput,
        button: !!showButton
    });

    if (!expectedOutputSection || !expectedOutput || !showButton) {
        console.error('必要な要素が見つかりません');
        alert('出力例表示に必要な要素が見つかりません。');
        return;
    }

    if (expectedOutputSection.classList.contains('hidden')) {
        // 出力例を表示
        expectedOutput.textContent = lesson.expectedOutput;
        expectedOutputSection.classList.remove('hidden');
        showButton.textContent = '出力例を隠す';
        showButton.classList.remove('btn-info');
        showButton.classList.add('btn-warning');
        console.log('出力例を表示しました');
    } else {
        // 出力例を非表示
        expectedOutputSection.classList.add('hidden');
        showButton.textContent = '出力例を見る';
        showButton.classList.remove('btn-warning');
        showButton.classList.add('btn-info');
        console.log('出力例を非表示にしました');
    }
}

// コード保存機能
function saveCode() {
    if (!currentUser || !currentLesson) {
        alert('ログインしてレッスンを選択してください。');
        return;
    }

    const code = document.getElementById('code-input').value;
    if (!code.trim()) {
        alert('保存するコードを入力してください。');
        return;
    }

    const saveData = {
        lessonKey: currentLesson,
        lessonTitle: lessons[currentLesson].title,
        code: code,
        timestamp: new Date().toISOString(),
        displayDate: new Date().toLocaleString('ja-JP')
    };

    // IndexedDBに保存
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');

    const getUser = store.get(currentUser.id);
    getUser.onsuccess = () => {
        const user = getUser.result;
        if (user) {
            if (!user.savedCodes) {
                user.savedCodes = [];
            }

            // 同じレッスンの古い保存を削除
            user.savedCodes = user.savedCodes.filter(item => item.lessonKey !== currentLesson);

            // 新しい保存を追加
            user.savedCodes.push(saveData);

            // 最新10件のみ保持
            user.savedCodes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            user.savedCodes = user.savedCodes.slice(0, 10);

            const updateUser = store.put(user);
            updateUser.onsuccess = () => {
                alert('コードを保存しました！');
            };
        }
    };
}

// 保存済みコード表示
function showSavedCodes() {
    if (!currentUser) {
        alert('ログインしてください。');
        return;
    }

    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');

    const getUser = store.get(currentUser.id);
    getUser.onsuccess = () => {
            const user = getUser.result;
            const savedCodes = user.savedCodes || [];

            if (savedCodes.length === 0) {
                alert('保存されたコードがありません。');
                return;
            }

            // モーダル作成
            const modal = document.createElement('div');
            modal.className = 'saved-code-modal';
            modal.innerHTML = `
            <div class="saved-code-content">
                <h3>保存済みコード</h3>
                <div id="saved-codes-list">
                    ${savedCodes.map((item, index) => `
                        <div class="saved-code-item">
                            <div class="saved-code-header">
                                <strong>${item.lessonTitle}</strong>
                                <span class="saved-code-date">${item.displayDate}</span>
                            </div>
                            <div class="saved-code-preview">${item.code.substring(0, 100)}${item.code.length > 100 ? '...' : ''}</div>
                            <div style="margin-top: 0.5rem;">
                                <button onclick="loadSavedCode(${index})" class="btn-primary">読み込み</button>
                                <button onclick="deleteSavedCode(${index})" class="btn-secondary">削除</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button onclick="closeSavedCodeModal()" class="btn-secondary" style="margin-top: 1rem;">閉じる</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // グローバルに保存して関数からアクセス可能にする
        window.currentSavedCodes = savedCodes;
        window.currentModal = modal;
    };
}

// 保存済みコード読み込み
function loadSavedCode(index) {
    const savedCode = window.currentSavedCodes[index];
    document.getElementById('code-input').value = savedCode.code;
    closeSavedCodeModal();
    alert('コードを読み込みました！');
}

// 保存済みコード削除
function deleteSavedCode(index) {
    if (!confirm('このコードを削除しますか？')) return;
    
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    
    const getUser = store.get(currentUser.id);
    getUser.onsuccess = () => {
        const user = getUser.result;
        user.savedCodes.splice(index, 1);
        
        const updateUser = store.put(user);
        updateUser.onsuccess = () => {
            closeSavedCodeModal();
            alert('コードを削除しました。');
        };
    };
}

function logout() {
    currentUser = null;
    currentLesson = null;
    
    // 画面切り替え
    document.getElementById('main-container').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
    
    // フォームリセット
    document.getElementById('login-form').reset();
}

function goHome() {
    // ウェルカム画面に戻る
    document.getElementById('lesson-screen').classList.add('hidden');
    document.getElementById('welcome-screen').classList.remove('hidden');
    
    // カリキュラムのアクティブ状態をクリア
    document.querySelectorAll('#curriculum-list li').forEach(item => {
        item.classList.remove('active');
    });
    
    // 現在のレッスンをクリア
    currentLesson = null;
}

// テキストエリアの自動リサイズ機能
function autoResizeTextarea(textarea) {
    // 一時的にスクロール可能にして正確な高さを測定
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto';
    
    // 行数を計算
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
    const padding = parseInt(window.getComputedStyle(textarea).paddingTop) + 
                   parseInt(window.getComputedStyle(textarea).paddingBottom);
    
    // 実際のコンテンツ高さを取得
    const scrollHeight = textarea.scrollHeight;
    
    // 最小高さは200px、最大制限なし
    const newHeight = Math.max(200, scrollHeight + 4);
    
    textarea.style.height = newHeight + 'px';
    
    console.log('Textarea resized to:', newHeight, 'px, scrollHeight:', scrollHeight);
}

// コードエディタの初期化
function initCodeEditor() {
    const codeInput = document.getElementById('code-input');
    if (!codeInput) return;
    
    console.log('Initializing code editor...');
    
    // 入力時の自動リサイズ
    codeInput.addEventListener('input', function() {
        setTimeout(() => {
            autoResizeTextarea(this);
        }, 0);
    });
    
    // キー入力時の自動リサイズ
    codeInput.addEventListener('keydown', function() {
        setTimeout(() => {
            autoResizeTextarea(this);
        }, 0);
    });
    
    // ペースト時の自動リサイズ
    codeInput.addEventListener('paste', function() {
        setTimeout(() => {
            autoResizeTextarea(this);
        }, 100);
    });
    
    // フォーカス時の自動リサイズ
    codeInput.addEventListener('focus', function() {
        autoResizeTextarea(this);
    });
    
    // 初期サイズ設定
    setTimeout(() => {
        autoResizeTextarea(codeInput);
    }, 100);
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - ページ読み込み完了');
    
    // ボタンの存在確認
    const buttons = {
        'run-code': document.getElementById('run-code'),
        'reset-code': document.getElementById('reset-code'),
        'show-expected': document.getElementById('show-expected'),
        'save-code': document.getElementById('save-code'),
        'load-saved-code': document.getElementById('load-saved-code'),
        'complete-lesson': document.getElementById('complete-lesson')
    };
    
    console.log('ボタン存在確認:');
    Object.keys(buttons).forEach(key => {
        console.log(`- ${key}:`, !!buttons[key]);
    });
    
    // 出力例ボタンが存在しない場合は作成
    if (!buttons['show-expected']) {
        console.warn('出力例ボタンが見つかりません。作成します。');
        createExpectedOutputButton();
    }
    
    // コードエディタの初期化
    initCodeEditor();
    
    // データベース初期化
    initDatabase()
        .then(() => {
            console.log('データベースが初期化されました');
        })
        .catch(error => {
            console.error('データベース初期化エラー:', error);
            alert('システムの初期化に失敗しました。ページを再読み込みしてください。');
        });
    
    // ログインフォーム
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('user-id').value;
        const password = document.getElementById('password').value;
        
        authenticateUser(userId, password)
            .then(user => {
                currentUser = user;
                
                // 画面切り替え
                document.getElementById('login-container').classList.add('hidden');
                document.getElementById('main-container').classList.remove('hidden');
                
                // ユーザー情報表示
                document.getElementById('user-name').textContent = currentUser.name;
                
                // 進捗更新
                updateProgress();
                
                // ウェルカム画面表示
                document.getElementById('welcome-screen').classList.remove('hidden');
                document.getElementById('lesson-screen').classList.add('hidden');
            })
            .catch(error => {
                alert(error);
            });
    });
    
    // 登録フォーム
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('reg-user-id').value;
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const passwordConfirm = document.getElementById('reg-password-confirm').value;
        
        // バリデーション
        if (userId.length < 3) {
            alert('ユーザーIDは3文字以上で入力してください。');
            return;
        }
        
        if (!/^[a-zA-Z0-9]+$/.test(userId)) {
            alert('ユーザーIDは英数字のみで入力してください。');
            return;
        }
        
        if (password.length < 6) {
            alert('パスワードは6文字以上で入力してください。');
            return;
        }
        
        if (password !== passwordConfirm) {
            alert('パスワードが一致しません。');
            return;
        }
        
        // ユーザー登録
        registerUser({
            id: userId,
            name: name,
            email: email,
            password: password
        })
        .then(message => {
            alert(message + '\nログイン画面に移動します。');
            showLoginForm();
            // フォームリセット
            document.getElementById('register-form').reset();
        })
        .catch(error => {
            alert(error);
        });
    });
    
    // フォーム切り替え
    document.getElementById('show-register').addEventListener('click', showRegisterForm);
    document.getElementById('show-login').addEventListener('click', showLoginForm);
    
    // カリキュラムナビゲーション
    document.getElementById('curriculum-list').addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            const lessonKey = e.target.getAttribute('data-lesson');
            showLesson(lessonKey);
        }
    });
    
    // コード実行ボタン
    document.getElementById('run-code').addEventListener('click', runCode);
    
    // コードリセットボタン
    document.getElementById('reset-code').addEventListener('click', resetCode);
    
    // 出力例表示ボタン
    const showExpectedBtn = document.getElementById('show-expected');
    if (showExpectedBtn) {
        showExpectedBtn.addEventListener('click', showExpectedOutput);
        console.log('出力例ボタンにイベントリスナーを設定しました');
    } else {
        console.warn('出力例ボタンが見つかりません。後で設定します。');
    }
    
    // コード保存ボタン
    document.getElementById('save-code').addEventListener('click', saveCode);
    
    // 保存済みコード表示ボタン
    document.getElementById('load-saved-code').addEventListener('click', showSavedCodes);
    
    // レッスン完了ボタン
    document.getElementById('complete-lesson').addEventListener('click', completeLesson);
    
    // ホームボタン
    document.getElementById('home-btn').addEventListener('click', goHome);
    
    // ログアウトボタン
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // キーボードショートカット（Ctrl+Enter で実行）
    document.getElementById('code-input').addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            runCode();
        }
    });
});

// フォーム切り替え関数
function showRegisterForm() {
    document.getElementById('login-form-section').classList.add('hidden');
    document.getElementById('register-form-section').classList.remove('hidden');
}

function showLoginForm() {
    document.getElementById('register-form-section').classList.add('hidden');
    document.getElementById('login-form-section').classList.remove('hidden');
}