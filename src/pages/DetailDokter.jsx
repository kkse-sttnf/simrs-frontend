import React from "react";
import { useLocation, useParams } from "react-router-dom";
import FooterComponent from "../components/Footer/FooterComponent";
import Breadcrumbs from "../components/Breadcumbs/Breadcumbs";
import DetailDokterPage from "../components/DetailDokter/DetailDokter";
import NavbarComponent from "../components/Navbar/NavbarComponent";

const DetailDokter = () => {
  const { id } = useParams();
  const location = useLocation();
  const dokter = location.state?.dokter;

  return (
    <div>
      <NavbarComponent />
      <Breadcrumbs currentPage={`Detail Dokter - ${dokter?.namaDokter || id}`} />
      <DetailDokterPage dokter={dokter} id={id} />
      <FooterComponent />
    </div>
  );
};

export default DetailDokter;