import React from "react";
import Logo from "../assets/moralis-logo.svg";
import Eth from "../assets/eth.svg";
// import { Link } from "react-router-dom";

function Header(props) {
  const { address, authUser, connect ,walletBalance} = props;

  // Ensure the address is valid before applying slice
  const displayAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "Connect";

    const displayWallletBalance = walletBalance
    ? `${walletBalance.slice(0, 6)}...ETH`
    : "Connect";

    // console.log("Header.js - address: ", displayAddress);
    console.log("Header.js - isConnected: ", authUser);
  return (
    <header>
      <div className="leftH">
        <img src={Logo} alt="logo" className="logo" />
        <div to="/" className="link">
          <div className="headerItem">Transact</div>
        </div>
        <div to="/tokens" className="link">
          <div className="headerItem">History</div>
        </div>
      </div>
      <div className="rightH">
        <div className="headerItem">
          <img src={Eth} alt="eth" className="eth" />
          {authUser ? displayWallletBalance : "Ethereum"}
        </div>
        <div className="connectButton" onClick={connect}>
          {authUser ? displayAddress : " Connect "}
        </div>
      </div>
    </header>
  );
}

export default Header;
