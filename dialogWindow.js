const {dialog,BrowserWindow} = require('electron');


async function userSelectImage(){
    let options = {
        title : "Wybierz obraz", 
        defaultPath : `${__dirname}`,
        filters :[
         {name: 'Images', extensions: ['jpg', 'png']}
        ],

        properties: ['openFile','multiSelections']
       }
    let file = dialog.showOpenDialog(BrowserWindow.getFocusedWindow(),options);
    return file;
}

async function saveImage(){

   let filePath = dialog.showSaveDialog(BrowserWindow.getFocusedWindow());
   return filePath;
}

module.exports = {
    userSelectImage: userSelectImage,
    saveImage: saveImage
}