apt-get update
apt-get upgrade -y
apt-get install -y nodejs python3

npm install create-react-app
npm install react-calendar

curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py
rm get-pip.py
pip3 install --upgrade pip3 requests bs4 flask flask_cors