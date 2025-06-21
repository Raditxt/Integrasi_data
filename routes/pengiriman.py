from flask import Blueprint, request, jsonify, current_app

pengiriman_bp = Blueprint('pengiriman', __name__)

@pengiriman_bp.route('/pengiriman/<int:id>', methods=['GET'])
def get_pengiriman(id):
    mysql = current_app.mysql
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM pengiriman WHERE id_pesanan = %s", (id,))
        row = cur.fetchone()
        if row:
            columns = [col[0] for col in cur.description]
            result = dict(zip(columns, row))
            return jsonify(result)
        else:
            return jsonify({'status': 'error', 'message': 'Pengiriman tidak ditemukan'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@pengiriman_bp.route('/pengiriman', methods=['POST'])
def tambah_pengiriman():
    mysql = current_app.mysql
    data = request.get_json()

    id_pesanan = data.get('id_pesanan')
    kurir = data.get('kurir')
    no_resi = data.get('no_resi')
    status_pengiriman = data.get('status_pengiriman')
    tanggal_kirim = data.get('tanggal_kirim')
    id_karyawan = data.get('id_karyawan')  # optional

    if not all([id_pesanan, kurir, no_resi, status_pengiriman, tanggal_kirim]):
        return jsonify({'status': 'error', 'message': 'Field wajib tidak lengkap'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO pengiriman 
            (id_pesanan, kurir, no_resi, status_pengiriman, tanggal_kirim, id_karyawan)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (id_pesanan, kurir, no_resi, status_pengiriman, tanggal_kirim, id_karyawan))
        mysql.connection.commit()
        return jsonify({'status': 'success', 'message': 'Pengiriman berhasil ditambahkan'}), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@pengiriman_bp.route('/pengiriman', methods=['GET'])
def semua_pengiriman():
    mysql = current_app.mysql
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM pengiriman ORDER BY id_pengiriman DESC")
        rows = cur.fetchall()
        columns = [col[0] for col in cur.description]
        result = [dict(zip(columns, row)) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
