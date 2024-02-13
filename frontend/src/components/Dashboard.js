import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoginContext } from "./ContextProvider/Context";
import Box from "@mui/material/Box";
import "./trader-portal.css";
import banner from "./banner.jpg";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getLocalData = () => {
  const list = localStorage.getItem("mytodoList");

  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

const getEnteries = () => {
  const list = localStorage.getItem("Enteries");

  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

const Dashboard = () => {
  const navigate = useNavigate();

  const navigateToSupplier = () => {
    navigate("/suppliers");
  };
  const navigateToStocks = () => {
    navigate("/stocks");
  };
  const [popup, setPopup] = useState(false);
  const [enteriesPop, setEnteriesPop] = useState(false);
  const [inputdata, setInputData] = useState("");
  const [items, setItems] = useState(getLocalData());
  const [isEditItem, setIsEditItem] = useState("");
  const [toggleButton, setToggleButton] = useState(false);
  const [entriesMap, setEntriesMap] = useState({});

  // const [enteries, setEnteries] = useState({
  //   date: "",
  //   youGot: "",
  //   youGave: "",
  // });
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleAccordionChange = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
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
  const showPopup = (e) => {
    setPopup((prev) => !prev);
  };

  const EnteriesPopup = (key) => {
    setEnteriesPop((prev) => !prev);
    console.log(key);
  };
  const { logindata, setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);

  const history = useNavigate();

  //add enteries

  // const HandleInput = (e) => {
  //   const date = e.target.name;
  //   const value = e.target.value;
  //   console.log(name, value);
  //   setUserInput({ ...userInput, [name]: value });
  //   console.log(userInput);
  // };
  const [records, setRecords] = useState(getEnteries());

  // const HandleEnteries = (e) => {
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   setEnteries({
  //     ...enteries,
  //     [name]: value,
  //   });
  // };

  const HandleEnteries = (e, customerId) => {
    console.log(customerId);
    const name = e.target.name;
    const value = e.target.value;

    setEntriesMap((prevEntriesMap) => {
      const updatedEntriesMap = { ...prevEntriesMap };

      // Ensure entries for the current customer exist in the map
      if (!updatedEntriesMap[customerId]) {
        updatedEntriesMap[customerId] = {};
      }

      // Update the specific entry for the current customer
      updatedEntriesMap[customerId] = {
        ...updatedEntriesMap[customerId],
        [name]: value,
      };

      return updatedEntriesMap;
    });
  };

  // const HandleSubmit = () => {
  //   setEnteriesPop((prev) => !prev);
  //   const entryId = new Date().getTime().toString();
  //   setRecords((prevRecords) => [...prevRecords, { ...enteries, id: entryId }]);
  //   console.log(records);
  //   console.log(enteries);
  //   setEnteries({
  //     date: "",
  //     youGot: "",
  //     youGave: "",
  //   });
  // };

  const HandleSubmit = (e, customerId) => {
    console.log(customerId);
    setEnteriesPop((prev) => !prev);
    const entryId = new Date().getTime().toString();
    setRecords((prevRecords) => ({
      ...prevRecords,
      [customerId]: [
        ...(prevRecords[customerId] || []),
        { ...entriesMap[customerId], id: entryId },
      ],
    }));

    // setEntriesMap((prevEntriesMap) => ({
    //   ...prevEntriesMap,
    //   [customerId]: {
    //     date: "",
    //     youGot: "",
    //     youGave: "",
    //   },
    // }));
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

  // const editItem = (index) => {
  //   const item_todo_edited = items.find((curElem) => {
  //     return curElem.id === index;
  //   });
  //   setInputData(item_todo_edited.name);
  //   setIsEditItem(index);
  //   setToggleButton(true);
  // };

  // delete items
  const deleteItem = (id) => {
    const updatedItem = items.filter((curElem) => {
      return curElem.id !== id;
    });
    setItems(updatedItem);
  };

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();
    console.log(data.ValidUserOne.email);
    if (data.status == 401 || !data) {
      history("*");
    } else {
      console.log("user verify");
      setLoginData(data);
      history("/dash");
    }
  };

  const downloadPDF = (id) => {
    const pdf = new jsPDF();
    pdf.text("Customer Transactions", 20, 10);
    console.log(records[id]);
    const headers = ["Date", "You Got", "You Gave", "Balance"];

    const data = records[id].map((entry) => [
      entry.date,
      entry.youGot,
      entry.youGave,
      Math.abs(parseInt(entry.youGot) - parseInt(entry.youGave)),
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

    pdf.save("customer_transactions.pdf");
  };

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true);
    }, 2000);
  }, []);

  //adding local storage
  useEffect(() => {
    localStorage.setItem("mytodoList", JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem("Enteries", JSON.stringify(records));
  }, [records]);

  return (
    <>
      {data ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* {data.email} */}
          {/* {logindata ? logindata.ValidUserOne.email : ""} */}
          <div class="banner">
            <img src={banner} />
          </div>
          <div class="main-container">
            <div data-aos="fade-right" class="left-menu">
              <a href="#customers" class="selected-section tab-bar-heading">
                Customers
              </a>

              <a
                onClick={navigateToSupplier}
                class="tab-bar-heading"
                data-target="supplier-description"
              >
                Suppliers
              </a>

              <a
                onClick={navigateToStocks}
                class="tab-bar-heading"
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
                <button onClick={(e) => showPopup(e)}>Add Customer</button>
              </div>

              {/* //accordion */}
             
                {items.map((curElem, index) => {
                  const currentCustomerId = curElem.id;
                  return (
                    <Accordion
                      key={currentCustomerId}
                      expanded={expandedIndex === index}
                      onChange={() => handleAccordionChange(index)}
                      className="eachItem"
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography
                          style={{ justifyContent: "space-around" }}
                          className="flex-row"
                        >
                          <div>{curElem.name}</div>

                          {/* <div className="del-cust">
                              <button  onClick={() => editItem(curElem.id)}>Del</button>
                              <button>Edit</button>
                            </div>
                          <div className="btn">
                            <i
                              className="far fa-edit add-btn"
                              onClick={() => editItem(curElem.id)}
                            ></i>
                            <i
                              className="far fa-trash-alt add-btn"
                              onClick={() => deleteItem(curElem.id)}
                            ></i>
                          </div> */}
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
                              <div
                                id="enteries-popup"
                                className="enteries-popup"
                              >
                                <input
                                  name="date"
                                  placeholder="Enter Date"
                                  type="text"
                                  value={entriesMap[curElem.id]?.date || ""}
                                  onChange={(e) =>
                                    HandleEnteries(e, curElem.id)
                                  }
                                />
                                <input
                                  name="youGot"
                                  placeholder="Enter amount you got"
                                  type="text"
                                  value={entriesMap[curElem.id]?.youGot || ""}
                                  onChange={(e) =>
                                    HandleEnteries(e, curElem.id)
                                  }
                                />
                                <input
                                  name="youGave"
                                  placeholder="Enter amount you gave"
                                  type="text"
                                  value={entriesMap[curElem.id]?.youGave || ""}
                                  onChange={(e) =>
                                    HandleEnteries(e, curElem.id)
                                  }
                                />
                                <button
                                  onClick={(e) => HandleSubmit(e, curElem.id)}
                                >
                                  OK
                                </button>
                              </div>
                            )}

                            <button
                              onClick={() => deleteItem(currentCustomerId)}
                            >
                              Delete Customer
                            </button>

                            <button
                              onClick={() => downloadPDF(currentCustomerId)}
                            >
                              Download Pdf
                            </button>
                            {/* <button
                              className="far fa-edit add-btn"
                              onClick={() => editItem(curElem.id)}
                            >Edit</button> */}
                          </div>

                          <div class="enteries-header">
                            <div class="date">Date</div>

                            <div class="you-got">YOU GOT</div>

                            <div class="you-gave">YOU GAVE</div>
                            <div className="total">BALANCE</div>

                            <div className="operation">OPERATION</div>
                          </div>

                          {/* {curElem.entries.map((entry) => (
                            <div class="enteries" key={entry.id}>
                              <div class="date">{entry.date}</div>
                              <div class="you-got">{entry.youGot}</div>
                              <div class="you-gave">{entry.youGave}</div>
                              <div className="total">{entry.total}</div>
                              <div className="del">
                                <button onClick={() => deleteTrans(entry.id)}>
                                  Delete
                                </button>
                               
                              </div>
                            </div>
                          ))} */}

                          {records[curElem.id] &&
                            records[curElem.id].length > 0 && (
                              <div>
                                {records[curElem.id].map((entry) => (
                                  <div class="enteries" key={entry.id}>
                                    <div class="date"> {entry.date}</div>
                                    <div class="you-got">{entry.youGot}</div>
                                    <div class="you-gave">{entry.youGave}</div>
                                    <div className="total">
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
                                    </div>
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
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </div>
            </div>
          </div>
        
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading... &nbsp;
          {/* <CircularProgress /> */}
        </Box>
      )}
    </>
  );
};

export default Dashboard;