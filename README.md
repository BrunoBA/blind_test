# blind_test


To run the project exec:

```
docker-compose down -v && docker-compose up --build -d && docker exec -it frontend_container /bin/sh
```

To run vue-cli
````
npm run serve
````

# Nginx config

````
server {
        listen 80;
        listen [::]:80;

        root /var/www/blindtestapi.com/dist;
        index index.html index.htm index.nginx-debian.html;

        server_name blindtestapi.com www.blindtestapi.com;

        #location / {
	#	error_log /var/log/nginx/blindtestapi.com.log debug;
        #        try_files $uri $uri/ =404;
        #}

	location / {
		 try_files $uri $uri/ @rewrites;
	}

	location @rewrites {
		rewrite ^(.+)$ /index.html last;
	}

	location ~* \.(?:ico|css|js|gif|jpe?g|png)$ {
		# Some basic cache-control for static files to be sent to the browser
		expires max;
		add_header Pragma public;
		add_header Cache-Control "public, must-revalidate, proxy-revalidate";
	}

}
````
