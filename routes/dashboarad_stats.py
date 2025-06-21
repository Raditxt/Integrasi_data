from flask import Blueprint, jsonify, current_app

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    mysql = current_app.mysql
    try:
        cur = mysql.connection.cursor()
        stats = {}

        queries = {
            "total_products": "SELECT COUNT(*) FROM produk",
            "total_customers": "SELECT COUNT(*) FROM pelanggan",
            "total_orders": "SELECT COUNT(*) FROM pesanan",
            "avg_rating": "SELECT AVG(rating_belanja) FROM rating_pembelanjaan",
            "total_suppliers": "SELECT COUNT(*) FROM supplier",
            "total_employees": "SELECT COUNT(*) FROM karyawan"
        }

        for key, query in queries.items():
            cur.execute(query)
            result = cur.fetchone()[0]
            stats[key] = float(result) if key == "avg_rating" and result else int(result or 0)

        return jsonify(stats)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
