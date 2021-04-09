import Axios from 'axios';
import React, { useEffect,useState } from 'react'
import { FaCode } from "react-icons/fa";
import {Icon,Col,Card,Row} from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Section/CheckBox';
import {continents} from './Section/Data';

function LandingPage() {
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [Products, setProducts] = useState([]);
  const [PostSize, setPostSize] = useState(0)
  useEffect(() => {
    let body={
      skip: Skip,
      limit: Limit
    }
    getProducts(body);
  }, [])
  const renderCards = Products.map((product, index)=>{
    return <Col key={index} lg={6} md={8} xd={24}><Card
      cover={<ImageSlider images={product.images}/>}
    >
      <Meta 
        title={product.title} 
        description={`${product.price}`}
      />
    </Card></Col>
    
  })
  const getProducts=(body)=>{
    console.log('%cLandingPage.js line:32 Skip', 'color: #007acc;', Skip);
    Axios.post('/api/product/products',body)
    .then(response=>{
      if(response.data.success){  
        setPostSize(response.data.productList.length);
        setProducts([...Products,...response.data.productList]);
      }else{
        alert('상품리스트를 가져오지 못했습니다.')
      }
    })
    setSkip(Skip+Limit);
  }
  const loadMoreHandler=()=>{
    let body={
      skip: Skip,
      limit: Limit
    }
    getProducts(body);
  }
  return (
    <div style={{width:'75%',margin:'3rem auto'}}>
      <div style={{textAlign:'center'}}>
        <h2>Let's Travel AnyWhere <Icon type='rocket' /></h2>
      </div>
        {/* Filter */}

        {/* CheckBox */}
        <CheckBox list={continents}/>
        {/* RaidoBox */}

        {/* Search */}
      
        {/* Cards */}
      <Row gutter={[16,16]}>
      {renderCards}
      </Row>
      {PostSize >= Limit && 
        <div style={{display:'flex',justifyContent:'center'}}>
          <button onClick={loadMoreHandler}>더보기</button>
        </div>
        }
    </div>
  )
}

export default LandingPage
