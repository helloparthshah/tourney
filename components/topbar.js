'use client'

import { Container, Navbar, Nav, Offcanvas, ButtonGroup, ToggleButton, NavDropdown, Button } from "react-bootstrap";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image";

export default function Topbar() {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const pageYOffsetTrigger = 150;
  const [isLightMode, setIsLightMode] = useState(false);
  const [theme, setTheme] = useState('auto');
  const { data: session } = useSession()

  function toggleMode(isDarkMode) {
    if (isDarkMode) {
      setIsLightMode(false);
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
    else {
      setIsLightMode(true);
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }
  useEffect(() => {
    // check local storage for preference
    const theme = localStorage.getItem('theme');
    if (theme) {
      setTheme(theme);
    } else {
      setTheme('auto');
      localStorage.setItem('theme', 'auto');
    }
    if (theme === 'dark') {
      toggleMode(true);
    }
    else if (theme === 'light') {
      toggleMode(false);
    }
    else {
      toggleMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        toggleMode(e.matches);
      });

      return () => {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', (e) => {
          toggleMode(e.matches);
        });
      }
    }
  }, []);

  useEffect(() => {
    function toggleVisibility() {
      window.pageYOffset > pageYOffsetTrigger ? setVisible(true) : setVisible(false)
    }

    window.addEventListener("scroll", toggleVisibility);
    return () => { window.removeEventListener("scroll", toggleVisibility) }
  }, []);

  function getClassName(visible) {
    if (isLightMode) {
      if (visible) {
        return "topbar shadow-sm bg-dark";
      } else {
        return "topbar bg-white";
      }
    } else {
      if (visible) {
        return "topbar shadow-sm bg-dark-grey";
      } else {
        return "topbar bg-dark";
      }
    }
  }

  function getVariant(visible) {
    if (isLightMode) {
      if (visible) {
        return "dark";
      } else {
        return "light";
      }
    } else {
      if (visible) {
        return "dark";
      } else {
        return "dark";
      }
    }
  }

  const modes = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
    { name: 'Auto', value: 'auto' },
  ];

  return (
    <>
      <Navbar
        className={getClassName(visible)}
        variant={getVariant(visible)}
        expand="lg"
        sticky="top"
        style={{
          transition: "all 0.5s ease",
        }}
      >
        <Container fluid>
          <Navbar.Brand href="/" as={Link}>
            <h1>
              #tourney
            </h1>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand-sm`}
            onClick={() => setShow(true)}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-sm`}
            aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
            show={show}
            onHide={() => setShow(false)}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                TEST
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="/" as={Link} className="main-text-regular" onClick={() => setShow(false)}>
                  Home
                </Nav.Link>
                <Nav.Link href="/tourney" as={Link} className="main-text-regular" onClick={() => setShow(false)}>
                  Tourney
                </Nav.Link>
              </Nav>
              <ButtonGroup>
                {
                  modes.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant={isLightMode ?
                        (visible ? "outline-light" : "outline-dark") :
                        (visible ? "outline-light" : "outline-light")
                      }
                      name="radio"
                      value={radio.value}
                      checked={theme === radio.value}
                      onChange={(e) => {
                        localStorage.setItem('theme', e.currentTarget.value);
                        setTheme(e.currentTarget.value);
                        if (e.currentTarget.value === 'auto') {
                          toggleMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
                          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                            toggleMode(e.matches);
                          });
                          return () => {
                            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', (e) => {
                              toggleMode(e.matches);
                            });
                          }
                        } else {
                          toggleMode(e.currentTarget.value === 'dark');
                        }
                      }}
                      className="d-flex justify-content-center align-items-center"
                    >
                      {radio.name}
                    </ToggleButton>
                  ))
                }
              </ButtonGroup>
              <Nav className="d-flex justify-content-center align-items-center ps-3 pe-3">
                {session ? (
                  <NavDropdown
                    id="nav-dropdown-dark-example"
                    title={
                      <Image src={session.user.image} width="30" height="30" style={{ borderRadius: "50%" }} />
                    }
                    expand="sm"
                    align="end"
                  >
                    <NavDropdown.Item href="/api/auth/signout" onClick={() => signOut()}>Sign Out</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => signIn()}>Sign In</Button>
                )}
              </Nav>

            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar >
    </>
  )
}