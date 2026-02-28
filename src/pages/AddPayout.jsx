import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPayout, resetPayoutState } from '../store/slices/payoutSlice';
import { getVendors } from '../store/slices/vendorSlice';
import toast from 'react-hot-toast';

const AddPayout = () => {
    const [formData, setFormData] = useState({ vendor_id: '', amount: '', mode: 'UPI', note: '' });
    const { vendor_id, amount, mode, note } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.payout);
    const { vendors } = useSelector((state) => state.vendor);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user?.role !== 'OPS') { toast.error('Only OPS can create payouts'); navigate('/payouts'); }
    }, [user, navigate]);

    useEffect(() => { dispatch(getVendors()); }, [dispatch]);

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess) { toast.success('Payout draft created!'); navigate('/payouts'); }
        dispatch(resetPayoutState());
    }, [isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    const onSubmit = (e) => {
        e.preventDefault();
        if (!vendor_id) { toast.error('Please select a vendor'); return; }
        dispatch(createPayout({ vendor_id, amount: Number(amount), mode, note }));
    };

    return (
        <div>
            <button className="back-btn" onClick={() => navigate('/payouts')}>← Back to Payouts</button>
            <div className="page-header" style={{ marginTop: '0.25rem' }}>
                <h1 className="page-title">Create Payout</h1>
            </div>

            <div className="card" style={{ maxWidth: '620px' }}>
                <div className="card-header">
                    <span className="card-title">Payout Details</span>
                    <span className="badge badge-draft">Draft</span>
                </div>
                <div className="card-body">
                    <form onSubmit={onSubmit}>
                        <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
                            <div className="form-group form-full">
                                <label className="form-label">Vendor <span className="req">*</span></label>
                                <select className="form-control" name="vendor_id" value={vendor_id} onChange={onChange} required>
                                    <option value="" disabled>Select vendor…</option>
                                    {vendors.filter(v => v.is_active).map(v => (
                                        <option key={v._id} value={v._id}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Amount (₹) <span className="req">*</span></label>
                                <input className="form-control" type="number" name="amount" value={amount} onChange={onChange} min="0.01" step="0.01" placeholder="0.00" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mode <span className="req">*</span></label>
                                <select className="form-control" name="mode" value={mode} onChange={onChange} required>
                                    <option>UPI</option>
                                    <option>IMPS</option>
                                    <option>NEFT</option>
                                </select>
                            </div>
                            <div className="form-group form-full">
                                <label className="form-label">Notes</label>
                                <textarea className="form-control" name="note" value={note} onChange={onChange} placeholder="Optional notes…" rows={3} />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? 'Creating…' : 'Create Draft'}
                            </button>
                            <button type="button" className="btn btn-ghost" onClick={() => navigate('/payouts')}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPayout;
