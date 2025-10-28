import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const token = Cookies.get("token");
  const [profile, setProfile] = useState(null);
  const [allProductandService, setallProductandService] = useState(null);
  const [clientsProductandService, setclientsProductandService] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [clientSaveItems, setclientSaveItems] = useState(null);
  const [suggestedTrades, setsuggestedTrades] = useState(null);
  const [getallNotification, setgetallNotification] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    Promise.all([
      getUserProfileData(),
      getallProdandSer(),
      getClientsProdandSer(),
      getClientSaveitems(),
      getsuggestedTrades(),
      getAllNotification(),
    ]).finally(() => setLoading(false));
  }, []);

  const getUserProfileData = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res?.data?.success) {
        setProfile(res?.data?.data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getallProdandSer = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-product_and_service`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res?.data?.success) {
        setallProductandService(res?.data?.data);
      } else {
        setallProductandService(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getClientsProdandSer = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-my_product_and_service`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res?.data?.success) {
        setclientsProductandService(res?.data?.data);
      } else {
        setclientsProductandService(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getClientSaveitems = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-save-item`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res?.data?.success) {
        if (res?.data?.data?.length > 0) {
          setclientSaveItems(res?.data?.data);
        }
      } else {
        setclientSaveItems(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getsuggestedTrades = async () => {
    try {
      const token = Cookies.get("token");
      const getTrades = await axios.get(
        `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-suggested_trades`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (getTrades?.data?.success) {
        setsuggestedTrades(getTrades?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllNotification = async () => {
    try {
      const getNoti = await axios.get(
        `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-notification`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (getNoti?.data?.success) {
        setgetallNotification(getNoti?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        setProfile,
        allProductandService,
        clientsProductandService,
        getallProdandSer,
        getUserProfileData,
        getClientsProdandSer,
        loading,
        getClientSaveitems,
        clientSaveItems,
        suggestedTrades,
        getsuggestedTrades,
        getallNotification,
        getAllNotification,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
