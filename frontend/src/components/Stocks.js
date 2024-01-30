import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./trader-portal.css";
import banner from "./banner.jpg";
import { useLocation } from "react-router-dom";

const getLocalData = () => {
  const list = localStorage.getItem("stocks");

  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

const Stocks = () => {
  const [popup, setPopup] = useState(false);
  const [inputdata, setInputData] = useState("");
  const [itemsQuantity, setItemsQuantity] = useState("");
  const [items, setItems] = useState(getLocalData());
  const [isEditItem, setIsEditItem] = useState("");
  const [toggleButton, setToggleButton] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleAccordionChange = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const showPopup = (e) => {
    setPopup((prev) => !prev);
  };
  const navigate = useNavigate();
  const navigateToCustomer = (e) => {
    e.preventDefault();
    navigate("/dash");
  };

  const navigateToSupplier = () => {
    navigate("/suppliers");
  };
  // add the items
  const addItem = () => {
    setPopup((prev) => !prev);
    if (!inputdata || !itemsQuantity) {
      alert("plz fill the data");
    } else if (inputdata && toggleButton) {
      setItems(
        items.map((curElem) => {
          if (curElem.id === isEditItem) {
            return { ...curElem, name: inputdata, quantity: itemsQuantity };
          }
          return curElem;
        })
      );

      setInputData([]);
      setItemsQuantity([]);
      setIsEditItem(null);
      setToggleButton(false);
    } else {
      const myNewTnputData = {
        id: new Date().getTime().toString(),
        name: inputdata,
        quantity: itemsQuantity,
      };
      setItems([...items, myNewTnputData]);
      setInputData("");
      setItemsQuantity("");
    }
  };

  const editItem = (id) => {
    const item_todo_edited = items.find((curElem) => {
      return curElem.id === id;
    });
    setInputData(item_todo_edited.name);
    setItemsQuantity(item_todo_edited.quantity);
    setIsEditItem(id);
    setToggleButton(true);
  };

  // delete items
  const deleteItem = (id) => {
    const updatedItem = items.filter((curElem) => {
      return curElem.id !== id;
    });
    setItems(updatedItem);
  };

  //adding local storage
  useEffect(() => {
    localStorage.setItem("stocks", JSON.stringify(items));
  }, [items]);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/stocks")) {
      const lowQuantityItems = items.filter((curElem) => curElem.quantity < 20);

      if (lowQuantityItems.length > 0) {
        const names = lowQuantityItems.map((item) => item.name).join(", ");
        alert(`Low quantity alert: ${names} have less than 20 items.`);
      }
    }
  }, [location.pathname]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div class="banner">
          <img src={banner} />
        </div>
        <div class="main-container">
          <div data-aos="fade-right" class="left-menu">
            <a
              href="/dash"
              onClick={navigateToCustomer}
              class="tab-bar-heading"
            >
              Customers
            </a>

            <a
              onClick={navigateToSupplier}
              class="tab-bar-heading "
              data-target="supplier-description"
            >
              Suppliers
            </a>
            <a
              href="#stocks"
              class="tab-bar-heading selected-section"
              data-target="Stocks-description"
            >
              Stocks
            </a>
          </div>

          <div id="customers" data-aos="fade-up" class="right-side">
            {popup ? (
              <>
                <div id="customer-popup" class="pop-up">
                  <input
                    id="cst-name"
                    placeholder="Enter Name"
                    type="text"
                    value={inputdata}
                    onChange={(e) => setInputData(e.target.value)}
                  />
                  <input
                    id="cst-name"
                    placeholder="Enter quantity of items"
                    type="number"
                    value={itemsQuantity}
                    onChange={(e) => setItemsQuantity(e.target.value)}
                  />
                  {toggleButton ? (
                    <i className="fa fa-edit add-btn" onClick={addItem}></i>
                  ) : (
                    <i className="fa fa-plus add-btn" onClick={addItem}></i>
                  )}
                  <button onClick={addItem}>OK</button>
                </div>
              </>
            ) : (
              <></>
            )}

            <div id="add-customers-btn" class="add-btn">
              <button onClick={(e) => showPopup(e)}>Add Item</button>
            </div>

            {/* //accordion */}
            <div>
              {items.map((curElem, index) => {
                const currentCustomerId = curElem.id;
                return (
                  <Accordion
                    expanded={expandedIndex === index}
                    onChange={() => handleAccordionChange(index)}
                    className="eachItem"
                    key={curElem.id}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        {curElem.name}

                        <div className="btn">
                          <i
                            className="far fa-edit add-btn"
                            onClick={() => editItem(curElem.id)}
                          ></i>
                          <i
                            className="far fa-trash-alt add-btn"
                            onClick={() => deleteItem(curElem.id)}
                          ></i>
                        </div>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <div className="del">
                          <button onClick={() => deleteItem(curElem.id)}>
                            Delete Item
                          </button>
                          <button onClick={() => editItem(curElem.id)}>
                            Edit Item
                          </button>
                        </div>

                        <div class="enteries-header">
                          <div class="you-got">ITEM</div>

                          <div class="you-gave"> No. of Items</div>
                        </div>

                        <div
                          className={`enteries ${
                            curElem.quantity < 20 ? "low-quantity" : ""
                          }`}
                        >
                          <div class="date"> {curElem.name}</div>
                          <div className="you-got">{curElem.quantity}</div>
                        </div>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stocks;
