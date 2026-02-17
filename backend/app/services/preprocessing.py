import numpy as np
import torch
import cv2


def resize_image(img:np.ndarray,size:int=224)->np.ndarray:
  return cv2.resize(img,(size,size),interpolation=cv2.INTER_LINEAR)

def minmax_normalize(img:np.ndarray)->np.ndarray:
  img=img.astype(np.float32)
  mn,mx=img.min(),img.max()
  if mx-mn>0:
    return (img-mn)/(mx-mn)
  else:
    return np.zeros_like(img)

def preprocess_channels(img_171,img_193,img_211,device:str):
  img_171=resize_image(img_171)
  img_193=resize_image(img_193)
  img_211=resize_image(img_211)
  
  img_171=minmax_normalize(img_171)
  img_193=minmax_normalize(img_193)
  img_211=minmax_normalize(img_211)

  # stack into (H,W,3)
  stacked=np.stack([img_171,img_193,img_211],axis=-1)
  # convert to tensor ->(3,H,W)
  tensor=torch.from_numpy(stacked).permute(2,0,1).float()
  # add batch dimension ->(1,3,224,224)
  tensor=tensor.unsqueeze(0)

  return tensor.to(device)
