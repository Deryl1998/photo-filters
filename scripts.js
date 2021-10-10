const {nativeImage,ipcRenderer} = require('electron');
const fs = require('fs');

    let image = null;
    let canvas =  document.querySelector("#working_area");
    let imgObj = null;

    async function chooseImage(){
        let file = await ipcRenderer.invoke("select-image-popup",true);
        image = nativeImage.createFromPath(file.filePaths[0]);
        loadImage();
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

    function loadImage(){
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

function saveNewImageData(newImageData){
    const canvas = document.querySelector("#working_area");
    const ctx = canvas.getContext("2d");
    ctx.putImageData(newImageData, 0, 0);
}

function getImageData(){
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0,0, width, height);
    return imageData;
}

function brightUp(oldImageData){
    const oldData = oldImageData.data;
    const width = oldImageData.width;
    const delta = document.getElementById('brightnessRange').value;
    for(let row = 0; row < oldImageData.height; row++){
        for(let column = 0; column < width; column++){
            for(let pixel = 0; pixel < 3; pixel++){
                oldData[4*(row * width + column) + pixel] += 10 * delta;
            }
        }
    }
    return oldImageData;
}

function brightness(){
    const oldImageData = getImageData();
    saveNewImageData(brightUp(oldImageData));
}

function contrastUp(oldImageData){
    const oldData = oldImageData.data;
    const width = oldImageData.width;
    const contrast = document.getElementById('contrastRange').value;
    for(let row = 0; row < oldImageData.height; row++){
        for(let column = 0; column < width; column++){
            for(let pixel = 0; pixel<=2; pixel++){
                oldData[4*(row * width + column) + pixel] -=128;
                oldData[4*(row * width + column) + pixel] *= contrast;
                oldData[4*(row * width + column) + pixel] +=128;
            }
        }
    }
    return oldImageData;
}

function contrast(){
    const oldImageData = getImageData();
    saveNewImageData(contrastUp(oldImageData));
}


function thresholdingUp(oldImageData){
    const oldData = oldImageData.data;
    const width = oldImageData.width;
    const strength = document.getElementById('contrastRange').value;
    for(let row = 0; row < oldImageData.height; row++){
        for(let column = 0; column < width; column++){
            let gray = oldData[4*(row * width + column) + 0] * (0.299+(0.03*strength)) +
                       oldData[4*(row * width + column) + 1] * (0.587+(0.05*strength)) +
                       oldData[4*(row * width + column) + 2] * (0.114+(0.01*strength));
                       oldData[4*(row * width + column) + 0] = oldData[4*(row * width + column) + 1];
                       oldData[4*(row * width + column) + 1] = oldData[4*(row * width + column) + 2];
                       oldData[4*(row * width + column) + 2] = gray;
        }
    }
    return oldImageData;
}

function thresholding(){
    const oldImageData = getImageData();
    saveNewImageData(thresholdingUp(oldImageData));
}

