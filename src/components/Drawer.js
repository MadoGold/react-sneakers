import Info from "./Info";
import React, {useContext, useState} from "react";
import AppContext from "../context";
import axios from "axios";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, items = [], onRemove }) {
  const { cartItems, setCartItems } = useContext(AppContext);
  const [orderId, setOrderId] = useState(null);
  const [isOrderComplited, setIsOrderComplited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const {data} = await axios.post('https://6306376fc0d0f2b801187807.mockapi.io/orders', {
        items: cartItems,
      });
      setOrderId(data.id)
      setIsOrderComplited(true);
      setCartItems([]);

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete('https://6306376fc0d0f2b801187807.mockapi.io/orders');
        await delay(1000);
      }
    } catch (error) {
      alert('Ошибка')
    }
    setIsLoading(false);
  }

  return (
    <div className="overlay">
      <div className="drawer">
        <h2 className="mb-30 d-flex justify-between">
          Корзина <img onClick={onClose} className="removeBtn cu-p" src={"/img/btn-remove.svg"} alt="remove"/>
        </h2>

        {
          items.length > 0
          ?
            <>
              <div className="items">
                {
                  items.map((obj) => (
                    <div key={obj.id} className="cartItem d-flex align-center mb-20">
                      <div style={{ backgroundImage: `url(${obj.imageUrl})` }} className="cartItemImg" />
                      <div className="mr-20 flex">
                        <p className="mb-5">{obj.title}</p>
                        <b>{obj.price} руб.</b>
                      </div>
                      <img onClick={() => onRemove(obj.id)} className="removeBtn" src={"/img/btn-remove.svg"} alt="remove"/>
                    </div>
                  ))
                }
              </div>
              <div className="cardTotalBlock">
              <ul>
                <li>
                  <span>Итого</span>
                  <div/>
                  <b>21 498 руб. </b>
                </li>
                <li>
                  <span>Налог 5%: </span>
                  <div/>
                  <b>1074 руб. </b>
                </li>
              </ul>
              <button disabled={isLoading} onClick={onClickOrder} className="greenButton">Оформить заказ <img src={"img/arrow.svg"} alt="arrow"/></button>
            </div>
            </>
          :
            <Info
              image={isOrderComplited ? "/img/complete-order.jpg" : "/img/empty-cart.jpg"}
              title={isOrderComplited ? "Заказ оформлен" :"Корзина пустая"}
              description={isOrderComplited
                ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                : "Добавьте хотя бы ещё одну пару кроссовок, чтобы сделать заказ"}
            />
        }
      </div>
    </div>
  );
}

export default Drawer;
