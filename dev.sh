head -n 4 src/providers/constants/constants.ts > src/providers/constants/constants.ts.tmp
echo "public API: string = 'http://localhost:9001/api/';"  >> src/providers/constants/constants.ts.tmp
echo "public FB_APP_ID:string ='339667689763204';" >> src/providers/constants/constants.ts.tmp
tail -20 src/providers/constants/constants.ts >> src/providers/constants/constants.ts.tmp
mv src/providers/constants/constants.ts.tmp  src/providers/constants/constants.ts

