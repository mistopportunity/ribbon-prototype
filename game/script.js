//https://stackoverflow.com/a/49371349/3967379
function drawCurve(points, tension) {
    context.beginPath();
    context.lineWidth=canvas.clientWidth * 0.01;
    context.moveTo(points[0].x, points[0].y);

    var t = (tension != null) ? tension : 1;
    for (var i = 0; i < points.length - 1; i++) {
        var p0 = (i > 0) ? points[i - 1] : points[0];
        var p1 = points[i];
        var p2 = points[i + 1];
        var p3 = (i != points.length - 2) ? points[i + 2] : p2;

        var cp1x = p1.x + (p2.x - p0.x) / 6 * t;
        var cp1y = p1.y + (p2.y - p0.y) / 6 * t;

        var cp2x = p2.x - (p3.x - p1.x) / 6 * t;
        var cp2y = p2.y - (p3.y - p1.y) / 6 * t;

        context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    context.stroke();
}
//https://stackoverflow.com/a/47593316/3967379
var LCG=s=>()=>(2**31-1&(s=Math.imul(48271,s)))/2**31;

function getRandomRange(rand,min,max) {
    return Math.floor(rand() * (max - min + 1) + min);
}

function usi(value) {
    updateUserInput(value);
}
function updateUserInput(value) {
    userInput = value.split("");
    for(var i = 0;i<7;i++) {
        userLettersElements[i].textContent = userInput[i];
    }
}

function udsi(value) {
    updateDrawStringInput(value);
}
function updateDrawStringInput(value) {
    drawStringInput = value.split("");
    for(var i = 0;i<7;i++) {
        ribbonLettersElements[i].textContent = drawStringInput[i];
    }
    drawString();
}


function drawString() {
    var seed = 0;
    for(var i = 0;i<7;i++) {
        seed += drawStringInput[i].charCodeAt(0);
    }
    var rand = LCG(seed);

    //Horizontal points going across the whole area
    var points = 8;

    var pointArray = [];

    //5 is straight through middle, values are premutiplied with 10 possible positions
    var minHeight = 1;
    var maxHeight = 4;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    for(var i = 0;i<points;i++) {
        pointArray.push({
            x: (i / (points-1)) * canvas.width,
            y: (getRandomRange(rand,minHeight,maxHeight) / 10) * canvas.height,
        });
    }

    drawCurve(pointArray,1);

}

var selectedElement = null;
var inDropDownMenu = false;
function SelectElement(element) {
    if(selectedElement === element) {
        return;
    } else {
        if(selectedElement !== null) {
            selectedElement.classList.remove("selected");
            selectedElement = null;
        }
        element.classList.add("selected");
        selectedElement = element;
        console.log("Selected: " + element.id);
    }
}
function elementHoverEnd(element) {
    if(selectedElement !== null) {
        selectedElement.classList.remove("selected");
        selectedElement = null;
    }
}
function defFoc() {
    if(selectedElement === null) {
        if(!inDropDownMenu) {
            SelectElement(defaultFocusElement);       
        } else {
            SelectElement(defaultDropDownElement);
        }
        return false;
    } else {
        return true;
    }
}
function focusUp() {
    if(defFoc()) {
        if(!inDropDownMenu) {
            if(selectedElement.id.startsWith("n")) {
                if(selectedElement.id.substr(1,1) <= 3) {
                    SelectElement(leftInsert);
                } else {
                    SelectElement(rightInsert);
                }
            } else if(selectedElement.id.endsWith("insert")) {
                userInterfaceClick(popoutButton);
            } else if(selectedElement.id == "popout_button") {
                userInterfaceClick(popoutButton);
            }
        } else {
            var number = Number(selectedElement.id.substr(1,1)) - 1;
            if(number < 0) {
                userInterfaceClick(popoutButton);
            } else {
                SelectElement(document.getElementById(`p${number}`));
            }
            //todo
        }
    }
}

function focusDown() {
    if(defFoc()) {
        if(!inDropDownMenu) {
            switch(selectedElement.id) {
                case "popout_button":
                    SelectElement(leftInsert);
                    break;
                case "left_insert":
                    SelectElement(document.getElementById("n0"));
                    break;
                case "right_insert":
                    SelectElement(document.getElementById("n6"));
                    break;
            }
            if(selectedElement.id == "popout_button") {
                SelectElement(leftInsert);
            }
        } else {
            var number = Number(selectedElement.id.substr(1,1))+1;
            if(number < dropDownItemCount) {
                SelectElement(document.getElementById(`p${number}`));
            } else {
                userInterfaceClick(popoutButton);
            }
        }
    }
}
function focusLeft() {
    if(defFoc()) {
        if(!inDropDownMenu) {
            if(selectedElement.id.startsWith("n")) {
                var number = selectedElement.id.substr(1,1);
                if(number > 0) {
                    number--;
                } else {
                    number = 6;
                }
                SelectElement(document.getElementById(`n${number}`));
            } else if(selectedElement.id == "right_insert") {
                SelectElement(leftInsert);
            } else if(selectedElement.id == "left_insert") {
                SelectElement(rightInsert);
            }
        } else {
            focusUp();
        }
    }
}

function focusRight() {
    if(defFoc()) {
        if(!inDropDownMenu) {
            if(selectedElement.id.startsWith("n")) {
                var number = selectedElement.id.substr(1,1);
                if(number < 6) {
                    number++;
                } else {
                    number = 0;
                }
                SelectElement(document.getElementById(`n${number}`));
            } else if(selectedElement.id == "left_insert") {
                SelectElement(rightInsert);
            } else if(selectedElement.id == "right_insert") {
                SelectElement(leftInsert);
            }
        } else {
            focusDown();
        }
    }
}

function userInterfaceBack() {
    if(inDropDownMenu) {
        userInterfaceClick(popoutButton);
    }
}

function userInterfaceClick(element) {
    if(!element) {
        element = selectedElement;
    } else {
        SelectElement(element);
    }
    if(element) {
        console.log("Clicked: " + element.id);
        if(!inDropDownMenu) {
            switch(element.id) {
                case "popout_button":
                    popout.classList.remove("hidden");
                    inDropDownMenu = true;
                    SelectElement(defaultDropDownElement);
                    break;
                case "left_insert":
                    break;
                case "right_insert":
                    break;
                default:
                    selectedElement.classList.toggle("activated");
                    break;
            }
        } else {
            switch(element.id) {
                case "popout_button":
                    popout.classList.add("hidden");
                    inDropDownMenu = false;
                    break;
            }
        }
    }
}
var userLettersElements;
var ribbonLettersElements;
var userInput;
var drawStringInput;
var leftInsert;
var rightInsert;
var defaultFocusElement;
var defaultDropDownElement;
var middleInput;
var canvas;
var context;
var popoutButton;
var scoreSpan;
var popout;
var timerBarChild;
var dropDownItemCount;
function RegisterDom() {
    userLettersElements = document.getElementById("number_bar").children[0].children;
    ribbonLettersElements = document.getElementById("ribbon_letters").children;
    leftInsert = document.getElementById("left_insert");
    rightInsert = document.getElementById("right_insert");
    middleInput = document.getElementById("middle_input");
    canvas = document.getElementById("overlay_canvas");
    context = canvas.getContext("2d");
    defaultFocusElement = userLettersElements[0];
    popoutButton = document.getElementById("popout_button");
    scoreSpan = document.getElementById("score_span");
    popout = document.getElementById("popout");
    timerBarChild = document.getElementById("timer_bar_child");
    defaultDropDownElement = document.getElementById("p0"); //todo set to first true element
    dropDownItemCount = popout.childElementCount;
}
function RegisterInputEvents() {
    InputSchematic.Up = focusUp;
    InputSchematic.Down = focusDown;
    InputSchematic.Left = focusLeft;
    InputSchematic.Right = focusRight;
    InputSchematic.Enter = userInterfaceClick;
    InputSchematic.Back = userInterfaceBack;
}
function SetupStuffAndDoStuffAndStuff() {

    RegisterDom();

    for(var i = 0;i<7;i++) {

        (function(fuckYouJavascript) {

            fuckYouJavascript.addEventListener("mouseover", function() {
                SelectElement(fuckYouJavascript);
            });
            fuckYouJavascript.addEventListener("mouseout", function() {
                elementHoverEnd(fuckYouJavascript);
            });

            fuckYouJavascript.addEventListener("click",function() {
                userInterfaceClick(fuckYouJavascript);
            });

        })(userLettersElements[i]);

    }

    leftInsert.addEventListener("mouseover",function() {
        SelectElement(leftInsert);
    });

    leftInsert.addEventListener("mouseout",function() {
        elementHoverEnd(leftInsert);
    });

    rightInsert.addEventListener("mouseover",function() {
        SelectElement(rightInsert);
    });

    rightInsert.addEventListener("mouseout",function() {
        elementHoverEnd(rightInsert);
    });

    leftInsert.addEventListener("click",function() {
        userInterfaceClick(leftInsert);
    });

    rightInsert.addEventListener("click",function() {
        userInterfaceClick(rightInsert);
    });

    popoutButton.addEventListener("mouseout",function() {
        elementHoverEnd(popoutButton);
    });

    popoutButton.addEventListener("mouseover",function() {
        SelectElement(popoutButton);
    });

    popoutButton.addEventListener("click",function() {
        userInterfaceClick(popoutButton);
    });

    BeginGameRuntime();

    window.addEventListener("resize",function() {
        drawString();
    });
    RegisterInputEvents();
}
function SetMiddleInput(input) {
    if(!input) {
        middleInput.classList.add("hidden");
        middleInput.textContent = "";
        return;
    }
    //todo format the text content to include dashes between letters
    middleInput.textContent = input;
    middleInput.classList.remove("hidden");
}
function SetScore(score) {
    scoreSpan.textContent = score;
    //todo format the score to include commas
}
function SetTimerBar(normalizedPercent) {
    timerBarChild.style.width = `${normalizedPercent * 100}%`;
}
function BeginGameRuntime() {
    updateDrawStringInput("abcdefg");
    updateUserInput("abcdefg");
    SetScore(0);
    SetTimerBar(0);
    SetMiddleInput();
    drawString();
}
SetupStuffAndDoStuffAndStuff();