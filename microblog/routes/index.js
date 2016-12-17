var express = require('express');
var User = require('./users');
var crypto = require('crypto');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    layout: 'layout'
  });
});

/*
router.get('/hello', function(req, res, next) {
  res.send('The time is ' + new Date().toString());
});

router.get('/user/:username', function(req, res, next) {
  res.send('user: ' + req.params.username);
});*/

//for microblog
router.get('/u/:user', function(req, res, next) {

});

router.post('/post', function(req, res, next) {

});

router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res, next) {
  res.render('reg', { title: '用户注册' });
});

router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res, next) {
  //处理输入异常
  if(!req.body['username'] || req.body['username'].length === 0) {
    req.flash('error', '用户名为空');
    return res.redirect('/reg');
  }

  if(!req.body['password'] || req.body['password'].length === 0) {
    req.flash('error', '口令为空');
    return res.redirect('/reg');
  }

  if(!req.body['password-repeat'] || req.body['password-repeat'].length === 0) {
    req.flash('error', '重复口令为空');
    return res.redirect('/reg');
  }

  if(req.body['password-repeat'] != req.body['password']) {
    req.flash('error', '两次输入的口令不一致');
    return res.redirect('/reg');
  }

  //密码md5加密，并存入到对象
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  var newUser = new User({
    name: req.body.username,
    password: password,
  });

  //依照用户名查询数据库，判断是否已注册，若未注册，则将user对象存入到数据库
  User.get(newUser.name, function(err, user) {
    if (user) {
      err = '用户名已存在';
    }

    if (err) {
      req.flash('error', err);
      return res.redirect('/reg');
    }

    newUser.save(function(err) {
      if (err) {
        req.flash('error', '用户信息写入失败');
        return res.redirect('/reg');
      }

      req.session.user = newUser;
      req.flash('success', "注册成功");
      res.redirect('/');
    })
  })

});

router.get('/login', checkNotLogin);
router.get('/login', function(req, res, next) {
  res.render('login', {
    title : '用户登录',
  });
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res, next) {

  if(!req.body['username'] || req.body['username'].length === 0) {
    req.flash('error', '用户名为空');
    return res.redirect('/login');
  }

  if(!req.body['password'] || req.body['password'].length === 0) {
    req.flash('error', '口令为空');
    return res.redirect('/login');
  }

  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  User.get(req.body['username'], function(err, user) {
    if(!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/login');
    }

    if(user.password != password) {
      req.flash('error', '用户口令错误');
      return res.redirect('/login');
    }

    req.session.user = user;
    req.flash('success', '登入成功');
    res.redirect('/');
  });
});

router.get('/logout', checkLogin);
router.get('/logout', function(req, res, next) {
  req.session.user = null;
  req.flash('success', '登出成功');
  res.redirect('/');
});

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '用户未登入');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '用户已登入');
    return res.redirect('/');
  }
  next();
}

module.exports = router;
