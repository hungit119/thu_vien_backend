const { v4 } = require("uuid");
const { con } = require("../config/db");

class BookController {
  getAllBook(req, res) {
    try {
      const queryGetAllBook = `select * from book;`;
      con.query(queryGetAllBook, (error, rows) => {
        if (error) res.status(400).json({ message: error });
        res.json({
          message: "get all book done",
          result: rows,
        });
      });
    } catch (error) {
      res.status(400).json({
        error,
      });
    }
  }
  getBookById(req, res) {
    try {
      const { id } = req.query;
      const queryGetbookById = `SELECT * from book where id = '${id}' `;
      con.query(queryGetbookById, (error, rows) => {
        if (error) res.status(400).json({ message: error });
        res.json({
          message: "get book by id done",
          result: rows[0],
        });
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  create(req, res) {
    try {
      const {
        title,
        publisher,
        author,
        price,
        size,
        page,
        image,
        description,
      } = req.body;
      if (
        !title ||
        !publisher ||
        !author ||
        !price ||
        !size ||
        !page ||
        !image
      ) {
        res.status(400).json({ message: "Invalid params" });
      }
      const newBook = {
        id: v4(),
        title,
        publisher,
        author,
        price,
        size,
        page,
        image,
        description,
      };
      const queryInsertBook = `
      INSERT INTO book (id,title,publisher,author,price,size,page,image,description) values 
      ('${newBook.id}','${newBook.title}','${newBook.publisher}','${newBook.author}','${newBook.price}','${newBook.size}','${newBook.page}','${newBook.image}','${newBook.description}')`;
      con.query(queryInsertBook, (error) => {
        if (error) res.status(400).json({ messgae: error });
        res.json({
          message: "created new book",
          result: newBook,
        });
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  deleteBook(req, res) {
    try {
      const { id } = req.query;
      const queryDeleteBookById = `DELETE FROM book where id = '${id}'`;
      con.query(queryDeleteBookById, (error) => {
        if (error) res.status(400).json({ message: error });
        res.json({
          message: "deleted book by id" + id,
        });
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  updateBookById(req, res) {
    try {
      const { id } = req.query;
      const { newBook } = req.body;
      // delete book with id
      const queryDeleteBookWithId = `DELETE FROM book where id = '${id}';`;
      con.query(queryDeleteBookWithId, (error) => {
        if (error) res.status(400).json({ message: error });
        // update new book
        const queryCreateNewBook = `INSERT INTO book (id,title,publisher,author,price,size,page,image,description) values 
        ('${id}','${newBook.title}','${newBook.publisher}','${newBook.author}','${newBook.price}','${newBook.size}','${newBook.page}','${newBook.image}','${newBook.description}')
        `;
        con.query(queryCreateNewBook, (error) => {
          if (error) res.status(400).json({ message: error });
          // get created new book
          const queryGetBookById = `SELECT * from book where id = '${id}';`;
          con.query(queryGetBookById, (error, rows) => {
            if (error) res.status(400).json({ message: error });
            res.json({
              message: "updated book with id " + id,
              result: rows[0],
            });
          });
        });
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  // Mượn sách
  borrowBook(req, res) {
    try {
      const { bookId, thuthuId, docGiaId, dueDate } = req.body;
      if (!bookId || !thuthuId || !docGiaId || !dueDate) {
        res.status(400).json({ message: "Invalid Params" });
      }
      // check phieu muon da ton tai chua
      const queryCheckPhieuMuon = `select * from phieumuon where docGiaId = "${docGiaId}" and thuthuId = "${thuthuId}"`;
      con.query(queryCheckPhieuMuon, (error, rows) => {
        if (error) res.status(400).json({ message: "Query failed" });
        if (rows.length === 0) {
          // chua ton tai phieu muon
          const newPhieuMuon = {
            id: v4(),
            docGiaId,
            thuthuId,
          };
          const queryInsertNewPhieuMuon = `insert into phieumuon (id,docGiaId,thuthuId) values ("${newPhieuMuon.id}","${newPhieuMuon.docGiaId}","${newPhieuMuon.thuthuId}")`;
          con.query(queryInsertNewPhieuMuon, (error) => {
            if (error) res.status(400).json({ message: "Query failed" });
            // tao chitietphieumuon
            const chitietPhieuMuon = {
              id: v4(),
              bookId,
              dateStart: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
              dueDate,
            };
            const queryInsertChiTietPhieuMuon = `insert into chitietphieumuon (id,idphieumuon,bookId,dateStart,dueDate) values("${chitietPhieuMuon.id}","${newPhieuMuon.id}","${bookId}","${chitietPhieuMuon.dateStart}","${dueDate}")`;
            con.query(queryInsertChiTietPhieuMuon, (error) => {
              if (error) res.status(400).json({ message: "Query failed" });
              res.json({
                message: "Mượn sách thành công",
              });
            });
          });
        } else {
          // tao chitietphieumuon
          const chitietPhieuMuon = {
            id: v4(),
            bookId,
            dateStart: new Date().toISOString().slice(0, 19).replace("T", " "),
            dueDate,
          };
          const queryInsertChiTietPhieuMuon = `insert into chitietphieumuon (id,idphieumuon,bookId,dateStart,dueDate) values("${chitietPhieuMuon.id}","${rows[0].id}","${bookId}","${chitietPhieuMuon.dateStart}","${dueDate}")`;
          con.query(queryInsertChiTietPhieuMuon, (error) => {
            if (error) res.status(400).json({ message: "Query failed" });
            res.json({
              message: "Mượn sách thành công",
            });
          });
        }
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  borrowBooks(req, res) {
    try {
      const { books, docGiaId, thuthuId } = req.body;
      if (books.length === 0 || !docGiaId || !thuthuId) {
        res.status(400).json({ message: "Invalid params" });
      }
      const newPhieuMuon = {
        id: v4(),
        docGiaId,
        thuthuId,
      };
      const queryCreatePhieuMuon = `insert into phieumuon (id,docgiaId,thuthuId) values ("${newPhieuMuon.id}","${newPhieuMuon.docGiaId}","${newPhieuMuon.thuthuId}")`;

      con.query(queryCreatePhieuMuon, (error) => {
        if (error) res.status(400).json({ message: "Query failed" });
        books.forEach((book) => {
          const queryChitietPhieuMuon = `insert into chitietphieumuon (id,idphieumuon,bookId,dateStart,dueDate) values ("${v4()}","${
            newPhieuMuon.id
          }","${book.id}","${new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")}","${book.dueDate}")`;
          con.query(queryChitietPhieuMuon, (error) => {
            if (error) res.status(400).json({ message: "Query failed" });
            console.log("Success");
          });
        });
        res.json({ message: "Mượn sách thành công" });
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  getBorrowBook(req, res) {
    try {
      const { id, thuthuId } = req.query;
      if (!id) {
        res.status(400).json({
          message: "InValid Params",
        });
      }
      const query = `select chitietphieumuon.id as chitietphieumuonid,user.username,book.title,book.author,book.id,chitietphieumuon.dateStart,chitietphieumuon.dueDate,phieumuon.thuthuId from phieumuon inner join chitietphieumuon on phieumuon.id = chitietphieumuon.idphieumuon
       inner join book on chitietphieumuon.bookId = book.id inner join user on phieumuon.docgiaId = user.id where phieumuon.docgiaId = "${id}" ${
        thuthuId ? `and phieumuon.thuthuId = "${thuthuId}"` : ""
      }`;
      con.query(query, (error, rows) => {
        if (error) res.status(400).json({ message: "Query failed" });
        res.json({
          success: true,
          message: "Borrows book",
          result: rows,
        });
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  returnBook(req, res) {
    try {
      const {
        bookId,
        statusBook,
        fines,
        docGiaId,
        thuthuId,
        chitietphieumuonid,
      } = req.body;
      // check phieu tra da ton tai chua
      const queryCheckPhieuTra = `select * from phieutra where docgiaId = '${docGiaId}' and thuthuId = '${thuthuId}';`;
      con.query(queryCheckPhieuTra, (error, rows) => {
        if (error) res.status(400).json({ error });
        if (rows.length === 0) {
          // chua ton tai phieu tra
          const newPhieuTra = {
            id: v4(),
            docGiaId,
            thuthuId,
          };
          const queryInsertNewPhieuTra = `insert into phieutra (id,docgiaId,thuthuId) values ("${newPhieuTra.id}","${newPhieuTra.docGiaId}","${newPhieuTra.thuthuId}")`;
          con.query(queryInsertNewPhieuTra, (error) => {
            if (error) res.status(400).json({ error });
            // tao chitietphieutra
            const chitietPhieuTra = {
              id: v4(),
              bookId,
              returnDate: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
              statusBook,
              fines,
            };
            const queryInsertChiTietPhieuTra = `insert into chitietphieutra 
            (id,idphieutra,bookId,statusBook,returnDate,fines) 
            values("${chitietPhieuTra.id}","${newPhieuTra.id}","${bookId}","${statusBook}","${chitietPhieuTra.returnDate}","${chitietPhieuTra.fines}")`;
            con.query(queryInsertChiTietPhieuTra, (error) => {
              if (error) res.status(400).json({ message: error });
              con.query(
                `DELETE FROM chitietphieumuon WHERE id = '${chitietphieumuonid}';`,
                (error) => {
                  if (error) res.status(400).json({ error });
                }
              );
              res.json({
                message: "Trả sách thành công",
              });
            });
          });
        } else {
          // tao chitietphieutra
          const chitietPhieuTra = {
            id: v4(),
            bookId,
            returnDate: new Date().toISOString().slice(0, 19).replace("T", " "),
            statusBook,
            fines,
          };
          const queryInsertChiTietPhieuTra = `insert into chitietphieutra (id,idphieutra,bookId,statusBook,returnDate,fines) values('${chitietPhieuTra.id}','${rows[0].id}','${bookId}','${statusBook}','${chitietPhieuTra.returnDate}','${chitietPhieuTra.fines}')`;
          con.query(queryInsertChiTietPhieuTra, (error) => {
            if (error) res.status(400).json({ message: error });
            con.query(
              `DELETE FROM chitietphieumuon WHERE id = '${chitietphieumuonid}';`,
              (error) => {
                if (error) res.status(400).json({ error });
              }
            );
            res.json({
              message: "Trả sách thành công",
            });
          });
        }
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  searchBookByTitle(req, res) {
    try {
      const { keyword } = req.body;
      const query = `select * from book where book.title like '%${keyword}%'`;
      con.query(query, (error, rows) => {
        if (error) res.status(400).json({ error });
        res.json({
          success: true,
          message: "search by book title",
          result: rows,
        });
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
module.exports = new BookController();
