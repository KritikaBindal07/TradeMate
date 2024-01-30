import React from "react";
import {useEffect} from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
const About = () => {
  useEffect(() => {
    AOS.init({
      duration:1800,
    });
  }, [])
  return (
    <>
      <div
        style={{ marginTop: "4rem", marginBottom: "5rem" }}
        className="intro-text"
      >
        <h1>Seamless Trades, Smarter Business.</h1>
      </div>

      <div data-aos="fade-up" className="about-text">
      At TradeMate, we're more than just a platform, we're your trusted partner in the world of commerce. Our journey began with a simple yet powerful vision – to empower traders, suppliers, and businesses with a seamless and efficient platform that enhances the way they operate and succeed.
      <div>
      We've conjured up a platform that's so easy to use, it feels like magic! <br />
      Whether you're a seasoned trader or just starting your trade adventure, TradeMate is here to add a little sunshine to your day. Thanks for choosing us!

      
      </div>
      
      </div>
     

      

      
    </>
  );
};

export default About;
