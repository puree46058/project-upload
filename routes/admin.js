let express = require('express');
let router = express.Router();
let dbConnection = require('../database/db');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const fs = require('fs');
const moment = require('moment');
const { jsPDF } = require("jspdf");
const autoTable = require("jspdf-autotable");
const font = require("../public/Font/Sarabun-Regular-normal.js");

function isNotLogin(req, res, next) { //check session 
    if (!req.session.isLoggedIn) {
        return res.render('FormLogin');
    }
    next();
}

//display dash bord page
router.get('/', isNotLogin, (req, res, next) => {
    let status = 'success';
    dbConnection.query('SELECT * FROM restaurants WHERE status = ? ORDER BY res_id ASC', [status], (err, rows) => {
        let data = rows;
        if (err) {
            req.flash('error', err);
            res.render('adminn', { data: '',dataNew: '',img: req.session.profile, name: req.session.fname });
        } else {

            dbConnection.query('SELECT * FROM restaurants WHERE status = ? ORDER BY res_id DESC', [status], (err, result) => {
                if (err) {
                    req.flash('error', err);
                    res.render('adminn', { dataNew: '', data: '',img: req.session.profile, name: req.session.fname });
                } else {
                    res.render('adminn', { dataNew: result, data: rows,img: req.session.profile, name: req.session.fname, data });
                }
            })
        }
    })
})

//display dash bord page
router.get('/HistoryWebsite', isNotLogin, (req, res, next) => {
    dbConnection.query('SELECT COUNT(*) AS visitCount FROM historyviews', (err, rows) => {
        if (err) {
            req.flash("error", "ระบบผิดพลาดโปรดแจ้งผู้ดูแลระบบ");
            res.render('adminn/HistoryWebsite', { visitCount: ''.visitCount, img: req.session.profile, name: req.session.fname, data: '' });
        } else {

            const currentPage = req.query.page || 1; // หากไม่ได้รับค่าหน้ามาให้เป็นหน้าที่ 1
            const perPage = 6; // จำนวนข้อมูลต่อหน้า
            const offset = (currentPage - 1) * perPage;
            const sql =`SELECT * FROM point_transactions LIMIT ${perPage}  OFFSET ${offset}`;
      
            dbConnection.query(sql,(error, results) => {
                if(error){
                  req.flash("error", "ระบบผิดพลาดโปรดแจ้งผู้ดูแลระบบ");
                  res.redirect('/admin/mainadmin');
                }else{
                    res.render('adminn/HistoryWebsite', { visitCount: rows[0].visitCount, img: req.session.profile, name: req.session.fname, data: results,currentPage:currentPage,perPage:perPage });
                }
              });
            
        }

    });


})


//display Admin page
router.get('/mainadmin', isNotLogin, (req, res, next) => {
    let status = 'success';
    dbConnection.query('SELECT * FROM restaurants WHERE status = ? ORDER BY res_id ASC', [status], (err, rows) => {
        let data = rows;
        if (err) {
            req.flash('error', err);
            res.render('adminn', { data: '',dataNew: '',img: req.session.profile, name: req.session.fname });
        } else {

            dbConnection.query('SELECT * FROM restaurants WHERE status = ? ORDER BY res_id DESC', [status], (err, result) => {
                if (err) {
                    req.flash('error', err);
                    res.render('adminn', { dataNew: '', data: '',img: req.session.profile, name: req.session.fname });
                } else {
                    res.render('adminn', { dataNew: result, data: rows,img: req.session.profile, name: req.session.fname, data });
                }
            })
        }
    })
})


//display AdminUser
router.get('/AdminUser', isNotLogin, (req, res, next) => {
    dbConnection.query('SELECT * FROM user ORDER BY id ASC', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('AdminUser', { data: '', img: req.session.profile, name: req.session.fname });
        } else {
            res.render('AdminUser', { data: rows, img: req.session.profile, name: req.session.fname });
        }

    })
})

//display AdminResturant
router.get('/AdminResturant', isNotLogin, (req, res, next) => {
    let status = 'success';
    dbConnection.query('SELECT * FROM restaurants WHERE status = ? ORDER BY res_id ASC', [status], (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('AdminResturant', { data: '', img: req.session.profile, name: req.session.fname });
        } else {
            res.render('AdminResturant', { data: rows, img: req.session.profile, name: req.session.fname });
        }

    })
})

/*----------------------------------------------ส่วนเช็คสถานะร้านอาหาร---------------------------------------------------------*/

//display AdminStatusResturant
router.get('/AdminStatusResturant', isNotLogin, (req, res, next) => {
    let status = 'process';
    dbConnection.query('SELECT * FROM restaurants WHERE status = ? ORDER BY id_res ASC', [status], (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('AdminCheckStatus', { data: '', img: req.session.profile, name: req.session.fname });
        } else {
            res.render('AdminCheckStatus', { data: rows, img: req.session.profile, name: req.session.fname });
        }

    })
})

//display AdminStatusResturant
router.get('/tableStatus', isNotLogin, (req, res, next) => {
    let status = 'process';
    dbConnection.query('SELECT * FROM restaurants WHERE status = ? ORDER BY id_res ASC', [status], (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('AdminCheckStatus', { data: '', img: req.session.profile, name: req.session.fname });
        } else {
            res.render('AdminCheckStatus', { data: rows, img: req.session.profile, name: req.session.fname });
        }

    })
})

// ConfirmStatus Resturant
router.get('/confirmStatus/(:id_res)', isNotLogin, (req, res, next) => {
    let id = req.params.id_res;
    let updateStatusResturantFromtableUser = {
        level: 'R',
        status: 'success'
    }
    let updateResturantStatusFromtableResturant = {
        status: 'success'
    }
    dbConnection.query('UPDATE user SET ? WHERE id_restb = ?',[updateStatusResturantFromtableUser,id], (err, result) => {
        if (err) {
            req.flash('error', 'เพิ่มร้านอาหารไม่สำเร็จ'),
                res.redirect('/admin/tableStatus');
            // res.render('AdminStatusResturant', { data: result });
        } else {
            dbConnection.query('UPDATE restaurants SET ? WHERE id_res =?', [updateResturantStatusFromtableResturant,id], (err, rows) => {
                if (err) {
                    req.flash('error', err);
                    res.redirect('/admin/tableStatus');
                } else {
                    req.flash("success", "ยืนยันสถานะร้านอาหารสำเร็จ");
                    res.redirect('/admin/tableStatus');
                }
            })
        }
    })
})


// Cancle Status  Resturant
router.get('/cancleStatus/(:id_res)', isNotLogin, (req, res, next) => {
    let id = req.params.id_res;
    let defaultidrestb = 0;
    dbConnection.query('SELECT * FROM user WHERE id_restb =?',[id], (err, result) => {
        let iduser = result[0].id_user;
        if (err) {
            req.flash('error', err),
                res.redirect('/admin/tableStatus');
        } else {
            let updatebrhideDelete = {
                status: 'success',
                id_restb: defaultidrestb
            }
            dbConnection.query('UPDATE user SET ? WHERE id_user = ?', [updatebrhideDelete,iduser], (error, results) => {
                if (error) {
                    error = true;
                    req.flash('error', error);
                } else {
                    req.flash('success', 'User UPDATE successfully! ID = ' + id);
                    dbConnection.query('SELECT * FROM restaurants ORDER BY res_id ', (err, rows) => {
                        if (err) {
                            req.flash('error', err);
                            res.redirect('/admin/tableStatus');
                        } else {
                            req.flash('success', 'ไม่ผ่านสถานะร้านอาหาร !');
                            res.redirect('/admin/tableStatus');

                        }
                    })
                }
            })

        }
    })

    dbConnection.query('DELETE FROM restaurants WHERE id_res = ?' ,[id], (err, result) => {

        if (err) {
            req.flash('error', err),
                res.redirect('/admin/tableStatus');
        } else {
            req.flash('success', 'ลบสำเร็จ !');
            
        }
    })
})
/*----------------------------------------------ปิด ส่วนเช็คสถานะร้านอาหาร---------------------------------------------------------*/




//display first go to table users page
router.get('/table', isNotLogin, (req, res, next) => {
    dbConnection.query('SELECT * FROM user ORDER BY id ASC', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('AdminUser', { 
                data: '', 
                img: req.session.profile,  
                name: req.session.fname 
            });

        } else {
            res.render('AdminUser', { 
                data: rows, 
                img: req.session.profile, 
                name: req.session.fname 
            });
        }

    })
})

//display first go to Resturant page
router.get('/tableResturant', isNotLogin, (req, res, next) => {
    dbConnection.query('SELECT * FROM restaurants ORDER BY res_id ASC', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('AdminResturant', { data: '' });

        } else {
            res.render('AdminResturant', { data: rows, img: req.session.profile, name: req.session.fname });
        }

    })
})


//display add user 
router.get('/add', isNotLogin, (req, res, next) => {

    res.render('AdminUser/add', {
        username: '',
        password: '',
        fname: '',
        lname: '',
        email: '',
        phone: '',
        img: req.session.profile, 
        name: req.session.fname
    })
})





//add new user
router.post('/add', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let phone = req.body.phonenumber;
    let level = 'U';
    let status = "success";
    let errors = false;

    if (username.length === 0 || password.length === 0 || fname.length === 0 || lname.length === 0 || email.length === 0 || phone.length === 0) {
        errors = true;
        // set flash message
        req.flash('error', 'Please enter name and author');
        // render to add.ejs with flash message
        res.render('AdminUser/add', {
            username: username,
            password: password,
            fname: fname,
            lname: lname,
            email: email,
            phone: phone,
            img: req.session.profile, 
            name: req.session.fname
        })
    }

    // if no error
    if (!errors) {
        dbConnection.query('SELECT MAX(id_user) AS max_id FROM user', (error, results, fields) => { // หาเลข max id_user ที่มากที่สุดเพื่อเพิ่มค่าให้อีกที
            let currentId = results[0].max_id // 
            let newId = currentId + 1;
        bcrypt.hash(password, 12, function (error, hash) {
            let form_dataInsert = { // ข้อมูลที่เอาเข้า DB 
                id_user:newId,
                username: username,
                password: hash,
                email: email,
                phone: phone,
                fname: fname,
                lname: lname,
                level: level,
                status:status,
                Profile: 'NULL',
                address:'NULL'

            }
            dbConnection.query('INSERT INTO user SET ?', [form_dataInsert], (error, results) => {
                if (error) {
                    req.flash('error', error);
                    res.render('AdminUser/add', {
                        username: form_data.username,
                        password: form_data.password,
                        fname: form_data.fname,
                        lname: form_data.lname,
                        email: form_data.email,
                        phone: form_data.phone,
                        img: req.session.profile, 
                        name: req.session.fname
                    })
                } else {
                    
                    dbConnection.query('SELECT * FROM user ORDER BY id ', (err, rows) => { // ส่งค่าข้อมูลที่เพิ่ม พร้อมยังใช้ session แรกที่เข้าสู่ระบบ
                        if (err) {
                            req.flash('error', err);
                            res.redirect('/admin/table');
                        } else {
                            req.flash('success', 'เพิ่มข้อมูลผู้ใช้ ');
                            res.redirect('/admin/table');
                        }
                    })
                }
            });
        });
        })

    } else {
        req.flash('error', errors);
        res.redirect('/admin/table');
    }
})

// display edit User page
router.get('/edit/(:id)', isNotLogin, (req, res, next) => {
    let id = req.params.id;
    req.session.isLoggedIn = true;
    dbConnection.query('SELECT * FROM user WHERE id = ?',[id], (err, rows, fields) => {
        if (rows.length <= 0) {
            req.flash('error', 'หาผู้ใช้ไอดี= ' + id+'ไม่ได้');
            res.redirect('/AdminUser');
        } else {
            res.render('AdminUser/edit', {
                title: 'Edit user',
                id: rows[0].id,
                username: rows[0].username,
                password: rows[0].password,
                fname: rows[0].fname,
                lname: rows[0].lname,
                email: rows[0].email,
                img: rows[0].Profile,
                phone: rows[0].phone,
                name: req.session.fname
            })
        }
    });
})

// Upload
const storageProfile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/profile/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilterProfile = function (req, file, cb) {

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
const maxSizeProfile = 1 * 1000 * 1000;

let uploadProfile = multer({ storage: storageProfile, fileFilter: fileFilterProfile, limits: { fileSize: maxSizeProfile }, });
// Post update User page
router.post('/update/:id', uploadProfile.single('image'), (req, res, next) => {
    let id = req.params.id;
    let username = req.body.username;
    let password = req.body.password;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let phone = req.body.phonenumber;
    let profile = req.file.filename;
    let level = 'U';
    let errors = false;

    if (username.length === 0 || password.length === 0 || fname.length === 0 || lname.length === 0 || email.length === 0) {
        errors = true;
        req.flash('error', 'โปรดกรอกข้อมูลให้ครบ');
        res.render('AdminUser/edit', {
            id: req.params.id,
            username: username,
            password: password,
            fname: fname,
            lname: lname,
            email: email,
            phone: phone,
            Profile: profile,
            name: req.session.fname
        })
    }

    // if no error
    if (!errors) {
        bcrypt.hash(password, 12, function (error, hash) {
            let form_data = {
                username: username,
                password: hash,
                email: email,
                fname: fname,
                lname: lname,
                level: level,
                Profile: 'NULL',
                phone: phone,
                Profile: profile
            };

            dbConnection.query('UPDATE user SET ? WHERE id = ?', [form_data,id], (error, results) => {
                if (error) {
                    req.flash('error', error);
                    res.render('AdminUser/edit', {
                        username: form_data.username,
                        password: form_data.password,
                        fname: form_data.fname,
                        lname: form_data.lname,
                        email: form_data.email,
                        phone: form_data.phone,
                        img: form_data.Profile,
                        name: req.session.fname
                    });
                } else {
                    req.flash('success', 'แก้ไขข้อมูลสำเร็จ ');

                    // Redirect back to /table after a successful update
                    res.redirect('/admin/table');

                }
            });
        });
    } else {
        req.flash('success', 'แก้ไขข้อมูลไม่สำเร็จ ');
        res.redirect('/admin/table');
    }
});


// delete User
router.get('/delete/(:id)', isNotLogin, (req, res, next) => {
    let id = req.params.id;

    dbConnection.query('DELETE FROM user WHERE id_user = ?',[id], (err, result) => {
        if (err) {
            req.flash('error', err),
                res.render('AdminUser', { 
                    data: result,
                    img: req.session.profile,
                    name: req.session.fname
                 });
        } else {
            
            dbConnection.query('SELECT * FROM user ORDER BY id ', (err, rows) => {
                if (err) {
                    req.flash('error', err);
                    res.redirect('/admin/table');
                } else {
                    req.flash('success', 'ลบไอดีผู้ใช้ = ' + id+'สำเร็จ');
                    res.redirect('/admin/table');
                }
            })
        }
    })
})

/* เพิ่มพอยต์ให้ผู้ใช้ */
router.post('/AddPointUser/(:id_user)', isNotLogin, (req, res, next) => {
    let id = req.params.id_user;
    let idUser = req.params.id_user;
    let point =parseInt(req.body.pointAdd);
    dbConnection.query('SELECT * FROM user WHERE id_user = ? ', [id], (err, rows, fields) => {
        let PointUser=rows[0].user_point;
        if (err) {
            console.log(err);
            res.redirect('/admin/AdminUser');
        } else {
            let CurrentPoint =PointUser+point;
            let FormPoint={
                user_point:CurrentPoint
            }
            dbConnection.query('UPDATE user SET ? WHERE id_user =?',[FormPoint,idUser],(err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.redirect('/admin/AdminUser');
                } else {
                    req.flash('success','เพิ่มพอยต์ให้ผู้ใช้สำเร็จ')
                    res.redirect('/admin/AdminUser');
                }
            });
        }
    });

})

/* ลดพอยต์ให้ผู้ใช้ */
router.post('/MinusPointUser/(:id_user)', isNotLogin, (req, res, next) => {
    let id = req.params.id_user;
    let idRes = req.params.id_user;
    let point =parseInt(req.body.pointMinus);
    dbConnection.query('SELECT * FROM user WHERE id_user = ? ', [id], (err, rows, fields) => {
        let PointUser=rows[0].user_point;
        if (err) {
            console.log(err);
            res.redirect('/admin/AdminUser');
        } else {
            if(PointUser<point){
                req.flash("พอยต์ของผู้ใช้น้อยเกินกว่าจะลดได้แล้ว")
                res.redirect('/admin/AdminUser');
            }else{
                let CurrentPoint =PointUser-point;
            let FormPoint={
                user_point:CurrentPoint
            }
            dbConnection.query('UPDATE user SET ? WHERE id_user =?',[FormPoint,idRes],(err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.redirect('/admin/AdminUser');
                } else {
                    req.flash('success','ลดพอยต์ให้ผู้ใช้สำเร็จ')
                    res.redirect('/admin/AdminUser');
                }
            });
            }
            
        }
    });

})

/*----------------------------------------------ส่วนร้านอาหาร---------------------------------------------------------*/



// display Resturant Profile page
router.get('/ProfileResturant/(:id_res)', isNotLogin, (req, res, next) => {

    req.session.isLoggedIn = true;
    let id_resshow = req.params.id_res;
    let idUSer = req.params.id_res;
    dbConnection.query('SELECT * FROM user WHERE id_restb = ?', [idUSer], (err, results, fields) => {
        let pointres = results[0].user_point;
        if (err) {
            req.flash('error', 'หาผู้ใช้ไอดี' + idUSer+'ไม่พบ')
            res.redirect('mainadmin');
        } else {
            let idusername = results[0].username;
            let passusername = results[0].password;
            dbConnection.query('SELECT * FROM restaurants WHERE id_res = ? ', [id_resshow], (err, rows, fields) => {
                if (err) {
                    console.log(err);
                } else if (rows.length <= 0) {
                    req.flash('error', 'ไม่มีข้อมูลผู้ใช้')
                    res.redirect('mainadmin');
                } else {

                    res.render('AdminResturant/ProfileResturant', {

                        id: rows[0].id_res,
                        Name: rows[0].res_name,
                        Email: rows[0].res_email,
                        Phone: rows[0].res_phone,
                        adress: rows[0].res_address,
                        StatusResturant: rows[0].res_status_resturant,
                        Profile: rows[0].res_owner_profile,
                        Owner_Name: rows[0].res_owner_name,
                        Owner_Lname: rows[0].res_owner_lnam,
                        Owner_Email: rows[0].res_owner_email,
                        Owner_Phone: rows[0].res_owner_phone,
                        ProfileResturant: rows[0].res_profile,
                        certificate: rows[0].res_certificate,
                        point: pointres,
                        idshow: idusername,
                        passshow: passusername,
                        img: req.session.profile,
                        name: req.session.fname
                    })
                }
            });
        }
    });

})




// display edit User page
router.get('/editResturant/(:id_res)', isNotLogin, (req, res, next) => {
    let id = req.params.id_res;
    req.session.isLoggedIn = true;
    dbConnection.query('SELECT * FROM restaurants WHERE id_res = ?' , [id], (err, rows, fields) => {
        if (rows.length <= 0) {
            req.flash('error', 'แก้ไขไอดีผู้ใช้ไม่สำเร็จ')
            res.redirect('/AdminResturant');
        } else {
            res.render('AdminResturant/editResturant', {
                nameres:rows[0].res_name,
                id: rows[0].id_res,
                img: rows[0].res_profile,
                cer: rows[0].res_certificate,
                id_pro: rows[0].id_pro,
                img: req.session.profile,
                name: req.session.fname
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

    cb("ไม่รองรับไฟล์ " + "รองรับเฉพาะไฟล์- " + filetypes);
}

// ภาพไม่เกิน 1 MB
const maxSizeResturant = 1 * 1000 * 1000;

let uploadProfileResturant = multer({ storage: storageResturant, fileFilter: fileFilterResturant, limits: { fileSize: maxSizeResturant }, });


// Post update User page
router.post('/updateResturant/:id_res', uploadProfileResturant.single('Profile'), (req, res, next) => {

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
    let res_profile = req.file.filename;


    var updateProfileRes = {
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
        res_profile: res_profile,

    }
    let id = req.params.id_res;
    dbConnection.query('UPDATE restaurants SET ? WHERE id_res = ?' , [updateProfileRes,id], (error, rows) => {
        if (error) {
            req.flash('error', 'แก้ไขไม่สำเร็จ');
        } else {
            req.flash('success', 'แก้ไขสำเร็จ');
            res.redirect('/admin/tableResturant')
        }
    })


});

/* ใบประกอบกิจการ */
router.get('/CertificateResturant/(:id_res)', isNotLogin, (req, res) => {

    let id = req.params.id_res;
    dbConnection.query('SELECT * FROM restaurants WHERE id_res = ? ', [id], (err, rows, fields) => {
        if (err) {
            console.log(err);
        } else if (rows.length <= 0) {
            req.flash('error', 'ไม่มีข้อมูลผู้ใช้')
            res.redirect('AdminResturant');
        } else {
            res.render('AdminResturant/CertificateResturant', {
                imgcer: rows[0].res_certificate,
                id: rows[0].id_res,
                img: req.session.profile,
                name: req.session.fname
            });
        }
    });

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
const maxSize = 1 * 1000 * 1000;

let upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: maxSize }, });



router.post('/UpdateCertificateResturant/:id_res', upload.single('image'), (req, res, next) => {

    let certificate = req.file.filename;
    let update = {
        res_certificate: certificate
    }
    let id = req.params.id_res;
    dbConnection.query('UPDATE restaurants SET ? WHERE id_res = ?',[update,id], (error, rows) => {
        if (error) {
            req.flash('error', error);
        } else {
            req.flash('success', 'แก้ไขสำเร็จ');
            res.redirect('../mainadmin')
        }
    })
})


// ลบร้านอาหาร
router.get('/deleteResturant/(:id_res)', isNotLogin, (req, res, next) => {
    let id = req.params.id_res;
    let level = 'U';
    let defaultidrestb = 0;
    dbConnection.query('SELECT * FROM user WHERE id_restb =?',[id], (err, result) => {
        let iduser = result[0].id_user;
        if (err) {
            req.flash('error', err),
            res.redirect('/admin/tableResturant');
        } else {
            let updatebrhideDelete = {
                level: level,
                id_restb: defaultidrestb
            }
            dbConnection.query('UPDATE user SET ? WHERE id_user = ?', [updatebrhideDelete,iduser], (error, results) => {
                if (error) {
                    error = true;
                    req.flash('error', error);
                } else {
                    req.flash('success', 'User Delete successfully! ID = ' + id);
                    dbConnection.query('SELECT * FROM restaurants ORDER BY res_id ', (err, rows) => {
                        if (err) {
                            req.flash('error', err);
                            res.redirect('/admin/tableResturant');
                        } else {
                            req.flash('success', 'ลบสำเร็จ !');
                            res.redirect('/admin/tableResturant');

                        }
                    })
                }
            })

        }
    })

    dbConnection.query('DELETE FROM restaurants WHERE id_res = ?' ,[id], (err, result) => {

        if (err) {
            req.flash('error', err),
                res.render('AdminResturant', { data: result });
        } else {
            req.flash('success', 'ลบสำเร็จ !');
        }
    })

})


/* เพิ่มพอยต์ให้ร้านอาหาร */
router.post('/add-points/(:id_res)', isNotLogin, (req, res, next) => {
    let id = req.params.id_res;
    let idRes = req.params.id_res;
    let point =parseInt(req.body.pointAdd);
    dbConnection.query('SELECT * FROM user WHERE id_restb = ? ', [id], (err, rows, fields) => {
        let PointUser=rows[0].user_point;
        if (err) {
            console.log(err);
            res.redirect('/admin/tableResturant');
        } else {
            let CurrentPoint =PointUser+point;
            let FormPoint={
                user_point:CurrentPoint
            }
            dbConnection.query('UPDATE user SET ? WHERE id_restb =?',[FormPoint,idRes],(err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.redirect('/admin/tableResturant');
                } else {
                    req.flash('success', 'เพิ่มพอยต์ให้ร้านอาหารสำเร็จ !');
                    res.redirect('/admin/tableResturant');
                }
            });
        }
    });

})

/* ลดพอยต์ให้ร้านอาหาร */
router.post('/minus-points/(:id_res)', isNotLogin, (req, res, next) => {
    let id = req.params.id_res;
    let idRes = req.params.id_res;
    let point =parseInt(req.body.pointMinus);
    dbConnection.query('SELECT * FROM user WHERE id_restb = ? ', [id], (err, rows, fields) => {
        let PointUser=rows[0].user_point;
        if (err) {
            console.log(err);
            res.redirect('/admin/tableResturant');
        } else {
            if(PointUser<point){
                req.flash("พอยต์ของร้านน้อยเกินกว่าจะลดได้แล้ว")
                res.redirect('/admin/tableResturant');
            }else{
                let CurrentPoint =PointUser-point;
            let FormPoint={
                user_point:CurrentPoint
            }
            dbConnection.query('UPDATE user SET ? WHERE id_restb =?',[FormPoint,idRes],(err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.redirect('/admin/tableResturant');
                } else {
                    req.flash('success', 'ลดพอยต์ของร้านอาหารสำเร็จ !');
                    res.redirect('/admin/tableResturant');
                }
            });
            }
            
        }
    });

})

/*----------------------------------------------ส่วนแอดมินโปรโมชัน---------------------------------------------------------*/
router.get('/adminPromotion/(:id_res)', isNotLogin, (req, res, next) => {
    let id = req.params.id_res;
    dbConnection.query('SELECT * FROM  promotion WHERE id_restb = ? ORDER BY pro_id ASC', [id], (err, rows) => {
        
        if (err) {
            req.flash('error', err);
            res.redirect('/admin/tableResturant');
            

        }if(!rows || rows.length === 0){
            res.render('AdminPromotion', { data: '', img: req.session.profile, name: req.session.fname, id: '' });
        } else {
            let id_pro = rows[0].id_pro;
            res.render('AdminPromotion', { data: rows, img: req.session.profile, name: req.session.fname, id: id_pro });
        }

    })
})


router.get('/backAadminPromotion/(:id_res)', isNotLogin, (req, res, next) => {
    let id = req.params.id_res;
    dbConnection.query('SELECT * FROM  promotion WHERE id_restb = ? ORDER BY pro_id ASC', [id], (err, rows) => {
        let id_pro = rows[0].id_pro;
        if (err) {
            req.flash('error', err);
            res.render('AdminPromotion', { data: '', img: req.session.profile, name: req.session.fname, id: id_pro });

        } else {
            res.render('AdminPromotion', { data: rows, img: req.session.profile, name: req.session.fname, id: id_pro });
        }

    })
})

router.get('/editPromotion/(:id_pro)', isNotLogin, (req, res, next) => {
    let id = req.params.id_pro;
    dbConnection.query('SELECT * FROM promotion WHERE id_pro = ?',[id], (err, rows, fields) => {
        let id_res = rows[0].id_restb;
        if (rows.length <= 0) {
            req.flash('error', 'หาไอดีโปรโมชันไม่เจอ')
            console.log('Promotion not found with id_pro = ' + id)
            res.redirect('/backAadminPromotion', { id: id_res });
        } else {
            res.render('AdminPromotion/editPromotion', {
                id_restb: rows[0].id_restb,
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
                img: req.session.profile,
                name: req.session.fname
            });
        }
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
const maxSizeimgResturant = 1 * 1000 * 1000;

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
router.post('/updatePromotion/:id_pro/:id_restb', uploadimgResturant.single('imageFood'), (req, res, next) => {
    let id = req.params.id_pro;
    let idRes = req.params.id_restb;
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
    console.log("id pro", id);
    console.log("id res", idRes)
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


    dbConnection.query('SELECT COUNT(*) AS total_rows FROM coupon WHERE id_pro_coupon=?',[id], (err, rows) => {
        let totalrows = rows[0].total_rows;
        console.log('จำนวนแถว : ', totalrows);
        if (err) {
            console.log("หาจำนวนโปรโมชันเก่าไมเจอ");
            req.flash('error', "หาจำนวนโปรโมชันเก่าไมเจอ");
            res.redirect('/admin/tableResturant');

        } else {
            // Check if the amount is changed
            if (totalrows !== amount) {
                if (totalrows < amount) {
                    // Generate random codes for additional coupons
                    let newCouponCount = amount - totalrows;

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
                            img_pro: image
                        }
                        dbConnection.query('INSERT INTO coupon SET ?', [cupondata], (error, rows) => {
                            if (error) {
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
                    console.log("เลขตำแหน่ง : ", excessCouponCount);

                    dbConnection.query('DELETE FROM coupon WHERE id_pro_coupon = ? LIMIT ?', [id, excessCouponCount], (error, rows) => {
                        if (error) {
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
            req.flash('error', error);
            console.log("บันทึกลงฐานข้อมูลไม่สำเร็จ");
            res.redirect('/admin/mainadmin');
        } else {
            errors = true;
            req.flash('success', 'แก้ไขสำเร็จ');
            res.redirect('/admin/mainadmin');
            console.log("แก้ไขข้อมูลโปรโมชัน และ บันทึกลงฐานข้อมูลสำเร็จ");
        }
    });



});
// delete Promotion
router.get('/deletePromotion/(:id_pro)', isNotLogin, (req, res, next) => {
    let id = req.params.id_pro;
  
    dbConnection.query('DELETE FROM promotion WHERE id_pro = ?' ,[id], (err, result) => {
      if (err) {
        req.flash('error', err),
          res.render('AdminUser', { data: result });
      } else {
        dbConnection.query('DELETE FROM coupon WHERE id_pro_coupon = ?' ,[id], (err, result) => {
          if (err) {
            req.flash('error', err),
            res.render('AdminUser', { data: result });
          } else {
            req.flash('success', 'Promotion Delete successfully! ID = ' + id);
            res.redirect('/admin/tableResturant');
          }
        })
  
      }
    })
  })

  
// Open Pormotion
router.get('/openPromotion/(:id_pro)', isNotLogin, (req, res, next) => {
    let id = req.params.id_pro;
  
    dbConnection.query(' UPDATE promotion SET status = "Order" WHERE id_pro= ?' ,[id], (err, rows) => {
      if (err) {
        console.log(err);
        req.flash("error", err);
        res.redirect('/admin/tableResturant');
      } else { 
        dbConnection.query(' UPDATE coupon SET status = "Order" WHERE id_pro_coupon= ?', [id], (err,rows) => {
        if (err) {
          console.log(err);
          res.redirect('/admin/tableResturant');
        } else {
          return
        }
      });
    }
    });
   
  
    dbConnection.query("SELECT * FROM coupon WHERE id_pro_coupon= ?",[id], (err,rows) => {
      let couponId =rows[0].cu_id;
      if(err){
        req.flash("error", err);
        console.log(err);
        res.redirect('/admin/tableResturant');
      }else{
        dbConnection.query('SELECT user_id FROM coupon_user WHERE coupon_id = ?', [couponId], (error, results) => {
          if (error) {
            console.error('เกิดข้อผิดพลาดในการค้นหาข้อมูล: ', error);
          }
          // ตรวจสอบว่าพบ id_user หรือไม่
          if (results.length > 0) {
            let userId=results[0].user_id;
            // ทำการอัปเดตข้อมูลในตาราง coupon
            dbConnection.query('UPDATE coupon SET status = ? WHERE id_user = ?', ['Book', userId], (updateError, updateResults) => {
              if (updateError) {
                console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ', updateError);
                res.redirect('/admin/tableResturant');
              } else {
                console.log('อัปเดตข้อมูลสำเร็จ Book เฉพาะ');
                res.redirect('/admin/tableResturant');
              }
            });
          } else {
            // ไม่พบ id_user ในตาราง coupon_user
            // ทำการอัปเดตสถานะเป็น 'Order' หรือดำเนินการตามที่ต้องการ
            dbConnection.query('UPDATE coupon SET status = ?', ['Order'], (updateError, updateResults) => {
              if (updateError) {
                console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ', updateError);
                res.redirect('/admin/tableResturant');
              } else {
                console.log('อัปเดตข้อมูลสำเร็จ Order ทั้งหมด');
                res.redirect('/admin/tableResturant');
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
    dbConnection.query(' UPDATE promotion SET status = "Off" WHERE id_pro= ?' , [id], (err, rows) => {
      if (err) {
        console.log(err);
        req.flash("error", err);
        res.redirect('/admin/tableResturant');
      } else {
        dbConnection.query(' UPDATE coupon SET status = "Book" WHERE id_pro_coupon= ?' , [id], (err, rows) => {
          if (err) {
            req.flash("error", err);
            console.log(err);
            res.redirect('/admin/tableResturant');
          } else {
            req.flash("message", "ปิดโปรโมชัน");
            console.log("ปิดสำเร็จ");
            res.redirect('/admin/tableResturant');
          }
        });
      }
    });
  })
/*----------------------------------------------ส่วนแอดมินคูปอง---------------------------------------------------------*/
router.get('/AdminCoupon/(:id_pro)', isNotLogin, (req, res, next) => {
    let id = req.params.id_pro;
    dbConnection.query(' SELECT * FROM coupon WHERE id_pro_coupon= ?' , [id], (err, rows, fields) => {
        let id_res = rows[0].id_res_coupon;
        if (err) {
            console.log(err);
            res.redirect('/backAadminPromotion', { id_restb: id_res });
        } else {
            res.render('AdminCoupon', {
                data: rows,
                id_restb: id_res,
                img: req.session.profile,
                name: req.session.fname
            })
        }
    });
})
/*----------------------------------------------ส่วนแอดมินยืนยันการเติมพอยต์---------------------------------------------------------*/
//display AdminPoint
router.get('/AdminPoint', isNotLogin, (req, res, next) => {
    let status = 'Order';
    dbConnection.query('SELECT * FROM point_transactions WHERE status = ? ORDER BY tran_id ASC', [status], (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('AdminPoint', { data: '', img: req.session.profile, name: req.session.fname });
        } else {
            dbConnection.query('SELECT * FROM point', (err, data) => {
                let point = data[0].point;
                if (err) {
                    req.flash('error', err);
                    res.render('AdminPoint', { data: '', img: req.session.profile, name: req.session.fname, pointIndata: '', });
                } else {
                    res.render('AdminPoint', { data: rows, img: req.session.profile, name: req.session.fname, pointIndata: point });
                }

            })
        }

    })
})
//display AdminPoint
router.get('/tablePoint', isNotLogin, (req, res, next) => {
    let status = 'Order';
    dbConnection.query('SELECT * FROM point_transactions WHERE status = ? ORDER BY tran_id ASC', [status], (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('AdminPoint', { data: '', img: req.session.profile, name: req.session.fname });
        } else {
            dbConnection.query('SELECT * FROM point', (err, data) => {
                let point = data[0].point;
                if (err) {
                    req.flash('error', err);
                    res.render('AdminPoint', { data: '', img: req.session.profile, name: req.session.fname, pointIndata: '' });
                } else {
                    res.render('AdminPoint', { data: rows, img: req.session.profile, name: req.session.fname, pointIndata: point });
                }

            })
        }

    })
})
// confirmPoint Point
router.get('/confirmPoint/(:user_id)/(:tran_id)', isNotLogin, (req, res, next) => {
    let id = req.params.user_id;
    let tranId = req.params.tran_id;

    dbConnection.query('SELECT * FROM point', (err, result) => { // ดึงจำนวนพอยต์จากฐานข้อมูลหลัก 
        let current_point = result[0].point;
        if (err) {
            req.flash('error', err),
                res.redirect('/admin/tablePoint');
        } else {
            dbConnection.query('SELECT * FROM point_transactions  WHERE tran_id =?',[tranId], (err, rows) => { // ดึงจำนวนพอยต์ที่ต้องการเติม
                let pointearn = rows[0].point_earn;
                if (err) {
                    req.flash('error', err);
                    res.redirect('/admin/tablePoint');
                } else {
                    dbConnection.query('SELECT * FROM user  WHERE id_user =?',[id], (err, rows) => { // ดึงจำนวนพอยต์ที่ต้องการเติม
                        let userCurenpoint = rows[0].user_point;
                        if (err) {
                            req.flash('error', err);
                            res.redirect('/admin/tablePoint');
                        } else {
                            if (current_point != pointearn) {
                                if (current_point < pointearn) {
                                    dbConnection.query('SELECT * FROM point', (err, data) => { // ดึงจำนวนพอยต์จากฐานข้อมูลหลัก 
                                        let PointUpdatae = data[0].point;
                                        if (err) {
                                            req.flash('error', err),
                                                res.redirect('/admin/tablePoint');
                                        } else {
                                            let Pointplusdata = PointUpdatae + 10000;
                                            let formPointUpdatemaxvalue = {
                                                point: Pointplusdata
                                            }
                                            dbConnection.query("UPDATE point SET ?  ", [formPointUpdatemaxvalue], (err, row) => { //เพิ่มพอยต์เพื่อให้ฐานข้อมูลพอยต์มีพอยต์
                                                if (err) {
                                                    req.flash('error', err);
                                                    res.redirect('/admin/tablePoint');
                                                } else {
                                                    req.flash('message', 'พอยต์ไม่พอในการเพิ่มให้ พึ่งเพิ่มใหม่');
                                                    res.redirect('/admin/tablePoint');
                                                }
                                            })
                                        }
                                    })

                                } else {
                                    let pointDatabasehave = current_point - pointearn;
                                    let pointYouhave = userCurenpoint + pointearn;
                                    let status = "Success";
                                    let formpointUser = {
                                        user_point: pointYouhave
                                    }
                                    let formpoint_transaction = {
                                        status: status
                                    }
                                    let formPointUpdate = {
                                        point: pointDatabasehave
                                    }
                                    dbConnection.query("UPDATE point_transactions SET ? WHERE tran_id =?" , [formpoint_transaction,tranId], (err, row) => {
                                        if (err) {
                                            req.flash('error', err);
                                            res.redirect('/admin/tablePoint');
                                        } else {
                                            dbConnection.query("UPDATE user SET ? WHERE id_user = ?" , [formpointUser,id], (err, row) => {
                                                if (err) {
                                                    req.flash('error', err);
                                                    res.redirect('/admin/tablePoint');
                                                } else {
                                                    dbConnection.query("UPDATE point SET ?  ", [formPointUpdate], (err, row) => {
                                                        if (err) {
                                                            req.flash('error', err);
                                                            res.redirect('/admin/tablePoint');
                                                        } else {
                                                            req.flash('message', 'อนุมัติเรียบร้อย');
                                                            res.redirect('/admin/mainadmin');
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            })
        }
    })
})


// Cancle Point  
router.get('/canclePoint/(:tran_id)', isNotLogin, (req, res, next) => {
    let tranId = req.params.tran_id;
    let cancleAddpoint = {
        status:"Cancle"
    }
    
    dbConnection.query('UPDATE point_transactions SET ? WHERE tran_id =?',[cancleAddpoint,tranId], (err, rows) => {
        if(err){
            req.flash('error', err);
            res.redirect('/admin/tablePoint');
        }else{
            req.flash('message', 'ไม่อนุมัติการเติมพอยต์');
            res.redirect('/admin/mainadmin');
        }
    })
})

//*-------------------------------------------------------------------Report-------------------------------------------------------------------*//
router.get('/ReportPoint', function (req, res, next) {
    res.render('adminn/ReportPoint',{img: req.session.profile, name: req.session.fname});
    });
    
    router.post('/report',(req, res, next) => {
        let start = req.body.startDate;
        let end = req.body.endDate;
        let query = `
        SELECT pt.tran_id,u.username,pt.point_earn,pt.bank_name,pt.status,pt.tran_date
        FROM point_transactions pt
        INNER JOIN user u ON pt.user_id= u.id_user
        WHERE pt.tran_date BETWEEN '${start}' AND '${end}'`;
        console.log(start);
        console.log(end);
        dbConnection.query(query, (error, results) => {
     
            if (error) {
                req.flash("error", error);
                console.log(error);
                res.redirect('/admin/mainadmin');
              } else if (results.length <= 0) {
                res.render('adminn/ReportPointPaper', { Reportpdf: '', totalPointEarn: '',img: req.session.profile, name: req.session.fname});
              } else {
          
                let totalPointEarn = 0;
                results.forEach((tran) => {
                    totalPointEarn += parseFloat(tran.point_earn);
                });//pont total
                const formattedTotal =totalPointEarn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

                let startDateForpdf=moment(start).locale('th').format('D MMMM YYYY');
                let endDateForpdf=moment(end).locale('th').format('D MMMM YYYY');
    
                let data = results.map(row => ({ 
                  TranId: row.tran_id,
                  Username: row.username,
                  Point: parseFloat(row.point_earn).toFixed(2),
                  Bank: row.bank_name,
                  Status:row.status,
                  Date: moment(row.tran_date).locale('th').format('D MMMM YYYY')
                })); // data To table
          
          
                // สร้าง function สำหรับสร้างไฟล์ PDF
                const doc = new jsPDF();
          
          
                // add the font to jsPDF
                doc.addFileToVFS("MyFont.ttf", font);
                doc.addFont("MyFont.ttf", "MyFont", "normal");
                doc.setFont("MyFont");
          
                // สร้าง definition ของไฟล์ PDF
                let width = doc.internal.pageSize.getWidth();
                
                doc.setFontSize(18);
                doc.text("การเติมพอยต์ของวันที่ "+startDateForpdf+" ถึงวันที่ "+endDateForpdf, width / 2, 10, { align: 'center' });
                doc.setFontSize(12);
                let dataTableForPDF = {
                  startY: 20,
                  head: [['เลขการโอน', 'ชื่อผู้ใช้', 'พอยต์ที่เติม', 'ธนาคาร','สถานะการเติม', 'วันที่']],
                  body: data.map(row => [
                    row.TranId,
                    row.Username,
                    row.Point,
                    row.Bank,
                    row.Status,
                    row.Date
                ]),
                  styles: { font: 'MyFont' },
                }
          
                doc.autoTable(dataTableForPDF);
                let totalPriceTextY = doc.autoTable.previous.finalY + 10; //ระยะห่างระหว่าง dataTable กับ ยอดรวม
                doc.text("ยอดรวมสุทธิ : " + formattedTotal, 190, totalPriceTextY, { align: 'right' });
                doc.setFontSize(10);
                doc.text('© สะดวกจอง. All Rights Reserved. By มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา 128 ถ.ห้วยแก้ว ต.ช้างเผือก อ.เมือง จ.เชียงใหม่ 50300', 15, doc.internal.pageSize.getHeight() - 10, { align: 'left' }); //footer 
                doc.setLineWidth(2);
                doc.save("./public/pdf/ReportPoint.pdf");
                res.render('adminn/ReportPointPaper',{Reportpdf:results, totalPointEarn: formattedTotal,img: req.session.profile, name: req.session.fname});
            }
        })
    });
    
    router.get('/pdf', (req, res, next) => {
        const filePath = './public/pdf/ReportPoint.pdf';
      
        // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
        if (fs.existsSync(filePath)) {
          // ส่งไฟล์ PDF กลับให้ผู้ใช้
          res.download(filePath, 'ReportPoint.pdf', (err) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error downloading file');
            }
          });
        } else {
          res.status(404).send('File not found');
        }
      });

//*-------------------------------------------------------------------จัดการเว็ปไซต์-------------------------------------------------------------------*//
router.get('/managewebsite', function (req, res, next) {

    res.render('adminn/managewebsite',{img: req.session.profile, name: req.session.fname})
});



    // Upload logo
const storageLogo = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/logo/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilterLogo = function (req, file, cb) {

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
const maxSizeLogo = 1 * 1000 * 1000;

let uploadLogo = multer({ storage: storageLogo, fileFilter: fileFilterLogo, limits: { fileSize: maxSizeLogo }, });



router.post('/logoweb', uploadLogo.single('logo'), (req, res, next) => {

    let logoweb = req.file.filename;
    let formlogo={
        logo:logoweb
    }
    dbConnection.query("UPDATE logo SET ?",[formlogo],(error, results) =>{
        if (error) {
            console.error(error);
            res.redirect('/admin/mainadmin');
        }else{
            console.log(results);
            res.redirect('/admin/mainadmin');
        }
    })
    
});



    // Upload banner
    const storageBanner = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/uploads/banner/');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    const fileFilterBanner= function (req, file, cb) {

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
    const maxSizeBanner = 1 * 1000 * 1000;

    let uploadBanner = multer({ storage: storageBanner, fileFilter: fileFilterBanner, limits: { fileSize: maxSizeBanner }, });



    router.post('/bannerweb', uploadBanner.single('banner'), (req, res, next) => {

        let bannerweb = req.file.filename;
        let formbanner={
            banner:bannerweb
        }
        dbConnection.query("UPDATE banner SET ?",[formbanner],(error, results) =>{
            if (error) {
                console.error(error);
                res.redirect('/admin/mainadmin');
            }else{
                console.log(results);
                res.redirect('/admin/mainadmin');
            }
        })
        
    });

// Set up your routes pagination
router.get('/AdminUser', (req, res) => {
    const page = parseInt(req.query.page);
    const per_page = parseInt(req.query.per_page);

    const start_index = (page - 1) * per_page;
  
    dbConnection.query("SELECT * FROM user LIMIT ?, ?", [start_index, per_page],(error, rows) => {
      if (error) {
        console.error(error);
        res.render('AdminUser', { data: '', img: req.session.profile, name: req.session.fname });
      } else {
        res.render('AdminUser', { data: rows, img: req.session.profile, name: req.session.fname });
      }
    });
  });
//*-------------------------------------------------------------------ส่วนแอดมินโปรโมท-------------------------------------------------------------------*//
router.get('/adminPromote/(:id_res)', isNotLogin, (req, res, next) => {
    let id = req.params.id_res;
    dbConnection.query('SELECT * FROM  promotion WHERE id_restb = ? AND boost=0 ORDER BY pro_id ASC ', [id], (err, rows) => {
        
        if (err) {
            req.flash('error', err);
            res.redirect('/admin/tableResturant');
            

        }if(!rows || rows.length === 0){
            res.render('AdminPromote', { data: '', img: req.session.profile, name: req.session.fname, id: '' });
        } else {
            let id_pro = rows[0].id_pro;
            res.render('AdminPromote', { data: rows, img: req.session.profile, name: req.session.fname, id: id_pro,idres:id });
        }

    })
})

router.get('/promoteSelect/(:id_pro)/(:id_res)', (req, res, next) => {
    let idpro=req.params.id_pro;
    let id = req.params.id_res;
  
  
    dbConnection.query(' SELECT * FROM promotion WHERE id_pro= ? ' , [idpro], (err, rows, fields) => {
      let idpro=rows[0].id_pro;
      if (err) {
        req.flash("error", "ไม่สามารถแสดงโปรโมชันทีต้องการโปรโมทได้");
        console.log(err);
        res.redirect('/admin/tableResturant');
      } else {
        res.render('AdminPromote/selectBoost', {
          data: idpro,
          img: req.session.profile, 
          name: req.session.fname,
          point:req.session.point,
          idres:id
        })
      }
    });
  });


  router.post('/boostpromote/(:id_pro)/(:id_res)', (req, res, next) => {
    let idpro=req.params.id_pro;
    let idres=req.params.id_res;
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
        res.redirect('/admin/tableResturant');
      }else{
        let cutpointtopromotion=pointuser/daypromote;
  
        let cutpointtoRes=pointuser-pointboost;
  
        req.session.point=cutpointtoRes;
        let formpointtouser={
          user_point:cutpointtoRes
        }
        dbConnection.query("UPDATE user SET ? WHERE id_restb= ?", [formpointtouser,idres], (err, rowsuser, fields) => {
          if(err){
            req.flash("error", "ไม่สามารถโปรโมทได้");
            res.redirect('/admin/tableResturant');
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
                res.redirect('/admin/tableResturant');
              }else{
                let boostformpromotion={
                  boost:cutpointtopromotion
                }
                dbConnection.query('UPDATE promotion SET ? WHERE id_pro= ?',[boostformpromotion,idpro],(error, rows) => {
                  if(err){
                    req.flash("error", "ไม่สามารถโปรโมทได้");
                    res.redirect('/admin/tableResturant');
                  }else{
                    req.flash("message", "โปรโมทเรียบร้อย");
                    res.redirect('/admin/tableResturant');
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