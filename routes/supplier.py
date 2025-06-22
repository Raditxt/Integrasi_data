from flask import Blueprint, request, jsonify, current_app

supplier_bp = Blueprint('supplier', __name__)

# Tambah Supplier
# Tambah Supplier
@supplier_bp.route('/supplier', methods=['POST'])
def tambah_supplier():
    mysql = current_app.mysql
    data = request.get_json()

    nama = data.get('nama_supplier')
    alamat = data.get('alamat')
    kontak = data.get('kontak')

    if not all([nama, alamat, kontak]):
        return jsonify({'status': 'error', 'message': 'Field wajib tidak lengkap'}), 400

    try:
        cur = mysql.connection.cursor()

        # 🔍 Cek duplikat berdasarkan nama dan kontak
        cur.execute("""
            SELECT COUNT(*) FROM supplier
            WHERE nama_supplier = %s AND kontak = %s
        """, (nama, kontak))
        exists = cur.fetchone()[0]

        if exists > 0:
            return jsonify({'status': 'error', 'message': 'Supplier dengan nama dan kontak ini sudah ada'}), 409

        # Lanjut insert jika tidak duplikat
        cur.execute("""
            INSERT INTO supplier (nama_supplier, alamat, kontak)
            VALUES (%s, %s, %s)
        """, (nama, alamat, kontak))
        mysql.connection.commit()
        return jsonify({'status': 'success', 'message': 'Supplier berhasil ditambahkan'}), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Ambil Supplier (filter opsional)
@supplier_bp.route('/supplier', methods=['GET'])
def get_supplier():
    mysql = current_app.mysql
    nama = request.args.get('nama_supplier')

    try:
        cur = mysql.connection.cursor()
        query = "SELECT * FROM supplier WHERE 1"
        params = []
        if nama:
            query += " AND nama_supplier LIKE %s"
            params.append(f"%{nama}%")

        cur.execute(query, params)
        rows = cur.fetchall()
        columns = [col[0] for col in cur.description]
        result = [dict(zip(columns, row)) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
