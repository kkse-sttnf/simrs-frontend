import React from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import FormDataPasien from "../components/FormTambahPasien/FormTambahPasien";
import SearchBar from "../components/Searchbar/Searchbar";
import { Breadcrumb } from "react-bootstrap";
import BreadcrumbStastis from "../components/BreadcumbsStatis/BreadcumbStatis";

const TambahPasien = () => {
    return (
      <div>
        <NavbarComponent />
        <BreadcrumbStastis />
        <SearchBar />
        <FormDataPasien />
        <FooterComponent />
      </div>
    );
  };
  
  export default TambahPasien;