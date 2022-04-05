import React, {useState, useContext, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../../actions';

const LanguageContext = React.createContext();
export const useLanguageContext = () => useContext(LanguageContext);

export default function LanguageContextProvider({ children }) {
  // const dispatch = useDispatch();
  let userLang = useSelector(state => state.userLang);
  //let changeLanguage = (userLang) = dispatch(setLanguage(userLang));
  
  const [language, changeLanguage] = useState("EN");
  // const [language, changeLanguage] = useState(userLang);

  useEffect(() => {
    if (userLang) {
      changeLanguage(userLang);
    }
  }, [userLang])

  console.log("userLang", language);
  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
