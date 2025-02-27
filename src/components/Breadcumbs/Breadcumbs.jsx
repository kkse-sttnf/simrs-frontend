import React from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Breadcrumbs = () => {
  return (
    <Container className="px-4 mt-3">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Detail Pasien</Breadcrumb.Item>
      </Breadcrumb>
    </Container>
  );
};

export default Breadcrumbs;