import React,{useState} from 'react'
import { Input, Space } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

const { Search } = Input;

function SearchFeature(props) {
  // const [SearchTerm, setSearchTerm] = useState('');
  const searchHandler=(e)=>{
    // setSearchTerm(e.currentTarget.value);
    props.refresh(e.currentTarget.value);
  }
  return (
    <div>
      <Search
        placeholder="input search text"
        onChange={searchHandler}
        // enterButton="Search"
        style={{width:200}}
        value={props.value}
      />
    </div>
  )
}

export default SearchFeature
