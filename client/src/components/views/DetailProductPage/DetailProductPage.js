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
    Axios.get(`/api/product/products_by_id?id=${productId}&type=array`)
    .then(response=>{
      setProduct(response.data[0]);
    })
    .catch(err => alert(err))
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
