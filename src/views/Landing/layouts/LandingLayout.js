import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';

const LandingLayout = () => (
  // <>
  //   <Header navPosition="right" className="reveal-from-bottom" />
  //   <main className="site-content">
  //     <Outlet />
  //   </main>
  // </>
  <h1>
    Hello AutoService User
  </h1>
);

export default LandingLayout;