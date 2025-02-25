import React from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import SearchBar from "../components/Searchbar/Searchbar";
import BreadcrumbStastis from "../components/BreadcumbsStatis/BreadcumbStatis";

const DataDokter = () => {
    return (
      <div>
        <NavbarComponent />
        <SearchBar />
        <BreadcrumbStastis />
        <FooterComponent />
      </div>
    );
  };
  
  export default DataDokter;