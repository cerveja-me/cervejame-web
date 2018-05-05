head -n 4 src/providers/constants/constants.ts > src/providers/constants/constants.ts.tmp
echo "public API: string = 'http://localhost:9001/api/';"  >> src/providers/constants/constants.ts.tmp
tail -16 src/providers/constants/constants.ts >> src/providers/constants/constants.ts.tmp
mv src/providers/constants/constants.ts.tmp  src/providers/constants/constants.ts

