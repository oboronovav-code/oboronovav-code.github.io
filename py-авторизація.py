import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_NAME = 'database1.db'

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        # Перевіряємо тільки логін та пароль
        # Якщо запис знайдено — значить це адмін
        query = "SELECT * FROM database1 WHERE username = ? AND password_hash = ?"
        cursor.execute(query, (username, password))
        user = cursor.fetchone()
        conn.close()

        if user:
            return jsonify({
                "success": True, 
                "token": "admin-access-granted" # Будь-яка мітка успіху
            })
        else:
            return jsonify({"success": False, "message": "Доступ заборонено: невірні дані"}), 401
            
    except Exception as e:
        return jsonify({"success": False, "message": "Помилка БД: " + str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
