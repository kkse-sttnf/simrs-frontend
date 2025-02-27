import React from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import FormDataPasien from "../components/FormTambahPasien/FormTambahPasien";
import SearchBar from "../components/Searchbar/Searchbar";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";

const TambahPasien = () => {
    return (
      <div>
        <NavbarComponent />
        <Breadcrumbs />
        <SearchBar />
        <FormDataPasien />
        <FooterComponent />
      </div>
    );
  };
  
  export default TambahPasien;