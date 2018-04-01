#install node v8.10

#install ionic
#npm install -g ionic

#install dependencies
#npm install

#build project
ionic build web --prod --release --aot --minifyjs --minifycss --optimizejs;

cd www/
aws s3 sync . s3://m.cerveja.me
cd ..

