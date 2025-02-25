import React from "react";
import { Breadcrumb, Container } from "react-bootstrap";

const Breadcrumbs = ({ paths }) => {
  return (
    <Container className="px-4">
      <Breadcrumb className="custom-breadcrumb">
        {paths.map((item, index) => (
          <Breadcrumb.Item
            key={index}
            href={item.link || "#"}
            active={index === paths.length - 1}
          >
            {item.label}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </Container>
  );
};

export default Breadcrumbs;
