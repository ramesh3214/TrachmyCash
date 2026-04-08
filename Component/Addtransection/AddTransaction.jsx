import React, { useContext } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TransactionContext } from "../Contextapi/Transectioncontext";
import AddTransactionForm from "./Layouts/AddTransactionForm";

function AddTransaction() {
  const navigation = useNavigation();
  const { addTransaction } = useContext(TransactionContext);

  const handleSubmit = async (transactionData) => {
    try {
      await addTransaction(
        transactionData.amount,
        transactionData.type,
        transactionData.date,
        transactionData.notes,
        transactionData.category
      );
      Alert.alert("Success", "Transaction added!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <AddTransactionForm 
      onSubmit={handleSubmit}
      onBack={handleBack}
    />
  );
}

export default AddTransaction;