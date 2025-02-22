// @ts-nocheck
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user') || "{}");
    console.log(user?.roles?.indexOf("ADMIN"));
    if (user?.roles?.indexOf("ADMIN") === -1) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default AdminRoute;
