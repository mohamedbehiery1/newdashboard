import React, { useState, useEffect } from 'react';
// import sections
import ContactForm from '../components/forms/ContactForm';
import HttpService from 'src/__services__/httpService';
import AuthService from "src/__services__/AuthService";
import { Box, Container } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
// Styles
import '../assets/scss/style.scss';
import { useNavigate } from 'react-router-dom';

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const ContactUs = ({ ...props }) => {

    const navigate = useNavigate();

    const [pendingSubmit, setPendingSubmit] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState();
    const location = useLocation();

    const sendMessage = async (formData) => {
        setPendingSubmit(true);
        setError("");
        setSuccess(null);
        const Authorization = "Bearer " + AuthService.getJwt();
        try {
            await HttpService.post(
                `${apiUrl}/v1/website/contact-us`,
                formData,
                { headers: { Authorization } }
            )
            setSuccess("Message sent")
            setTimeout(_ => navigate("/", { replace: true }), 500)
        } catch (e) {
            console.log(e)
            if (e.response && e.response.data) {
                console.log(e.response)
                setError(e.response.data.message)
            }
        } finally {
            setPendingSubmit(false);
        }
    }

    return (
        <section
            {...props}
            className="hero section center-content"
        >
            <Box
                sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 3,
                }}
            >
                <Container maxWidth="sm">
                    <ContactForm
                        handleSubmit={sendMessage}
                        pendingSubmit={pendingSubmit}
                        error={error}
                        success={success}
                        state={location.state}
                    />
                </Container>
            </Box>
        </section>
    );
}

export default ContactUs;