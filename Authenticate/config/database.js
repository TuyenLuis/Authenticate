module.exports = (mysql) => {
    return mysql.createConnection({
        host: "localhost",
        user: "TuyenLuis",
        password: "nicolas_klose",
        database: "accounts"
    })
}