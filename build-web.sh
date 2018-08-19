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
head -n 2 config.xml > config.xml.b
echo 'version="'$VERSION'"' >> config.xml.b
tail -n +4 config.xml >> config.xml.b
mv config.xml.b config.xml

cp src/index.html src/index.html.b; sed -e '28d' src/index.html.b > src/index.html; rm  src/index.html.b;
ionic build web --prod --release --aot --minifyjs --minifycss --optimizejs;

cd www/
aws s3 sync . s3://m.cerveja.me
cd ..

aws cloudfront create-invalidation --distribution-id E30RTAAN91SOC6  --paths '/*'
#
