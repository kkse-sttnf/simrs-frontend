import React from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Container className="px-4 mt-3">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <Breadcrumb.Item key={name} active>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item key={name}>
              <Link to={routeTo}>{name.charAt(0).toUpperCase() + name.slice(1)}</Link>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </Container>
  );
};

export default Breadcrumbs;
