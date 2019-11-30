apt-get update
apt-get upgrade -y
apt-get install python3
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py
rm get-pip.py
pip3 install --upgrade pip requests bs4 flask flask_cors
