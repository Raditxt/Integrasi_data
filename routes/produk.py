from flask import Blueprint, request, jsonify, current_app

produk_bp = Blueprint('produk', __name__)

@produk_bp.route('/produk', methods=['GET'])
def get_produk():
    mysql = current_app.mysql  # ambil koneksi dari app global

    nama = request.args.get('nama')
    brand = request.args.get('brand')

    query = "SELECT * FROM produk WHERE 1"
    params = []

    if nama:
        query += " AND nama_produk LIKE %s"
        params.append(f"%{nama}%")
    if brand:
        query += " AND brand LIKE %s"
        params.append(f"%{brand}%")

    cur = mysql.connection.cursor()
    cur.execute(query, params)
    rows = cur.fetchall()
    columns = [col[0] for col in cur.description]
    result = [dict(zip(columns, row)) for row in rows]
    return jsonify(result)

@produk_bp.route('/produk', methods=['POST'])
def tambah_produk():
    mysql = current_app.mysql
    data = request.get_json()

    nama_produk = data.get('nama_produk')
    brand = data.get('brand')
    harga = data.get('harga')
    id_sub_kategori = data.get('id_sub_kategori')
    id_supplier = data.get('id_supplier')

    if not all([nama_produk, brand, harga, id_sub_kategori, id_supplier]):
        return jsonify({'status': 'error', 'message': 'Semua field wajib diisi'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO produk (nama_produk, brand, harga, id_sub_kategori, id_supplier)
            VALUES (%s, %s, %s, %s, %s)
        """, (nama_produk, brand, harga, id_sub_kategori, id_supplier))
        mysql.connection.commit()
        return jsonify({'status': 'success', 'message': 'Produk berhasil ditambahkan'}), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
