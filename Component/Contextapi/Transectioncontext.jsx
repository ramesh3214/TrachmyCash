import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const[totalbalance,setTotalbalance]=useState(0);

  
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem("transactions");
        const storedBalance = await AsyncStorage.getItem("balance");

        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
        if (storedBalance) {
          setBalance(JSON.parse(storedBalance));
        }
      } catch (e) {
        console.log(e);
      }
    };

    loadData();
  },[]);

  
  const addTransaction = async (amount, type, date, notes) => {
    const newTransaction = {
      id: Date.now(),
      amount,
      type,
      date: date || Date.now(),
      notes,
    };

    const updatedTransactions = [...transactions, newTransaction];

    
    setTransactions(updatedTransactions);

    
    const updatedBalance =
      type === "income" ? balance + amount : balance - amount;

    setBalance(updatedBalance);
    setTotalbalance( balance+totalbalance)

    try {
      //save to storage
      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(updatedTransactions)
      );

      await AsyncStorage.setItem(
        "balance",
        JSON.stringify(updatedBalance)
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        balance,
        transactions,
        addTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};