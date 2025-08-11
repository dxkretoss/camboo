import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [allProductandService, setallProductandService] = useState(null);
  const [clientsProductandService, setclientsProductandService] =
    useState(null);

  useEffect(() => {
    getUserProfileData();
    getallProdandSer();
    getClientsProdandSer();
  }, []);

  const getUserProfileData = async () => {
    try {
      const token = Cookies.get("token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setProfile(res.data.data);
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setallProductandService(res.data.data);
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setclientsProductandService(res.data.data);
      }
    } catch (err) {
      console.error(err);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
