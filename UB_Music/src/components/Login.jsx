import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { FaGoogle, FaEye, FaEyeSlash, FaMusic } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Container fluid className="vh-100 p-0">
          <Row className="h-100 m-0">
            <Col md={6} className="d-flex align-items-center justify-content-center bg-dark text-white p-5">
              <div className="w-100" style={{ maxWidth: '400px' }}>
                <div className="text-center mb-4">
                  <FaMusic size={50} className="text-primary mb-3" />
                  <h1 className="h2 mb-3">Bienvenido a UB-Music</h1>
                  <p className="text-muted">Inicia sesión para acceder a tu música</p>
                </div>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                  type="email"
                  placeholder="tu@ejemplo.com"
                  required
                />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <InputGroup>
                    <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    required
                  />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
    
                  <Button variant="primary" type="submit" className="w-100 mb-3">
                    Iniciar sesión
                  </Button>
    
                  <div className="text-center mb-3">
                    <span className="text-muted">O continúa con</span>
                  </div>
    
                  <Button variant="outline-light" className="w-100 mb-3">
                    <FaGoogle className="me-2" />
                    Iniciar sesión con Google
                  </Button>
    
                  <div className="text-center">
                    <a href="#" className="text-primary">¿Olvidaste tu contraseña?</a>
                  </div>
                </Form>
              </div>
            </Col>
            <Col md={6} className="d-none d-md-block p-0">
              <div 
                className="h-100 w-100" 
                style={{
                  backgroundImage: `url('src/assets/images/login/login_ub.jpeg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            </Col>
          </Row>
        </Container>
      );
}