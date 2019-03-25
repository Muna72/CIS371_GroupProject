import React from "react";

const elements = [
  {
    name: "iPhone X",
    price: 800,
    imgUrl:
      "https://www.att.com/catalog/en/idse/Apple/Apple%20iPhone%20X/Space%20Gray-hero-zoom.png",
    quantityRemaining: 4
  },
  {
    name: '15" Macbook Pro 2018, 256gb',
    price: 1250.0,
    imgUrl:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/image/AppleInc/aos/published/images/m/bp/mbp15touch/space/mbp15touch-space-select-201807?wid=1808&hei=1680&fmt=jpeg&qlt=80&.v=1529520056969",
    quantityRemaining: 7
  },
  {
    name: "Samsung Galaxy S8",
    price: 1450.0,
    imgUrl:
      "https://images-na.ssl-images-amazon.com/images/I/41tsp7FIVgL._SL500_AC_SS350_.jpg",
    quantityRemaining: 1
  }
];

const items = elements.map(element => (
  <div key={element.name} className="storeItem">
    <div className="thumbnailContainer">
      <img src={element.imgUrl} className="thumbnail" alt="" />
    </div>
    <div className="itemActions">
      <input type="number" min="0" max={element.quantityRemaining} />
      <button>Add to Cart</button>
      <p className="quantityRemaining">
        Quantity Remaining: {element.quantityRemaining}
      </p>
    </div>
    <div className="itemDetails">
      <p>
        <b>{element.name}</b>
      </p>
      <p>${element.price}</p>
    </div>
  </div>
));

const GenerateItems = () => {
  return <div>{items}</div>;
};

const Shop = () => {
  return (
    <div className="main">
      <GenerateItems />
    </div>
  );
};

export default Shop;
