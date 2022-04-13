import { Navigate } from "react-router-dom";

import Dashboard from "src/views/Dashboard";
import { GeneralSettings, LanguageSetting } from "src/views/Settings/index";

import OrderList from "src/views/OrderList";
import PendingDeliveryList from "src/views/OrderList/PendingDeliveryList";
import DeliveredList from "src/views/OrderList/DeliveredList";
import CollectedList from "src/views/OrderList/CollectedList";
import CanceledList from "src/views/OrderList/CanceledList";
import FollowUpOrderList from "src/views/FollowUpOrderList"

import AdminDashboardLayout from "src/components/admin-dashboard";

import AdminAccount from "src/views/AdminAccount";

import AdminList from "src/views/AdminList";
import AddAdmin from "src/views/AddAdmin";
import AdminDetails from 'src/views/AdminDetails';

import MerchantList from "src/views/MerchantList";
import AddMerchant from "src/views/AddMerchant";
import MerchantDetails from "src/views/MerchantDetails";

import CarOriginList from "src/views/CarOriginList";
import AddCarOrigin from "src/views/AddCarOrigin";
import CarOriginDetails from 'src/views/CarOriginDetails';

import CityList from "src/views/CityList";
import AddCity from "src/views/AddCity";
import CityDetails from 'src/views/CityDetails';

import SpecialtyList from "src/views/SpecialtyList";
import AddSpecialty from "src/views/AddSpecialty";
import SpecialtyDetails from 'src/views/SpecialtyDetails';

import CarBrandList from "src/views/CarBrandList";
import AddCarBrand from "src/views/AddCarBrand"
import CarBrandDetails from 'src/views/CarBrandDetails';

import CarModelList from "src/views/CarModelList";
import AddCarModel from "src/views/AddCarModel"
import CarModelDetails from "src/views/CarModelDetails"

import UserList from "src/views/UserList";

import MainLayout from "src/components/web";
import ErrorUnauthorized from "src/views/ErrorUnauthorized";
import ErrorNotFound from "src/views/ErrorNotFound";
import ErrorServerDown from "src/views/ErrorServerDown";
import TermsAndConditions from "src/views/TermsAndConditions";
import PrivacyPolicy from "src/views/PrivacyPolicy";

import AuthLayout from "src/components/auth";
import { Login } from "src/views/Auth";

import TestLayout from "src/checkout/TestLayout";

import TestPage from 'src/checkout/TestPage';

import LandingLayout from "src/views/Landing/layouts/LandingLayout";
import Landing from "src/views/Landing/views/Landing";
import ContactUs from 'src/views/Landing/views/ContactUs';


const routes = (currentUser) => ([
  {
    path: "admin",
    element:  <AdminDashboardLayout /> ,
    children: [
      { path: "statistics", element: <Dashboard /> },
      {
        path: "orders",
        children: [
          { path: "/follow-up", element: <FollowUpOrderList /> },
          { path: "/pending-delivery", element: <PendingDeliveryList /> },
          { path: "/delivered", element: <DeliveredList /> },
          { path: "/collected", element: <CollectedList /> },
          { path: "/canceled", element: <CanceledList /> },
          { path: "/new", element: <OrderList /> },
        ]
      },
      {
        path: "users",
        children: [
          { path: "/", element: <UserList /> }
        ]
      },
      {
        path: "merchants",
        children: [
          { path: "/", element: <MerchantList /> },
          { path: "add", element: <AddMerchant /> },
          { path: "/:id", element: <MerchantDetails /> }
        ]
      },
      {
        path: "car-origins",
        children: [
          { path: "/", element: <CarOriginList /> },
          { path: "add", element: <AddCarOrigin /> },
          { path: "/:id", element: <CarOriginDetails /> },
        ]
      },
      {
        path: "cities",
        children: [
          { path: "/", element: <CityList /> },
          { path: "add", element: <AddCity /> },
          { path: "/:id", element: <CityDetails /> },
        ]
      },
      {
        path: "specialties",
        children: [
          { path: "/", element: <SpecialtyList /> },
          { path: "add", element: <AddSpecialty /> },
          { path: "/:id", element: <SpecialtyDetails /> },
        ]
      },
      {
        path: "car-brands",
        children: [
          { path: "/", element: <CarBrandList /> },
          { path: "add", element: <AddCarBrand /> },
          { path: "/:id", element: <CarBrandDetails /> },
        ]
      },
      {
        path: "car-models",
        children: [
          { path: "/", element: <CarModelList /> },
          { path: "add", element: <AddCarModel /> },
          { path: "/:id", element: <CarModelDetails /> },
        ]
      },
      {
        path: "admins",
        children: [
          { path: "add", element: <AddAdmin /> },
          { path: "/", element: <AdminList /> },
          { path: "/:id", element: <AdminDetails /> },
          { path: "*", element: <Navigate to="/errors/404" /> },
        ]
      },
      { path: "account", element: <AdminAccount /> },
      {
        path: "settings",
        children: [
          { path: "/", element: <GeneralSettings /> },
          { path: "language", element: <LanguageSetting /> },
          { path: "*", element: <Navigate to="/errors/404" /> },
        ]
      },
      { path: "/", element: <Navigate to="admins" /> },
      { path: "*", element: <Navigate to="/errors/404" /> },
    ],
  },
  {
    path: "auth",
    element: currentUser && currentUser.role ? <Navigate to={`/${currentUser.role}`} /> : <AuthLayout />,
    children: [
      { path: "admin", element: <Login role={'admin'} /> },
      { path: "/", element: <Navigate to="merchant" /> },
      { path: "*", element: <Navigate to="/errors/404" /> },
    ],
  },
  {
    path: "errors",
    element: <MainLayout />,
    children: [
      { path: "404", element: <ErrorNotFound /> },
      { path: "401", element: <ErrorUnauthorized /> },
      { path: "500", element: <ErrorServerDown /> },
      { path: "/", element: <Navigate to="404" /> },
      { path: "*", element: <Navigate to="404" /> },
    ],
  },
  {
    path: "test",
    element: <TestLayout />,
    children: [
      { path: "/", element: <TestPage /> },
      { path: "*", element: <Navigate to="/errors/404" /> },
    ],
  },

  {
    path: "privacy-policy",
    element: <MainLayout navbarVisible />,
    children: [
      { path: "/", element: <PrivacyPolicy /> },
      { path: "*", element: <Navigate to="errors/404" /> },
    ],
  },
  {
    path: "terms-and-conditions",
    element: <MainLayout navbarVisible />,
    children: [
      { path: "/", element: <TermsAndConditions /> },
      { path: "*", element: <Navigate to="errors/404" /> },
    ],
  },
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      { path: "contact-us", element: <ContactUs /> },
      { path: "/", element: <Landing /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
  { path: "*", element: <Navigate to="errors/404" /> },
]);

export default routes;
