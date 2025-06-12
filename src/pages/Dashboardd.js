import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Vendors from './Vendor1';
import Categories from './Categories';
import Users from './Users';
import VendorDetails from './VendorDetails';
import PendingAdmins from './PendingAdmins';
import ActiveOrders from './ActiveOrders';
import RegisterDriver from './RegisterDriver';
import DriversList from './DriversList';

function Dashboard() {
    return (
        <div className="d-flex" style={{ direction: 'rtl' }}>
            <Sidebar />
            <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>
                <Routes>
                    <Route path="vendors" element={<Vendors />} />
                    <Route path="vendors/:id" element={<VendorDetails />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="users" element={<Users />} />
                    <Route path="pending-admins" element={<PendingAdmins />} />
                    <Route path="active-orders" element={<ActiveOrders />} />
                    <Route path="register-driver" element={<RegisterDriver />} />
                    <Route path="drivers-list" element={<DriversList />} />
                </Routes>
            </div>
        </div>
    );
}

export default Dashboard;
