import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ResetPassWord from "./components/ResetPassWord";

import DashBoard from "./components/DashBoard";
import Lead from "./components/Lead";
import CollapsibleLead from "./components/CollapsibleLead";
import Sales from "./components/Sales";
import Setting from "./components/Setting";

import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Forgotpassword" element={<ResetPassWord />} />

        <Route
          path="/"
          element={
            <Layout>
              <DashBoard />
            </Layout>
          }
        />

        <Route
          path="/Lead"
          element={
            <Layout>
              <Lead />
            </Layout>
          }
        />

        <Route
          path="/CollapsibleLead"
          element={
            <Layout>
              <CollapsibleLead />
            </Layout>
          }
        />

        <Route
          path="/Sales"
          element={
            <Layout>
              <Sales />
            </Layout>
          }
        />

        <Route
          path="/Setting"
          element={
            <Layout>
              <Setting />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
