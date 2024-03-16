let express = require('express');
let router = express.Router();
let dbConnection = require('../database/db');
const session = require('express-session');
const multer = require('multer')
const path = require('path');
const { log } = require('console');

const fs = require('fs');
const moment = require('moment');
const { jsPDF } = require("jspdf");
const autoTable = require("jspdf-autotable");
const font = require("../public/Font/TH-Niramit-AS-Regular-pdf-normal.js");

function isNotLogin(req, res, next) { //check session 
  if (!req.session.isLoggedIn) {
    return res.render('FormLogin');
  }
  next();
}



router.get('/', isNotLogin, (req, res, next) => {
  let id = req.session.id_res;
  console.log(id);
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
  WHERE  pro.id_restb=?
  ORDER BY cu.datebook ASC`;

  dbConnection.query(querytime,[id],(err, result2) => {
    if (err) {
      req.flash('error', 'ไปหน้าร้านอาหารไม่สำเร็จ');
      res.render('Resturant', { 
        data: '',
        data2:'',
        name: req.session.nameResturant, 
        role: req.session.level, 
        img: req.session.profileResturant,
        point:req.session.point
      });
    } else {
    dbConnection.query(query,[id],(err, result) => {
      if (err) {
        req.flash('error', 'ไปหน้าร้านอาหารไม่สำเร็จ');
        res.render('Resturant', { 
          data: '',
          data2:'',
          name: req.session.nameResturant, 
          role: req.session.level, 
          img: req.session.profileResturant,
          point:req.session.point
        });
      } else {
        res.render('Resturant', { 
          data: result, 
          data2:result2,
          name: req.session.nameResturant, 
          role: req.session.level, 
          img: req.session.profileResturant,
          point:req.session.point
        });
      }
    });
  }
  });
  
});
// back profile
router.get('/back', isNotLogin, (req, res, next) => {
  let id = req.session.id_res;
  console.log(id);
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
  WHERE  pro.id_restb=?
  ORDER BY cu.datebook ASC`;

  dbConnection.query(querytime,[id], (err, result2) => {
    if (err) {
      req.flash('error', 'ไปหน้าร้านอาหารไม่สำเร็จ');
      res.render('Resturant', { 
        data: '',
        data2:'',
        name: req.session.nameResturant, 
        role: req.session.level, 
        img: req.session.profileResturant,
        point:req.session.point
      });
    } else {
    dbConnection.query(query, [id],(err, result) => {
      if (err) {
        req.flash('error', 'ไปหน้าร้านอาหารไม่สำเร็จ');
        res.render('Resturant', { 
          data: '',
          data2:'',
          name: req.session.nameResturant, 
          role: req.session.level, 
          img: req.session.profileResturant,
          point:req.session.point
        });
      } else {
        res.render('Resturant', { 
          data: result, 
          data2:result2,
          name: req.session.nameResturant, 
          role: req.session.level, 
          img: req.session.profileResturant,
          point:req.session.point
        });
      }
    });
  }
  });
});

router.get('/calendar', isNotLogin, (req, res) => {
  let id = req.session.id_res;
  const query = `SELECT cu.coupon_id, cu.datebook,cu.timebook, cu.status, u.fname, u.lname, u.Profile,cp.cu_id, cp.name_pro_coupon, cp.price_pro ,res.res_name 
  FROM coupon_user cu 
  INNER JOIN coupon cp ON cu.coupon_id = cp.cu_id 
  INNER JOIN user u ON cu.user_id = u.id_user 
  INNER JOIN restaurants res ON cp.id_res_coupon = res.id_res 
  WHERE cp.id_res_coupon=?
  ORDER BY datebook DESC `;
  dbConnection.query(query,[id], (err, result) => {
    if(err){
      req.flash('error', 'ไม่มีข้อมูลปฏิทิน');
      res.render('Resturant', { 
        data: '', 
        name: req.session.nameResturant, 
        role: req.session.level, 
        img: req.session.profileResturant,
        point:req.session.point
      });
    }else{
      console.log(result);
      res.render('Resturant/calendar', { 
        data: result, 
        name: req.session.nameResturant, 
        role: req.session.level, 
        img: req.session.profileResturant,
        point:req.session.point
      });
    }
  });
});


/* ใบประกอบกิจการ */
router.get('/Ceritificate', isNotLogin, (req, res) => {

  let id_user = req.session.id_user;
  dbConnection.query('SELECT * FROM restaurants WHERE id_usertb = ? ', [id_user], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else if (rows.length <= 0) {
      req.flash('error', 'ไม่มีใบประกอบกิจการ')
      res.redirect('/resturant/back');
    } else {
      res.render('Resturant/Ceritificate', {
        img: rows[0].res_certificate,
        name: req.session.nameResturant,
        imgres: req.session.profileResturant,
        point:req.session.point
      });
    }
  });

})

/* ฟอร์มแก้ไขข้อมูล */
router.get('/FormUpdateResturant', isNotLogin, (req, res) => {
  let id_user = req.session.id_user;
  dbConnection.query('SELECT * FROM restaurants WHERE id_usertb = ? ', [id_user], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else if (rows.length <= 0) {
      req.flash('error', 'ไม่มีข้อมูลผู้ใช้')
      res.redirect('/resturant/back');
    } else {
      res.render('Resturant/FormUpdateResturant', {

        id: rows[0].id_res,
        img: rows[0].res_profile,
        nameres:rows[0].res_name,
        address:rows[0].res_address,
        StatusResturant: rows[0].res_status_resturant,
        Profile: rows[0].res_owner_profile,
        email:rows[0].res_email,
        phone:rows[0].res_phone,
        Owner_Name: rows[0].res_owner_name,
        Owner_Lname: rows[0].res_owner_lnam,
        Owner_Email: rows[0].res_owner_email,
        Owner_Phone: rows[0].res_owner_phone,
        name: req.session.nameResturant,
        imgres: req.session.profileResturant,
        point:req.session.point
      })
    }
  });
})

// display Resturant Profile page
router.get('/Profile', isNotLogin, (req, res, next) => {

  req.session.isLoggedIn = true;
  let id_user = req.session.id_user;
  dbConnection.query('SELECT * FROM restaurants WHERE id_usertb = ? ', [id_user], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else if (rows.length <= 0) {
      req.flash('error', 'ไม่มีข้อมูลผู้ใช้')
      res.redirect('Resturant');
    } else {
      res.render('Resturant/Profile', {
        id: rows[0].id_res,
        Name: rows[0].res_name,
        Email: rows[0].res_email,
        Phone: rows[0].res_phone,
        address: rows[0].res_address,
        StatusResturant: rows[0].res_status_resturant,
        Profile: rows[0].res_owner_profile,
        Owner_Name: rows[0].res_owner_name,
        Owner_Lname: rows[0].res_owner_lnam,
        Owner_Email: rows[0].res_owner_email,
        Owner_Phone: rows[0].res_owner_phone,
        img: rows[0].res_profile,
        imgcer:rows[0].res_certificate,
        imgres: req.session.profileResturant,
        name: req.session.nameResturant,
        point:req.session.point
      })
    }
  });
})


// Upload Profile
const storageResturant = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/profileRes/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilterResturant = function (req, file, cb) {

  // Set the filetypes, it is optional 
  var filetypes = /jpeg|jpg|png/;
  var mimetype = filetypes.test(file.mimetype);

  var extname = filetypes.test(path.extname(
    file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new Error("ไม่รองรับไฟล์ " + "รองรับเฉพาะไฟล์- " + filetypes));
}

// ภาพไม่เกิน 1 MB
const maxSizeResturant = 10 * 1024 * 1024;

let uploadProfileResturant = multer({ storage: storageResturant, fileFilter: fileFilterResturant, limits: { fileSize: maxSizeResturant }, });


router.post('/update', uploadProfileResturant.single('ProfileRes'), (req, res, next) => {
  let Name = req.body.res_name;
  let Email = req.body.res_email;
  let Address = req.body.res_address;
  let Phone = req.body.res_phone;
  let StatusResturant = req.body.res_status;
  let Profile = req.body.owner_profile;
  let Owner_Nname = req.body.owner_name;
  let Owner_Lname = req.body.owner_lname;
  let Owner_Email = req.body.owner_email;
  let Owner_Phone = req.body.owner_phone;
  let res_profile = req.file.filename;


  var updateProfileRes = {
    res_name: Name,
    res_email: Email,
    res_address: Address,
    res_phone: Phone,
    res_status_resturant: StatusResturant,
    res_owner_profile: Profile,
    res_owner_name: Owner_Nname,
    res_owner_lnam: Owner_Lname,
    res_owner_phone: Owner_Phone,
    res_owner_email: Owner_Email,
    res_profile: res_profile
  }

  let id = req.session.id_res
  dbConnection.query('UPDATE restaurants SET ? WHERE id_res = ?' , [updateProfileRes,id],(error, rows) => {
    if (error) {
      req.flash('error', 'แก้ไขไม่สำเร็จ');
      res.redirect('/resturant/back')
    } else {
      dbConnection.query('SELECT * FROM restaurants WHERE id_res= ?' , [id], (error, result) => {
        req.session.nameResturant = result[0].res_name;
        req.session.profileResturant = result[0].res_profile;
        if (error) {
          req.flash('error', 'ไม่มีข้อมูลร้านอาหาร');
          res.redirect('/resturant/back')
        } else {
          errors = true;
          req.flash('success', 'แก้ไขสำเร็จ');
          res.redirect('/resturant/back')
        }
      })
    }
  })
})

// Upload Certificate
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/certificate/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = function (req, file, cb) {

  // Set the filetypes, it is optional 
  var filetypes = /jpeg|jpg|png/;
  var mimetype = filetypes.test(file.mimetype);

  var extname = filetypes.test(path.extname(
    file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new Error("ไม่รองรับไฟล์ " + "รองรับเฉพาะไฟล์- " + filetypes));
}

// ภาพไม่เกิน 1 MB
const maxSize = 10 * 1024 * 1024;

let upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: maxSize }, });





router.post('/UpdateCertificate', upload.single('image'), (req, res, next) => {

  let certificate = req.file.filename;
  let update = {
    res_certificate: certificate
  }
  let id = req.session.id_res
  dbConnection.query('UPDATE restaurants SET ? WHERE id_res = ?',[update,id],(error, rows) => {
    if (error) {
      req.flash('error', 'แก้ไขไม่สำเร็จ');
      res.redirect('/resturant/back')
    } else {
      req.flash('success', 'แก้ไขสำเร็จ');
      res.redirect('/resturant/back')
    }
  })
})

/*-------------------------------------------------------ส่วนโฟลเดอร์ Promotion---------------------------------------------*/
router.get('/Promotion', isNotLogin, (req, res) => {

  let idrestbPromotion = req.session.id_res;


  dbConnection.query(' SELECT * FROM promotion WHERE id_restb= ?',[idrestbPromotion], (err, rows, fields) => {
    if (err) {
      req.flash('error', 'ไม่มีข้อมูลโปรโมชัน');
      res.redirect('/resturant/back')
    } else {
      res.render('Promotion', {
        name: req.session.nameResturant,
        role: req.session.level,
        data: rows,
        img: req.session.profileResturant,
        point:req.session.point
      })
    }
  });





})


//search promotion
router.post('/searchPromotion', (req, res, next) => {
  const query = req.body.searchPromotion;
  
  const sql =`SELECT * FROM promotion WHERE pro_name LIKE ?`;
    dbConnection.query(sql,['%'+ query + '%'],(error,result) => {
      if (error) {
        req.flash("error", 'ไม่สามารถแสดงโปรโมชันได้');
        res.redirect('/resturant/back');
      } else if(result.length<=0){
        res.render('Promotion/searchPromotion',{
          data:'',
          name: req.session.nameResturant,
          img: req.session.profileResturant,
          point:req.session.point
        });
      }else {
        res.render('Promotion/searchPromotion',{
          data:result,
          name: req.session.nameResturant,
          img: req.session.profileResturant,
          point:req.session.point
        });
      }
    });
});




router.get('/tablePromotion', isNotLogin, (req, res) => {


  let idrestbPromotion = req.session.id_res;


  dbConnection.query(' SELECT * FROM promotion WHERE id_restb= ?',[idrestbPromotion], (err, rows, fields) => {
    if (err) {
      req.flash('error', 'ไม่มีข้อมูลโปรโมชัน');
      res.redirect('/resturant/back')
    } else {
      res.render('Promotion', {
        role: req.session.level,
        data: rows,
        name: req.session.nameResturant,
        img: req.session.profileResturant,
        point:req.session.point
      })
    }
  });
})

router.get('/addPromotion', (req, res, next) => {
  res.render('Promotion/addPromotion',{
    name: req.session.nameResturant,
    img: req.session.profileResturant,
    point:req.session.point
  });
})


// Upload iamge Resturant
const storageimgResturant = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/resturantimg/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

  }
});
const fileFilterimgResturant = function (req, file, cb) {

  // Set the filetypes, it is optional 
  var filetypes = /jpeg|jpg|png/;
  var mimetype = filetypes.test(file.mimetype);

  var extname = filetypes.test(path.extname(
    file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new Error("ไม่รองรับไฟล์ " + "รองรับเฉพาะไฟล์- " + filetypes));
}

// ภาพไม่เกิน 1 MB
const maxSizeimgResturant = 10 * 1024 * 1024;

let uploadimgResturant = multer({ storage: storageimgResturant, fileFilter: fileFilterimgResturant, limits: { fileSize: maxSizeimgResturant }, });



// cupon random
function generateCouponCode(length) {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let couponCode = '';
  for (let i = 0; i < length; i++) {
    couponCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return couponCode;
}

/*ยังอัปภาพร้านอาหารหลายไฟล์ไม่ได้ */
router.post('/addPromotion', uploadimgResturant.single('imageFood'), (req, res, next) => {
  let idRes = req.session.id_res;
  let name = req.body.pro_name;
  let detail = req.body.pro_detail;
  let typepro = req.body.pro_type;
  let price = req.body.pro_price;
  let amount = req.body.pro_amount;
  let image = req.file.filename;
  // const files = req.files;
  let dateStart = req.body.date_start;
  let dateEnd = req.body.date_end;
  let timeStart = req.body.time_start;
  let timeEnd = req.body.time_end;

  // console.log(files);

  let numberOfCoupons = parseInt(req.body.pro_amount);
  // parseInt(req.qu.pro_amount);// จำนวนคูปองที่ต้องการ
  let coupons = [];
  let successCoupon = 0;
  dbConnection.query('SELECT MAX(id_pro) AS max_idpromotion FROM promotion', (error, results, fields) => { // หาเลข max id_promotion ที่มากที่สุดเพื่อเพิ่มค่าให้อีกที
    let currentId = results[0].max_idpromotion;// 
    let newId = currentId + 1;
    let imgeResturant = {
      id_pro: newId,
      id_restb: idRes,
      pro_name: name,
      pro_type: typepro,
      pro_detail: detail,
      pro_price: price,
      pro_amount: amount,
      status: "Order",
      date_start: dateStart,
      date_end: dateEnd,
      time_start: timeStart,
      time_end: timeEnd,
      pro_image: image

    }
    if (error) {
      req.flash('error', error);
      console.log("ERROR หา id promotion");
    } else {
      // บันทึกที่อยู่ของไฟล์ในฐานข้อมูล
      dbConnection.query('INSERT INTO promotion SET ? ', [imgeResturant], (error, rows) => {
        if (error) {
          req.flash('error', 'เพิ่มโปรโมชันไม่สำเร็จ');
          res.redirect('/resturant/tablePromotion');
          console.log("บันทึกลงฐานข้อมูลไม่สำเร็จ PROMOTION");
        } else {
          dbConnection.query('SELECT MAX(id_pro) AS max_idpromotioncupon FROM promotion', (error, results, fields) => { // หาเลข max id_promotion ที่มากที่สุดเพื่อเพิ่มค่าให้อีกที
            let idProtoCoupon = results[0].max_idpromotioncupon;

            if (error) {
              req.flash('error', error);
              res.redirect('/resturant/tablePromotion');
              console.log("หาเลข ID PROMOTION ปัจจุบัน");
            } else {

              for (let i = 0; i < numberOfCoupons; i++) {

                let couponCode = generateCouponCode(5); // สร้างรหัสคูปองที่มีความยาว 5 ตัวอักษร
                coupons.push(couponCode);

                let cupondata = {
                  id_pro_coupon: idProtoCoupon,
                  name_pro_coupon: name,
                  type_pro_coupon: typepro,
                  id_res_coupon: idRes,
                  cu_code: couponCode,
                  cu_amountcanused: 1,
                  price_pro: price,
                  status: "Order",
                  date_start: dateStart,
                  date_end: dateEnd,
                  time_start: timeStart,
                  time_end: timeEnd,
                  img_pro:image,
                  id_user:0
                }

                dbConnection.query('INSERT INTO coupon SET  ?  ', [cupondata], (error, rows) => {

                  if (error) {
                    req.flash('error', 'เพิ่มไม่สำเร็จคูปองสำเร็จ');
                    res.redirect('/resturant/tablePromotion');
                    console.log("บันทึกลงฐานข้อมูลคูปองไม่สำเร็จ");
                  } else {
                    successCoupon++;
                    console.log("บันทึกลงฐานข้อมูลคูปองสำเร็จ");
                  }

                  if (successCoupon === numberOfCoupons) {
                    if (numberOfCoupons === 0) {
                      req.flash('error', error);
                      res.redirect('/resturant/tablePromotion');
                      console.log("บันทึกลงฐานข้อมูลคูปองไม่สำเร็จตามจำนวนที่กำหนด");
                    } else {
                      req.flash('success', 'เพิ่มโปรโมชันสำเร็จ');
                      res.redirect('/resturant/tablePromotion');
                      console.log("บันทึกลงฐานข้อมูลคูปองสำเร็จตามจำนวนที่กำหนด");
                    }
                  }
                })
              }
            }
          })
        }
      });
    }
  })
})

router.get('/editPromotion/(:id_pro)', isNotLogin, (req, res, next) => {
  let id = req.params.id_pro;
  dbConnection.query('SELECT * FROM promotion WHERE id_pro = ?',[id], (err, rows, fields) => {
    if (rows.length <= 0) {
      req.flash('error', 'หาโปรโมชันของ ID ' + id+'ไม่เจอ')
      res.redirect('/Promotion');
    } else {
      res.render('Promotion/editPromotion', {
        id: rows[0].id_pro,
        namepro: rows[0].pro_name,
        typepro: rows[0].pro_type,
        detail: rows[0].pro_detail,
        price: rows[0].pro_price,
        amount: rows[0].pro_amount,
        image: rows[0].pro_image,
        date_start: rows[0].date_start,
        date_end: rows[0].date_end,
        time_start: rows[0].time_start,
        time_end: rows[0].time_end,
        name: req.session.nameResturant,
        img: req.session.profileResturant,
        point:req.session.point
      });
    }
  });

})

// // Update Promotion

router.post('/updateResturant/:id_pro', uploadimgResturant.single('imageFood'), (req, res, next) => {
  let id = req.params.id_pro;
  let idRes = req.session.id_res;
  let typepro = req.body.pro_type;
  let name = req.body.pro_name;
  let detail = req.body.pro_detail;
  let price = req.body.pro_price;
  let amount = req.body.pro_amount;
  let image = req.file.filename;
  let dateStart = req.body.date_start;
  let dateEnd = req.body.date_end;
  let timeStart = req.body.time_start;
  let timeEnd = req.body.time_end;

  // let amountcoupon = parseInt(req.body.pro_amount);
  // parseInt(req.qu.pro_amount);// จำนวนคูปองที่ต้องการ
  let coupons = [];
  let successCoupon = 0;

  console.log(name);
  console.log(detail);
  console.log(price);
  console.log(amount);
  console.log(image);
  console.log(dateStart);
  console.log(dateEnd);
  console.log(timeStart);
  console.log(timeEnd);

  let FormUpdatedataReaturant = {
    id_pro: id,
    id_restb: idRes,
    pro_type: typepro,
    pro_name: name,
    pro_detail: detail,
    pro_price: price,
    pro_amount: amount,
    status: "Order",
    pro_image: image,
    date_start: dateStart,
    date_end: dateEnd,
    time_start: timeStart,
    time_end: timeEnd
  }


  dbConnection.query('SELECT COUNT(*) AS total_rows FROM coupon WHERE id_pro_coupon=?',[id], (err,rows) => {
    let totalrows = rows[0].total_rows;
    console.log('จำนวนแถว : ',totalrows);
    if (err) {
      req.flash('error', error);
      res.redirect('/resturant/tablePromotion');
      console.log("หาจำนวนโปรโมชันเก่าไมเจอ");
    } else {
      // Check if the amount is changed
      if (totalrows !== amount) {
        if (totalrows < amount) {
          // Generate random codes for additional coupons
          let newCouponCount = amount - totalrows ;
         
          // Insert new coupons into the database
          for (let i = 0; i < newCouponCount; i++) {
            let couponCode = generateCouponCode(5);
            coupons.push(couponCode);
            let cupondata = {
              id_pro_coupon: id,
              name_pro_coupon: name,
              type_pro_coupon: typepro,
              id_res_coupon: idRes,
              cu_code: couponCode,
              cu_amountcanused: 1,
              price_pro: price,
              status: "Order",
              date_start: dateStart,
              date_end: dateEnd,
              time_start: timeStart,
              time_end: timeEnd,
              img_pro:image
            }
            dbConnection.query('INSERT INTO coupon SET ?',[cupondata], (error, rows) => {
              if (error) {
                req.flash('error', 'เพิ่มคูปองไม่สำเร็จ');
                console.log("แก้ไขเพิ่มคูปองไม่สำเร็จ", error);
              } else {
                req.flash('success', 'แก้ไขสำเร็จ');
                successCoupon++
                console.log("แก้ไขคูปองสำเร็จ");
              }

              if (successCoupon === newCouponCount) {
                if (newCouponCount === 0) {
                  req.flash('error', error);
                  console.log("บันทึกลงฐานข้อมูลคูปองไม่สำเร็จตามจำนวนที่กำหนด");
                } else {
                  req.flash('success', 'เพิ่มโปรโมชันสำเร็จ');
                  console.log("บันทึกลงฐานข้อมูลคูปองสำเร็จตามจำนวนที่กำหนด");
                }
              }
            });
          }
        } else {
          // Delete excess coupons from the database
          let excessCouponCount = totalrows - amount;
          console.log("เลขตำแหน่ง : ",excessCouponCount);
          
          dbConnection.query('DELETE FROM coupon WHERE id_pro_coupon = ? LIMIT ?', [id,excessCouponCount], (error, rows) => {
            if (error) {
              req.flash('error', 'ลบคูปองไม่สำเร็จ');
              console.log("ลบคูปองไม่สำเร็จ", error);
            } else {
              req.flash('success', 'แก้ไขสำเร็จ');
              console.log("ลบคูปองสำเร็จ");
            }
          });
        }
      }
    }
  })


  dbConnection.query('UPDATE promotion SET  ? WHERE id_pro = ?' ,[FormUpdatedataReaturant,id],(error, rows) => {
    if (error) {
      req.flash('error', 'แก้ไขไม่สำเร็จ');
      console.log("บันทึกลงฐานข้อมูลไม่สำเร็จ");
    } else {
      errors = true;
      req.flash('success', 'แก้ไขสำเร็จ');
      res.redirect('/resturant/tablePromotion');
      console.log("แก้ไขข้อมูลโปรโมชัน และ บันทึกลงฐานข้อมูลสำเร็จ");
    }
  });
  


});


// delete Promotion
router.get('/deletePromotion/(:id_pro)', isNotLogin, (req, res, next) => {
  let id = req.params.id_pro;

  dbConnection.query('DELETE FROM promotion WHERE id_pro =?' , [id], (err, result) => {
    if (err) {
      req.flash('error', 'ลบโปรโมชันไม่สำเร็จ'),
      res.redirect('/resturant/tablePromotion');
    } else {
      dbConnection.query('DELETE FROM coupon WHERE id_pro_coupon = ?' ,[id], (err, result) => {
        if (err) {
          req.flash('error', 'ลบคูปองไม่สำเร็จ'),
          res.redirect('/resturant/tablePromotion');
        } else {
          req.flash('success', 'ลบโปรโมชันของ ID = ' + id+'สำเร็จ');
          dbConnection.query('SELECT * FROM promotion ORDER BY pro_id ', (err, rows) => {
            if (err) {
              req.flash('error', 'แสดงโปรโมชันของ');
              res.redirect('/resturant/tablePromotion');
            } else {
              req.flash('success', 'ลบโปรโมชันสำเร็จ');
              res.redirect('/resturant/tablePromotion');
            }
          })
        }
      })

    }
  })
})

// Open Pormotion
router.get('/openPromotion/(:id_pro)', isNotLogin, (req, res, next) => {
  let id = req.params.id_pro;

  dbConnection.query(' UPDATE promotion SET status = "Order" WHERE id_pro= ?' , [id], (err, rows) => {
    if (err) {
      console.log(err);
      req.flash("error", "แก้ไขสถานะโปรโมชันไม่สำเร็จ");
      res.redirect('/resturant/tablePromotion');
    } else { 
      let statuscoupon ={
        status : "Order",
        cu_amountcanused:1
      }
      dbConnection.query(' UPDATE coupon SET ? WHERE id_pro_coupon= ?', [statuscoupon,id], (err,rows) => {
      if (err) {
        console.log(err);
        req.flash('success', 'แก้ไขสถานะคูปองไม่สำเร็จ');
        res.redirect('/resturant/tablePromotion');
      } else {
        return
      }
    });
  }
  });
 

  dbConnection.query("SELECT * FROM coupon WHERE id_pro_coupon= ?",[id], (err,rows) => {
    let couponId =rows[0].cu_id;
    if(err){
      req.flash("error", 'เกิดข้อผิดพลาดในการหาข้อมูล');
      console.log(err);
      res.redirect('/resturant/tablePromotion');
    }else{
      dbConnection.query('SELECT user_id FROM coupon_user WHERE coupon_id = ?', [couponId], (error, results) => {
        if (error) {
          req.flash('error', 'เกิดข้อผิดพลาดในการหาข้อมูล');
          console.error('เกิดข้อผิดพลาดในการค้นหาข้อมูล: ', error);
        }
        // ตรวจสอบว่าพบ id_user หรือไม่
        if (results.length > 0) {
          let userId=results[0].user_id;
          // ทำการอัปเดตข้อมูลในตาราง coupon
          dbConnection.query('UPDATE coupon SET status = ? WHERE id_user = ?', ['Book', userId], (updateError, updateResults) => {
            if (updateError) {
              req.flash('error', 'แก้ไขข้อมูลคูปองไม่สำเร็จ');
              console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ', updateError);
              res.redirect('/resturant/tablePromotion');
            } else {
              dbConnection.query('UPDATE coupon_user SET status = ? WHERE user_id = ?', ['Book', userId], (updateError, updateResults) => {
                if (updateError) {
                  req.flash('error', 'แก้ไขข้อมูลคูปองที่มีการจองไม่สำเร็จ');
                  console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ', updateError);
                  res.redirect('/resturant/tablePromotion');
                } else {
                  req.flash('success', 'แก้ไขข้อมูลสำเร็จเฉพาะ Book');
                  console.log('อัปเดตข้อมูลสำเร็จ Book เฉพาะ');
                  res.redirect('/resturant/tablePromotion');
                }
              });
            }
          });
        } else {
          // ไม่พบ id_user ในตาราง coupon_user
          // ทำการอัปเดตสถานะเป็น 'Order' หรือดำเนินการตามที่ต้องการ
          let statuscoupon ={
            status : "Order",
            cu_amountcanused:1
          }
          dbConnection.query('UPDATE coupon SET  ?', [statuscoupon], (updateError, updateResults) => {
            if (updateError) {
              req.flash('error', 'แก้ไขสถานะคูปองไม่สำเร็จ');
              console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ', updateError);
              return res.redirect('/resturant/tablePromotion');
            } else {
              req.flash('success', 'แก้ไขสถานะข้อมูลสำเร็จเฉพาะ Book');
              console.log('อัปเดตข้อมูลสำเร็จ Order ทั้งหมด');
              return res.redirect('/resturant/tablePromotion');
            }

          });
        }
      });
    
    }
    });
})

// Close Pormotion
router.get('/closePromotion/(:id_pro)', isNotLogin, (req, res, next) => {
  let id = req.params.id_pro;
  dbConnection.query(' UPDATE promotion SET status = "Off" WHERE id_pro=?',[id], (err, rows) => {
    if (err) {
      console.log(err);
      req.flash("error", "แก้ไขสถานะโปรโมชันไม่สำเร็จ");
      res.redirect('/resturant/tablePromotion');
    } else {
      dbConnection.query(' UPDATE coupon SET status = "Close" WHERE id_pro_coupon= ?',[id], (err, rows) => {
        if (err) {
          req.flash("error", "แก้ไขสถานะคูปองไม่สำเร็จ");
          console.log(err);
          res.redirect('/resturant/tablePromotion');
        } else {
          req.flash("message", "ปิดโปรโมชัน");
          console.log("ปิดสำเร็จ");
          res.redirect('/resturant/tablePromotion');
        }
      });
    }
  });
})
/*-------------------------------------------------------ส่วนโฟลเดอร์ Cupon---------------------------------------------*/
// คูปอง
router.get('/cupon/(:id_pro)', isNotLogin, (req, res, next) => {
  let id = req.params.id_pro;
  dbConnection.query(' SELECT * FROM coupon WHERE id_pro_coupon= ?',[id], (err, rows, fields) => {

    if (err) {
      req.flash("error", "ไม่สามารถแสดงคูปองได้");
      console.log(err);
      res.redirect('/resturant/back');
    } else {
      res.render('Coupon', {
        data: rows,
        name: req.session.nameResturant,
        img: req.session.profileResturant,
        point:req.session.point
      })
    }
  });
})

/*-------------------------------------------------------Resturant Add Point---------------------------------------------*/
router.get("/ResturantAddPoint",isNotLogin,function (req, res, next) {
    let nameResturant = req.session.nameResturant;
    let email = req.session.emailResturant;
    
    res.render("Resturant/addpoint", { 
      name: nameResturant, 
      email: email,
      name: req.session.nameResturant,
      img: req.session.profileResturant,
      point:req.session.point
    });
  }
);

// Upload Point
const storagePoint = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/point/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilterPoint = function (req, file, cb) {
  // Set the filetypes, it is optional
  var filetypes = /jpeg|jpg|png/;
  var mimetype = filetypes.test(file.mimetype);

  var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("ไม่รองรับไฟล์ " + "รองรับเฉพาะไฟล์- " + filetypes));
  }
};

// ภาพไม่เกิน 1 MB
const maxSizePoint = 10 * 1024 * 1024;

let uploadPoint = multer({
  storage: storagePoint,
  fileFilter: fileFilterPoint,
  limits: { fileSize: maxSizePoint },
});

/* Post RegisterResturant listing. */
router.post("/addpoint", uploadPoint.single("point"), (req, res, next) => {
  let id_user = req.session.id_user;
  let id_res = req.session.id_res;
  let fname = req.session.fname;
  let email = req.session.email;
  let point = parseInt(req.body.pointoption);
  let picpoint = req.file.filename;
  let statuspoint = "Order";
  let bankName = req.body.bank_name;
  console.log(point);
  console.log(picpoint);
  console.log(bankName);

  let formpoint = {
    user_id: id_user,
    res_id: id_res,
    name: fname,
    email: email,
    point_earn: point,
    bank_name: bankName,
    point_img: picpoint,
    status: statuspoint
  };
  dbConnection.query("INSERT INTO point_transactions SET ?",[formpoint],(error, results) => {
      if (error) {
        req.flash("error", 'ไม่สามารถเติมพอยต์ได้');
        res.redirect('/resturant/back');
      } else {
        req.flash("message", "รอการนุมัติการเติมพอยต์");
        res.redirect('/resturant/back');
      }
    }
  );
});
/*-------------------------------------------------------ListCustomer---------------------------------------------*/
router.get('/ListCustomer', (req, res, next) => {
  let idRes= req.session.id_res;
  dbConnection.query('SELECT coupon.*,user.*,coupon_user.* FROM coupon JOIN user ON coupon.id_user = user.id_user  JOIN coupon_user ON coupon.cu_id = coupon_user.coupon_id WHERE coupon.status = "Book" AND coupon.id_res_coupon =?',[idRes],(error,userdata) => {
      if (error) {
        req.flash("error", 'ไม่สามารถแสดงรายชื่อลูกค้าที่จองได้');
        res.redirect('/resturant/back');
      } else if(userdata.length<=0){
        res.render('Resturant/ListCustomer',{
          dataUser:'',
          name: req.session.nameResturant,
          img: req.session.profileResturant,
          point:req.session.point
        });
      }else {
        res.render('Resturant/ListCustomer',{
          dataUser:userdata,
          name: req.session.nameResturant,
          img: req.session.profileResturant,
          point:req.session.point
        });
      }
    });
});


//search customer
router.post('/search', (req, res, next) => {
  const query = req.body.searchcode;
  const sql =`SELECT coupon.*,user.*,coupon_user.* FROM coupon JOIN user ON coupon.id_user = user.id_user  JOIN coupon_user ON coupon.cu_id = coupon_user.coupon_id WHERE coupon.status = 'Book' AND coupon.cu_code LIKE ?`;
    dbConnection.query(sql,['%'+ query + '%'],(error,userdata) => {
      if (error) {
        req.flash("error", 'ไม่สามารถแสดงรายชื่อลูกค้าที่จองได้');
        res.redirect('/resturant/back');
      } else if(userdata.length<=0){
        res.render('Resturant/searchList',{
          dataUser:'',
          name: req.session.nameResturant,
          img: req.session.profileResturant,
          point:req.session.point
        });
      }else {
        res.render('Resturant/searchList',{
          dataUser:userdata,
          name: req.session.nameResturant,
          img: req.session.profileResturant,
          point:req.session.point
        });
      }
    });
});


router.get('/ConfirmBook/(:id_user)/(:cu_id)', (req, res, next) => {
  let idUser= req.params.id_user;
  let couponid=req.params.cu_id;
  dbConnection.query('UPDATE coupon_user SET status="Confirm" WHERE coupon_id=? AND user_id=?',[couponid,idUser],(error, results) => {
    if (error) {
      req.flash("error", 'ไม่สามารถแก้ไขสถานะคูปองที่ลูกค้าจองได้');
      res.redirect('/resturant/back');
    } else {
      let detailConfirm={
        status:"Confirm",
        cu_amountcanused:0
      }
      dbConnection.query('UPDATE coupon SET ? WHERE cu_id=? AND id_user=?',[detailConfirm,couponid,idUser],(error, results1) => {
        if (error) {
          req.flash("error", 'ไม่สามารถแก้ไขสถานะคูปองได้');
          res.redirect('/resturant/back');
        } else {
          req.flash("message", "ยืนยันการจองสำเร็จ");
          res.redirect('/resturant/ListCustomer');
        }
        
      });
    }
  });
});

router.get('/CancelBook/(:id_user)/(:cu_id)', (req, res, next) => {
  let idUser= req.params.id_user;
  let couponid=req.params.cu_id;
  dbConnection.query('DELETE FROM coupon_user WHERE coupon_id=? AND user_id=?',[couponid,idUser],(error, results) => {
    if (error) {
      req.flash("error", 'ไม่สามารถแก้ไขสถานะคูปองที่จองได้');
      res.redirect('/resturant/back');
    } else {
      let detailCancel={
        status:"Order",
        cu_amountcanused:1
      }
      dbConnection.query('UPDATE coupon SET ? WHERE cu_id=? AND id_user=?',[detailCancel,couponid,idUser],(error, results1) => {
     
        if (error) {
          req.flash("error", 'ไม่สามารถแก้ไขสถานะคูปองได้');
          res.redirect('/resturant/back');
        } else {
          req.flash("error", "ยกเลิกการจองสำเร็จ");
          res.redirect('/resturant/ListCustomer');
        }
      });


    }
  });
});



/*------------------------------------------------รายงาน------------------------------------------------*/

router.get('/ReportBook', (req, res, next) => {
  res.render('Resturant/ReportBook',{
    name: req.session.nameResturant,
    img: req.session.profileResturant,
    point:req.session.point
  });
});

router.post("/report", (req, res, next) => {
  let idRes = req.session.id_res;
  let start = req.body.startDate;
  let end = req.body.endDate;
  let query = `
  SELECT cu.coupon_id, cu.datebook, cu.timebook,cu.status, u.fname, u.lname, cp.cu_id, cp.name_pro_coupon, cp.price_pro ,res.res_name
  FROM coupon_user cu
  INNER JOIN coupon cp ON cu.coupon_id = cp.cu_id
  INNER JOIN user u ON cu.user_id = u.id_user
  INNER JOIN restaurants res ON cp.id_res_coupon = res.id_res
  WHERE cp.id_res_coupon='${idRes}' AND cu.datebook BETWEEN '${start}' AND '${end}'
`;

  dbConnection.query(query, (error, results) => {

    if (error) {
      req.flash("error", "ผิดพลาดการหารายงาน");
      console.log(error);
      res.redirect('/resturant/back');
    } else if (results.length <= 0) {
      res.render('Resturant/ReportPaper', { 
        bookings: '', 
        totalprice: '',
        nameResturant:'',
        name: req.session.nameResturant,
        img: req.session.profileResturant,
        point:req.session.point
      });
    } else {

      let totalprice = 0;
      results.forEach((coupon) => {
        totalprice += parseFloat(coupon.price_pro);
      });//pont total
      const formattedTotal = totalprice.toLocaleString('en-US')

      let nameResturant= results[0].res_name;//name Resturant
      let startDateForpdf=moment(start).locale('th').format('D MMMM YYYY');
      let endDateForpdf=moment(end).locale('th').format('D MMMM YYYY');

      let data = results.map(row => ({ 
        IDCoupon: row.coupon_id,
        PromotionName: row.name_pro_coupon,
        CouponPrice: parseFloat(row.price_pro).toLocaleString('en-US'),
        NameUser: row.fname,
        LastName: row.lname,
        Date: moment(row.datebook).locale('th').format('D MMMM YYYY'),
        Time:row.timebook
      })); // data To table


      // สร้าง function สำหรับสร้างไฟล์ PDF
      const doc = new jsPDF();


      // add the font to jsPDF
      doc.addFileToVFS("MyFont.ttf", font);
      doc.addFont("MyFont.ttf", "MyFont", "normal");
      doc.setFont("MyFont");

      // สร้าง definition ของไฟล์ PDF
      let width = doc.internal.pageSize.getWidth();
      doc.setFontSize(20);
      doc.text("รายงานการจองโปรโมชั่นของร้าน : "+nameResturant, width / 2, 10, { align: 'center' });
      doc.text("รายงานวันที่ "+startDateForpdf+" ถึงวันที่ "+endDateForpdf, width / 2, 20, { align: 'center' });
      doc.setFontSize(18);
      let dataTableForPDF = {
        startY: 30,
        head: [['รหัสคูปอง', 'ชื่อโปรโมชั่น', 'ราคาคูปอง', 'ชื่อลูกค้า', 'นามสกุล', 'วันที่จอง', 'เวลาที่จอง']],
        body: data.map(row => [
          row.IDCoupon,
          row.PromotionName,
          row.CouponPrice,
          row.NameUser,
          row.LastName,
          row.Date,
          row.Time
      ]),
        styles: { font: 'MyFont',fontSize: 16 }
        
      }

      doc.autoTable(dataTableForPDF);
      let totalPriceTextY = doc.autoTable.previous.finalY + 10; //ระยะห่างระหว่าง dataTable กับ ยอดรวม
      doc.setFontSize(18);
      doc.text("ยอดรวมสุทธิ : " + formattedTotal+" แต้ม", 190, totalPriceTextY, { align: 'right' });
      doc.setFontSize(14);
      doc.text('© สะดวกจอง. All Rights Reserved. By มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา 128 ถ.ห้วยแก้ว ต.ช้างเผือก อ.เมือง จ.เชียงใหม่ 50300', 15, doc.internal.pageSize.getHeight() - 10, { align: 'left' }); //footer 
      doc.save("./public/pdf/Report.pdf");
      res.render('Resturant/ReportPaper', { bookings: results, totalprice: formattedTotal,nameResturant:nameResturant,name: req.session.nameResturant,img: req.session.profileResturant,point:req.session.point });
    }
  })

});




router.get('/pdf', (req, res, next) => {
  const filePath = './public/pdf/Report.pdf';

  // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
  if (fs.existsSync(filePath)) {
    // ส่งไฟล์ PDF กลับให้ผู้ใช้
    res.download(filePath, 'Report.pdf', (err) => {
      if (err) {

        console.error(err);
        res.status(500).send('Error downloading file');
      }
    });
  } else {
    res.status(404).send('File not found');
  }
});


/*------------------------------------------------โปรโมท------------------------------------------------*/
router.get('/promote', (req, res, next) => {
 
  let idrestbPromotion = req.session.id_res;


  dbConnection.query("SELECT * FROM promotion WHERE status='Order' AND id_restb= ? AND boost=0",[idrestbPromotion], (err, rows, fields) => {
    if (err) {
      req.flash("error", "ไม่สามารถไปหน้าโปรโมทได้");
      console.log(err);
      res.redirect('/resturant/back')
    } else {
      res.render('Promote', {
        name: req.session.nameResturant,
        data: rows,
        img: req.session.profileResturant,
        point:req.session.point
      })
    }
  });
});

//checkpoint
router.get('/checkpointPromote/:point', (req, res) => {
  let id =req.session.id_res;
  const { point } = req.params;

  dbConnection.query('SELECT * FROM user WHERE id_restb = ?', [id], (error, results) => {
    if (error) {
      req.flash('message', 'ไม่พบแต้มร้านอาหาร');
      res.redirect("/users/back");
      return;
    }
    if (results.length > 0 ) {
      const userPoint = results[0].user_point;
      if (userPoint < point ) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    } else {
      req.flash('message', 'ไม่พบแต้มร้านอาหาร');
      res.redirect("/users/back");
    }
  });
});

router.get('/promoteSelect/(:id_pro)', (req, res, next) => {
  let idpro=req.params.id_pro;
 


  dbConnection.query(' SELECT * FROM promotion WHERE id_pro= ?' , [idpro], (err, rows, fields) => {
    let idpro=rows[0].id_pro;
    if (err) {
      req.flash("error", "ไม่สามารถแสดงโปรโมชันทีต้องการโปรโมทได้");
      console.log(err);
      res.redirect('/resturant/back')
    } else {
      res.render('Promote/selectBoost', {
        name: req.session.nameResturant,
        data: idpro,
        img: req.session.profileResturant,
        point:req.session.point
      })
    }
  });
});

router.post('/boostpromote/(:id_pro)', (req, res, next) => {
  let idpro=req.params.id_pro;
  let idres=req.session.id_res;
  let daypromote=req.body.dayboost;//จำนวนวันที่เลือก
  let pointboost=req.body.pointboost;
  console.log(daypromote);
  var date = new Date(Date.now());
  var date2 = new Date();

  date2.setTime(date2.getTime() + daypromote * 24 * 60 * 60 * 1000);
  
  console.log(date);
  console.log(date2);

  // Add ten days to specified date
  var sum = date - date2;

  
  
  dbConnection.query(" SELECT * FROM user WHERE id_restb= ?", [idres], (err, rowsuser, fields) => {
    let pointuser=rowsuser[0].user_point;
    if(err){
      req.flash("error", "ไม่สามารถโปรโมทได้");
      res.redirect('/resturant/back')
    }else if(pointuser===0){
      req.flash("error", "แต้มไม่พอในการโปรโมท");
      res.redirect('/resturant/back')
    }else if(pointuser<pointboost){
      req.flash("error", "แต้มไม่พอในการโปรโมท");
      res.redirect('/resturant/back')
    }else{
      let cutpointtopromotion=pointboost/daypromote;

      let cutpointtoRes=pointuser-pointboost;

      req.session.point=cutpointtoRes;
      let formpointtouser={
        user_point:cutpointtoRes
      }
      dbConnection.query("UPDATE user SET ? WHERE id_restb= ?", [formpointtouser,idres], (err, rowsuser, fields) => {
        if(err){
          req.flash("error", "ไม่สามารถโปรโมทได้");
          res.redirect('/resturant/back')
        }else{
          let formboostpromote={
            boost_id_pro:idpro,
            boost_point:cutpointtopromotion,
            boost_day:daypromote,
            boost_start:date,
            boost_end:date2
          }
          dbConnection.query('INSERT INTO boostpromote SET ? ',[formboostpromote],(error, rows) => {
            if(err){
              req.flash("error", "ไม่สามารถโปรโมทได้");
              res.redirect('/resturant/back')
            }else{
              let boostformpromotion={
                boost:cutpointtopromotion
              }
              dbConnection.query('UPDATE promotion SET ? WHERE id_pro= ?',[boostformpromotion,idpro],(error, rows) => {
                if(err){
                  req.flash("error", "ไม่สามารถโปรโมทได้");
                  res.redirect('/resturant/back')
                }else{
                  req.flash("message", "โปรโมทเรียบร้อย");
                  res.redirect('/resturant/back')
                }
              });
            }
          });
        }
      })
    }
  });
});


router.get('/logout', function (req, res, next) {

  req.session.destroy();
  res.redirect('/');
});
module.exports = router;