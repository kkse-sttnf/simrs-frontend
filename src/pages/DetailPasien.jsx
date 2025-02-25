import React from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import SearchBar from "../components/Searchbar/Searchbar";
import BreadcrumbStastis from "../components/BreadcumbsStatis/BreadcumbStatis";
import DetailDataPasien from "../components/DetailPasien/DetailPasien";

const DetailPasien = () => {
    return (
      <div>
        <NavbarComponent />
        <BreadcrumbStastis />
        <SearchBar />
        <DetailDataPasien />
        <FooterComponent />
      </div>
    );
  };
  
  export default DetailPasien;