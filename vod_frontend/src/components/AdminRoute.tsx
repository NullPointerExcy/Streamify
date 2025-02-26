// @ts-nocheck
import React from "react";
import { Navigate } from "react-router-dom";
import {IUser} from "../models/IUser";
import {getUserById} from "../services/users/UserServices";

const AdminRoute = ({ user, children }) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.roles && !(user.roles.includes("MODERATOR") || user.roles.includes("ADMIN"))) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
