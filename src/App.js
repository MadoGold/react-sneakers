import React from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";

import AppContext from "./context";

import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import {useEffect, useState} from "react";
import Favorites from "./pages/Favorites";

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

    async function fetchData() {
      const cartResponse = await axios.get('https://6306376fc0d0f2b801187807.mockapi.io/cart');
      const favoritesResponse = await axios.get('https://6306376fc0d0f2b801187807.mockapi.io/favorites');
      const itemsResponse = await axios.get('https://6306376fc0d0f2b801187807.mockapi.io/items');

      setIsLoading(false);

      setCartItems(cartResponse.data);
      setFavorites(favoritesResponse.data);
      setItems(itemsResponse.data);
    }

    fetchData();
  }, []);

  const onAddToCart = (obj) => {
    try {
      if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
        axios.delete(`https://6306376fc0d0f2b801187807.mockapi.io/cart/${obj.id}`);
        setCartItems(prev => prev.filter(item => Number(item.id) !== Number(obj.id)));
      } else {
        axios.post('https://6306376fc0d0f2b801187807.mockapi.io/cart', obj);
        setCartItems(prev => [...prev, obj]);
      }
    } catch (error) {
      alert('Не удалось')
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

  const onRemoveItem = (id) => {
    axios.delete(`https://6306376fc0d0f2b801187807.mockapi.io/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  const onChangeSearchInput = (event) => {
    console.log(event.target.value);
    setSearchValue(event.target.value);
  }

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.id) === Number(id));
  }

  return (
    <AppContext.Provider value={{ setCartItems, setCartOpened,  items, cartItems, favorites, isItemAdded, onAddToFavorite }}>
      <div className="wrapper clear">
        {cartOpened && <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} />}
        <Header onClickCart={() => setCartOpened(true)}/>

        <Routes>
          <Route path="/" exact
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
          <Route path="/favorites" exact
                 element={<Favorites/>}/>
        </Routes>

      </div>
    </AppContext.Provider>
  );
}

export default App;
