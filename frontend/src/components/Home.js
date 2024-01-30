import React from "react";
import Header from "./Header";
import home from "./home.jpg";
import {NavLink } from "react-router-dom";
import {useEffect} from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import transactions from "./transactions.jpg";
import Stocks from "./Stocks.webp";
import purchaseTrack from "./purchaseTrack.jpg"
const Home = () => {
  useEffect(() => {
    AOS.init({
      duration:1800,
    });
  }, [])
  return (
    // <div>
    //   <img src={home} />
    // </div>

    <>
      <section className="homeSections">
        <div data-aos="fade-down" className="intro-text">
          <h1 >
            <span>Manage & Track</span> <br /> your Trading Activities.
          </h1>
        </div>

        <div data-aos="fade-down" className="brief-text">
          Become more focused, organised and calm with TradeMate.
        </div>
        <div data-aos="fade-down" className="button">
            <NavLink to="/register">
            <button>Sign up</button>

            </NavLink>
            </div>
      </section>

      <section className="features">
        <div className="heading">
          <h1>Features</h1>
        </div>

        <div data-aos="fade-left" className="cards">
        <div className="feature-cards">
            <img src={Stocks} alt="" />
            <div className="card-text">
              <h1>Manage Stocks</h1>
              <p>
              Take control of your inventory effortlessly with our robust Inventory Management feature. Keep track of stock levels, monitor items purchased optimally.
              </p>
            </div>
          </div>
          <div className="feature-cards">
            <img src={transactions} alt="" />
            <div className="card-text">
              <h1>Record Transactions</h1>
              <p>
                Streamline your business operations with our efficient
                transaction recording feature. Keep detailed and organized
                records of all your transactions effortlessly.
              </p>
            </div>
          </div>
          
          <div className="feature-cards">
          <img src={purchaseTrack} alt="" />
            <div className="card-text">
              <h1>Purchase Tracking</h1>
              <p>
              Efficiently manage your inventory by tracking the purchase history associated with different suppliers.This feature allows you to maintain a comprehensive record of items purchased from each supplier.
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Home;
