sudo yum update -y

echo "Installing MySQL Client"

# sudo amazon-linux-extras enable nginx1
# sudo yum install -y go mariadb-server nginx
# sudo systemctl start mariadb
# sudo systemctl enable mariadb
sudo yum install -y mysql
echo "$(mysql --version) is the version of mysql"

echo "Installing nodejs"
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
echo "$(npm --version) is the version of npm"

echo "Installing unzip"
sudo yum makecache
sudo yum install zip
sudo yum install unzip -y


echo "unzip file"
mkdir -p ~/code
unzip /tmp/webapp.zip -d ~/code

echo "install npm packages"
cd ~/code
rm package-lock.json
npm install

echo "auto run"
# sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
# sudo systemctl enable nginx
# sudo systemctl start nginx
# sudo systemctl daemon-reload
# sudo systemctl enable webapp.service
# sudo systemctl start webapp.service

echo "install and configure cloudwatch"
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm

sudo cp cloudwatch_agent.json /opt

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/cloudwatch-config.json \
    -s
