import React, { useState, useMemo, useEffect } from "react";
import { useDebounce } from "use-debounce";
import "./product-list.css";
import { getStarRating, getURL, COUNT } from "./utils";
import ZoomImage from "./zoom-image";

function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewType, setViewType] = useState("grid");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchTermDebounced] = useDebounce(searchTerm, 300);
  const isThereMore = COUNT * (page + 1) < total;
  const nothingFound = !products || !products.length;

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }, [products, sortOrder]);

  const onSearchInputChange = (searchString) => {
    setSearchTerm(searchString);
    setPage(0);
  };

  const onGetMoreClick = () => {
    setPage((prevState) => prevState + 1);
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(getURL({ searchTerm: searchTermDebounced, page }))
      .then((response) => response.json())
      .then((data) => {
        setProducts((prevState) => {
          if (page === 0) {
            return [...data.products];
          } else {
            return [...prevState, ...data.products];
          }
        });
        setTotal(data.total);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, [searchTermDebounced, page]);

  return (
    <div className="product-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Введите название..."
          value={searchTerm}
          onChange={(e) => onSearchInputChange(e.target.value)}
          className="input search-input"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="input sort-select"
        >
          <option value="asc">Сначала дешёвые</option>
          <option value="desc">Сначала дорогие</option>
        </select>
        <select
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          className="input view-switcher"
        >
          <option value="grid">Сетка</option>
          <option value="list">Список</option>
        </select>
      </div>
      <div className={viewType === "grid" ? "product-grid" : "product-list"}>
        {sortedProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="title-and-description-side">
              <h3 className="product-name">{product.title}</h3>
              <p className="product-stars-and-rating">
                {getStarRating(product.rating)}
                <span className="product-rating">&nbsp;{product.rating}</span>
              </p>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price}</p>
            </div>
            <ZoomImage
              images={product.images}
              title={product.title}
              thumbnail={product.thumbnail}
            />
          </div>
        ))}
      </div>
      {nothingFound && (
        <div className="nothing-found-container">Ничего не найдено</div>
      )}
      <div className="get-more-container">
        <button onClick={onGetMoreClick} disabled={!isThereMore}>
          {isThereMore ? "Показать ещё" : "Больше нет"}
        </button>
      </div>
      {isLoading && <div className="loader"></div>}
    </div>
  );
}

export default ProductList;
