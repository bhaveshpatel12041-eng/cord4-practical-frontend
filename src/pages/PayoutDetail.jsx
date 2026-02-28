import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getPayoutDetails, clearPayoutDetails, submitPayout, approvePayout, rejectPayout } from '../store/slices/payoutSlice';
import toast from 'react-hot-toast';

const statusBadgeClass = (s) => ({ Draft: 'badge-draft', Submitted: 'badge-submitted', Approved: 'badge-approved', Rejected: 'badge-rejected' }[s] || 'badge-draft');

const PayoutDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { payout, auditTrail, isLoading, isError, message } = useSelector((state) => state.payout);
    const { user } = useSelector((state) => state.auth);

    const [rejectReason, setRejectReason] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (isError) toast.error(message);
        dispatch(getPayoutDetails(id));
        return () => { dispatch(clearPayoutDetails()); };
    }, [id, isError, message, dispatch]);

    const handleAction = async (type) => {
        let result;
        if (type === 'submit') result = await dispatch(submitPayout(id));
        else if (type === 'approve') result = await dispatch(approvePayout(id));
        else if (type === 'reject') {
            if (!rejectReason) { toast.error('Rejection reason is required'); return; }
            result = await dispatch(rejectPayout({ id, decision_reason: rejectReason }));
            setShowModal(false);
        }
        if (result?.meta?.requestStatus === 'fulfilled') {
            toast.success(`Payout ${type}d!`);
            dispatch(getPayoutDetails(id));
        }
    };

    if (isLoading || !payout) return (
        <div className="loading-state"><div className="spinner" />Loading payout…</div>
    );

    return (
        <div>
            <button className="back-btn" onClick={() => navigate('/payouts')}>← Back to Payouts</button>

            <div className="page-header" style={{ marginTop: '0.25rem' }}>
                <div>
                    <h1 className="page-title">Payout Details</h1>
                    <p className="page-subtitle">ID: {id}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.625rem' }}>
                    {user.role === 'OPS' && payout.status === 'Draft' && (
                        <button className="btn btn-primary" onClick={() => handleAction('submit')} disabled={isLoading}>
                            ↑ Submit for Approval
                        </button>
                    )}
                    {user.role === 'FINANCE' && payout.status === 'Submitted' && (
                        <>
                            <button className="btn btn-success" onClick={() => handleAction('approve')} disabled={isLoading}>
                                ✓ Approve
                            </button>
                            <button className="btn btn-danger" onClick={() => setShowModal(true)} disabled={isLoading}>
                                ✕ Reject
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 className="modal-title">Reason for Rejection</h3>
                        <textarea
                            className="form-control"
                            rows={4}
                            placeholder="Explain why this payout is being rejected…"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => handleAction('reject')}>Confirm Reject</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payout Info Card */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
                <div className="card-header">
                    <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vendor</span>
                        <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--t1)', marginTop: '0.1rem' }}>{payout.vendor_id?.name}</p>
                    </div>
                    <span className={`badge ${statusBadgeClass(payout.status)}`}>{payout.status}</span>
                </div>

                <div className="detail-grid">
                    <div className="detail-item">
                        <span className="detail-label">Amount</span>
                        <span className="detail-value amount">₹{payout.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Mode</span>
                        <span className="detail-value">{payout.mode}</span>
                    </div>
                    <div className="detail-item full">
                        <span className="detail-label">Created By</span>
                        <span className="detail-value">{payout.created_by?.email} <span style={{ color: 'var(--primary-l)', fontSize: '0.72rem' }}>({payout.created_by?.role})</span></span>
                    </div>
                    {payout.note && (
                        <div className="detail-item full">
                            <span className="detail-label">Notes</span>
                            <div className="alert-block alert-note" style={{ marginTop: '0.25rem' }}>{payout.note}</div>
                        </div>
                    )}
                    {payout.status === 'Rejected' && payout.decision_reason && (
                        <div className="detail-item full">
                            <span className="detail-label" style={{ color: 'var(--danger)' }}>Rejection Reason</span>
                            <div className="alert-block alert-reject" style={{ marginTop: '0.25rem' }}>{payout.decision_reason}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Audit Trail */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title">Audit Trail</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--t3)' }}>{auditTrail.length} event{auditTrail.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="card-body">
                    {auditTrail.length === 0 ? (
                        <p style={{ color: 'var(--t3)', fontSize: '0.82rem' }}>No audit logs yet.</p>
                    ) : (
                        <ol className="audit-list">
                            {auditTrail.map((log, idx) => (
                                <li key={log._id} className={`audit-item ${idx === auditTrail.length - 1 ? 'last' : ''}`}>
                                    <div className="audit-dot" />
                                    <div className="audit-time">{new Date(log.timestamp).toLocaleString('en-IN')}</div>
                                    <div className="audit-action">{log.action}</div>
                                    <div className="audit-user">
                                        by <strong>{log.performed_by?.email}</strong> ({log.performed_by?.role})
                                    </div>
                                    {log.previous_status && log.new_status && (
                                        <div className="audit-arrow">{log.previous_status} → {log.new_status}</div>
                                    )}
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PayoutDetail;
