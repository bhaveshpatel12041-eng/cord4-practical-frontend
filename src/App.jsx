import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Layout from './components/Layout';
import Login from './pages/Login';
import VendorList from './pages/VendorList';
import AddVendor from './pages/AddVendor';
import PayoutList from './pages/PayoutList';
import AddPayout from './pages/AddPayout';
import PayoutDetail from './pages/PayoutDetail';

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const PublicRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    if (user) {
        return <Navigate to="/payouts" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/payouts" replace />} />

                    <Route path="login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />

                    <Route path="vendors" element={
                        <ProtectedRoute>
                            <VendorList />
                        </ProtectedRoute>
                    } />

                    <Route path="vendors/new" element={
                        <ProtectedRoute>
                            <AddVendor />
                        </ProtectedRoute>
                    } />

                    <Route path="payouts" element={
                        <ProtectedRoute>
                            <PayoutList />
                        </ProtectedRoute>
                    } />

                    <Route path="payouts/new" element={
                        <ProtectedRoute>
                            <AddPayout />
                        </ProtectedRoute>
                    } />

                    <Route path="payouts/:id" element={
                        <ProtectedRoute>
                            <PayoutDetail />
                        </ProtectedRoute>
                    } />

                    {/* Add more routes here later */}
                    <Route path="*" element={<Navigate to="/payouts" replace />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
