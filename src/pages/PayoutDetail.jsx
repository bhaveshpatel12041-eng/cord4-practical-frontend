import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getPayoutDetails, clearPayoutDetails, submitPayout, approvePayout, rejectPayout } from '../store/slices/payoutSlice';
import toast from 'react-hot-toast';

const PayoutDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { payout, auditTrail, isLoading, isError, message } = useSelector((state) => state.payout);
    const { user } = useSelector((state) => state.auth);

    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        dispatch(getPayoutDetails(id));

        return () => {
            dispatch(clearPayoutDetails());
        };
    }, [id, isError, message, dispatch]);

    const handleAction = async (actionType) => {
        try {
            let resultAction;
            if (actionType === 'submit') {
                resultAction = await dispatch(submitPayout(id));
            } else if (actionType === 'approve') {
                resultAction = await dispatch(approvePayout(id));
            } else if (actionType === 'reject') {
                if (!rejectReason) {
                    toast.error('Rejection reason is required');
                    return;
                }
                resultAction = await dispatch(rejectPayout({ id, decision_reason: rejectReason }));
                setShowRejectModal(false);
            }

            if (submitPayout.fulfilled.match(resultAction) || approvePayout.fulfilled.match(resultAction) || rejectPayout.fulfilled.match(resultAction)) {
                toast.success(`Payout successfully ${actionType}ed!`);
                dispatch(getPayoutDetails(id)); // refresh data
            }
        } catch (err) {
            toast.error('Action failed');
        }
    };

    if (isLoading || !payout) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading payout details...</div>;
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

    const statusColors = getStatusColor(payout.status);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Header & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <button
                        onClick={() => navigate('/payouts')}
                        style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
                        &larr; Back to Payouts
                    </button>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Payout Details</h2>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* OPS Action: Submit */}
                    {user.role === 'OPS' && payout.status === 'Draft' && (
                        <button
                            onClick={() => handleAction('submit')}
                            disabled={isLoading}
                            style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Submit for Approval
                        </button>
                    )}

                    {/* FINANCE Actions: Approve / Reject */}
                    {user.role === 'FINANCE' && payout.status === 'Submitted' && (
                        <>
                            <button
                                onClick={() => handleAction('approve')}
                                disabled={isLoading}
                                style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Approve
                            </button>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                disabled={isLoading}
                                style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Reject
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Provide Rejection Reason</h3>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter reason..."
                            rows={4}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '1rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        />
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '4px', fontWeight: '500', cursor: 'pointer' }}>
                                Cancel
                            </button>
                            <button
                                onClick={() => handleAction('reject')}
                                style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payout Info Card */}
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Vendor</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>{payout.vendor_id?.name}</p>
                        </div>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            backgroundColor: statusColors.bg,
                            color: statusColors.text
                        }}>
                            {payout.status}
                        </span>
                    </div>
                </div>
                <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Amount</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>₹ {payout.amount.toFixed(2)}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Mode</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>{payout.mode}</p>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Created By</p>
                        <p style={{ fontSize: '1rem', color: '#111827', margin: 0 }}>{payout.created_by?.email} ({payout.created_by?.role})</p>
                    </div>
                    {payout.note && (
                        <div style={{ gridColumn: 'span 2' }}>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Notes</p>
                            <p style={{ fontSize: '0.875rem', color: '#374151', margin: 0, backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '4px' }}>{payout.note}</p>
                        </div>
                    )}
                    {payout.status === 'Rejected' && payout.decision_reason && (
                        <div style={{ gridColumn: 'span 2' }}>
                            <p style={{ fontSize: '0.875rem', color: '#991b1b', margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>Rejection Reason</p>
                            <p style={{ fontSize: '0.875rem', color: '#7f1d1d', margin: 0, backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '4px', border: '1px solid #fecaca' }}>{payout.decision_reason}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Audit Trail Card */}
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Audit Trail</h3>
                </div>
                <div style={{ padding: '1.5rem' }}>
                    {auditTrail.length === 0 ? (
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>No audit logs available for this payout.</p>
                    ) : (
                        <ol style={{ listStyleType: 'none', padding: 0, margin: 0, position: 'relative', borderLeft: '2px solid #e5e7eb', marginLeft: '0.5rem' }}>
                            {auditTrail.map((log, idx) => (
                                <li key={log._id} style={{ marginBottom: idx === auditTrail.length - 1 ? 0 : '1.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-0.3rem', top: '0.25rem', width: '0.5rem', height: '0.5rem', backgroundColor: '#9ca3af', borderRadius: '50%' }}></div>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>
                                        {new Date(log.timestamp).toLocaleString()}
                                    </p>
                                    <p style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 0.25rem 0' }}>
                                        Action: {log.action}
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                                        Performed by <span style={{ fontWeight: '500' }}>{log.performed_by?.email}</span> ({log.performed_by?.role})
                                    </p>
                                    {log.previous_status && log.new_status && (
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                                            Status changed: {log.previous_status} &rarr; {log.new_status}
                                        </p>
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
