const express = require("express");
const router = express.Router();
const dbConnection = require("../database/db");
const flash = require("express-flash");
const session = require("express-session");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const { log } = require("console");

function isNotLogin(req, res, next) {
  //check session
  if (!req.session.isLoggedIn) {
    return res.render("FormLogin");
  }
  next();
}

function NOStatusResturant(req, res, next) {
  if (req.session.status === "process") {
    return res.redirect("/users/back");
  }
  next();
}

router.get("/", (req, res) => {
  // render session
  dbConnection.query(
    'SELECT * FROM promotion WHERE status="Order" ORDER BY id_pro ASC ',
    (err, rows) => {
      if (err) {
        req.flash("error", err);
        res.render("User", {
          data: "",
          name: req.session.fname,
          role: req.session.level,
          img: req.session.profile,
          promotion: req.session.promotion || {},
          point: req.session.point,
        });
      } else {
        res.render("User", {
          data: rows,
          name: req.session.fname,
          role: req.session.level,
          img: req.session.profile,
          promotion: req.session.promotion || {},
          point: req.session.point,
        });
      }
    }
  );
});

router.get("/back", (req, res) => {
  // render session

  dbConnection.query(
    'SELECT * FROM promotion WHERE status="Order" ORDER BY id_pro ASC ',
    (err, rows) => {
      if (err) {
        req.flash("error", err);
        res.render("User", {
          data: "",
          name: req.session.fname,
          role: req.session.level,
          name: req.session.fname,
          img: req.session.profile,
          point:req.session.point,
          promotion: req.session.promotion || {}
        });
      } else {
        res.render("User", {
          data: rows,
          name: req.session.fname,
          role: req.session.level,
          name: req.session.fname,
          img: req.session.profile,
          point:req.session.point,
          promotion: req.session.promotion || {}
        });
      }
    }
  );
});

//display FormRegisterResturant page
router.get(
  "/RegisResturant",
  isNotLogin,
  NOStatusResturant,
  function (req, res, next) {
    res.render("User/FormRegisterResturant", {
      name: req.session.fname,
      img: req.session.profile,
      point:req.session.point,
      promotion: req.session.promotion || {}
    });
  }
);

// Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/certificate/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = function (req, file, cb) {
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
const maxSize = 1 * 1000 * 1000;

let upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: maxSize },
});

/* Post RegisterResturant listing. */
router.post("/RegisResturant", upload.single("image"), (req, res, next) => {
  //ที่ดึงมาจากไฟล์ FormRegisterResturant
  let Name = req.body.res_name;
  let Email = req.body.res_email;
  let Adress = req.body.res_address;
  let Phone = req.body.res_phone;
  let StatusResturant = req.body.res_status;
  let Profile = req.body.owner_profile;
  let Owner_Nname = req.body.owner_name;
  let Owner_Lname = req.body.owner_lname;
  let Owner_Email = req.body.owner_email;
  let Owner_Phone = req.body.owner_phone;
  let certificate = req.file.filename;
  let id_user = req.session.id_user;
  let id_userForusertb = req.session.id_user;
  let message = false;
  let Level = "U";
  let Status = "process";

  console.log(Name,Email,Adress,Phone,StatusResturant,Profile,Owner_Nname,Owner_Lname,Owner_Email,Owner_Phone);
  //check email is use
  dbConnection.query(
    "SELECT res_email FROM restaurants WHERE res_email = ? ",
    [Email],
    (error, results) => {
      //เช็ค email ใน resturant ใน resturant
      if (error) {
        error = true;
        req.flash("error", error);
      } else if (results.length > 0) {
        // email resturant in database
        message = true;
        req.flash("message", "มีร้านอาหารนี้ในฐานข้อมูลแล้ว !");
        res.render("User/FormRegisterResturant"); // ไปหน้า resturant พร้อม id_user
      } else {
        dbConnection.query(
          "SELECT MAX(id_res) AS max_id FROM restaurants",
          (error, results, fields) => {
            // หาเลข max id_user ที่มากที่สุดเพื่อเพิ่มค่าให้อีกที
            let currentId = results[0].max_id; //
            let newId = currentId + 1;
            if (error) {
              error = true;
              req.flash("error", error);
            } else {
              let form_data_register_resturant = {
                // ข้อมูลที่เอาเข้า DB Resturant ********************************************
                id_res: newId,
                id_usertb: id_user,
                res_name: Name,
                res_email: Email,
                res_address: Adress,
                res_phone: Phone,
                res_status_resturant: StatusResturant,
                res_owner_profile: Profile,
                res_owner_name: Owner_Nname,
                res_owner_lnam: Owner_Lname,
                res_owner_phone: Owner_Phone,
                res_owner_email: Owner_Email,
                res_profile: "NULL",
                res_certificate: certificate,
                status: Status
                
              };
              dbConnection.query(
                "INSERT INTO restaurants SET ?",
                [form_data_register_resturant],
                (error, results) => {
                  if (error) {
                    req.flash("error", error);
                    res.redirect("/");
                  } else {
                    // req.flash('success','สมัครร้านอาหารเรียบร้อย !');
                    // res.redirect('User');
                    dbConnection.query(
                      "SELECT MAX(id_res) AS max_id FROM restaurants",
                      (error, results, fields) => {
                        // หาเลข max id_user ที่มากที่สุดเพื่อเพิ่มค่าให้อีกที
                        let currentId2 = results[0].max_id; //
                        req.session.id_res = results[0].id_res;

                        if (error) {
                          error = true;
                          req.flash("error", error);
                        } else {
                          dbConnection.query(
                            "UPDATE user SET level = ? , status =?,id_restb = ?  WHERE id_user = ?",
                            [Level, Status, currentId2, id_userForusertb],
                            (error, results) => {
                              if (error) {
                                error = true;
                                req.flash("error", error);
                              } else {
                                dbConnection.query(
                                  "SELECT * FROM user WHERE id_user= ?",[id_userForusertb],(error, rows) => {
                                    if (error) {
                                      req.flash("error", error);
                                    } else {
                                      errors = true;
                                      req.flash(
                                        "success",
                                        "สมัครร้านอาหารเรียบร้อย !"
                                      );
                                      // res.redirect('/users/back')
                                      req.session.destroy();
                                      res.redirect("/");
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

// display Resturant Profile page
router.get("/FormUpdateuUser", isNotLogin, (req, res, next) => {
  req.session.isLoggedIn = true;
  let id_user = req.session.id_user;
  dbConnection.query(
    "SELECT * FROM user WHERE id_user = ? ",
    [id_user],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
      } else if (rows.length <= 0) {
        req.flash("error", "ไม่มีข้อมูลผู้ใช้");
        res.redirect("/users/back");
      } else {
        res.render("User/FormUpdateuUser", {
          id: rows[0].id_user,
          username: rows[0].username,
          password: rows[0].password,
          Name: rows[0].fname,
          Lname: rows[0].lname,
          Email: rows[0].email,
          Phone: rows[0].phone,
          Point: rows[0].user_point,
          img: rows[0].Profile,
          address:rows[0].address,
          name: req.session.fname,
          img: req.session.profile,
          point:req.session.point,
          promotion: req.session.promotion || {}
        });
      }
    }
  );
});

// display Resturant Profile page
router.get("/Profile", isNotLogin, (req, res, next) => {
  req.session.isLoggedIn = true;
  let id_user = req.session.id_user;
  dbConnection.query(
    "SELECT * FROM user WHERE id_user = ? ",
    [id_user],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
      } else if (rows.length <= 0) {
        req.flash("error", "ไม่มีข้อมูลผู้ใช้");
        res.redirect("/users/back");
      } else {
        res.render("User/Profile", {
          id: rows[0].id_user,
          username: rows[0].username,
          password: rows[0].password,
          name: rows[0].fname,
          Lname: rows[0].lname,
          Email: rows[0].email,
          Phone: rows[0].phone,
          point: rows[0].user_point,
          img: rows[0].Profile,
          address:rows[0].address,
          promotion: req.session.promotion || {}
        });
      }
    }
  );
});

// Upload
const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/profile/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilterProfile = function (req, file, cb) {
  // Set the filetypes, it is optional
  var filetypes = /jpeg|jpg|png/;
  var mimetype = filetypes.test(file.mimetype);

  var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new Error("ไม่รองรับไฟล์ " + "รองรับเฉพาะไฟล์- " + filetypes));
};

// ภาพไม่เกิน 1 MB
const maxSizeProfile = 1 * 1000 * 1000;

let uploadProfile = multer({
  storage: storageProfile,
  fileFilter: fileFilterProfile,
  limits: { fileSize: maxSizeProfile },
});

/* Post RegisterResturant listing. */
router.post("/update", uploadProfile.single("Profile"), (req, res, next) => {
  let Name = req.body.name;
  let Lname = req.body.lastname;
  let phone = req.body.phonenumber;
  let Email = req.body.email;
  let profilepic = req.file.filename;
  let message = false;
  let address=req.body.address;
  let updateProfileUser = {
    phone: phone,
    email: Email,
    fname: Name,
    lname: Lname,
    Profile: profilepic,
    address:address
  };

  let id = req.session.id_user;
  dbConnection.query(
    "UPDATE user SET  ? WHERE id_user = ?",[updateProfileUser,id],
    (error, rows) => {
      if (error) {
        req.flash("error", error);
        res.redirect("/users/back");
      } else {
        dbConnection.query(
          "SELECT * FROM user WHERE id_user= ?",[id],
          (error, rows) => {
            req.session.fname = rows[0].fname; // sent&check  session  name
            req.session.profile = rows[0].Profile;
            if (error) {
              req.flash("error", error);
            } else {
              errors = true;
              req.flash("success", "แก้ไขสำเร็จ");
              res.redirect("/users/back");
            }
          }
        );
      }
    }
  );
});

// display Resturant Profile page
router.get("/Changpassword", isNotLogin, (req, res, next) => {
  req.session.isLoggedIn = true;
  let id_user = req.session.id_user;
  dbConnection.query(
    "SELECT * FROM user WHERE id_user = ? ",[id_user],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
      } else if (rows.length <= 0) {
        req.flash("error", "ไม่มีข้อมูลผู้ใช้");
        res.redirect("/users/back");
      } else {
        res.render("User/FormChangpassword", {
          img: rows[0].Profile,
        });
      }
    }
  );
});

/* Post RegisterResturant listing. */
router.post("/changpsw", (req, res, next) => {
  let PassWord = req.body.psw;
  let Confirmpassword = req.body.confpsw;

  if (PassWord !== Confirmpassword) {
    //check password != confirm password
    message = true;
    req.flash("message", "พาสเวิร์ดไม่ตรงกัน");
    res.render("User/FormChangpassword");
  }

  bcrypt.hash(PassWord, 12, function (error, hash) {
    let updatepsw = {
      password: hash,
    };
    let updatepswid = req.session.id_user;
    dbConnection.query(
      "UPDATE user SET  ? WHERE id_user = ?",[updatepswid],
      updatepsw,
      (error, rows) => {
        if (error) {
          req.flash("error", error);
        } else {
          dbConnection.query(
            "SELECT * FROM user WHERE id_user= ?"+[updatepswid],
            (error, rows) => {
              req.session.fname = rows[0].fname; // sent&check  session  name
              req.session.profile = rows[0].Profile;
              if (error) {
                req.flash("error", error);
              } else {
                errors = true;
                req.flash("success", "แก้ไขสำเร็จ");
                res.redirect("/users/back");
              }
            }
          );
        }
      }
    );
  });
});

/* ---------------------------------------------- Cupon Cart -----------------------------------------------*/

//listcoupont
router.get('/coupon-list-user', function (req, res, next) {
  dbConnection.query('SELECT * FROM promotion WHERE status="Order" ORDER BY boost DESC  ', (err, rowspromotion) => {
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
                } else {
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n]);
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
                }
              });
          }
        }
      });

     

      dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order"', (err, total) => {
        let totalcoupon = total[0].total;
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          dbConnection.query('SELECT * FROM coupon WHERE status="Order" ORDER BY cu_id ASC  ', (err, rowscoupon) => {
            if (err) {
              req.flash('error', err);
              res.redirect('/');
            } else {
              res.render('User/coupon-list-user',{
                data:rowspromotion,
                dataCoupon:rowscoupon,
                totalcoupon:totalcoupon,
                name: req.session.fname,
                img: req.session.profile,
                point:req.session.point,
                promotion: req.session.promotion || {}});
            }
          });
        }
      });
    }
  });
});

// Detail Pormotion
router.get('/Detail_promotion/(:id_pro)', (req, res, next) => {
  let id = req.params.id_pro;

  dbConnection.query(' SELECT * FROM promotion WHERE id_pro = ?',[id], (err, rowsPromotion) => {
    let idres=rowsPromotion[0].id_restb;
    if (err) {
      console.log(err);
      req.flash("error", err);
      res.render('User/Detail_promotion',{
        id_pro:'',
        namePromotion:'',
        picPromotion:'',
        idPromotion:'',
        pricePromotion:'',
        dayStart:'',
        dayEnd:'',
        timeStart:'',
        timeEnd:'',
        like:'',
        dataCoupon:'',
        address:'',
        name: req.session.fname,
        img: req.session.profile,
        point:req.session.point,
        promotion: req.session.promotion || {}
      });
    } else { 
      dbConnection.query('SELECT * FROM restaurants WHERE id_res = ?',[idres], (err,rowsResturant) => {
        let address=rowsResturant[0].res_address;
      if (err) {
        console.log(err);
        req.flash("error", err);
        res.render('User/Detail_promotion',{
          id_pro:'',
          namePromotion:'',
          picPromotion:'',
          idPromotion:'',
          pricePromotion:'',
          dayStart:'',
          dayEnd:'',
          timeStart:'',
          timeEnd:'',
          like:'',
          dataCoupon:'',
          address:'',
          name: req.session.fname,
          img: req.session.profile,
          point:req.session.point,
          promotion: req.session.promotion || {}
        });
      } else {
        dbConnection.query('SELECT * FROM coupon WHERE status = "Order" AND id_pro_coupon = ?',[id], (err,rowsCoupon) => {
          if (err) {
            console.log(err);
            req.flash("error", err);
            res.render('User/Detail_promotion',{
              id_pro:'',
              namePromotion:'',
              picPromotion:'',
              idPromotion:'',
              pricePromotion:'',
              dayStart:'',
              dayEnd:'',
              timeStart:'',
              timeEnd:'',
              like:'',
              dataCoupon:'',
              address:'',
              name: req.session.fname,
              img: req.session.profile,
              point:req.session.point,
              promotion: req.session.promotion || {}
            });
          } else {
            res.render('User/Detail_promotion',{
              id_pro:rowsPromotion[0].id_pro,
              namePromotion:rowsPromotion[0].pro_name,
              picPromotion:rowsPromotion[0].pro_image,
              idPromotion:rowsPromotion[0].id_pro,
              pricePromotion:rowsPromotion[0].pro_price,
              dayStart:rowsPromotion[0].date_start,
              dayEnd:rowsPromotion[0].date_end,
              timeStart:rowsPromotion[0].time_start,
              timeEnd:rowsPromotion[0].time_end,
              like:rowsPromotion[0].like,
              dataCoupon:rowsCoupon,
              address:address,
              name: req.session.fname,
              img: req.session.profile,
              point:req.session.point,
              promotion: req.session.promotion || {}
            });
          }
        });
      }
    });
  }
  });
});

router.get("/cart_add/(:cu_id)", isNotLogin, (req, res, next) => {
  let couponId = req.params.cu_id;

  // ตรวจสอบว่า coupon นี้ยังไม่มีอยู่ใน session
  if (
    !req.session.promotion ||
    req.session.promotion.indexOf(couponId) === -1
  ) {
    // เพิ่ม cu_id ลงใน session
    req.session.promotion = req.session.promotion || [];
    req.session.promotion.push(couponId);
    req.flash("success", "เพิ่มในตะกร้าเรียบร้อย");
    console.log("เพิ่มในตะกร้าเรียบร้อย");
    res.redirect("/users/back");
  } else {
    req.flash("success", "มีในตะกร้าเรียบร้อย");
    console.log("มีในตะกร้าเรียบร้อย");
    res.redirect("/users/back");
  }
});

router.get("/cart", isNotLogin, (req, res, next) => {
  if (!req.session.promotion || req.session.promotion.length === 0) {
    req.flash("success", "ในตะกร้าไม่มีโปรโมชัน");
    res.redirect("/users/back");
    console.error("ในตะกร้าไม่มีโปรโมชัน");
  } else {
    let promotion = req.session.promotion;
    dbConnection.query(
      `SELECT * FROM coupon WHERE cu_id IN (${promotion.join(",")})`,
      (error, results) => {
        if (error) {
          console.error("Error querying cart products:", err);
          res.redirect("/users/back");
        }

        // คำนวณราคา coupon ทั้งหมด
        let totalprice = 0;
        results.forEach((coupon) => {
          totalprice += coupon.price_pro;
        });

        // ส่งข้อมูลไปที่หน้า .ejs
        res.render("User/cart", { 
          coupons: results, 
          totalprice,
          name: req.session.fname,
          img: req.session.profile,
          point:req.session.point,
          promotion: req.session.promotion || {} 
        });
      }
    );
  }
});

// รับ request ยืนยันตะกร้า
router.get("/confirmCart", (req, res) => {
  if (!req.session.promotion || req.session.promotion.length === 0) {
    req.flash("error", "Session");
    res.redirect("/users/back");
    console.error("Session ไม่มี");
  } else {
    let promotion = req.session.promotion;
    let id = req.session.id_user;

    dbConnection.query(
      `SELECT * FROM coupon WHERE cu_id IN (${promotion.join(",")})`,
      (error, results) => {
        let idpro=results[0].id_pro_coupon;
        if (error) {
          console.error("Error querying cart products:", error);
          req.flash("error", error);
          res.redirect("/users/back");
        } else {
          // คำนวณราคา coupon ทั้งหมด
          let totalprice = 0;
          results.forEach((coupon) => {
            totalprice += coupon.price_pro;
          });
          dbConnection.query("SELECT * FROM user WHERE id_user= ?" , [id],
            (error, rows) => {
              let userPoint = rows[0].user_point;
              if (error) {
                req.flash("error", error);
                res.redirect("/users/back");
              } else {
                if (userPoint < totalprice) {
                  req.flash("message", "พอยต์ของผู้ใช้ไม่เพียงพอ");
                  res.redirect("/users/back");
                } else {
                  let currentPoint = userPoint - totalprice;
                  req.session.point=currentPoint;
                  let PointBuyCoupon = {
                    user_point: currentPoint,
                  };
                  dbConnection.query("UPDATE user SET ? WHERE id_user =?",
                    [PointBuyCoupon,id],
                    (error, rows2) => {
                      if (error) {
                        req.flash("error", error);
                        res.redirect("/users/back");
                      } else {
                        console.log("แก้ไขพอยต์หลังจากซื้อสำเร็จ");
                        let idList = promotion.join(",");
                        let newValue = "Book";
                        let connectquery = `UPDATE coupon SET status = '${newValue}', id_user ='${id}' WHERE cu_id IN (${idList})`;
                        dbConnection.query(connectquery, (error, rows3) => {
                          if (error) {
                            req.flash("error", error);
                            res.redirect("/users/back");
                          } else {
                            console.log("แก้ไขสถานะคูปองหลังจากซื้อสำเร็จ");
                            console.log("ID", id);
                            console.log("cart", promotion);

                            if (
                              req.session.promotion &&
                              req.session.promotion.length === 1
                            ) {
                              const query = `INSERT INTO coupon_user (user_id, coupon_id,status) VALUES (${id}, ${promotion},'Book')`;

                              // ทำการ execute query
                              dbConnection.query(
                                query,
                                (error, row4, fields) => {
                                  if (error) {
                                    req.flash("error", error);
                                    res.redirect("/users/back");
                                  } else {
                                    console.log("มีคูปองที่จองแล้ว 1 ");
                                    req.flash(
                                      "message",
                                      "คูปองถูกจองเรียบร้อย"
                                    );
                                    delete req.session.promotion;
                                  }
                                }
                              );
                            } else {
                              promotion.forEach((couponId) => {
                                // สร้าง SQL query สำหรับการเพิ่มข้อมูล
                                const query = `INSERT INTO coupon_user (user_id, coupon_id,status) VALUES (${id}, ${couponId}, 'Book')`;

                                // ทำการ execute query
                                dbConnection.query(
                                  query,
                                  (error, row5, fields) => {
                                    if (error) {
                                      req.flash("error", error);
                                      res.redirect("/users/back");
                                    } else {
                                      console.log("มีคูปองที่จองแล้วมากกว่า 1");
                                      req.flash(
                                        "message",
                                        "คูปองถูกจองเรียบร้อย"
                                      );
                                      delete req.session.promotion;
                                      if (
                                        promotion.length === row5.affectedRows
                                      ) {
                                        res.redirect("/users/back");
                                      }
                                    }
                                  }
                                );
                              });
                            }

                            // ตรวจสอบว่าทุก record ในตาราง coupon มี status เป็น "Book" หรือไม่
                            dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status != "Book" AND id_pro_coupon=?',[idpro],(error, CouponResults, fields) => {
                                if (error) {
                                  req.flash("error", error);
                                  res.redirect("/users/back");
                                }

                                const total = CouponResults[0].total;

                                // ถ้าทุก record มี status เป็น "Book"
                                if (total === 0) {
                                  // อัปเดตข้อมูลในตาราง promotion เป็น "off"
                                  dbConnection.query('UPDATE promotion SET status = "Off" WHERE id_pro=?',[idpro],(updateError,updateResults,updateFields
                                    ) => {
                                      if (updateError) {
                                        req.flash("error", updateError);
                                        res.redirect("/users/back");
                                      }
                                      console.log(
                                        'Updated promotion status to "off"'
                                      );
                                      res.redirect("/users/back");
                                    }
                                  );
                                } else {
                                  res.redirect("/users/back");
                                  console.log(
                                    'Coupon status is not all "Book", no update needed.'
                                  );
                                }
                              }
                            );
                          }
                        });
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    );
  }
});

// รับ request ล้างตะกร้า
router.get("/clear-cart", (req, res) => {
  delete req.session.promotion;
  res.redirect("/users/back");
});

router.get("/remove/(:cu_id)", (req, res) => {
  const cu_id = req.params.cu_id;

  // ตรวจสอบว่าตะกร้าไม่ว่าจะว่างหรือไม่
  if (!req.session.promotion || req.session.promotion.length === 0) {
    req.flash("message", "ในตะกร้าไม่มีคูปอง");
    res.redirect("/users/cart");
    return;
  }

  // ตรวจสอบว่า coupon นี้อยู่ในตะกร้าหรือไม่
  const index = req.session.promotion.indexOf(cu_id);
  if (index !== -1) {
    // ลบ coupon ออกจากตะกร้า
    req.session.promotion.splice(index, 1);
    req.flash("message", "ลบโปรโมชันในตะกร้าสำเร็จ");
    res.redirect("/users/cart");
  } else {
    req.flash("error", "หาคูปองในตะกร้าไม่เจอ");
    res.redirect("/users/cart");
  }
});
/*-----------------------------------------------------------point-----------------------------------------------------------*/
router.get(
  "/formaddpoint",
  isNotLogin,
  NOStatusResturant,
  function (req, res, next) {
    let fname = req.session.fname;
    let email = req.session.email;
    res.render("User/addpoint", { 
      name: fname, 
      email: email,
      name: req.session.fname,
      img: req.session.profile,
      point:req.session.point,
      promotion: req.session.promotion || {} 
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
const maxSizePoint = 1 * 1000 * 1000;

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
    status: statuspoint,
  };
  dbConnection.query(
    "INSERT INTO point_transactions SET ?",[formpoint],(error, results) => {
      if (error) {
        req.flash("error", error);
        res.redirect("/users/back");
      } else {
        console.log(results);
        req.flash("message", "รอการนุมัติการเติมพอยต์");
        res.redirect("/users/back");
      }
    }
  );
});

router.get("/HistoryAddpoint",isNotLogin,NOStatusResturant,function (req, res, next) {
  let id_user = req.session.id_user;
    dbConnection.query("SELECT * FROM point_transactions WHERE user_id =?",[id_user],(error, results) => {
      if(error){
        req.flash("error", error);
        res.redirect("/users/back");
      }else{
        res.render("User/HistoryAddpoint", { 
          data: results,
          name: req.session.fname,
          img: req.session.profile,
          point:req.session.point,
          promotion: req.session.promotion || {} 
        });
      }
    });
    
  }
);

/*-----------------------------------------------------------Coupon User -----------------------------------------------------------*/
router.get(
  "/bookCoupon",
  isNotLogin,
  NOStatusResturant,
  function (req, res, next) {
    let id_user = req.session.id_user;

    dbConnection.query(
      "SELECT COUNT(*) AS total_coupons FROM coupon_user INNER JOIN coupon ON coupon_user.coupon_id = coupon.cu_id WHERE coupon_user.user_id = ?",[id_user],
      (err, rows) => {
        let total_coupons = rows[0].total_coupons;
        if (err) {
          req.flash("error", err);
          res.redirect("/users/back");
        } else {
          dbConnection.query("SELECT * FROM coupon INNER JOIN coupon_user ON  coupon.cu_id =  coupon_user.coupon_id  WHERE  coupon.id_user = ?",[id_user],(err, result) => {
              if (err) {
                req.flash("error", err);
                res.redirect("/users/back");
              } else if(result.length<=0){
                res.render("User/bookCoupon", {
                  data: '',
                  totalCoupon: '',
                  address: '',
                  name: req.session.fname,
                  img: req.session.profile,
                  point:req.session.point,
                  promotion: req.session.promotion || {}
                });
              }else{
                let idpro = result[0].id_pro_coupon;
                dbConnection.query(
                  "SELECT * FROM promotion WHERE id_pro = ?",[idpro],
                  (err, rowspromotion) => {
                    let idres = rowspromotion[0].id_restb;
                    if (err) {
                      req.flash("error", err);
                      res.redirect("/users/back");
                    } else {
                      dbConnection.query(
                        "SELECT * FROM restaurants WHERE id_res = ?",[idres],
                        (err, rowResturants) => {
                          let addressResturants = rowResturants[0].res_address;
                          if (err) {
                            req.flash("error", err);
                            res.redirect("/users/back");
                          } else {
                            res.render("User/bookCoupon", {
                              data: result,
                              totalCoupon: total_coupons,
                              address: addressResturants,
                              name: req.session.fname,
                              img: req.session.profile,
                              point:req.session.point,
                              promotion: req.session.promotion || {}
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  }
);

router.post("/like_count/(:id_pro)",(req, res, next) => {
  let idUser=req.session.id_user;
  let idpro=req.params.id_pro;
  console.log("idPRO :" ,idpro);
  dbConnection.query("SELECT * FROM promotion WHERE id_pro =?",[idpro],(error, results) => {
    let like_count = results[0].like;
    console.log("SELECT :",like_count);
    if(error){
      req.flash("error", error);
      res.redirect("/users/back");
    }else{
      let formlike={
        like:like_count+1
      }
      dbConnection.query("UPDATE promotion SET ? WHERE id_pro =?",[formlike,idpro],(error, like) => {
        console.log("UPDATE :",like);
        if(error){
          req.flash("error", error);
          res.redirect("/users/back");
        }else{
          res.redirect("/users/back");
        }
      });
    }

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
                } else {
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n]);
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
                }
              });
          }
        }
      });

     

      dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND price_pro <= 200 ', (err, total) => {
        let totalcoupon = total[0].total;
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          dbConnection.query('SELECT * FROM coupon WHERE status="Order" AND price_pro <= 200  ORDER BY cu_id ASC  ', (err, rowscoupon) => {
            if (err) {
              req.flash('error', err);
              res.redirect('/');
            } else {
              res.render('User/point200',{
                data:rowspromotion,
                dataCoupon:rowscoupon,
                totalcoupon:totalcoupon,
                name: req.session.fname,
                img: req.session.profile,
                point:req.session.point,
                promotion: req.session.promotion || {} 
              });
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
                } else {
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n]);
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
                }
              });
          }
        }
      });

     

      dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND price_pro <= 500 ', (err, total) => {
        let totalcoupon = total[0].total;
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          dbConnection.query('SELECT * FROM coupon WHERE status="Order" AND price_pro <= 500  ORDER BY cu_id ASC  ', (err, rowscoupon) => {
            if (err) {
              req.flash('error', err);
              res.redirect('/');
            } else {
              res.render('User/point500',{
                data:rowspromotion,
                dataCoupon:rowscoupon,
                totalcoupon:totalcoupon,
                name: req.session.fname,
                img: req.session.profile,
                point:req.session.point,
                promotion: req.session.promotion || {} 
              });
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
                } else {
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n]);
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
                }
              });
          }
        }
      });

     

      dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND price_pro <= 1000 ', (err, total) => {
        let totalcoupon = total[0].total;
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          dbConnection.query('SELECT * FROM coupon WHERE status="Order" AND price_pro <= 1000  ORDER BY cu_id ASC  ', (err, rowscoupon) => {
            if (err) {
              req.flash('error', err);
              res.redirect('/');
            } else {
              res.render('User/point1000',{
                data:rowspromotion,
                dataCoupon:rowscoupon,
                totalcoupon:totalcoupon,
                name: req.session.fname,
                img: req.session.profile,
                point:req.session.point,
                promotion: req.session.promotion || {} 
              });
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
                } else {
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n]);
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
                }
              });
          }
        }
      });

     

      dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND type_pro_coupon="โปรโมชั่นส่วนลดพิเศษ" ', (err, total) => {
        let totalcoupon = total[0].total;
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          dbConnection.query('SELECT * FROM coupon WHERE status="Order" AND type_pro_coupon="โปรโมชั่นส่วนลดพิเศษ"  ORDER BY cu_id ASC  ', (err, rowscoupon) => {
            if (err) {
              req.flash('error', err);
              res.redirect('/');
            } else {
              res.render('User/cat_discount',{
                data:rowspromotion,
                dataCoupon:rowscoupon,
                totalcoupon:totalcoupon,
                name: req.session.fname,
                img: req.session.profile,
                point:req.session.point,
                promotion: req.session.promotion || {} 
              });
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
                } else {
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n]);
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
                }
              });
          }
        }
      });

     

      dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภทราคาพิเศษ" ', (err, total) => {
        let totalcoupon = total[0].total;
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          dbConnection.query('SELECT * FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภทราคาพิเศษ"  ORDER BY cu_id ASC  ', (err, rowscoupon) => {
            if (err) {
              req.flash('error', err);
              res.redirect('/');
            } else {
              res.render('User/cat_specialprice',{
                data:rowspromotion,
                dataCoupon:rowscoupon,
                totalcoupon:totalcoupon,
                name: req.session.fname,
                img: req.session.profile,
                point:req.session.point,
                promotion: req.session.promotion || {} 
              });
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
                } else {
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n]);
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
                }
              });
          }
        }
      });

     

      dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภท1แถม1" ', (err, total) => {
        let totalcoupon = total[0].total;
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          dbConnection.query('SELECT * FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภท1แถม1"  ORDER BY cu_id ASC  ', (err, rowscoupon) => {
            if (err) {
              req.flash('error', err);
              res.redirect('/');
            } else {
              res.render('User/cat_onefreeone',{
                data:rowspromotion,
                dataCoupon:rowscoupon,
                totalcoupon:totalcoupon,
                name: req.session.fname,
                img: req.session.profile,
                point:req.session.point,
                promotion: req.session.promotion || {} 
              });
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
                } else {
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n]);
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
                }
              });
          }
        }
      });

     

      dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภทแลกของฟรี" ', (err, total) => {
        let totalcoupon = total[0].total;
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          dbConnection.query('SELECT * FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภทแลกของฟรี"  ORDER BY cu_id ASC  ', (err, rowscoupon) => {
            if (err) {
              req.flash('error', err);
              res.redirect('/');
            } else {
              res.render('User/cat_tradefree',{
                data:rowspromotion,
                dataCoupon:rowscoupon,
                totalcoupon:totalcoupon,
                name: req.session.fname,
                img: req.session.profile,
                point:req.session.point,
                promotion: req.session.promotion || {} 
              });
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
                } else {
                  let date = new Date(Date.now());
                  let date2 = boost[n].boost_end;
                  console.log("วันปัจจุบัน : ",date);
                  console.log("วันหมดอายุ : ",date2);

                  let sum = date - date2 ;
                  // console.log("ลบกัน : "+sum);
                  // console.log(boost[n]);
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
                }
              });
          }
        }
      });

     

      dbConnection.query('SELECT COUNT(*) AS total FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภทกินฟรี" ', (err, total) => {
        let totalcoupon = total[0].total;
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          dbConnection.query('SELECT * FROM coupon WHERE status="Order" AND type_pro_coupon="ประเภทกินฟรี"  ORDER BY cu_id ASC  ', (err, rowscoupon) => {
            if (err) {
              req.flash('error', err);
              res.redirect('/');
            } else {
              res.render('User/cat_eatfree',{
                data:rowspromotion,
                dataCoupon:rowscoupon,
                totalcoupon:totalcoupon, 
                name: req.session.fname,
                img: req.session.profile,
                point:req.session.point,
                promotion: req.session.promotion || {} });
            }
          });
        }
      });
    }
  });
});

// หน้าติดต่อเรา
router.get('/contact', (req, res) => {
  const address = {address: 'เชียงใหม่ ,ประเทศไทย'};
  const email = {email: 'test@gmail.com'};
  const tel = {tel: '0897878787'};
    

  res.render("User/contact", {
    address,
    email,
    tel,
    name: req.session.fname,
    img: req.session.profile,
    point:req.session.point,
    promotion: req.session.promotion || {}
  });
});

module.exports = router;
