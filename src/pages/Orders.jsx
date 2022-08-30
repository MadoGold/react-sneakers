import React, {useContext, useEffect, useState} from 'react';
import Card from "../components/Card";
import axios from "axios";
import AppContext from "../context";

function Orders() {
  const [orders, setOrders] = useState([]);
  const { onAddToFavorite, onAddToCart } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('https://6306376fc0d0f2b801187807.mockapi.io/orders');
        // data.map((obj) => obj.items).flat();
        setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
        setIsLoading(false);
      } catch (error) {
        alert('Ошибка')
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои заказы</h1>
      </div>

      <div className="d-flex flex-wrap">
        {(isLoading ? [...Array(8)] : orders).map((item, index) => (
          <Card
            key={index}
            loading={isLoading}
            {...item}
          />
        ))}
      </div>
    </div>
  );
};

export default Orders;
