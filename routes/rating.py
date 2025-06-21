from flask import Blueprint, request, jsonify, current_app

rating_bp = Blueprint('rating', __name__)

@rating_bp.route('/rating', methods=['POST'])
def tambah_rating():
    mysql = current_app.mysql
    data = request.get_json()

    id_pesanan = data.get('id_pesanan')
    id_pelanggan = data.get('id_pelanggan')
    rating_belanja = data.get('rating_belanja')
    komentar = data.get('komentar') or None

    if not all([id_pesanan, id_pelanggan, rating_belanja]):
        return jsonify({'status': 'error', 'message': 'Field wajib tidak lengkap'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO rating_pembelanjaan (id_pesanan, id_pelanggan, rating_belanja, komentar)
            VALUES (%s, %s, %s, %s)
        """, (id_pesanan, id_pelanggan, rating_belanja, komentar))
        mysql.connection.commit()
        return jsonify({'status': 'success', 'message': 'Rating berhasil ditambahkan'}), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@rating_bp.route('/rating', methods=['GET'])
def semua_rating():
    mysql = current_app.mysql
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM rating_pembelanjaan ORDER BY id_rating_belanja DESC")
        rows = cur.fetchall()
        columns = [col[0] for col in cur.description]
        result = [dict(zip(columns, row)) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
