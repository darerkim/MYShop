import React from 'react';
import './UserCartBlock.css';

function UserCartBlock(props) {
  console.log('%cUserCardBlock.js line:5 props', 'color: #007acc;', props);

  const renderCartImages=(images)=>{
    if(images.length > 0){
      let image = images[0];
      return `http://localhost:5000/${image}`
    }
  }
  
  const renderItems=()=>(
    props.products && props.products.map((product,index) => (
      <tr key={index}>
        <td>
          <img style={{width:'70px'}} alt='product'
          src={renderCartImages(product.images)}/>
        </td>
        <td>
          {product.quantity} EA
        </td>
        <td>
          $ {product.price} 
        </td>
        <td>
          <button onClick={()=>props.removeItem(product._id)}>
            Remove
          </button>
        </td>
      </tr>
    ))
  )
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Product Quantity</th>
            <th>Product Price</th>
            <th>Remove from Cart</th>
          </tr>
        </thead>
        <tbody>
          {renderItems()}
        </tbody>
      </table>
    </div>
  )
}

export default UserCartBlock
