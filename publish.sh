set -e

cd docs/.vuepress/dist
git init -b main
git add .
git commit -m "publish"
git remote add origin git@github.com:sfajs/website-dist.git
git push origin main -f