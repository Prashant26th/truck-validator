import React, { useState } from 'react';
import './HomeForm.css';

const checklistItems = [
  { key: 'windScreenLeft', label: 'Wind Screen Left', type: '' },
  { key: 'windScreenRight', label: 'Wind Screen Right', type: '' },
  { key: 'lookingMirrorLeft', label: 'Looking Mirror Left', type: '' },
  { key: 'lookingMirrorRight', label: 'Looking Mirror Right', type: '' },
  { key: 'blindSpotMirrorLeft', label: 'Blind Spot Mirror Left', type: '' },
  { key: 'blindSpotMirrorRight', label: 'Blind Spot Mirror Right', type: '' },
  { key: 'threePointSeatBeltLeft', label: 'Three Point Seat Belt Left', type: '' },
  { key: 'threePointSeatBeltRight', label: 'Three Point Seat Belt Right', type: '' },
  { key: 'firstAidBox', label: 'First Aid Box', type: '' },
  { key: 'fireExtinguisher1kg', label: 'Fire Extinguisher 1Kg', type: '' },
  { key: 'fireExtinguisher9kg', label: 'Fire Extinguisher 9Kg', type: '' },
  { key: 'masterSwitchCover', label: 'Master Switch Cover', type: '' },
  { key: 'batteryTerminalCover', label: 'Battery Terminal Cover', type: '' },
  { key: 'batteryBox', label: 'Battery Box', type: '' },
  { key: 'rubberMat', label: 'Rubber Mat', type: '' },
  { key: 'looseWire', label: 'Loose Wire', type: '' },
  { key: 'sparkArrestor', label: 'Spark Arrestor', type: '' },
  { key: 'safetyTriangle', label: 'Safety Triangle', type: '' },
  { key: 'headLightLeft', label: 'Head Light Left', type: '' },
  { key: 'headLightRight', label: 'Head Light Right', type: '' },
  { key: 'indicatorLightLeft', label: 'Indicator Light Left', type: '' },
  { key: 'indicatorLightRight', label: 'Indicator Light Right', type: '' },
  { key: 'reverseAlarm', label: 'Reverse Alarm', type: '' },
  { key: 'abs', label: 'ABS', type: '' },
  { key: 'speedGovernor', label: 'Speed Governor', type: '' },
];

const chassisChecklistItems = [
  { key: 'tyreCondition', label: 'Tyre Condition', type: 'text' },
  { key: 'sideRunProtection', label: 'Side Run Protection', type: '' },
  { key: 'wheelCheckNut', label: 'Wheel Check Nut', type: '' },
  { key: 'uClamp', label: 'U-Clamp', type: '' },
  { key: 'backLight', label: 'Back Light', type: '' },
  { key: 'reverseLight', label: 'Reverse Light', type: '' },
];

const tankChecklistItems = [
  { key: 'paintCondition', label: 'Paint Condition', type: 'text' },
  { key: 'dent', label: 'Dent (If any)', type: '' },
  { key: 'rusting', label: 'Rusting (If any)', type: '' },
  { key: 'safetyHarness', label: 'Safety Harness (If any)', type: '' },
  { key: 'hazChem', label: 'Haz-Chem (If any)', type: '' },
  { key: 'reflectingTape', label: 'Reflecting Tape (three side) (If any)', type: '' },
  { key: 'mlSticker', label: 'ML-Sticker', type: '' },
  { key: 'fireScreen', label: 'Fire Screen', type: '' },
  { key: 'distanceBetweenTankCabin', label: 'Distance between Tank-Cabin ( 6 inch )', type: '' },
];

const initialChecklistState = Object.fromEntries(
  [...checklistItems, ...chassisChecklistItems, ...tankChecklistItems]
    .map(item => [item.key, item.type === 'text' ? '' : 'no'])
);

const HomeForm: React.FC = () => {
  const [date, setDate] = useState('');
  const [truckNumber, setTruckNumber] = useState('');
  const [transporter, setTransporter] = useState('');
  const [checklist, setChecklist] = useState(initialChecklistState);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChecklistChange = (item: string, value: string) => {
    setChecklist(prev => ({ ...prev, [item]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...filesArray]);
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('date', date);
    formData.append('truckNumber', truckNumber);
    formData.append('transporter', transporter);
    formData.append('checklist', JSON.stringify(checklist));
    photos.forEach((file, idx) => {
      formData.append('photos', file);
    });

    console.log('Submitting form with data:', { date, truckNumber, transporter, checklist, photos });

    try {
      const response = await fetch('https://163209aa37f2.ngrok-free.app/validation', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 200) {
        setShowSuccess(true);
      } else {
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      alert('Failed to submit form. Please try again.');
    }
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    setDate('');
    setTruckNumber('');
    setTransporter('');
    setChecklist(initialChecklistState);
    setPhotos([]);
    setPhotoPreviews([]);
  };

  return (
    <>
      <form className="form-container" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-title">Truck Validation Form</div>
        <div className="form-section">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-section">
          <label>Truck Number</label>
          <input
            type="text"
            value={truckNumber}
            onChange={e => setTruckNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-section">
          <label>Transporter</label>
          <input
            type="text"
            value={transporter}
            onChange={e => setTransporter(e.target.value)}
            required
          />
        </div>

        <div className="form-section">
          <label>Upload Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
          />
          <div className="photo-preview-list">
            {photoPreviews.map((src, idx) => (
              <div className="photo-preview-item" key={idx}>
                <img src={src} alt={`upload-${idx}`} />
                <button
                  type="button"
                  className="photo-remove-btn"
                  onClick={() => handleRemovePhoto(idx)}
                  aria-label="Remove photo"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-heading">Cabin Checklist</div>
          <div className="checklist-group">
            {checklistItems.map(item => (
              <div className="checklist-item" key={item.key}>
                <span>{item.label}</span>
                <button
                  type="button"
                  className={`checklist-btn${checklist[item.key] === 'yes' ? ' selected' : ''}`}
                  onClick={() => handleChecklistChange(item.key, 'yes')}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`checklist-btn${checklist[item.key] === 'no' ? ' selected' : ''}`}
                  onClick={() => handleChecklistChange(item.key, 'no')}
                >
                  No
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-heading">Chassis Checklist</div>
          <div className="checklist-group">
            {chassisChecklistItems.map(item => (
              <div className="checklist-item" key={item.key}>
                <span>{item.label}</span>
                {item.type === 'text' ? (
                  <input
                    type="text"
                    value={checklist[item.key]}
                    onChange={e => handleChecklistChange(item.key, e.target.value)}
                    className="checklist-text-input"
                  />
                ) : (
                  <>
                    <button
                      type="button"
                      className={`checklist-btn${checklist[item.key] === 'yes' ? ' selected' : ''}`}
                      onClick={() => handleChecklistChange(item.key, 'yes')}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`checklist-btn${checklist[item.key] === 'no' ? ' selected' : ''}`}
                      onClick={() => handleChecklistChange(item.key, 'no')}
                    >
                      No
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-heading">Tank Checklist</div>
          <div className="checklist-group">
            {tankChecklistItems.map(item => (
              <div className="checklist-item" key={item.key}>
                <span>{item.label}</span>
                {item.type === 'text' ? (
                  <input
                    type="text"
                    value={checklist[item.key]}
                    onChange={e => handleChecklistChange(item.key, e.target.value)}
                    className="checklist-text-input"
                  />
                ) : (
                  <>
                    <button
                      type="button"
                      className={`checklist-btn${checklist[item.key] === 'yes' ? ' selected' : ''}`}
                      onClick={() => handleChecklistChange(item.key, 'yes')}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`checklist-btn${checklist[item.key] === 'no' ? ' selected' : ''}`}
                      onClick={() => handleChecklistChange(item.key, 'no')}
                    >
                      No
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>

      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-message">Form submitted successfully!</div>
            <button className="popup-ok-btn" onClick={handleSuccessOk}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeForm;