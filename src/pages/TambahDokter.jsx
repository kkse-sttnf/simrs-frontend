import React from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";
import FormTambahDokter from "../components/FormTambahDokter/FormTambahDokter";


const TambahDokter = () => {
    return (
      <div>
        <NavbarComponent />
        <Breadcrumbs />
        <FormTambahDokter/>
        <FooterComponent />
      </div>
    );
  };
  
  export default TambahDokter;