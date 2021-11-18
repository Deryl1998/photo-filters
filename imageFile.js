const {nativeImage,ipcRenderer, systemPreferences} = require('electron');
const fs = require('fs');
var ref = require('ref-napi');


let image = null;
let canvas =  document.querySelector("#working_area");
let imgObj = null;

function loadImage(){
    imgObj.src = image.toDataURL();
}

async function chooseImage(){
        let file = await ipcRenderer.invoke("select-image-popup",true);
        image = nativeImage.createFromPath(file.filePaths[0]);
      
        const width = image.getSize().width;
        const height = image.getSize().height;
        canvas = document.querySelector("#working_area");
        canvas.width = width;
        canvas.height = height;
        imgObj = document.createElement("img");
        imgObj.onload = ()=>{
             const ctx = canvas.getContext("2d");
             ctx.drawImage(imgObj, 0, 0);
        }
    imgObj.src = image.toDataURL();
}


async function saveImage(){
    let path = await ipcRenderer.invoke("save-image",true);
    var MIME_TYPE = "image/png";
    fs.writeFile(path.filePath, nativeImage.createFromDataURL(canvas.toDataURL()).toJPEG(100) , (err) => {
            if (err) {
              alert('Nie zapisano' + err.message);
              return
            }
            alert('Zapisano pomyslnie');
    })
}

function saveNewImageData(newImageData){
    const canvas = document.querySelector("#working_area");
    const ctx = canvas.getContext("2d");
    ctx.putImageData(newImageData, 0, 0);
}

function getImageData(){
    const width = image.getSize().width;
    const height = image.getSize().height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0,0, width, height);
    return imageData;
}