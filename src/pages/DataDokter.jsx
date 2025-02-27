import React from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import SearchBar from "../components/Searchbar/Searchbar";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";
import DetailDokter from "../components/DetailDokter/DetailDokter";


const DataDokter = () => {
    return (
      <div>
        <NavbarComponent />
        <Breadcrumbs />
        <SearchBar />
        <DetailDokter />
        <FooterComponent />
      </div>
    );
  };
  
  export default DataDokter;