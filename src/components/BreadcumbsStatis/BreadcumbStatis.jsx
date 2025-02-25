import React from "react";
import { Breadcrumb, Container } from "react-bootstrap";

const BreadcrumbStastis = () => {
  return (
    <Container className="px-4 mt-4">
      <Breadcrumb className="custom-breadcrumb">
        <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item href="/pasien">Data Pasien</Breadcrumb.Item>
        <Breadcrumb.Item active>Detail Pasien</Breadcrumb.Item>
      </Breadcrumb>
    </Container>
  );
};

export default BreadcrumbStastis;
