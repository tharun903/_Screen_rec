let video = document.querySelector("video");
let recordbtncont = document.querySelector(".recorder-btn-container")
let recordbtn = document.querySelector(".record-btn")
let capturebtncontent = document.querySelector(".caputure-btn-container")
let capturebtn = document.querySelector(".caputure-btn")

let transparentcolor = "transparent";

let recordflag = false;
let recorder;
let chunks = [] // 

let constrains = {
    video : true,
    audio : true
}

navigator.mediaDevices.getUserMedia(constrains)
.then((stream)=>{
    // console.log(stream);
    video.srcObject= stream;
    recorder = new MediaRecorder(stream)
    recorder.addEventListener("start",(e)=>{
        chunks = [] ;
    })
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>{
        //convert media chunks data to video
        let blob = new Blob(chunks,{type: "video/mp4"});
        let videoURL = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = videoURL;
        a.download = "stream.mp4";
        a.click();
    })

    recordbtncont.addEventListener("click",(e)=>{
        if(!recorder) return;
        recordflag = !recordflag;
        if(recordflag){
            recorder.start();
            recordbtn.classList.add("scale-record");
            starttimer()
        }else{
            recorder.stop();
            recordbtn.classList.remove("scale-record");
            stoptimer()
        }
    })
});


let timerId;
let counter = 0;
let timer = document.querySelector(".timer");
function starttimer(){
    timer.style.display = "block";
    function displayTimer(){
        /*How to calculate the time
        1) initiate counter
        2)whenever these function display timer is called we need to increment the counter variable,as each call of these function 1 sec as regular time*/
        let totalsec = counter;
        let hours = Number.parseInt(totalsec/3600);
        totalsec = totalsec%3600;
        let min = Number.parseInt(totalsec/60);
        totalsec = totalsec;
        let sec = totalsec

        hours = (hours<10)?`0${hours}`:hours;

        min = (min<10)?`0${min}`:min;

        sec = (sec<10)?`0${sec}`:sec;


        timer.innerText = `${hours}:${min}:${sec}`
        counter++;
    }
    timerId = setInterval(displayTimer,1000)

}
function stoptimer(){
    clearInterval(timerId);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
}

//video actually captured in chuncks will have


capturebtncontent.addEventListener("click",(e)=>{
    capturebtn.classList.add("scale-capture");//adding animation
    
    

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let imageURL = canvas.toDataURL("image/jpeg", 1.0);

    let tool = canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    //filter
    tool.fillStyle = transparentcolor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let a = document.createElement('a');
    a.href = imageURL;
    a.download = "Image.jpeg";
    a.click();

    setTimeout(() => {
        capturebtn.classList.remove("Scale-capture");
    }, 500);

    

})

//filtering logic
let filter = document.querySelector(".filter-layer");

let allfilters = document.querySelectorAll(".filter");
allfilters.forEach((filterElem)=>{
    filterElem.addEventListener("click",(e)=>{
        //getting a style
        transparentcolor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor = transparentcolor;
    });
});