### mysql 语法

    （1）创建连接池 createPool 方法
        var pool = mysql.createPool(optioins);
        options 参数包含 createConnection 方法中可以使用的各种属性，除此之外还有以下属性：
        createConnection，waitForConnections，connectionLimit，queueLimit。

    （2）从连接池中取出连接。getConnection方法。如无连接可用则隐式的建立一个数据库连接。

        pool.getConnection(function(err,connection))。
        回调函数中的err为错误对象，connection为获取到的连接对象。

    （3）当连接不再使用时，用connection对象的release方法将其归还到连接池中。
        connection.release();

    （4）当一个连接不再需要使用且需要从连接池中移除时，用connection对象的destroy方法。
        connection.destroy();
        连接移除后，连接池中的连接数减一。

    （5）当一个连接池不再需要使用时，用连接池对象的end方法关闭连接池。
        pool.end();

### mysql 的使用细节

```js
const _sql = 'SELECT * FROM ?? WHERE ?'
query(_sql, [table, query])
```

上面这种写法是不行的，一个`?`，会有`'`单引号吧内容包起来，两个`?`，会用<code>`</code>把内容包起来

例子：

```js
query(_sql, ['needs', "type=1 and typeName='测试一波'"])
```

我们希望生成的 sql 语句是：`SELECT * FROM`needs`WHERE type=1 and typeName='测试一波';`
在 mysql 对参数处理后，生成的真正的 sql 语句是:
`SELECT * FROM`needs`WHERE 'type=1 and typeName=\'测试一波\'';`
或
<code>SELECT \* FROM`needs`WHERE \`type=1 and typeName=\'测试一波\'\`;</code>

这样的语句，查询的时候，并不能很智能的识别， 语法上有问题，所以查不出来
