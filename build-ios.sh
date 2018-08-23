#install node v8.10

#install ionic
#npm install -g ionic

#install dependencies
#npm install

#build project
cp config.xml config.bkp
cp env/env.hom.ts src/providers/cts.ts

VERSION=`python -c "import json; j=json.loads(open('./package.json').read()); print('%s' %(j['version']))"`;
CMT=`git rev-parse HEAD`;
echo 'export const version={"appVersion":"'$VERSION'","commit":"'${CMT: -11}'"};' >> src/providers/cts.ts
echo 'export const mobile = true;' >> src/providers/cts.ts
head -n 2 config.xml > config.xml.b
echo 'version="'$VERSION'"' >> config.xml.b
tail -n +4 config.xml >> config.xml.b
mv config.xml.b config.xml


ionic cordova  build ios --prod  --aot --minifyjs --minifycss --optimizejs;

cp config.bkp config.xml
cp env/env.dev.ts src/providers/cts.ts

#

# tail -20 src/providers/constants/constants.ts >> src/providers/constants/constants.ts.tmp

# npm install -g firebase-tools ionic
# npm install
# cp src/env/dev.ts src/providers/contants.ts
# VERSION=`python -c "import json; j=json.loads(open('./package.json').read()); print('%s' %(j['version']))"`;
# CMT=`git rev-parse HEAD`;
# echo 'export const version={"appVersion":"'$VERSION'","commit":"'${CMT: -11}'"};' >> src/providers/contants.ts
# ionic build web --prod --release --aot --minifyjs --minifycss --optimizejs
# cp src/firebase-messaging-sw.js www/
# firebase deploy -P develop --token $FIREBASE_TOKEN
