import React, {useState, useContext} from "react";
import ContentLoader from "react-content-loader"
import AppContext from "../../context";
import styles from './Card.module.scss';

function Card({onFavorite, loading = false, onPlus, title, price, imageUrl, id, favorited = false}) {
  const { isItemAdded } = useContext(AppContext);
  const [isFavorite, setIsFavorite] = useState(favorited);
  const obj = { id, parentId: id, title, price, imageUrl };

  const onClickPlus = () => {
    onPlus(obj);
  }

  const onClickFavorite = () => {
    onFavorite(obj);
    setIsFavorite(!isFavorite);
  }

  return (
    <div className={styles.card}>
      {
        loading
          ?
          <ContentLoader
            speed={2}
            width={180}
            height={230}
            viewBox="0 0 180 230"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="10" ry="10" width="180" height="112" />
            <rect x="0" y="125" rx="5" ry="5" width="180" height="15" />
            <rect x="0" y="145" rx="5" ry="5" width="100" height="15" />
            <rect x="0" y="202" rx="5" ry="5" width="80" height="25" />
            <rect x="145" y="195" rx="10" ry="10" width="32" height="32" />
          </ContentLoader>
          :
          <>
            <div>
              {onFavorite && <img className={styles.favorite}
                    onClick={onClickFavorite}
                    src={isFavorite ? "img/liked.svg" : "img/unliked.svg"}
                    alt="unliked"/>}
            </div>
            <img width={133} height={112}
                 src={imageUrl} alt="Sneakers"/>
            <h5>{title}</h5>
            <div className="d-flex justify-between align-center">
              <div className="d-flex flex-column">
                <span>Цена:</span>
                <b>{price} руб.</b>
              </div>
              {onPlus && <img className={styles.plus}
                    onClick={onClickPlus}
                    src={isItemAdded(id) ? "img/btn-checked.svg" : "img/btn-plus.svg"}
                    alt="Plus"/>}
            </div>
          </>
      }
    </div>
  );
}

export default Card;
