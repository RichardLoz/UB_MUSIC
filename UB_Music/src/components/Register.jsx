import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaMusic } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Importar tu configuración de Firebase
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Importar Firestore
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    
    const navigate = useNavigate(); // Hook para navegar entre rutas
    const db = getFirestore(); // Inicializar Firestore

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Validar que las contraseñas coinciden
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            // Crear usuario con Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar el usuario en Firestore
            await setDoc(doc(db, "usuarios", user.uid), {
                email: user.email,
                id: user.uid
            });

            setSuccessMessage(`¡Registro exitoso! Bienvenido ${user.email}`);
            console.log('Usuario registrado:', user);

            // Redirigir a Home.jsx después del registro exitoso
            navigate('/home'); 
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container fluid className="vh-100 p-0">
            <Row className="h-100 m-0">
                <Col md={6} className="d-flex align-items-center justify-content-center bg-dark text-white p-5">
                    <div className="w-100" style={{ maxWidth: '400px' }}>
                        <div className="text-center mb-4">
                            <FaMusic size={50} className="text-primary mb-3" />
                            <h1 className="h2 mb-3">Regístrate en UB-Music</h1>
                            <p className="text-muted">Crea una cuenta para acceder a la plataforma</p>
                        </div>
                        <Form onSubmit={handleRegister}>
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
                                <Form.Control
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formConfirmPassword">
                                <Form.Label>Confirmar contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirmar contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            {error && <p className="text-danger">{error}</p>}
                            {successMessage && <p className="text-success">{successMessage}</p>}

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Registrarse
                            </Button>

                            <div className="text-center">
                                <a href="/login" className="text-primary">¿Ya tienes cuenta? Inicia sesión aquí</a>
                            </div>
                        </Form>
                    </div>
                </Col>
                <Col md={6} className="d-none d-md-block p-0">
                    <div
                        className="h-100 w-100"
                        style={{
                            backgroundImage: `url('src/assets/images/register/register_ub.jpeg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                </Col>
            </Row>
        </Container>
    );
}
