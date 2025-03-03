import React, { useState } from "react";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";
import FormRawatJalan from "../components/FormRawatJalan/FormRawatJalan";
import SearchRawatJalan from "../components/SearchbarRawatJalan/SearchRawatJalan";

const RawatJalan = () => {
  const [selectedPasien, setSelectedPasien] = useState(null);

  return (
    <div>
      <NavbarComponent />
      <Breadcrumbs />
      <SearchRawatJalan onSelectPasien={setSelectedPasien} />
      <FormRawatJalan selectedPasien={selectedPasien} />
      <FooterComponent />
    </div>
  );
};

export default RawatJalan;