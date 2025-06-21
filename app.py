from flask import Flask, render_template
from flask_cors import CORS
from database import init_mysql, mysql
from routes.produk import produk_bp
from routes.pelanggan import pelanggan_bp
from routes.pesanan import pesanan_bp
from routes.pengiriman import pengiriman_bp
from routes.rating import rating_bp
from routes.supplier import supplier_bp
from routes.karyawan import karyawan_bp
from routes.dashboarad_stats import dashboard_bp

app = Flask(__name__)
CORS(app)

init_mysql(app)
app.mysql = mysql

app.register_blueprint(produk_bp)
app.register_blueprint(pelanggan_bp)
app.register_blueprint(pesanan_bp)
app.register_blueprint(pengiriman_bp)
app.register_blueprint(rating_bp)
app.register_blueprint(supplier_bp)
app.register_blueprint(karyawan_bp)
app.register_blueprint(dashboard_bp)

# ✅ Ini HARUS ditaruh sebelum app.run()

@app.route('/dashboard')
def dashboard():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
