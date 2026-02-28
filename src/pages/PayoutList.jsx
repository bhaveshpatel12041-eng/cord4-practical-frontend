import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPayouts, resetPayoutState } from '../store/slices/payoutSlice';
import { getVendors } from '../store/slices/vendorSlice';
import toast from 'react-hot-toast';

const statusBadgeClass = (s) => ({ Draft: 'badge-draft', Submitted: 'badge-submitted', Approved: 'badge-approved', Rejected: 'badge-rejected' }[s] || 'badge-draft');

const PayoutList = () => {
    const dispatch = useDispatch();
    const { payouts, isLoading, isError, message } = useSelector((state) => state.payout);
    const { vendors } = useSelector((state) => state.vendor);
    const { user } = useSelector((state) => state.auth);

    const [filterStatus, setFilterStatus] = useState('');
    const [filterVendor, setFilterVendor] = useState('');

    useEffect(() => { dispatch(getVendors()); }, [dispatch]);

    useEffect(() => {
        if (isError) toast.error(message);
        const filters = {};
        if (filterStatus) filters.status = filterStatus;
        if (filterVendor) filters.vendor_id = filterVendor;
        dispatch(getPayouts(filters));
        return () => { dispatch(resetPayoutState()); };
    }, [filterStatus, filterVendor, isError, message, dispatch]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Payout Requests</h1>
                    <p className="page-subtitle">{payouts.length} payout{payouts.length !== 1 ? 's' : ''} found</p>
                </div>
                {user?.role === 'OPS' && (
                    <Link to="/payouts/new" className="btn btn-primary">+ Create Payout</Link>
                )}
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-control" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option>Draft</option>
                        <option>Submitted</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Vendor</label>
                    <select className="form-control" value={filterVendor} onChange={(e) => setFilterVendor(e.target.value)}>
                        <option value="">All Vendors</option>
                        {vendors.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                    </select>
                </div>
                <button className="btn btn-ghost" onClick={() => { setFilterStatus(''); setFilterVendor(''); }}>
                    Clear
                </button>
            </div>

            {/* Table */}
            {isLoading && payouts.length === 0 ? (
                <div className="loading-state"><div className="spinner" /> Loading payouts…</div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Vendor</th>
                                <th>Amount</th>
                                <th>Mode</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {payouts.map(p => (
                                <tr key={p._id}>
                                    <td>{new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td className="td-primary">{p.vendor_id?.name || '—'}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--t1)' }}>₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td>{p.mode}</td>
                                    <td><span className={`badge ${statusBadgeClass(p.status)}`}>{p.status}</span></td>
                                    <td>
                                        <Link to={`/payouts/${p._id}`} className="link-btn">View →</Link>
                                    </td>
                                </tr>
                            ))}
                            {payouts.length === 0 && (
                                <tr className="empty-row"><td colSpan="6">No payouts match your filters.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PayoutList;
