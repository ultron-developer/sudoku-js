var api_data = null;

var board = document.getElementById("board");
var selected_tile_id = null;
var level_header = document.getElementById("level-header");

const all_tiles = document.getElementsByClassName("tile");
for (let i = 0; i < all_tiles.length; i++) {
  all_tiles[i].addEventListener("click", unselect_all_tiles);
  all_tiles[i].innerHTML = "";
}

const all_digit_buttons = document.getElementsByClassName("btn-digit");
for (let k = 0; k < all_digit_buttons.length; k++) {
  all_digit_buttons[k].addEventListener("click", enter_digit);
}

var backspace_btn = document.getElementById("btn-backspace");
backspace_btn.addEventListener("click", backspace);

var clear_all_btn = document.getElementById("btn-clear-all");
clear_all_btn.addEventListener("click", clear_all);

game_start();

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

function clear_all() {
  if (selected_tile_id != null) {
    for (let i = 0; i < all_tiles.length; i++) {
      if (!all_tiles[i].classList.contains("fixed")) {
        all_tiles[i].innerHTML = "";
      }
    }
  }
}

function unselect_all_tiles() {
  if (selected_tile_id != null) {
    document.getElementById(selected_tile_id).style.backgroundColor = "white";
  }
  if (!this.classList.contains("fixed")) {
    selected_tile_id = this.id;
    this.style.backgroundColor = "#f2edaa";
  } else {
    selected_tile_id = null;
  }
}

function game_start() {
  let file = "https://sudoku-api.vercel.app/api/dosuku";
  fetch(file)
    .then((x) => x.text())
    .then((y) => loaded_data_transfer(y));
}

function loaded_data_transfer(data) {
  api_data = JSON.parse(data);
  change_level_heading(api_data.newboard.grids[0].difficulty);
  assign_initial_digits(api_data.newboard.grids[0].value);
}

function change_level_heading(level) {
  level_header.innerText = level;
  if (level == "Easy") {
    level_header.style.color = "Green";
  } else if (level == "Medium") {
    level_header.style.color = "Orange";
  } else {
    level_header.style.color = "red";
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

function hasClass(element, cls) {
  return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
}

let startBtn = document.getElementById("start");
let stopBtn = document.getElementById("stop");
let resetBtn = document.getElementById("reset");

let hour = 0;
let minute = 0;
let second = 0;
let count = 0;

timer = true;
stopWatch();

// stopBtn.addEventListener("click", function () {
//   timer = false;
// });

// resetBtn.addEventListener("click", function () {
//   timer = false;
//   hour = 0;
//   minute = 0;
//   second = 0;
//   count = 0;
//   document.getElementById("hr").innerHTML = "00";
//   document.getElementById("min").innerHTML = "00";
//   document.getElementById("sec").innerHTML = "00";
//   document.getElementById("count").innerHTML = "00";
// });

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
