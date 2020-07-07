#!/bin/bash
# Script to build and publish npm package

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[01;32m'
NC='\033[0m' # No Color

echo -e ${YELLOW}[UNISYS] Starting packaging for $1 ${NC}
cd ../projects/$1
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')
echo -e ${YELLOW}[UNISYS] Current version of package is $PACKAGE_VERSION ${NC}
echo -e ${RED}[UNISYS] Please enter NEW version for package ${NC}
read newVersion
echo -e ${YELLOW}[UNISYS] Building component ${NC}
ng build $1
echo -e ${YELLOW}[UNISYS] Changing version in project to $newVersion ${NC}
npm version $newVersion --no-git-tag-version --allow-same-version
echo -e ${RED}[UNISYS] Copy assets of $1 to dist folder? Type yes for copy ${NC}
read assets
if [ $assets == "yes" ]; then
cp -r src/assets ../../dist/$1
fi
if [ $1 == "unisys-angular-core" ]; then
cp -r src/index.html ../../dist/$1
cp -r gulpfile.js ../../dist/$1
fi
echo -e ${YELLOW}[UNISYS] Adding GIT files ${NC}
git add .
git clean
echo -e ${YELLOW}[UNISYS] Creating commit ${NC}
git commit -m "$newVersion"
cd ..
cd ..
cd dist/$1
echo -e ${YELLOW}[UNISYS] Changing version in dist to $newVersion ${NC}
npm version $newVersion --allow-same-version
cd ..
cd ..
cd projects/$1
echo -e ${YELLOW}[UNISYS] Adding tag $newVersion ${NC}
git tag "$newVersion"
echo -e ${YELLOW}[UNISYS] Pushing changes ${NC}
git push --tags origin master
cd ..
cd ..
cd dist/$1
echo -e ${YELLOW}[UNISYS] Publishing package $1 to npm repository ${NC}
npm publish --access public
echo -e ${RED}[UNISYS] Download latest release of $1 from npm library? Type yes for download ${NC}
read download
if [ $download == "yes" ]; then
    echo -e ${YELLOW}[UNISYS] Waiting 15 seconds before repository is updated on npm ${NC}
cd ..
cd ..
for i in {1..15}
do
   TIME=`expr 16 - $i`
   echo -e ${YELLOW}[UNISYS] $TIME ${NC}
   sleep 1;
done
echo -e ${YELLOW}[UNISYS] Downloading latest version $1 from npm ${NC}
npm install @weareunite/$1@latest --save
fi
echo -e ${GREEN}[UNISYS] Done! ${NC}
