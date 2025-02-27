import React from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import SearchBar from "../components/Searchbar/Searchbar";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";


const DataDokter = () => {
    return (
      <div>
        <NavbarComponent />
        <Breadcrumbs />
        <SearchBar />
        <FooterComponent />
      </div>
    );
  };
  
  export default DataDokter;