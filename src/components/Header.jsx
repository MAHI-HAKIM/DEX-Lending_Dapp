import { React, useState } from "react";
import Logo from "../assets/moralis-logo.svg";
import Eth from "../assets/eth.svg";
import Modal from "react-modal";
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon

const Header = (props) => {

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const { address, authUser, connect, walletBalance, logout } = props;

  const openModal = () => setIsModalOpen(true); // Open modal
  const closeModal = () => setIsModalOpen(false); // Close modal

  const handleLogout = () => {
    logout();
    closeModal(); // Close modal after logout
  };

  // Ensure the address is valid before applying slice
  const displayAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "Connect";

  const displayWallletBalance = walletBalance
    ? `${walletBalance.slice(0, 6)}...ETH`
    : "Connect";

  return (
    <>
    <header>
      <div className="leftH">
        <img src={Logo} alt="logo" className="logo" />
        
        {authUser ? (<div to="/" className="link">
          <div className="headerItem">Transactions</div>
        </div>) : ""}
        
      </div>
      <div className="rightH">
        <div className="headerItem">
          <img src={Eth} alt="eth" className="eth" />
          {authUser ? displayWallletBalance : "Ethereum"}
        </div>
        <div>
          {!authUser ? (
            <div className="connectButton" onClick={connect}>Connect</div>
          ) : (
            <>
              <div
                className="connectButton"
                onClick={openModal}
                style={{ cursor: "pointer" }}
              >
                {displayAddress}
              </div>
              {/* Logout Modal */}
              <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="bg-white w-96 p-6 rounded-lg shadow-lg mx-auto mt-24"
                overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center"
              >
                <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to log out?
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              </Modal>
            </>
          )}
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
