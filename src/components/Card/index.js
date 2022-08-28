import React, {useState} from "react";
import styles from './Card.module.scss';

function Card({onFavorite, onPlus, title, price, imageUrl, id, favorited = false}) {
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(favorited);

  const onClickPlus = () => {
    onPlus({ id, title, price, imageUrl });
    setIsAdded(!isAdded);
  }

  const onClickFavorite = () => {
    onFavorite({ title, price, imageUrl });
    setIsFavorite(!isFavorite);
  }

  return (
    <div className={styles.card}>
      <div>
        <img className={styles.favorite}
             onClick={onClickFavorite}
             src={isFavorite ? "/img/liked.svg" : "/img/unliked.svg"}
             alt="unliked"/>
      </div>
      <img width={133} height={112}
           src={imageUrl} alt="Sneakers"/>
      <h5>{title}</h5>
      <div className="d-flex justify-between align-center">
        <div className="d-flex flex-column">
          <span>Цена:</span>
          <b>{price} руб.</b>
        </div>
          <img className={styles.plus}
               onClick={onClickPlus}
               src={isAdded ? "/img/btn-checked.svg" : "/img/btn-plus.svg"}
               alt="Plus"/>
      </div>
    </div>
  );
}

export default Card;
