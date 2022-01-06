import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import Checkout from "./Checkout";
import { getProducts } from "./dataService";

jest.mock("./dataService.js");
jest.useFakeTimers();

it("renders learn react link", async () => {
  const products = [
    { id: 1, name: "Acer Aspire Laptop", price: 369.99, availableCount: 2 },
  ];

  getProducts.mockImplementation(() => {
    return Promise.resolve(products);
  });

  render(
    <App>
      <Checkout />
    </App>
  );

  const linkElement = await screen.findByText(/Legacy World/i);
  const increaseButton = await screen.findByTestId("increase");
  const decreaseButton = await screen.findByTestId("decrease");
  expect(linkElement).toBeInTheDocument();
  expect(getProducts).toHaveBeenCalledTimes(1);
  products.map((product) => {
    expect(product.name).toEqual("Acer Aspire Laptop");
    expect(product.total).toEqual("0.00");
    expect(decreaseButton).toBeDisabled();
    expect(product.orderedQuantity).toEqual(0);
    fireEvent.click(increaseButton);
    expect(product.orderedQuantity).toEqual(1);
    expect(decreaseButton).not.toBeDisabled();
  });
});
