import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import pandas as pd
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Database connection details from .env
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')

def get_db_connection():
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    return conn

@app.route('/transactions', methods=['GET'])
def get_transactions():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM transactions ORDER BY transaction_date DESC;')
    transactions = cur.fetchall()
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'transactions';")
    column_names = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()

    # Convert to list of dictionaries for easier JSON serialization
    transactions_list = []
    for row in transactions:
        transactions_list.append(dict(zip(column_names, row)))

    return jsonify(transactions_list)

@app.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    description = data.get('description')
    amount = data.get('amount')
    transaction_type = data.get('transaction_type')

    if not all([description, amount, transaction_type]):
        return jsonify({"error": "Missing data"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            'INSERT INTO transactions (description, amount, transaction_type) VALUES (%s, %s, %s) RETURNING id;',
            (description, amount, transaction_type)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        return jsonify({"message": "Transaction added successfully", "id": new_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/transactions/<int:transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    data = request.json
    description = data.get('description')
    amount = data.get('amount')
    transaction_type = data.get('transaction_type')

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            'UPDATE transactions SET description = %s, amount = %s, transaction_type = %s WHERE id = %s RETURNING *;',
            (description, amount, transaction_type, transaction_id)
        )
        updated_transaction = cur.fetchone()
        if updated_transaction:
            conn.commit()
            return jsonify({"message": "Transaction updated successfully"}), 200
        else:
            return jsonify({"error": "Transaction not found"}), 404
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute('DELETE FROM transactions WHERE id = %s RETURNING id;', (transaction_id,))
        deleted_id = cur.fetchone()
        if deleted_id:
            conn.commit()
            return jsonify({"message": "Transaction deleted successfully"}), 200
        else:
            return jsonify({"error": "Transaction not found"}), 404
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/audit_logs', methods=['GET'])
def get_audit_logs():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM audit_logs ORDER BY change_timestamp DESC;')
    audit_logs = cur.fetchall()
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'audit_logs';")
    column_names = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()

    audit_logs_list = []
    for row in audit_logs:
        audit_logs_list.append(dict(zip(column_names, row)))

    # Use Pandas for potential future analysis/formatting
    df_audit = pd.DataFrame(audit_logs_list)
    # Example: Convert timestamp to readable format if needed
    # df_audit['change_timestamp'] = df_audit['change_timestamp'].dt.strftime('%Y-%m-%d %H:%M:%S')

    return jsonify(df_audit.to_dict(orient='records')) # Convert DataFrame to list of dictionaries

if __name__ == '__main__':
    app.run(debug=True, port=5000)