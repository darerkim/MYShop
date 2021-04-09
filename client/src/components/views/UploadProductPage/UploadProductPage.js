import React,{useState} from 'react';
import {Typography, Button, Form, Input } from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';

const {Title : TitleTag} = Typography;
const {TextArea} = Input;
const Continents = [
  {key:1, value:'Africa'},
  {key:2, value:'Europe'},
  {key:3, value:'Asia'},
  {key:4, value:'North America'},
  {key:5, value:'South Amreica'},
  {key:6, value:'Australia'},
  {key:7, value:'Antarctica'}
]
function UploadProductPage(props) {

  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Price, setPrice] = useState(0);
  const [Continent, setContinent] = useState(1);
  const [Images, setImages] = useState([]);
  const titleChangeHandler=(e)=>{
    setTitle(e.currentTarget.value);
  }
  const descChangeHandler=(e)=>{
    setDescription(e.currentTarget.value);
  }
  const priceChangeHandler=(e)=>{
    setPrice(e.currentTarget.value);
  }
  const continentChangeHandler=(e)=>{
    setContinent(e.currentTarget.value);
  }
  const updateImages=(newImages)=>{
    console.log('%cUploadProductPage.js line:36 newImages', 'color: #007acc;', newImages);
    setImages(newImages);
  }
  const submitHandler=(e)=>{
    console.log('%cUploadProductPage.js line:41 props.user.userData._id', 'color: #007acc;', props.user.userData._id);
    console.log('%cUploadProductPage.js line:42 localStorage.getItem(userId)', 'color: #007acc;', localStorage.getItem('userId'));
    e.preventDefault();
    if(!Title||!Description||!Price||!Continent||!Images){
      return alert('모든 값을 넣어주셔야 합니다.')
    }
    // 서버에 채운 값들을 request로 보낸다.
    const body={
      // writer: localStorage.getItem('userId'),
      writer: props.user.userData._id,
      title: Title,
      description: Description,
      price: Price,
      images: Images,
      continents: Continent
    }
    Axios.post('/api/product',body)
    .then(response =>{
      if(response.data.success){
        alert('상품 업로드에 성공 했습니다.');
        props.history.push('/');
      }else{
        alert('상품 업로드에 실패 했습니다.');
      }
    })
  }
  return (
    <div style={{maxWidth: '700px', margin: '2rem auto'}}>
      <div style={{textAlign:'center', marginBottom:'2rem'}}>
        <TitleTag level={2}>여행 상품 업로드</TitleTag>
      </div>

      <Form onSubmit={submitHandler}>
        {/* DropZone */}
        <FileUpload refresh={updateImages}/>
        <br />
        <br />
        <label>이름</label>
        <Input onChange={titleChangeHandler} value={Title}/>
        <br />
        <br />
        <label>실명</label>
        <TextArea onChange={descChangeHandler} value={Description}/>
        <br />
        <br />
        <label>가격($)</label>
        <Input type='number' onChange={priceChangeHandler} value={Price}/>
        <br />
        <br />
        <select onChange={continentChangeHandler} value={Continent}>
          {Continents.map((item) => (
            <option key={item.key} value={item.key}>{item.value}</option>
          ))}
        </select>
        <br />
        <br />
        <Button htmlType='submit'>확인</Button>
      </Form>
    </div>
  )
}

export default UploadProductPage
