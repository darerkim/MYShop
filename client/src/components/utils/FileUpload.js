import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Icon } from 'antd';
import axios from 'axios';
function FileUpload(props) {
  const [Images, setImages] = useState([]);
  const dropHandler = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' }
    }
    formData.append('file', files[0]);
    axios.post('/api/product/image', formData, config)
      .then(response => {
        if (response.data.success) {
          console.log('%cFileUpload.js line:16 response.data', 'color: #007acc;', response.data);
          setImages([...Images, response.data.filePath]);
          props.refresh([...Images, response.data.filePath]);
        } else {
          alert('파일을 저장하는것에 실패했습니다.');
        }
      })
  }

  const deleteHandler=(imagePath, index)=>{
    const currentIndex = Images.indexOf(imagePath);
    let newImages = Images;
    newImages.splice(currentIndex, 1);
    setImages(newImages);
    props.refresh(newImages);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: 300, height: 240, border: '1px solid lightgray',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            {...getRootProps()}>
            <input {...getInputProps()} />
            <Icon type='plus' style={{ fontSize: '3rem' }} />
          </div>
        )}
      </Dropzone>
      <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>
        {Images.map((imagePath, index) => (
          <div key={index} onClick={()=>deleteHandler(imagePath, index)}>
            <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
              src={`http://localhost:5000/${imagePath}`} alt={index} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileUpload
