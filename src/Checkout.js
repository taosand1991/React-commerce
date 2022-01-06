import React, { useState, useEffect } from "react";
import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
  addProduct,
  removeProduct,
}) => {
  const disabledButton = () => {
    return orderedQuantity === availableCount;
  };

  const disabledRemoveBtn = () => {
    return orderedQuantity === 0;
  };

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total}</td>
      <td>
        <button
          data-testid="increase"
          disabled={disabledButton()}
          onClick={() => addProduct(id)}
          className={styles.actionButton}
        >
          +
        </button>
        <button
          data-testid="decrease"
          onClick={() => removeProduct(id)}
          disabled={disabledRemoveBtn()}
          className={styles.actionButton}
        >
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState("0.00");
  const [discount, setDiscount] = useState();

  useEffect(() => {
    setLoading(true);
    getProducts().then((products) => {
      const newProducts = products.map((product) => {
        return Object.defineProperties(product, {
          orderedQuantity: {
            value: 0,
            writable: true,
          },
          total: {
            value: "0.00",
            writable: true,
          },
        });
      });
      setProducts(newProducts);
      setLoading(false);
    });
    return () => {};
  }, []);

  const addProduct = (id) => {
    const newProducts = [...products];
    const productIndex = [...products].findIndex(
      (product) => product.id === id
    );
    let product = newProducts[productIndex];
    product.orderedQuantity++;
    product.total = (product.orderedQuantity * product.price).toFixed(2);
    setProducts(newProducts);
    calculateTotal();
  };

  const removeProduct = (id) => {
    const newProducts = [...products];
    const productIndex = [...products].findIndex(
      (product) => product.id === id
    );
    let product = newProducts[productIndex];

    product.orderedQuantity--;
    product.total = (product.orderedQuantity * product.price).toFixed(2);
    setProducts(newProducts);
    calculateTotal();
  };

  const calculateTotal = () => {
    let total = 0;
    let discount;
    const newProducts = [...products];
    if (newProducts.length === 0) {
      return "0.00";
    }
    newProducts.map((product) => (total += Number(product.total)));
    if (total >= 1000) {
      discount = ((total * 10) / 100).toLocaleString("en-GB", {
        currency: "USD",
        maximumFractionDigits: 2,
      });
      total = (total - discount).toLocaleString("en-GB", {
        currency: "USD",
        maximumFractionDigits: 2,
      });
      setTotal(total);
      setDiscount(discount);
    }
    total.toLocaleString("en-GB", {
      currency: "USD",
      maximumFractionDigits: 2,
    });
    setDiscount(discount);
    setTotal(total);
  };

  return (
    <div>
      <header className={styles.header}>
        <h1>Legacy World</h1>
      </header>
      <main>
        {loading && <LoadingIcon />}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <Product
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  availableCount={product.availableCount}
                  total={product.total}
                  orderedQuantity={product.orderedQuantity}
                  addProduct={addProduct}
                  removeProduct={removeProduct}
                />
              );
            })}
          </tbody>
        </table>
        <h2>Order summary</h2>
        {discount && <p>Discount: ${discount} </p>}
        <p>Total: ${total} </p>
      </main>
    </div>
  );
};

export default Checkout;
