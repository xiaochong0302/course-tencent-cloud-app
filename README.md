## 酷瓜云课堂客户端

酷瓜云课堂客户端采用 [uni-app](https://uniapp.dcloud.io) 为基础开发框架，前端界面使用 [uview-ui](http://uviewui.com)

### 相关项目

- PC端以及API [course-tencent-cloud](https://gitee.com/koogua/course-tencent-cloud)
- docker运行环境 [course-tencent-cloud-docker](https://gitee.com/koogua/course-tencent-cloud-docker)

### 安装使用

为避免不必要的困扰，请先熟悉 [uni-app](https://uniapp.dcloud.io) 相关文档，以及 [HBuilderX](https://www.dcloud.io/hbuilderx.html) 开发工具

### 下载源码

```
git clone https://gitee.com/koogua/course-tencent-cloud-app.git
```

### 导入项目

使用 HBuilderX 导入项目（文件 -> 导入 -> 从本地目录导入）

(1) 生成manifest.json文件

把 `manifest.sample.json` 另存为 `manifest.json`, 根据实际情况修改相关配置

(2) 修改配置文件

把 `common/config.sample.js` 另存为 `common/config.js`, 修改 `apiBaseUrl` 为实际的地址（尾部不要加 “/”）

```
export const apiBaseUrl = '{{ your-domain }}/api'
```

### 编译运行

使用 HBuilderX 编译运行（运行 -> 运行到浏览器 -> xxx浏览器）

遇到跨域的问题，请修改 `course-tencent-cloud` 项目中的配置文件 `app/config/config.php` CORS 相关部分。

**注意：开发环境跨域域名可使用通配符, 非开发环境请使用实际的域名** 

```
/**
 * 允许跨域
 */
$config['cors']['enabled'] = true;

/**
 * 允许跨域域名(字符|数组)
 */
$config['cors']['allow_origin'] = '*';

/**
 * 允许跨域字段（string|array）
 */
$config['cors']['allow_headers'] = '*';

/**
 * 允许跨域方法
 */
$config['cors']['allow_methods'] = ['GET', 'POST', 'OPTIONS'];
```

### 编译发行

使用 HBuilderX 编译发行H5（发行 -> 网站PC或手机H5）

#### H5发行

(a) 发布的文件上传到服务器本地

把生成的目录 `upackage/dist/build/h5` 上传到 `course-tencent-cloud` 项目的 `public`目录下

对应的 `manifest.json` h5部分配置如下：

```
"h5" : {
        "title" : "酷瓜云课堂",
        "optimization" : {
            "treeShaking" : {
                "enable" : true
            }
        },
        "router" : {
            "base" : "/h5/",
            "mode" : "hash"
        },
        "sdkConfigs" : {
            "maps" : {}
        },
        "publicPath" : "",
        "template" : "template.h5.html",
        "domain" : "your-domain.com"
    }
```

(b) 发布的文件上传到CDN

把生成的目录 `upackage/dist/build/h5` 上传到 腾讯云存储相关 bucket 的相关目录下

把 `upackage/dist/build/h5/index.html` 上传到 `course-tencent-cloud` 项目的 `public/h5`目录下

对应的 `manifest.json` h5部分配置如下：

```
"h5" : {
        "title" : "酷瓜云课堂",
        "optimization" : {
            "treeShaking" : {
                "enable" : true
            }
        },
        "router" : {
            "base" : "/h5/",
            "mode" : "hash"
        },
        "sdkConfigs" : {
            "maps" : {}
        },
        "publicPath" : "https://course-1255691183.file.myqcloud.com/h5",
        "template" : "template.h5.html",
        "domain" : "your-domain.com"
    }
```

如果访问页面遇到403错误，修改 `public/h5/index.html` 的文件权限

```
chmod 644 public/h5/index.html
```


