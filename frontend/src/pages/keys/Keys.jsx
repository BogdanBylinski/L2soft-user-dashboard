import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddNewEmail from "../../components/addNewEmail/AddNewEmail";
import ChangePassword from "../../components/changePassoword/ChangePassword";
import useRedirectNotVerified from "../../components/customHook/useRedirectNotVerified";
import NavBar from "../../components/navBar/NavBar";
import { getKeys } from "../../redux/features/auth/authSlice";
import "./Keys.scss";
import ReactPaginate from "react-paginate";
import useRedirecLoggedOutUser from "../../components/customHook/useRedirecLoggedOutUser";
import useIsMobile from "../../components/customHook/useIsMobile";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import {
  FILTER_KEYS,
  selectKeys,
  SORT_KEY_BY_DATE,
  SORT_KEY_BY_EMAIL,
} from "../../redux/features/auth/filterSlice";

// Demo styles, see 'Styles' section below for some notes on use.
// import "react-accessible-accordion/dist/fancy-example.css";
const Keys = () => {
  useRedirecLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sortingByDate, sortingByEmail } = useSelector(
    (state) => state.filter
  );
  const [currentPage, setCurrentPage] = useState(0);
  const filteredKeys = useSelector(selectKeys);
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  useEffect(() => {
    if (user && user.keyArr) {
      dispatch(FILTER_KEYS({ keys: user.keyArr, search }));
    }
  }, [dispatch, user, search]);
  useEffect(() => {
    if (filteredKeys.length <= 10) {
      setCurrentPage(0);
    }
  }, [filteredKeys]);
  useRedirectNotVerified("/login");
  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };
  const dateConvertation = (date) => {
    const unixTimestamp = (date - 25569) * 86400;
    const convertedDate = new Date(unixTimestamp * 1000);

    let year = convertedDate.getFullYear();
    let month = convertedDate.getMonth() + 1; // Add 1 to convert from 0-based index to 1-based index
    let day = convertedDate.getDate();

    // Pad the month and day with leading zeros if necessary
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    const dateString = year + "-" + month + "-" + day; // Format the date string as "YYYY-MM-DD"
    return dateString;
  };
  const sortByDate = () => {
    let direction = sortingByDate === "asc" ? "desc" : "asc";
    dispatch(SORT_KEY_BY_DATE(direction));
  };
  const sortByEmail = () => {
    let direction = sortingByEmail === "asc" ? "desc" : "asc";
    dispatch(SORT_KEY_BY_EMAIL(direction));
  };

  return (
    <div className="keysContainer">
      <div className="keysList">
        <div className="keysList__title">
          <label htmlFor="search">
            <input
              type="text"
              placeholder="Search..."
              required
              name="search"
              value={search}
              onChange={(e) => handleInputChange(e)}
            />
          </label>
          <div className="keysList__title-right">
            <p onClick={sortByEmail}>Email</p>
            <p onClick={sortByDate}>Purchase Date</p>
          </div>
        </div>
        <div className="keysList__list">
          {user && !isMobile && filteredKeys ? (
            <>
              <ul>
                {filteredKeys

                  .slice(currentPage * 10, currentPage * 10 + 10)
                  .map((item, index) => (
                    <li className="key" key={index}>
                      <p className="key__product">{item.good}</p>
                      <p className="key__email">{item.email}</p>
                      <p className="key__date">
                        {dateConvertation(item.saleDate)}
                      </p>
                    </li>
                  ))}
              </ul>
              <ReactPaginate
                pageCount={Math.ceil(filteredKeys?.length / 10)}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                nextLabel=">"
                previousLabel="<"
                breakLabel="..."
                renderOnZeroPageCount={null}
              />
            </>
          ) : (
            <>
              <Accordion allowZeroExpanded>
                <ul>
                  {user &&
                    filteredKeys
                      .slice(currentPage * 10, currentPage * 10 + 10)
                      .map((item, index) => (
                        <li className="key" key={index}>
                          <AccordionItem key={item._id}>
                            <AccordionItemHeading>
                              <AccordionItemButton>
                                {item.good}
                              </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                              {item.productName}
                            </AccordionItemPanel>
                          </AccordionItem>
                        </li>
                      ))}
                </ul>
                <ReactPaginate
                  pageCount={Math.ceil(filteredKeys.length / 10)}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                  nextLabel={user ? ">" : ""}
                  previousLabel="<"
                  breakLabel="..."
                  renderOnZeroPageCount={null}
                />
              </Accordion>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Keys;
