import React from "react";
import GenerateItems from "./GenerateItems";
/* is used incase we want to render multiple components onto the same page.
each componenet could be styled and placed on the page.
*/

const Shop = () => {
  return (
    <div className="main">
      <GenerateItems />
    </div>
  );
};

export default Shop;
