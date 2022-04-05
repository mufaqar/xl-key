import React from "react";
import {useSelector, useDispatch} from 'react-redux';
import {useLanguageContext} from "./contexts/LanguageContext";
import {setLanguage} from '../actions';

export default function LanguageHandler() {
    const dispatch = useDispatch();
    const {language, changeLanguage} = useLanguageContext();
    
    function updateLanguage(lang) {
        changeLanguage(lang);
        dispatch(setLanguage(lang));
    }

    return (
        <select value={language} onChange={(e) => updateLanguage(e.target.value)}>
            <option value="EN">English</option>
            <option value="FR">French</option>
        </select>
    );
}
