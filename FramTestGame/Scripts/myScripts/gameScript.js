var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag
var _debug = $('debug');    // makes life easier
var isMoving = false;
var currentStep = 1;
var duration = 300;
var currentTime = 300;

InitDragDrop();

function InitDragDrop() {
    document.onmousedown = OnMouseDown;
    document.onmouseup = OnMouseUp;
}

function OnMouseDown(e) {
    if (isMoving) return;
    // IE is retarded and doesn't pass the event object
    if (e == null)
        e = window.event;

    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;

    _debug.innerHTML = target.className == 'drag'
        ? 'draggable element clicked'
        : 'NON-draggable element clicked';

    // for IE, left click == 1
    // for Firefox, left click == 0
    if ((e.button == 1 && window.event != null ||
        e.button == 0) &&
        target.className == 'drag') {
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;

        // grab the clicked element's position
        _offsetX = ExtractNumber(target.style.left);
        _offsetY = ExtractNumber(target.style.top);

        // bring the clicked element to the front while it is being dragged
        _oldZIndex = target.style.zIndex;
        target.style.zIndex = 10000;

        // we need to access the element in OnMouseMove
        _dragElement = target;

        // tell our code to start moving the element with the mouse
        document.onmousemove = OnMouseMove;

        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function () { return false; };

        // prevent text selection (except IE)
        return false;
    }
}

function OnMouseMove(e) {
    if (e == null)
        var e = window.event;

    // this is the actual "drag code"
    _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
    _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';

    //_debug.innerHTML = '(' + _dragElement.style.left + ', ' + _dragElement.style.top + ')';   
    _debug.innerHTML = '(' + e.clientX + ', ' + e.clientY + ')';
}

function OnMouseUp(e) {
    if (_dragElement != null) {
        _dragElement.style.zIndex = _oldZIndex;

        // we're done with these events until the next OnMouseDown
        document.onmousemove = null;
        document.onselectstart = null;

        // calculate if it collide the table and it match the queue
        _dragElement.ondragstart = null;
        var dragId = _dragElement.id.split("_")[1];
        var m_td = document.getElementById("m_td");
        var m_table = document.getElementById("m_table");
        var isCollied = overlaps(_dragElement, m_table);
        console.log(isCollied);
        if (!isCollied || dragId != currentStep) {
            moveObject(_dragElement, e.clientX, e.clientY, _startX, _startY, 300);
        }
        else {
            m_td.innerText += " " + _dragElement.innerText;
            _dragElement.style.left = 0;
            _dragElement.style.top = 0;
            _dragElement.parentNode.removeChild(_dragElement);
            currentStep++;
            if (currentStep > 5) {
                var _score = document.getElementById("_score");
                _score.setAttribute("value", currentTime);
                console.log("Game End With Score " + currentTime);
                window.location.href = '/Game/Win/' + currentTime;
            }
        }
        // this is how we know we're not dragging      
        _dragElement = null;

        _debug.innerHTML = 'mouse up';
    }
}

function ExtractNumber(value) {
    var n = parseInt(value);

    return n == null || isNaN(n) ? 0 : n;
}

// this is simply a shortcut for the eyes and fingers
function $(id) {
    return document.getElementById(id);
}

function moveObject(object, startX, startY, endX, endY, speed) {
    console.log("start moving");
    var elapsed = 0.01;
    var currentX, currentY;
    // On starting movement
    var distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    var directionX = (endX - startX) / distance;
    var directionY = (endY - startY) / distance;
    // object.style.left = startX;
    // object.style.top = startY;
    isMoving = true;
    currentX = startX;
    currentY = startY;
    var id = setInterval(frame, 5);
    function frame() {
        if (currentX == endX) {
            clearInterval(id);
            isMoving = false;
        } else {
            if (isMoving == true) {
                currentX += directionX * speed * elapsed;
                currentY += directionY * speed * elapsed;
                console.log('(' + currentX + ', ' + currentY + ')');
                if (Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)) >= distance) {
                    object.style.left = (_offsetX + endX - _startX) + 'px';
                    object.style.top = (_offsetY + endY - _startY) + 'px';
                    console.log('(' + object.style.left + ', ' + object.style.top + ')');
                    isMoving = false;
                    clearInterval(id);
                    return;
                }
            }
            object.style.left = (_offsetX + currentX - _startX) + 'px';
            object.style.top = (_offsetY + currentY - _startY) + 'px';
        }
    }
}

var overlaps = (function () {
    function getPositions(elem) {
        var pos = {}, width, height;
        pos.left = elem.getBoundingClientRect().left;
        pos.top = elem.getBoundingClientRect().top;
        width = elem.clientWidth;
        height = elem.clientHeight;
        return [[pos.left, pos.left + width], [pos.top, pos.top + height]];
    }

    function comparePositions(p1, p2) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function (a, b) {
        var pos1 = getPositions(a),
            pos2 = getPositions(b);
        return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1]);
    };
})();

var overlapsByPos = (function () {
    function getPositions(pos, elem) {
        var width, height;
        width = elem.clientWidth;
        height = elem.clientHeight;
        return [[pos.left, pos.left + width], [pos.top, pos.top + height]];
    }

    function comparePositions(p1, p2) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function (pos, b) {
        var pos1 = getPositions(pos, b),
            pos2 = getPositions({ left: b.style.left, top: b.style.top }, b);
        return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1]);
    };
})();

function startTimer(duration, display) {
    currentTime = duration;
    var minutes, seconds;   
    var m_timer = setInterval(function () {
        minutes = parseInt(currentTime / 60, 10)
        seconds = parseInt(currentTime % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--currentTime < 0) {
            window.location.href = '/Home/Index';
        }
    }, 1000);
}

window.onload = function () {
    var fiveMinutes = duration,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
    randomPosition();
};

function randomPosition() {
    var drags = document.getElementsByClassName("drag");
    for (var i = 0; i < drags.length; i++) {
        var elem = drags[i];
        var pos = { left: 0, top: 0 };
        while (checkOverlay(pos, drags)) {
            pos.left = Math.random() * 700 + 50;
            pos.top = Math.random() * 10 + 50;
        }

        elem.style.left = pos.left + "px";
        elem.style.top = pos.top + "px";
    }
}

function checkOverlay(pos, drags) {
    for (var i = 0 ; i < drags.length ; i++) {
        if (overlapsByPos(pos, drags[i])) {
            return true;
        }
    }
    return false;
}