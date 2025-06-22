from flask import Blueprint, request, jsonify, current_app

pesanan_bp = Blueprint('pesanan', __name__)

@pesanan_bp.route('/pesanan/<int:id>', methods=['GET'])
def get_pesanan(id):
    mysql = current_app.mysql
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM pesanan WHERE id_pesanan = %s", (id,))
        row = cur.fetchone()
        if row:
            columns = [col[0] for col in cur.description]
            result = dict(zip(columns, row))
            return jsonify(result)
        else:
            return jsonify({'status': 'error', 'message': 'Pesanan tidak ditemukan'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@pesanan_bp.route('/pesanan', methods=['POST'])
def tambah_pesanan():
    mysql = current_app.mysql
    data = request.get_json()

    id_pelanggan = data.get('id_pelanggan')
    tanggal_pesanan = data.get('tanggal_pesanan')
    total_pesanan = data.get('total_pesanan')

    if not all([id_pelanggan, tanggal_pesanan, total_pesanan]):
        return jsonify({'status': 'error', 'message': 'Semua field wajib diisi'}), 400

    try:
        cur = mysql.connection.cursor()

        # ✅ Cek apakah sudah ada pesanan pada tanggal itu oleh pelanggan yang sama
        cur.execute("""
            SELECT COUNT(*) FROM pesanan 
            WHERE id_pelanggan = %s AND tanggal_pesanan = %s
        """, (id_pelanggan, tanggal_pesanan))
        count = cur.fetchone()[0]

        if count > 0:
            return jsonify({'status': 'error', 'message': 'Pesanan untuk pelanggan ini pada tanggal tersebut sudah ada'}), 409

        # ✅ Insert jika belum ada
        cur.execute("""
            INSERT INTO pesanan (id_pelanggan, tanggal_pesanan, total_pesanan)
            VALUES (%s, %s, %s)
        """, (id_pelanggan, tanggal_pesanan, total_pesanan))
        mysql.connection.commit()

        return jsonify({'status': 'success', 'message': 'Pesanan berhasil ditambahkan'}), 201

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@pesanan_bp.route('/pesanan', methods=['GET'])
def list_pesanan():
    mysql = current_app.mysql
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM pesanan ORDER BY id_pesanan DESC")
        rows = cur.fetchall()
        columns = [col[0] for col in cur.description]
        result = [dict(zip(columns, row)) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
