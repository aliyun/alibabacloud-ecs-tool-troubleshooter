<p align="center">
<a href=" https://www.alibabacloud.com"><img src="https://aliyunsdk-pages.alicdn.com/icons/Aliyun.svg"></a>
</p>

<h1 align="center">阿里云ECS可观测平台</h1>


阿里云ECS可观测平台，提供有关ECS产品的各种观测数据与运维最佳实践等

## 本地环境搭建
### 安装nvm
```
# 执行下面的命令安装nvm，如果失败则多安装几次
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```
### 环境变量配置
```
# 根据自己的终端配置下面的环境变量
export NVM_NODEJS_ORG_MIRROR="http://npm.taobao.org/mirrors/node" source
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# ~bash配置， 将上面的代码复制到下边的文件中
vim ~/.bash_profile
source ~/.bash_profile

# ～zsh配置 将上面的代码复制到下边的文件中
vim ~/.zshrc
source ~/.zshrc
#
```

### 安装Angular\cli
```
nvm install 18.10.0
nvm use default 18.10.0

npm config set https://registry.anpm.alibaba-inc.com
npm install -g @angular/cli@16.2.0

```
### 启动
```
npm install 

npm run start 或 ng serve -o -- port4 200
```

## License
[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Copyright (c) 2024-present, Alibaba Cloud All rights reserved.

