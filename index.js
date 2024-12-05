var board = document.getElementById("board");
var selected_tile_id = null;

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
    document.getElementById(selected_tile_id).innerHTML = "";
  }
}

function clear_all() {
  if (selected_tile_id != null) {
    for (let i = 0; i < all_tiles.length; i++) {
      all_tiles[i].innerHTML = "";
    }
  }
}

function unselect_all_tiles() {
  for (let i = 0; i < all_tiles.length; i++) {
    all_tiles[i].classList.remove("selected-tile");
    all_tiles[i].style.backgroundColor = "white";
  }
  selected_tile_id = this.id;
  this.style.backgroundColor = "Gainsboro";
}
