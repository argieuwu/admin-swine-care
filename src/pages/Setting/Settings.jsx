import React, { useEffect, useState } from 'react';
import styles from './Setting.module.css';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const DEFAULTS = {
  highRiskThreshold: 80.0,
  mediumRiskThreshold: 30.0,
  lowRiskThreshold: 0.0,
  highRiskLabel: 'High Risk',
  mediumRiskLabel: 'Medium Risk',
  lowRiskLabel: 'Low Risk',
  earsWeight: 30.0,
  skinWeight: 30.0,
  symptomsWeight: 40.0,
};

const Settings = () => {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  if (loading) {
    return <div className={styles.settingsWrapper}><div className={styles.settingsCard}><p>Loading...</p></div></div>;
  }

  return (
    <div className={styles.settingsWrapper}>
      <div className={styles.settingsCard}>
        <h2 className={styles.settingsTitle}>SwineCare Settings</h2>
        <p className={styles.settingsDescription}>
          Update risk thresholds, labels, and weights for ASF tracking.
        </p>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
        <form className={styles.settingsForm} onSubmit={handleSave}>
          <fieldset className={styles.settingsFieldset}>
            <legend>Risk Thresholds</legend>
            <label>High Risk Threshold: <input type="number" step="0.1" name="highRiskThreshold" value={form.highRiskThreshold} onChange={handleChange} /></label><br/>
            <label>Medium Risk Threshold: <input type="number" step="0.1" name="mediumRiskThreshold" value={form.mediumRiskThreshold} onChange={handleChange} /></label><br/>
            <label>Low Risk Threshold: <input type="number" step="0.1" name="lowRiskThreshold" value={form.lowRiskThreshold} onChange={handleChange} /></label>
          </fieldset>
          <fieldset className={styles.settingsFieldset}>
            <legend>Risk Labels</legend>
            <label>High Risk Label: <input type="text" name="highRiskLabel" value={form.highRiskLabel} onChange={handleChange} /></label><br/>
            <label>Medium Risk Label: <input type="text" name="mediumRiskLabel" value={form.mediumRiskLabel} onChange={handleChange} /></label><br/>
            <label>Low Risk Label: <input type="text" name="lowRiskLabel" value={form.lowRiskLabel} onChange={handleChange} /></label>
          </fieldset>
          <fieldset className={styles.settingsFieldset}>
            <legend>Weights (%)</legend>
            <label>Ears Weight: <input type="number" step="0.1" name="earsWeight" value={form.earsWeight} onChange={handleChange} /></label><br/>
            <label>Skin Weight: <input type="number" step="0.1" name="skinWeight" value={form.skinWeight} onChange={handleChange} /></label><br/>
            <label>Symptoms Weight: <input type="number" step="0.1" name="symptomsWeight" value={form.symptomsWeight} onChange={handleChange} /></label>
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