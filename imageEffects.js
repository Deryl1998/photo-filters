
function brightUp(oldImageData){
    const oldData = oldImageData.data;
    const width = oldImageData.width;
    const delta = 2.5;
    for(let row = 0; row < oldImageData.height; row++){
        for(let column = 0; column < width; column++){
            for(let pixel = 0; pixel < 3; pixel++){
                oldData[4*(row * width + column) + pixel] += 10 * delta;
            }
        }
    }
    return oldImageData;
}

function contrastUp(oldImageData){
    const oldData = oldImageData.data;
    const width = oldImageData.width;
    const contrast = 1.5;
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

function thresholdingUp(oldImageData){
    const oldData = oldImageData.data;
    const width = oldImageData.width;
    const strength = 0.8;
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

function negative(imageData){
    const oldData = imageData.data;
    const width = imageData.width;
    for(let row = 0; row < imageData.height; row++){

        for(let column = 0; column < width; column++){

            for(let pixel = 0; pixel<=2; pixel++){
                oldData[4*(row * width + column) + pixel] = 255 -
                oldData[4*(row * width + column) + pixel];
            }
        }
    }
    return imageData;
}

function negativeImage(){
    const oldImageData = getImageData();
    saveNewImageData(negative(oldImageData));
}

function bwUp(){
   const oldImageData = getImageData();
   saveNewImageData(bw(oldImageData));
}

function bw(imageData){
    const oldData = imageData.data;
    const width = imageData.width;
    const treshold = 100 * 3;
        for(let row = 0; row < imageData.height; row++){
            for(let column = 0; column < width; column++){
             let sum = 0;

                for(let pixel = 0; pixel<=2; pixel++){
                   sum += oldData[4*(row * width + column) + pixel];
                }

             const value = (sum >treshold)?255:0;
                for(let pixel = 0; pixel<=2; pixel++){
                    oldData[4*(row * width + column) + pixel] = value;
                }

            }
        }
    return imageData;
}

function filter(imageData,kernel,offsets,width){
    const oldData = imageData.data;
        for(let row = 0; row < imageData.height; row++){
            for(let column = 0; column < width ; column++){
                for(let pixel = 0; pixel<=2; pixel++){
                    if(row!=0 && row<imageData.height-1 && column!=0 && column<width-1){
                        let component = 0;
                        for(let x = 0; x < kernel.length; x++){
                            for(let y = 0; y < kernel[0].length; y++ ){
                                let currentAddress = (4*(row * width + column) + pixel) +offsets[x][y];
                                let currentFactor = kernel[x][y];
                                component += oldData[currentAddress] * currentFactor;
                            }
                        }
                        oldData[4*(row * width + column) + pixel] = component;
                    } 
                }
            }
        }
        return imageData;
}

function blurEffect(){
    const oldImageData = getImageData();
    const width = oldImageData.width;
    const kernel = [
        [1/9, 1/9, 1/9],
        [1/9, 1/9, 1/9],
        [1/9, 1/9, 1/9]
    ];
    const offsets = [
       [-4*(width+1), -4*width, -4*(width-1)],
       [-4, 0, 4],
       [4*(width-1), 4*width, 4*(width+1)]
    ]
    saveNewImageData(filter(oldImageData,kernel,offsets,width));
}

function sharpeningEffect(){
    const oldImageData = getImageData();
    const width = oldImageData.width;
    const kernel = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ];
    const offsets = [
        [-4*(width+1), -4*width, -4*(width-1)],
        [-4, 0, 4],
        [4*(width-1), 4*width, 4*(width+1)]
    ]
    saveNewImageData(filter(oldImageData,kernel,offsets,width));
}

function edgeDetection(){
    const oldImageData = getImageData();
    const width = oldImageData.width;
    const kernel = [
        [-1, -1, -1],
        [-1, 8, -1],
        [-1, -1, -1]
    ];
    const offsets = [
        [-4*(width+1), -4*width, -4*(width-1)],
        [-4, 0, 4],
        [4*(width-1), 4*width, 4*(width+1)]
    ]
    saveNewImageData(filter(oldImageData,kernel,offsets,width));
}

function liveCameraEffect(){
    const oldImageData = getImageData();
    const width = oldImageData.width;
    const kernel = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ];
    const offsets = [
        [-1*(width+1), 1*width, 1*(width-1)],
        [-1,0,1],
        [1*(width+1), 1*width, 1*(width-1)]
    ]
    saveNewImageData(filter(oldImageData,kernel,offsets,width));
}