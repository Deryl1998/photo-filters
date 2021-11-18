var ffi = require('ffi-napi');
var libm_CUDA = ffi.Library('./dll/CudaRuntime.dll', {
    'main': [ 'int', ['uchar *', 'int', 'int', 'int','int'] ]
    });


function brightness(){
    const oldImageData = getImageData();
    const oldData = oldImageData.data;
    const width = oldImageData.width;
    const height = oldImageData.height;
    const strenght = 5;
    libm_CUDA.main(oldData,width,height,strenght,0);
    saveNewImageData(oldImageData);
}

function contrast(){
    const oldImageData = getImageData();
    const oldData = oldImageData.data;
    const width = oldImageData.width;
    const height = oldImageData.height;
    const strenght = 2.4;
    libm_CUDA.main(oldData,width,height,strenght,1);
    saveNewImageData(oldImageData);
}

function thresholding(){
    const oldImageData = getImageData();
    const oldData = oldImageData.data;
    const width = oldImageData.width;
    const height = oldImageData.height;
    const strenght = 0.8;
    libm_CUDA.main(oldData,width,height,strenght,2);
    saveNewImageData(oldImageData);
}


