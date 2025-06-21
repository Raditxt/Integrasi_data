from flask import Blueprint, request, jsonify, current_app

karyawan_bp = Blueprint('karyawan', __name__)

# Tambah karyawan
@karyawan_bp.route('/karyawan', methods=['POST'])
def tambah_karyawan():
    mysql = current_app.mysql
    data = request.get_json()

    nama = data.get('nama_karyawan')
    jabatan = data.get('jabatan')
    nomor = data.get('nomor_telepon')

    if not all([nama, jabatan, nomor]):
        return jsonify({'status': 'error', 'message': 'Semua field wajib diisi'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO karyawan (nama_karyawan, jabatan, nomor_telepon)
            VALUES (%s, %s, %s)
        """, (nama, jabatan, nomor))
        mysql.connection.commit()
        return jsonify({'status': 'success', 'message': 'Karyawan berhasil ditambahkan'}), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Ambil semua karyawan
@karyawan_bp.route('/karyawan', methods=['GET'])
def get_karyawan():
    mysql = current_app.mysql
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM karyawan ORDER BY id_karyawan DESC")
        rows = cur.fetchall()
        columns = [col[0] for col in cur.description]
        result = [dict(zip(columns, row)) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
