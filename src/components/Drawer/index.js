import React, {useState} from "react";
import axios from "axios";

import Info from "../Info";
import {useCart} from "../../hooks/useCart";

import styles from './Drawer.module.scss'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, items = [], onRemove, opened }) {
  const {cartItems, setCartItems, totalPrice} = useCart();
  const [orderId, setOrderId] = useState(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post('https://6306376fc0d0f2b801187807.mockapi.io/orders', {
        items: cartItems,
      });
      setOrderId(data.id)
      setIsOrderComplete(true);
      setCartItems([]);

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        console.log(item.id)
        axios.delete(`https://6306376fc0d0f2b801187807.mockapi.io/cart/${item.id}`);
        await delay(1000);
      }
    } catch (error) {
      alert('Ошибка')
    }
    setIsLoading(false);
  }

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
      <div className={styles.drawer}>
        <h2 className="mb-30 d-flex justify-between">
          Корзина <img onClick={onClose} className="removeBtn cu-p" src={"img/btn-remove.svg"} alt="remove"/>
        </h2>

        {
          items.length > 0
          ?
            <>
              <div className="items flex">
                {
                  items.map((obj) => (
                    <div key={obj.id} className="cartItem d-flex align-center mb-20">
                      <div style={{ backgroundImage: `url(${obj.imageUrl})` }} className="cartItemImg" />
                      <div className="mr-20 flex">
                        <p className="mb-5">{obj.title}</p>
                        <b>{obj.price} руб.</b>
                      </div>
                      <img onClick={() => onRemove(obj.parentId)} className="removeBtn" src={"img/btn-remove.svg"} alt="remove"/>
                    </div>
                  ))
                }
              </div>
              <div className="cardTotalBlock">
              <ul>
                <li>
                  <span>Итого</span>
                  <div/>
                  <b>{totalPrice} руб. </b>
                </li>
                <li>
                  <span>Налог 5%: </span>
                  <div/>
                  <b>{totalPrice / 100 * 5} руб. </b>
                </li>
              </ul>
              <button disabled={isLoading} onClick={onClickOrder} className="greenButton">Оформить заказ <img src={"img/arrow.svg"} alt="arrow"/></button>
            </div>
            </>
          :
            <Info
              image={isOrderComplete ? "img/complete-order.jpg" : "img/empty-cart.jpg"}
              title={isOrderComplete ? "Заказ оформлен" :"Корзина пустая"}
              description={isOrderComplete
                ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                : "Добавьте хотя бы ещё одну пару кроссовок, чтобы сделать заказ"}
            />
        }
      </div>
    </div>
  );
}

export default Drawer;
