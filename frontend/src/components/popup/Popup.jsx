import React from "react";
import Popup from "reactjs-popup";
import "./Popup.scss";
import { ReactComponent as Trash } from "../../assets/trash.svg";
export default ({ handleDelete, item }) => (
  <Popup
    trigger={
      <button className="popup-delete-button">
        {" "}
        <Trash></Trash>{" "}
      </button>
    }
    modal
    nested
  >
    {(close) => (
      <div className="modal">
        <button className="close" onClick={close}>
          &times;
        </button>
        <div className="header"> {item} </div>
        <div className="content">Are u sure want delete this email?</div>
        <div className="actions">
          <button
            onClick={() => {
              handleDelete(item);
              close();
            }}
            className="button"
          >
            DELETE
          </button>
          <button
            className="button"
            onClick={() => {
              console.log("modal closed ");
              close();
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    )}
  </Popup>
);
