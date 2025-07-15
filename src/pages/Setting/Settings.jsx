import React, { useEffect, useState } from 'react';
import styles from './Setting.module.css';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const DEFAULTS = {
  riskLabels: [
    { label: 'High Risk' },
    { label: 'Medium Risk' },
    { label: 'Low Risk' }
  ],
  riskThresholds: [
    { label: 'High Risk', value: 80 },
    { label: 'Medium Risk', value: 30 },
    { label: 'Low Risk', value: 0 }
  ],
  earsWeight: 30.0,
  skinWeight: 30.0,
  symptomsWeight: 40.0,
  symptomsChecklist: [
    { question: 'High fever?', description: 'The pig has a high fever, with a body temperature ranging from 40°C to 42°C, which may indicate a severe infection or systemic illness.' },
    { question: 'Milder fever?', description: 'The pig is experiencing a fluctuating mild fever, where the temperature rises and falls, potentially signaling an early or infection.' },
    { question: 'Slight fever?', description: 'The pig has a slight fever, with body temperatures ranging between 37.5°C and 39°C, which could be a sign of a mild infection or stress response.' },
    { question: 'Extreme tiredness?', description: 'The pig shows signs of extreme fatigue, which could be associated with systemic weakness.' },
    { question: 'Loss of appetite?', description: 'The pig is refusing to eat, a common symptom that may indicate pain, illness, or digestive discomfort.' },
    { question: 'Difficulty of breathing?', description: 'The pig is having trouble breathing, which may suggest respiratory tract infections, lung issues, or high fever.' },
    { question: 'Difficulty on walking?', description: 'The pig has difficulty walking, which may result from joint pain, muscle weakness, neurological problems, or respiratory distress.' },
    { question: 'Bloody feces?', description: 'The presence of blood in the pig\'s feces is a serious symptom that may point to internal bleeding, intestinal infections, or parasitic infestations.' }
  ]
};

const Settings = () => {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [symptomInput, setSymptomInput] = useState({ question: '', description: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState({ question: '', description: '' });
  // Add state for risk labels and thresholds CRUD
  const [riskLabelInput, setRiskLabelInput] = useState('');
  const [editingRiskLabelIndex, setEditingRiskLabelIndex] = useState(null);
  const [editingRiskLabelValue, setEditingRiskLabelValue] = useState('');
  const [riskThresholdInput, setRiskThresholdInput] = useState({ label: '', value: '' });
  const [editingRiskThresholdIndex, setEditingRiskThresholdIndex] = useState(null);
  const [editingRiskThresholdValue, setEditingRiskThresholdValue] = useState({ label: '', value: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const ref = doc(db, 'admin_settings', 'current');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setForm({ ...DEFAULTS, ...snap.data() });
        } else {
          setForm(DEFAULTS);
        }
      } catch (e) {
        setError('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const ref = doc(db, 'admin_settings', 'current');
      await setDoc(ref, form);
      setSuccess('Settings saved!');
    } catch (e) {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const ref = doc(db, 'admin_settings', 'current');
      await setDoc(ref, DEFAULTS);
      setForm(DEFAULTS);
      setSuccess('Reset to defaults!');
    } catch (e) {
      setError('Failed to reset settings.');
    } finally {
      setSaving(false);
    }
  };

  // CRUD for symptoms checklist (with question and description)
  const handleAddSymptom = () => {
    if (
      symptomInput.question.trim() &&
      symptomInput.description.trim() &&
      !form.symptomsChecklist.some(s => s.question === symptomInput.question.trim())
    ) {
      setForm((prev) => ({
        ...prev,
        symptomsChecklist: [...prev.symptomsChecklist, { ...symptomInput }]
      }));
      setSymptomInput({ question: '', description: '' });
    }
  };

  const handleEditSymptom = (index) => {
    setEditingIndex(index);
    setEditingValue(form.symptomsChecklist[index]);
  };

  const handleSaveEditSymptom = () => {
    if (editingValue.question.trim() && editingValue.description.trim()) {
      setForm((prev) => {
        const updated = [...prev.symptomsChecklist];
        updated[editingIndex] = { ...editingValue };
        return { ...prev, symptomsChecklist: updated };
      });
      setEditingIndex(null);
      setEditingValue({ question: '', description: '' });
    }
  };

  const handleDeleteSymptom = (index) => {
    setForm((prev) => {
      const updated = [...prev.symptomsChecklist];
      updated.splice(index, 1);
      return { ...prev, symptomsChecklist: updated };
    });
    setEditingIndex(null);
    setEditingValue({ question: '', description: '' });
  };

  // CRUD for risk labels
  const handleAddRiskLabel = () => {
    if (riskLabelInput.trim() && !form.riskLabels.some(l => l.label === riskLabelInput.trim())) {
      setForm(prev => ({ ...prev, riskLabels: [...prev.riskLabels, { label: riskLabelInput.trim() }] }));
      setRiskLabelInput('');
    }
  };
  const handleEditRiskLabel = (idx) => {
    setEditingRiskLabelIndex(idx);
    setEditingRiskLabelValue(form.riskLabels[idx].label);
  };
  const handleSaveEditRiskLabel = () => {
    if (editingRiskLabelValue.trim()) {
      setForm(prev => {
        const updated = [...prev.riskLabels];
        updated[editingRiskLabelIndex] = { label: editingRiskLabelValue.trim() };
        return { ...prev, riskLabels: updated };
      });
      setEditingRiskLabelIndex(null);
      setEditingRiskLabelValue('');
    }
  };
  const handleDeleteRiskLabel = (idx) => {
    setForm(prev => {
      const updated = [...prev.riskLabels];
      updated.splice(idx, 1);
      // Remove thresholds with this label
      const updatedThresholds = prev.riskThresholds.filter(t => t.label !== prev.riskLabels[idx].label);
      return { ...prev, riskLabels: updated, riskThresholds: updatedThresholds };
    });
    setEditingRiskLabelIndex(null);
    setEditingRiskLabelValue('');
  };

  // CRUD for risk thresholds
  const handleAddRiskThreshold = () => {
    if (
      riskThresholdInput.label &&
      riskThresholdInput.value !== '' &&
      !form.riskThresholds.some(t => t.label === riskThresholdInput.label)
    ) {
      setForm(prev => ({
        ...prev,
        riskThresholds: [...prev.riskThresholds, { label: riskThresholdInput.label, value: Number(riskThresholdInput.value) }]
      }));
      setRiskThresholdInput({ label: '', value: '' });
    }
  };
  const handleEditRiskThreshold = (idx) => {
    setEditingRiskThresholdIndex(idx);
    setEditingRiskThresholdValue(form.riskThresholds[idx]);
  };
  const handleSaveEditRiskThreshold = () => {
    if (editingRiskThresholdValue.label && editingRiskThresholdValue.value !== '') {
      setForm(prev => {
        const updated = [...prev.riskThresholds];
        updated[editingRiskThresholdIndex] = { ...editingRiskThresholdValue, value: Number(editingRiskThresholdValue.value) };
        return { ...prev, riskThresholds: updated };
      });
      setEditingRiskThresholdIndex(null);
      setEditingRiskThresholdValue({ label: '', value: '' });
    }
  };
  const handleDeleteRiskThreshold = (idx) => {
    if (form.riskThresholds.length > 1) {
      setForm(prev => {
        const updated = [...prev.riskThresholds];
        updated.splice(idx, 1);
        return { ...prev, riskThresholds: updated };
      });
      setEditingRiskThresholdIndex(null);
      setEditingRiskThresholdValue({ label: '', value: '' });
    }
  };

  if (loading) {
    return <div className={styles.settingsWrapper}><div className={styles.settingsCard}><p>Loading...</p></div></div>;
  }

  return (
    <div className={styles.settingsWrapper}>
      <div className={styles.settingsCard}>
        <h2 className={styles.settingsTitle}>SwineCare Settings</h2>
        <p className={styles.settingsDescription}>
          Update risk thresholds, labels, weights, and symptoms checklist for ASF tracking.
        </p>
        {error && <div className={styles.errorMsg}>{error}</div>}
        {success && <div className={styles.successMsg}>{success}</div>}
        <form className={styles.settingsForm} onSubmit={handleSave}>
          <fieldset className={styles.settingsFieldset}>
            <legend>Risk Labels</legend>
            <div className={styles.symptomAddRow}>
              <input
                type="text"
                placeholder="Add new risk label..."
                value={riskLabelInput}
                onChange={e => setRiskLabelInput(e.target.value)}
                className={styles.symptomInput}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddRiskLabel(); } }}
              />
              <button type="button" className={styles.saveButton} onClick={handleAddRiskLabel} disabled={!riskLabelInput.trim()}>Add</button>
            </div>
            <ul className={styles.symptomList}>
              {form.riskLabels.map((label, idx) => (
                <li key={idx} className={styles.symptomListItem}>
                  {editingRiskLabelIndex === idx ? (
                    <>
                      <input
                        type="text"
                        value={editingRiskLabelValue}
                        onChange={e => setEditingRiskLabelValue(e.target.value)}
                        className={styles.symptomInput}
                        placeholder="Risk label..."
                      />
                      <button type="button" className={styles.saveButton} onClick={handleSaveEditRiskLabel}>Save</button>
                      <button type="button" className={styles.resetButton} onClick={() => setEditingRiskLabelIndex(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className={styles.symptomQuestion}>{label.label}</span>
                      <button type="button" className={styles.saveButton} onClick={() => handleEditRiskLabel(idx)}>Edit</button>
                      <button type="button" className={styles.resetButton} onClick={() => handleDeleteRiskLabel(idx)} disabled={form.riskLabels.length === 1}>Delete</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </fieldset>
          <fieldset className={styles.settingsFieldset}>
            <legend>Risk Thresholds</legend>
            <div className={styles.symptomAddRow}>
              <select
                value={riskThresholdInput.label}
                onChange={e => setRiskThresholdInput(s => ({ ...s, label: e.target.value }))}
                className={styles.symptomInput}
              >
                <option value="">Select label...</option>
                {form.riskLabels.map((label, idx) => (
                  <option key={idx} value={label.label}>{label.label}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Threshold value..."
                value={riskThresholdInput.value}
                onChange={e => setRiskThresholdInput(s => ({ ...s, value: e.target.value }))}
                className={styles.symptomInput}
                min="0"
              />
              <button type="button" className={styles.saveButton} onClick={handleAddRiskThreshold} disabled={!riskThresholdInput.label || riskThresholdInput.value === ''}>Add</button>
            </div>
            <ul className={styles.symptomList}>
              {form.riskThresholds.map((threshold, idx) => (
                <li key={idx} className={styles.symptomListItem}>
                  {editingRiskThresholdIndex === idx ? (
                    <>
                      <select
                        value={editingRiskThresholdValue.label}
                        onChange={e => setEditingRiskThresholdValue(s => ({ ...s, label: e.target.value }))}
                        className={styles.symptomInput}
                      >
                        <option value="">Select label...</option>
                        {form.riskLabels.map((label, lidx) => (
                          <option key={lidx} value={label.label}>{label.label}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={editingRiskThresholdValue.value}
                        onChange={e => setEditingRiskThresholdValue(s => ({ ...s, value: e.target.value }))}
                        className={styles.symptomInput}
                        min="0"
                      />
                      <button type="button" className={styles.saveButton} onClick={handleSaveEditRiskThreshold}>Save</button>
                      <button type="button" className={styles.resetButton} onClick={() => setEditingRiskThresholdIndex(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className={styles.symptomQuestion}>{threshold.label}</span>
                      <span className={styles.symptomDescription}>{threshold.value}</span>
                      <button type="button" className={styles.saveButton} onClick={() => handleEditRiskThreshold(idx)}>Edit</button>
                      <button type="button" className={styles.resetButton} onClick={() => handleDeleteRiskThreshold(idx)} disabled={form.riskThresholds.length === 1}>Delete</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </fieldset>
          <fieldset className={styles.settingsFieldset}>
            <legend>Weights (%)</legend>
            <label>Ears Weight:
              <input type="number" step="0.1" name="earsWeight" value={form.earsWeight} onChange={handleChange} />
            </label>
            <label>Skin Weight:
              <input type="number" step="0.1" name="skinWeight" value={form.skinWeight} onChange={handleChange} />
            </label>
            <label>Symptoms Weight:
              <input type="number" step="0.1" name="symptomsWeight" value={form.symptomsWeight} onChange={handleChange} />
            </label>
          </fieldset>
          <fieldset className={styles.settingsFieldset} style={{ gridColumn: 'span 2' }}>
            <legend>Symptoms Checklist</legend>
            <div className={styles.symptomAddRow}>
              <input
                type="text"
                placeholder="Symptom question..."
                value={symptomInput.question}
                onChange={e => setSymptomInput(s => ({ ...s, question: e.target.value }))}
                className={styles.symptomInput}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSymptom(); } }}
              />
              <input
                type="text"
                placeholder="Symptom description..."
                value={symptomInput.description}
                onChange={e => setSymptomInput(s => ({ ...s, description: e.target.value }))}
                className={styles.symptomInput}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSymptom(); } }}
              />
              <button type="button" className={styles.saveButton} onClick={handleAddSymptom} disabled={!symptomInput.question.trim() || !symptomInput.description.trim()}>Add</button>
            </div>
            <ul className={styles.symptomList}>
              {form.symptomsChecklist.map((symptom, idx) => (
                <li key={idx} className={styles.symptomListItem}>
                  {editingIndex === idx ? (
                    <>
                      <input
                        type="text"
                        value={editingValue.question}
                        onChange={e => setEditingValue(s => ({ ...s, question: e.target.value }))}
                        className={styles.symptomInput}
                        placeholder="Symptom question..."
                      />
                      <input
                        type="text"
                        value={editingValue.description}
                        onChange={e => setEditingValue(s => ({ ...s, description: e.target.value }))}
                        className={styles.symptomInput}
                        placeholder="Symptom description..."
                      />
                      <button type="button" className={styles.saveButton} onClick={handleSaveEditSymptom}>Save</button>
                      <button type="button" className={styles.resetButton} onClick={() => setEditingIndex(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className={styles.symptomQuestion}>{symptom.question}</span>
                      <span className={styles.symptomDescription}>{symptom.description}</span>
                      <button type="button" className={styles.saveButton} onClick={() => handleEditSymptom(idx)}>Edit</button>
                      <button type="button" className={styles.resetButton} onClick={() => handleDeleteSymptom(idx)}>Delete</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </fieldset>
          <div className={styles.settingsActions}>
            <button type="submit" className={styles.saveButton} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" className={styles.resetButton} onClick={handleReset} disabled={saving}>Reset to Defaults</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings; 