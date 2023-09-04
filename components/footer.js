import Link from "next/link";
import { Button, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function Footer() {

  return (
    <footer>
      <div className="d-flex flex-column justify-content-center align-items-center mt-5">
        <Row className="w-100">
          <div className="w-100 d-flex flex-column align-items-center justify-content-center pb-3">
            <hr className="w-100" />
            <p className="main-text-regular text-center">
              This website was created by Kunal Pai, Parth Shah and Harshil Patel.
            </p>
          </div>
        </Row>
      </div>
    </footer>
  );
}
