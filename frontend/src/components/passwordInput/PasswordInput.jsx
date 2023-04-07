import React, { useState } from "react";
import "./PasswordInput.scss";
// import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { ReactComponent as Visible } from "../../assets/invisible.svg";
import { ReactComponent as Invisible } from "../../assets/visible.svg";
function PasswordInput({ placeholder, value, onChange, name, onPaste }) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="password">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        required
        name={name}
        value={value}
        onChange={onChange}
        onPaste={onPaste}
      />
      <label htmlFor={name}>{placeholder}</label>
      <div className="icon" onClick={togglePassword}>
        {showPassword ? <Invisible size={20} /> : <Visible size={20} />}
      </div>
    </div>
  );
}

export default PasswordInput;
