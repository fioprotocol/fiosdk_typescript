echo "Building FIOJS"
echo "Make sure the FIOJS project is located in the following directory hierarchy:"
echo "i.e."
echo "    /fiojs  - FIO JS SDK files"
echo "    /fiosdk_typescript - FIO TypeScript SDK Files" 
cd ..
cd .. 
cd fiojs
yarn
tsc

echo "Building FIO TypeScript SDK"
echo "Make sure the FIO TypeScript project is located in the following directory hierarchy:"
echo "i.e."
echo "    /fiojs  - FIO JS SDK files"
echo "    /fiosdk_typescript - FIO TypeScript SDK Files"

cd ..
cd fiosdk_typescript
cd fiofoundation-io-fiosdk
yarn
tsc
