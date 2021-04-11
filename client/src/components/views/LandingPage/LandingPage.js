import Axios from 'axios';
import React, { useEffect,useState } from 'react'
import { FaCode } from "react-icons/fa";
import {Icon,Col,Card,Row} from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Section/CheckBox';
import RadioBox from './Section/RadioBox';
import SearchFeature from './Section/SearchFeature';
import {continents, price} from './Section/Data';

function LandingPage() {
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [Products, setProducts] = useState([]);
  const [PostSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({
    continents:[],
    price:[]
  });
  const [SearchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let body={
      skip: 0,
      limit: Limit
    }
    getProducts(body);
  }, [])

  const renderCards = Products.map((product, index)=>{
    return <Col key={index} lg={6} md={8} xd={24}><Card
      cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images}/></a>}
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
        if (body.loadMore) {
          setProducts([...Products,...response.data.productList]);
          setSkip(Skip+Limit);
        }else{
          setProducts([...response.data.productList]);
          setSkip(Limit);
        }
        setPostSize(response.data.productList.length);
      }else{
        alert('상품리스트를 가져오지 못했습니다.')
      }
    })
  }

  const loadMoreHandler=()=>{
    let body={
      skip: Skip,
      limit: Limit,
      loadMore: true
    }
    getProducts(body);
  }

  const showFilteredResults=(newFilters)=>{
    let body={
      skip: 0,
      limit: Limit,
      filters: newFilters
    }
    getProducts(body);
  }

  const handleFilters=(filters, category)=>{
    let body={
      skip: Skip,
      limit: Limit
    }
    const newFilters = {...Filters};

    if (category === 'price') {
      let priceValues = handlePrice(filters);
      newFilters[category]=priceValues;
    }else if (category === 'continents'){
      newFilters[category]=filters;
    }

    showFilteredResults(newFilters);
    setFilters(newFilters);
  }

  const handlePrice=(value)=>{
    const data = price;
    let array = [];
    for (let key in data){
      if(data[key]._id === parseInt(value, 10)){
        console.log('%cLandingPage.js line:91 data[key]', 'color: #007acc;', data[key]);
        console.log('%cLandingPage.js line:91 data[key].array', 'color: #007acc;', data[key].array);
        array = data[key].array;
      }
    }
    return array;
  }

  const updateSearchTerm=(newSearchTerm)=>{
    const body = {
      skip:0,
      limit:Limit,
      filters: Filters,
      searchTerm:newSearchTerm
    }
    setSkip(0);
    getProducts(body);
    setSearchTerm(newSearchTerm);
  }
  return (
    <div style={{width:'75%',margin:'3rem auto'}}>
      <div style={{textAlign:'center'}}>
        <h2>Let's Travel AnyWhere <Icon type='rocket' /></h2>
      </div>
        {/* Filter */}
        <Row gutter={[16,16]}>
          <Col lg={12} xs={24}>
            {/* CheckBox */}
            <CheckBox list={continents} handleFilters={filters => handleFilters(filters, 'continents')}/>          
          </Col>
          <Col lg={12} xs={24}>
            {/* RaidoBox */}
            <RadioBox list={price} handleFilters={filters => handleFilters(filters, 'price')}/>
          </Col>
        </Row>
        {/* Search */}
        <div style={{display:'flex',justifyContent:'flex-end',margin:'1rem auto'}}>
          <SearchFeature value={SearchTerm} refresh={updateSearchTerm}/>
        </div>
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
