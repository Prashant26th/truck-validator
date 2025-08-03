import React, { useState } from 'react';
import './HomeForm.css';

const DownloadForm: React.FC = () => {
    const [date, setDate] = useState('');
    const [truckId, setTruckId] = useState('');
    const [downloading, setDownloading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setDownloading(true);
        try {
            const response = await fetch('https://163209aa37f2.ngrok-free.app/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date, truckId })
            });

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${date}-truck-validation.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Failed to download file. Please try again.');
        }
        setDownloading(false);
    };

    return (
        <form className="form-container" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-title">Download Report</div>
            <div className="form-section">
                <label htmlFor="date">Select Date</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div className="form-section">
                <label htmlFor="truckId">Truck Number</label>
                <input
                    type="text"
                    id="truckId"
                    value={truckId}
                    onChange={(e) => setTruckId(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={downloading}>
                {downloading ? 'Downloading...' : 'Download'}
            </button>
        </form>
    );
};

export default DownloadForm;