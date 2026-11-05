
const startScreen = document.getElementById("start-screen");
const game = document.getElementById("game");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const modalExtra = document.getElementById("modal-extra");
const records = document.getElementById("records");
const statusText = document.getElementById("status");

let seconds = 0;
let wrongCount = 0;
let discovered = [];
let gameStarted = false;

const $ = id => document.getElementById(id);

$("start-button").addEventListener("click", () => {
  startScreen.classList.add("hidden");
  game.classList.remove("hidden");
  gameStarted = true;
  updateStatus("あなたは閉じ込められた。");
});

setInterval(() => {
  if (!gameStarted) return;

  seconds++;

  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");

  $("timer").textContent = `${min}:${sec}`;

  // 時間によって部屋の情報が変化する
  if (seconds === 30) {
    updateStatus("……誰かがこちらを見ている。");
  }

  if (seconds === 60) {
    updateStatus("時計の針が動いた気がする。");
  }

  if (seconds === 120) {
    updateStatus("ここは本当に最初の部屋なのか？");
  }

  if (seconds === 180) {
    updateStatus("背後から小さな音が聞こえる。");
  }
}, 1000);

function updateStatus(text) {
  statusText.textContent = text;
}

function addRecord(text) {
  if (!discovered.includes(text)) {
    discovered.push(text);
  }

  records.innerHTML = "";

  discovered.forEach(item => {
    const p = document.createElement("p");
    p.textContent = "・" + item;
    records.appendChild(p);
  });
}

function openModal(title, text, extra = "") {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modalExtra.innerHTML = extra;
  modal.classList.remove("hidden");
}

$("close-modal").addEventListener("click", () => {
  modal.classList.add("hidden");
});

function investigate(object) {
  switch (object) {

    case "desk":
      addRecord("机の上の古いメモ");

      openModal(
        "古いメモ",
        "紙には文字が書かれている。\n\n「始まりは夜の八時。\n終わりは、長い針が八を指した時。\n時間を忘れるな。」\n\n裏側には小さく書かれている。\n\n『答えは4桁』"
      );

      updateStatus("机から古いメモを発見した。");
      break;

    case "clock":
      addRecord("止まった時計");

      openModal(
        "古い時計",
        "時計は20時40分を示している。\n\nしかし、秒針だけが動いている。\n\nよく見ると、文字盤の裏に文字がある。\n\n『時間は嘘をつかない。人間が嘘をつく。』"
      );

      updateStatus("時計の時間は20:40。");
      break;

    case "mirror":
      addRecord("鏡に書かれた文字");

      openModal(
        "古い鏡",
        "鏡には、あなたの姿が映っている。\n\nしかし、少しだけ違う。\n\n鏡の中のあなたは、こちらを見ていない。\n\n曇った鏡に文字が浮かび上がる。\n\n『答えを知っているのに、なぜ扉を開けない？』"
      );

      updateStatus("鏡の中に違和感がある。");
      break;

    case "door":
      openModal(
        "出口の扉",
        "扉には4桁の暗証番号を入力する装置がある。\n\nヒントは部屋の中に隠されている。\n\n間違えると何かが起こるかもしれない。",
        `
          <input
            id="password"
            type="text"
            inputmode="numeric"
            maxlength="4"
            placeholder="????"
            autocomplete="off"
          >
          <button id="submit-password">解除する</button>
        `
      );

      setTimeout(() => {
        const input = $("password");
        const submit = $("submit-password");

        if (!input || !submit) return;

        input.focus();

        submit.addEventListener("click", checkPassword);

        input.addEventListener("keydown", e => {
          if (e.key === "Enter") checkPassword();
        });
      }, 0);

      updateStatus("暗証番号を入力してください。");
      break;
  }
}

document.querySelectorAll(".object").forEach(button => {
  button.addEventListener("click", () => {
    investigate(button.dataset.object);
  });
});

function checkPassword() {
  const input = $("password");
  if (!input) return;

  const answer = input.value;

  if (answer === "2040") {
    modal.classList.add("hidden");
    game.classList.add("hidden");
    $("ending").classList.remove("hidden");

    gameStarted = false;
    return;
  }

  wrongCount++;

  let message = "暗証番号が違う。";

  if (wrongCount === 1) {
    message += "\n\nカチッ……。";
  } else if (wrongCount === 2) {
    message += "\n\n時計の音が大きくなった。";
  } else if (wrongCount === 3) {
    message += "\n\n鏡の中のあなたが笑った。";
  } else if (wrongCount >= 4) {
    message += "\n\n『まだ分からないの？』";
  }

  openModal("ERROR", message);

  updateStatus("暗証番号が拒否された。");
}
