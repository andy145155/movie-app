import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Nav.css";
import mainLogo from "../../assets/img/logo.png";
import avatar from "../../assets/img/avatar.png";

function Nav() {
  const [show, handleShow] = useState(false);
  const navigateTo = useNavigate();

  const transitionNavBar = () => {
    window.scrollY > 100 ? handleShow(true) : handleShow(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, []);

  return (
    <div className={`nav ${show && "nav_black"}`}>
      <div className="nav_contents">
        <img
          onClick={() => navigateTo("/home")}
          className="nav_logo"
          src={mainLogo}
          alt=""
        />
        <img
          onClick={() => navigateTo("/profile", { state: "" })}
          className="nav_avatar"
          src={avatar}
          alt=""
        />
      </div>
    </div>
  );
}

export default Nav;
