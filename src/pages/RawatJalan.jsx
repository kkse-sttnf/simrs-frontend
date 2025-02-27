import React from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import SearchBar from "../components/Searchbar/Searchbar";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";
import FormRawatJalan from "../components/FormRawatJalan/FormRawatJalan";

const RawatJalan = () => {
    return (
      <div>
        <NavbarComponent />
        <Breadcrumbs />
        <SearchBar />
        <FormRawatJalan />
        <FooterComponent />
      </div>
    );
  };
  
  export default RawatJalan;