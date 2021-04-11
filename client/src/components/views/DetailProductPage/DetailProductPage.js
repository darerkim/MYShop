import Axios from 'axios'
import React,{useEffect,useState} from 'react'
import ProductImage from './Section/ProductImage';
import ProductInfo from './Section/ProductInfo';
import {Row,Col} from 'antd';

function DetailProductPage(props) {
  const [Product, setProduct] = useState({});
  const productId = props.match.params.productId;
  useEffect(() => {
    console.log('%cDetailProductPage.js line:7 object', 'color: #007acc;');
    Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
    .then(response=>{
      if(response.data.success){
        console.log('%cDetailProductPage.js line:12 response.data', 'color: #007acc;', response.data);
        setProduct(response.data.product[0]);
      }else{
        alert('상세정보 가져오기를 실패했습니다.');
      }
      console.log('%cDetailProductPage.js line:15 object', 'color: #007acc;');
    })
  }, [])
  return (
    <div style={{width:'100%', padding:'3rem 4rem'}}>
      <div style={{display:'flex', justifyContent:'center'}}>
        <h1>{Product.title}</h1>
      </div>

    <Row gutter={[16,16]}> 
      <Col lg={12} sm={24}>
        {/* ProductImage */}
        <ProductImage detail={Product} />
      </Col>
      <Col lg={12} sm={24}>
        {/* ProductInfo  */}
        <ProductInfo detail={Product} />
      </Col>
    </Row>
    </div>
  )
}

export default DetailProductPage
