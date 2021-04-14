import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions';
import UserCartBlock from './Sections/UserCartBlock';
import { Empty, Result, Button } from 'antd';
import Paypal from '../../utils/Paypal';

function CartPage(props) {
  const [Total, setTotal] = useState(0);
  const [ShowTotal, setShowTotal] = useState(false);
  const [ShowSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    //리덕스 User state 안에 cart 안에 상품이 들어있는지 확인
    let cartItems = [];
    if (props.user.userData && props.user.userData.cart) {
      if (props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach(item => {
          cartItems.push(item.id)
        })
        dispatch(getCartItems(cartItems, props.user.userData.cart))
          .then(response => { calculateTotal(response.payload); })
      }
    }
  }, [props.user.userData])

  let calculateTotal = (cartDetail) => {
    console.log('%cCartPage.js line:26 cartDetail', 'color: #007acc;', cartDetail);
    let total = 0;
    cartDetail.map(item => {
      total += parseInt(item.price, 10) * item.quantity;
    })
    setTotal(total);
    setShowTotal(true);
  }

  const removeFromCart = (productId) => {
    dispatch(removeCartItem(productId))
      .then(response => {
        if (response.payload.productInfo.length <= 0) {
          setShowTotal(false);
        }
      })
  }

  const transactionSuccess = (data) => {
    dispatch(onSuccessBuy({
      paymentData: data,
      cartDetail: props.user.cartDetail
    }))
      .then(response => {
        if (response.payload.success) {
          console.log('%cCartPage.js line:53 response.payload', 'color: #007acc;', response.payload);
          setShowTotal(false);
          setShowSuccess(true);
        }
      })
  }

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <h1>My Cart</h1>
      <div>
        <UserCartBlock products={props.user.cartDetail} removeItem={removeFromCart} />
      </div>
      {ShowTotal ?
        <div style={{ marginTop: '3rem' }}>
          <h2>Total Amount: ${Total}</h2>
        </div>
        :
        ShowSuccess ?
          <Result
            status="success"
            title="Successfully Purchased Items"
          />
          :
          <Empty style={{ marginTop: '1rem' }} description={false} />
      }
      {ShowTotal && <Paypal total={Total} onSuccess={transactionSuccess} />}
    </div>
  )
}

export default CartPage
