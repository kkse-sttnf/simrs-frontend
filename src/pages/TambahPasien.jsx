import React from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";
import FormTambahPasien from "../components/FormTambahPasien/FormTambahPasien";

const TambahPasien = () => {
    return (
      <div>
        <NavbarComponent />
        <Breadcrumbs />
        <FormTambahPasien />
        <FooterComponent />
      </div>
    );
  };
  
  export default TambahPasien;