import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPayouts, resetPayoutState } from '../store/slices/payoutSlice';
import { getVendors } from '../store/slices/vendorSlice';
import toast from 'react-hot-toast';

const PayoutList = () => {
    const dispatch = useDispatch();

    const { payouts, isLoading, isError, message } = useSelector((state) => state.payout);
    const { vendors } = useSelector((state) => state.vendor);
    const { user } = useSelector((state) => state.auth);

    const [filterStatus, setFilterStatus] = useState('');
    const [filterVendor, setFilterVendor] = useState('');

    useEffect(() => {
        dispatch(getVendors());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        const filters = {};
        if (filterStatus) filters.status = filterStatus;
        if (filterVendor) filters.vendor_id = filterVendor;

        dispatch(getPayouts(filters));

        return () => {
            dispatch(resetPayoutState());
        };
    }, [filterStatus, filterVendor, isError, message, dispatch]);

    const handleFilterChange = (e) => {
        e.preventDefault();
        // filters are auto-applied via useEffect when state changes
    };

    const clearFilters = () => {
        setFilterStatus('');
        setFilterVendor('');
    };

    if (isLoading && payouts.length === 0) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading payouts...</div>;
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Draft': return { bg: '#f3f4f6', text: '#374151' };
            case 'Submitted': return { bg: '#dbeafe', text: '#1e3a8a' };
            case 'Approved': return { bg: '#d1fae5', text: '#065f46' };
            case 'Rejected': return { bg: '#fee2e2', text: '#991b1b' };
            default: return { bg: '#f3f4f6', text: '#374151' };
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Payout Requests</h2>
                {user && user.role === 'OPS' && (
                    <Link
                        to="/payouts/new"
                        style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', textDecoration: 'none', borderRadius: '4px', fontWeight: '500' }}>
                        Create Payout
                    </Link>
                )}
            </div>

            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Filter by Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                        <option value="">All Statuses</option>
                        <option value="Draft">Draft</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Filter by Vendor</label>
                    <select
                        value={filterVendor}
                        onChange={(e) => setFilterVendor(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                        <option value="">All Vendors</option>
                        {vendors.map(v => (
                            <option key={v._id} value={v._id}>{v.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={clearFilters}
                    style={{ padding: '0.6rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                    Clear
                </button>
            </div>

            <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#4b5563' }}>Date</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#4b5563' }}>Vendor</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#4b5563' }}>Amount (₹)</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#4b5563' }}>Mode</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#4b5563' }}>Status</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#4b5563' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payouts.map((payout) => {
                            const statusColors = getStatusColor(payout.status);
                            return (
                                <tr key={payout._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>
                                        {new Date(payout.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', color: '#111827', fontWeight: '500' }}>
                                        {payout.vendor_id?.name || 'Unknown Vendor'}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', color: '#111827' }}>
                                        {payout.amount.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>
                                        {payout.mode}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            backgroundColor: statusColors.bg,
                                            color: statusColors.text
                                        }}>
                                            {payout.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <Link
                                            to={`/payouts/${payout._id}`}
                                            style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500', fontSize: '0.875rem' }}>
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                        {payouts.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>No payouts found matching criteria.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayoutList;
