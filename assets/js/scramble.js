//変数をまとめて宣言
let arrayF, arrayB, arrayL, arrayR, arrayU, arrayD, nextFromF, nextFromD, nextFromB, nextFromU, nextFromR, nextFromL, stashF, stashD, stashB, stashU, stashR, stashL;

// 1. スクランブルのTSVファイルを読み込む
fetch('./scrambles.tsv')
    .then(function (response) {
        // console.log("response",response);
        return response.text();
    })
    .then(function (tsv) {
        // 2. TSVをJSONに変換する
        let allList = d3.tsvParse(tsv);

        // 3. 3x3x3のデータでフィルターする
        let newList = allList.filter(function (item, index) {
            if (item.eventId === '333') return true;
        });

        // 4. ボタンクリックイベントで、スクランブルをランダムに１つとりだす
        const button = document.getElementById('refresh');
        const text = document.getElementById('sign');

        button.addEventListener('click', event => {
            // キューブを初期状態にリセット
            resetCube();

            let max = newList.length;
            let num = Math.floor(Math.random() * max);
            let scrambleSign = newList[num].scramble;

            // 5. とりだしたスクランブルを画面に表示する
            text.innerHTML = scrambleSign;

            // 6. とりだしたスクランブルをスペースで区切って配列に入れる
            scrambleOrder = scrambleSign.split(/\s+/);

            performance.mark('start');
            // 7. スクランブルの順番に関数を呼び出す
            scrambleOrder.forEach(item => {
                rotateCube(item);

            });
            
            // 8. 展開図を画面に描写する
            reflectCube ();

        });

        button.click();
        
    })
    .then(function () {
        // ローディング画面
        const spinner = document.getElementById('loading');
        spinner.style.display ="none";
    });
    
    // classを付与してキューブの色を描画する
    function reflectCube () {
        const cube = {F: arrayF, B: arrayB, L: arrayL, R: arrayR, U: arrayU, D: arrayD};

        // classをリセット
        let elements = document.getElementsByClassName('p-net-list__item');
        Array.prototype.forEach.call( elements, function (e) {
            e.classList.remove('p-net-list__item--green','p-net-list__item--red','p-net-list__item--white','p-net-list__item--blue','p-net-list__item--orange','p-net-list__item--yellow');
        });

        // スクランブル後の色を展開図に反映
        Object.entries(cube).forEach(([key, value]) => {
            const connect = value.reduce((pre, current) => { pre.push(...current); return pre },[]);
            const list = document.getElementById('side' + key).children;
            Array.prototype.forEach.call(list, (elm, i) => {
                elm.classList.add('p-net-list__item--' + connect[i]);
            });
        });
    };

    // キューブの初期状態の色を二次元配列で設定する
    function resetCube () {
        arrayF = [
            ["green", "green", "green"],
            ["green", "green", "green"],
            ["green", "green", "green"]
        ];
        
        arrayB = [
            ["blue", "blue", "blue"],
            ["blue", "blue", "blue"],
            ["blue", "blue", "blue"]
        ];
        
        arrayL = [
            ["orange", "orange", "orange"],
            ["orange", "orange", "orange"],
            ["orange", "orange", "orange"]
        ];
        
        arrayR = [
            ["red", "red", "red"],
            ["red", "red", "red"],
            ["red", "red", "red"]
        ];
        
        arrayU = [
            ["white", "white", "white"],
            ["white", "white", "white"],
            ["white", "white", "white"]
        ];
        
        arrayD = [
            ["yellow", "yellow", "yellow"],
            ["yellow", "yellow", "yellow"],
            ["yellow", "yellow", "yellow"]
        ];
    };

    // キューブの色（配列）の値を退避する
    function stashColor () {
        stashF = JSON.parse(JSON.stringify(arrayF));
        stashD = JSON.parse(JSON.stringify(arrayD));
        stashB = JSON.parse(JSON.stringify(arrayB));
        stashU = JSON.parse(JSON.stringify(arrayU));
        stashR = JSON.parse(JSON.stringify(arrayR));
        stashL = JSON.parse(JSON.stringify(arrayL));
    };

    // キューブを回転したときの色（配列）の変化をパターン化する
    function changeColorR (clockwise) {

        stashColor();

        let x = 2;
        let y = 0;

        if (clockwise == true) {
            nextFromF = arrayU;
            nextFromD = arrayF;
            nextFromB = arrayD;
            nextFromU = arrayB;
            nextFromR = arrayR;
            nextFromL = arrayL;
        } else {
            nextFromF = arrayD;
            nextFromD = arrayB;
            nextFromB = arrayU;
            nextFromU = arrayF;
            nextFromR = arrayR;
            nextFromL = arrayL;

            x = 0;
            y = 2;    
        };

        nextFromF[0][2] = stashF[0][2];
        nextFromF[1][2] = stashF[1][2];
        nextFromF[2][2] = stashF[2][2];
    
        nextFromD[0][x] = stashD[y][2];
        nextFromD[1][x] = stashD[1][2];
        nextFromD[2][x] = stashD[x][2];
    
        nextFromB[0][2] = stashB[2][0];
        nextFromB[1][2] = stashB[1][0];
        nextFromB[2][2] = stashB[0][0];
    
        nextFromU[0][y] = stashU[x][2];
        nextFromU[1][y] = stashU[1][2];
        nextFromU[2][y] = stashU[y][2];
    
        nextFromR[0][0] = stashR[x][y];
        nextFromR[0][1] = stashR[1][y];
        nextFromR[0][2] = stashR[y][y];
        nextFromR[1][0] = stashR[x][1];
        nextFromR[1][2] = stashR[y][1];
        nextFromR[2][0] = stashR[x][x];
        nextFromR[2][1] = stashR[1][x];
        nextFromR[2][2] = stashR[y][x];
    };
    function changeColorL (clockwise) {

        stashColor();

        let x = 2;
        let y = 0;

        if (clockwise == true) {
            nextFromF = arrayD;
            nextFromD = arrayB;
            nextFromB = arrayU;
            nextFromU = arrayF;
            nextFromR = arrayR;
            nextFromL = arrayL;
        } else {
            nextFromF = arrayU;
            nextFromD = arrayF;
            nextFromB = arrayD;
            nextFromU = arrayB;
            nextFromR = arrayR;
            nextFromL = arrayL;

            x = 0;
            y = 2;
        };

        nextFromF[0][0] = stashF[0][0];
        nextFromF[1][0] = stashF[1][0];
        nextFromF[2][0] = stashF[2][0];
    
        nextFromD[0][x] = stashD[x][0];
        nextFromD[1][x] = stashD[1][0];
        nextFromD[2][x] = stashD[y][0];
    
        nextFromB[0][0] = stashB[2][2];
        nextFromB[1][0] = stashB[1][2];
        nextFromB[2][0] = stashB[0][2];
    
        nextFromU[0][y] = stashU[y][0];
        nextFromU[1][y] = stashU[1][0];
        nextFromU[2][y] = stashU[x][0];
    
        nextFromL[0][0] = stashL[x][y];
        nextFromL[0][1] = stashL[1][y];
        nextFromL[0][2] = stashL[y][y];
        nextFromL[1][0] = stashL[x][1];
        nextFromL[1][2] = stashL[y][1];
        nextFromL[2][0] = stashL[x][x];
        nextFromL[2][1] = stashL[1][x];
        nextFromL[2][2] = stashL[y][x];
    };
    function changeColorU (clockwise) {

        stashColor();

        let x = 2;
        let y = 0;

        if (clockwise == true) {
            nextFromF = arrayL;
            nextFromD = arrayD;
            nextFromB = arrayR;
            nextFromU = arrayU;
            nextFromR = arrayF;
            nextFromL = arrayB;
        } else {
            nextFromF = arrayR;
            nextFromD = arrayD;
            nextFromB = arrayL;
            nextFromU = arrayU;
            nextFromR = arrayB;
            nextFromL = arrayF;

            x = 0;
            y = 2;
        };

        nextFromF[0][0] = stashF[0][0];
        nextFromF[0][1] = stashF[0][1];
        nextFromF[0][2] = stashF[0][2];
    
        nextFromL[0][0] = stashL[0][0];
        nextFromL[0][1] = stashL[0][1];
        nextFromL[0][2] = stashL[0][2];
    
        nextFromB[0][0] = stashB[0][0];
        nextFromB[0][1] = stashB[0][1];
        nextFromB[0][2] = stashB[0][2];
    
        nextFromR[0][0] = stashR[0][0];
        nextFromR[0][1] = stashR[0][1];
        nextFromR[0][2] = stashR[0][2];
    
        nextFromU[0][0] = stashU[x][y];
        nextFromU[0][1] = stashU[1][y];
        nextFromU[0][2] = stashU[y][y];
        nextFromU[1][0] = stashU[x][1];
        nextFromU[1][2] = stashU[y][1];
        nextFromU[2][0] = stashU[x][x];
        nextFromU[2][1] = stashU[1][x];
        nextFromU[2][2] = stashU[y][x];
    };
    function changeColorD (clockwise) {

        stashColor();

        let x = 2;
        let y = 0;

        if (clockwise == true) {
            nextFromF = arrayR;
            nextFromD = arrayD;
            nextFromB = arrayL;
            nextFromU = arrayU;
            nextFromR = arrayB;
            nextFromL = arrayF;
        } else {
            nextFromF = arrayL;
            nextFromD = arrayD;
            nextFromB = arrayR;
            nextFromU = arrayU;
            nextFromR = arrayF;
            nextFromL = arrayB;

            x = 0;
            y = 2;
        };

        nextFromF[2][0] = stashF[2][0];
        nextFromF[2][1] = stashF[2][1];
        nextFromF[2][2] = stashF[2][2];
    
        nextFromL[2][0] = stashL[2][0];
        nextFromL[2][1] = stashL[2][1];
        nextFromL[2][2] = stashL[2][2];
    
        nextFromB[2][0] = stashB[2][0];
        nextFromB[2][1] = stashB[2][1];
        nextFromB[2][2] = stashB[2][2];
    
        nextFromR[2][0] = stashR[2][0];
        nextFromR[2][1] = stashR[2][1];
        nextFromR[2][2] = stashR[2][2];
    
        nextFromD[0][0] = stashD[x][y];
        nextFromD[0][1] = stashD[1][y];
        nextFromD[0][2] = stashD[y][y];
        nextFromD[1][0] = stashD[x][1];
        nextFromD[1][2] = stashD[y][1];
        nextFromD[2][0] = stashD[x][x];
        nextFromD[2][1] = stashD[1][x];
        nextFromD[2][2] = stashD[y][x];
    };
    function changeColorF (clockwise) {

        stashColor();

        let x = 2;
        let y = 0;

        if (clockwise == true) {
            nextFromF = arrayF;
            nextFromD = arrayL;
            nextFromB = arrayB;
            nextFromU = arrayR;
            nextFromR = arrayD;
            nextFromL = arrayU;
        } else {
            nextFromF = arrayF;
            nextFromD = arrayR;
            nextFromB = arrayB;
            nextFromU = arrayL;
            nextFromR = arrayU;
            nextFromL = arrayD;

            x = 0;
            y = 2;
        };

        nextFromD[0][x] = stashD[0][y];
        nextFromD[1][x] = stashD[0][1];
        nextFromD[2][x] = stashD[0][x];
    
        nextFromL[x][0] = stashL[x][2];
        nextFromL[x][1] = stashL[1][2];
        nextFromL[x][2] = stashL[y][2];
    
        nextFromU[0][y] = stashU[2][y];
        nextFromU[1][y] = stashU[2][1];
        nextFromU[2][y] = stashU[2][x];
    
        nextFromR[y][0] = stashR[x][0];
        nextFromR[y][1] = stashR[1][0];
        nextFromR[y][2] = stashR[y][0];
    
        nextFromF[0][0] = stashF[x][y];
        nextFromF[0][1] = stashF[1][y];
        nextFromF[0][2] = stashF[y][y];
        nextFromF[1][0] = stashF[x][1];
        nextFromF[1][2] = stashF[y][1];
        nextFromF[2][0] = stashF[x][x];
        nextFromF[2][1] = stashF[1][x];
        nextFromF[2][2] = stashF[y][x];
    };
    function changeColorB (clockwise) {

        stashColor();

        let x = 2;
        let y = 0;

        if (clockwise == true) {
            nextFromF = arrayF;
            nextFromD = arrayR;
            nextFromB = arrayB;
            nextFromU = arrayL;
            nextFromR = arrayU;
            nextFromL = arrayD;
        } else {
            nextFromF = arrayF;
            nextFromD = arrayL;
            nextFromB = arrayB;
            nextFromU = arrayR;
            nextFromR = arrayD;
            nextFromL = arrayU;

            x = 0;
            y = 2;
        };

        nextFromD[0][x] = stashD[2][x];
        nextFromD[1][x] = stashD[2][1];
        nextFromD[2][x] = stashD[2][y];
    
        nextFromL[x][0] = stashL[y][0];
        nextFromL[x][1] = stashL[1][0];
        nextFromL[x][2] = stashL[x][0];
    
        nextFromU[0][y] = stashU[0][x];
        nextFromU[1][y] = stashU[0][1];
        nextFromU[2][y] = stashU[0][y];
    
        nextFromR[y][0] = stashR[y][2];
        nextFromR[y][1] = stashR[1][2];
        nextFromR[y][2] = stashR[x][2];
    
        nextFromB[0][0] = stashB[x][y];
        nextFromB[0][1] = stashB[1][y];
        nextFromB[0][2] = stashB[y][y];
        nextFromB[1][0] = stashB[x][1];
        nextFromB[1][2] = stashB[y][1];
        nextFromB[2][0] = stashB[x][x];
        nextFromB[2][1] = stashB[1][x];
        nextFromB[2][2] = stashB[y][x];
    };

    // 回転記号にあわせてパターンに当てはめていく
    function rotateCube (e) {

        if (e === "R"){
            changeColorR(true);
        } else if (e === "R2") {
            changeColorR(true);
            changeColorR(true);
        } else if (e === "R'") {
            changeColorR(false);
        } else if (e === "L") {
            changeColorL(true);
        } else if (e === "L2") {
            changeColorL(true);
            changeColorL(true);
        } else if (e === "L'") {
            changeColorL(false);
        } else if (e === "U") {
            changeColorU(true);
        } else if (e === "U2") {
            changeColorU(true);
            changeColorU(true);
        } else if (e === "U'") {
            changeColorU(false);
        } else if (e === "D") {
            changeColorD(true);
        } else if (e === "D2") {
            changeColorD(true);
            changeColorD(true);
        } else if (e === "D'") {
            changeColorD(false);
        } else if (e === "F") {
            changeColorF(true);
        } else if (e === "F2") {
            changeColorF(true);
            changeColorF(true);
        } else if (e === "F'") {
            changeColorF(false);
        } else if (e === "B") {
            changeColorB(true);
        } else if (e === "B2") {
            changeColorB(true);
            changeColorB(true);
        } else if (e === "B'") {
            changeColorB(false);
        } else {
            ;
        };


        // キューブの色（配列）を暫定的に画面に表示する
        // const stateU = document.getElementById('state-up');
        // const stateF = document.getElementById('state-front');
        // const stateD = document.getElementById('state-down');
        // const stateL = document.getElementById('state-left');
        // const stateR = document.getElementById('state-right');
        // const stateB = document.getElementById('state-back');
        
        // stateU.innerHTML = arrayU[0] + "<br>" + arrayU[1] + "<br>" + arrayU[2];
        // stateF.innerHTML = arrayF[0] + "<br>" + arrayF[1] + "<br>" + arrayF[2];
        // stateD.innerHTML = arrayD[0] + "<br>" + arrayD[1] + "<br>" + arrayD[2];
        // stateL.innerHTML = arrayL[0] + "<br>" + arrayL[1] + "<br>" + arrayL[2];
        // stateR.innerHTML = arrayR[0] + "<br>" + arrayR[1] + "<br>" + arrayR[2];
        // stateB.innerHTML = arrayB[0] + "<br>" + arrayB[1] + "<br>" + arrayB[2];

    };

