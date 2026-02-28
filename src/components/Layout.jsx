import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
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

    return (
        <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Payout Manager</h1>
                {user ? (
                    <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link to="/vendors" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Vendors</Link>
                        <Link to="/payouts" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Payouts</Link>
                        <div style={{ padding: '0 1rem', borderLeft: '1px solid #d1d5db' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280', marginRight: '0.5rem' }}>{user.email} ({user.role})</span>
                            <button
                                onClick={handleLogout}
                                style={{ padding: '0.5rem 1rem', border: 'none', backgroundColor: '#ef4444', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Logout
                            </button>
                        </div>
                    </nav>
                ) : (
                    <nav>
                        <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
                    </nav>
                )}
            </header>
            <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
