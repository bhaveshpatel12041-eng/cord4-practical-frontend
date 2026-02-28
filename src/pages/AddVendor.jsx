import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createVendor, resetVendorState } from '../store/slices/vendorSlice';
import toast from 'react-hot-toast';

const AddVendor = () => {
    const [formData, setFormData] = useState({ name: '', upi_id: '', bank_account: '', ifsc: '' });
    const { name, upi_id, bank_account, ifsc } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.vendor);

    useEffect(() => {
        return () => { dispatch(resetVendorState()); };
    }, [dispatch]);

    const onChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createVendor(formData)).unwrap();
            toast.success('Vendor added!');
            navigate('/vendors');
        } catch (error) {
            toast.error(error || 'Failed to add vendor');
        }
    };

    return (
        <div>
            <button className="back-btn" onClick={() => navigate('/vendors')}>← Back to Vendors</button>
            <div className="page-header" style={{ marginTop: '0.25rem' }}>
                <h1 className="page-title">Add Vendor</h1>
            </div>

            <div className="card" style={{ maxWidth: '620px' }}>
                <div className="card-header">
                    <span className="card-title">Vendor Details</span>
                </div>
                <div className="card-body">
                    <form onSubmit={onSubmit}>
                        <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
                            <div className="form-group form-full">
                                <label className="form-label">Name <span className="req">*</span></label>
                                <input className="form-control" type="text" name="name" value={name} onChange={onChange} placeholder="Acme Corp" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">UPI ID</label>
                                <input className="form-control" type="text" name="upi_id" value={upi_id} onChange={onChange} placeholder="vendor@upi" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Bank Account</label>
                                <input className="form-control" type="text" name="bank_account" value={bank_account} onChange={onChange} placeholder="1234567890" />
                            </div>
                            <div className="form-group form-full">
                                <label className="form-label">IFSC Code</label>
                                <input className="form-control" type="text" name="ifsc" value={ifsc} onChange={onChange} placeholder="HDFC0001234" />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? 'Saving…' : 'Save Vendor'}
                            </button>
                            <button type="button" className="btn btn-ghost" onClick={() => navigate('/vendors')}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddVendor;
