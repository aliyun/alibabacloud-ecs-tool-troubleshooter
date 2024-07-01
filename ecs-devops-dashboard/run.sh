#!/bin/bash

deploy() {

    # 执行下面的命令安装nvm，如果失败则多安装几次
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

    # 根据自己的终端配置下面的环境变量
	export NVM_NODEJS_ORG_MIRROR="http://npm.taobao.org/mirrors/node" source
	export NVM_DIR="$HOME/.nvm"
	[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
	[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

	nvm install 18.10.0
	nvm use default 18.10.0

	npm config set https://registry.anpm.alibaba-inc.com
	npm install -g @angular/cli@16.2.0

	npm install
}

start() {
	npm run start
}

help() {
	echo "run.sh deploy|start|help"
	echo "    deploy: 安装node.js和angular环境等"
    echo "    start: 本地启动"
	echo "    help: 帮助文档"
}


case "$1" in
    "deploy")
        deploy
        ;;
    "start")
        start
        ;;
    *)
        echo "Unknown command: $1"
        help
        exit 1
        ;;
esac

