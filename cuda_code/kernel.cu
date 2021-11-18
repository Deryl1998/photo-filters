#include "cuda_runtime.h"
#include "device_launch_parameters.h"
#include <stdio.h>
extern "C" __declspec(dllexport) int main(unsigned char* oldData, int width, int height, int delta,int choise);

__device__ int getValue(int value, int b)
{
    if (value + b < 0) return 0;
    if (value + b > 255) return 255;
    return value + b;
}

__global__ void brightUp(unsigned char* oldData, int width, int height, int delta)
{
    int blockId = blockIdx.y * gridDim.x + blockIdx.x;
    int threadId = blockId * blockDim.x + threadIdx.x;
    if (threadId >= height*width*4 || threadId%3==0) return;
    int colorPixel = (int)(oldData[threadId]);
    oldData[threadId] = getValue(colorPixel, delta);
}


__global__ void contrastUp(unsigned char* oldData, int width, int height, int contrast)
{
    int blockId = blockIdx.y * gridDim.x + blockIdx.x;
    int threadId = blockId * blockDim.x + threadIdx.x;
    if (threadId >= height * width * 4 || threadId % 3 == 0) return;
     int colorPixel = static_cast<int>(oldData[threadId]);
     colorPixel = getValue(colorPixel, -128);
     colorPixel *= contrast;
     colorPixel = getValue(colorPixel, 128);
     oldData[threadId] = colorPixel;
}

__global__ void thresholdingUp(unsigned char* oldData, int width, int height, int strength)
{
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;
    int blockId = blockIdx.y * gridDim.x + blockIdx.x;
    int threadId = blockId * blockDim.x + threadIdx.x;
    if (threadId >= height * width * 4 || threadId % 3 == 0) return;
   
    int gray = oldData[threadId + 0] * (0.299 + (0.03 * strength)) +
        oldData[threadId + 1] * (0.587 + (0.05 * strength)) +
        oldData[threadId + 2] * (0.114 + (0.01 * strength));
    oldData[threadId + 0] = oldData[threadId + 1];
    oldData[threadId + 1] = oldData[threadId + 2];
    oldData[threadId + 2] = gray;

}

int main(unsigned char* oldData, int width, int height, int power, int choise)
{
    const int size = width * height * 4;
    unsigned char* dev_bitmap = new unsigned char[size];
    dim3 grid(width, height);
    cudaMalloc(&dev_bitmap, size * sizeof(unsigned char));
    cudaMemcpy(dev_bitmap, oldData, size * sizeof(unsigned char), cudaMemcpyHostToDevice);

    switch (choise) {
    case 0:  brightUp << < grid, 4 >> > (dev_bitmap, width, height, power); break;
    case 1:  contrastUp << < grid, 4 >> > (dev_bitmap, width, height, power); break;
    case 2:  thresholdingUp << < grid, 4 >> > (dev_bitmap, width, height, power); break;
    }
    cudaDeviceSynchronize();
    cudaMemcpy(oldData, dev_bitmap, size * sizeof(unsigned char), cudaMemcpyDeviceToHost);
    cudaFree(dev_bitmap);
    return 0;
}