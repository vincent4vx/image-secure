# Image Secure - A Javascript project 

In the client side web developement class (at the Aix-en-Provence IUT) we had to create a website using jQuery and its mobile
version with jQuery Mobile.

## How to set up this website on my own web server ?
It's quiet simple (if you're on Windows [download cmder](http://gooseberrycreative.com/cmder/) to follow these steps)

- Clone this project 
```
git clone https://github.com/thomasmunoz13/image-secure
```
- Then install or download composer (more info [here](https://getcomposer.org/doc/00-intro.md)).
- Install the [SFramework](https://github.com/thomasmunoz13/SFramework) dependencies (it's just twig don't be afraid) 
```
cd image-secure
[php composer.phar] install // this part may change depending of your installation
```
- And the last commands : 
```
cd image-secure 
mkdir content
chmod 777 content/
cd mobile/
ln -s ../content .
```

- Enjoy !

***Note*** : *if you're using nginx you have to use this config*
```nginx
autoindex off;
location / {
  rewrite ^(.*)$ /index.php/$1 break;
}
```
