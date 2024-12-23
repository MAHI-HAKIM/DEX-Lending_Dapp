import React , {useState} from "react";
import { format } from "date-fns"; // For formatting the date

const TransactionHistory = (props) => {

 const [isFullValue, setIsFullValue] = useState(false); // Track if the full value should be shown

  // Function to handle toggling between full and truncated values
  const handleClick = () => {
    setIsFullValue(!isFullValue); // Toggle the state
  };

  // Function to format the number (truncate after 3 decimals)
  const formatNumber = (number) => {
    if (!number) return "0";

    const num = parseFloat(number);
    const strNum = num.toString();
    const decimalIndex = strNum.indexOf(".");

    if (decimalIndex !== -1 && strNum.length - decimalIndex > 4) {
      return `${num.toFixed(3)}...`; // Truncate after 3 decimals and add "..."
    }
    return strNum;
  };

  // Get the display value, either full or truncated
  function displayAddress(adress) {
    return `${adress.slice(0, 8)}...${adress.slice(-4)}`;
  };

  // Function to get the background color based on transaction type
  const getTransactionClass = (transactionType) => {
    switch (transactionType.toLowerCase()) {
      case 'deposit':
        return 'bg-blue-50'; // Dimmed blue
      case 'withdraw':
        return 'bg-green-200'; // Dimmed green
      case 'borrow':
        return 'bg-yellow-50'; // Dimmed orange
      case 'repay':
        return 'bg-red-200'; // Dimmed red
      default:
        return 'bg-white'; // Default color (no change)
    }
  };

  return (
    <>
    <div className=" rounded-bg-blue-950 h-[610px] overflow-y-auto">
    <table className="w-[750px]table-auto">
    <thead className="ltr:text-left rtl:text-right bg-gradient-to-r from-blue-950 via-indigo-700 to-blue-950 rounded-xl">
          <tr className="rounded-bg">
            <th className="whitespace-nowrap px-10 py-3 font-medium text-lg text-white">User Account</th>
            <th className="whitespace-nowrap px-10 py-3 font-medium text-lg text-white">Transaction Type</th>
            <th className="whitespace-nowrap px-15 py-3 font-medium text-lg text-white">Amount in ETH</th>
            <th className="whitespace-nowrap px-10 py-3 font-medium text-lg text-white">Date</th>
          </tr>
        </thead>

        <tbody className=" divide-y divide-gray-200 bg-white ">
          {props.transactions && props.transactions.length > 0 ? (
            props.transactions.map((tx, index) => (  
              <tr key={index} className={`${getTransactionClass(tx.transactionType)}`}>
                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {displayAddress(tx.user)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-700 text-lg rounded ">{tx.transactionType}</td>
                <td onClick={handleClick} className="whitespace-nowrap px-6 py-4 text-gray-700 text-lg">{isFullValue ? tx.amount : formatNumber(tx.amount)}</td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-700 text-lg">
                  {format(new Date(tx.timestamp), "MM/dd/yyyy HH:mm:ss")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-4 text-lg">
                No transactions available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default TransactionHistory;
