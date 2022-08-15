const APP_NAME = "remote";


var codes = JSON.parse(localStorage.codes || "[]"); /// load saved codes

function setCodes(codes) {
  const select = document.getElementById("code");
  select.innerHTML = "";
  for (const code of codes.slice().reverse()) {
    var opt = document.createElement("option");
    opt.value = code.code;
    opt.innerHTML = code.name;
    select.appendChild(opt);
  }
  localStorage.codes = JSON.stringify(codes);
}
setCodes(codes);

/*  play button */
const play = document.querySelector(".play");
const pause = document.querySelector(".pause");
const wave1 = document.querySelector(".circle__back-1");
const wave2 = document.querySelector(".circle__back-2");

/* add button */
const add = document.getElementById("add");
const iadd = document.getElementById("i_add");
const iclose = document.getElementById("i_close");

function toggleForm() {
  document.getElementById("s_code_form").classList.toggle("hide");
  document.getElementById("i_code_form").classList.toggle("hide");
  document.getElementById("i_name_form").classList.toggle("hide");
}

add.addEventListener("click", () => toggleForm());
iclose.addEventListener("click", () => toggleForm());

iadd.addEventListener("click", () => {
  toggleForm();
  const code = {
    code: document.getElementById("i_code").value,
    name: document.getElementById("i_name").value
  };
  codes.push(code);
  setCodes(codes);
});

/*  buttons */
const buttonIds = [
  "go",
  "back",
  "mute",
  "up",
  "down",
  "vol_low",
  "vol_high",
  "enter",
  "play_back",
  "play_pause",
  "play_forward",
  "play_skip_back",
  "play_skip_forward"
];


function send(key){
    navigator.vibrate(200);
    try{
    const code = document.getElementById("code").value;
    const db = window.database.getDatabase(window.firebaseApp);
    const ref = window.database.ref(db, `${APP_NAME}/${code}`);
    window.database.set(ref, {
        key: key,
        data: document.getElementById("url").value,
        timestamp: new Date().getTime()
    });
    }catch(e){
    console.error(e);
    }
}

const clickEvents = {
  play_pause: (target, e) => {
    e.preventDefault();
    pause.classList.toggle("visibility");
    play.classList.toggle("visibility");
    target.classList.toggle("shadow");
    wave1.classList.toggle("paused");
    wave2.classList.toggle("paused");

    if (play.className.includes("visibility")){
        send("pause");
    }else{
        send("play");
    }
  }
};
const buttons = buttonIds.reduce((dic, id) => {
  dic[id] = document.getElementById(id);
  return dic;
}, {});
Object.keys(buttons).forEach((key) => {
  buttons[key].addEventListener("click", function (e) {
    // custom event
    if (clickEvents[key]) {
      clickEvents[key](buttons[key], e);
    } else {
      // default event
      send(key);
    }
  });
});
