cd %~dp0
call npm install -g nodecg-cli
call npm install -g bower
mkdir NodeCG
cd NodeCG
call nodecg setup
cd bundles
git clone https://github.com/esamarathon/esa-layouts.git
git clone https://github.com/speedcontrol/nodecg-speedcontrol.git
git clone https://github.com/speedcontrol/speedcontrol-flagcarrier.git
git clone https://github.com/esamarathon/nodecg-esakeys.git
cd esa-layouts
git checkout dev
call npm install
call npm run build
cd ..
cd nodecg-speedcontrol
git checkout dev
call npm install
call bower install
call npm run build
cd ..
cd speedcontrol-flagcarrier
call npm install
call bower install
cd ..
cd nodecg-esakeys
call npm install
pause