const express = require('express');
const router = express.Router();
const dbConnection = require('../database/db');
const flash = require('express-flash');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer')
const path = require('path');

function isNotLogin(req, res, next) { //check session 
  if (!req.session.isLoggedIn) {
    return res.render('FormLogin');
  }
  next();
}




/* GET home page. */
router.get('/', function (req, res, next) {
  

  dbConnection.query('SELECT logo FROM logo ', (err, rowslogo) => {
    if (err) {
      req.flash('error', "1");
      res.red('index', { data: '',visitCount: '', logo:'' ,banner:''});
    } else {
      dbConnection.query('SELECT banner FROM banner ', (err, rowsbanner) => {
        if (err) {
          req.flash('error',  "2");
          res.render('index', { data: '',visitCount: '', logo:'' ,banner:''});
        } else {
          dbConnection.query('SELECT * FROM promotion WHERE status="Order" ORDER BY id_pro ASC ', (err, rowspromotion) => {
            if (err) {
              req.flash('error',  "3");
              res.render('index', { data: '',visitCount: '', logo:'' ,banner:'' });
            } else {
        
              // เพิ่มข้อมูลการเยี่ยมชมเว็บไซต์ลงในฐานข้อมูล MySQL
              const insertQuery = 'INSERT INTO historyviews (timestamp_towebsite) VALUES (CURRENT_TIMESTAMP)';
              dbConnection.query(insertQuery, (err, result) => {
                if (err) {
                  console.log('ไม่สามารถบันทึกลงฐานข้อมูลได้');
                  res.render('index', { data: '',visitCount: '', logo:'' ,banner:'' });
                } else {
                  // ดึงจำนวนการเยี่ยมชมเว็บไซต์จากฐานข้อมูลและส่งไปแสดงในหน้า EJS
                  const selectQuery = 'SELECT COUNT(*) AS visitCount FROM historyviews';
                  dbConnection.query(selectQuery, (err, rows) => {
                    if (err) throw  "4";
                    res.render('index', { visitCount: rows[0].visitCount, data: rowspromotion, logo:rowslogo,banner:rowsbanner });
                  });
                }
              });
            }
          })
        }
      });
    }
  });
});

//listcoupont
router.get('/coupon-list', function (req, res, next) {
  dbConnection.query('SELECT * FROM promotion WHERE status="Order" ORDER BY boost DESC , id_pro DESC', (err, rowspromotion) => {
    if (err) {
      req.flash('error', err);
      // res.render('index', { data: '',dataCoupon:'',totalcoupon:'',pro_name:'',id_pro:''});
      res.redirect('/');
    } else {
      dbConnection.query('SELECT * FROM promotion WHERE boost!=0', (err, rowspromotionboost) => {
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          console.log("Promotion ที่มีการ boost",rowspromotionboost.length);
          for (let n = 0; n < rowspromotionboost.length; n++) {
          
            dbConnection.query("SELECT * FROM boostpromote WHERE boost_id_pro = ?",[rowspromotionboost[n].id_pro],
              (err, boost) => {
                if (err) {
                  req.flash('error', "โปรดตรวจสอบวันที่ต้องการโปรโมท");
                  console.log("ERROR ตรวจสอบวัน boost"+ err);
                }
                if (boost && boost[n] && boost[n].boost_end) {
                  console.log("boost end ",boost[n]);
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n].);
                  if (sum <= 0) {
                    //ยังไม่หมดเวลา
                    console.log(boost[n].boost_id_pro +" :"+ sum+": ยังไม่หมดเวลา");
                  }else{
                    //หมดเวลาแล้ว
                    console.log(boost[n].boost_id_pro +" :"+ sum+": หมดเวลา");
                    let form_data = {
                      boost: 0,
                    };
                    dbConnection.query("UPDATE promotion SET ? WHERE id_pro = ?",[form_data,boost[n].boost_id_pro], (err, result) => {
                      if (err) {
                        console.log(": อัพเดท status ใน promotion ไม่ได้");
                      } else {
                        console.log(": ปรับ boost promotion แล้ว");
                      }
                    });
                  }
                } else {
                  console.log("ไม่พบคุณสมบัติ boost_end หรือข้อมูล boost ในระบบ");
                } 
              });
          }
        }
      });

     
      const currentPage = req.query.page || 1; // หากไม่ได้รับค่าหน้ามาให้เป็นหน้าที่ 1
      const perPage = 6; // จำนวนข้อมูลต่อหน้า
      const offset = (currentPage - 1) * perPage;
      const sql =`SELECT * FROM coupon WHERE status="Order" ORDER BY cu_id ASC LIMIT ${perPage}  OFFSET ${offset}`;
      
      dbConnection.query(sql, (err, rowscoupon) => {
        if (err) {
          req.flash('message', 'กลับสู่หน้าหลัก');
          res.redirect('/');
        } else {
          dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order"', (err,total ) => {
            if (err) {
              req.flash('message', 'กลับสู่หน้าหลัก');
              res.redirect('/');
            } else {
              let totalcoupon = total[0].total;
              res.render('coupon-list',{data:rowspromotion,dataCoupon:rowscoupon,totalcoupon:totalcoupon,currentPage:currentPage,perPage:perPage});
            }
          });
        }
      });

     




    }
  });
  

});

// Detail Pormotion **แก้หลังมีpdf**
router.get('/DetailShop/(:id_pro)', (req, res, next) => {
  const idpro = req.params.id_pro;
  console.log("id Promotion : ",idpro);
  dbConnection.query("SELECT * FROM promotion WHERE id_pro =?",[idpro], (err, rowsPromotion) => {
    if (err) {
      console.log(err);
      req.flash("error", err);
      return res.render('shop-details', {
        namePromotion: '',
        picPromotion: '',
        idPromotion: '',
        pricePromotion: '',
        dayStart: '',
        dayEnd: '',
        timeStart: '',
        timeEnd: '',
        dataCoupon: '',
        address: ''
      });
    }

    if (!rowsPromotion || rowsPromotion.length === 0) {
      // Handle the case where no promotion is found
      return res.render('shop-details', {
        namePromotion: '',
        picPromotion: '',
        idPromotion: '',
        pricePromotion: '',
        dayStart: '',
        dayEnd: '',
        timeStart: '',
        timeEnd: '',
        dataCoupon: '',
        address: ''
      });
    }

    let idres = rowsPromotion[0].id_restb;
    console.log("id Resturant",idres);

    dbConnection.query("SELECT * FROM restaurants WHERE id_res = ?" ,[idres], (err, rowsResturant) => {
      if (err) {
        console.log(err);
        req.flash("error", err);
        return res.render('shop-details', {
          namePromotion: '',
          picPromotion: '',
          idPromotion: '',
          pricePromotion: '',
          dayStart: '',
          dayEnd: '',
          timeStart: '',
          timeEnd: '',
          dataCoupon: '',
          address: ''
        });
      }

      let address = rowsResturant[0] ? rowsResturant[0].res_address : '';
      console.log("address : ",address);
      dbConnection.query("SELECT * FROM coupon WHERE status = 'Order' AND id_pro_coupon = ?",[idpro], (err, rowsCoupon) => {
        if (err) {
          console.log(err);
          req.flash("error", err);
          return res.render('shop-details', {
            namePromotion: '',
            picPromotion: '',
            idPromotion: '',
            pricePromotion: '',
            dayStart: '',
            dayEnd: '',
            timeStart: '',
            timeEnd: '',
            dataCoupon: '',
            address: ''
          });
        }else{
          res.render('shop-details', {
            namePromotion: rowsPromotion[0].pro_name,
            picPromotion: rowsPromotion[0].pro_image,
            idPromotion: rowsPromotion[0].id_pro,
            pricePromotion: rowsPromotion[0].pro_price,
            dayStart: rowsPromotion[0].date_start,
            dayEnd: rowsPromotion[0].date_end,
            timeStart: rowsPromotion[0].time_start,
            timeEnd: rowsPromotion[0].time_end,
            dataCoupon: rowsCoupon,
            address: address
          });
        }

        
      });
    });
  });
});




//display Form Register
router.get('/FormRegister', function (req, res, next) {

  res.render('FormRegister');
});





/* Post Register listing. */
router.post('/Register', (req, res, next) => {

  //ที่ดึงมาจากไฟล์ formRegister
  let Name = req.body.name;
  let Lname = req.body.lastname;
  let Email = req.body.email;
  let username = req.body.username;
  let PassWord = req.body.psw;
  let Confirmpassword = req.body.confpsw;
  let phonetel = req.body.phonenumber;
  let checkpermise = req.body.tou;
  let Level = 'U';
  let message = false;
  let id_restb = 0;
  let point = 0;
  console.log(username, Name, Lname, Email, PassWord, Confirmpassword,);
  //check email is use
  dbConnection.query('SELECT username FROM user WHERE username = ? ', [username], (error, results) => {
    if (error) {
      error = true;
      req.flash('error', error);
    } else if (results.length > 0) { // email in database 
      message = true;
      req.flash('message', 'มีรหัสผู้ใช้นี้ในฐานข้อมูลแล้ว');
      res.render('FormRegister');

    } else if (PassWord !== Confirmpassword) {  //check password != confirm password
      message = true;
      req.flash('message', 'พาสเวิร์ดไม่ตรงกัน');
      res.render('FormRegister');
    } else {
      dbConnection.query('SELECT MAX(id_user) AS max_id FROM user', (error, results, fields) => { // หาเลข max id_user ที่มากที่สุดเพื่อเพิ่มค่าให้อีกที
        let currentId = results[0].max_id // 
        let newId = currentId + 1;

        bcrypt.hash(PassWord, 12, function (error, hash) {
          let form_data = { // ข้อมูลที่เอาเข้า DB 
            id_user: newId,
            username: username,
            password: hash,
            email: Email,
            phone: phonetel,
            fname: Name,
            lname: Lname,
            level: Level,
            Profile: 'NULL',
            address:'NULL',
            status: 'success',
            user_point: point,
            id_restb: id_restb
          }

          dbConnection.query('INSERT INTO user SET ?', [form_data], (error, results) => {
            if (error) {
              req.flash('error', "สมัครไม่สำเร็จ");
              res.render('FormRegister');
            } else {
              req.flash('success', 'สมัครสมาชิกสำเร็จ ');
              res.redirect('/');
            }
          });
        });
      })
    }
  });
});


//display Form Login
router.get('/FormLogin', function (req, res, next) {

  res.render('FormLogin');
});

/* Post login listing. */
router.post('/Login', (req, res, next) => {
  let username = req.body.username;
  let PassWord = req.body.psw;
  let message = false;
  dbConnection.query('SELECT * FROM user WHERE username = ? ', [username], async (error, results) => {
    if (error) {
      req.flash('error', error);
      res.render('FormLogin');
      console.log(error);
    } else if (results.length === 0) {// check ไม่มีค่าให้แสดง
      message = true;
      req.flash('message', 'รหัสผู้ใช้หรือพาสเวิร์ดนี้ไม่ถูกต้อง');
      res.render('FormLogin');
      console.log(error);
    } else if (results.length === 1) {
      // แบบรหัส hash 
      let compare_hash = await bcrypt.compare(PassWord, results[0].password)
      if (compare_hash) {
        req.session.isLoggedIn = true;
        req.session.id_user = results[0].id_user; // session id_user
        req.session.id_res = results[0].id_restb; //session id_res
        req.session.status = results[0].status; // session status resturant

        let point = req.session.point = results[0].user_point;
        let role = req.session.level = results[0].level;// sent&check  session level
        req.session.profile = results[0].Profile // sent&check  session Profile img
        req.session.fname = results[0].fname; // sent&check  session  name
        req.session.lname = results[0].lname; // sent&check  session  lname
        req.session.email = results[0].email;
        if (role === 'A') {
          let status = "success";
          dbConnection.query('SELECT * FROM restaurants WHERE status = ? ORDER BY res_id ASC', [status], (err, rows) => {
            let data = rows;
            if (err) {
              req.flash('error', err);
              res.render('adminn', { data: '', img: req.session.profile, name: req.session.fname });
            } else {

              dbConnection.query('SELECT * FROM restaurants WHERE status = ? ORDER BY res_id DESC', [status], (err, result) => {
                if (err) {
                  req.flash('error', err);
                  res.render('adminn', { dataNew: '', img: req.session.profile, name: req.session.fname });
                } else {
                  res.render('adminn', { dataNew: result, img: req.session.profile, name: req.session.fname, data });
                }
              })
            }
          })


        } else if (role === 'U') {
          dbConnection.query('SELECT * FROM promotion WHERE status="Order" ORDER BY id_pro ASC ', (err, rows, fields) => {

            if (err) {
              console.log(err);
            } else if (rows.length <= 0) {
              res.render('User', {
                data: '', name: req.session.fname,
                role: role,
                img: req.session.profile,
                point:point,
                promotion: req.session.promotion || {}
              });
            } else {
              res.render('User', {
                name: req.session.fname,
                role: role,
                img: req.session.profile,
                point:point,
                promotion: req.session.promotion || {},
                data: rows
              })
            }
          });
        } else if (role === 'R') {
          let id = req.session.id_res;
          
          let idUsertb = req.session.id_user;
          let idUser = req.session.id_user;
          let query=`SELECT cu.coupon_id, cu.datebook, cu.timebook,cu.status, u.fname, u.lname,u.Profile,u.phone,pro.id_restb, cp.cu_id,cp.id_pro_coupon, cp.name_pro_coupon,cp.cu_code
          FROM coupon_user cu 
          INNER JOIN coupon cp ON cu.coupon_id = cp.cu_id 
          INNER JOIN user u ON cu.user_id = u.id_user 
          INNER JOIN promotion pro ON cp.id_pro_coupon = pro.id_pro 
          WHERE cu.status='Book' AND pro.id_restb=?
          ORDER BY cu.id DESC`;
          let querytime=`SELECT cu.coupon_id, cu.datebook, cu.timebook,cu.status, u.fname, u.lname,u.Profile,u.phone,pro.id_restb, cp.cu_id,cp.id_pro_coupon, cp.name_pro_coupon,cp.cu_code
          FROM coupon_user cu 
          INNER JOIN coupon cp ON cu.coupon_id = cp.cu_id 
          INNER JOIN user u ON cu.user_id = u.id_user 
          INNER JOIN promotion pro ON cp.id_pro_coupon = pro.id_pro 
          WHERE cu.status='Book' AND pro.id_restb=?
          ORDER BY cu.datebook ASC`;



          dbConnection.query(querytime,[id], (err, rowtime, fields) => {
            dbConnection.query(query,[id], (err, rows, fields) => {
              if (err) {
                console.log(err);
              } else if (rows.length <= 0) {
                dbConnection.query('SELECT * FROM restaurants WHERE id_usertb= ?',[idUsertb], (error, rowRes) => {
                  req.session.nameResturant = rowRes[0].res_name;
                  req.session.profileResturant = rowRes[0].res_profile;
                  req.session.emailResturant =rowRes[0].res_email;
                  if (error) {
                    req.flash('error', error);
                  } else {
                    errors = true;
                    res.render('Resturant', {
                      data: rows,
                      datatime:rowtime,
                      name: req.session.nameResturant,
                      role: role,
                      img: req.session.profileResturant,
                      point:point
                    });
                  }
                })
              } else {
                dbConnection.query('SELECT * FROM restaurants WHERE id_usertb= ?',[idUser], (error, rowRes) => {
                  req.session.emailResturant =rowRes[0].res_email;
                  req.session.nameResturant = rowRes[0].res_name;
                  req.session.profileResturant = rowRes[0].res_profile;
                  if (error) {
                    req.flash('error', error);
                  } else {
                    errors = true;
                    res.render('Resturant', {
                      data: rows,
                      datatime:rowtime,
                      name: req.session.nameResturant,
                      role: role,
                      point:point,
                      img: req.session.profileResturant
                    });
                  }
                })
              }
            });
          });
         
        } else (
          res.send('NO Status')
        )
        console.log('Connect Success !');


      } else {
        console.log(error);
        req.flash('error', error);
        res.render('FormLogin');
      }

    } else {
      req.session.isLoggedIn = false;
      res.redirect('/FormLogin?error=1');
    }
  });

});


// Define a route that renders an EJS template
router.get('/contact', (req, res) => {
  const address = {address: 'เชียงใหม่ ,ประเทศไทย'};
  const email = {email: 'test@gmail.com'};
  const tel = {tel: '0897878787'};
    

  res.render('contact', {
    address,
    email,
    tel,
    name: req.session.fname,
    img: req.session.profile,
  });
});




//*--------------------------------------------------------------- list link coupon ---------------------------------------------------------*//

//น้อยกว่า 200
router.get('/pointtwo', function (req, res, next) {
  dbConnection.query('SELECT * FROM promotion WHERE status="Order" AND pro_price <= 200 ORDER BY boost DESC  ', (err, rowspromotion) => {
    if (err) {
      req.flash('error', err);
      // res.render('index', { data: '',dataCoupon:'',totalcoupon:'',pro_name:'',id_pro:''});
      res.redirect('/');
    } else {
      dbConnection.query('SELECT * FROM promotion WHERE boost!=0', (err, rowspromotionboost) => {
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          console.log("Promotion ที่มีการ boost",rowspromotionboost.length);
          for (let n = 0; n < rowspromotionboost.length; n++) {
            dbConnection.query("SELECT * FROM boostpromote WHERE boost_id_pro = ? ",[rowspromotionboost[n].id_pro],
              (err, boost) => {
                if (err) {
                  console.log("ERROR ตรวจสอบวัน boost"+ err);
                } 
                if (boost && boost[n] && boost[n].boost_end) {
                  console.log("boost end ",boost[n]);
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n].);
                  if (sum <= 0) {
                    //ยังไม่หมดเวลา
                    console.log(boost[n].boost_id_pro +" :"+ sum+": ยังไม่หมดเวลา");
                  }else{
                    //หมดเวลาแล้ว
                    console.log(boost[n].boost_id_pro +" :"+ sum+": หมดเวลา");
                    let form_data = {
                      boost: 0,
                    };
                    dbConnection.query("UPDATE promotion SET ? WHERE id_pro = ?",[form_data,boost[n].boost_id_pro], (err, result) => {
                      if (err) {
                        console.log(": อัพเดท status ใน promotion ไม่ได้");
                      } else {
                        console.log(": ปรับ boost promotion แล้ว");
                      }
                    });
                  }
                } else {
                  console.log("ไม่พบคุณสมบัติ boost_end หรือข้อมูล boost ในระบบ");
                } 
              });
          }
        }
      });

      const currentPage = req.query.page || 1; // หากไม่ได้รับค่าหน้ามาให้เป็นหน้าที่ 1
      const perPage = 6; // จำนวนข้อมูลต่อหน้า
      const offset = (currentPage - 1) * perPage;
      const sql =`SELECT * FROM coupon WHERE status="Order" AND price_pro <= 200  ORDER BY cu_id ASC  LIMIT ${perPage}  OFFSET ${offset}`;


      dbConnection.query(sql, (err,  rowscoupon) => {
        
        if (err) {
          req.flash('message', 'กลับสู่หน้าหลัก');
          res.redirect('/');
        } else {
          dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND price_pro <= 200 ', (err,total ) => {
            let totalcoupon = total[0].total;
            if (err) {
              req.flash('message', 'กลับสู่หน้าหลัก');
              res.redirect('/');
            } else {
              res.render('pointtwo',{data:rowspromotion,dataCoupon:rowscoupon,totalcoupon:totalcoupon,currentPage:currentPage,perPage:perPage});
            }
          });
        }
      });
    }
  });
});




//น้อยกว่า 500
router.get('/pointfive', function (req, res, next) {
  dbConnection.query('SELECT * FROM promotion WHERE status="Order" AND pro_price <= 500 ORDER BY boost DESC  ', (err, rowspromotion) => {
    if (err) {
      req.flash('error', err);
      // res.render('index', { data: '',dataCoupon:'',totalcoupon:'',pro_name:'',id_pro:''});
      res.redirect('/');
    } else {
      dbConnection.query('SELECT * FROM promotion WHERE boost!=0', (err, rowspromotionboost) => {
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          console.log("Promotion ที่มีการ boost",rowspromotionboost.length);
          for (let n = 0; n < rowspromotionboost.length; n++) {
            dbConnection.query("SELECT * FROM boostpromote WHERE boost_id_pro = ? ",[rowspromotionboost[n].id_pro],
              (err, boost) => {
                if (err) {
                  console.log("ERROR ตรวจสอบวัน boost"+ err);
                } 
                if (boost && boost[n] && boost[n].boost_end) {
                  console.log("boost end ",boost[n]);
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n].);
                  if (sum <= 0) {
                    //ยังไม่หมดเวลา
                    console.log(boost[n].boost_id_pro +" :"+ sum+": ยังไม่หมดเวลา");
                  }else{
                    //หมดเวลาแล้ว
                    console.log(boost[n].boost_id_pro +" :"+ sum+": หมดเวลา");
                    let form_data = {
                      boost: 0,
                    };
                    dbConnection.query("UPDATE promotion SET ? WHERE id_pro = ?",[form_data,boost[n].boost_id_pro], (err, result) => {
                      if (err) {
                        console.log(": อัพเดท status ใน promotion ไม่ได้");
                      } else {
                        console.log(": ปรับ boost promotion แล้ว");
                      }
                    });
                  }
                } else {
                  console.log("ไม่พบคุณสมบัติ boost_end หรือข้อมูล boost ในระบบ");
                } 
              });
          }
        }
      });

     
      const currentPage = req.query.page || 1; // หากไม่ได้รับค่าหน้ามาให้เป็นหน้าที่ 1
      const perPage = 6; // จำนวนข้อมูลต่อหน้า
      const offset = (currentPage - 1) * perPage;
      const sql =`SELECT * FROM coupon WHERE status="Order" AND price_pro <= 500  ORDER BY cu_id ASC LIMIT ${perPage}  OFFSET ${offset}`;

      dbConnection.query(sql, (err,  rowscoupon) => {
        if (err) {
          req.flash('message', 'กลับสู่หน้าหลัก');
          res.redirect('/');
        } else {
          dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND price_pro <= 500 ', (err,total) => {
            let totalcoupon = total[0].total;
            if (err) {
              req.flash('message', 'กลับสู่หน้าหลัก');
              res.redirect('/');
            } else {
              res.render('pointfive',{data:rowspromotion,dataCoupon:rowscoupon,totalcoupon:totalcoupon,currentPage:currentPage,perPage:perPage});
            }
          });
        }
      });
    }
  });
});



//น้อยกว่า 1000
router.get('/pointone', function (req, res, next) {
  dbConnection.query('SELECT * FROM promotion WHERE status="Order" AND pro_price <= 1000 ORDER BY boost DESC  ', (err, rowspromotion) => {
    if (err) {
      req.flash('error', err);
      // res.render('index', { data: '',dataCoupon:'',totalcoupon:'',pro_name:'',id_pro:''});
      res.redirect('/');
    } else {
      dbConnection.query('SELECT * FROM promotion WHERE boost!=0', (err, rowspromotionboost) => {
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          console.log("Promotion ที่มีการ boost",rowspromotionboost.length);
          for (let n = 0; n < rowspromotionboost.length; n++) {
            dbConnection.query("SELECT * FROM boostpromote WHERE boost_id_pro = ? ",[rowspromotionboost[n].id_pro],
              (err, boost) => {
                if (err) {
                  console.log("ERROR ตรวจสอบวัน boost"+ err);
                }
                if (boost && boost[n] && boost[n].boost_end) {
                  console.log("boost end ",boost[n]);
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n].);
                  if (sum <= 0) {
                    //ยังไม่หมดเวลา
                    console.log(boost[n].boost_id_pro +" :"+ sum+": ยังไม่หมดเวลา");
                  }else{
                    //หมดเวลาแล้ว
                    console.log(boost[n].boost_id_pro +" :"+ sum+": หมดเวลา");
                    let form_data = {
                      boost: 0,
                    };
                    dbConnection.query("UPDATE promotion SET ? WHERE id_pro = ?",[form_data,boost[n].boost_id_pro], (err, result) => {
                      if (err) {
                        console.log(": อัพเดท status ใน promotion ไม่ได้");
                      } else {
                        console.log(": ปรับ boost promotion แล้ว");
                      }
                    });
                  }
                } else {
                  console.log("ไม่พบคุณสมบัติ boost_end หรือข้อมูล boost ในระบบ");
                } 
              });
          }
        }
      });

      const currentPage = req.query.page || 1; // หากไม่ได้รับค่าหน้ามาให้เป็นหน้าที่ 1
      const perPage = 6; // จำนวนข้อมูลต่อหน้า
      const offset = (currentPage - 1) * perPage;
      const sql =`SELECT * FROM coupon WHERE status="Order" AND price_pro <= 1000  ORDER BY cu_id ASC LIMIT ${perPage}  OFFSET ${offset}`;


      dbConnection.query(sql, (err,  rowscoupon) => {
        if (err) {
          req.flash('message', 'กลับสู่หน้าหลัก');
          res.redirect('/');
        } else {
          dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND price_pro <= 1000 ', (err,total) => {
            let totalcoupon = total[0].total;
            if (err) {
              req.flash('message', 'กลับสู่หน้าหลัก');
              res.redirect('/');
            } else {
              res.render('pointone',{data:rowspromotion,dataCoupon:rowscoupon,totalcoupon:totalcoupon,currentPage:currentPage,perPage:perPage});
            }
          });
        }
      });
    }
  });
});
/*------------------------------------ประเภทส่วนลดพิเศษ----------------------------------*/
router.get('/cat_discount', function (req, res, next) {
  dbConnection.query('SELECT * FROM promotion WHERE status="Order" AND pro_type="โปรโมชั่นส่วนลดพิเศษ" ORDER BY boost DESC  ', (err, rowspromotion) => {
    if (err) {
      req.flash('error', err);
      // res.render('index', { data: '',dataCoupon:'',totalcoupon:'',pro_name:'',id_pro:''});
      res.redirect('/');
    } else {
      dbConnection.query('SELECT * FROM promotion WHERE boost!=0', (err, rowspromotionboost) => {
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          console.log("Promotion ที่มีการ boost",rowspromotionboost.length);
          for (let n = 0; n < rowspromotionboost.length; n++) {
            dbConnection.query("SELECT * FROM boostpromote WHERE boost_id_pro = ? ",[rowspromotionboost[n].id_pro],
              (err, boost) => {
                if (err) {
                  console.log("ERROR ตรวจสอบวัน boost"+ err);
                }
                if (boost && boost[n] && boost[n].boost_end) {
                  console.log("boost end ",boost[n]);
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n].);
                  if (sum <= 0) {
                    //ยังไม่หมดเวลา
                    console.log(boost[n].boost_id_pro +" :"+ sum+": ยังไม่หมดเวลา");
                  }else{
                    //หมดเวลาแล้ว
                    console.log(boost[n].boost_id_pro +" :"+ sum+": หมดเวลา");
                    let form_data = {
                      boost: 0,
                    };
                    dbConnection.query("UPDATE promotion SET ? WHERE id_pro = ?",[form_data,boost[n].boost_id_pro], (err, result) => {
                      if (err) {
                        console.log(": อัพเดท status ใน promotion ไม่ได้");
                      } else {
                        console.log(": ปรับ boost promotion แล้ว");
                      }
                    });
                  }
                } else {
                  console.log("ไม่พบคุณสมบัติ boost_end หรือข้อมูล boost ในระบบ");
                } 
              });
          }
        }
      });

     
      const currentPage = req.query.page || 1; // หากไม่ได้รับค่าหน้ามาให้เป็นหน้าที่ 1
      const perPage = 6; // จำนวนข้อมูลต่อหน้า
      const offset = (currentPage - 1) * perPage;
      const sql =`SELECT * FROM coupon WHERE status="Order" AND type_pro_coupon="โปรโมชั่นส่วนลดพิเศษ"  ORDER BY cu_id ASC   LIMIT ${perPage}  OFFSET ${offset}`;


      dbConnection.query(sql, (err, rowscoupon ) => {
        
        if (err) {
          req.flash('message', 'กลับสู่หน้าหลัก');
          res.redirect('/');
        } else {
          dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND type_pro_coupon="โปรโมชั่นส่วนลดพิเศษ" ', (err, total) => {
            let totalcoupon = total[0].total;
            if (err) {
              req.flash('message', 'กลับสู่หน้าหลัก');
              res.redirect('/');
            } else {
              res.render('cat_discount',{data:rowspromotion,dataCoupon:rowscoupon,totalcoupon:totalcoupon,currentPage:currentPage,perPage:perPage});
            }
          });
        }
      });
    }
  });
});
/*------------------------------------ประเภทราคาพิเศษ----------------------------------*/
router.get('/cat_specialprice', function (req, res, next) {
  dbConnection.query('SELECT * FROM promotion WHERE status="Order" AND pro_type="ประเภทราคาพิเศษ" ORDER BY boost DESC  ', (err, rowspromotion) => {
    if (err) {
      req.flash('error', err);
      // res.render('index', { data: '',dataCoupon:'',totalcoupon:'',pro_name:'',id_pro:''});
      res.redirect('/');
    } else {
      dbConnection.query('SELECT * FROM promotion WHERE boost!=0', (err, rowspromotionboost) => {
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          console.log("Promotion ที่มีการ boost",rowspromotionboost.length);
          for (let n = 0; n < rowspromotionboost.length; n++) {
            dbConnection.query("SELECT * FROM boostpromote WHERE boost_id_pro = ? ",[rowspromotionboost[n].id_pro],
              (err, boost) => {
                if (err) {
                  console.log("ERROR ตรวจสอบวัน boost"+ err);
                } 
                if (boost && boost[n] && boost[n].boost_end) {
                  console.log("boost end ",boost[n]);
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n].);
                  if (sum <= 0) {
                    //ยังไม่หมดเวลา
                    console.log(boost[n].boost_id_pro +" :"+ sum+": ยังไม่หมดเวลา");
                  }else{
                    //หมดเวลาแล้ว
                    console.log(boost[n].boost_id_pro +" :"+ sum+": หมดเวลา");
                    let form_data = {
                      boost: 0,
                    };
                    dbConnection.query("UPDATE promotion SET ? WHERE id_pro = ?",[form_data,boost[n].boost_id_pro], (err, result) => {
                      if (err) {
                        console.log(": อัพเดท status ใน promotion ไม่ได้");
                      } else {
                        console.log(": ปรับ boost promotion แล้ว");
                      }
                    });
                  }
                } else {
                  console.log("ไม่พบคุณสมบัติ boost_end หรือข้อมูล boost ในระบบ");
                } 
              });
          }
        }
      });

      const currentPage = req.query.page || 1; // หากไม่ได้รับค่าหน้ามาให้เป็นหน้าที่ 1
      const perPage = 6; // จำนวนข้อมูลต่อหน้า
      const offset = (currentPage - 1) * perPage;
      const sql =`SELECT * FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภทราคาพิเศษ"  ORDER BY cu_id ASC LIMIT ${perPage} OFFSET ${offset}`;

      dbConnection.query(sql, (err, rowscoupon) => {
        if (err) {
          req.flash('message', 'กลับสู่หน้าหลัก');
          res.redirect('/');
        } else {
          dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภทราคาพิเศษ" ', (err, total) => {
            let totalcoupon = total[0].total;
            if (err) {
              req.flash('message', 'กลับสู่หน้าหลัก');
              res.redirect('/');
            } else {
              res.render('cat_specialprice',{data:rowspromotion,dataCoupon:rowscoupon,totalcoupon:totalcoupon,currentPage:currentPage,perPage:perPage});
            }
          });
        }
      });
    }
  });
});
/*------------------------------------ประเภท1แถม1----------------------------------*/
router.get('/cat_onefreeone', function (req, res, next) {
  dbConnection.query('SELECT * FROM promotion WHERE status="Order" AND pro_type="ประเภท1แถม1" ORDER BY boost DESC  ', (err, rowspromotion) => {
    if (err) {
      req.flash('error', err);
      // res.render('index', { data: '',dataCoupon:'',totalcoupon:'',pro_name:'',id_pro:''});
      res.redirect('/');
    } else {
      dbConnection.query('SELECT * FROM promotion WHERE boost!=0', (err, rowspromotionboost) => {
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          console.log("Promotion ที่มีการ boost",rowspromotionboost.length);
          for (let n = 0; n < rowspromotionboost.length; n++) {
            dbConnection.query("SELECT * FROM boostpromote WHERE boost_id_pro = ? ",[rowspromotionboost[n].id_pro],
              (err, boost) => {
                if (err) {
                  console.log("ERROR ตรวจสอบวัน boost"+ err);
                } 
                if (boost && boost[n] && boost[n].boost_end) {
                  console.log("boost end ",boost[n]);
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n].);
                  if (sum <= 0) {
                    //ยังไม่หมดเวลา
                    console.log(boost[n].boost_id_pro +" :"+ sum+": ยังไม่หมดเวลา");
                  }else{
                    //หมดเวลาแล้ว
                    console.log(boost[n].boost_id_pro +" :"+ sum+": หมดเวลา");
                    let form_data = {
                      boost: 0,
                    };
                    dbConnection.query("UPDATE promotion SET ? WHERE id_pro = ?",[form_data,boost[n].boost_id_pro], (err, result) => {
                      if (err) {
                        console.log(": อัพเดท status ใน promotion ไม่ได้");
                      } else {
                        console.log(": ปรับ boost promotion แล้ว");
                      }
                    });
                  }
                } else {
                  console.log("ไม่พบคุณสมบัติ boost_end หรือข้อมูล boost ในระบบ");
                } 
              });
          }
        }
      });

      const currentPage = req.query.page || 1; // หากไม่ได้รับค่าหน้ามาให้เป็นหน้าที่ 1
      const perPage = 6; // จำนวนข้อมูลต่อหน้า
      const offset = (currentPage - 1) * perPage;
      const sql =`SELECT * FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภท1แถม1"  ORDER BY cu_id ASC LIMIT ${perPage} OFFSET ${offset}`;


      dbConnection.query(sql, (err, rowscoupon) => {
        
        if (err) {
          req.flash('message', 'กลับสู่หน้าหลัก');
          res.redirect('/');
        } else {
          dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภท1แถม1" ', (err, total) => {
            let totalcoupon = total[0].total;
            if (err) {
              req.flash('message', 'กลับสู่หน้าหลัก');
              res.redirect('/');
            } else {
              res.render('cat_onefreeone',{data:rowspromotion,dataCoupon:rowscoupon,totalcoupon:totalcoupon,currentPage:currentPage,perPage:perPage});
            }
          });
        }
      });
    }
  });
});
/*------------------------------------ประเภทแลกของพิเศษ----------------------------------*/
router.get('/cat_tradefree', function (req, res, next) {
  dbConnection.query('SELECT * FROM promotion WHERE status="Order" AND pro_type="ประเภทแลกของฟรี" ORDER BY boost DESC  ', (err, rowspromotion) => {
    if (err) {
      req.flash('error', err);
      // res.render('index', { data: '',dataCoupon:'',totalcoupon:'',pro_name:'',id_pro:''});
      res.redirect('/');
    } else {
      dbConnection.query('SELECT * FROM promotion WHERE boost!=0', (err, rowspromotionboost) => {
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          console.log("Promotion ที่มีการ boost",rowspromotionboost.length);
          for (let n = 0; n < rowspromotionboost.length; n++) {
            dbConnection.query("SELECT * FROM boostpromote WHERE boost_id_pro = ? ",[rowspromotionboost[n].id_pro],
              (err, boost) => {
                if (err) {
                  console.log("ERROR ตรวจสอบวัน boost"+ err);
                }
                if (boost && boost[n] && boost[n].boost_end) {
                  console.log("boost end ",boost[n]);
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n].);
                  if (sum <= 0) {
                    //ยังไม่หมดเวลา
                    console.log(boost[n].boost_id_pro +" :"+ sum+": ยังไม่หมดเวลา");
                  }else{
                    //หมดเวลาแล้ว
                    console.log(boost[n].boost_id_pro +" :"+ sum+": หมดเวลา");
                    let form_data = {
                      boost: 0,
                    };
                    dbConnection.query("UPDATE promotion SET ? WHERE id_pro = ?",[form_data,boost[n].boost_id_pro], (err, result) => {
                      if (err) {
                        console.log(": อัพเดท status ใน promotion ไม่ได้");
                      } else {
                        console.log(": ปรับ boost promotion แล้ว");
                      }
                    });
                  }
                } else {
                  console.log("ไม่พบคุณสมบัติ boost_end หรือข้อมูล boost ในระบบ");
                } 
              });
          }
        }
      });

      const currentPage = req.query.page || 1; // หากไม่ได้รับค่าหน้ามาให้เป็นหน้าที่ 1
      const perPage = 6; // จำนวนข้อมูลต่อหน้า
      const offset = (currentPage - 1) * perPage;
      const sql =`SELECT * FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภทแลกของฟรี"  ORDER BY cu_id ASC LIMIT ${perPage} OFFSET ${offset}`;


      dbConnection.query(sql, (err, rowscoupon) => {

        if (err) {
          req.flash('message', 'กลับสู่หน้าหลัก');
          res.redirect('/');
        } else {
          dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภทแลกของฟรี" ', (err, total) => {
            let totalcoupon = total[0].total;
            if (err) {
              req.flash('message', 'กลับสู่หน้าหลัก');
              res.redirect('/');
            } else {
              res.render('cat_tradefree',{data:rowspromotion,dataCoupon:rowscoupon,totalcoupon:totalcoupon,currentPage:currentPage,perPage:perPage});
            }
          });
        }
      });
    }
  });
});
/*------------------------------------ประเภทกินฟรี----------------------------------*/
router.get('/cat_eatfree', function (req, res, next) {
  dbConnection.query('SELECT * FROM promotion WHERE status="Order" AND pro_type="ประเภทกินฟรี" ORDER BY boost DESC  ', (err, rowspromotion) => {
    if (err) {
      req.flash('error', err);
      // res.render('index', { data: '',dataCoupon:'',totalcoupon:'',pro_name:'',id_pro:''});
      res.redirect('/');
    } else {
      dbConnection.query('SELECT * FROM promotion WHERE boost!=0', (err, rowspromotionboost) => {
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          console.log("Promotion ที่มีการ boost",rowspromotionboost.length);
          for (let n = 0; n < rowspromotionboost.length; n++) {
            dbConnection.query("SELECT * FROM boostpromote WHERE boost_id_pro = ? ",[rowspromotionboost[n].id_pro],
              (err, boost) => {
                if (err) {
                  console.log("ERROR ตรวจสอบวัน boost"+ err);
                } 
                if (boost && boost[n] && boost[n].boost_end) {
                  console.log("boost end ",boost[n]);
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n].);
                  if (sum <= 0) {
                    //ยังไม่หมดเวลา
                    console.log(boost[n].boost_id_pro +" :"+ sum+": ยังไม่หมดเวลา");
                  }else{
                    //หมดเวลาแล้ว
                    console.log(boost[n].boost_id_pro +" :"+ sum+": หมดเวลา");
                    let form_data = {
                      boost: 0,
                    };
                    dbConnection.query("UPDATE promotion SET ? WHERE id_pro = ?",[form_data,boost[n].boost_id_pro], (err, result) => {
                      if (err) {
                        console.log(": อัพเดท status ใน promotion ไม่ได้");
                      } else {
                        console.log(": ปรับ boost promotion แล้ว");
                      }
                    });
                  }
                } else {
                  console.log("ไม่พบคุณสมบัติ boost_end หรือข้อมูล boost ในระบบ");
                } 
              });
          }
        }
      });

     
      const currentPage = req.query.page || 1; // หากไม่ได้รับค่าหน้ามาให้เป็นหน้าที่ 1
      const perPage = 6; // จำนวนข้อมูลต่อหน้า
      const offset = (currentPage - 1) * perPage;
      const sql =`SELECT * FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภทกินฟรี"  ORDER BY cu_id ASC LIMIT ${perPage} OFFSET ${offset}`;


      dbConnection.query(sql, (err, rowscoupon) => {
      
        if (err) {
          req.flash('message', 'กลับสู่หน้าหลัก');
          res.redirect('/');
        } else {
          dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภทกินฟรี" ', (err, total) => {
            let totalcoupon = total[0].total;
            if (err) {
              req.flash('message', 'กลับสู่หน้าหลัก');
              res.redirect('/');
            } else {
              res.render('cat_eatfree',{data:rowspromotion,dataCoupon:rowscoupon,totalcoupon:totalcoupon,currentPage:currentPage,perPage:perPage});
            }
          });
        }
      });
    }
  });
});
router.get('/logout', function (req, res, next) {

  req.session.destroy();
  res.redirect('/');
});
module.exports = router;