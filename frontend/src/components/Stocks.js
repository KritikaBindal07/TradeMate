import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./trader-portal.css";
import banner from "./banner.jpg";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getLocalData = () => {
  const list = localStorage.getItem("suppliers");

  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};
const getSupplierEnteries = () => {
  const list = localStorage.getItem("SupplierEnteries");

  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

const Stocks = () => {
  const [popup, setPopup] = useState(false);
  const [inputdata, setInputData] = useState("");
  const [items, setItems] = useState(getLocalData());
  const [isEditItem, setIsEditItem] = useState("");
  const [toggleButton, setToggleButton] = useState(false);
  const [enteriesPop, setEnteriesPop] = useState(false);
  const [SentriesMap, setSentriesMap] = useState({});
  const [records, setRecords] = useState(getSupplierEnteries());

  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleAccordionChange = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const showPopup = (e) => {
    setPopup((prev) => !prev);
  };
  const navigate = useNavigate();
  const navigateToCustomer = (e) => {
    e.preventDefault()
    navigate("/dash");
  };

  const navigateToSupplier = () => {
    navigate("/suppliers");
  };
  // add the items
  const addItem = () => {
    setPopup((prev) => !prev);
    if (!inputdata) {
      alert("plz fill the data");
    } else if (inputdata && toggleButton) {
      setItems(
        items.map((curElem) => {
          if (curElem.id === isEditItem) {
            return { ...curElem, name: inputdata };
          }
          return curElem;
        })
      );

      setInputData([]);
      setIsEditItem(null);
      setToggleButton(false);
    } else {
      const myNewTnputData = {
        id: new Date().getTime().toString(),
        name: inputdata,
      };
      setItems([...items, myNewTnputData]);
      setInputData("");
    }
  };

  const editItem = (index) => {
    const item_todo_edited = items.find((curElem) => {
      return curElem.id === index;
    });
    setInputData(item_todo_edited.name);
    setIsEditItem(index);
    setToggleButton(true);
  };

  // delete items
  const deleteItem = (id) => {
    const updatedItem = items.filter((curElem) => {
      return curElem.id !== id;
    });
    setItems(updatedItem);
  };
  const EnteriesPopup = () => {
    setEnteriesPop((prev) => !prev);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     DashboardValid();
  //     setData(true);
  //   }, 2000);
  // }, []);
  const HandleEnteries = (e, customerId) => {
    console.log(customerId);
    const name = e.target.name;
    const value = e.target.value;

    setSentriesMap((prevSentriesMap) => {
      const updatedSentriesMap = { ...prevSentriesMap };

      // Ensure entries for the current customer exist in the map
      if (!updatedSentriesMap[customerId]) {
        updatedSentriesMap[customerId] = {};
      }

      // Update the specific entry for the current customer
      updatedSentriesMap[customerId] = {
        ...updatedSentriesMap[customerId],
        [name]: value,
      };

      return updatedSentriesMap;
    });
  };
  const HandleSubmit = (e, customerId) => {
    console.log(customerId);
    setEnteriesPop((prev) => !prev);
    const entryId = new Date().getTime().toString();
    setRecords((prevRecords) => ({
      ...prevRecords,
      [customerId]: [
        ...(prevRecords[customerId] || []),
        { ...SentriesMap[customerId], id: entryId },
      ],
    }));
  };

  const deleteEntry = (customerId, entryId) => {
    setRecords((prevRecords) => {
      const updatedRecords = { ...prevRecords };

      if (updatedRecords[customerId]) {
        updatedRecords[customerId] = updatedRecords[customerId].filter(
          (entry) => entry.id !== entryId
        );
      }

      return updatedRecords;
    });

    // Update the local storage
    localStorage.setItem("Enteries", JSON.stringify(records));
  };

  //download pdf

  const downloadPDF = (id) => {
    const pdf = new jsPDF();
    pdf.text("Supplies Records", 20, 10);
    console.log(records[id]);
    const headers = ["Date", "Items Purchased", "Units"];

    const data = records[id].map((entry) => [
      entry.date,
      entry.items,
      entry.units,
    ]);

    //styles
    const headStyles = {
      fillColor: [252, 206, 122],
      textColor: [0, 0, 0],
      minCellHeight: 10,
      fontSize: 12,
      halign: "center",
    };
    const dataStyles = {
      textColor: [0, 0, 0],
      minCellHeight: 12,
      fontSize: 12,
      halign: "center",
    };
    pdf.autoTable({
      head: [headers],
      body: data,
      startY: 20,
      headStyles: headStyles,
      bodyStyles: dataStyles,
    });

    pdf.save("supplier_records.pdf");
  };

  //adding local storage
  useEffect(() => {
    localStorage.setItem("suppliers", JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem("SupplierEnteries", JSON.stringify(records));
  }, [records]);

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
             class="tab-bar-heading selected-section" data-target="Stocks-description">
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
              <button onClick={(e) => showPopup(e)}>Add Items</button>
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
                          <button
                            onClick={() => EnteriesPopup(currentCustomerId)}
                          >
                            Add Enteries
                          </button>

                          {enteriesPop && (
                            <div id="enteries-popup" className="enteries-popup">
                              <input
                                name="date"
                                placeholder="Enter Date"
                                type="text"
                                value={SentriesMap[curElem.id]?.date || ""}
                                onChange={(e) => HandleEnteries(e, curElem.id)}
                              />
                              <input
                                name="items"
                                placeholder="Enter Items"
                                type="text"
                                value={SentriesMap[curElem.id]?.items || ""}
                                onChange={(e) => HandleEnteries(e, curElem.id)}
                              />
                              <input
                                name="units"
                                placeholder="Enter no. of units purchased"
                                type="number"
                                value={SentriesMap[curElem.id]?.units || ""}
                                onChange={(e) => HandleEnteries(e, curElem.id)}
                              />
                              <button
                                onClick={(e) => HandleSubmit(e, curElem.id)}
                              >
                                OK
                              </button>
                            </div>
                          )}

                          <button onClick={() => deleteItem(curElem.id)}>
                            Delete Supplier
                          </button>
                          <button
                            onClick={() => downloadPDF(currentCustomerId)}
                          >
                            Download Pdf
                          </button>
                        </div>

                        <div class="enteries-header">
                          <div class="date">Date</div>

                          <div class="you-got">ITEMS PURCHASED</div>

                          <div class="you-gave"> UNITS</div>

                          <div className="operation">OPERATION</div>
                        </div>

                        {records[curElem.id] &&
                          records[curElem.id].length > 0 && (
                            <div>
                              {records[curElem.id].map((entry) => (
                                <div class="enteries" key={entry.id}>
                                  <div class="date"> {entry.date}</div>
                                  <div class="you-got">{entry.items}</div>
                                  <div class="you-gave">{entry.units}</div>
                                  {/* <div className="total">
                                        {parseInt(entry.youGot) -
                                          parseInt(entry.youGave) >=
                                        0
                                          ? `+₹${
                                              parseInt(entry.youGot) -
                                              parseInt(entry.youGave)
                                            }`
                                          : `-₹${Math.abs(
                                              parseInt(entry.youGot) -
                                                parseInt(entry.youGave)
                                            )}`}
                                      </div> */}
                                  <div className="del">
                                    <button
                                      onClick={() =>
                                        deleteEntry(curElem.id, entry.id)
                                      }
                                    >
                                      Delete
                                    </button>
                                    {/* <button onClick={() => EditTrans(transaction.id)}>
                                Edit
                              </button> */}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        {/* <div class="enteries">
                          <div class="date">04/11/23</div>

                          <div class="you-got">ITEM 1</div>

                          <div class="you-gave">24 / 50</div>
                          <div className="del">
                            <button>Delete</button>
                            
                          </div>
                        </div> */}
                        {/* <div class="enteries">
                          <div class="date">05/12/23</div>

                          <div class="you-got">ITEM 2</div>

                          <div class="you-gave">13 / 100</div>
                          <div className="del">
                            <button>Delete</button>
                            
                          </div>
                        </div> */}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>
          </div>

          <div class="right-side" id="suppliers">
            <div id="customer-popup" class="pop-up">
              <input id="cst-name" placeholder="Enter Name" type="text" />
              <button onclick="getValue()">OK</button>
            </div>

            <div id="add-customers-btn" class="add-btn">
              <button>Add Supplier</button>
            </div>
            <div id="accordion" class="accordion">
              <div class="accordion-content-box">
                <div class="accordion-label">
                  <div class="name">Ayush Mehra</div>
                </div>

                <div class="accordion-content">
                  <div class="enteries-header">
                    <div class="date">Date</div>

                    <div class="you-got">YOU GOT</div>

                    <div class="you-gave">YOU GAVE</div>
                  </div>
                  <div class="enteries">
                    <div class="date">01/12/23</div>

                    <div class="you-got">₹1000</div>

                    <div class="you-gave">₹10000</div>
                  </div>

                  <div class="enteries">
                    <div class="date">05/12/23</div>

                    <div class="you-got">₹100</div>

                    <div class="you-gave">₹1000</div>
                  </div>
                </div>
              </div>

              <div class="accordion-content-box">
                <div class="accordion-label">Vivek Sharma</div>

                <div class="accordion-content">
                  <div class="enteries-header">
                    <div class="date">Date</div>

                    <div class="you-got">YOU GOT</div>

                    <div class="you-gave">YOU GAVE</div>
                  </div>
                  <div class="enteries">
                    <div class="date">04/11/23</div>

                    <div class="you-got">₹1000</div>

                    <div class="you-gave">₹10000</div>
                  </div>
                </div>
              </div>

              <div class="accordion-content-box">
                <div class="accordion-label">Nancy Thakur</div>

                <div class="accordion-content">
                  <div class="enteries-header">
                    <div class="date">Date</div>

                    <div class="you-got">YOU GOT</div>

                    <div class="you-gave">YOU GAVE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Stocks;
