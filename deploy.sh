#!/bin/bash

# 构建项目
npm run build

# 进入 dist 目录
cd dist

# 初始化 git（如果还没有）
git init
git add -A
git commit -m "Deploy to GitHub Pages"

# 推送到 gh-pages 分支
git push -f git@github.com:csuzhouyi/csuzhouyi.github.io.git master:gh-pages

cd -
