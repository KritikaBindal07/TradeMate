import React from "react";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./footer.css";
import "./mix.css"
const Footer = () => {
  useEffect(() => {
    AOS.init({
      duration: 1800,
    });
  }, []);
  return (
    <div className="footer">
      <div className="col">
        <h1>TradeMate</h1>
        <p>Seamless Trades, Smarter Business.</p>

        <div className="copyright">
          <p>© 2023 TradeMate, Inc. All rights reserved.</p>
        </div>
      </div>
      <div className="col">
        <h3>Quick Links</h3>
        <NavLink style={{ color: "#fff", textDecoration: "none" }} to="/">
          <p>Home</p>
        </NavLink>
        <NavLink style={{ color: "#fff", textDecoration: "none" }} to="/about">
          <p>About us</p>
        </NavLink>
        {/* <NavLink
          style={{ color: "#fff", textDecoration: "none" }}
          to="/contact"
        >
          <p>Contact us</p>
        </NavLink> */}
        {/* <NavLink
          style={{ color: "#fff", textDecoration: "none" }}
          to="/testimonials"
        >
          <p>Testimonials</p>
        </NavLink> */}
      </div>
      <div className="col">
        <h3>Your feedback fuels our journey!</h3> <p>Connect with us :</p>
        <p>trademate@yopmail.com </p>
        <p>96-9678807809</p>
        <div className="button">
          <NavLink to="/contact">
            <button>Contact Us</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Footer;
