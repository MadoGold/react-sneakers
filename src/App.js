import React from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
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

  useEffect(() => {
    // fetch('https://6306376fc0d0f2b801187807.mockapi.io/items')
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((json) => {
    //     setItems(json)
    //   }); заменил на axios

    axios.get('https://6306376fc0d0f2b801187807.mockapi.io/items').then(res => {
      setItems(res.data)
    });
    axios.get('https://6306376fc0d0f2b801187807.mockapi.io/cart').then(res => {
      setCartItems(res.data)
    });
    axios.get('https://6306376fc0d0f2b801187807.mockapi.io/favorites').then(res => {
      setFavorites(res.data)
    });
  }, []);

  const onAddToCart = (obj) => {
    axios.post('https://6306376fc0d0f2b801187807.mockapi.io/cart', obj);
    setCartItems(prev => [...prev, obj]);
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => favObj.id === obj.id)) {
        await axios.delete(`https://6306376fc0d0f2b801187807.mockapi.io/favorites/${obj.id}`);
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

  return (
    <div className="wrapper clear">
      {cartOpened && <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} />}
      <Header onClickCart={() => setCartOpened(true)}/>

      <Routes>
        <Route path="/" exact
               element={<Home
                 items={items}
                 searchValue={searchValue}
                 setSearchValue={setSearchValue}
                 onChangeSearchInput={onChangeSearchInput}
                 onAddToFavorite={onAddToFavorite}
                 onAddToCart={onAddToCart}
               />}
        />
        <Route path="/favorites" exact
               element={<Favorites
                 items={favorites}
                 onAddToFavorite={onAddToFavorite}
               />}/>
      </Routes>

    </div>
  );
}

export default App;
