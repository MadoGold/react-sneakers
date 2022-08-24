import React, {useState} from "react";
import styles from './Card.module.scss';

function Card({onFavorite, onPlus, title, price, imageUrl}) {
  const [isAdded, setIsAdded] = useState(false);

  const onClickPlus = () => {
    onPlus({ title, price, imageUrl });
    setIsAdded(!isAdded);
  }

  return (
    <div className={styles.card}>
      <div>
        <img className={styles.favorite} onClick={onFavorite}
             src={"/img/heart-unliked.svg"} alt="unliked"/>
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
