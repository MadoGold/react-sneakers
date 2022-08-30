import React from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";

import AppContext from "./context";

import Header from "./components/Header";
import Index from "./components/Drawer";
import Home from "./pages/Home";
import {useEffect, useState} from "react";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartOpened, setCartOpened] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // fetch('https://6306376fc0d0f2b801187807.mockapi.io/items')
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((json) => {
    //     setItems(json)
    //   }); заменил на axios

    try {
      async function fetchData() {
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
          axios.get('https://6306376fc0d0f2b801187807.mockapi.io/cart'),
          axios.get('https://6306376fc0d0f2b801187807.mockapi.io/favorites'),
          axios.get('https://6306376fc0d0f2b801187807.mockapi.io/items')
        ])

        setIsLoading(false);

        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      }

      fetchData();
    } catch (error) {
      alert('error')
    }
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
      if (findItem) {
        setCartItems(prev => prev.filter(item => Number(item.parentId) !== Number(obj.id)));
        await axios.delete(`https://6306376fc0d0f2b801187807.mockapi.io/cart/${findItem.id}`);
      } else {
        setCartItems(prev => [...prev, obj]);
        const { data } = await axios.post('https://6306376fc0d0f2b801187807.mockapi.io/cart', obj);
        setCartItems(prev => prev.map((item) => {
          if (item.parentId === data.parentId) {
            return {
              ...item,
              id: data.id
            };
          } else {
            return item;
          }
        }));
      }
    } catch (error) {
      alert('Не удалось');
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        await axios.delete(`https://6306376fc0d0f2b801187807.mockapi.io/favorites/${obj.id}`);
        setFavorites(prev => prev.filter(item => Number(item.id) !== Number(obj.id)));
      } else {
        const { data } = await axios.post('https://6306376fc0d0f2b801187807.mockapi.io/favorites', obj);
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить товар в избранное')
    }
  };

  const onRemoveItem = async (id) => {
    try {
      setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(id)));
      await axios.delete(`https://6306376fc0d0f2b801187807.mockapi.io/cart/${id}`);
    } catch (error) {
      alert('Error')
    }
  }

  const onChangeSearchInput = (event) => {
    console.log(event.target.value);
    setSearchValue(event.target.value);
  }

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  }

  return (
    <AppContext.Provider value={{ setCartItems, setCartOpened,  items, cartItems, favorites, isItemAdded, onAddToFavorite, onAddToCart }}>
      <div className="wrapper clear">
        <div>
          <Index opened={cartOpened} items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} />
        </div>

        <Header onClickCart={() => setCartOpened(true)}/>

        <Routes>
          <Route path="" exact
                 element={<Home
                   items={items}
                   cartItems={cartItems}
                   searchValue={searchValue}
                   setSearchValue={setSearchValue}
                   onChangeSearchInput={onChangeSearchInput}
                   onAddToFavorite={onAddToFavorite}
                   onAddToCart={onAddToCart}
                   isLoading={isLoading}
                 />}
          />
          <Route path="favorites" exact element={<Favorites/>}/>
          <Route path="orders" exact element={<Orders/>}/>
        </Routes>

      </div>
    </AppContext.Provider>
  );
}

export default App;
