import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../store/slices/authSlice';

const Layout = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const initials = user ? user.email.slice(0, 2).toUpperCase() : '??';

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-mark">💸</div>
                    <span className="logo-text">PayoutManager</span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/payouts"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">📋</span> Payouts
                    </NavLink>
                    <NavLink
                        to="/vendors"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">🏪</span> Vendors
                    </NavLink>
                </nav>

                {user && (
                    <div className="sidebar-footer">
                        <div className="user-badge">
                            <div className="user-avatar">{initials}</div>
                            <div style={{ minWidth: 0 }}>
                                <div className="user-email" title={user.email}>{user.email}</div>
                                <div className="user-role">{user.role}</div>
                            </div>
                        </div>
                        <button className="btn-logout" onClick={handleLogout}>
                            🚪 Logout
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="page-container" style={{ maxWidth: '1080px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
