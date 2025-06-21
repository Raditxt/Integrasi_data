from flask import Blueprint, request, jsonify, current_app

pelanggan_bp = Blueprint('pelanggan', __name__)

@pelanggan_bp.route('/pelanggan/<int:id>', methods=['GET'])
def get_pelanggan(id):
    mysql = current_app.mysql
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM pelanggan WHERE id_pelanggan = %s", (id,))
        row = cur.fetchone()
        if row:
            columns = [col[0] for col in cur.description]
            result = dict(zip(columns, row))
            return jsonify(result)
        else:
            return jsonify({'status': 'error', 'message': 'Pelanggan tidak ditemukan'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@pelanggan_bp.route('/pelanggan', methods=['POST'])
def tambah_pelanggan():
    mysql = current_app.mysql
    data = request.get_json()

    nama = data.get('nama_pelanggan')
    email = data.get('email')
    nomor = data.get('nomor_telepon')
    alamat = data.get('alamat')

    if not all([nama, email, nomor, alamat]):
        return jsonify({'status': 'error', 'message': 'Semua field wajib diisi'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO pelanggan (nama_pelanggan, email, nomor_telepon, alamat)
            VALUES (%s, %s, %s, %s)
        """, (nama, email, nomor, alamat))
        mysql.connection.commit()
        return jsonify({'status': 'success', 'message': 'Pelanggan berhasil ditambahkan'}), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@pelanggan_bp.route('/pelanggan', methods=['GET'])
def semua_pelanggan():
    mysql = current_app.mysql
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM pelanggan")
        rows = cur.fetchall()
        columns = [col[0] for col in cur.description]
        result = [dict(zip(columns, row)) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

