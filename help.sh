sudo certbot certonly --standalone \
  -d redbasketapp.hopto.org \
  --email redbasketapp@gmail.com \
  --agree-tos \
  --non-interactive


sudo certbot certonly --standalone --dry-run \
  -d redbasketapp.com \
  -d www.redbasketapp.com \
  -d admin.redbasketapp.com \
  --email redbasketapp.com \
  --agree-tos \
  --non-interactive