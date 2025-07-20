import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Kita akan buat file CSS ini nanti

const API_URL = 'http://localhost:5000'; // Sesuaikan dengan URL backend Flask Anda

function App() {
  const [transactions, setTransactions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('income'); // Default to income
  const [editingTransaction, setEditingTransaction] = useState(null); // State for editing

  useEffect(() => {
    fetchTransactions();
    fetchAuditLogs();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/audit_logs`);
      setAuditLogs(response.data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const handleAddOrUpdateTransaction = async (e) => {
    e.preventDefault();
    const transactionData = {
      description,
      amount: parseFloat(amount),
      transaction_type: transactionType,
    };

    try {
      if (editingTransaction) {
        // Update existing transaction
        await axios.put(`${API_URL}/transactions/${editingTransaction.id}`, transactionData);
        setEditingTransaction(null); // Clear editing state
      } else {
        // Add new transaction
        await axios.post(`${API_URL}/transactions`, transactionData);
      }
      setDescription('');
      setAmount('');
      setTransactionType('income');
      fetchTransactions();
      fetchAuditLogs(); // Refresh audit logs after any transaction change
    } catch (error) {
      console.error('Error adding/updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`);
      fetchTransactions();
      fetchAuditLogs(); // Refresh audit logs
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setTransactionType(transaction.transaction_type);
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistem Audit Trail UMKM</h1>
      </header>

      <main>
        <section className="transaction-section">
          <h2>{editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</h2>
          <form onSubmit={handleAddOrUpdateTransaction} className="transaction-form">
            <input
              type="text"
              placeholder="Deskripsi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Jumlah"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              required
            />
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
            <button type="submit">{editingTransaction ? 'Update Transaksi' : 'Tambah Transaksi'}</button>
            {editingTransaction && (
              <button type="button" onClick={() => { setEditingTransaction(null); setDescription(''); setAmount(''); setTransactionType('income'); }}>
                Batal Edit
              </button>
            )}
          </form>
        </section>

        <section className="transaction-list-section">
          <h2>Daftar Transaksi</h2>
          {transactions.length === 0 ? (
            <p>Belum ada transaksi.</p>
          ) : (
            <ul className="transaction-list">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="transaction-item">
                  <p><strong>Deskripsi:</strong> {transaction.description}</p>
                  <p><strong>Jumlah:</strong> Rp{parseFloat(transaction.amount).toLocaleString('id-ID')}</p>
                  <p><strong>Tipe:</strong> {transaction.transaction_type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</p>
                  <p><strong>Tanggal:</strong> {new Date(transaction.transaction_date).toLocaleDateString('id-ID')}</p>
                  <div className="transaction-actions">
                    <button onClick={() => handleEditClick(transaction)}>Edit</button>
                    <button onClick={() => handleDeleteTransaction(transaction.id)}>Hapus</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="audit-log-section">
          <h2>Log Audit</h2>
          {auditLogs.length === 0 ? (
            <p>Belum ada log audit.</p>
          ) : (
            <ul className="audit-log-list">
              {auditLogs.map((log) => (
                <li key={log.id} className="audit-log-item">
                  <p><strong>Tabel:</strong> {log.table_name}</p>
                  <p><strong>ID Record:</strong> {log.record_id}</p>
                  <p><strong>Tipe Aksi:</strong> {log.action_type}</p>
                  {log.old_data && (
                    <p><strong>Data Lama:</strong> <pre>{JSON.stringify(log.old_data, null, 2)}</pre></p>
                  )}
                  {log.new_data && (
                    <p><strong>Data Baru:</strong> <pre>{JSON.stringify(log.new_data, null, 2)}</pre></p>
                  )}
                  <p><strong>Oleh:</strong> {log.changed_by}</p>
                  <p><strong>Waktu:</strong> {new Date(log.change_timestamp).toLocaleString('id-ID')}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;