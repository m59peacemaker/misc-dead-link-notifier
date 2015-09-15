image     = dead-link-notifier
container = ${image}
crawlUrl  = http://abolishhumanabortion.com
sendTo    = bro@a.com
emailHost = smtp.a.com
emailPort = 587
emailUser = ${sendTo} # probably the same
emailPw   = Y0urPassw0rd

build:
	@docker build -t ${image} .

run = docker run ${1}        \
  --name ${container}        \
  -e CRAWL_URL=${crawlUrl}   \
  -e SEND_TO=${sendTo}       \
  -e EMAIL_HOST=${emailHost} \
  -e EMAIL_PORT=${emailPort} \
  -e EMAIL_USER=${emailUser} \
  -e EMAIL_PW=${emailPw}     \
  ${image}

run: clean
	@$(call run,-d)

run-loud: clean
	@$(call run,-it)

clean:
	@docker rm ${container}
