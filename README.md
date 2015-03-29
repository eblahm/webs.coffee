# webs.coffee
because great ideas happen while you're walking to get coffee

## dependencies
- mongodb -> `brew install mongodb` or `sudo apt-get install mongodb` on ubuntu 14
- node v0.12.1 -> `curl https://raw.githubusercontent.com/creationix/nvm/v0.24.0/install.sh | bash && nvm install`
- grunt-cli -> `npm install -g grunt-cli`
- pm2 (on the deploy server) -> `npm install -g pm2`

## run
`npm start`

## deploy
```
# if you don't have pip, install that first
curl https://bootstrap.pypa.io/get-pip.py > get-pip.py
python get-pip.py # sudo?

# install fabric
pip install fabric

# DEPLOY!
fab -H <your-host-ip> -u <your-user-name> deploy:reload=yes,dest=~/,NODE_ENV=production,name=webs.coffee,DEBUG=*
# DEPLOY AGAIN but gracefully reload the running process!
fab -H <your-host-ip> -u <your-user-name> deploy:reload=no,name=webs.coffee
```
