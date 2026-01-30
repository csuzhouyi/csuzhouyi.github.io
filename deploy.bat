@echo off
echo 正在构建项目...
call npm run build

echo 进入 dist 目录...
cd dist

echo 初始化 git...
git init
git add -A
git commit -m "Deploy to GitHub Pages"

echo 推送到 gh-pages 分支...
git push -f git@github.com:csuzhouyi/csuzhouyi.github.io.git master:gh-pages

cd ..
echo 部署完成！
