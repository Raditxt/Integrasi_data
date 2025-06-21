from flask_mysqldb import MySQL

mysql = MySQL()

def init_mysql(app):
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'              # Default XAMPP user
    app.config['MYSQL_PASSWORD'] = ''              # Kosongkan jika belum diatur password root
    app.config['MYSQL_DB'] = 'toko_komputer'       # Pastikan database ini ada di phpMyAdmin
    mysql.init_app(app)
    return mysql
