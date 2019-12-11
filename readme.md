# RESF API 服务

---

本项目基于 node、koa、mysql 提供 RESF API 接口。

## how to use

首先，要安装 node、和 mysql[（ 不会安装，看这里）]()。

mysql 安装好了之后，修改`util/db.js`文件

```js
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '12345678',
  database: 'koa_db'
})
```

修改 mysql 的配置，user（数据库账号），password（数据库密码），database（数据库名称），安装 Mysql 的设置的密码，并且，先创建一个名为 koa_db 的数据库

1.安装依赖

```js
npm i
```

2.建表，填充数据

```js
  node server/index.js
```

3. 运行项目

```js
node server/app.js
```

4.打开浏览器，访问`http://localhost:3000/api/getAllUser`，可以看到数据了

项目结构：

```sh
  └── server
    ├── controllers # 操作层 执行服务端模板渲染，json接口返回数据，页面跳转
    │   ├── needs.js
    │   ├── user.js
    ├── models # 数据模型层 执行数据操作
    │   ├── sql # 建表
    │     └── data.sql
    │     └── needs.sql
    │     └── user.sql
    │   ├── needs.js
    │   └── user.js
    ├── routers # 路由层 控制路由
    │   ├── api.js # 接口路由
    │   ├── index.js # 总路由文件
    ├──util # 工具类
    │   ├── db.ejs
    │   ├── get-sql-content-map.ejs
    │   ├── get-sql-map.ejs
    │   └── walk-file.ejs
    ├──api.js # 入口文件
    └──index.js # 初始化数据库
```

### 工作流程：

访问 api 地址 >>> 在 routers 里面对应 api 地址，调用回调函数 >>> 在 controllers 里面响应回调，调用操作数据库函数 >>> 在 models 里面实现了操作数据库的函数，通过 util 里面封装的数据库操作方法，完成对数据库的读写操作，并返回相应数据。

例子：

1、访问 api 地址: http://localhost:3000/api/getNeeds?status=4

2、在 routers 里面对应 api 地址，调用回调函数 `needsController.getNeeds()`

![](https://user-gold-cdn.xitu.io/2018/7/9/1647db17fcaa3907?w=639&h=293&f=jpeg&s=50604)

3、在 controllers 里面响应回调，调用操作数据库函数 `db_needs.getNeedsByStatus()`

![](https://user-gold-cdn.xitu.io/2018/7/9/1647db38129a0518?w=587&h=385&f=jpeg&s=42946)

4、在 models 里面实现了操作数据库的函数，通过 util 里面封装的数据库操作方法(`dbUtils.query()`)，完成对数据库的读写操作，并返回相应数据。

![](https://user-gold-cdn.xitu.io/2018/7/9/1647db5142fcb7ca?w=664&h=571&f=jpeg&s=73404)
