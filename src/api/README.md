# node-hapi
node-hapi基本框架

### 快速开始

克隆项目文件:

    git clone https://github.com/njleiyin/node-hapi.git

进入目录安装依赖:

    npm i 或者 yarn install

开发：

```bash
node app

```
### 数据库配置文件./config/development.json

### 初始化数据

创建默认用户：
```bash
INSERT INTO organization_users (loginname,password,created_at,updated_at) VALUES ('admin','123456',now(),now())

```
创建默认角色：
```bash
INSERT into security_roles (name,created_at,updated_at) VALUES ('系统管理员',now(),now())
INSERT INTO security_role_members (type,value,created_at,updated_at,role_id) VALUES ('admin','1',now(),now(),1)
```

创建默认app配置信息：
```bash
INSERT INTO system_apps (name,app_id,secret,version_code,version_number,created_at,updated_at) VALUES ('白马商场小程序','wxa9344e021c91e123','29e6199fb4545fa38975e605b7f845c0','1.0',1,now(),now())
