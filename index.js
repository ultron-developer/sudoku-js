window.addEventListener("beforeunload", (evt) => {
  // Recommended
  evt.preventDefault();
  // Included for legacy support, e.g. Chrome/Edge < 119
  evt.returnValue = true;
});

var api_data = null;
var errors = 0;

var board = document.getElementById("board");
var selected_tile_id = null;
var level_header = document.getElementById("level-header");

const all_tiles = document.getElementsByClassName("tile");
for (let i = 0; i < all_tiles.length; i++) {
  all_tiles[i].addEventListener("click", unselect_all_tiles);
  all_tiles[i].innerHTML = "";
}

let hour = 0;
let minute = 0;
let second = 0;
let count = 0;

var div_no1 = document.getElementById("1st-two-btn");
var div_no2 = document.getElementById("2nd-two-btn");
div_no2.style.display = "none";

// Modals

var Modal_clear_all = document.getElementById("clear-all-modal-popup");

var Modal_start = document.getElementById("start-modal-popup");

// Buttons

const all_digit_buttons = document.getElementsByClassName("btn-digit");
for (let k = 0; k < all_digit_buttons.length; k++) {
  all_digit_buttons[k].addEventListener("click", enter_digit);
}

var backspace_btn = document.getElementById("btn-backspace");
backspace_btn.addEventListener("click", backspace);

var clear_all_btn = document.getElementById("btn-clear-all");
clear_all_btn.addEventListener("click", clear_all_btn_clicked);

var clearall_yes = document.getElementById("btn-clearall-yes");
clearall_yes.addEventListener("click", clear_all);

var clearall_cancel = document.getElementById("btn-clearall-cancel");
clearall_cancel.addEventListener("click", function () {
  change_bgcolor_of_all_tiles_gray();
  start_timer();
  Modal_clear_all.style.display = "none";
});

var timer_heading = document.getElementById("timer");
timer_heading.addEventListener("dblclick", auto_fill);

var Start_btn = document.getElementById("btn-start");
Start_btn.addEventListener("click", game_start);

var Check_btn = document.getElementById("btn-final-check");
Check_btn.addEventListener("click", final_validation);

var Play_again_btn = document.getElementById("btn-play-again");
Play_again_btn.addEventListener("click", play_again);

// Keyboard key press event listner
document.addEventListener("keydown", function (event) {
  if (selected_tile_id != null) {
    if (event.keyCode >= 97 && event.keyCode <= 105) {
      document.getElementById(selected_tile_id).innerHTML = event.keyCode - 96;
    } else if (event.keyCode >= 49 && event.keyCode <= 57) {
      document.getElementById(selected_tile_id).innerHTML = event.keyCode - 48;
    }
    if (event.keyCode == 8) {
      backspace();
    }
  }
});

function enter_digit() {
  if (selected_tile_id != null) {
    document.getElementById(selected_tile_id).innerHTML = this.innerHTML;
  }
}

function backspace() {
  if (selected_tile_id != null) {
    if (
      !document.getElementById(selected_tile_id).classList.contains("fixed")
    ) {
      document.getElementById(selected_tile_id).innerHTML = "";
    }
  }
}

function clear_all_btn_clicked() {
  timer = false;
  Modal_clear_all.style.display = "block";
}

function clear_all() {
  start_timer();
  for (let i = 0; i < all_tiles.length; i++) {
    if (!all_tiles[i].classList.contains("fixed")) {
      all_tiles[i].innerHTML = "";
    }
  }
  change_bgcolor_of_all_tiles_gray();
  Modal_clear_all.style.display = "none";
}

function unselect_all_tiles() {
  change_bgcolor_of_all_tiles_gray();
  if (selected_tile_id != null) {
    document.getElementById(selected_tile_id).style.backgroundColor = "white";
  }
  if (!this.classList.contains("fixed")) {
    selected_tile_id = this.id;
    this.style.backgroundColor = "#aaf7ff";
  } else {
    selected_tile_id = null;
  }
}

function change_bgcolor_of_all_tiles_gray() {
  for (let i = 0; i < all_tiles.length; i++) {
    if (!all_tiles[i].classList.contains("fixed")) {
      all_tiles[i].style.backgroundColor = "white";
    }
  }
}

function game_start() {
  div_no1.style.display = "block";
  div_no2.style.display = "none";
  Modal_start.style.display = "none";
  let file = "https://sudoku-api.vercel.app/api/dosuku";
  fetch(file)
    .then((x) => x.text())
    .then((y) => loaded_data_transfer(y));
}

function play_again() {
  for (let i = 0; i < all_tiles.length; i++) {
    all_tiles[i].style.backgroundColor = "white";
    all_tiles[i].classList.remove("fixed");
    all_tiles[i].innerHTML = "";
  }
  timer = false;
  hour = 0;
  minute = 0;
  second = 0;
  count = 0;
  game_start();
}

function loaded_data_transfer(data) {
  api_data = JSON.parse(data);
  change_level_heading(api_data.newboard.grids[0].difficulty);
  assign_initial_digits(api_data.newboard.grids[0].value);
  start_timer();
}

function change_level_heading(level) {
  level_header.innerText = level;
  if (level == "Easy") {
    level_header.style.backgroundColor = "Green";
  } else if (level == "Medium") {
    level_header.style.backgroundColor = "#db9107";
  } else {
    level_header.style.backgroundColor = "red";
  }
}

function assign_initial_digits(numbers) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (numbers[i][j] != 0) {
        document.getElementById(i + "-" + j).innerHTML = numbers[i][j];
        document.getElementById(i + "-" + j).classList.add("fixed");
      }
    }
  }
}
function final_validation() {
  errors = 0;
  solution = api_data.newboard.grids[0].solution;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!document.getElementById(i + "-" + j).classList.contains("fixed")) {
        if (document.getElementById(i + "-" + j).innerText == "") {
          document.getElementById(i + "-" + j).style.backgroundColor =
            "#fffaaa";
          errors++;
        } else if (
          solution[i][j] != document.getElementById(i + "-" + j).innerText
        ) {
          document.getElementById(i + "-" + j).style.backgroundColor =
            "#ffb9aa";
          errors++;
        } else {
          document.getElementById(i + "-" + j).style.backgroundColor =
            "#bfffaa";
        }
      }
    }
  }
  if (errors == 0) {
    timer = false;
    div_no1.style.display = "none";
    div_no2.style.display = "block";
    //document.getElementById("winning-msg").innerText = "You have solved sudoku in " + minute + " minutes & " + second + " seconds."
    document.getElementById("min_str").innerText = minute;
    document.getElementById("sec_str").innerText = second;
  }
}

function start_timer() {
  timer = true;
  stopWatch();
}

function stopWatch() {
  if (timer) {
    count++;

    if (count == 100) {
      second++;
      count = 0;
    }

    if (second == 60) {
      minute++;
      second = 0;
    }

    let hrString = hour;
    let minString = minute;
    let secString = second;
    let countString = count;

    if (hour < 10) {
      hrString = "0" + hrString;
    }

    if (minute < 10) {
      minString = "0" + minString;
    }

    if (second < 10) {
      secString = "0" + secString;
    }

    if (count < 10) {
      countString = "0" + countString;
    }

    // document.getElementById("timer").innerHTML = hrString;
    document.getElementById("timer").innerHTML = minString + ":" + secString;
    //document.getElementById("timer").innerHTML = secString + ":" + countString;

    setTimeout(stopWatch, 10);
  }
}

function auto_fill() {
  answer = api_data.newboard.grids[0].solution;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (answer[i][j] != 0) {
        document.getElementById(i + "-" + j).innerHTML = answer[i][j];
      }
    }
  }
}
