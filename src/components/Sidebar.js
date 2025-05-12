import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
    return (

        <div className="bg-white border-end p-3" style={{ minHeight: '100vh', width: '240px' }}>

            <h5 className="text-center text-primary mb-4">لوحة التحكم</h5>
            <ul className="nav flex-column">
                <li className="nav-item mb-2">
                    <NavLink to="/dashboard/vendors" className="nav-link text-dark">
                        🏬 البائعين
                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="/dashboard/categories" className="nav-link text-dark">
                        📂 الفئات
                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="/dashboard/users" className="nav-link text-dark">
                        👥 المستخدمين
                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    +      <NavLink to="/dashboard/pending-admins" className="nav-link text-dark">
                        +        👤 المسؤولون المعلقون
                        +      </NavLink>
                    +    </li>
                <li className="nav-item mt-3">
                    <button className="btn btn-outline-danger w-100" onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}>
                        🚪 تسجيل الخروج
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
