#!/usr/bin/env bash
#install node v8.10

#install ionic
#npm install -g ionic

#install dependencies
#npm install

#Configure variables
cp config.xml config.bkp
cp env/env.prod.ts src/providers/cts.ts
VERSION=`python -c "import json; j=json.loads(open('./package.json').read()); print('%s' %(j['version']))"`;
CMT=`git rev-parse HEAD`;
echo 'export const version={"appVersion":"'$VERSION'","commit":"'${CMT: -11}'"};' >> src/providers/cts.ts
echo 'export const mobile = true;' >> src/providers/cts.ts
SS='s/X.P.TO/'$VERSION'/g'
sed -i -e $SS config.xml

# Build ios
# ionic cordova  build ios --prod  --aot --minifyjs --minifycss --optimizejs;

# restore environment
# cp config.bkp config.xml
# cp env/env.dev.ts src/providers/cts.ts

