import React, { useState } from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";
import DetailDokter from "../components/DetailDokter/DetailDokter";
import SearchbarDokter from "../components/SearchbarDokter/Searchbardokter";

const DataDokter = () => {
  const [selectedDokter, setSelectedDokter] = useState(null);

  return (
    <div>
      <NavbarComponent />
      <Breadcrumbs />
      <SearchbarDokter onSelectDokter={setSelectedDokter} />
      <DetailDokter selectedDokter={selectedDokter} />
      <FooterComponent />
    </div>
  );
};

export default DataDokter;