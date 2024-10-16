import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Modal } from 'react-bootstrap';
import { FaGoogle, FaEye, FaEyeSlash, FaMusic } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showResetModal, setShowResetModal] = useState(false); // Estado para el modal de restablecer contraseña
    const [resetEmail, setResetEmail] = useState(''); // Estado para el correo de restablecimiento de contraseña
    const [resetError, setResetError] = useState(null);
    const [resetSuccess, setResetSuccess] = useState(null);

    const navigate = useNavigate();

    const googleProvider = new GoogleAuthProvider();

    const handleLogin = (e) => {
        e.preventDefault();
        setError(null);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Usuario logueado:', user);
                window.location.href = "/home";
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const handleGoogleLogin = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const user = result.user;
                console.log('Usuario logueado con Google:', user);
                window.location.href = "/home";
            })
            .catch((error) => {
                console.error('Error al iniciar sesión con Google:', error);
                setError(error.message);
            });
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        setResetError(null);
        setResetSuccess(null);

        sendPasswordResetEmail(auth, resetEmail)
            .then(() => {
                setResetSuccess('Correo de restablecimiento enviado. Por favor, revisa tu bandeja de entrada.');
            })
            .catch((error) => {
                setResetError('No se pudo enviar el correo de restablecimiento. Verifica el correo electrónico ingresado.');
            });
    };

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
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="tu@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                            {error && <p className="text-danger">{error}</p>}

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Iniciar sesión
                            </Button>

                            <div className="text-center mb-3">
                                <span className="text-muted">O continúa con</span>
                            </div>

                            <Button variant="outline-light" className="w-100 mb-3" onClick={handleGoogleLogin}>
                                <FaGoogle className="me-2" />
                                Iniciar sesión con Google
                            </Button>

                            <div className="text-center">
                                <a href="#" className="text-primary" onClick={() => setShowResetModal(true)}>¿Olvidaste tu contraseña?</a>
                            </div>
                        </Form>

                        <div className="text-center mt-4">
                            <span className="text-muted">¿No tienes cuenta?</span>
                            <Button variant="link" onClick={() => navigate("/register")} className="p-0 m-0">
                                Registrarse
                            </Button>
                        </div>
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

            {/* Modal de restablecimiento de contraseña */}
            <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Restablecer Contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleResetPassword}>
                        <Form.Group className="mb-3" controlId="formResetEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresa tu correo"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {resetError && <p className="text-danger">{resetError}</p>}
                        {resetSuccess && <p className="text-success">{resetSuccess}</p>}

                        <Button variant="primary" type="submit">
                            Enviar enlace de restablecimiento
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowResetModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
