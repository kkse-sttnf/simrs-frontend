import React from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import SearchBar from "../components/Searchbar/Searchbar";
import DetailDataPasien from "../components/DetailPasien/DetailPasien";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";

const RawatJalan = () => {
    return (
      <div>
        <NavbarComponent />
        <Breadcrumbs />
        <SearchBar />
        <h1>Halaman Rawat Jalan</h1>
        <FooterComponent />
      </div>
    );
  };
  
  export default RawatJalan;