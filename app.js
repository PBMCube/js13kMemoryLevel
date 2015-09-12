//GLOBAL VARIABLES
var state = 0;
var height = window.innerHeight;
var width = window.innerWidth;
var can = "";
var ct = "";
var touchStart = 0;
var touchEnd = 0;
var button_color = "white"
var memoryLevelSave = {};
var currentLevel = 0;
var colors = ["#f44336", "#4caf50", "#fdd835", "#6d4c41", "#757575", "#26a69a", "#e3f2fd", "#ff9800", "#8e24aa"]
var taskList = [];
var taskTempList = [];
var animateElement = -1;
var animateElementX = 0;
var animateElementXDown = 0;
var resultAcuracy = "";
var resultColor = -1;
var substate = 1;
var myInt1 = "";
var instate = 0;
var isEasy = 0;

var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

//set canvas ratio
createHiDPICanvas = function (w, h, ratio) {
    if (!ratio) {
        ratio = PIXEL_RATIO;
    }
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

window.onload = function (e) {
    startApp();
};

//Setup canvas and local storage, and start tracking mouse and touch events
function startApp() {
    can = document.getElementById("c");
    ct = can.getContext("2d");
    createHiDPICanvas(width, height)

    if (localStorage.getItem("memoryLevelSave")) {
        memoryLevelSave = JSON.parse(localStorage.getItem("memoryLevelSave"));
    } else {
        memoryLevelSave = {
            "normal": {
                "easy": 0,
                "hard": 0
            },
            "reversed": {
                "easy": 0,
                "hard": 0
            }
        }
        localStorage.setItem("memoryLevelSave", JSON.stringify(memoryLevelSave));
    }


    can.addEventListener("mouseup", mouseUp, false);

    can.addEventListener("touchstart", handleStart, false);
    can.addEventListener("touchend", handleEnd, false);
    can.addEventListener("touchcancel", handleCancel, false);


    loopManager();
}

//Main game loop
function loopManager() {
    ct.clearRect(0, 0, can.width, can.height);
    if (state == 0) {
        drawMenu();
    } else {
        drawGameBoard();
    }
    requestAnimFrame(loopManager);
}

function handleStart(e) {
    e.preventDefault();
    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        touchStart = touches[i];
        break;
    }
}

function handleEnd(e) {
    e.preventDefault();
    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        touchEnd = touches[i];
        if (Math.abs(touchStart.pageX - touchEnd.pageX) < 10 && Math.abs(touchStart.pageY - touchEnd.pageY) < 10) {
            onTap(touchStart);
        }
        break;
    }
}

function handleCancel(e) {
    e.preventDefault();
    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        touchEnd = touches[i];
        if (Math.abs(touchStart.pageX - touchEnd.pageX) < 10 && Math.abs(touchStart.pageY - touchEnd.pageY) < 10) {
            onTap(touchStart);
        }
        break;
    }
}

//Custom onTap function
function onTap(position) {
    checkClick({
        "clientX": position.pageX,
        "clientY": position.pageY
    });

}

function mouseUp(e) {

    checkClick({
        "clientX": e.clientX,
        "clientY": e.clientY
    });

}


//Check if user clicked some button
function checkClick(e) {

    if (state == 0) {
        if (e.clientX > (width / 2 - 100) && e.clientX < (width / 2 - 10) && e.clientY > (height / 8 * 2 + 67) && e.clientY < (height / 8 * 2 + 67 + 50)) {
            currentLevel = 0;
            substate = 1;
            state = 1;
            isEasy = 1;


        }
        if (e.clientX > (width / 2 + 10) && e.clientX < (width / 2 + 100) && e.clientY > (height / 8 * 2 + 67) && e.clientY < (height / 8 * 2 + 67 + 50)) {
            currentLevel = 0;
            substate = 1;
            state = 1;
            isEasy = 0;

        }
        if (e.clientX > (width / 2 - 100) && e.clientX < (width / 2 - 10) && e.clientY > (height / 8 * 2 + 187) && e.clientY < (height / 8 * 2 + 187 + 50)) {
            currentLevel = 0;
            substate = 2;
            state = 1;
            isEasy = 1;
        }
        if (e.clientX > (width / 2 + 10) && e.clientX < (width / 2 + 100) && e.clientY > (height / 8 * 2 + 187) && e.clientY < (height / 8 * 2 + 187 + 50)) {
            currentLevel = 0;
            substate = 2;
            state = 1;
            isEasy = 0;
        }
        if (Math.sqrt((e.clientX - (width - 30)) * (e.clientX - (width - 30)) + (e.clientY - (height - 30)) * (e.clientY - (height - 30))) < 20) {
            document.getElementById("a").style.display = 'block';
        }
    }

    if (e.clientX > 20 && e.clientX < 110 && e.clientY > (height - 50) && e.clientY < (height - 10)) {
        state = 0;
        instate = 0;
        clearInterval(myInt1);
        currentLevel = 0;
        animateElement = -1;
        animateElementX = 0;
        animateElementXDown = 0;
        taskTempList = [];
        taskList = [];
    }
    if (state == 20) {
        if (e.clientX > ((width - 120) / 2) && e.clientX < ((width - 120) / 2 + 120) && e.clientY > (height - 150) && e.clientY < (height - 150 + 40)) {
            state = 0;
            clearInterval(myInt1);
            currentLevel = 0;
            animateElement = -1;
            animateElementX = 0;
            animateElementXDown = 0;
            taskTempList = [];
            taskList = [];
        }

        if (e.clientX > ((width - 120) / 2) && e.clientX < ((width - 120) / 2 + 120) && e.clientY > (height - 250) && e.clientY < (height - 250 + 40)) {

            state = 1;
            clearInterval(myInt1);
            currentLevel = 0;
            animateElement = -1;
            animateElementX = 0;
            animateElementXDown = 0;
            taskTempList = [];
            taskList = [];
        }
    }
    if (state == 16) {

        if (e.clientX > (width / 2 - 78) && e.clientX < (width / 2 - 78 + 158) && e.clientY > (height - 220) && e.clientY < (height - 220 + 158)) {

            var sqx = 158 - ((width / 2 - 78 + 158) - e.clientX);
            var sqy = 158 - ((height - 220 + 158) - e.clientY);

            if (sqx > 0 && sqx < 52 && sqy > 0 && sqy < 52) {
                clickOnSquare(1);
            } else if (sqx > 52 && sqx < 104 && sqy > 0 && sqy < 52) {
                clickOnSquare(2);
            } else if (sqx > 104 && sqx < 158 && sqy > 0 && sqy < 52) {
                clickOnSquare(3);
            } else if (sqx > 0 && sqx < 52 && sqy > 52 && sqy < 104) {
                clickOnSquare(4);
            } else if (sqx > 52 && sqx < 104 && sqy > 52 && sqy < 104) {
                clickOnSquare(5);
            } else if (sqx > 104 && sqx < 158 && sqy > 52 && sqy < 104) {
                clickOnSquare(6);
            } else if (sqx > 0 && sqx < 52 && sqy > 104 && sqy < 158) {
                clickOnSquare(7);
            } else if (sqx > 52 && sqx < 104 && sqy > 104 && sqy < 158) {
                clickOnSquare(8);
            } else if (sqx > 104 && sqx < 158 && sqy > 104 && sqy < 158) {
                clickOnSquare(9);
            }

        }
    }

}

//Check if the square user clicked is right one
function clickOnSquare(num) {
    var isok = false;
    if (substate == 1) {
        if (taskTempList.length > 0 && (num - 1) == taskTempList[0]) {
            isok = true;
        }
    } else {
        if (taskTempList.length > 0 && (num - 1) == taskTempList[taskTempList.length - 1]) {
            isok = true;
        }
    }
    if (isok) {
        resultColor = num - 1;
        resultAcuracy = String.fromCharCode(10003);
    } else {
        resultColor = num - 1;
        resultAcuracy = String.fromCharCode(10007);
        state = 20;
    }
    setTimeout(function () {
        resultColor = -1;
        resultAcuracy = "";
        if (substate == 1) {
            taskTempList.splice(0, 1);
        } else {
            taskTempList.pop();
        }
        if (taskTempList.length == 0) {
            if (state != 20) {
                instate = 1;
                state = 17;
            }
        }
    }, 1000);
}

//Function that draws main game menu
function drawMenu() {
    var fontSizeH = 50;
    if (height > width) {
        fontSizeH = width / 15 * 1.2;
    } else {
        fontSizeH = height / 8;
    }
    ct.textAlign = 'center';
    ct.font = "bold " + fontSizeH + "px Verdana, Geneva";
    ct.fillStyle = "white";
    ct.fillText("MemoryLevel", width / 2, height / 5);
    ct.font = "bold 15px Verdana, Geneva";
    ct.fillText("START NORMAL", width / 2, height / 8 * 2 + 50);
    ct.lineWidth = "2";
    ct.beginPath();
    ct.moveTo(width / 2 - 100, height / 8 * 2 + 60);
    ct.lineTo(width / 2 + 100, height / 8 * 2 + 60);
    ct.stroke();
    roundRect(width / 2 - 100, height / 8 * 2 + 67, 90, 50, 10, "EASY");
    ct.font = "bold 12px Verdana, Geneva";
    ct.fillText("Best:" + memoryLevelSave.normal.easy, width / 2 - 55, height / 8 * 2 + 111);

    roundRect(width / 2 + 10, height / 8 * 2 + 67, 90, 50, 10, "HARD");
    ct.font = "bold 12px Verdana, Geneva";
    ct.fillText("Best:" + memoryLevelSave.normal.hard, width / 2 + 55, height / 8 * 2 + 111);



    ct.font = "bold 15px Verdana, Geneva";
    ct.fillText("START REVERSE", width / 2, height / 8 * 2 + 170);
    ct.lineWidth = "2";
    ct.beginPath();
    ct.moveTo(width / 2 - 100, height / 8 * 2 + 180);
    ct.lineTo(width / 2 + 100, height / 8 * 2 + 180);
    ct.stroke();
    roundRect(width / 2 - 100, height / 8 * 2 + 187, 90, 50, 10, "EASY");
    ct.font = "bold 12px Verdana, Geneva";
    ct.fillText("Best:" + memoryLevelSave.reversed.easy, width / 2 - 55, height / 8 * 2 + 231);

    roundRect(width / 2 + 10, height / 8 * 2 + 170 + 17, 90, 50, 10, "HARD");
    ct.font = "bold 12px Verdana, Geneva";
    ct.fillText("Best:" + memoryLevelSave.reversed.hard, width / 2 + 55, height / 8 * 2 + 231);

    ct.beginPath();
    ct.arc(width - 30, height - 30, 20, 0, 2 * Math.PI);
    ct.stroke();
    ct.font = "bold 18px Verdana, Geneva";
    ct.fillText("?", width - 29, height - 23);


}

//Function for drawing game board with squares
function drawGameBoard() {

    var fontSizeH = (height - 220 - 40) / 10;
    ct.textAlign = 'center';
    ct.font = "bold " + fontSizeH + "px Verdana, Geneva";
    ct.fillStyle = "white";
    ct.fillText("MemoryLevel", width / 2, (height - 220 - 40) / 10 * 2);
    ct.textAlign = 'center';
    ct.font = "bold " + (fontSizeH - 10) + "px Verdana, Geneva";
    ct.fillStyle = "white";
    var bestscore = 0;
    if (substate == 1) {
        if (isEasy == 0) {
            bestscore = memoryLevelSave.normal.hard
        } else {
            bestscore = memoryLevelSave.normal.easy
        }
    } else {
        if (isEasy == 0) {
            bestscore = memoryLevelSave.reversed.hard
        } else {
            bestscore = memoryLevelSave.reversed.easy
        }
    }
    ct.fillText("Level:" + (currentLevel) + " Best:" + bestscore, width / 2, (height - 220 - 40) / 10 * 4);
    roundRect(20, height - 50, 90, 40, 10, "Back");
    var k = 0;
    for (var j = 0; j < 3; j++) {
        for (var i = 0; i < 3; i++) {
            //Check if element needs to be animated
            if (animateElement == k) {

                if (animateElementX < 6 && animateElementXDown == 0) {
                    animateElementX += 0.2;
                } else {
                    animateElementXDown = 1;
                    animateElementX -= 0.2;
                }
                ct.globalCompositeOperation = 'source-over';
                roundRect(width / 2 - 78 + (i * 52) - animateElementX, height - 220 + j * 52 - animateElementX, 50 + 2 * animateElementX, 50 + 2 * animateElementX, 10, "", colors[k++]);
            } else {
                ct.globalCompositeOperation = 'destination-over';
                roundRect(width / 2 - 78 + (i * 52), height - 220 + j * 52, 50, 50, 10, "", colors[k++]);
            }
        }
    }
    if (state == 1) {

        animateElement = -1;
        animateElementX = 0;
        animateElementXDown = 0;
        taskTempList = [];
        state = 11;
        startTaskSequence();
    }
    ct.textAlign = 'center';
    ct.font = "bold " + (fontSizeH - 10) + "px Verdana, Geneva";
    ct.fillStyle = "white";
    if (state == 12) {
        ct.fillText("Get ready", width / 2, (height - 220 - 40) / 10 * 6);
    }
    if (state == 14) {
        ct.fillText("Go!", width / 2, (height - 220 - 40) / 10 * 6);
    }

    if (state == 15) {
        ct.fillText("Your turn!", width / 2, (height - 220 - 40) / 10 * 6);
        roundRect(width / 2 - 25, height - 290, 50, 50, 10, "?");
    }
    if (state == 16) {
        if (resultColor != -1) {
            roundRect(width / 2 - 25, height - 290, 50, 50, 10, resultAcuracy, colors[resultColor]);
        } else {
            roundRect(width / 2 - 25, height - 290, 50, 50, 10, "?");
        }
    }
    if (state == 17) {
        taskTempList = [];
        animateElement = -1;
        animateElementX = 0;
        resultAcuracy = "";
        resultColor = -1;
        state = 19;
        setTimeout(function () {
            state = 1;
        }, 1000);

    }

    if (instate == 1) {
        ct.fillText("Next level!", width / 2, (height - 220 - 40) / 10 * 6);
    }

    if (state == 18) {
        ct.fillText("You loose!", width / 2, (height - 220 - 40) / 10 * 6);
        state = 20;
    }
    if (state == 20) {
        clearInterval(myInt1);
        ct.fillStyle = "rgba(0,0,0,0.8)";
        ct.fillRect(0, 0, width, height);
        ct.fillStyle = button_color;
        ct.textAlign = 'center';
        ct.fillText("You choose the wrong squares!", width / 2, 100, width);
        roundRect((width - 120) / 2, height - 150, 120, 40, 10, "Menu");
        roundRect((width - 120) / 2, height - 250, 120, 40, 10, "Try again");
    }

}

//Function for animating squares sequence
function startTaskSequence() {

    instate = 0;
    if (substate == 1) {
        if (isEasy == 0 && memoryLevelSave.normal.hard < currentLevel) {
            memoryLevelSave.normal.hard = currentLevel;
        }
        if (isEasy == 1 && memoryLevelSave.normal.easy < currentLevel) {
            memoryLevelSave.normal.easy = currentLevel;
        }
    } else {
        if (isEasy == 0 && memoryLevelSave.reversed.hard < currentLevel) {
            memoryLevelSave.reversed.hard = currentLevel;
        }
        if (isEasy == 1 && memoryLevelSave.reversed.easy < currentLevel) {
            memoryLevelSave.reversed.easy = currentLevel;
        }
    }
    //save curent score to local storage
    localStorage.setItem("memoryLevelSave", JSON.stringify(memoryLevelSave));

    if (substate == 2 && memoryLevelSave.reversed < currentLevel) {
        memoryLevelSave.reversed = currentLevel;
        localStorage.setItem("memoryLevelSave", JSON.stringify(memoryLevelSave));
    }
    currentLevel++;
    if (isEasy) {
        for (var i = 0; i < currentLevel - 1; i++) {

            taskTempList.push(taskList[i]);

        }
        var t = get1to9();
        taskTempList.push(t);
        taskList.push(t);
    } else {
        taskList = [];
        for (var i = 0; i < currentLevel; i++) {
            var t = get1to9();
            taskTempList.push(t);
            taskList.push(t);
        }
    }
    state = 12;
    var k = 0;

    myInt1 = setInterval(function () {
            if (state == 15 || state == 0) {
                if (state != 0) {
                    state = 16;
                }
                animateElement = -1;
                animateElementX = 0;
                animateElementXDown = 0;
                clearInterval(myInt1);
            }
            if (state == 14) {
                animateElementX = 0;
                animateElementXDown = 0;
                animateElement = taskList[k];

                k++;
                if (k == taskList.length + 1) {
                    animateElement = -1;
                    animateElementX = 0;
                    animateElementXDown = 0;
                    state = 15;

                }
            }
            if (state == 13) {
                state = 14;
            }
            if (state == 12) {

                state = 13;
            }

        },
        2000);
}

function get1to9() {
    return Math.floor(Math.random() * (9 - 1)) + 1;
}

//draw rectangle with curved angles and optional text inside
function roundRect(x, y, w, h, radius, text, colorFill) {

    var r = x + w;
    var b = y + h;

    ct.fillStyle = colorFill || "rgba(255, 255, 255, 0)";
    ct.beginPath();
    ct.strokeStyle = button_color;
    if (colorFill) {
        ct.lineWidth = "3";
    } else {
        ct.lineWidth = "4";
    }

    ct.moveTo(x + radius, y);
    ct.lineTo(r - radius, y);
    ct.quadraticCurveTo(r, y, r, y + radius);
    ct.lineTo(r, y + h - radius);
    ct.quadraticCurveTo(r, b, r - radius, b);
    ct.lineTo(x + radius, b);
    ct.quadraticCurveTo(x, b, x, b - radius);
    ct.lineTo(x, y + radius);
    ct.quadraticCurveTo(x, y, x + radius, y);
    if (colorFill) {
        ct.fill();
        ct.stroke();
    } else {
        ct.stroke();
    }
    ct.textAlign = 'center';
    if (h == w) {
        ct.globalCompositeOperation = 'source-over';
        ct.font = "bold " + (h - 20) + "px Verdana, Geneva";
        if (String.fromCharCode(10007) == text) {

            ct.fillStyle = "red";
        } else if (String.fromCharCode(10003) == text) {
            ct.fillStyle = "green";
        } else {
            ct.fillStyle = button_color;
        }
        ct.fillText(text, x + 25, y + 35);
    } else {
        ct.font = "bold " + (30 * h / w) + "px Verdana, Geneva";
        ct.fillStyle = button_color;
        ct.fillText(text, x + w / 2, y + h / 2 + 5);
    }

}

function hideAbout() {
    document.getElementById("a").style.display = 'none';
}