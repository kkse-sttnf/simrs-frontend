import React, { useState } from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import SearchBar from "../components/Searchbar/Searchbar";
import DetailDataPasien from "../components/DetailPasien/DetailPasien";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";

const DetailPasien = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);


  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div>
      <NavbarComponent />
      <Breadcrumbs />
      <SearchBar onSelectPatient={handleSelectPatient} />
      <DetailDataPasien selectedPatient={selectedPatient} />
      <FooterComponent />
    </div>
  );
};

export default DetailPasien;