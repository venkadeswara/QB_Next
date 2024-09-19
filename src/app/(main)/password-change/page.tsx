"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/app/components/ThemeContext";
import { passwordchanges } from "@/api/route";
import Tooltip from "@/app/components/Tooltip";
import {  
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

interface payload{
  newPassword:string;
  oldPassword:string;
  confirmNewPassword:string;
  _csrf:string | null;
}
const getCookieValue = (name: string): string | null => {
  if (typeof window !== "undefined") {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() ?? null;
    }
  }
  return null;
};
const tokenValue = getCookieValue("User");
export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false);
  const { tbodyfullcolor,isDarkMode,theadcolor} = useTheme();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [oldNewPasswordError, setOldNewPasswordError] = useState("");
  const [confirmPasswordEnabled, setConfirmPasswordEnabled] = useState(true);
 
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const apiBaseAuthentication = process.env.NEXT_PUBLIC_API_BASE_AUTHENTICATION;
  
  useEffect(() => {
    const  fetchPasswordData = async () => {
      try {
       
        const targetUrl = `${apiBaseAuthentication}password-change`;
        const response = await fetch(targetUrl, {
          method: "GET",
          credentials:"include",
          headers: {
           
            Accept: "application/json",
          },
        });
        const text = await response.text();              
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const tokens = doc
          .querySelector('meta[name="_csrf"]')
          ?.getAttribute("content");
        setCsrfToken(tokens || null);     
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return null;
        }
        const data = await response.json();
        return data;
      } catch (error) {
        return error;
      }
    };
 
    fetchPasswordData();
  }, []);

  const validatePassword = (password: string) => {
    const errors = {
      length: password.length < 10,
      uppercase: !/[A-Z]/.test(password),
      lowercase: !/[a-z]/.test(password),
      number: !/[0-9]/.test(password),
      special: !/[!@#$%^&*]/.test(password),
    };
    setValidationErrors(errors);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);
    validatePassword(newPasswordValue);

    if (oldPassword === newPasswordValue) {
      setOldNewPasswordError(
        "Old password and new password should not be the same."
      );
      setConfirmPasswordEnabled(false);
    } else {
      setOldNewPasswordError("");
      setConfirmPasswordEnabled(true);
    }
  };

  const handleSubmit = async() => {
    const payloaded : payload={
      oldPassword:oldPassword,
      newPassword:newPassword,
      confirmNewPassword:confirmNewPassword,
      _csrf:csrfToken,     
    }   
    if (oldPassword === newPassword) {
      setOldNewPasswordError("Old password and new password are the same.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMatchError(
        "New password and confirm new password do not match."
      );
      return;
    }
    if (      
      newPassword === confirmNewPassword
    ) {
      const result = await passwordchanges(payloaded);
      if(result === 500){
        setIsCancelPopupVisible(true);
      }else if(result === 200){
        setIsCancelPopupVisible(true);
      }
      
    } else {
      alert("Please correct the errors and ensure passwords match.");
    }
  };
  const handleSuccess = ()=>{    
    window.location.href = `/queries`;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 " style={{backgroundColor:tbodyfullcolor}}>
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md"style={{backgroundColor:tbodyfullcolor}}>
        <h2 className={`text-2xl font-bold text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>Change Password</h2>
        <div className="space-y-4" style={{backgroundColor:tbodyfullcolor}}>
          <div>
            <label
              htmlFor="old-password"
              className={`block text-sm font-medium text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
            >
              Old Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                id="old-password"
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                <FontAwesomeIcon
                  icon={showOldPassword ? faEyeSlash : faEye}
                  className="text-gray-500"
                />
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="new-password"
              className={`block text-sm font-medium text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <FontAwesomeIcon
                  icon={showNewPassword ? faEyeSlash : faEye}
                  className="text-gray-500"
                />
              </button>
            </div>
            <p className="text-[#cd9898] text-xs mt-2 font-medium">
              Please add all necessary characters to create a safe password.
            </p>
            <ul className="text-sm font-medium text-[#cd9898] mt-2">
              <li
                className={
                  validationErrors.length ? "text-[#cd9898]" : "text-[#b9cbba]"
                }
              >
                Minimum characters 10
              </li>
              <li
                className={
                  validationErrors.uppercase ? "text-[#cd9898]" : "text-[#b9cbba]"
                }
              >
                One uppercase character
              </li>
              <li
                className={
                  validationErrors.lowercase ? "text-[#cd9898]" : "text-[#b9cbba]"
                }
              >
                One lowercase character
              </li>
              <li
                className={
                  validationErrors.number ? "text-[#cd9898]" : "text-[#b9cbba]"
                }
              >
                One number
              </li>
              <li
                className={
                  validationErrors.special ? "text-[#cd9898]" : "text-[#b9cbba]"
                }
              >
                One special character(Allowed characters: !@#$%^&*)
              </li>
            </ul>
            {oldNewPasswordError && (
              <p className="text-[#cd9898] text-sm mt-2">{oldNewPasswordError}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirm-new-password"
              className={`block text-sm font-medium text-gray-600 ${isDarkMode ? 'text-white' : ''}`}
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                id="confirm-new-password"
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                disabled={!confirmPasswordEnabled} 
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
              >
                <FontAwesomeIcon
                  icon={showConfirmNewPassword ? faEyeSlash : faEye}
                  className="text-gray-500"
                />
              </button>
            </div>
            {passwordMatchError && (
              <p className="text-[#cd9898] text-sm mt-2">{passwordMatchError}</p>
            )}
          </div>
          <button
            className="w-full px-4 py-2 mt-6 font-bold text-gray-600 bg-[#CECECE] rounded-md hover:text-gray-600 focus:outline-none"
            onClick={handleSubmit}
            disabled={              
              oldPassword === newPassword
            }
          >
            Change Password
          </button>
          {isCancelPopupVisible && (
        <div className="flex items-center justify-center fixed inset-0  bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 h-44 relative" style={{ backgroundColor: theadcolor,width:"450px", maxWidth: "100%", boxSizing: 'border-box' }}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Success Message</h2>
              <h3 className={`font-roboto text-lg font-lite leading-6 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
              Password successfully updated
              </h3>
              <button
            onClick={handleSuccess}
            className="bg-transparent text-[#b9cbba] font-medium px-4 py-2 rounded absolute bottom-4 right-8">
            <Tooltip tooltipText="Ok">
              <FontAwesomeIcon icon={faCheck} className={`ml-2  ${isDarkMode ? 'text-white' : ''}`} />
            </Tooltip>
          </button>
            </div>
          </div>

      )}
        </div>
      </div>
    </div>
    
  );
}
