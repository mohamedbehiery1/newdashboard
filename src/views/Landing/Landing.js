import React, { useRef, useEffect } from 'react';
import LandingLayout from './layouts/LandingLayout';
import ScrollReveal from './utils/ScrollReveal';

// Views
import Landing from './views/Landing';

const LandingPage = () => {

    const childRef = useRef();

    useEffect(() => {
        document.body.classList.add('is-loaded')
        childRef.current.init();
    }, []);

    return (
        <ScrollReveal
            ref={childRef}
            children={_ => <Landing />}
        />
    );
}

export default LandingPage;