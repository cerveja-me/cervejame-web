#install node v8.10

#install ionic
#npm install -g ionic

#install dependencies
#npm install

#build project

cp env/env.hom.ts src/providers/cts.ts

VERSION=`python -c "import json; j=json.loads(open('./package.json').read()); print('%s' %(j['version']))"`;
CMT=`git rev-parse HEAD`;
echo 'export const version={"appVersion":"'$VERSION'","commit":"'${CMT: -11}'"};' >> src/providers/cts.ts
echo 'export const mobile = false;' >> src/providers/cts.ts
cp config.xml config.xml.b
SS='s/X.P.TO/'$VERSION'/g'
sed -i -e $SS config.xml


sed -i '/cordova.js/d' src/index.html

ionic build web --prod --release --aot --minifyjs --minifycss --optimizejs;

cd www/
aws s3 sync . s3://m.cerveja.me
cd ..

aws cloudfront create-invalidation --distribution-id E30RTAAN91SOC6  --paths '/*'
#
