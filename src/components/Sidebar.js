import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // ✅ Remove token
        navigate('/login');               // ✅ Redirect to login
    };

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
                    <NavLink to="/dashboard/pending-admins" className="nav-link text-dark">
                        +        👤 المسؤولون المعلقون
                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="/dashboard/active-orders" className="nav-link text-dark">
                        🚚 الطلبات النشطة
                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="/dashboard/register-driver" className="nav-link text-dark">
                        🚗 تسجيل سائق
                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="/dashboard/drivers-list" className="nav-link text-dark">
                        📝 قائمة السائقين
                    </NavLink>
                </li>
                <li className="nav-item mt-3">
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                        تسجيل الخروج
                    </button>

                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
