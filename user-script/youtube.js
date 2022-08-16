const APP_NAME = "remote";
const CODE = "2345";

function triggerEvent( elem, event ) {
  var clickEvent = new Event( event ); // Create the event.
  elem.dispatchEvent( clickEvent );    // Dispatch the event.
}

// Mute a singular HTML5 element
function muteMe(elem) {
    elem.muted = true;
    // elem.pause();
}

// Try to mute all video and audio elements on the page
function mutePage() {
    document.querySelectorAll("video, audio").forEach( elem => muteMe(elem) );
}

const keyEvents = {
	go: (data) => location.href = data,
	back: () => history.back(),
	mute: () => mutePage(),
	vol_low: () => {
		const video = document.querySelector("video");
		video.muted = false;
		video.volume = Math.max(video.volume - 0.1, 0)
	},
	vol_high: () => {
		const video = document.querySelector("video");
		video.muted =false
		video.volume = Math.min(video.volume + 0.1, 1)
	},
	play: () => {
		document.querySelector("video").play()
	},
	pause: () => {
		document.querySelector("video").pause()
	},
	play_back: () => {
		const video = document.querySelector("video");
		video.currentTime = Math.max(video.currentTime - 30, 0);
	},
	play_forward: () => {
		const video = document.querySelector("video");
		video.currentTime = video.currentTime + 30;
	},
	play_skip_back: () => {
		document.querySelector(".ytp-prev-button.ytp-button").click();
	},
	play_skip_forward: () => {
		document.querySelector(".ytp-next-button.ytp-button").click();
	}
};

// MAIN
var first = true;
function init(initializeApp, database){
	
	// Your web app's Firebase configuration
	const firebaseConfig = {
	apiKey: "AIzaSyDyyDgNbMPiNAVgBfnpQ4JpB7zyutOb-kI",
	authDomain: "cccccccc-c06da.firebaseapp.com",
	databaseURL: "https://cccccccc-c06da.firebaseio.com",
	projectId: "cccccccc-c06da",
	storageBucket: "cccccccc-c06da.appspot.com",
	messagingSenderId: "593962810736",
	appId: "1:593962810736:web:b873e0cc22f6b16d"
	};
	
	// Initialize Firebase
	var firebaseApp = initializeApp(firebaseConfig);
	
	const db = database.getDatabase(firebaseApp);
    const ref = database.ref(db, `${APP_NAME}/${CODE}/signal`);
	database.onValue(ref, (snapshot)=>{
		if(!first){
			const val = snapshot.val();
			keyEvents[val?.key]?.(val?.data);
			console.log(val);
		}
		first = false;
	});
	console.log("init ok");
}


// Run in module
var script = document.createElement('script');
script.type = "module";
script.innerHTML = `
	import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
	import  * as database from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js";
	init(initializeApp, database);
`;
document.body.appendChild(script);